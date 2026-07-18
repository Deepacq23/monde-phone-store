import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import type { ProductWithCategory } from "@/lib/types";
import { ProductsTable } from "./ProductsTable";

export const metadata: Metadata = {
  title: "Products",
  robots: { index: false, follow: false },
};

export default async function AdminProductsPage() {
  if (!hasSupabaseEnv()) {
    return <p className="text-sm text-muted">Supabase not configured.</p>;
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, category:categories(*)")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to load products: ${error.message}`);
  }

  const products = (data ?? []) as unknown as ProductWithCategory[];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">
            Products
          </h1>
          <p className="mt-1 text-sm text-muted">
            {products.length} product{products.length === 1 ? "" : "s"}
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center justify-center rounded-full bg-accent px-4 py-2.5 text-sm font-semibold text-background transition hover:bg-accent-hover"
        >
          + New Product
        </Link>
      </div>

      <ProductsTable products={products} />
    </div>
  );
}
