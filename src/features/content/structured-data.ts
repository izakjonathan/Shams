import type { Artist, TicketTier } from "./models";
import { contentRepository } from "./repository";
import { siteUrl } from "../../lib/site";
const event = contentRepository.getEvent();
export function eventStructuredData(artists: readonly Artist[], tickets: readonly TicketTier[]) {
  return {
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

}
