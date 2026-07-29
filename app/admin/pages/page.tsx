import { RecordEditor } from "../components/RecordEditor";
import { RecordList } from "../components/RecordList";
import { requireAdmin } from "../lib/auth";
import { getAdminRecord, listAdminRecords } from "../lib/content-admin";
import { isDatabaseConfigured } from "../../db/client";

export default async function Page({ searchParams }: { searchParams: Promise<{ edit?: string; saved?: string }> }) {
  await requireAdmin();
  const params = await searchParams;
  const result = await listAdminRecords("page");
  const selected = params.edit ? await getAdminRecord("page", params.edit) : null;
  return <>
    <header className="adminPageHeader"><div><p className="adminEyebrow">CONTENT</p><h1>Pages</h1></div>{params.saved && <span className="adminSaved">Saved</span>}</header>
    <RecordList records={result.records} type="page" source={result.source} />
    {selected && <RecordEditor record={selected} type="page" writable={isDatabaseConfigured()} />}
  </>;
}
