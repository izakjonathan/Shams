import { RecordEditor } from "../components/RecordEditor";
import { RecordList } from "../components/RecordList";
import { requireAdmin } from "../lib/auth";
import { getAdminRecord, listAdminRecords } from "../lib/content-admin";
import { isDatabaseConfigured } from "../../db/client";

export default async function Page({ searchParams }: { searchParams: Promise<{ edit?: string; saved?: string }> }) {
  await requireAdmin();
  const params = await searchParams;
  const result = await listAdminRecords("faq");
  const selected = params.edit ? await getAdminRecord("faq", params.edit) : null;
  return <>
    <header className="adminPageHeader"><div><p className="adminEyebrow">CONTENT</p><h1>FAQs</h1></div>{params.saved && <span className="adminSaved">Saved</span>}</header>
    <RecordList records={result.records} type="faq" source={result.source} />
    {selected && <RecordEditor record={selected} type="faq" writable={isDatabaseConfigured()} />}
  </>;
}
