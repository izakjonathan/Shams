export function visualViewportHeight(): number {
  if (typeof window === "undefined") return 0;
  const height = window.visualViewport?.height ?? document.documentElement.clientHeight ?? window.innerHeight;
  return Math.max(1, Math.min(height, document.documentElement.clientHeight || height));
}

export function maximumDocumentScroll(): number {
  if (typeof window === "undefined") return 0;
  return Math.max(0, document.documentElement.scrollHeight - visualViewportHeight());
}

export function scrollToDocumentBottom(behavior: ScrollBehavior = "auto") {
  window.scrollTo({ top: maximumDocumentScroll(), left: 0, behavior });
}
