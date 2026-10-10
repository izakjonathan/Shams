import { test } from "node:test";
import assert from "node:assert/strict";
import { adminConfigured, createSessionToken, readSessionIdentity, SESSION_MAX_AGE } from "../server/session";
import { safePreviewUrl } from "../server/preview-path";
const config = { email: "admin@example.test", password: "test-only-password", secret: "test-only-secret-32-characters-long" };
const now = 1800000000000;
test("session accepts its configured identity and expires exactly at its deadline", () => {
  const token = createSessionToken(config.email, config, now);
  assert.equal(readSessionIdentity(token, config, now), config.email);
  assert.equal(readSessionIdentity(token, config, now + SESSION_MAX_AGE * 1000), null);
});
test("tampering, malformed segments, credential rotation and wrong configuration fail closed", () => {
  const token = createSessionToken(config.email, config, now);
  for (const candidate of ["", "bad", `${token}.extra`, `${token}x`, `x${token}`, "x".repeat(3000)]) assert.equal(readSessionIdentity(candidate, config, now), null);
  for (const changed of [{ ...config, password: "rotated" }, { ...config, email: "other@example.test" }, { ...config, secret: "short" }]) assert.equal(readSessionIdentity(token, changed, now), null);
  assert.equal(adminConfigured({ ...config, password: "" }), false);
  assert.throws(() => createSessionToken("someone@example.test", config, now));
});
test("preview redirects cannot escape the same origin", () => {
  const origin = "https://example.test";
  for (const value of ["//evil.test", "/\\evil.test", "https://evil.test", "/\n/evil.test", null]) assert.equal(safePreviewUrl(value, origin).href, `${origin}/`);
  assert.equal(safePreviewUrl("/artists/nour?draft=1#bio", origin).href, `${origin}/artists/nour?draft=1#bio`);
});

import { loginOutcome, safeDatabaseErrorCode } from "../server/login-policy";
test("login distinguishes incorrect credentials, genuine limits and unavailable storage", async () => {
  const initialize = async () => { throw new Error("Must not initialize"); };
  assert.equal(await loginOutcome(false, "allowed", initialize), "credentials");
  assert.equal(await loginOutcome(true, "allowed", initialize), "success");
  assert.equal(await loginOutcome(true, "limited", initialize), "throttled");
  assert.equal(await loginOutcome(false, "unavailable", initialize), "protection-unavailable");
  assert.equal(await loginOutcome(true, "unavailable", initialize), "protection-unavailable");
  assert.equal(await loginOutcome(false, "missing-schema", initialize), "credentials");
  assert.equal(await loginOutcome(true, "missing-schema", async () => "allowed"), "success");
  assert.equal(await loginOutcome(true, "missing-schema", async () => "unavailable"), "protection-unavailable");
  assert.equal(safeDatabaseErrorCode({ cause: { code: "42P01", message: "private SQL" } }), "42P01");
  assert.equal(safeDatabaseErrorCode({ code: "private connection string" }), undefined);
});
