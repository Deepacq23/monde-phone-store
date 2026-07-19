import Link from "next/link";
import { SITE_NAME } from "@/lib/constants";
import { buildGeneralWhatsAppUrl } from "@/lib/whatsapp";

export function Header() {
  const chatUrl = buildGeneralWhatsAppUrl(
    "Habari Monde Phone Store, ninahitaji msaada kuhusu bidhaa zenu."
  );

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-8xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <Link href="/" className="flex items-baseline gap-1.5">
          <span className="font-heading text-lg font-bold tracking-tight text-foreground sm:text-xl">
            Monde
          </span>
          <span className="font-heading text-lg font-bold tracking-tight text-accent sm:text-xl">
            Phone Store
          </span>
        </Link>

        <nav className="flex items-center gap-4 sm:gap-8">
          <Link
            href="/"
            className="text-sm font-medium text-muted transition hover:text-foreground"
          >
            Home
          </Link>
          <Link
            href="/products"
            className="text-sm font-medium text-muted transition hover:text-foreground"
          >
            <span className="sm:hidden">Products</span>
            <span className="hidden sm:inline">All Products</span>
          </Link>
        </nav>

        <a
          href={chatUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-background transition hover:bg-accent-hover"
        >
          <span className="hidden sm:inline">Agiza kwa WhatsApp</span>
          <span className="sm:hidden">WhatsApp</span>
        </a>
      </div>
    </header>
  );
}
