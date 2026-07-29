import type { ContentStatus } from "./status";

export interface FaqEntry {
  readonly id: string;
  readonly sortOrder: number;
  readonly status: ContentStatus;
  readonly question: string;
  readonly answer: string;
}

export const faqs: FaqEntry[] = [
  { id: "faq-01", sortOrder: 1, status: "placeholder", question: "Where does the event take place?", answer: "The first edition is planned for Copenhagen. The final venue and access details will be announced to ticket holders." },
  { id: "faq-02", sortOrder: 2, status: "placeholder", question: "Is the event accessible?", answer: "Yes. We are designing step-free routes, accessible toilets, seating areas and a quiet space. Contact us for individual access needs." },
  { id: "faq-03", sortOrder: 3, status: "placeholder", question: "What does my ticket support?", answer: "A transparent share of proceeds supports humanitarian organisations and community-led initiatives." },
  { id: "faq-04", sortOrder: 4, status: "placeholder", question: "Can I volunteer?", answer: "Yes. Volunteer registration will open with roles across hospitality, production, access and guest care." },
];
