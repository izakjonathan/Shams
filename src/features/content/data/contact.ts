import type { ContactPageContent } from "../models";

export const contactPage: ContactPageContent = {
  id: "page-contact",
  status: "placeholder",
  index: "04 — CONTACT",
  titleLines: ["Let’s talk", "under the sun."],
  intro: "Choose the most relevant route below. All addresses are placeholders and must be replaced before launch.",
  routes: [
    { id: "contact-general", sortOrder: 1, status: "placeholder", label: "GENERAL", address: "hello@shamsforhumanity.example", note: "Event information, partnerships and general questions." },
    { id: "contact-access", sortOrder: 2, status: "placeholder", label: "ACCESS", address: "access@shamsforhumanity.example", note: "Access questions and individual arrangements." },
    { id: "contact-press", sortOrder: 3, status: "placeholder", label: "PRESS", address: "press@shamsforhumanity.example", note: "Press requests, accreditation and approved materials." },
    { id: "contact-privacy", sortOrder: 4, status: "placeholder", label: "PRIVACY", address: "privacy@shamsforhumanity.example", note: "Questions or requests concerning personal information." },
  ],
  organizer: {
    "Legal name": "To be confirmed",
    "CVR number": "To be confirmed",
    "Postal address": "To be confirmed",
    "Responsible contact": "To be confirmed",
  },
};
