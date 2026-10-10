export const HOME_FIELDS = {
  hero: { label: "Hero", fields: { edition: "Edition", descriptor: "Description", eyebrow: "Small heading", titleLines: "Title lines", primaryAction: "Ticket button text", secondaryAction: "About link text", footerLineOne: "Bottom text, first line", footerLineTwo: "Bottom text, second line" } },
  about: { label: "About", fields: { heading: "Heading", lead: "Introduction", body: "Text" } },
  mission: { label: "Mission", fields: { kicker: "Small heading", headingLines: "Heading lines", tags: "Keywords" } },
  lineup: { label: "Artists section", fields: { title: "Heading", description: "Introduction", note: "Footnote" } },
  programme: { label: "Programme section", fields: { title: "Heading", description: "Introduction" } },
  faq: { label: "FAQ section", fields: { title: "Heading" } },
  newsletter: { label: "Newsletter", fields: { kicker: "Small heading", titleLines: "Heading lines" } },
} as const;
export const HOME_ARRAY_FIELDS = new Set(["titleLines", "headingLines", "tags"]);
