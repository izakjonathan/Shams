import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import "./globals.css";
import { SiteHeader } from "./components/SiteHeader";
import { SiteFooter } from "./components/SiteFooter";
import { contentRepository } from "./content";
import { AppShell } from "./components/AppShell";
import { allowIndexing, serializeJsonLd, siteUrl } from "./lib/site";

const event = contentRepository.getEvent();
const artists = contentRepository.getArtists();
const tickets = contentRepository.getTickets();

const agilera = localFont({
  src: "../public/fonts/Agilera.woff",
  variable: "--font-agilera",
  display: "swap",
  preload: true,
  fallback: ["Times New Roman", "serif"],
  adjustFontFallback: "Times New Roman",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Shams for Humanity",
    template: "%s · Shams for Humanity",
  },
  description: event.tagline,
  keywords: [
    "Shams for Humanity",
    "Copenhagen festival",
    "music festival Copenhagen",
    "charity festival",
    "humanitarian festival",
  ],
  authors: [{ name: "Shams for Humanity" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Shams for Humanity",
    title: "Shams for Humanity",
    description: event.tagline,
  },
  twitter: {
    card: "summary_large_image",
    title: "Shams for Humanity",
    description: event.tagline,
  },
  robots: {
    index: allowIndexing,
    follow: allowIndexing,
    googleBot: {
      index: allowIndexing,
      follow: allowIndexing,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#f5f2eb",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MusicEvent",
    name: event.name,
    description: event.tagline,
    startDate: event.isoStart,
    endDate: event.isoEnd,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: {
      "@type": "Place",
      name: event.city,
      address: {
        "@type": "PostalAddress",
        addressLocality: event.city,
        addressCountry: event.country,
      },
    },
    image: [`${siteUrl}/opengraph-image`],
    url: siteUrl,
    performer: artists.map((artist) => ({
      "@type": "PerformingGroup",
      name: artist.name,
    })),
    offers: tickets.map((ticket) => ({
      "@type": "Offer",
      name: ticket.type,
      price: ticket.price,
      priceCurrency: ticket.currency,
      availability:
        ticket.availability === "available"
          ? "https://schema.org/InStock"
          : ticket.availability === "sold-out"
            ? "https://schema.org/SoldOut"
            : "https://schema.org/PreOrder",
      url: `${siteUrl}/#tickets`,
    })),
  };

  return (
    <html lang="en" className={`${agilera.variable} splashCanvasActive`}>
      <body className="splashActive">
        <Script
          id="splash-session-gate"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `try{if(sessionStorage.getItem("shf-splash-seen-v2.1.3")==="1"){document.documentElement.classList.add("splashSessionSeen");document.documentElement.classList.remove("splashCanvasActive","splashRunwayActive");}}catch{}`,
          }}
        />
        <noscript>
          <style>{`
            .splashScreen { display: none !important; }
            .siteShell { opacity: 1 !important; transform: none !important; }
            .splashActive .skipLink { opacity: 1 !important; pointer-events: auto !important; }
          `}</style>
        </noscript>
        <AppShell header={<SiteHeader />} footer={<SiteFooter />}>
          {children}
        </AppShell>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
        />
      </body>
    </html>
  );
}
