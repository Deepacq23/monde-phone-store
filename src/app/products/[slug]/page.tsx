import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductGallery } from "@/components/ProductGallery";
import { ConditionBadge } from "@/components/ConditionBadge";
import { WhatsAppCTAButtons } from "@/components/WhatsAppCTAButtons";
import { ProductCard } from "@/components/ProductCard";
import {
  getAllProductSlugs,
  getProductBySlug,
  getRelatedProducts,
} from "@/lib/data";
import { formatTZS } from "@/lib/format";
import { SITE_URL } from "@/lib/constants";

type ProductPageProps = {
  params: { slug: string };
};

export async function generateStaticParams() {
  const slugs = await getAllProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    return { title: "Product Not Found" };
  }

  const price = formatTZS(product.price_tzs);
  const description = `${price} — ${product.description}`.slice(0, 200);
  const image = product.image_urls[0];
  const url = `${SITE_URL}/products/${product.slug}`;

  return {
    title: `${product.name} — ${price}`,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      title: `${product.name} — ${price}`,
      description,
      images: image
        ? [{ url: image, width: 1200, height: 1200, alt: product.name }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} — ${price}`,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product, 4);
  const url = `${SITE_URL}/products/${product.slug}`;

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.image_urls,
    sku: product.id,
    category: product.category?.name,
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: "TZS",
      price: product.price_tzs,
      availability: product.in_stock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      itemCondition:
        product.condition === "new"
          ? "https://schema.org/NewCondition"
          : "https://schema.org/UsedCondition",
    },
  };

  return (
    <div className="mx-auto max-w-8xl px-5 py-12 sm:px-8 sm:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
        <ProductGallery images={product.image_urls} name={product.name} />

        <div className="flex flex-col">
          {product.category && (
            <span className="text-xs font-semibold uppercase tracking-wide text-muted">
              {product.category.name}
            </span>
          )}
          <div className="mt-3 flex items-start justify-between gap-4">
            <h1 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
              {product.name}
            </h1>
            <ConditionBadge condition={product.condition} />
          </div>

          <p className="mt-4 font-heading text-3xl font-bold text-accent sm:text-4xl">
            {formatTZS(product.price_tzs)}
          </p>

          {!product.in_stock && (
            <p className="mt-3 inline-flex w-fit items-center rounded-full border border-border bg-surface-light px-3 py-1 text-xs font-semibold text-muted">
              Out of Stock
            </p>
          )}

          <p className="mt-6 whitespace-pre-line text-sm leading-relaxed text-muted sm:text-base">
            {product.description}
          </p>

          <div className="mt-8">
            <WhatsAppCTAButtons product={product} />
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="mt-20">
          <h2 className="font-heading text-xl font-bold text-foreground sm:text-2xl">
            Related Products
          </h2>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
            {relatedProducts.map((related) => (
              <ProductCard key={related.id} product={related} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
