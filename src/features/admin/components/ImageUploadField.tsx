"use client";
import { useState, useRef } from "react";
import { upload as uploadBlob } from "@vercel/blob/client";
import { useUploadPending } from "./RecordForm";

const LARGE = 8 * 1024 * 1024;
async function prepare(file: File): Promise<File> {
  if (file.size <= LARGE) return file;
  if (!file.type.startsWith("image/") || file.type === "image/avif") return file;
  let bitmap: ImageBitmap;
  try { bitmap = await createImageBitmap(file); } catch { return file; }
  try {
    // Retain more detail in full-screen gallery photographs.
    const scale = Math.min(1, 3200 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    const context = canvas.getContext("2d");
    if (!context) return file;
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    // Try high fidelity first; only step down if needed to meet the upload cap.
    for (const quality of [0.94, 0.91, 0.88]) {
      const result = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, "image/webp", quality));
      if (result && result.size < file.size && result.size <= 12 * 1024 * 1024) {
        return new File([result], "optimised.webp", {type:"image/webp"});
      }
    }
    return file;
  } finally { bitmap.close(); }
}
function sendUpload(form: FormData, onProgress: (value: number) => void): Promise<{path: string}> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/media");
    xhr.upload.onprogress = (event) => { if (event.lengthComputable) onProgress(Math.round(event.loaded / event.total * 100)); };
    xhr.onerror = () => reject(new Error("Network error during upload. Try again."));
    xhr.ontimeout = () => reject(new Error("Upload timed out. Try again."));
    xhr.timeout = 45000;
    xhr.onload = () => {
      let json: {path?: string; error?: string};
      try { json = JSON.parse(xhr.responseText); }
      catch { reject(new Error("The server returned an unexpected upload response.")); return; }
      if (xhr.status < 200 || xhr.status >= 300 || !json.path) reject(new Error(json.error ?? "Upload failed."));
      else resolve({path: json.path});
    };
    xhr.send(form);
  });
}
export function ImageUploadField({name, defaultValue, required}: {name:string;defaultValue:string;required?:boolean}) {
  const [path, setPath] = useState(defaultValue);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const markUpload = useUploadPending();
  async function upload(file?: File) {
    if (!file || busy) return;
    setBusy(true); markUpload(1); setMessage(""); setProgress(0);
    try {
      const processed = await prepare(file);
      if (processed.size > 12 * 1024 * 1024) throw new Error("This image is still over 12 MB after optimisation.");
      const response = await fetch("/api/media", { cache: "no-store" });
      if (!response.ok) throw new Error("Could not check upload configuration. Sign in again.");
      const config = await response.json() as { storage: "blob" | "database" };
      let imagePath: string;
      if (config.storage === "blob") {
        const extension = processed.type === "image/jpeg" ? "jpg" : processed.type.split("/")[1];
        const blob = await uploadBlob(`shams/${crypto.randomUUID()}.${extension}`, processed, {
          access: "public",
          handleUploadUrl: "/api/media/client",
          onUploadProgress: event => setProgress(Math.round(event.percentage)),
        });
        imagePath = blob.url;
      } else {
        const form = new FormData(); form.set("file", processed);
        imagePath = (await sendUpload(form, setProgress)).path;
      }
      setPath(imagePath);
      let resolutionWarning = "";
      try {
        const bitmap = await createImageBitmap(processed);
        if (Math.min(bitmap.width, bitmap.height) < 1200) {
          resolutionWarning = ` Note: this image is ${bitmap.width} × ${bitmap.height} pixels. For a crisp full-screen gallery, use a higher-resolution original (ideally at least 1200px on the shorter edge).`;
        }
        bitmap.close();
      } catch { /* File was uploaded; an unsupported dimension check must not fail it. */ }
      setMessage((processed !== file ? "Large image optimised at high quality and uploaded." : "Original image uploaded unchanged.") + " Save changes to publish." + resolutionWarning);
    } catch (error) { setMessage(error instanceof Error ? error.message : "Upload failed."); }
    finally { setBusy(false); markUpload(-1); if (input.current) input.current.value = ""; }
  }
  return <div className="adminUploadField">
    <label>Upload image — choose photo or file<input ref={input} type="file" accept="image/jpeg,image/png,image/webp,image/avif" disabled={busy} onChange={event => void upload(event.target.files?.[0])}/></label>
    <label>Image path<input name={name} value={path} onChange={event => setPath(event.target.value)} required={required} disabled={busy}/></label>
    <small>Images up to 8 MB are kept exactly as uploaded. Larger images are optimised at high quality where possible (12 MB upload maximum). For a sharp full-screen gallery, use an original at least 1200px wide on its shorter edge. Save after upload to apply the image.</small>
    {busy && <div role="status">Uploading image: {progress}% <progress max={100} value={progress} aria-label="Image upload progress" /></div>}
    {message && <span role="status">{message}</span>}
    {path && <img src={path} alt="Selected upload preview" style={{maxWidth:180,maxHeight:130,objectFit:"contain"}}/>}
  </div>;
}
