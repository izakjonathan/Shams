import type { TextareaHTMLAttributes } from "react";

export function TextareaField({ id, rows = 5, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <label className="textarea-field" htmlFor={id}>
      <span>{props["aria-label"] ?? "Message"}</span>
      <textarea id={id} rows={rows} {...props} />
      <small>{props.maxLength ? `Maximum ${props.maxLength} characters` : "Add supporting detail"}</small>
    </label>
  );
}
