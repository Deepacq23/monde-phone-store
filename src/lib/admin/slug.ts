import type { SupabaseClient } from "@supabase/supabase-js";

const COMBINING_DIACRITICS = new RegExp("[\\u0300-\\u036f]", "g");

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(COMBINING_DIACRITICS, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function generateUniqueSlug(
  supabase: SupabaseClient,
  table: "products" | "categories",
  name: string,
  options?: { excludeId?: string; fallback?: string }
): Promise<string> {
  const base = slugify(name) || options?.fallback || "item";
  let candidate = base;
  let suffix = 2;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    let query = supabase.from(table).select("id").eq("slug", candidate);
    if (options?.excludeId) query = query.neq("id", options.excludeId);
    const { data } = await query.maybeSingle();
    if (!data) return candidate;
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }
}

export function generateUniqueProductSlug(
  supabase: SupabaseClient,
  name: string,
  excludeId?: string
): Promise<string> {
  return generateUniqueSlug(supabase, "products", name, {
    excludeId,
    fallback: "product",
  });
}

export function generateUniqueCategorySlug(
  supabase: SupabaseClient,
  name: string,
  excludeId?: string
): Promise<string> {
  return generateUniqueSlug(supabase, "categories", name, {
    excludeId,
    fallback: "category",
  });
}
