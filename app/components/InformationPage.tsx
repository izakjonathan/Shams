import type { InformationPageContent } from "../content";
import { FadeLink } from "./FadeLink";
import { PageCloseButton } from "./PageCloseButton";

export function InformationPage({ content }: { readonly content: InformationPageContent }) {
  return (
    <main className="informationPage" id="main-content" tabIndex={-1} data-content-id={content.id} data-content-status={content.status}>
      <PageCloseButton />
      <header className="informationHero">
        <span className="sectionIndex">{content.index}</span>
        <h1>{content.title}</h1>
        <p>{content.intro}</p>
        <small>Last updated: {content.updated}</small>
      </header>
      <div className="informationBody">
        <aside>
          <span>SHAMS FOR HUMANITY</span>
          <p>Draft information for the first edition. Organizer details and final operational information will be confirmed before launch.</p>
          <FadeLink className="textLink dark" href="/contact">Contact us →</FadeLink>
        </aside>
        <article>
          {content.sections.map((section, indexNumber) => (
            <section key={section.id} data-content-id={section.id} data-content-status={section.status}>
              <div className="informationNumber">{String(indexNumber + 1).padStart(2, "0")}</div>
              <div>
                <h2>{section.heading}</h2>
                {section.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                {section.items && <ul>{section.items.map((item) => <li key={item}>{item}</li>)}</ul>}
              </div>
            </section>
          ))}
        </article>
      </div>
    </main>
  );
}
