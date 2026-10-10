import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { normalizeAdminRecordData, validateAdminRecord, type AdminRecordMetadata } from "../admin-validation";
const records = JSON.parse(readFileSync("scripts/db-seed-data.json", "utf8")).records as (AdminRecordMetadata & { data: Record<string, unknown> })[];
test("every canonical record passes strict validation", () => {
  for (const record of records) assert.doesNotThrow(() => validateAdminRecord(record.data, record), record.id);
});
test("column metadata repairs missing JSON metadata without losing editorial fields", () => {
  const record = records.find((r) => r.type === "faq")!;
  const normalized = normalizeAdminRecordData({ question: "Edited question", answer: "Edited answer" }, record);
  assert.equal(normalized.id, record.id);
  assert.equal(normalized.question, "Edited question");
  assert.doesNotThrow(() => validateAdminRecord(normalized, record));
});
test("unsafe artist links, invalid media and fractional sort order are rejected", () => {
  const artist = records.find((r) => r.type === "artist")!;
  for (const href of ["javascript:alert(1)", "data:text/html,x", "http://evil.test", "https://user:pass@example.test"]) assert.throws(() => validateAdminRecord({ ...artist.data, links: [{ label: "Link", href }] }, artist));
  for (const image of ["", "//evil.test/a.png", "/images/../a.png", "https://evil.test/a.png", { src: null }]) assert.throws(() => validateAdminRecord({ ...artist.data, image }, artist));
  assert.throws(() => validateAdminRecord({ ...artist.data, sortOrder: 1.5 }, { ...artist, sortOrder: 1.5 }));
});
test("nested page states and duplicate IDs are rejected", () => {
  const page = records.find((r) => r.type === "page" && Array.isArray(r.data.sections))!;
  const sections = page.data.sections as Record<string, unknown>[];
  assert.throws(() => validateAdminRecord({ ...page.data, sections: [{ ...sections[0], status: "invalid" }] }, page));
  assert.throws(() => validateAdminRecord({ ...page.data, sections: [sections[0], sections[0]] }, page));
});
