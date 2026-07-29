import type { ContentStatus } from "./status";

export type TicketAvailability = "available" | "sold-out" | "coming-soon";

export interface TicketTier {
  readonly id: string;
  readonly sortOrder: number;
  readonly type: string;
  readonly badge: string;
  readonly description: string;
  readonly price: number;
  readonly currency: string;
  readonly availability: TicketAvailability;
  readonly status: ContentStatus;
  readonly includes: readonly string[];
  readonly featured?: boolean;
}

export const tickets: readonly TicketTier[] = [
  {
    id: "ticket-01",
    sortOrder: 1,
    type: "EARLY SUPPORTER",
    badge: "Sold out",
    description: "For those who believed first.",
    price: 195,
    currency: "DKK",
    availability: "sold-out",
    status: "placeholder",
    includes: ["Full festival access", "All stages and installations"],
  },
  {
    id: "ticket-02",
    sortOrder: 2,
    type: "GENERAL ADMISSION",
    badge: "Available",
    description: "Full access to all music, art and shared spaces.",
    price: 275,
    currency: "DKK",
    availability: "available",
    status: "placeholder",
    includes: ["Full festival access", "All stages and installations", "Community programme"],
    featured: true,
  },
  {
    id: "ticket-03",
    sortOrder: 3,
    type: "SOLIDARITY TICKET",
    badge: "Available",
    description: "Entry plus an additional direct contribution to the supported initiative.",
    price: 395,
    currency: "DKK",
    availability: "available",
    status: "placeholder",
    includes: ["Everything in general admission", "Additional solidarity contribution"],
  },
];
