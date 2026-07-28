
export type TicketAvailability = "available" | "sold-out" | "coming-soon";

export interface TicketTier {
  readonly type: string;
  readonly badge: string;
  readonly description: string;
  readonly price: number;
  readonly currency: string;
  readonly availability: TicketAvailability;
  readonly includes: readonly string[];
  readonly featured?: boolean;
}

export const tickets: readonly TicketTier[] = [
  {
    type: "EARLY SUPPORTER",
    badge: "Sold out",
    description: "For those who believed first.",
    price: 195,
    currency: "DKK",
    availability: "sold-out",
    includes: ["Full festival access", "All stages and installations"],
  },
  {
    type: "GENERAL ADMISSION",
    badge: "Available",
    description: "Full access to all music, art and shared spaces.",
    price: 275,
    currency: "DKK",
    availability: "available",
    includes: ["Full festival access", "All stages and installations", "Community programme"],
    featured: true,
  },
  {
    type: "SOLIDARITY TICKET",
    badge: "Available",
    description: "Entry plus an additional direct contribution to the supported initiative.",
    price: 395,
    currency: "DKK",
    availability: "available",
    includes: ["Everything in general admission", "Additional solidarity contribution"],
  },
];
