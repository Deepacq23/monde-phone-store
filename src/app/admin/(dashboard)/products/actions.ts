"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin/auth";
import { generateUniqueProductSlug } from "@/lib/admin/slug";
import type { ProductCondition } from "@/lib/types";

export type ProductInput = {
  name: string;
  description: string;
  price_tzs: number;
  category_id: string;
  condition: ProductCondition;
  in_stock: boolean;
  featured: boolean;
  image_urls: string[];
};

function revalidateStorefront(slug?: string | null) {
  revalidatePath("/admin/products");
  revalidatePath("/admin");
  revalidatePath("/products");
  revalidatePath("/");
  if (slug) revalidatePath(`/products/${slug}`);
}

export async function createProduct(
  input: ProductInput
): Promise<{ error?: string }> {
  await requireAdmin();
  const supabase = createClient();

  const slug = await generateUniqueProductSlug(supabase, input.name);

  const { error } = await supabase.from("products").insert({ ...input, slug });

  if (error) {
    console.error("createProduct:", error);
    return { error: "Failed to create product." };
  }

  revalidateStorefront(slug);
  return {};
}

export async function updateProduct(
  id: string,
  input: ProductInput
): Promise<{ error?: string }> {
  await requireAdmin();
  const supabase = createClient();

  // The slug is intentionally never regenerated on edit — it's already been
  // shared in WhatsApp messages and product links, so renaming a product
  // must not silently break those.
  const { data: existing } = await supabase
    .from("products")
    .select("slug")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase.from("products").update(input).eq("id", id);

  if (error) {
    console.error("updateProduct:", error);
    return { error: "Failed to update product." };
  }

  revalidateStorefront(existing?.slug);
  return {};
}

export async function deleteProduct(id: string): Promise<{ error?: string }> {
  await requireAdmin();
  const supabase = createClient();

  const { data: existing } = await supabase
    .from("products")
    .select("slug")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) {
    console.error("deleteProduct:", error);
    return { error: "Failed to delete product." };
  }

  revalidateStorefront(existing?.slug);
  return {};
}
