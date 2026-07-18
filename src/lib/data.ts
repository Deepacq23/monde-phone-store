import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/public";
import { SEED_CATEGORIES, SEED_PRODUCTS } from "@/lib/seed-data";
import type { Category, ProductWithCategory } from "@/lib/types";

type GetProductsOptions = {
  categorySlug?: string;
  search?: string;
  featuredOnly?: boolean;
  limit?: number;
};

function filterSeedProducts(options: GetProductsOptions): ProductWithCategory[] {
  const { categorySlug, search, featuredOnly, limit } = options;

  let results = SEED_PRODUCTS.filter((p) => p.in_stock);

  if (categorySlug) {
    results = results.filter((p) => p.category?.slug === categorySlug);
  }

  if (featuredOnly) {
    results = results.filter((p) => p.featured);
  }

  if (search) {
    const term = search.trim().toLowerCase();
    results = results.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term)
    );
  }

  results = [...results].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  if (limit) {
    results = results.slice(0, limit);
  }

  return results;
}

export async function getCategories(): Promise<Category[]> {
  if (hasSupabaseEnv()) {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");
      if (error) throw error;
      return (data ?? []) as Category[];
    } catch (err) {
      console.error("getCategories: falling back to seed data —", err);
      return SEED_CATEGORIES;
    }
  }
  return SEED_CATEGORIES;
}

export async function getProducts(
  options: GetProductsOptions = {}
): Promise<ProductWithCategory[]> {
  const { categorySlug, search, featuredOnly, limit } = options;

  if (hasSupabaseEnv()) {
    try {
      const supabase = createClient();
      let query = categorySlug
        ? supabase.from("products").select("*, category:categories!inner(*)")
        : supabase.from("products").select("*, category:categories(*)");

      query = query.eq("in_stock", true).order("created_at", { ascending: false });

      if (categorySlug) {
        query = query.eq("category.slug", categorySlug);
      }
      if (featuredOnly) {
        query = query.eq("featured", true);
      }
      if (search) {
        const term = search.trim();
        query = query.or(`name.ilike.%${term}%,description.ilike.%${term}%`);
      }
      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data ?? []) as unknown as ProductWithCategory[];
    } catch (err) {
      console.error("getProducts: falling back to seed data —", err);
      return filterSeedProducts(options);
    }
  }

  return filterSeedProducts(options);
}

export async function getFeaturedProducts(
  limit = 4
): Promise<ProductWithCategory[]> {
  return getProducts({ featuredOnly: true, limit });
}

export async function getProductBySlug(
  slug: string
): Promise<ProductWithCategory | null> {
  if (hasSupabaseEnv()) {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("products")
        .select("*, category:categories(*)")
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      return (data as unknown as ProductWithCategory) ?? null;
    } catch (err) {
      console.error("getProductBySlug: falling back to seed data —", err);
      return SEED_PRODUCTS.find((p) => p.slug === slug) ?? null;
    }
  }

  return SEED_PRODUCTS.find((p) => p.slug === slug) ?? null;
}

export async function getRelatedProducts(
  product: ProductWithCategory,
  limit = 4
): Promise<ProductWithCategory[]> {
  if (hasSupabaseEnv()) {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("products")
        .select("*, category:categories(*)")
        .eq("category_id", product.category_id)
        .eq("in_stock", true)
        .neq("id", product.id)
        .limit(limit);
      if (error) throw error;
      return (data ?? []) as unknown as ProductWithCategory[];
    } catch (err) {
      console.error("getRelatedProducts: falling back to seed data —", err);
    }
  }

  return SEED_PRODUCTS.filter(
    (p) => p.in_stock && p.category_id === product.category_id && p.id !== product.id
  ).slice(0, limit);
}

export async function getAllProductSlugs(): Promise<string[]> {
  if (hasSupabaseEnv()) {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from("products").select("slug");
      if (error) throw error;
      return (data ?? []).map((p) => p.slug as string);
    } catch (err) {
      console.error("getAllProductSlugs: falling back to seed data —", err);
      return SEED_PRODUCTS.map((p) => p.slug);
    }
  }
  return SEED_PRODUCTS.map((p) => p.slug);
}
