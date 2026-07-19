"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin/auth";
import { generateUniqueCategorySlug } from "@/lib/admin/slug";

function revalidateStorefront() {
  revalidatePath("/admin/categories");
  revalidatePath("/admin");
  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidatePath("/");
}

export async function createCategory(name: string): Promise<{ error?: string }> {
  await requireAdmin();

  const trimmed = name.trim();
  if (!trimmed) {
    return { error: "Category name is required." };
  }

  const supabase = createClient();
  const slug = await generateUniqueCategorySlug(supabase, trimmed);

  const { error } = await supabase
    .from("categories")
    .insert({ name: trimmed, slug });

  if (error) {
    console.error("createCategory:", error);
    return { error: "Failed to create category." };
  }

  revalidateStorefront();
  return {};
}

export async function renameCategory(
  id: string,
  name: string
): Promise<{ error?: string }> {
  await requireAdmin();

  const trimmed = name.trim();
  if (!trimmed) {
    return { error: "Category name is required." };
  }

  const supabase = createClient();

  // Slug is intentionally left untouched — it's baked into /products?category=
  // links already shared or bookmarked, and renaming shouldn't break those.
  const { error } = await supabase
    .from("categories")
    .update({ name: trimmed })
    .eq("id", id);

  if (error) {
    console.error("renameCategory:", error);
    return { error: "Failed to rename category." };
  }

  revalidateStorefront();
  return {};
}

export async function deleteCategory(id: string): Promise<{ error?: string }> {
  await requireAdmin();
  const supabase = createClient();

  const { count } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })
    .eq("category_id", id);

  if ((count ?? 0) > 0) {
    return {
      error:
        "Can't delete a category that still has products. Move or delete those products first.",
    };
  }

  const { error } = await supabase.from("categories").delete().eq("id", id);

  if (error) {
    console.error("deleteCategory:", error);
    return { error: "Failed to delete category." };
  }

  revalidateStorefront();
  return {};
}

export async function setCategoryImage(
  id: string,
  imageUrl: string | null
): Promise<{ error?: string }> {
  await requireAdmin();

  const supabase = createClient();
  const { error } = await supabase
    .from("categories")
    .update({ image_url: imageUrl })
    .eq("id", id);

  if (error) {
    console.error("setCategoryImage:", error);
    return { error: "Failed to update category image." };
  }

  revalidateStorefront();
  return {};
}
