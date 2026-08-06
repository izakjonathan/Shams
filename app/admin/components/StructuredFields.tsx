import type { AdminContentType, AdminRecord } from "../lib/content-admin";

function value(data: Record<string, unknown>, key: string): string {
  const item = data[key];
  return typeof item === "string" || typeof item === "number" ? String(item) : "";
}
function lines(data: Record<string, unknown>, key: string): string {
  const item = data[key];
  return Array.isArray(item) ? item.map(String).join("\n") : "";
}
function pretty(data: Record<string, unknown>, key: string): string {
  return JSON.stringify(data[key] ?? [], null, 2);
}

export function StructuredFields({ record, type }: { record: AdminRecord; type: AdminContentType }) {
  const data = record.data;
  if (type === "artist") return <>
    <div className="adminFieldGrid adminFieldGrid--two">
      <label>Artist name<input name="name" defaultValue={value(data,"name")} required /></label>
      <label>Artist type<input name="artistType" defaultValue={value(data,"type")} required /></label>
      <label>Performance time<input name="time" type="time" defaultValue={value(data,"time")} required /></label>
      <label>Stage<input name="stage" defaultValue={value(data,"stage")} required /></label>
      <label>Origin<input name="origin" defaultValue={value(data,"origin")} required /></label>
      <label>Genre<input name="genre" defaultValue={value(data,"genre")} required /></label>
      <label>Pronouns<input name="pronouns" defaultValue={value(data,"pronouns")} /></label>
      <label>Image position<input name="imagePosition" defaultValue={value(data,"imagePosition")} placeholder="50% 50%" /></label>
    </div>
    <label>Short biography<textarea name="shortBio" className="adminTextarea--short" defaultValue={value(data,"shortBio")} required /></label>
    <label>Biography paragraphs<textarea name="biography" className="adminTextarea--medium" defaultValue={lines(data,"biography")} aria-describedby="biography-help" required /><small id="biography-help">One paragraph per line.</small></label>
    <label>Quote<textarea name="quote" className="adminTextarea--short" defaultValue={value(data,"quote")} required /></label>
    <label>Set description<textarea name="setDescription" className="adminTextarea--short" defaultValue={value(data,"setDescription")} required /></label>
    <label>Highlights<textarea name="highlights" className="adminTextarea--medium" defaultValue={lines(data,"highlights")} aria-describedby="highlights-help" required /><small id="highlights-help">One highlight per line.</small></label>
    <fieldset className="adminMediaFieldset"><legend>Artist image</legend><div className="adminMediaGrid">
      <div className="adminMediaPreview">{value(data,"image") ? <img src={value(data,"image")} alt="" /> : <span>No image</span>}</div>
      <div className="adminMediaInputs"><label>Image path or URL<input name="image" defaultValue={value(data,"image")} required /></label><label>Alternative text<input name="imageAlt" defaultValue={value(data,"imageAlt")} required /></label></div>
    </div></fieldset>
    <label>External links<textarea name="links" className="adminTextarea--medium" defaultValue={Array.isArray(data.links) ? data.links.map((link) => { const item=link as Record<string,unknown>; return `${String(item.label ?? "")}|${String(item.href ?? "")}`; }).join("\n") : ""} aria-describedby="links-help" /><small id="links-help">One link per line: Label|https://example.com</small></label>
  </>;


  if (type === "gallery") return <>
    <fieldset className="adminMediaFieldset"><legend>Gallery image</legend><div className="adminMediaGrid">
      <div className="adminMediaPreview">{value(data,"image") ? <img src={value(data,"image")} alt="" /> : <span>No image</span>}</div>
      <div className="adminMediaInputs"><label>Image path or URL<input name="image" defaultValue={value(data,"image")} required /></label><label>Alternative text<input name="alt" defaultValue={value(data,"alt")} required /></label></div>
    </div></fieldset>
  </>;

  if (type === "programme") return <>
    <div className="adminFieldGrid adminFieldGrid--two"><label>Time<input name="time" type="time" defaultValue={value(data,"time")} required /></label><label>Category<select name="category" defaultValue={value(data,"category")}><option value="music">Music</option><option value="conversation">Conversation</option><option value="community">Community</option></select></label><label>Title<input name="label" defaultValue={value(data,"label")} required /></label><label>Stage<input name="stage" defaultValue={value(data,"stage")} required /></label></div>
    <label>Description<textarea name="description" className="adminTextarea--short" defaultValue={value(data,"description")} required /></label>
  </>;

  if (type === "ticket") return <>
    <div className="adminFieldGrid adminFieldGrid--two"><label>Ticket type<input name="ticketType" defaultValue={value(data,"type")} required /></label><label>Badge<input name="badge" defaultValue={value(data,"badge")} required /></label><label>Price<input name="price" type="number" min="0" step="0.01" defaultValue={value(data,"price")} required /></label><label>Currency<input name="currency" defaultValue={value(data,"currency")} required /></label><label>Availability<select name="availability" defaultValue={value(data,"availability")}><option value="available">Available</option><option value="sold-out">Sold out</option><option value="coming-soon">Coming soon</option></select></label><label className="adminCheckbox"><input name="featured" type="checkbox" defaultChecked={data.featured === true} /> Featured tier</label></div>
    <label>Description<textarea name="description" className="adminTextarea--short" defaultValue={value(data,"description")} required /></label>
    <label>Included items<textarea name="includes" className="adminTextarea--medium" defaultValue={lines(data,"includes")} aria-describedby="includes-help" required /><small id="includes-help">One item per line.</small></label>
  </>;

  if (type === "faq") return <><label>Question<input name="question" defaultValue={value(data,"question")} required /></label><label>Answer<textarea name="answer" className="adminTextarea--medium" defaultValue={value(data,"answer")} required /></label></>;

  const isContact = Array.isArray(data.routes);
  return isContact ? <>
    <div className="adminFieldGrid adminFieldGrid--two"><label>Page index<input name="index" defaultValue={value(data,"index")} required /></label><label>Title lines<textarea name="titleLines" className="adminTextarea--short" defaultValue={lines(data,"titleLines")} required /></label></div>
    <label>Introduction<textarea name="intro" className="adminTextarea--short" defaultValue={value(data,"intro")} required /></label>
    <label>Contact routes JSON<textarea name="routesJson" className="adminTextarea--json" defaultValue={pretty(data,"routes")} required /></label>
    <label>Organizer JSON<textarea name="organizerJson" className="adminTextarea--json" defaultValue={JSON.stringify(data.organizer ?? {}, null, 2)} required /></label>
  </> : <>
    <div className="adminFieldGrid adminFieldGrid--two"><label>Page index<input name="index" defaultValue={value(data,"index")} required /></label><label>Last updated<input name="updated" defaultValue={value(data,"updated")} required /></label></div>
    <label>Page title<input name="title" defaultValue={value(data,"title")} required /></label>
    <label>Introduction<textarea name="intro" className="adminTextarea--short" defaultValue={value(data,"intro")} required /></label>
    <label>Sections JSON<textarea name="sectionsJson" className="adminTextarea--json" defaultValue={pretty(data,"sections")} required /></label>
  </>;
}
