"use client";

import { useEffect, useState } from "react";

const artists = [
  { name: "Nour", type: "Live", time: "18:30", stage: "Sun Stage" },
  { name: "Maya Al Khalil", type: "DJ Set", time: "20:00", stage: "Orbit Stage" },
  { name: "Aïsha Devi", type: "Live A/V", time: "21:30", stage: "Sun Stage" },
  { name: "Sama' Abdulhadi", type: "DJ Set", time: "23:00", stage: "Orbit Stage" },
  { name: "Habibi Funk", type: "DJ Set", time: "00:30", stage: "Sun Stage" },
  { name: "Community Choir", type: "Opening", time: "17:00", stage: "Garden" },
];

const faqs = [
  ["Where does the event take place?", "The first edition is planned for Copenhagen. The final venue and access details will be announced to ticket holders."],
  ["Is the event accessible?", "Yes. We are designing step-free routes, accessible toilets, seating areas and a quiet space. Contact us for individual access needs."],
  ["What does my ticket support?", "A transparent share of proceeds supports humanitarian organisations and community-led initiatives."],
  ["Can I volunteer?", "Yes. Volunteer registration will open with roles across hospitality, production, access and guest care."],
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <main>
      <header className="siteHeader">
        <a className="brand" href="#top" aria-label="Shams for Humanity home">
          <span className="brandMark">✦</span>
          <span>SHAMS / HUMANITY</span>
        </a>
        <nav className="desktopNav" aria-label="Primary navigation">
          <a href="#about">About</a><a href="#lineup">Artists</a><a href="#info">Info</a><a href="#tickets">Tickets</a>
        </nav>
        <button className="menuButton" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-controls="mobile-menu">
          <span>{menuOpen ? "Close" : "Menu"}</span>
          <span className="menuIcon" aria-hidden="true">{menuOpen ? "×" : "＋"}</span>
      </button>
      </header>

      <div id="mobile-menu" className={`mobileMenu ${menuOpen ? "isOpen" : ""}`} aria-hidden={!menuOpen}>
        <nav>
          <a onClick={closeMenu} href="#about">About <span>01</span></a>
          <a onClick={closeMenu} href="#lineup">Artists <span>02</span></a>
          <a onClick={closeMenu} href="#info">Event info <span>03</span></a>
          <a onClick={closeMenu} href="#tickets">Tickets <span>04</span></a>
        </nav>
        <p>Copenhagen · 06 September 2026</p>
      </div>

      <section className="hero" id="top">
        <div className="heroOrb orbOne"/><div className="heroOrb orbTwo"/><div className="heroOrb orbThree"/>
        <div className="orbit orbitA"><i/><i/></div><div className="orbit orbitB"><i/></div>
        <div className="heroMeta topLeft"><span>01 / FIRST EDITION</span><span>MUSIC · ART · SOLIDARITY</span></div>
        <div className="heroMeta topRight"><span>06.09.2026</span><span>COPENHAGEN</span></div>
        <div className="heroCenter">
          <p className="eyebrow">A gathering in support of collective care</p>
          <h1>Shams for<br/>Humanity</h1>
          <div className="heroActions">
            <a className="button buttonPrimary" href="#tickets">Get tickets <span></span></a>
            <a className="textLink" href="#about">Discover the festival <span>↓</span></a>
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
            <a className="textLink dark" href="#mission">Our mission <span></span></a>
          </div>
        </div>
      </section>

      <section className="manifesto" id="mission">
        <div className="manifestoShape shapeOne"/><div className="manifestoShape shapeTwo"/>
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
              <button aria-label={`View ${artist.name}`}></button>
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
          {[['16:00','Doors + welcome'],['17:00','Community opening'],['18:30','Live programme'],['21:30','Night programme'],['00:30','Closing sessions'],['02:00','End']].map(([time,label]) => <div key={time}><span>{time}</span><strong>{label}</strong></div>)}
        </div>
      </section>

      <section className="tickets section" id="tickets">
        <div className="ticketGlow"/>
        <div className="ticketsHeader"><div className="sectionIndex">05 — TICKETS</div><span>Limited capacity</span></div>
        <h2>Choose your way in.</h2>
        <div className="ticketGrid">
          <article><div><span className="ticketType">EARLY SUPPORTER</span><span className="badge">Sold out</span></div><p>For those who believed first.</p><strong>195 <small>DKK</small></strong><button disabled>Sold out</button></article>
          <article className="featuredTicket"><div><span className="ticketType">GENERAL ADMISSION</span><span className="badge">Available</span></div><p>Full access to all music, art and spaces.</p><strong>275 <small>DKK</small></strong><button>Get ticket <span></span></button></article>
          <article><div><span className="ticketType">SOLIDARITY TICKET</span><span className="badge">Available</span></div><p>Entry plus an additional direct donation.</p><strong>395 <small>DKK</small></strong><button>Get ticket <span></span></button></article>
        </div>
        <p className="ticketFootnote">All prices include fees. A portion of each ticket is donated.</p>
      </section>

      <section className="faq section">
        <div className="sectionHeading"><div><div className="sectionIndex">06 — PRACTICAL</div><h2>Good to know</h2></div></div>
        <div className="faqList">
          {faqs.map(([question, answer], index) => (
            <article className={openFaq === index ? "open" : ""} key={question}>
              <button onClick={() => setOpenFaq(openFaq === index ? null : index)} aria-expanded={openFaq === index}>
                <span>{question}</span><i>{openFaq === index ? "−" : "+"}</i>
            </button>
              <div className="faqAnswer"><p>{answer}</p></div>
            </article>
          ))}
        </div>
      </section>

      <section className="newsletter">
        <div className="newsletterOrb"/>
        <div><span className="kicker">STAY CLOSE</span><h2>News from<br/>under the sun.</h2></div>
        <form onSubmit={(e) => e.preventDefault()}><label htmlFor="email">Email address</label><div><input id="email" type="email" placeholder="you@example.com"/><button type="submit">Join us </button></div><p>No noise. Only meaningful updates.</p></form>
      </section>

      <footer>
        <a className="footerLogo" href="#top">Shams for<br/>Humanity</a>
        <div className="footerLinks"><div><span>EXPLORE</span><a href="#about">About</a><a href="#lineup">Artists</a><a href="#tickets">Tickets</a></div><div><span>FOLLOW</span><a href="#">Instagram</a><a href="#">Facebook</a><a href="#">Contact</a></div></div>
        <div className="footerBottom"><span>© 2026 SHAMS FOR HUMANITY</span><span>MADE WITH PURPOSE IN COPENHAGEN</span><a href="#top">BACK TO TOP ↑</a></div>
      </footer>
    </main>
  );
}
