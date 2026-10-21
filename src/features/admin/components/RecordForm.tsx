"use client";
import { createContext, useActionState, useContext, useState, type ReactNode } from "react";
export type FormState = { error: string };
const UploadContext = createContext<(delta: number) => void>(() => {});
export function useUploadPending() { return useContext(UploadContext); }
export function RecordForm({ action, children, className }: { action: (state: FormState, data: FormData) => Promise<FormState>; children: ReactNode; className?: string }) {
  const [state, submit, pending] = useActionState(action, { error: "" });
  const [uploads, setUploads] = useState(0);
  const uploading = uploads > 0;
  return <UploadContext.Provider value={(delta) => setUploads(count => Math.max(0, count + delta))}>
    <form action={submit} className={className} aria-busy={pending || uploading}>
      {state.error && <p className="adminError" role="alert">{state.error}</p>}
      <fieldset className="adminFormFields" disabled={pending || uploading}>{children}</fieldset>
      {uploading && <p role="status">Image upload in progress. Save and publish controls will be available when it finishes.</p>}
      {pending && <p role="status">Saving changes to the database…</p>}
    </form>
  </UploadContext.Provider>;
}
