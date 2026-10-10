import "server-only";
import { sql } from "drizzle-orm";
import { adminLoginAttempts } from "../../../db/schema";
import type { getDatabase } from "../../../db/client";
export async function consumeAttempt(db: ReturnType<typeof getDatabase>, key: string): Promise<boolean> {
  const [row] = await db.insert(adminLoginAttempts).values({ key, attempts: 1 })
    .onConflictDoUpdate({ target: adminLoginAttempts.key, set: {
      attempts: sql`CASE WHEN ${adminLoginAttempts.windowStart} < now() - interval '15 minutes' THEN 1 ELSE LEAST(${adminLoginAttempts.attempts} + 1, 11) END`,
      windowStart: sql`CASE WHEN ${adminLoginAttempts.windowStart} < now() - interval '15 minutes' THEN now() ELSE ${adminLoginAttempts.windowStart} END`,
    } }).returning({ attempts: adminLoginAttempts.attempts });
  const attempts = row?.attempts;
  if (!Number.isInteger(attempts) || attempts < 1 || attempts > 11) throw new Error("Login counter response is invalid.");
  // Bounded cleanup keeps inactive IP hashes for at most the next successful
  // cleanup cycle, without adding an independent scheduled job.
  await db.execute(sql`DELETE FROM admin_login_attempts WHERE key IN (SELECT key FROM admin_login_attempts WHERE window_start < now() - interval '1 day' LIMIT 100)`);
  return attempts <= 10;
}
