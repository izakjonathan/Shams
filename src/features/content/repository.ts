import { artists as artistData } from "./data/artists";
import { contactPage } from "./data/contact";
import { event as eventData } from "./data/event";
import { faqs as faqData } from "./data/faq";
import { homeContent } from "./data/home";
import { galleryImages as galleryData } from "./data/gallery";
import { informationPages } from "./data/information-pages";
import { informationNavigation, primaryNavigation } from "./data/navigation";
import { programme as programmeData } from "./data/programme";
import { tickets as ticketData } from "./data/tickets";
import type { Artist, FaqEntry, GalleryImage, InformationPageContent, NavigationItem, ProgrammeEntry, TicketTier } from "./models";
import { validateContent } from "./validation";

const bySortOrder = <T extends { sortOrder: number }>(records: readonly T[]) =>
  [...records].sort((a, b) => a.sortOrder - b.sortOrder);

const artists: Artist[] = bySortOrder<Artist>(artistData);
const gallery: GalleryImage[] = bySortOrder<GalleryImage>(galleryData);
const programme: ProgrammeEntry[] = bySortOrder<ProgrammeEntry>(programmeData);
const tickets: TicketTier[] = bySortOrder<TicketTier>(ticketData);
const faqs: FaqEntry[] = bySortOrder<FaqEntry>(faqData);
const primaryNav = bySortOrder(primaryNavigation);
const informationNav = bySortOrder(informationNavigation);
const infoPages = Object.values(informationPages) as InformationPageContent[];
const allNavigation: NavigationItem[] = [...primaryNav, ...informationNav].map((item, index) => ({ ...item, sortOrder: index + 1 }));

validateContent({
  event: eventData,
  artists,
  gallery,
  programme,
  tickets,
  faqs,
  informationPages: infoPages,
  contact: contactPage,
  navigation: allNavigation,
  home: homeContent,
});

export const contentRepository = {
  getEvent: () => eventData,
  getHome: () => homeContent,
  getArtists: () => artists,
  getGallery: () => gallery,
  getArtistBySlug: (slug: string) => artists.find((artist) => artist.slug === slug),
  getProgramme: () => programme,
  getTickets: () => tickets,
  getFaqs: () => faqs,
  getInformationPage: (slug: keyof typeof informationPages) => informationPages[slug],
  getContactPage: () => contactPage,
  getPrimaryNavigation: () => primaryNav,
  getInformationNavigation: () => informationNav,
} as const;
