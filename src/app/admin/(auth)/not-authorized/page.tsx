import type { Metadata } from "next";
import { signOutAction } from "@/lib/admin/auth-actions";

export const metadata: Metadata = {
  title: "Not Authorized",
  robots: { index: false, follow: false },
};

export default function NotAuthorizedPage() {
  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-surface p-8 text-center">
      <h1 className="font-heading text-xl font-bold text-foreground">
        Not Authorized
      </h1>
      <p className="max-w-xs text-sm text-muted">
        This account doesn&apos;t have access to the Monde Phone Store admin
        dashboard. Contact the store owner if you believe this is a mistake.
      </p>
      <form action={signOutAction}>
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-full border border-border px-4 py-2.5 text-sm font-semibold text-foreground transition hover:border-accent/40 hover:text-accent"
        >
          Sign Out
        </button>
      </form>
    </div>
  );
}
