import { RecordEditor } from "../../../features/admin/components/RecordEditor";
import { RecordList } from "../../../features/admin/components/RecordList";
import { requireAdmin } from "../../../features/admin/server/auth";
import { getAdminRecord, listAdminRecords } from "../../../features/admin/server/content-admin";
import { isContentWritable } from "../../../features/admin/server/write-policy";

export default async function Page({ searchParams }: { searchParams: Promise<{ edit?: string; saved?: string }> }) {
  await requireAdmin();
  const params = await searchParams;
  const result = await listAdminRecords("programme");
  const selected = params.edit ? await getAdminRecord("programme", params.edit) : null;
  return <>
    <header className="adminPageHeader"><div><p className="adminEyebrow">CONTENT</p><h1>Programme</h1></div>{params.saved && <span className="adminSaved">Saved</span>}</header>
    <RecordList records={result.records} type="programme" source={result.source} />
    {selected && <RecordEditor record={selected} type="programme" writable={isContentWritable()} />}
  </>;
}
