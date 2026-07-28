import Image from "next/image";
import Link from "next/link";
import type { Artist } from "../lib/content";
import { ArrowIcon } from "./ArrowIcon";
import { StatusLabel } from "./StatusLabel";

interface ArtistCardProps {
  readonly artist: Artist;
  readonly index: number;
}

export function ArtistCard({ artist, index }: ArtistCardProps) {
  return (
    <article className="artistCard" id={`artist-${artist.slug}`}>
      <Link
        className="artistCardLink"
        href={`/artists/${artist.slug}`}
        aria-label={`View ${artist.name}: ${artist.type}, ${artist.stage} at ${artist.time}`}
      >
        <figure className="artistCardImage">
          <Image
            src={artist.image}
            alt=""
            fill
            priority={index < 2}
            placeholder="blur"
            sizes="(min-width: 1440px) 480px, (min-width: 1200px) 31vw, (min-width: 700px) 48vw, calc(100vw - 36px)"
            style={{ objectPosition: artist.imagePosition ?? "center" }}
          />
          <figcaption>{String(index + 1).padStart(2, "0")}</figcaption>
        </figure>
        <div className="artistCardBody">
          <div className="artistCardMeta">
            <span>{artist.type}</span>
            <span>{artist.time}</span>
            <span>{artist.stage}</span>
          </div>
          <h3>{artist.name}</h3>
          <div className="artistCardFooter">
            <StatusLabel status={artist.status} />
            <span className="artistCardArrow" aria-hidden="true"><ArrowIcon /></span>
          </div>
        </div>
      </Link>
    </article>
  );
}
