import type { StaticImageData } from "next/image";
import type { ContentStatus } from "./status";
import artist01 from "../../../public/images/artists/artist-01.webp";
import artist02 from "../../../public/images/artists/artist-02.webp";
import artist03 from "../../../public/images/artists/artist-03.webp";
import artist04 from "../../../public/images/artists/artist-04.webp";
import artist05 from "../../../public/images/artists/artist-05.webp";

export interface ArtistLink {
  readonly label: string;
  readonly href?: string;
}

export interface Artist {
  readonly slug: string;
  readonly status: ContentStatus;
  readonly name: string;
  readonly type: string;
  readonly time: string;
  readonly stage: string;
  readonly origin: string;
  readonly genre: string;
  readonly pronouns?: string;
  readonly shortBio: string;
  readonly biography: readonly string[];
  readonly quote: string;
  readonly setDescription: string;
  readonly highlights: readonly string[];
  readonly links: readonly ArtistLink[];
  readonly image: StaticImageData;
  readonly imageAlt: string;
  readonly imagePosition?: string;
}

export const artists = [
  {
    slug: "nour",
    status: "placeholder",
    name: "Nour",
    type: "Live",
    time: "18:30",
    stage: "Sun Stage",
    origin: "Copenhagen / Beirut",
    genre: "Alternative pop · electronic",
    pronouns: "they / them",
    shortBio: "A luminous live set where intimate songwriting meets spacious electronic production.",
    biography: [
      "Nour moves between close-up vocals, textured electronics and songs shaped by memory, movement and belonging. Their work creates a space that feels both personal and collective.",
      "For Shams for Humanity, Nour presents a newly developed live performance built around voice, synthesis and visual atmosphere. This placeholder biography will be replaced with the artist-approved text before publication.",
    ],
    quote: "I want the room to feel like somewhere we can arrive together.",
    setDescription: "A full live performance created for the opening arc of the evening, moving from quiet detail to expansive rhythm.",
    highlights: ["New live arrangement", "Visual collaboration", "Festival premiere"],
    image: artist02,
    imageAlt: "Artist portrait in a nighttime event setting.",
    imagePosition: "center 42%",
    links: [{ label: "Instagram" }, { label: "Listen" }, { label: "Website" }],
  },
  {
    slug: "maya-al-khalil",
    status: "placeholder",
    name: "Maya Al Khalil",
    type: "DJ Set",
    time: "20:00",
    stage: "Orbit Stage",
    origin: "London / Beirut",
    genre: "Club · experimental · regional rhythms",
    pronouns: "she / her",
    shortBio: "A wide-ranging selector connecting contemporary club music with unexpected regional and archival sounds.",
    biography: [
      "Maya Al Khalil builds sets around contrast: pressure and release, familiarity and surprise, deep rhythm and moments of suspension. Her selections cross scenes without flattening their character.",
      "Her Shams set is imagined as a generous, high-energy journey designed for an open-minded dance floor. This is temporary editorial copy pending final artist approval.",
    ],
    quote: "The best dance floors make room for many histories at once.",
    setDescription: "A two-hour DJ set moving through percussive club music, left-field electronics and shared musical references.",
    highlights: ["Extended set", "Cross-genre selection", "Orbit Stage debut"],
    image: artist03,
    imageAlt: "Artist performing in a colorful club environment.",
    imagePosition: "center 48%",
    links: [{ label: "Instagram" }, { label: "SoundCloud" }, { label: "Website" }],
  },
  {
    slug: "aisha-devi",
    status: "placeholder",
    name: "Aïsha Devi",
    type: "Live A/V",
    time: "21:30",
    stage: "Sun Stage",
    origin: "Switzerland",
    genre: "Electronic · vocal · audiovisual",
    pronouns: "she / her",
    shortBio: "An immersive audiovisual performance where voice, bass and light become a single physical language.",
    biography: [
      "Aïsha Devi’s work explores the voice as material, signal and force. Her performances move beyond conventional song form into a highly physical encounter between sound, body and space.",
      "At Shams for Humanity, the live show will transform the Sun Stage through a synchronized audiovisual environment. This placeholder text is intended only to demonstrate the final editorial structure.",
    ],
    quote: "Sound can dissolve the border between the individual and the room.",
    setDescription: "A concentrated audiovisual live show combining processed voice, low-frequency electronics and responsive visual design.",
    highlights: ["Full A/V production", "Immersive sound", "One-off festival presentation"],
    image: artist04,
    imageAlt: "Artist portrait photographed at an event.",
    imagePosition: "center 36%",
    links: [{ label: "Instagram" }, { label: "Listen" }, { label: "Website" }],
  },
  {
    slug: "sama-abdulhadi",
    status: "placeholder",
    name: "Sama' Abdulhadi",
    type: "DJ Set",
    time: "23:00",
    stage: "Orbit Stage",
    origin: "Ramallah",
    genre: "Techno",
    pronouns: "she / her",
    shortBio: "A direct, driving techno set shaped by precision, momentum and an uncompromising sense of purpose.",
    biography: [
      "Sama' Abdulhadi is known for focused sets that build energy through clarity rather than excess. Her approach joins technical control with a strong understanding of collective movement.",
      "The Orbit Stage performance anchors the late-night programme with a long-form set designed to gather the full room. Final biography and approved credits will be added before launch.",
    ],
    quote: "A powerful room is built through trust between the artist and the crowd.",
    setDescription: "A peak-time techno set with an extended progression, clean transitions and a strong physical arc.",
    highlights: ["Peak-time set", "Extended progression", "Orbit Stage headline"],
    image: artist05,
    imageAlt: "Artist portrait in a warm, atmospheric interior.",
    imagePosition: "center 40%",
    links: [{ label: "Instagram" }, { label: "Listen" }, { label: "Website" }],
  },
  {
    slug: "habibi-funk",
    status: "placeholder",
    name: "Habibi Funk",
    type: "DJ Set",
    time: "00:30",
    stage: "Sun Stage",
    origin: "Berlin",
    genre: "Arabic funk · soul · disco",
    shortBio: "A celebratory selection of funk, soul, disco and other recordings from across the Arab world and its diasporas.",
    biography: [
      "Habibi Funk brings together music discovered through deep archival research, reissue work and long-term relationships with artists and their families. The result is a joyful but carefully contextualized listening experience.",
      "The closing Sun Stage set will move through warm grooves, rare recordings and dance-floor discoveries. This copy is provisional and will be replaced with final label-approved information.",
    ],
    quote: "Discovery matters most when the stories behind the music travel with it.",
    setDescription: "A late-night vinyl-led journey through funk, soul, disco and overlooked regional recordings.",
    highlights: ["Vinyl selection", "Archive discoveries", "Sun Stage closing set"],
    image: artist01,
    imageAlt: "Two artists beside DJ equipment at a live event.",
    imagePosition: "center center",
    links: [{ label: "Instagram" }, { label: "Bandcamp" }, { label: "Website" }],
  },
  {
    slug: "community-choir",
    status: "placeholder",
    name: "Community Choir",
    type: "Opening",
    time: "17:00",
    stage: "Garden",
    origin: "Copenhagen",
    genre: "Collective voice · participatory performance",
    shortBio: "A specially assembled community choir opening the festival through shared voice, welcome and collective presence.",
    biography: [
      "The Shams Community Choir brings together singers with different levels of experience for a performance rooted in participation rather than perfection. The project is developed through a short series of open rehearsals.",
      "Their opening performance invites the audience into the values of the day: listening, gathering and acting together. Rehearsal information and final contributor credits will be added later.",
    ],
    quote: "No single voice has to carry the whole song.",
    setDescription: "A welcoming outdoor performance combining prepared material, spoken text and a simple audience participation moment.",
    highlights: ["Community-led", "Open rehearsals", "Festival opening"],
    image: artist01,
    imageAlt: "Artists and guests gathered around a DJ booth.",
    imagePosition: "center center",
    links: [{ label: "Join the choir" }, { label: "Project notes" }],
  },
] as const satisfies readonly Artist[];

export const getArtistBySlug = (slug: string): Artist | undefined =>
  artists.find((artist) => artist.slug === slug);
