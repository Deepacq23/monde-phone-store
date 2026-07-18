"use client";

import { buildWhatsAppUrl } from "@/lib/whatsapp";
import type { Product } from "@/lib/types";

function logClick(productId: string) {
  try {
    const payload = JSON.stringify({ product_id: productId });
    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      navigator.sendBeacon(
        "/api/track-click",
        new Blob([payload], { type: "application/json" })
      );
    } else {
      fetch("/api/track-click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        keepalive: true,
      }).catch(() => {});
    }
  } catch {
    // Click tracking must never block or break the WhatsApp redirect.
  }
}

export function WhatsAppCTAButtons({ product }: { product: Product }) {
  const orderUrl = buildWhatsAppUrl(product, "order");
  const installmentUrl = buildWhatsAppUrl(product, "installment");

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <a
        href={orderUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => logClick(product.id)}
        className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-accent px-6 py-4 text-base font-semibold text-background transition hover:bg-accent-hover active:scale-[0.98]"
      >
        {product.in_stock ? "Agiza kwa WhatsApp" : "Uliza Upatikanaji — WhatsApp"}
      </a>
      <a
        href={installmentUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => logClick(product.id)}
        className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-accent/40 px-6 py-4 text-base font-semibold text-accent transition hover:bg-accent/10 active:scale-[0.98]"
      >
        Lipa kwa Mkopo — Uliza
      </a>
    </div>
  );
}
