import { RecordEditor } from "../../../features/admin/components/RecordEditor";
import { RecordList } from "../../../features/admin/components/RecordList";
import { requireAdmin } from "../../../features/admin/server/auth";
import { getAdminRecord, listAdminRecords } from "../../../features/admin/server/content-admin";
import { isContentWritable } from "../../../features/admin/server/write-policy";

export default async function Page({ searchParams }: { searchParams: Promise<{ edit?: string; saved?: string }> }) {
  await requireAdmin();
  const params = await searchParams;
  const result = await listAdminRecords("page");
  const selected = params.edit ? await getAdminRecord("page", params.edit) : null;
  return <>
    <header className="adminPageHeader"><div><p className="adminEyebrow">CONTENT</p><h1>Pages</h1></div>{params.saved && <span className="adminSaved">Saved</span>}</header>
    <RecordList records={result.records} type="page" source={result.source} />
    {selected && <RecordEditor record={selected} type="page" writable={isContentWritable()} />}
  </>;
}
