import { createClient } from "@/lib/supabase/client";

export const PRODUCT_IMAGES_BUCKET = "product-images";

export async function uploadProductImage(file: File): Promise<string> {
  const supabase = createClient();
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage
    .from(PRODUCT_IMAGES_BUCKET)
    .upload(path, file, { cacheControl: "3600", upsert: false });

  if (error) throw error;

  const {
    data: { publicUrl },
  } = supabase.storage.from(PRODUCT_IMAGES_BUCKET).getPublicUrl(path);

  return publicUrl;
}

/**
 * Best-effort delete. Derives the storage path from the public URL instead
 * of tracking it separately, since `products.image_urls` only stores URLs.
 */
export async function deleteProductImageByUrl(url: string): Promise<void> {
  const marker = `/object/public/${PRODUCT_IMAGES_BUCKET}/`;
  const index = url.indexOf(marker);
  if (index === -1) return;

  const path = decodeURIComponent(url.slice(index + marker.length));
  const supabase = createClient();
  await supabase.storage.from(PRODUCT_IMAGES_BUCKET).remove([path]);
}
