import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { FadeLink } from "./components/FadeLink";
import { ArrowIcon } from "./components/ArrowIcon";
import { FaqAccordion } from "./components/FaqAccordion";
import { NewsletterForm } from "./components/NewsletterForm";
import { ProgrammeExplorer } from "./components/ProgrammeExplorer";
import { ScrollReveal } from "./components/ScrollReveal";
import { SectionHeader } from "./components/SectionHeader";
import { TicketSection } from "./components/TicketSection";
import { artists, event, faqs, programme, tickets } from "./lib/content";
import { safeExternalUrl, serializeJsonLd } from "./lib/site";

export const metadata: Metadata = {
  title: `${event.city} · ${event.date}`,
  description:
    "A one-day festival of music, art and collective care in Copenhagen. A transparent share of every ticket supports humanitarian and community-led initiatives.",
  alternates: { canonical: "/" },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map(({ question, answer }) => ({
    "@type": "Question",
    name: question,
    acceptedAnswer: { "@type": "Answer", text: answer },
  })),
};

export default function Home() {
  const ticketUrl = safeExternalUrl(process.env.NEXT_PUBLIC_TICKET_URL);

  return (
    <main id="main-content" tabIndex={-1}>
      <ScrollReveal />

      <section className="hero" id="top">
        <div className="heroOrb orbOne" aria-hidden="true" />
        <div className="heroOrb orbTwo" aria-hidden="true" />
        <div className="heroOrb orbThree" aria-hidden="true" />
        <div className="heroMeta topLeft"><span>01 / FIRST EDITION</span><span>MUSIC · ART · SOLIDARITY</span></div>
        <div className="heroMeta topRight"><span>{event.numericDate}</span><span>{event.city.toUpperCase()}</span></div>
        <div className="heroCenter">
          <p className="eyebrow">A gathering in support of collective care</p>
          <h1>Shams for<br/>Humanity</h1>
          <div className="heroActions">
            <a className="button buttonPrimary" href="#tickets">Get tickets <ArrowIcon /></a>
            <a className="textLink" href="#about">Discover the festival <span aria-hidden="true">↓</span></a>
          </div>
        </div>
        <div className="heroBottom">
          <p>One day. Two stages.<br/>A shared purpose.</p>
          <div className="scrollCue"><span>Scroll to explore</span><div className="scrollLine"/></div>
        </div>
      </section>

      <section className="statement section paperGlowSection" id="about">
        <div className="paperGlow glowOne" aria-hidden="true" />
        <div className="paperGlow glowTwo" aria-hidden="true" />
        <div className="paperGlow glowThree" aria-hidden="true" />
        <div className="sectionIndex">01 — ABOUT</div>
        <div className="statementGrid">
          <h2>Where culture becomes a force for care.</h2>
          <div>
            <p className="lead">Shams for Humanity is an independent festival bringing people together through music, visual art, food and conversation.</p>
            <p>Built around solidarity rather than spectacle, the event creates space for discovery, connection and meaningful action. A portion of every ticket supports trusted humanitarian initiatives.</p>
            <a className="textLink dark" href="#mission">Our mission <ArrowIcon /></a>
          </div>
        </div>
      </section>

      <section className="manifesto darkGlowSection" id="mission">
        <div className="darkGlow darkGlowOne" aria-hidden="true" />
        <p className="verticalText">SHAMS MEANS SUN</p>
        <div className="manifestoContent">
          <span className="kicker">OUR GUIDING IDEA</span>
          <h2>Music can move bodies.<br/>Community can move worlds.</h2>
          <div className="manifestoTags"><span>* Listen</span><span>* Gather</span><span>* Act</span></div>
        </div>
      </section>

      <section className="lineup section paperGlowSection" id="lineup">
        <div className="paperGlow glowOne" aria-hidden="true" />
        <div className="paperGlow glowTwo" aria-hidden="true" />
        <div className="paperGlow glowThree" aria-hidden="true" />
        <SectionHeader
          index="02 — ARTISTS"
          title="First wave"
          description="Live performances, boundary-pushing selectors and collaborative moments across two stages."
        />
        <div className="artistList">
          {artists.map((artist, index) => (
            <article className="artistRow" id={`artist-${artist.slug}`} key={artist.slug}>
              <span className="artistNumber">{String(index + 1).padStart(2, "0")}</span>
              <h3 style={{ viewTransitionName: `artist-title-${artist.slug}` } as CSSProperties}>{artist.name}</h3>
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
        <p className="lineupNote">More artists, talks and installations to be announced.</p>
      </section>

      <section className="eventInfo" id="info">
        <div className="infoIntro">
          <div className="sectionIndex light">03 — EVENT INFO</div>
          <h2>Everything you need for the day.</h2>
          <p>Designed to feel easy from arrival to the final track.</p>
        </div>
        <div className="infoCards">
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
          title="A day in motion"
          description="Move between sound, food, ideas and collective experiences at your own pace."
        />
        <ProgrammeExplorer entries={programme} />
      </section>

      <TicketSection tickets={tickets} ticketUrl={ticketUrl} />

      <section className="faq section paperGlowSection">
        <div className="paperGlow glowOne" aria-hidden="true" />
        <div className="paperGlow glowTwo" aria-hidden="true" />
        <div className="paperGlow glowThree" aria-hidden="true" />
        <SectionHeader index="06 — PRACTICAL" title="Good to know" />
        <FaqAccordion faqs={faqs} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(faqJsonLd) }}
        />
      </section>

      <section className="newsletter">
        <div><span className="kicker">STAY CLOSE</span><h2>News from<br/>under the sun.</h2></div>
        <NewsletterForm />
      </section>

    </main>
  );
}
