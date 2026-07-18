import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export function isAllowedAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;

  const allowed = (process.env.ALLOWED_ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  return allowed.includes(email.toLowerCase());
}

/**
 * Defense-in-depth check for Server Components/Actions under /admin.
 * Middleware already blocks unauthenticated/unauthorized requests, but
 * mutations (create/update/delete) re-check here in case a Server Action is
 * ever invoked directly (e.g. React cache/back-forward) without a fresh
 * middleware pass.
 */
export async function requireAdmin() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAllowedAdminEmail(user.email)) {
    redirect("/admin/login");
  }

  return user;
}
