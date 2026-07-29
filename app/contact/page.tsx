import type { Metadata } from "next";
import { FadeLink } from "../components/FadeLink";
import { PageCloseButton } from "../components/PageCloseButton";
import { contentRepository } from "../content";

const content = contentRepository.getContactPage();

export const metadata: Metadata = {
  title: "Contact",
  description: content.intro,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <main className="contactPage" id="main-content" tabIndex={-1}>
      <PageCloseButton />
      <section className="contactHero">
        <span className="sectionIndex">{content.index}</span>
        <h1>{content.titleLines.map((line, index) => <span key={line}>{line}{index < content.titleLines.length - 1 && <br />}</span>)}</h1>
        <p>{content.intro}</p>
      </section>
      <section className="contactGrid section">
        {content.routes.map((contact, index) => (
          <article key={contact.id} data-content-id={contact.id} data-content-status={contact.status}>
            <span>{String(index + 1).padStart(2, "0")} / {contact.label}</span>
            <h2><a href={`mailto:${contact.address}`}>{contact.address}</a></h2>
            <p>{contact.note}</p>
            <span className="contactPlaceholder">ADDRESS TO BE CONFIRMED</span>
          </article>
        ))}
      </section>
      <section className="organizerBlock">
        <div><span className="sectionIndex">ORGANIZER INFORMATION</span><h2>Details before launch</h2></div>
        <div>
          {Object.entries(content.organizer).map(([label, value]) => <p key={label}><strong>{label}:</strong> {value}</p>)}
          <FadeLink className="textLink dark" href="/privacy">Read our privacy draft →</FadeLink>
        </div>
      </section>
    </main>
  );
}
