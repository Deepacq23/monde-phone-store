import Link from "next/link";

export default function ProductNotFound() {
  return (
    <div className="mx-auto flex max-w-8xl flex-col items-center gap-4 px-5 py-24 text-center sm:px-8">
      <p className="font-heading text-2xl font-bold text-foreground">
        Product Not Found
      </p>
      <p className="max-w-sm text-sm text-muted">
        This product may have been removed or is out of stock. Browse our
        other products.
      </p>
      <Link
        href="/products"
        className="mt-2 inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-semibold text-background transition hover:bg-accent-hover"
      >
        Browse All Products
      </Link>
    </div>
  );
}
