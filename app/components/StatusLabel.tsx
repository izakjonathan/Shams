import type { ContentStatus } from "../lib/content/status";

interface StatusLabelProps {
  readonly status: ContentStatus;
  readonly placeholderText?: string;
  readonly confirmedText?: string;
}

export function StatusLabel({
  status,
  placeholderText = "Details in development",
  confirmedText = "Confirmed",
}: StatusLabelProps) {
  return (
    <span className={`statusLabel is-${status}`}>
      <span aria-hidden="true" />
      {status === "confirmed" ? confirmedText : placeholderText}
    </span>
  );
}
