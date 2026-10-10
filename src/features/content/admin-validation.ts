import { HOME_FIELDS, HOME_ARRAY_FIELDS } from "./home-fields";
import { isLocalMedia } from "./media-path";
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

function image(value: unknown, path: string) {
  if (!isLocalMedia(value)) fail(`${path} must be a local image path.`);
}

function nestedMetadata(item: Record<string, unknown>, path: string) {
  string(item.id, `${path}.id`);
  if (!Number.isInteger(item.sortOrder)) fail(`${path}.sortOrder must be an integer.`);
  if (!VALID_STATUSES.has(item.status as ContentStatus)) fail(`${path}.status is invalid.`);
}
function uniqueIds(items: unknown[], path: string) {
  const ids = items.map((item) => object(item, path).id);
  if (new Set(ids).size !== ids.length) fail(`${path} contains duplicate IDs.`);
}
function validateCommon(data: Record<string, unknown>, metadata: AdminRecordMetadata) {
  if (!Number.isInteger(metadata.sortOrder) || metadata.sortOrder < -2147483648 || metadata.sortOrder > 2147483647) fail("sortOrder must be a PostgreSQL integer.");
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
  image(data.image, "artist.image");
  if (!Array.isArray(data.links)) fail("artist.links must be an array.");
  data.links.forEach((link, index) => {
    const item = object(link, `artist.links[${index}]`);
    string(item.label, `artist.links[${index}].label`);
    const href = optionalString(item.href, `artist.links[${index}].href`);
    if (href) {
      let url: URL;
      try { url = new URL(href); } catch { fail("Artist links must be absolute HTTPS URLs."); }
      if (url.protocol !== "https:" || url.username || url.password) fail("Artist links must be HTTPS URLs without credentials.");
    }
  });
}


function validateGallery(data: Record<string, unknown>) {
  image(data.image, "gallery.image");
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
  if (!/^[A-Z]{3}$/.test(string(data.currency, "ticket.currency"))) fail("ticket.currency must be a three-letter uppercase code.");
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
  if (metadata.id === "page-home") {
    if (metadata.slug !== null) fail("Homepage cannot have a slug.");
    for (const [group, definition] of Object.entries(HOME_FIELDS)) {
      const values = object(data[group], `homepage.${group}`);
      for (const key of Object.keys(definition.fields)) {
        if (HOME_ARRAY_FIELDS.has(key)) { const entries = stringArray(values[key], `homepage.${group}.${key}`); if (!entries.length) fail(`homepage.${group}.${key} cannot be empty.`); }
        else string(values[key], `homepage.${group}.${key}`);
      }
    }
    return;
  }
  if (metadata.slug && data.slug !== metadata.slug) fail("Page JSON slug must match the slug field.");
  if ("routes" in data) {
    string(data.index, "contact.index");
    stringArray(data.titleLines, "contact.titleLines");
    string(data.intro, "contact.intro");
    if (!Array.isArray(data.routes)) fail("contact.routes must be an array.");
    uniqueIds(data.routes, "contact.routes");
    data.routes.forEach((route, index) => {
      const item = object(route, `contact.routes[${index}]`);
      nestedMetadata(item, `contact.routes[${index}]`);
      string(item.label, `contact.routes[${index}].label`);
      string(item.address, `contact.routes[${index}].address`);
      string(item.note, `contact.routes[${index}].note`);
    });
    const organizer = object(data.organizer, "contact.organizer");
    for (const [key, value] of Object.entries(organizer)) string(value, `contact.organizer.${key}`);
    return;
  }

  const slug = string(data.slug, "page.slug");
  if (!new Set(["privacy", "terms", "accessibility"]).has(slug)) fail(`page.slug "${slug}" is invalid.`);
  string(data.index, "page.index");
  string(data.title, "page.title");
  string(data.intro, "page.intro");
  string(data.updated, "page.updated");
  if (!Array.isArray(data.sections)) fail("page.sections must be an array.");
  uniqueIds(data.sections, "page.sections");
  data.sections.forEach((section, index) => {
    const item = object(section, `page.sections[${index}]`);
    nestedMetadata(item, `page.sections[${index}]`);
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


export function normalizeAdminRecordData(dataInput: unknown, metadata: AdminRecordMetadata): Record<string, unknown> {
  const source = object(dataInput, "data");
  const data: Record<string, unknown> = { ...source, id: metadata.id, status: metadata.status };
  if (metadata.type !== "page" || "sortOrder" in source) data.sortOrder = metadata.sortOrder;
  if (metadata.slug) data.slug = metadata.slug;
  return data;
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
