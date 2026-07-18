import { ProductGridSkeleton } from "@/components/Skeletons";

export default function LoadingHome() {
  return (
    <>
      <section className="mx-auto max-w-8xl px-5 pb-16 pt-14 sm:px-8 sm:pt-20 lg:pb-24 lg:pt-28">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="max-w-xl">
            <div className="h-3 w-40 animate-pulse rounded bg-surface-light" />
            <div className="mt-4 h-12 w-full animate-pulse rounded bg-surface-light" />
            <div className="mt-3 h-12 w-3/4 animate-pulse rounded bg-surface-light" />
            <div className="mt-6 h-16 w-full animate-pulse rounded bg-surface-light" />
            <div className="mt-9 flex gap-3">
              <div className="h-14 w-40 animate-pulse rounded-full bg-surface-light" />
              <div className="h-14 w-40 animate-pulse rounded-full bg-surface-light" />
            </div>
          </div>
          <div className="mx-auto aspect-square w-full max-w-md animate-pulse rounded-[2rem] bg-surface-light" />
        </div>
      </section>

      <div className="border-y border-border bg-surface/40">
        <div className="mx-auto grid max-w-8xl grid-cols-2 gap-px sm:grid-cols-4 sm:px-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-2 px-4 py-6"
            >
              <div className="h-4 w-16 animate-pulse rounded bg-surface-light" />
              <div className="h-3 w-20 animate-pulse rounded bg-surface-light" />
            </div>
          ))}
        </div>
      </div>

      <section className="mx-auto max-w-8xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="h-3 w-20 animate-pulse rounded bg-surface-light" />
        <div className="mt-3 h-8 w-56 animate-pulse rounded bg-surface-light" />
        <div className="mt-10">
          <ProductGridSkeleton count={4} />
        </div>
      </section>
    </>
  );
}
