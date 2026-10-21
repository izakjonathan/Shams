import assert from "node:assert/strict";
import { test } from "node:test";
import { mapValidPublicRecords } from "../public-read-policy";

test("one invalid published record does not block other records", () => {
  const errors: string[] = [];
  const values = mapValidPublicRecords([1, 2, 3], (value) => {
    if (value === 2) throw new Error("bad row");
    return `record-${value}`;
  }, (row) => errors.push(String(row)));
  assert.deepEqual(values, ["record-1", "record-3"]);
  assert.deepEqual(errors, ["2"]);
});

test("all valid rows preserve their original order", () => {
  assert.deepEqual(mapValidPublicRecords([3, 1, 2], value => value, () => {}), [3, 1, 2]);
});
