export function safePreviewUrl(value: string | null, origin: string): URL {
  const fallback = new URL("/", origin);
  if (!value || !value.startsWith("/") || value.startsWith("//") || /[\\\u0000-\u0020]/.test(value)) return fallback;
  try {
    const url = new URL(value, origin);
    return url.origin === fallback.origin ? url : fallback;
  } catch { return fallback; }
}
