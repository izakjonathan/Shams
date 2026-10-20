"use client";
import { useState, useRef } from "react";

const LARGE = 8 * 1024 * 1024;
async function prepare(file: File): Promise<File> {
  if (file.size <= LARGE) return file; // Original bytes and metadata remain intact for normal images.
  if (!file.type.startsWith("image/") || file.type === "image/avif") return file;
  const bitmap = await createImageBitmap(file);
  try {
    const scale = Math.min(1, 2400 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    const context = canvas.getContext("2d");
    if (!context) return file;
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const result = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, "image/webp", 0.85));
    return result && result.size < file.size ? new File([result], "optimised.webp", {type:"image/webp"}) : file;
  } finally { bitmap.close(); }
}
export function ImageUploadField({name, defaultValue, required}: {name:string;defaultValue:string;required?:boolean}) {
  const [path, setPath] = useState(defaultValue);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const input = useRef<HTMLInputElement>(null);
  async function upload(file?: File) {
    if (!file) return;
    setBusy(true); setMessage("");
    try {
      const processed = await prepare(file);
      if (processed.size > 12 * 1024 * 1024) throw new Error("This image is still over 12 MB after optimisation.");
      const form = new FormData(); form.set("file", processed);
      const response = await fetch("/api/media", {method:"POST",body:form});
      const json = await response.json() as {path?:string;error?:string};
      if (!response.ok || !json.path) throw new Error(json.error ?? "Upload failed.");
      setPath(json.path); setMessage(processed !== file ? "Large image optimised and uploaded. Save changes to publish." : "Original image uploaded unchanged. Save changes to publish.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Upload failed."); }
    finally { setBusy(false); if (input.current) input.current.value = ""; }
  }
  return <div className="adminUploadField"><label>Upload image — choose photo or file<input ref={input} type="file" accept="image/jpeg,image/png,image/webp,image/avif" disabled={busy} onChange={event => void upload(event.target.files?.[0])}/></label><label>Image path<input name={name} value={path} onChange={event => setPath(event.target.value)} required={required} disabled={busy}/></label><small>Images above 8 MB are optimised when possible; smaller files stay unchanged. Maximum upload: 12 MB. Requires database storage.</small>{message && <span role="status">{message}</span>}{busy && <span role="status">Uploading…</span>}{path && <img src={path} alt="Selected upload preview" style={{maxWidth:180,maxHeight:130,objectFit:"contain"}}/>}</div>;
}
