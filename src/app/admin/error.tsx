"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Admin error boundary:", error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-4 px-5 text-center">
      <p className="font-heading text-lg font-semibold text-foreground">
        Something Went Wrong
      </p>
      <p className="text-sm text-muted">
        The admin dashboard hit an unexpected error. Try again, or head back
        to the overview.
      </p>
      <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center justify-center rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-background transition hover:bg-accent-hover"
        >
          Try Again
        </button>
        <Link
          href="/admin"
          className="inline-flex items-center justify-center rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-foreground transition hover:border-accent/40 hover:text-accent"
        >
          Back to Overview
        </Link>
      </div>
    </div>
  );
}
