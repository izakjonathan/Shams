import type { Metadata } from "next";
import { InformationPage } from "../components/InformationPage";

export const metadata: Metadata = {
  title: "Accessibility",
  description: "The current accessibility commitments for Shams for Humanity.",
  alternates: { canonical: "/accessibility" },
};

export default function AccessibilityPage() {
  return <InformationPage
    index="03 — ACCESSIBILITY"
    title="A festival designed for access."
    intro="This draft sets out our intended website and event access approach. Exact venue facilities and booking procedures will be confirmed when the venue is announced."
    updated="27 July 2026"
    sections={[
      {
        heading: "Our commitment",
        paragraphs: [
          "Shams for Humanity aims to create an event that more people can use, understand and enjoy. We will treat access as part of the event design rather than an afterthought and will communicate honestly where limitations remain.",
        ],
      },
      {
        heading: "Planned venue access",
        items: [
          "Step-free entry and routes between the main public areas where the final venue allows it.",
          "Accessible toilet information published before the event.",
          "Seating and rest opportunities across the site.",
          "A quieter area away from the main stages.",
          "Clear arrival, transport and entrance information.",
          "A contact route for individual access questions and companion arrangements.",
        ],
      },
      {
        heading: "Sound, light and sensory information",
        paragraphs: [
          "Live music events may include high sound levels, bass, haze, darkness, moving light and flashing effects. We will publish more specific warnings with the final programme and make hearing protection information available.",
          "Guests who need to leave and return to a performance area should contact the access team about the available options at the final venue.",
        ],
      },
      {
        heading: "Website accessibility",
        paragraphs: [
          "The website is designed for keyboard navigation, visible focus, screen-reader structure, reduced-motion preferences and responsive text. We continue to test the experience as content and integrations are added.",
          "Some final artist images, ticket-provider pages and third-party services are not yet present. Their accessibility will need separate review before launch.",
        ],
      },
      {
        heading: "Requesting support",
        paragraphs: [
          "Please contact us as early as possible with access questions or requests. Tell us what would help rather than providing medical details unless they are necessary for the arrangement.",
          "Draft access contact: access@shamsforhumanity.example. Replace this address before publication.",
        ],
      },
      {
        heading: "Feedback",
        paragraphs: [
          "If you encounter a barrier on the website or at the event, we want to hear about it. Include the page, area or situation involved and the format in which you would prefer a response. We will acknowledge feedback and explain what can be changed or why a limitation remains.",
        ],
      },
    ]}
  />;
}
