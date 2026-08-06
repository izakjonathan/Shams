import gallery01 from "../../../public/images/gallery/gallery-01.webp";
import gallery02 from "../../../public/images/gallery/gallery-02.webp";
import gallery03 from "../../../public/images/gallery/gallery-03.webp";
import gallery04 from "../../../public/images/gallery/gallery-04.webp";
import gallery05 from "../../../public/images/gallery/gallery-05.webp";
import gallery06 from "../../../public/images/gallery/gallery-06.webp";
import gallery07 from "../../../public/images/gallery/gallery-07.webp";
import gallery08 from "../../../public/images/gallery/gallery-08.webp";
import gallery09 from "../../../public/images/gallery/gallery-09.webp";
import gallery10 from "../../../public/images/gallery/gallery-10.webp";
import gallery11 from "../../../public/images/gallery/gallery-11.webp";
import gallery12 from "../../../public/images/gallery/gallery-12.webp";
import gallery13 from "../../../public/images/gallery/gallery-13.webp";
import gallery14 from "../../../public/images/gallery/gallery-14.webp";
import type { GalleryImage } from "../models";

export const galleryImages: readonly GalleryImage[] = [
  { id: "gallery-life-in-lilac-hands", sortOrder: 1, status: "published", image: gallery02, alt: "Hands reaching above purple flowers beneath a bright sky." },
  { id: "gallery-life-in-lilac-field", sortOrder: 2, status: "published", image: gallery06, alt: "A person walking through a flower field beneath an open sky." },
  { id: "gallery-pride-performance", sortOrder: 3, status: "published", image: gallery07, alt: "A performer framed by vivid pink and blue stage lighting." },
  { id: "gallery-pride-friends", sortOrder: 4, status: "published", image: gallery08, alt: "Two friends smiling together in a backstage corridor." },
  { id: "gallery-green-courtside", sortOrder: 5, status: "published", image: gallery09, alt: "A smiling person leaning beside a sports court fence." },
  { id: "gallery-day-tripping-field", sortOrder: 6, status: "published", image: gallery12, alt: "Friends resting together in a green field." },
  { id: "gallery-day-tripping-train", sortOrder: 7, status: "published", image: gallery14, alt: "Two people embracing beside a railway platform." },
  { id: "gallery-day-tripping-window", sortOrder: 8, status: "published", image: gallery13, alt: "Two people talking beside a sunlit window." },
  { id: "gallery-day-tripping-walk", sortOrder: 9, status: "published", image: gallery11, alt: "Friends walking together through a wooded landscape." },
  { id: "gallery-day-tripping-crowd", sortOrder: 10, status: "published", image: gallery10, alt: "A small crowd moving through a warmly lit indoor space." },
  { id: "gallery-life-in-lilac-portrait", sortOrder: 11, status: "published", image: gallery01, alt: "Close portrait with sunlight casting striped shadows across the face." },
  { id: "gallery-life-in-lilac-flowers", sortOrder: 12, status: "published", image: gallery04, alt: "A person holding a bouquet of purple flowers in a field." },
  { id: "gallery-life-in-lilac-detail", sortOrder: 13, status: "published", image: gallery05, alt: "A close detail of lilac fabric and sunlight." },
  { id: "gallery-life-in-lilac-sky", sortOrder: 14, status: "published", image: gallery03, alt: "Raised hands and lavender flowers beneath drifting clouds." },
];
