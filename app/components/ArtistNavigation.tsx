import Link from "next/link";
import type { Artist } from "../lib/content";
import { ArrowIcon } from "./ArrowIcon";

interface ArtistNavigationProps {
  readonly previous: Artist;
  readonly next: Artist;
}

export function ArtistNavigation({ previous, next }: ArtistNavigationProps) {
  return (
    <nav className="artistNavigation" aria-label="Browse the artist lineup">
      <Link className="artistNavigationLink isPrevious" href={`/artists/${previous.slug}`}>
        <span className="artistNavigationDirection"><ArrowIcon /> Previous artist</span>
        <strong>{previous.name}</strong>
      </Link>
      <Link className="artistNavigationLink isNext" href={`/artists/${next.slug}`}>
        <span className="artistNavigationDirection">Next artist <ArrowIcon /></span>
        <strong>{next.name}</strong>
      </Link>
    </nav>
  );
}
