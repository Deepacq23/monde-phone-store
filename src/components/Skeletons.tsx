export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="aspect-square w-full animate-pulse bg-surface-light" />
      <div className="flex flex-col gap-2 p-4">
        <div className="h-3 w-1/3 animate-pulse rounded bg-surface-light" />
        <div className="h-4 w-3/4 animate-pulse rounded bg-surface-light" />
        <div className="h-5 w-1/2 animate-pulse rounded bg-surface-light" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
      <div className="aspect-square w-full animate-pulse rounded-2xl bg-surface-light" />
      <div className="flex flex-col gap-4">
        <div className="h-4 w-1/4 animate-pulse rounded bg-surface-light" />
        <div className="h-8 w-3/4 animate-pulse rounded bg-surface-light" />
        <div className="h-7 w-1/3 animate-pulse rounded bg-surface-light" />
        <div className="h-24 w-full animate-pulse rounded bg-surface-light" />
        <div className="h-14 w-full animate-pulse rounded-full bg-surface-light" />
      </div>
    </div>
  );
}
