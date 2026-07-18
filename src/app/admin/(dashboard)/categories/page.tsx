import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import type { Category } from "@/lib/types";
import { CategoriesManager } from "./CategoriesManager";

export const metadata: Metadata = {
  title: "Categories",
  robots: { index: false, follow: false },
};

export default async function AdminCategoriesPage() {
  if (!hasSupabaseEnv()) {
    return <p className="text-sm text-muted">Supabase not configured.</p>;
  }

  const supabase = createClient();
  const [
    { data: categoriesData, error: categoriesError },
    { data: products, error: productsError },
  ] = await Promise.all([
    supabase.from("categories").select("*").order("name"),
    supabase.from("products").select("id, category_id"),
  ]);

  if (categoriesError || productsError) {
    const message = (categoriesError ?? productsError)?.message;
    throw new Error(`Failed to load categories: ${message}`);
  }

  const categories = (categoriesData ?? []) as Category[];
  const categoriesWithCounts = categories.map((category) => ({
    ...category,
    productCount: (products ?? []).filter(
      (p) => p.category_id === category.id
    ).length,
  }));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">
          Categories
        </h1>
        <p className="mt-1 text-sm text-muted">
          {categories.length} categor{categories.length === 1 ? "y" : "ies"}
        </p>
      </div>

      <CategoriesManager categories={categoriesWithCounts} />
    </div>
  );
}
