"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Storefront error boundary:", error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-8xl flex-col items-center gap-4 px-5 py-24 text-center sm:px-8">
      <p className="font-heading text-2xl font-bold text-foreground">
        Something Went Wrong
      </p>
      <p className="max-w-sm text-sm text-muted">
        We hit an unexpected error loading this page. Please try again, or
        head back to the homepage.
      </p>
      <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-semibold text-background transition hover:bg-accent-hover"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-full border border-border px-6 py-3 text-sm font-semibold text-foreground transition hover:border-accent/40 hover:text-accent"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
