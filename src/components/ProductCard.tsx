import Image from "next/image";
import Link from "next/link";
import { ConditionBadge } from "@/components/ConditionBadge";
import { formatTZS } from "@/lib/format";
import type { ProductWithCategory } from "@/lib/types";

export function ProductCard({
  product,
  showDealBadge = false,
}: {
  product: ProductWithCategory;
  showDealBadge?: boolean;
}) {
  const image = product.image_urls[0];

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface transition duration-300 hover:-translate-y-1 hover:border-accent/40"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-[#0F0F10]">
        {image ? (
          <Image
            src={image}
            alt={product.name}
            fill
            unoptimized={image.endsWith(".svg")}
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted">
            No Image
          </div>
        )}
        <div className="absolute left-3 top-3">
          <ConditionBadge condition={product.condition} />
        </div>
        {showDealBadge && (
          <div className="absolute right-3 top-3">
            <span className="inline-flex items-center rounded-full border border-accent/30 bg-background/70 px-2.5 py-1 text-[11px] font-semibold text-accent">
              Deal ya Wiki
            </span>
          </div>
        )}
        {!product.in_stock && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/70">
            <span className="rounded-full border border-border bg-surface px-3 py-1 text-xs font-semibold text-muted">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 p-4">
        {product.category && (
          <span className="text-xs font-medium uppercase tracking-wide text-muted">
            {product.category.name}
          </span>
        )}
        <h3 className="line-clamp-2 font-heading text-sm font-semibold text-foreground sm:text-base">
          {product.name}
        </h3>
        <p className="mt-auto pt-2 font-heading text-base font-bold text-accent sm:text-lg">
          {formatTZS(product.price_tzs)}
        </p>
      </div>
    </Link>
  );
}
