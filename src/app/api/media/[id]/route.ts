import postgres from "postgres";
export const runtime = "nodejs";
export async function GET(_request: Request, { params }: { params: Promise<{id: string}> }) {
  const { id } = await params;
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id) || !process.env.DATABASE_URL) return new Response("Not found", {status:404});
  const sql = postgres(process.env.DATABASE_URL, {max:1,prepare:false,connect_timeout:10});
  try {
    const rows = await sql`SELECT mime, contents FROM uploaded_media WHERE id=${id} LIMIT 1`;
    if (!rows.length) return new Response("Not found", {status:404});
    return new Response(new Uint8Array(rows[0].contents), {headers:{"Content-Type":rows[0].mime,"X-Content-Type-Options":"nosniff","Cache-Control":"public, max-age=31536000, immutable"}});
  } catch { return new Response("Not found", {status:404}); }
  finally { await sql.end(); }
}
