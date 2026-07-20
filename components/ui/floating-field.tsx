import type { InputHTMLAttributes } from "react";

export function FloatingField({ label, id, ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string; id: string }) {
  return (
    <div className="floating-field">
      <input id={id} placeholder=" " {...props} />
      <label htmlFor={id}>{label}</label>
    </div>
  );
}
