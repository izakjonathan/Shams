import type {
  Artist,
  ContentRecord,
  ContactPageContent,
  EventContent,
  FaqEntry,
  GalleryImage,
  HomeContent,
  InformationPageContent,
  NavigationItem,
  ProgrammeEntry,
  TicketTier,
} from "./models";

const VALID_STATUSES = new Set(["draft", "placeholder", "published", "archived"]);
const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`[content] ${message}`);
}

function required(value: unknown, path: string): asserts value is string {
  assert(typeof value === "string" && value.trim().length > 0, `${path} must be a non-empty string.`);
}

function validateRecord(record: ContentRecord, path: string) {
  required(record.id, `${path}.id`);
  assert(Number.isFinite(record.sortOrder), `${path}.sortOrder must be a finite number.`);
  assert(VALID_STATUSES.has(record.status), `${path}.status is invalid.`);
}

function validateCollection<T extends ContentRecord>(records: readonly T[], name: string) {
  const ids = new Set<string>();
  const orders = new Set<number>();
  records.forEach((record, index) => {
    const path = `${name}[${index}]`;
    validateRecord(record, path);
    assert(!ids.has(record.id), `${name} contains duplicate id "${record.id}".`);
    assert(!orders.has(record.sortOrder), `${name} contains duplicate sortOrder ${record.sortOrder}.`);
    ids.add(record.id);
    orders.add(record.sortOrder);
  });
}

export function validateContent(input: {
  event: EventContent;
  artists: readonly Artist[];
  gallery: readonly GalleryImage[];
  programme: readonly ProgrammeEntry[];
  tickets: readonly TicketTier[];
  faqs: readonly FaqEntry[];
  informationPages: readonly InformationPageContent[];
  contact: ContactPageContent;
  navigation: readonly NavigationItem[];
  home: HomeContent;
}) {
  required(input.event.id, "event.id");
  required(input.event.name, "event.name");
  assert(!Number.isNaN(Date.parse(input.event.isoStart)), "event.isoStart must be a valid ISO date.");
  assert(!Number.isNaN(Date.parse(input.event.isoEnd)), "event.isoEnd must be a valid ISO date.");
  assert(Date.parse(input.event.isoEnd) > Date.parse(input.event.isoStart), "event.isoEnd must follow isoStart.");

  validateCollection(input.artists, "artists");
  const slugs = new Set<string>();
  input.artists.forEach((artist, index) => {
    required(artist.name, `artists[${index}].name`);
    assert(SLUG_PATTERN.test(artist.slug), `artists[${index}].slug is invalid.`);
    assert(!slugs.has(artist.slug), `artists contains duplicate slug "${artist.slug}".`);
    assert(TIME_PATTERN.test(artist.time), `artists[${index}].time must use HH:MM.`);
    slugs.add(artist.slug);
  });

  validateCollection(input.gallery, "gallery");
  input.gallery.forEach((image, index) => {
    required(image.alt, `gallery[${index}].alt`);
  });

  validateCollection(input.programme, "programme");
  input.programme.forEach((entry, index) => {
    assert(TIME_PATTERN.test(entry.time), `programme[${index}].time must use HH:MM.`);
    required(entry.label, `programme[${index}].label`);
  });

  validateCollection(input.tickets, "tickets");
  input.tickets.forEach((ticket, index) => {
    assert(ticket.price >= 0, `tickets[${index}].price cannot be negative.`);
    required(ticket.currency, `tickets[${index}].currency`);
  });

  validateCollection(input.faqs, "faqs");
  validateCollection(input.navigation, "navigation");
  input.informationPages.forEach((page) => {
    required(page.id, `${page.slug}.id`);
    required(page.title, `${page.slug}.title`);
    validateCollection(page.sections, `${page.slug}.sections`);
  });
  validateCollection(input.contact.routes, "contact.routes");
  required(input.home.id, "home.id");
}
