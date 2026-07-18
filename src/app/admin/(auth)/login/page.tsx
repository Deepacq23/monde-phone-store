import type { Metadata } from "next";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  if (!hasSupabaseEnv()) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-6 text-center">
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

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h1 className="font-heading text-xl font-bold text-foreground">
          Admin Login
        </h1>
        <p className="mt-1 text-sm text-muted">
          Sign in to manage products and categories.
        </p>
      </div>
      <LoginForm />
    </div>
  );
}
