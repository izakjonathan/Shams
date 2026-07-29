import { RecordEditor } from "../components/RecordEditor";
import { RecordList } from "../components/RecordList";
import { requireAdmin } from "../lib/auth";
import { getAdminRecord, listAdminRecords } from "../lib/content-admin";
import { isDatabaseConfigured } from "../../db/client";

export default async function Page({ searchParams }: { searchParams: Promise<{ edit?: string; saved?: string }> }) {
  await requireAdmin();
  const params = await searchParams;
  const result = await listAdminRecords("ticket");
  const selected = params.edit ? await getAdminRecord("ticket", params.edit) : null;
  return <>
    <header className="adminPageHeader"><div><p className="adminEyebrow">CONTENT</p><h1>Tickets</h1></div>{params.saved && <span className="adminSaved">Saved</span>}</header>
    <RecordList records={result.records} type="ticket" source={result.source} />
    {selected && <RecordEditor record={selected} type="ticket" writable={isDatabaseConfigured()} />}
  </>;
}
