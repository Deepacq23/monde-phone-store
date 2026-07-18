export default function LoadingAdminSegment() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <div className="h-7 w-40 animate-pulse rounded bg-surface-light" />
          <div className="h-4 w-24 animate-pulse rounded bg-surface-light" />
        </div>
        <div className="h-9 w-32 animate-pulse rounded-full bg-surface-light" />
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-20 animate-pulse rounded-2xl border border-border bg-surface-light"
          />
        ))}
      </div>

      <div className="h-64 animate-pulse rounded-2xl border border-border bg-surface-light" />
    </div>
  );
}
