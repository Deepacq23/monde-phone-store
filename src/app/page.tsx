import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { SectionHeading } from "@/components/SectionHeading";
import { TrustBadges } from "@/components/TrustBadges";
import { EmptyState } from "@/components/EmptyState";
import { getCategories, getFeaturedProducts } from "@/lib/data";
import { HERO_SUBTITLE, SITE_TAGLINE } from "@/lib/constants";
import { buildGeneralWhatsAppUrl } from "@/lib/whatsapp";

export default async function HomePage() {
  const [categories, featuredProducts] = await Promise.all([
    getCategories(),
    getFeaturedProducts(4),
  ]);

  const chatUrl = buildGeneralWhatsAppUrl(
    "Habari Monde Phone Store, ninapenda kufahamu zaidi kuhusu bidhaa zenu."
  );

  const heroImages = featuredProducts.slice(0, 3).map((p) => p.image_urls[0]);

  return (
    <>
      {/* Hero */}
      <section className="mx-auto max-w-8xl px-5 pb-16 pt-14 sm:px-8 sm:pt-20 lg:pb-24 lg:pt-28">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">
              Kariakoo, Dar es Salaam
            </p>
            <h1 className="mt-4 font-heading text-4xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              {SITE_TAGLINE}
            </h1>
            <p className="mt-6 text-base leading-relaxed text-muted sm:text-lg">
              {HERO_SUBTITLE}
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/products"
                className="inline-flex items-center justify-center rounded-full bg-accent px-7 py-4 text-base font-semibold text-background transition hover:bg-accent-hover active:scale-[0.98]"
              >
                Browse Products
              </Link>
              <a
                href={chatUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-accent/40 px-7 py-4 text-base font-semibold text-accent transition hover:bg-accent/10 active:scale-[0.98]"
              >
                Agiza kwa WhatsApp
              </a>
            </div>
          </div>

          <div className="relative mx-auto aspect-square w-full max-w-md">
            <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-accent/15 via-transparent to-transparent" />
            {heroImages[0] && (
              <div className="absolute right-0 top-0 h-3/5 w-3/5 overflow-hidden rounded-3xl border border-border shadow-2xl shadow-black/50">
                <Image
                  src={heroImages[0]}
                  alt=""
                  fill
                  unoptimized={heroImages[0].endsWith(".svg")}
                  sizes="(min-width: 1024px) 30vw, 60vw"
                  className="object-cover"
                  priority
                />
              </div>
            )}
            {heroImages[1] && (
              <div className="absolute bottom-0 left-0 h-2/5 w-2/5 overflow-hidden rounded-2xl border border-border shadow-2xl shadow-black/50">
                <Image
                  src={heroImages[1]}
                  alt=""
                  fill
                  unoptimized={heroImages[1].endsWith(".svg")}
                  sizes="(min-width: 1024px) 20vw, 40vw"
                  className="object-cover"
                />
              </div>
            )}
            {heroImages[2] && (
              <div className="absolute bottom-10 right-8 h-1/3 w-1/3 overflow-hidden rounded-2xl border border-border shadow-2xl shadow-black/50">
                <Image
                  src={heroImages[2]}
                  alt=""
                  fill
                  unoptimized={heroImages[2].endsWith(".svg")}
                  sizes="(min-width: 1024px) 15vw, 30vw"
                  className="object-cover"
                />
              </div>
            )}
          </div>
        </div>
      </section>

      <TrustBadges />

      {/* Featured Deals */}
      <section className="mx-auto max-w-8xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="This Week"
            title="Featured Deals"
            description="Hand-picked deals this week — available while stock lasts."
          />
          <Link
            href="/products"
            className="text-sm font-semibold text-accent transition hover:text-accent-hover"
          >
            View All →
          </Link>
        </div>

        {featuredProducts.length > 0 ? (
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} showDealBadge />
            ))}
          </div>
        ) : (
          <div className="mt-10">
            <EmptyState
              title="No Deals Right Now"
              description="Check back soon — we add new products every week."
            />
          </div>
        )}
      </section>

      {/* Category showcase */}
      <section className="border-t border-border bg-surface/40">
        <div className="mx-auto max-w-8xl px-5 py-16 sm:px-8 sm:py-20">
          <SectionHeading eyebrow="Categories" title="Shop by Category" />
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-5">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/products?category=${category.slug}`}
                className="group flex aspect-square flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-surface p-4 text-center transition hover:-translate-y-1 hover:border-accent/40"
              >
                <span className="font-heading text-base font-semibold text-foreground transition group-hover:text-accent sm:text-lg">
                  {category.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Delivery info */}
      <section className="mx-auto max-w-8xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="grid grid-cols-1 gap-10 rounded-3xl border border-border bg-surface p-8 sm:p-12 lg:grid-cols-3">
          <div>
            <p className="font-heading text-2xl font-bold text-accent">01</p>
            <p className="mt-2 font-heading text-lg font-semibold text-foreground">
              Order via WhatsApp
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Choose a product and tap &ldquo;Agiza kwa WhatsApp&rdquo; to
              message us directly.
            </p>
          </div>
          <div>
            <p className="font-heading text-2xl font-bold text-accent">02</p>
            <p className="mt-2 font-heading text-lg font-semibold text-foreground">
              Confirm Payment
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Pay Cash in-store, Lipa kwa Mkopo (installments), or Exchange
              your old device.
            </p>
          </div>
          <div>
            <p className="font-heading text-2xl font-bold text-accent">03</p>
            <p className="mt-2 font-heading text-lg font-semibold text-foreground">
              Nationwide Delivery
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              We deliver safely to Dar es Salaam and all regions of Tanzania.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
