import { draftMode } from "next/headers";

export async function PreviewBanner() {
  if (!(await draftMode()).isEnabled) return null;
  return (
    <>
      <meta name="robots" content="noindex,nofollow" />
      <aside className="previewBanner" role="status">
      <span>Draft preview — unpublished database content may be visible.</span>
      <a href="/api/preview/exit">Exit preview</a>
      </aside>
    </>
  );
}
