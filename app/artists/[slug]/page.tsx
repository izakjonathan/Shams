import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowIcon } from "../../components/ArrowIcon";
import { artists, artistSlug, event, getArtistBySlug } from "../../lib/content";

export function generateStaticParams() {
  return artists.map((artist) => ({ slug: artistSlug(artist.name) }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const artist = getArtistBySlug(slug);

  if (!artist) return { title: "Artist not found", robots: { index: false, follow: false } };

  return {
    title: artist.name,
    description: `${artist.shortBio} ${artist.name} performs at ${event.name}, ${artist.stage} at ${artist.time}.`,
    alternates: { canonical: `/artists/${artistSlug(artist.name)}` },
    openGraph: {
      title: artist.name,
      description: artist.shortBio,
      images: [{ url: artist.image, alt: artist.imageAlt }],
    },
  };
}

export default async function ArtistPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const artist = getArtistBySlug(slug);
  if (!artist) notFound();

  const artistIndex = artists.findIndex((entry) => entry.name === artist.name);
  const nextArtist = artists[(artistIndex + 1) % artists.length];

  return (
    <main className="artistPage" id="main-content" tabIndex={-1}>
      <section className="artistHero paperGlowSection">
        <div className="paperGlow glowOne" aria-hidden="true" />
        <div className="paperGlow glowTwo" aria-hidden="true" />
        <div className="paperGlow glowThree" aria-hidden="true" />
        <div className="artistHeroTopline">
          <span>ARTIST {String(artistIndex + 1).padStart(2, "0")} / {String(artists.length).padStart(2, "0")}</span>
          <Link href="/#lineup">Back to lineup ↑</Link>
        </div>
        <div className="artistHeroGrid">
          <div className="artistHeroCopy">
            <p className="eyebrow">{artist.stage} · {artist.time}</p>
            <h1>{artist.name}</h1>
            <p className="artistStandfirst">{artist.shortBio}</p>
          </div>
          <figure className="artistPortrait">
            <Image
              className="artistPortraitImage"
              src={artist.image}
              alt={artist.imageAlt}
              fill
              priority
              sizes="(min-width: 760px) 38vw, 100vw"
              style={{ objectPosition: artist.imagePosition ?? "center" }}
            />
            <figcaption>{artist.name} · Artist image</figcaption>
          </figure>
        </div>
        <div className="artistFactBar">
          <div><span>FORMAT</span><strong>{artist.type}</strong></div>
          <div><span>FROM</span><strong>{artist.origin}</strong></div>
          <div><span>SOUND</span><strong>{artist.genre}</strong></div>
          <div><span>PRONOUNS</span><strong>{artist.pronouns ?? "To be confirmed"}</strong></div>
        </div>
      </section>

      <section className="artistEditorial section">
        <div className="artistEditorialLead">
          <span className="sectionIndex">01 — ABOUT</span>
          <h2>Inside the sound</h2>
        </div>
        <div className="artistBiography">
          {artist.biography.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
      </section>

      <section className="artistQuote darkGlowSection">
        <div className="darkGlow darkGlowOne" aria-hidden="true" />
        <span className="kicker">IN THEIR WORDS</span>
        <blockquote>“{artist.quote}”</blockquote>
      </section>

      <section className="artistSet section paperGlowSection">
        <div className="paperGlow glowOne" aria-hidden="true" />
        <div className="paperGlow glowTwo" aria-hidden="true" />
        <div className="paperGlow glowThree" aria-hidden="true" />
        <div className="artistSetIntro">
          <span className="sectionIndex">02 — AT SHAMS</span>
          <h2>The performance</h2>
          <p>{artist.setDescription}</p>
        </div>
        <div className="artistSetCard">
          <div><span>DATE</span><strong>{event.date}</strong></div>
          <div><span>TIME</span><strong>{artist.time}</strong></div>
          <div><span>STAGE</span><strong>{artist.stage}</strong></div>
          <div><span>TYPE</span><strong>{artist.type}</strong></div>
        </div>
        <ul className="artistHighlights" aria-label="Performance highlights">
          {artist.highlights.map((highlight, index) => (
            <li key={highlight}><span>{String(index + 1).padStart(2, "0")}</span>{highlight}</li>
          ))}
        </ul>
      </section>

      <section className="artistLinks section">
        <div>
          <span className="sectionIndex light">03 — EXPLORE</span>
          <h2>Follow the artist</h2>
        </div>
        <div className="artistLinkList">
          {artist.links.map((link) => (
            link.href === "#" ? (
              <span className="artistExternalLink isPlaceholder" key={link.label} aria-disabled="true">
                {link.label}<small>Link coming soon</small>
              </span>
            ) : (
              <a className="artistExternalLink" href={link.href} key={link.label} target="_blank" rel="noreferrer">
                {link.label}<ArrowIcon />
              </a>
            )
          ))}
        </div>
      </section>

      <nav className="nextArtist" aria-label="Continue through the lineup">
        <span>NEXT ARTIST</span>
        <Link href={`/artists/${artistSlug(nextArtist.name)}`}>
          <strong>{nextArtist.name}</strong><ArrowIcon />
        </Link>
      </nav>
    </main>
  );
}
