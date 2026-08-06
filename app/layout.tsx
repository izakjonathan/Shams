import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SiteHeader } from "./components/SiteHeader";
import { SiteFooter } from "./components/SiteFooter";
import { contentRepository } from "./content";
import { AppShell } from "./components/AppShell";
import { PreviewBanner } from "./components/PreviewBanner";
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
      <head>
        <script
          id="initial-scroll-and-splash-gate"
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var k="shf-splash-seen-v2.4.8";var seen=sessionStorage.getItem(k)==="1";var root=document.documentElement;if(seen){root.classList.add("splashSessionSeen");root.classList.remove("splashCanvasActive");}var managed={"#top":1,"#about":1,"#mission":1,"#lineup":1,"#info":1,"#tickets":1,"#site-footer":1,"#main-content":1};if(managed[location.hash]){history.replaceState(history.state,"",location.pathname+location.search);}var entry=performance.getEntriesByType&&performance.getEntriesByType("navigation")[0];var type=entry&&entry.type||"navigate";if(type==="back_forward")return;history.scrollRestoration="manual";root.classList.add("initialScrollGuardActive");var active=true;var frame=0;var safety=0;var pin=function(){if(!active)return;if(scrollX!==0||scrollY!==0)scrollTo(0,0);frame=requestAnimationFrame(pin);};var release=function(){if(!active)return;active=false;if(frame)cancelAnimationFrame(frame);if(safety)clearTimeout(safety);removeEventListener("scroll",pin,true);removeEventListener("pageshow",pin,true);removeEventListener("load",pin,true);if(window.visualViewport){visualViewport.removeEventListener("resize",pin);visualViewport.removeEventListener("scroll",pin);}scrollTo(0,0);root.classList.remove("initialScrollGuardActive");requestAnimationFrame(function(){history.scrollRestoration="auto";});try{delete window.__shamsReleaseInitialScrollGuard;}catch(_){window.__shamsReleaseInitialScrollGuard=undefined;}};window.__shamsReleaseInitialScrollGuard=release;addEventListener("scroll",pin,true);addEventListener("pageshow",pin,true);addEventListener("load",pin,true);if(window.visualViewport){visualViewport.addEventListener("resize",pin,{passive:true});visualViewport.addEventListener("scroll",pin,{passive:true});}pin();if(seen){addEventListener("load",function(){setTimeout(release,900);},{once:true});}safety=setTimeout(release,8000);}catch(_){}})();`,
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
        />
      </body>
    </html>
  );
}
