import Link from "next/link";
import { eventStructuredData } from "../../../features/content/structured-data";
import { FadeLink } from "../../../components/FadeLink";
import { ArrowIcon } from "../../../components/ArrowIcon";
import { FaqAccordion } from "../../../features/site/components/FaqAccordion";
import { EventGallery } from "../../../features/site/components/EventGallery";
import { NewsletterForm } from "../../../features/site/components/NewsletterForm";
import { ProgrammeExplorer } from "../../../features/site/components/ProgrammeExplorer";
import { SectionHeader } from "../../../components/SectionHeader";
import { TicketSection } from "../../../features/site/components/TicketSection";
import { contentRepository } from "../../../features/content";
import { publicContentRepository } from "../../../features/content/server";
import { safeExternalUrl, serializeJsonLd } from "../../../lib/site";

const event = contentRepository.getEvent();
const home = contentRepository.getHome();

export async function HomePage({ editing = false }: { editing?: boolean }) {
  const [artists, gallery, faqs, programme, tickets] = await Promise.all([
    publicContentRepository.getArtists(),
    publicContentRepository.getGallery(),
    publicContentRepository.getFaqs(),
    publicContentRepository.getProgramme(),
    publicContentRepository.getTickets(),
  ]);
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };
  const ticketUrl = safeExternalUrl(process.env.NEXT_PUBLIC_TICKET_URL);

  return (
    <div id="main-content" tabIndex={-1} className={editing ? "adminSitePreview" : undefined}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(eventStructuredData(artists, tickets)) }} />
      <section className="hero" id="top">
        <div className="heroOrb orbOne" aria-hidden="true" />
        <div className="heroOrb orbTwo" aria-hidden="true" />
        <div className="heroOrb orbThree" aria-hidden="true" />
        <div className="heroMeta topLeft"><span>{home.hero.edition}</span><span>{home.hero.descriptor}</span></div>
        <div className="heroMeta topRight"><span>{event.numericDate}</span><span>{event.city.toUpperCase()}</span></div>
        <div className="heroCenter">
          <p className="eyebrow">{home.hero.eyebrow}</p>
          <h1>{home.hero.titleLines.map((line, index) => <span key={line}>{line}{index < home.hero.titleLines.length - 1 && <br />}</span>)}</h1>
          <div className="heroActions">
            <FadeLink className="button buttonPrimary" href="/#tickets">{home.hero.primaryAction} <ArrowIcon /></FadeLink>
            <FadeLink className="textLink" href="/#about">{home.hero.secondaryAction} <span aria-hidden="true">↓</span></FadeLink>
          </div>
        </div>
        <div className="heroBottom">
          <p>{home.hero.footerLineOne}<br/>{home.hero.footerLineTwo}</p>
          <div className="scrollCue"><span>Scroll to explore</span><div className="scrollLine"/></div>
        </div>
      </section>

      <section className="statement section paperGlowSection" id="about">
        <div className="paperGlow glowOne" aria-hidden="true" />
        <div className="paperGlow glowTwo" aria-hidden="true" />
        <div className="paperGlow glowThree" aria-hidden="true" />
        <div className="sectionIndex" data-lower-reveal>01 — ABOUT</div>
        <div className="statementGrid">
          <h2 data-lower-reveal>{home.about.heading}</h2>
          <div data-lower-reveal>
            <p className="lead">{home.about.lead}</p>
            <p>{home.about.body}</p>
            <FadeLink className="textLink dark" href="/#mission">Our mission <ArrowIcon /></FadeLink>
          </div>
        </div>
      </section>

      <section className="manifesto darkGlowSection" id="mission">
        <div className="darkGlow darkGlowOne" aria-hidden="true" />
        <p className="verticalText">SHAMS MEANS SUN</p>
        <div className="manifestoContent" data-lower-reveal>
          <span className="kicker">{home.mission.kicker}</span>
          <h2>{home.mission.headingLines.map((line, index) => <span key={line}>{line}{index < home.mission.headingLines.length - 1 && <br />}</span>)}</h2>
          <div className="manifestoTags">{home.mission.tags.map((tag) => <span key={tag}>* {tag}</span>)}</div>
        </div>
      </section>

      {editing && <div className="inlineEditBar"><Link className="inlineEdit" href="/admin/gallery">Edit gallery</Link></div>}
      <EventGallery images={gallery} editing={editing} />

      <section className="lineup section paperGlowSection" id="lineup">
        <div className="paperGlow glowOne" aria-hidden="true" />
        <div className="paperGlow glowTwo" aria-hidden="true" />
        <div className="paperGlow glowThree" aria-hidden="true" />
        {editing && <Link className="inlineEdit" href="/admin/artists">Manage artists</Link>}
        <SectionHeader
          index="02 — ARTISTS"
          title={home.lineup.title}
          description={home.lineup.description}
          reveal
        />
        <div className="artistList" data-lower-reveal>
          {artists.map((artist, index) => (
            <article className="artistRow" id={`artist-${artist.slug}`} key={artist.slug}>
              <span className="artistNumber">{String(index + 1).padStart(2, "0")}</span>
              <h3>{artist.name}</h3>
              {editing && <Link className="inlineEdit inlineEdit--record" href={`/admin/artists?edit=${encodeURIComponent(artist.id)}#record-editor`}>Edit <span className="srOnly">{artist.name}</span></Link>}
              <span>{artist.type}</span>
              <span>{artist.time}</span>
              <span>{artist.stage}</span>
              <FadeLink
                className="artistArrow"
                href={`/artists/${artist.slug}`}
                transitionKind="artist-open"
                aria-label={`View ${artist.name} artist page`}
              >
                <ArrowIcon />
              </FadeLink>
            </article>
          ))}
        </div>
        <p className="lineupNote" data-lower-reveal>{home.lineup.note}</p>
      </section>

      <section className="eventInfo" id="info">
        <div className="infoIntro" data-lower-reveal>
          <div className="sectionIndex light">03 — EVENT INFO</div>
          <h2>Everything you need for the day.</h2>
          <p>Designed to feel easy from arrival to the final track.</p>
        </div>
        <div className="infoCards" data-lower-reveal>
          <article><span>01</span><h3>Date & time</h3><p>Sunday<br/>{event.date}<br/>{event.timeRange}</p></article>
          <article><span>02</span><h3>Location</h3><p>Copenhagen<br/>Venue revealed soon<br/>Easy public transport</p></article>
          <article><span>03</span><h3>Experience</h3><p>2 stages<br/>Food & drinks<br/>Art installations</p></article>
          <article><span>04</span><h3>Access</h3><p>18+ event<br/>Step-free routes<br/>Quiet space available</p></article>
        </div>
      </section>

      <section className="programme section paperGlowSection">
        <div className="paperGlow glowOne" aria-hidden="true" />
        <div className="paperGlow glowTwo" aria-hidden="true" />
        <div className="paperGlow glowThree" aria-hidden="true" />
        <SectionHeader
          index="04 — PROGRAMME"
          title={home.programme.title}
          description={home.programme.description}
          reveal
        />
        {editing && <Link className="inlineEdit" href="/admin/programme">Manage programme</Link>}
        <ProgrammeExplorer entries={programme} editing={editing} />
      </section>

      <TicketSection tickets={tickets} ticketUrl={ticketUrl} editing={editing} />

      <section className="faq section paperGlowSection">
        <div className="paperGlow glowOne" aria-hidden="true" />
        <div className="paperGlow glowTwo" aria-hidden="true" />
        <div className="paperGlow glowThree" aria-hidden="true" />
        <SectionHeader index="06 — PRACTICAL" title={home.faq.title} reveal />
        {editing && <Link className="inlineEdit" href="/admin/faqs">Manage FAQs</Link>}
        <FaqAccordion faqs={faqs} editing={editing} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(faqJsonLd) }}
        />
      </section>

      <section className="newsletter">
        <div data-lower-reveal><span className="kicker">{home.newsletter.kicker}</span><h2>{home.newsletter.titleLines.map((line, index) => <span key={line}>{line}{index < home.newsletter.titleLines.length - 1 && <br />}</span>)}</h2></div>
        <NewsletterForm />
      </section>

    </div>
  );
}
