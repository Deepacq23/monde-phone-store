import Link from "next/link";
import type { Category } from "@/lib/types";

export function CategoryFilterTabs({
  categories,
  activeSlug,
  search,
}: {
  categories: Category[];
  activeSlug?: string;
  search?: string;
}) {
  function hrefFor(slug?: string) {
    const params = new URLSearchParams();
    if (slug) params.set("category", slug);
    if (search) params.set("search", search);
    const query = params.toString();
    return query ? `/products?${query}` : "/products";
  }

  const tabClass = (isActive: boolean) =>
    `whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition ${
      isActive
        ? "border-accent bg-accent text-background"
        : "border-border text-muted hover:border-accent/40 hover:text-foreground"
    }`;

  return (
    <div className="scrollbar-thin flex gap-2 overflow-x-auto pb-2">
      <Link href={hrefFor(undefined)} className={tabClass(!activeSlug)}>
        All
      </Link>
      {categories.map((category) => (
        <Link
          key={category.id}
          href={hrefFor(category.slug)}
          className={tabClass(activeSlug === category.slug)}
        >
          {category.name}
        </Link>
      ))}
    </div>
  );
}
