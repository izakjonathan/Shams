import { FadeLink } from "./FadeLink";
import { PageCloseButton } from "./PageCloseButton";

export interface InformationSection {
  readonly heading: string;
  readonly paragraphs?: readonly string[];
  readonly items?: readonly string[];
}

export function InformationPage({
  index,
  title,
  intro,
  updated,
  sections,
}: {
  index: string;
  title: string;
  intro: string;
  updated: string;
  sections: readonly InformationSection[];
}) {
  return (
    <main className="informationPage" id="main-content" tabIndex={-1}>
      <PageCloseButton />
      <header className="informationHero paperGlowSection">
        <div className="paperGlow glowOne" aria-hidden="true" />
        <div className="paperGlow glowTwo" aria-hidden="true" />
        <div className="paperGlow glowThree" aria-hidden="true" />
        <span className="sectionIndex">{index}</span>
        <h1>{title}</h1>
        <p>{intro}</p>
        <small>Last updated: {updated}</small>
      </header>
      <div className="informationBody">
        <aside>
          <span>SHAMS FOR HUMANITY</span>
          <p>Draft information for the first edition. Organizer details and final operational information will be confirmed before launch.</p>
          <FadeLink className="textLink dark" href="/contact">Contact us →</FadeLink>
        </aside>
        <article>
          {sections.map((section, indexNumber) => (
            <section key={section.heading}>
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
