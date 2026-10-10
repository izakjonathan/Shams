import "server-only";
import { sql } from "drizzle-orm";
import type { getDatabase } from "../../../db/client";
export async function consumeAttempt(db: ReturnType<typeof getDatabase>, key: string): Promise<boolean> {
  const result = await db.execute(sql`
    INSERT INTO admin_login_attempts (key, attempts, window_start)
    VALUES (${key}, 1, now())
    ON CONFLICT (key) DO UPDATE SET
      attempts = CASE WHEN admin_login_attempts.window_start < now() - interval '15 minutes' THEN 1 ELSE LEAST(admin_login_attempts.attempts + 1, 11) END,
      window_start = CASE WHEN admin_login_attempts.window_start < now() - interval '15 minutes' THEN now() ELSE admin_login_attempts.window_start END
    RETURNING attempts
  `);
  // Bounded cleanup keeps inactive IP hashes for at most the next successful
  // cleanup cycle, without adding an independent scheduled job.
  await db.execute(sql`DELETE FROM admin_login_attempts WHERE key IN (SELECT key FROM admin_login_attempts WHERE window_start < now() - interval '1 day' LIMIT 100)`);
  return Number(result[0]?.attempts) <= 10;
}
