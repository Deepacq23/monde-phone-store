import { SITE_URL, WHATSAPP_PHONE } from "@/lib/constants";
import { formatTZS } from "@/lib/format";
import type { Product } from "@/lib/types";

type WhatsAppIntent = "order" | "installment";

function productUrl(product: Product): string {
  return `${SITE_URL}/products/${product.slug}`;
}

export function buildWhatsAppMessage(
  product: Product,
  intent: WhatsAppIntent = "order"
): string {
  const price = formatTZS(product.price_tzs);
  const url = productUrl(product);

  if (intent === "installment") {
    return `Habari Monde Phone Store, ninapenda kuuliza kuhusu ${product.name} (${price}) kwa mpango wa malipo ya awamu (Lipa kwa Mkopo). ${url}`;
  }

  return `Habari Monde Phone Store, ninapenda kuagiza ${product.name} - ${price}. ${url}`;
}

export function buildWhatsAppUrl(
  product: Product,
  intent: WhatsAppIntent = "order"
): string {
  const message = buildWhatsAppMessage(product, intent);
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
}

export function buildGeneralWhatsAppUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
}
