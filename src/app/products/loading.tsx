import { ProductGridSkeleton } from "@/components/Skeletons";

export default function LoadingProducts() {
  return (
    <div className="mx-auto max-w-8xl px-5 py-12 sm:px-8 sm:py-16">
      <div className="h-3 w-24 animate-pulse rounded bg-surface-light" />
      <div className="mt-3 h-9 w-48 animate-pulse rounded bg-surface-light" />
      <div className="mt-10">
        <ProductGridSkeleton />
      </div>
    </div>
  );
}
