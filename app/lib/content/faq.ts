export interface FaqEntry {
  question: string;
  answer: string;
}

export const faqs: FaqEntry[] = [
  { question: "Where does the event take place?", answer: "The first edition is planned for Copenhagen. The final venue and access details will be announced to ticket holders." },
  { question: "Is the event accessible?", answer: "Yes. We are designing step-free routes, accessible toilets, seating areas and a quiet space. Contact us for individual access needs." },
  { question: "What does my ticket support?", answer: "A transparent share of proceeds supports humanitarian organisations and community-led initiatives." },
  { question: "Can I volunteer?", answer: "Yes. Volunteer registration will open with roles across hospitality, production, access and guest care." },
];
