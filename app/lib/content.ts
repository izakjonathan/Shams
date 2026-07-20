// Central content source for the site.
//
// Mirrors the intent of app/design-system.css: one place to update copy,
// lineup, schedule and ticket data instead of hunting through JSX.

export interface Artist {
  name: string;
  type: string;
  time: string;
  stage: string;
}

export const artists: Artist[] = [
  { name: "Nour", type: "Live", time: "18:30", stage: "Sun Stage" },
  { name: "Maya Al Khalil", type: "DJ Set", time: "20:00", stage: "Orbit Stage" },
  { name: "Aïsha Devi", type: "Live A/V", time: "21:30", stage: "Sun Stage" },
  { name: "Sama' Abdulhadi", type: "DJ Set", time: "23:00", stage: "Orbit Stage" },
  { name: "Habibi Funk", type: "DJ Set", time: "00:30", stage: "Sun Stage" },
  { name: "Community Choir", type: "Opening", time: "17:00", stage: "Garden" },
];

export interface FaqEntry {
  question: string;
  answer: string;
}

export const faqs: FaqEntry[] = [
  {
    question: "Where does the event take place?",
    answer:
      "The first edition is planned for Copenhagen. The final venue and access details will be announced to ticket holders.",
  },
  {
    question: "Is the event accessible?",
    answer:
      "Yes. We are designing step-free routes, accessible toilets, seating areas and a quiet space. Contact us for individual access needs.",
  },
  {
    question: "What does my ticket support?",
    answer: "A transparent share of proceeds supports humanitarian organisations and community-led initiatives.",
  },
  {
    question: "Can I volunteer?",
    answer: "Yes. Volunteer registration will open with roles across hospitality, production, access and guest care.",
  },
];

export interface ProgrammeEntry {
  time: string;
  label: string;
}

export const programme: ProgrammeEntry[] = [
  { time: "16:00", label: "Doors + welcome" },
  { time: "17:00", label: "Community opening" },
  { time: "18:30", label: "Live programme" },
  { time: "21:30", label: "Night programme" },
  { time: "00:30", label: "Closing sessions" },
  { time: "02:00", label: "End" },
];

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
  {
    type: "EARLY SUPPORTER",
    badge: "Sold out",
    description: "For those who believed first.",
    price: 195,
    currency: "DKK",
    available: false,
  },
  {
    type: "GENERAL ADMISSION",
    badge: "Available",
    description: "Full access to all music, art and spaces.",
    price: 275,
    currency: "DKK",
    available: true,
    featured: true,
  },
  {
    type: "SOLIDARITY TICKET",
    badge: "Available",
    description: "Entry plus an additional direct donation.",
    price: 395,
    currency: "DKK",
    available: true,
  },
];

export const event = {
  name: "Shams for Humanity",
  tagline: "A gathering of music, art and collective care.",
  city: "Copenhagen",
  country: "Denmark",
  date: "06 September 2026",
  isoStart: "2026-09-06T16:00:00+02:00",
  isoEnd: "2026-09-07T02:00:00+02:00",
};
