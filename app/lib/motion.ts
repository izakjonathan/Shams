/** Browser motion helpers shared by the splash, menu and route curtain. */
export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function cssTimeMs(variable: string, fallback: number): number {
  if (typeof window === "undefined") return fallback;
  const raw = window.getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
  if (!raw) return fallback;

  const value = Number.parseFloat(raw);
  if (!Number.isFinite(value)) return fallback;
  if (raw.endsWith("ms")) return value;
  if (raw.endsWith("s")) return value * 1000;
  return fallback;
}

export function afterPaint(callback: () => void): () => void {
  let first = 0;
  let second = 0;
  first = window.requestAnimationFrame(() => {
    second = window.requestAnimationFrame(callback);
  });
  return () => {
    window.cancelAnimationFrame(first);
    window.cancelAnimationFrame(second);
  };
}
