import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowIcon } from "../../components/ArrowIcon";
import { artists, artistSlug, event, getArtistBySlug } from "../../lib/content";

export function generateStaticParams() {
  return artists.map((artist) => ({ slug: artistSlug(artist.name) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const artist = getArtistBySlug(slug);

  if (!artist) {
    return { title: "Artist not found", robots: { index: false, follow: false } };
  }

  return {
    title: artist.name,
    description: `${artist.name} — ${artist.type} at ${event.name}, ${artist.stage} · ${artist.time}.`,
    alternates: { canonical: `/artists/${artistSlug(artist.name)}` },
  };
}

export default async function ArtistPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const artist = getArtistBySlug(slug);

  if (!artist) notFound();

  return (
    <main className="artistDetail" id="main-content" tabIndex={-1}>
      <p className="eyebrow">{artist.stage}</p>
      <h1>{artist.name}</h1>
      <div className="artistDetailMeta">
        <span>{artist.type}</span>
        <span>{artist.time}</span>
        <span>{event.city} · {event.date}</span>
      </div>
      <p>
        Full artist details will be announced ahead of the event. In the meantime, explore the
        rest of the first-wave lineup or secure your ticket.
      </p>
      <div className="artistDetailActions">
        <Link className="button buttonPrimary" href="/#tickets">
          Get tickets <ArrowIcon />
        </Link>
        <Link className="textLink dark" href="/#lineup">
          Back to lineup <ArrowIcon />
        </Link>
      </div>
    </main>
  );
}
