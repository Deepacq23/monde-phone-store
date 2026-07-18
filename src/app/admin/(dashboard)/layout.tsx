import Link from "next/link";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import { signOutAction } from "@/lib/admin/auth-actions";
import { AdminNav } from "./AdminNav";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!hasSupabaseEnv()) {
    return (
      <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-5 text-center">
        <p className="font-heading text-lg font-semibold text-foreground">
          Supabase not configured
        </p>
        <p className="mt-2 text-sm text-muted">
          Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in
          .env.local to enable the admin dashboard.
        </p>
      </div>
    );
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Middleware already enforces auth + the admin allowlist for every
  // /admin route; this is only for displaying the signed-in email.
  const email = user?.email ?? "";

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-8xl flex-col gap-3 px-5 py-4 sm:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link href="/admin" className="flex items-baseline gap-1.5">
              <span className="font-heading text-base font-bold text-foreground">
                Monde
              </span>
              <span className="font-heading text-base font-bold text-accent">
                Admin
              </span>
            </Link>
            <div className="flex items-center gap-3">
              <span className="max-w-[160px] truncate text-xs text-muted sm:max-w-none sm:text-sm">
                {email}
              </span>
              <form action={signOutAction}>
                <button
                  type="submit"
                  className="whitespace-nowrap rounded-full border border-border px-3.5 py-1.5 text-xs font-semibold text-foreground transition hover:border-accent/40 hover:text-accent"
                >
                  Logout
                </button>
              </form>
            </div>
          </div>
          <AdminNav />
        </div>
      </header>
      <main className="mx-auto max-w-8xl px-5 py-8 sm:px-8">{children}</main>
    </div>
  );
}
