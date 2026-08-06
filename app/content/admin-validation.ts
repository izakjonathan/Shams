import type { ContentStatus, ProgrammeCategory, TicketAvailability } from "./models";

export type AdminContentType = "artist" | "gallery" | "programme" | "ticket" | "faq" | "page";

const VALID_STATUSES = new Set<ContentStatus>(["draft", "placeholder", "published", "archived"]);
const VALID_PROGRAMME_CATEGORIES = new Set<Exclude<ProgrammeCategory, "all">>(["music", "conversation", "community"]);
const VALID_TICKET_AVAILABILITY = new Set<TicketAvailability>(["available", "sold-out", "coming-soon"]);
const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function fail(message: string): never {
  throw new Error(`[admin content] ${message}`);
}

function object(value: unknown, path: string): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) fail(`${path} must be an object.`);
  return value as Record<string, unknown>;
}

function string(value: unknown, path: string): string {
  if (typeof value !== "string" || value.trim().length === 0) fail(`${path} must be a non-empty string.`);
  return value.trim();
}

function optionalString(value: unknown, path: string): string | undefined {
  if (value == null || value === "") return undefined;
  return string(value, path);
}

function finiteNumber(value: unknown, path: string): number {
  if (typeof value !== "number" || !Number.isFinite(value)) fail(`${path} must be a finite number.`);
  return value;
}

function stringArray(value: unknown, path: string): string[] {
  if (!Array.isArray(value)) fail(`${path} must be an array.`);
  return value.map((item, index) => string(item, `${path}[${index}]`));
}

function validateCommon(data: Record<string, unknown>, metadata: AdminRecordMetadata) {
  if (string(data.id, "data.id") !== metadata.id) fail("JSON id must match the stable record id.");
  if (!VALID_STATUSES.has(metadata.status)) fail(`status "${metadata.status}" is invalid.`);
  if (data.status !== metadata.status) fail("JSON status must match the selected status.");
  if (metadata.type !== "page" || "sortOrder" in data) {
    if (finiteNumber(data.sortOrder, "data.sortOrder") !== metadata.sortOrder) fail("JSON sortOrder must match the selected sort order.");
  }
}

function validateArtist(data: Record<string, unknown>, metadata: AdminRecordMetadata) {
  const slug = string(data.slug, "artist.slug");
  if (!SLUG_PATTERN.test(slug)) fail("artist.slug must use lowercase words separated by hyphens.");
  if (metadata.slug !== slug) fail("Artist JSON slug must match the slug field.");
  string(data.name, "artist.name");
  string(data.type, "artist.type");
  const time = string(data.time, "artist.time");
  if (!TIME_PATTERN.test(time)) fail("artist.time must use HH:MM.");
  string(data.stage, "artist.stage");
  string(data.origin, "artist.origin");
  string(data.genre, "artist.genre");
  optionalString(data.pronouns, "artist.pronouns");
  string(data.shortBio, "artist.shortBio");
  stringArray(data.biography, "artist.biography");
  string(data.quote, "artist.quote");
  string(data.setDescription, "artist.setDescription");
  stringArray(data.highlights, "artist.highlights");
  string(data.imageAlt, "artist.imageAlt");
  if (!(typeof data.image === "string" || (data.image && typeof data.image === "object"))) fail("artist.image must be a stored image path or image object.");
  if (!Array.isArray(data.links)) fail("artist.links must be an array.");
  data.links.forEach((link, index) => {
    const item = object(link, `artist.links[${index}]`);
    string(item.label, `artist.links[${index}].label`);
    optionalString(item.href, `artist.links[${index}].href`);
  });
}


function validateGallery(data: Record<string, unknown>) {
  if (!(typeof data.image === "string" || (data.image && typeof data.image === "object"))) fail("gallery.image must be a stored image path or image object.");
  string(data.alt, "gallery.alt");
}

function validateProgramme(data: Record<string, unknown>) {
  const time = string(data.time, "programme.time");
  if (!TIME_PATTERN.test(time)) fail("programme.time must use HH:MM.");
  string(data.label, "programme.label");
  string(data.description, "programme.description");
  string(data.stage, "programme.stage");
  const category = string(data.category, "programme.category") as Exclude<ProgrammeCategory, "all">;
  if (!VALID_PROGRAMME_CATEGORIES.has(category)) fail(`programme.category "${category}" is invalid.`);
}

function validateTicket(data: Record<string, unknown>) {
  string(data.type, "ticket.type");
  string(data.badge, "ticket.badge");
  string(data.description, "ticket.description");
  const price = finiteNumber(data.price, "ticket.price");
  if (price < 0) fail("ticket.price cannot be negative.");
  string(data.currency, "ticket.currency");
  const availability = string(data.availability, "ticket.availability") as TicketAvailability;
  if (!VALID_TICKET_AVAILABILITY.has(availability)) fail(`ticket.availability "${availability}" is invalid.`);
  if (data.featured != null && typeof data.featured !== "boolean") fail("ticket.featured must be a boolean.");
  stringArray(data.includes, "ticket.includes");
}

function validateFaq(data: Record<string, unknown>) {
  string(data.question, "faq.question");
  string(data.answer, "faq.answer");
}

function validatePage(data: Record<string, unknown>, metadata: AdminRecordMetadata) {
  if (metadata.slug && data.slug !== metadata.slug) fail("Page JSON slug must match the slug field.");
  if ("routes" in data) {
    string(data.index, "contact.index");
    stringArray(data.titleLines, "contact.titleLines");
    string(data.intro, "contact.intro");
    if (!Array.isArray(data.routes)) fail("contact.routes must be an array.");
    data.routes.forEach((route, index) => {
      const item = object(route, `contact.routes[${index}]`);
      string(item.id, `contact.routes[${index}].id`);
      finiteNumber(item.sortOrder, `contact.routes[${index}].sortOrder`);
      string(item.status, `contact.routes[${index}].status`);
      string(item.label, `contact.routes[${index}].label`);
      string(item.address, `contact.routes[${index}].address`);
      string(item.note, `contact.routes[${index}].note`);
    });
    object(data.organizer, "contact.organizer");
    return;
  }

  const slug = string(data.slug, "page.slug");
  if (!new Set(["privacy", "terms", "accessibility"]).has(slug)) fail(`page.slug "${slug}" is invalid.`);
  string(data.index, "page.index");
  string(data.title, "page.title");
  string(data.intro, "page.intro");
  string(data.updated, "page.updated");
  if (!Array.isArray(data.sections)) fail("page.sections must be an array.");
  data.sections.forEach((section, index) => {
    const item = object(section, `page.sections[${index}]`);
    string(item.id, `page.sections[${index}].id`);
    finiteNumber(item.sortOrder, `page.sections[${index}].sortOrder`);
    string(item.status, `page.sections[${index}].status`);
    string(item.heading, `page.sections[${index}].heading`);
    if (item.paragraphs != null) stringArray(item.paragraphs, `page.sections[${index}].paragraphs`);
    if (item.items != null) stringArray(item.items, `page.sections[${index}].items`);
  });
}

export interface AdminRecordMetadata {
  readonly id: string;
  readonly type: AdminContentType;
  readonly slug: string | null;
  readonly status: ContentStatus;
  readonly sortOrder: number;
}

export function parseContentStatus(value: unknown): ContentStatus {
  const status = String(value ?? "draft") as ContentStatus;
  if (!VALID_STATUSES.has(status)) fail(`status "${status}" is invalid.`);
  return status;
}

export function validateAdminRecord(dataInput: unknown, metadata: AdminRecordMetadata): Record<string, unknown> {
  const data = object(dataInput, "data");
  validateCommon(data, metadata);
  if (metadata.type === "artist") validateArtist(data, metadata);
  else if (metadata.type === "gallery") validateGallery(data);
  else if (metadata.type === "programme") validateProgramme(data);
  else if (metadata.type === "ticket") validateTicket(data);
  else if (metadata.type === "faq") validateFaq(data);
  else validatePage(data, metadata);
  return data;
}
