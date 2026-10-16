import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "../styles/globals.css";
import { SiteHeader } from "../features/site/components/SiteHeader";
import { SiteFooter } from "../features/site/components/SiteFooter";
import { contentRepository } from "../features/content";
import { AppShell } from "../features/site/components/AppShell";
import { PreviewBanner } from "../features/site/components/PreviewBanner";
import { allowIndexing, siteUrl } from "../lib/site";

const event = contentRepository.getEvent();

const agilera = localFont({
  src: "../../public/fonts/Agilera.woff",
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
  themeColor: "#000000",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {

  return (
    <html lang="en" className={`${agilera.variable} splashCanvasActive`}>
      <head>
        <script
          id="splash-session-gate"
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var k="shf-splash-seen-v2.6.0";if(sessionStorage.getItem(k)==="1"){var root=document.documentElement;root.classList.add("splashSessionSeen");root.classList.remove("splashCanvasActive");}}catch(_){}})();`,
          }}
        />
      </head>
      <body className="splashActive">
        <noscript>
          <style>{`
            .splashScreen { display: none !important; }
            .siteShell { opacity: 1 !important; transform: none !important; }
            .splashActive .skipLink { opacity: 1 !important; pointer-events: auto !important; }
          `}</style>
        </noscript>
        <AppShell header={<SiteHeader />} footer={<SiteFooter />}>
          <PreviewBanner />
          {children}
        </AppShell>

      </body>
    </html>
  );
}
