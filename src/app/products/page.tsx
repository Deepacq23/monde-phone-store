import type { Metadata } from "next";
import { CategoryFilterTabs } from "@/components/CategoryFilterTabs";
import { SearchBox } from "@/components/SearchBox";
import { ProductCard } from "@/components/ProductCard";
import { EmptyState } from "@/components/EmptyState";
import { getCategories, getProducts } from "@/lib/data";

export const metadata: Metadata = {
  title: "All Products",
  description:
    "Browse phones, laptops, PlayStation, JBL speakers, and ring lights available at Monde Phone Store.",
};

type ProductsPageProps = {
  searchParams: { category?: string; search?: string };
};

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const categorySlug = searchParams.category;
  const search = searchParams.search;

  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts({ categorySlug, search }),
  ]);

  const activeCategory = categories.find((c) => c.slug === categorySlug);

  return (
    <div className="mx-auto max-w-8xl px-5 py-12 sm:px-8 sm:py-16">
      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          Shop
        </p>
        <h1 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
          {activeCategory ? activeCategory.name : "All Products"}
        </h1>
      </div>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <CategoryFilterTabs
          categories={categories}
          activeSlug={categorySlug}
          search={search}
        />
        <SearchBox defaultValue={search} category={categorySlug} />
      </div>

      <div className="mt-10">
        {products.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No Products Found"
            description="Try a different search term or choose another category."
          />
        )}
      </div>
    </div>
  );
}
