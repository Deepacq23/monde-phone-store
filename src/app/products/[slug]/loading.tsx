import { ProductDetailSkeleton } from "@/components/Skeletons";

export default function LoadingProduct() {
  return (
    <div className="mx-auto max-w-8xl px-5 py-12 sm:px-8 sm:py-16">
      <ProductDetailSkeleton />
    </div>
  );
}
