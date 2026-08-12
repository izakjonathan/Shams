import postgres from "postgres";

export function requireDatabaseUrl() {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) throw new Error("DATABASE_URL is required. Add it as a GitHub Actions repository secret before running database administration workflows.");
  return url;
}

export function createDatabaseClient() {
  return postgres(requireDatabaseUrl(), {
    prepare: false,
    max: 1,
    connect_timeout: 15,
    idle_timeout: 5,
  });
}

export function safeDatabaseLabel() {
  try {
    const url = new URL(requireDatabaseUrl());
    return `${url.hostname}/${url.pathname.replace(/^\//, "") || "database"}`;
  } catch {
    return "configured database";
  }
}
