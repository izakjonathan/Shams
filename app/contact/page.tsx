import type { Metadata } from "next";
import { FadeLink } from "../components/FadeLink";
import { PageCloseButton } from "../components/PageCloseButton";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact information for Shams for Humanity.",
  alternates: { canonical: "/contact" },
};

const contacts = [
  { label: "GENERAL", address: "hello@shamsforhumanity.example", note: "Event information, partnerships and general questions." },
  { label: "ACCESS", address: "access@shamsforhumanity.example", note: "Access questions and individual arrangements." },
  { label: "PRESS", address: "press@shamsforhumanity.example", note: "Press requests, accreditation and approved materials." },
  { label: "PRIVACY", address: "privacy@shamsforhumanity.example", note: "Questions or requests concerning personal information." },
];

export default function ContactPage() {
  return (
    <main className="contactPage" id="main-content" tabIndex={-1}>
      <PageCloseButton />
      <section className="contactHero">
        <span className="sectionIndex">04 — CONTACT</span>
        <h1>Let’s talk<br/>under the sun.</h1>
        <p>Choose the most relevant route below. All addresses are placeholders and must be replaced before launch.</p>
      </section>
      <section className="contactGrid section">
        {contacts.map((contact, index) => (
          <article key={contact.label}>
            <span>{String(index + 1).padStart(2, "0")} / {contact.label}</span>
            <h2>{contact.address}</h2>
            <p>{contact.note}</p>
            <span className="contactPlaceholder">ADDRESS TO BE CONFIRMED</span>
          </article>
        ))}
      </section>
      <section className="organizerBlock">
        <div>
          <span className="sectionIndex">ORGANIZER INFORMATION</span>
          <h2>Details before launch</h2>
        </div>
        <div>
          <p><strong>Legal name:</strong> To be confirmed</p>
          <p><strong>CVR number:</strong> To be confirmed</p>
          <p><strong>Postal address:</strong> To be confirmed</p>
          <p><strong>Responsible contact:</strong> To be confirmed</p>
          <FadeLink className="textLink dark" href="/privacy">Read our privacy draft →</FadeLink>
        </div>
      </section>
    </main>
  );
}
