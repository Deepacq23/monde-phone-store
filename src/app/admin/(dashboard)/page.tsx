import type { Metadata } from "next";
import Link from "next/link";
import { StatCard } from "@/components/admin/StatCard";
import { getAdminOverviewStats } from "@/lib/admin/stats";

export const metadata: Metadata = {
  title: "Overview",
  robots: { index: false, follow: false },
};

export default async function AdminOverviewPage() {
  const stats = await getAdminOverviewStats();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">
          Overview
        </h1>
        <p className="mt-1 text-sm text-muted">A quick look at your store.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <StatCard label="Total Products" value={stats.totalProducts} />
        <StatCard
          label="WhatsApp Clicks (7 days)"
          value={stats.clicksThisWeek}
        />
        <StatCard label="Categories" value={stats.productsPerCategory.length} />
      </div>

      <section className="rounded-2xl border border-border bg-surface p-5">
        <h2 className="font-heading text-base font-semibold text-foreground">
          Products per Category
        </h2>
        {stats.productsPerCategory.length > 0 ? (
          <ul className="mt-4 flex flex-col gap-3">
            {stats.productsPerCategory.map(({ category, count }) => (
              <li
                key={category.id}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-foreground">{category.name}</span>
                <span className="font-semibold text-accent">{count}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-muted">No categories yet.</p>
        )}
      </section>

      <section className="rounded-2xl border border-border bg-surface p-5">
        <h2 className="font-heading text-base font-semibold text-foreground">
          Top 5 Most-Clicked Products
        </h2>
        {stats.topClickedProducts.length > 0 ? (
          <ul className="mt-4 flex flex-col gap-3">
            {stats.topClickedProducts.map((product, i) => (
              <li
                key={product.productId}
                className="flex items-center justify-between gap-3 text-sm"
              >
                <span className="flex min-w-0 items-center gap-3 text-foreground">
                  <span className="text-muted">{i + 1}.</span>
                  <Link
                    href={`/products/${product.slug}`}
                    target="_blank"
                    className="truncate hover:text-accent"
                  >
                    {product.name}
                  </Link>
                </span>
                <span className="flex-shrink-0 font-semibold text-accent">
                  {product.clicks}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-muted">
            No WhatsApp clicks recorded yet.
          </p>
        )}
      </section>
    </div>
  );
}
