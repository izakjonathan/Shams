import { PGlite } from "@electric-sql/pglite";
import { PGLiteSocketServer } from "@electric-sql/pglite-socket";
import { spawn } from "node:child_process";
const db = await PGlite.create();
const server = new PGLiteSocketServer({ db, host: "127.0.0.1", port: 55439, maxConnections: 10 });
await server.start();
console.log("Running SQL tests on isolated PGlite (single-engine multiplexer; CI uses PostgreSQL 17).");
try {
  const child = spawn(process.execPath, ["--conditions=react-server", "--import", "tsx", "--test", "--test-reporter=tap", ...(process.env.PGLITE_TEST_PATTERN ? ["--test-name-pattern=" + process.env.PGLITE_TEST_PATTERN] : []), "src/features/admin/tests/database.test.ts"], { stdio: "inherit", env: { ...process.env, PGLITE_TEST: "true", DATABASE_TEST_URL: "postgresql://postgres@127.0.0.1:55439/shams_test" } });
  process.exitCode = await new Promise((resolve, reject) => { child.on("exit", (code) => resolve(code ?? 1)); child.on("error", reject); });
} finally { await server.stop(); await db.close(); }
