export type LoginProtection = "allowed" | "limited" | "missing-schema" | "unavailable";
export type LoginOutcome = "success" | "credentials" | "throttled" | "protection-unavailable";
/** Missing security storage may be initialized only after credentials verify. */
export async function loginOutcome(valid: boolean, protection: LoginProtection,
  initialize: () => Promise<LoginProtection>): Promise<LoginOutcome> {
  if (protection === "missing-schema") {
    if (!valid) return "credentials";
    protection = await initialize();
  }
  if (protection === "limited") return "throttled";
  if (protection !== "allowed") return "protection-unavailable";
  return valid ? "success" : "credentials";
}
export function safeDatabaseErrorCode(error: unknown): string | undefined {
  let value = error;
  for (let n = 0; n < 6 && value && typeof value === "object"; n++) {
    if ("code" in value && typeof value.code === "string" && /^[A-Z0-9_]{1,30}$/.test(value.code)) return value.code;
    value = "cause" in value ? value.cause : undefined;
  }
  return undefined;
}
