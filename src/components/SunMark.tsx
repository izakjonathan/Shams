/** Decorative four-point sun shared by the wordmark and editorial details. */
export function SunMark({ className = "" }: { readonly className?: string }) {
  return (
    <svg className={`sunMark ${className}`.trim()} viewBox="0 0 100 100" aria-hidden="true" focusable="false">
      <path d="M50 0C56 32 68 44 100 50C68 56 56 68 50 100C44 68 32 56 0 50C32 44 44 32 50 0Z" />
    </svg>
  );
}
