import { createClient } from "@/lib/supabase/server";
import type { Category } from "@/lib/types";

export type CategoryProductCount = {
  category: Category;
  count: number;
};

export type TopClickedProduct = {
  productId: string;
  name: string;
  slug: string;
  clicks: number;
};

export type AdminOverviewStats = {
  totalProducts: number;
  productsPerCategory: CategoryProductCount[];
  clicksThisWeek: number;
  topClickedProducts: TopClickedProduct[];
};

// Cap on how many recent clicks we scan to build the "top clicked" list —
// keeps the query bounded without needing a dedicated aggregate/RPC for a
// single small shop's click volume.
const RECENT_CLICKS_SCAN_LIMIT = 2000;

export async function getAdminOverviewStats(): Promise<AdminOverviewStats> {
  const supabase = createClient();

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const [
    { count: totalProducts },
    { data: categories },
    { data: products },
    { count: clicksThisWeek },
    { data: recentClicks },
  ] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("categories").select("*").order("name"),
    supabase.from("products").select("id, category_id"),
    supabase
      .from("clicks")
      .select("*", { count: "exact", head: true })
      .gte("clicked_at", weekAgo.toISOString()),
    supabase
      .from("clicks")
      .select("product_id, products(name, slug)")
      .order("clicked_at", { ascending: false })
      .limit(RECENT_CLICKS_SCAN_LIMIT),
  ]);

  const productsPerCategory: CategoryProductCount[] = (categories ?? []).map(
    (category) => ({
      category,
      count: (products ?? []).filter((p) => p.category_id === category.id)
        .length,
    })
  );

  const clickCounts = new Map<
    string,
    { name: string; slug: string; clicks: number }
  >();

  for (const click of (recentClicks ?? []) as unknown as {
    product_id: string | null;
    products: { name: string; slug: string } | null;
  }[]) {
    if (!click.product_id || !click.products) continue;
    const existing = clickCounts.get(click.product_id);
    if (existing) {
      existing.clicks += 1;
    } else {
      clickCounts.set(click.product_id, {
        name: click.products.name,
        slug: click.products.slug,
        clicks: 1,
      });
    }
  }

  const topClickedProducts: TopClickedProduct[] = Array.from(
    clickCounts.entries()
  )
    .map(([productId, v]) => ({ productId, ...v }))
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 5);

  return {
    totalProducts: totalProducts ?? 0,
    productsPerCategory,
    clicksThisWeek: clicksThisWeek ?? 0,
    topClickedProducts,
  };
}
