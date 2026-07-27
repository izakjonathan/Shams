import type { Metadata } from "next";
import { InformationPage } from "../components/InformationPage";

export const metadata: Metadata = {
  title: "Terms",
  description: "Draft website and event terms for Shams for Humanity.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return <InformationPage
    index="02 — TERMS"
    title="Clear terms for a shared day."
    intro="These are draft website and event terms. Final ticketing, organizer and venue terms must be inserted and legally reviewed before public ticket sales begin."
    updated="27 July 2026"
    sections={[
      {
        heading: "About these terms",
        paragraphs: [
          "These terms apply to your use of the Shams for Humanity website and, once tickets are available, to attendance at the event unless the ticket provider or venue presents additional terms. The organizer’s final legal identity and contact details will be added before launch.",
        ],
      },
      {
        heading: "Tickets and payment",
        paragraphs: [
          "Tickets will be sold through an external ticket provider. Prices, fees, payment methods and booking confirmation will be shown during checkout. The provider’s purchasing terms will form part of the agreement and should be read before payment.",
          "A booking is complete only when the ticket provider has accepted payment and issued a confirmation. Do not publish this section until the final ticket provider and ticket conditions have been confirmed.",
        ],
      },
      {
        heading: "Refunds, cancellation and changes",
        paragraphs: [
          "The final refund policy will explain what happens if the event is cancelled, postponed, moved or materially changed. Festival programmes may change because of artist availability, safety requirements or circumstances outside the organizer’s reasonable control.",
          "Any limitation on refunds must be consistent with applicable consumer law and the final ticket-provider agreement. Placeholder wording should not be relied on when handling a real claim.",
        ],
      },
      {
        heading: "Entry and conduct",
        items: [
          "Bring a valid ticket and any identification required by the announced age policy.",
          "Follow reasonable instructions from event, venue, security and access staff.",
          "Treat other guests, artists, staff and the surrounding community with respect.",
          "Harassment, discrimination, violence, dangerous behavior and deliberate damage are not accepted.",
          "Entry may be refused or a guest may be removed where reasonably necessary for safety, legal compliance or serious breach of these terms.",
        ],
      },
      {
        heading: "Accessibility and individual needs",
        paragraphs: [
          "We aim to provide clear access information and reasonable support. Guests are encouraged to contact the access team in advance when they need specific arrangements. See the Accessibility page for the current draft commitments.",
        ],
      },
      {
        heading: "Photography and recording",
        paragraphs: [
          "Event photography or filming may take place. Final signage and terms will explain how official content is used and how guests can raise a concern. Commercial recording, professional equipment and artist-performance recording may be restricted.",
        ],
      },
      {
        heading: "Website content",
        paragraphs: [
          "We try to keep event information accurate, but provisional schedules, artist details and venue information may change. Content may not be copied or commercially reused without permission, except where applicable law allows it.",
        ],
      },
      {
        heading: "Responsibility and contact",
        paragraphs: [
          "Nothing in these terms excludes responsibility that cannot legally be excluded. The final version should define the organizer’s responsibility, complaint process, governing law and dispute-resolution information after professional review.",
          "For current questions, use the Contact page. Replace all placeholder addresses before public launch.",
        ],
      },
    ]}
  />;
}
