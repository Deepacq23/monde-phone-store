export function SearchBox({
  defaultValue,
  category,
}: {
  defaultValue?: string;
  category?: string;
}) {
  return (
    <form action="/products" method="GET" className="relative w-full sm:max-w-xs">
      {category && <input type="hidden" name="category" value={category} />}
      <input
        type="text"
        name="search"
        defaultValue={defaultValue}
        placeholder="Search products..."
        aria-label="Search products"
        className="w-full rounded-full border border-border bg-surface px-4 py-2.5 pr-11 text-sm text-foreground placeholder:text-muted focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/40"
      />
      <button
        type="submit"
        aria-label="Search"
        className="absolute right-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-muted transition hover:text-accent"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" strokeLinecap="round" />
        </svg>
      </button>
    </form>
  );
}
