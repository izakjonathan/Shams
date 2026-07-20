import type { Metadata } from "next";
import { ArrowIcon } from "./components/ArrowIcon";
import { FaqAccordion } from "./components/FaqAccordion";
import { NewsletterForm } from "./components/NewsletterForm";
import { ScrollReveal } from "./components/ScrollReveal";
import { SiteHeader } from "./components/SiteHeader";
import { artists, event, faqs, programme, tickets } from "./lib/content";

export const metadata: Metadata = {
  title: "Shams for Humanity — Copenhagen, 06 September 2026",
  description:
    "A one-day festival of music, art and collective care in Copenhagen. A transparent share of every ticket supports humanitarian and community-led initiatives.",
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <main id="main-content">
      <ScrollReveal />

      <SiteHeader />

      <section className="hero" id="top">
        <div className="heroOrb orbOne" aria-hidden="true" />
        <div className="heroOrb orbTwo" aria-hidden="true" />
        <div className="heroOrb orbThree" aria-hidden="true" />
        <div className="heroMeta topLeft"><span>01 / FIRST EDITION</span><span>MUSIC · ART · SOLIDARITY</span></div>
        <div className="heroMeta topRight"><span>{event.date.slice(0, 2)}.09.2026</span><span>{event.city.toUpperCase()}</span></div>
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

      <section className="statement section" id="about">
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

      <section className="manifesto" id="mission">
        <div className="manifestoShape shapeOne" aria-hidden="true" />
        <div className="manifestoShape shapeTwo" aria-hidden="true" />
        <p className="verticalText">SHAMS MEANS SUN</p>
        <div className="manifestoContent">
          <span className="kicker">OUR GUIDING IDEA</span>
          <h2>Music can move bodies.<br/>Community can move worlds.</h2>
          <div className="manifestoTags"><span>* Listen</span><span>* Gather</span><span>* Act</span></div>
        </div>
      </section>

      <section className="lineup section" id="lineup">
        <div className="sectionHeading">
          <div><div className="sectionIndex">02 — ARTISTS</div><h2>First wave</h2></div>
          <p>Live performances, boundary-pushing selectors and collaborative moments across two stages.</p>
        </div>
        <div className="artistList">
          {artists.map((artist, index) => (
            <article className="artistRow" key={artist.name}>
              <span className="artistNumber">{String(index + 1).padStart(2, "0")}</span>
              <h3>{artist.name}</h3>
              <span>{artist.type}</span><span>{artist.time}</span><span>{artist.stage}</span>
              <button type="button" aria-label={`View ${artist.name}`}><ArrowIcon /></button>
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
          <article><span>01</span><h3>Date & time</h3><p>Sunday<br/>06 September 2026<br/>16:00—02:00</p></article>
          <article><span>02</span><h3>Location</h3><p>Copenhagen<br/>Venue revealed soon<br/>Easy public transport</p></article>
          <article><span>03</span><h3>Experience</h3><p>2 stages<br/>Food & drinks<br/>Art installations</p></article>
          <article><span>04</span><h3>Access</h3><p>18+ event<br/>Step-free routes<br/>Quiet space available</p></article>
        </div>
      </section>

      <section className="programme section">
        <div className="sectionHeading">
          <div><div className="sectionIndex">04 — PROGRAMME</div><h2>A day in motion</h2></div>
          <p>Move between sound, food, ideas and collective experiences at your own pace.</p>
        </div>
        <div className="timeline">
          {programme.map(({ time, label }) => (
            <div key={time}><span>{time}</span><strong>{label}</strong></div>
          ))}
        </div>
      </section>

      <section className="tickets section" id="tickets">
        <div className="ticketGlow" aria-hidden="true" />
        <div className="ticketsHeader"><div className="sectionIndex">05 — TICKETS</div><span>Limited capacity</span></div>
        <h2>Choose your way in.</h2>
        <div className="ticketGrid">
          {tickets.map((ticket) => (
            <article className={ticket.featured ? "featuredTicket" : ""} key={ticket.type}>
              <div>
                <span className="ticketType">{ticket.type}</span>
                <span className="badge">{ticket.badge}</span>
              </div>
              <p>{ticket.description}</p>
              <strong>{ticket.price} <small>{ticket.currency}</small></strong>
              <button type="button" disabled={!ticket.available}>
                {ticket.available ? <>Get ticket <ArrowIcon /></> : "Sold out"}
              </button>
            </article>
          ))}
        </div>
        <p className="ticketFootnote">All prices include fees. A portion of each ticket is donated.</p>
      </section>

      <section className="faq section">
        <div className="sectionHeading"><div><div className="sectionIndex">06 — PRACTICAL</div><h2>Good to know</h2></div></div>
        <FaqAccordion faqs={faqs} />
      </section>

      <section className="newsletter">
        <div className="newsletterOrb" aria-hidden="true" />
        <div><span className="kicker">STAY CLOSE</span><h2>News from<br/>under the sun.</h2></div>
        <NewsletterForm />
      </section>

      <footer>
        <a className="footerLogo" href="#top">Shams for<br/>Humanity</a>
        <div className="footerLinks">
          <div><span>EXPLORE</span><a href="#about">About</a><a href="#lineup">Artists</a><a href="#tickets">Tickets</a></div>
          <div><span>FOLLOW</span><a href="#">Instagram</a><a href="#">Facebook</a><a href="#">Contact</a></div>
        </div>
        <div className="footerBottom"><span>© 2026 SHAMS FOR HUMANITY</span><span>MADE WITH PURPOSE IN COPENHAGEN</span><a href="#top">BACK TO TOP ↑</a></div>
      </footer>
      <div className="browserChromeEndcap" aria-hidden="true" />
    </main>
  );
}
