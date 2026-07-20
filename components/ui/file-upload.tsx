import { FileText, UploadCloud, X } from "lucide-react";

export function FileUpload() {
  return (
    <section className="file-upload">
      <label><UploadCloud size={26}/><strong>Drop files here or browse</strong><span>PDF, PNG, JPG or ZIP up to 25 MB</span><input type="file" aria-label="Upload file"/></label>
      <article><span><FileText size={19}/></span><div><strong>project-brief.pdf</strong><small>2.4 MB · Upload complete</small><i><b style={{width:"100%"}}/></i></div><button aria-label="Remove uploaded file"><X size={16}/></button></article>
    </section>
  );
}
