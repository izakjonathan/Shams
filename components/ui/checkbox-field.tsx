import type { InputHTMLAttributes } from "react";
import { Check } from "lucide-react";

export function CheckboxField({ label = "Remember my choice", ...props }: InputHTMLAttributes<HTMLInputElement> & { label?: string }) {
  return (
    <label className="checkbox-field">
      <input type="checkbox" {...props} />
      <span className="checkbox-field__box"><Check size={14} /></span>
      <span>{label}</span>
    </label>
  );
}
