import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Anonymous, cookie-free Supabase client for public storefront reads
 * (categories/products, governed by the "public read" RLS policies in
 * schema.sql). Deliberately separate from supabase/server.ts's cookie-based
 * client: calling cookies() there forces every page that touches it into
 * per-request dynamic rendering, which defeats static generation for the
 * public storefront and — worse — makes `next build`'s static-generation
 * pass throw a DYNAMIC_SERVER_USAGE error that gets misread as a real
 * Supabase failure, silently baking seed data into prerendered pages instead
 * of the real catalog. Public reads need no session, so they don't need
 * cookies at all.
 */
export function createClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
