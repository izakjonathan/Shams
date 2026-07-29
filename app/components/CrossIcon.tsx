// Purely presentational — safe to render from server or client components.
export function CrossIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`crossIcon ${className}`.trim()}
      viewBox="0 0 72 72"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M20.4 13.8 36 29.4l15.6-15.6 6.6 6.6L42.6 36l15.6 15.6-6.6 6.6L36 42.6 20.4 58.2l-6.6-6.6L29.4 36 13.8 20.4l6.6-6.6Z" />
    </svg>
  );
}
