import { requireAdmin } from "../lib/auth";
import { listAdminRecords, type AdminRecord } from "../lib/content-admin";

export default async function MediaPage() {
  await requireAdmin();
  const [{ records, source }, galleryResult] = await Promise.all([listAdminRecords("artist"), listAdminRecords("gallery")]);
  return <>
    <header className="adminPageHeader"><div><p className="adminEyebrow">MEDIA</p><h1>Artist images</h1></div><span className={`adminSource adminSource--${source}`}>{source}</span></header>
    <div className="adminNotice"><strong>Media foundation</strong><p>Image paths and URLs are managed from each artist’s structured editor. This overview checks artwork, alternative text and crop positioning before publishing. Direct binary uploads require a configured storage provider and are intentionally not written to the Vercel filesystem.</p></div>
    <div className="adminMediaLibrary">{records.map((record: AdminRecord) => {
      const image = typeof record.data.image === "string" ? record.data.image : "";
      const alt = typeof record.data.imageAlt === "string" ? record.data.imageAlt : "";
      const position = typeof record.data.imagePosition === "string" ? record.data.imagePosition : "50% 50%";
      const name = typeof record.data.name === "string" ? record.data.name : record.id;
      return <article className="adminMediaCard" key={record.id}>
        <div className="adminMediaCardImage">{image ? <img src={image} alt="" style={{ objectPosition: position }} /> : <span>Missing image</span>}</div>
        <div><h2>{name}</h2><p>{image || "No path configured"}</p><dl><div><dt>Alt text</dt><dd>{alt || "Missing"}</dd></div><div><dt>Position</dt><dd>{position}</dd></div><div><dt>Status</dt><dd>{record.status}</dd></div></dl><a href={`/admin/artists?edit=${encodeURIComponent(record.id)}`}>Edit artist media</a></div>
      </article>;
    })}</div>
    <header className="adminPageHeader adminPageHeader--secondary"><div><p className="adminEyebrow">GALLERY</p><h1>Atmosphere images</h1></div><span className={`adminSource adminSource--${galleryResult.source}`}>{galleryResult.source}</span></header>
    <div className="adminMediaLibrary">{galleryResult.records.map((record: AdminRecord) => {
      const image = typeof record.data.image === "string" ? record.data.image : "";
      const alt = typeof record.data.alt === "string" ? record.data.alt : "";
      return <article className="adminMediaCard" key={record.id}>
        <div className="adminMediaCardImage">{image ? <img src={image} alt="" /> : <span>Missing image</span>}</div>
        <div><h2>{alt || record.id}</h2><p>{image || "No path configured"}</p><dl><div><dt>Alt text</dt><dd>{alt || "Missing"}</dd></div><div><dt>Order</dt><dd>{record.sortOrder}</dd></div><div><dt>Status</dt><dd>{record.status}</dd></div></dl><a href={`/admin/gallery?edit=${encodeURIComponent(record.id)}`}>Edit gallery image</a></div>
      </article>;
    })}</div>
  </>;
}
