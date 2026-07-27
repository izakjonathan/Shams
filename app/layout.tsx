import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import "./globals.css";
import { SiteHeader } from "./components/SiteHeader";
import { SplashScreen } from "./components/SplashScreen";
import { artists, event, tickets } from "./lib/content";
import { siteUrl } from "./lib/site";

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
    index: true,
    follow: true,
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
      availability: ticket.available
        ? "https://schema.org/InStock"
        : "https://schema.org/SoldOut",
      url: `${siteUrl}/#tickets`,
    })),
  };

  return (
    <html lang="en" className={agilera.variable}>
      <body className="splashActive">
        <Script
          id="splash-session-gate"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `try{if(sessionStorage.getItem("shf-splash-seen")==="1"){document.documentElement.classList.add("splashSessionSeen");var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute("content","#090909");}}catch{}`,
          }}
        />
        <noscript>
          <style>{`
            .splashScreen { display: none !important; }
            .siteShell { opacity: 1 !important; transform: none !important; }
            body.splashActive { overflow: visible !important; }
            .splashActive .skipLink { opacity: 1 !important; pointer-events: auto !important; }
          `}</style>
        </noscript>
        <a className="skipLink" href="#main-content">Skip to content</a>
        <SplashScreen />
        <div className="siteShell">
          <SiteHeader />
          {children}
        </div>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
      </body>
    </html>
  );
}
