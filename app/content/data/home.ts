import type { HomeContent } from "../models";

export const homeContent: HomeContent = {
  id: "page-home",
  status: "placeholder",
  hero: {
    edition: "01 / FIRST EDITION",
    descriptor: "MUSIC · ART · SOLIDARITY",
    eyebrow: "A gathering in support of collective care",
    titleLines: ["Shams for", "Humanity"],
    primaryAction: "Get tickets",
    secondaryAction: "Discover the festival",
    footerLineOne: "One day. Two stages.",
    footerLineTwo: "A shared purpose.",
  },
  about: {
    heading: "Where culture becomes a force for care.",
    lead: "Shams for Humanity is an independent festival bringing people together through music, visual art, food and conversation.",
    body: "Built around solidarity rather than spectacle, the event creates space for discovery, connection and meaningful action. A portion of every ticket supports trusted humanitarian initiatives.",
  },
  mission: {
    kicker: "OUR GUIDING IDEA",
    headingLines: ["Music can move bodies.", "Community can move worlds."],
    tags: ["Listen", "Gather", "Act"],
  },
  lineup: {
    title: "First wave",
    description: "Live performances, boundary-pushing selectors and collaborative moments across two stages.",
    note: "More artists, talks and installations to be announced.",
  },
  programme: {
    title: "A day in motion",
    description: "Move between sound, food, ideas and collective experiences at your own pace.",
  },
  faq: { title: "Good to know" },
  newsletter: { kicker: "STAY CLOSE", titleLines: ["News from", "under the sun."] },
};
