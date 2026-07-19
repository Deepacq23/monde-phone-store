import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/lib/types";

/**
 * Image-backed category card. If the admin hasn't set a cover image yet,
 * falls back to a branded gradient so the grid never looks broken.
 */
export function CategoryCard({
  category,
  productCount,
}: {
  category: Category;
  productCount?: number;
}) {
  return (
    <Link
      href={`/products?category=${category.slug}`}
      className="group relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-2xl border border-border bg-surface transition duration-300 hover:-translate-y-1 hover:border-accent/50 hover:shadow-xl hover:shadow-accent/10"
    >
      {category.image_url ? (
        <Image
          src={category.image_url}
          alt={category.name}
          fill
          sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-surface to-background" />
      )}

      {/* Legibility gradient over the image */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/40 to-transparent" />

      <div className="relative p-4 sm:p-5">
        <p className="font-heading text-base font-semibold text-foreground transition group-hover:text-accent sm:text-lg">
          {category.name}
        </p>
        {typeof productCount === "number" && productCount > 0 && (
          <p className="mt-0.5 text-xs text-muted">
            {productCount} product{productCount === 1 ? "" : "s"}
          </p>
        )}
        <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-accent opacity-0 transition group-hover:opacity-100">
          Shop now →
        </span>
      </div>
    </Link>
  );
}
