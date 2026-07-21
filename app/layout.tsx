import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SplashScreen } from "./components/SplashScreen";
import { artists, event, tickets } from "./lib/content";

const agilera = localFont({
  src: "../public/fonts/Agilera.woff",
  variable: "--font-agilera",
  display: "block",
  preload: true,
  adjustFontFallback: false,
});

// Set NEXT_PUBLIC_SITE_URL in the Vercel project's environment variables to
// the production domain once it's live — this backs canonical URLs and the
// absolute URLs used in Open Graph / Twitter previews.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://shamsforhumanity.com";

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
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Shams for Humanity",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  colorScheme: "light",
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
        <a className="skipLink" href="#main-content">Skip to content</a>
        <SplashScreen />
        <div className="siteShell">{children}</div>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
