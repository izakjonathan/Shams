export interface TicketTier {
  type: string;
  badge: string;
  description: string;
  price: number;
  currency: string;
  available: boolean;
  featured?: boolean;
}

export const tickets: TicketTier[] = [
  { type: "EARLY SUPPORTER", badge: "Sold out", description: "For those who believed first.", price: 195, currency: "DKK", available: false },
  { type: "GENERAL ADMISSION", badge: "Available", description: "Full access to all music, art and spaces.", price: 275, currency: "DKK", available: true, featured: true },
  { type: "SOLIDARITY TICKET", badge: "Available", description: "Entry plus an additional direct donation.", price: 395, currency: "DKK", available: true },
];
