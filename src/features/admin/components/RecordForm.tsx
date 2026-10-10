"use client";
import { useActionState, type ReactNode } from "react";
export type FormState = { error: string };
export function RecordForm({ action, children, className }: { action: (state: FormState, data: FormData) => Promise<FormState>; children: ReactNode; className?: string }) {
  const [state, submit, pending] = useActionState(action, { error: "" });
  return <form action={submit} className={className} aria-busy={pending}>
    {state.error && <p className="adminError" role="alert">{state.error}</p>}
    <fieldset className="adminFormFields" disabled={pending}>{children}</fieldset>
    {pending && <p role="status">Saving…</p>}
  </form>;
}
