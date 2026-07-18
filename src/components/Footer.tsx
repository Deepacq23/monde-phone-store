import Link from "next/link";
import {
  CONTACT_EMAIL,
  SITE_NAME,
  STORE_LOCATION,
  WHATSAPP_PHONE_DISPLAY,
} from "@/lib/constants";
import { buildGeneralWhatsAppUrl } from "@/lib/whatsapp";

export function Footer() {
  const chatUrl = buildGeneralWhatsAppUrl(
    "Habari Monde Phone Store, ninahitaji msaada kuhusu bidhaa zenu."
  );
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface/60">
      <div className="mx-auto max-w-8xl px-5 py-14 sm:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
          <div>
            <p className="font-heading text-lg font-bold text-foreground">
              {SITE_NAME}
            </p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
              Genuine iPhones, Android, laptops, PlayStation na JBL speakers —
              real prices, reliable service.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-accent">
              Contact
            </p>
            <ul className="mt-4 space-y-2.5 text-sm text-muted">
              <li>{STORE_LOCATION.full}</li>
              <li>
                <a
                  href={chatUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition hover:text-accent"
                >
                  {WHATSAPP_PHONE_DISPLAY}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="transition hover:text-accent"
                >
                  {CONTACT_EMAIL}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-accent">
              Shop
            </p>
            <ul className="mt-4 space-y-2.5 text-sm text-muted">
              <li>
                <Link href="/" className="transition hover:text-accent">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="transition hover:text-accent">
                  All Products
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-6 text-xs text-muted">
          © {year} {SITE_NAME}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
