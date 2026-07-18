import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { SiteChrome } from "@/components/SiteChrome";
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
  STORE_LOCATION,
  WHATSAPP_PHONE,
} from "@/lib/constants";
import "./globals.css";

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Premium Phones. Real Prices.`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    locale: "en_TZ",
    siteName: SITE_NAME,
    url: SITE_URL,
    title: `${SITE_NAME} — Premium Phones. Real Prices.`,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Premium Phones. Real Prices.`,
    description: SITE_DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": "ElectronicsStore",
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    telephone: `+${WHATSAPP_PHONE}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: STORE_LOCATION.street,
      addressLocality: STORE_LOCATION.area,
      addressRegion: STORE_LOCATION.city,
      addressCountry: "TZ",
    },
  };

  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} h-full`}
    >
      <body className="flex min-h-full flex-col bg-background font-sans text-foreground antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
