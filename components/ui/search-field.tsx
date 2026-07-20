import type { InputHTMLAttributes } from "react";
import { Search, X } from "lucide-react";

export function SearchField({ value, onChange, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  const hasValue = typeof value === "string" && value.length > 0;
  return (
    <label className="search-field">
      <Search size={18} aria-hidden="true" />
      <span className="sr-only">Search</span>
      <input value={value} onChange={onChange} type="search" {...props} />
      {hasValue && <X size={16} aria-hidden="true" />}
    </label>
  );
}
