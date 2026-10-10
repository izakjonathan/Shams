import { contentRepository } from "./repository";
import type { AdminContentType } from "./admin-validation";

function isObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

/**
 * Fill fields that are absent from an older database payload with the current
 * checked-in baseline. Existing database values always win. Arrays are kept at
 * their existing length; object entries at matching positions receive only
 * missing baseline keys. This lets older seeded records evolve with the schema
 * without overwriting editorial changes made in Neon.
 */
export function fillMissingCanonicalFields(
  baseline: unknown,
  current: unknown,
): unknown {
  if (Array.isArray(baseline)) {
    if (!Array.isArray(current)) return current === undefined ? baseline : current;
    return current.map((value, index) =>
      index < baseline.length
        ? fillMissingCanonicalFields(baseline[index], value)
        : value,
    );
  }

  if (isObject(baseline)) {
    if (!isObject(current)) return current === undefined ? baseline : current;
    const completed: Record<string, unknown> = { ...current };
    for (const [key, baselineValue] of Object.entries(baseline)) {
      if (!Object.prototype.hasOwnProperty.call(current, key) || current[key] === undefined) {
        completed[key] = baselineValue;
      } else {
        completed[key] = fillMissingCanonicalFields(baselineValue, current[key]);
      }
    }
    return completed;
  }

  return current === undefined ? baseline : current;
}

function baselineRecords(type: AdminContentType): readonly Record<string, unknown>[] {
  if (type === "artist") return contentRepository.getArtists() as unknown as Record<string, unknown>[];
  if (type === "gallery") return contentRepository.getGallery() as unknown as Record<string, unknown>[];
  if (type === "programme") return contentRepository.getProgramme() as unknown as Record<string, unknown>[];
  if (type === "ticket") return contentRepository.getTickets() as unknown as Record<string, unknown>[];
  if (type === "faq") return contentRepository.getFaqs() as unknown as Record<string, unknown>[];
  return [
    contentRepository.getHome(),
    contentRepository.getInformationPage("privacy"),
    contentRepository.getInformationPage("terms"),
    contentRepository.getInformationPage("accessibility"),
    contentRepository.getContactPage(),
  ] as unknown as Record<string, unknown>[];
}

export function completeRecordFromCanonicalBaseline(
  type: AdminContentType,
  id: string,
  data: unknown,
): unknown {
  const baseline = baselineRecords(type).find((record) => record.id === id);
  if (!baseline) return data;
  return fillMissingCanonicalFields(baseline, data);
}

export function canonicalImageForRecord(type: AdminContentType, id: string): unknown {
  return baselineRecords(type).find((record) => record.id === id)?.image;
}
