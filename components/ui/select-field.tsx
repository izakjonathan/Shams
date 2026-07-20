import type { SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";

export function SelectField({ id, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <label className="select-field" htmlFor={id}>
      <span>{props["aria-label"] ?? "Project type"}</span>
      <span className="select-field__control">
        <select id={id} {...props}>{children}</select>
        <ChevronDown size={17} aria-hidden="true" />
      </span>
    </label>
  );
}
