import type { StaticImageData } from "next/image";

export type ContentStatus = "draft" | "placeholder" | "published" | "archived";
export type ProgrammeCategory = "all" | "music" | "conversation" | "community";
export type TicketAvailability = "available" | "sold-out" | "coming-soon";

export interface ContentRecord {
  readonly id: string;
  readonly sortOrder: number;
  readonly status: ContentStatus;
}

export interface ArtistLink {
  readonly label: string;
  readonly href?: string;
}

export interface Artist extends ContentRecord {
  readonly slug: string;
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
  readonly image: StaticImageData | string;
  readonly imageAlt: string;
  readonly imagePosition?: string;
}

export interface EventContent {
  readonly id: string;
  readonly status: ContentStatus;
  readonly name: string;
  readonly tagline: string;
  readonly city: string;
  readonly country: string;
  readonly date: string;
  readonly numericDate: string;
  readonly timeRange: string;
  readonly isoStart: string;
  readonly isoEnd: string;
}

export interface ProgrammeEntry extends ContentRecord {
  readonly time: string;
  readonly label: string;
  readonly description: string;
  readonly category: Exclude<ProgrammeCategory, "all">;
  readonly stage: string;
}

export interface TicketTier extends ContentRecord {
  readonly type: string;
  readonly badge: string;
  readonly description: string;
  readonly price: number;
  readonly currency: string;
  readonly availability: TicketAvailability;
  readonly featured?: boolean;
  readonly includes: readonly string[];
}

export interface FaqEntry extends ContentRecord {
  readonly question: string;
  readonly answer: string;
}

export interface InformationSection extends ContentRecord {
  readonly heading: string;
  readonly paragraphs?: readonly string[];
  readonly items?: readonly string[];
}

export interface InformationPageContent {
  readonly id: string;
  readonly slug: "privacy" | "terms" | "accessibility";
  readonly status: ContentStatus;
  readonly index: string;
  readonly title: string;
  readonly intro: string;
  readonly updated: string;
  readonly sections: readonly InformationSection[];
}

export interface ContactRoute extends ContentRecord {
  readonly label: string;
  readonly address: string;
  readonly note: string;
}

export interface ContactPageContent {
  readonly id: string;
  readonly status: ContentStatus;
  readonly index: string;
  readonly titleLines: readonly string[];
  readonly intro: string;
  readonly routes: readonly ContactRoute[];
  readonly organizer: Readonly<Record<string, string>>;
}

export interface NavigationItem extends ContentRecord {
  readonly label: string;
  readonly href: string;
  readonly mobileLabel?: string;
}

export interface HomeContent {
  readonly id: string;
  readonly status: ContentStatus;
  readonly hero: {
    readonly edition: string;
    readonly descriptor: string;
    readonly eyebrow: string;
    readonly titleLines: readonly string[];
    readonly primaryAction: string;
    readonly secondaryAction: string;
    readonly footerLineOne: string;
    readonly footerLineTwo: string;
  };
  readonly about: {
    readonly heading: string;
    readonly lead: string;
    readonly body: string;
  };
  readonly mission: {
    readonly kicker: string;
    readonly headingLines: readonly string[];
    readonly tags: readonly string[];
  };
  readonly lineup: {
    readonly title: string;
    readonly description: string;
    readonly note: string;
  };
  readonly programme: {
    readonly title: string;
    readonly description: string;
  };
  readonly faq: { readonly title: string };
  readonly newsletter: {
    readonly kicker: string;
    readonly titleLines: readonly string[];
  };
}
