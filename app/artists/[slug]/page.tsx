import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowIcon } from "../../components/ArrowIcon";
import { ArtistNavigation } from "../../components/ArtistNavigation";
import { PageCloseButton } from "../../components/PageCloseButton";
import { contentRepository } from "../../content";
import { publicContentRepository } from "../../content/server";

const localArtists = contentRepository.getArtists();
const event = contentRepository.getEvent();

export const dynamicParams = true;

export function generateStaticParams() {
  return localArtists.map((artist) => ({ slug: artist.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const artist = await publicContentRepository.getArtistBySlug(slug);

  if (!artist) return { title: "Artist not found", robots: { index: false, follow: false } };

  return {
    title: artist.name,
    description: `${artist.shortBio} ${artist.name} performs at ${event.name}, ${artist.stage} at ${artist.time}.`,
    alternates: { canonical: `/artists/${artist.slug}` },
    openGraph: {
      title: artist.name,
      description: artist.shortBio,
      images: [{ url: typeof artist.image === "string" ? artist.image : artist.image.src, alt: artist.imageAlt }],
    },
  };
}

export default async function ArtistPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const artists = await publicContentRepository.getArtists();
  const artist = artists.find((entry) => entry.slug === slug);
  if (!artist) {
    notFound();
    throw new Error("Artist not found");
  }

  const artistIndex = artists.findIndex((entry) => entry.slug === artist.slug);
  const previousArtist = artists[(artistIndex - 1 + artists.length) % artists.length];
  const nextArtist = artists[(artistIndex + 1) % artists.length];

  return (
    <main className="artistPage" id="main-content" tabIndex={-1}>
      <PageCloseButton
        href={`/#artist-${artist.slug}`}
        label="Close the artist page and return to the lineup"
        className="artistPageClose"
      />
      <section className="artistHero paperGlowSection">
        <div className="paperGlow glowOne" aria-hidden="true" />
        <div className="paperGlow glowTwo" aria-hidden="true" />
        <div className="paperGlow glowThree" aria-hidden="true" />
        <div className="artistHeroTopline">
          <span>ARTIST {String(artistIndex + 1).padStart(2, "0")} / {String(artists.length).padStart(2, "0")}</span>
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
              placeholder={typeof artist.image === "string" ? "empty" : "blur"}
              sizes="(min-width: 1400px) 580px, (min-width: 760px) 38vw, calc(100vw - 36px)"
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
            !link.href ? (
              <span className="artistExternalLink isPlaceholder" key={link.label} aria-disabled="true">
                {link.label}<small>Link coming soon</small>
              </span>
            ) : (
              <a className="artistExternalLink" href={link.href} key={link.label} target="_blank" rel="noreferrer">
                {link.label}<ArrowIcon /><span className="srOnly"> (opens in a new tab)</span>
              </a>
            )
          ))}
        </div>
      </section>

      <ArtistNavigation previous={previousArtist} next={nextArtist} />
    </main>
  );
}
