import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-8xl flex-col items-center gap-4 px-5 py-24 text-center sm:px-8">
      <p className="font-heading text-2xl font-bold text-foreground">
        Page Not Found
      </p>
      <p className="max-w-sm text-sm text-muted">
        The page you&rsquo;re looking for doesn&rsquo;t exist or may have
        moved.
      </p>
      <Link
        href="/"
        className="mt-2 inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-semibold text-background transition hover:bg-accent-hover"
      >
        Back to Home
      </Link>
    </div>
  );
}
