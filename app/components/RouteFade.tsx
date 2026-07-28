"use client";

import { usePathname, useRouter } from "next/navigation";
import { type ReactNode, useEffect, useRef, useState } from "react";

const FADE_DURATION_MS = 220;

interface RouteFadeProps {
  readonly children: ReactNode;
}

function isModifiedClick(event: MouseEvent) {
  return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
}

export function RouteFade({ children }: RouteFadeProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isFadingOut, setIsFadingOut] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    setIsFadingOut(true);
    const firstFrame = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => setIsFadingOut(false));
    });

    return () => window.cancelAnimationFrame(firstFrame);
  }, [pathname]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || isModifiedClick(event)) return;

      const target = event.target as Element | null;
      const anchor = target?.closest<HTMLAnchorElement>("a[href]");
      if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) return;

      const destination = new URL(anchor.href, window.location.href);
      if (destination.origin !== window.location.origin) return;

      const current = new URL(window.location.href);
      const sameDocument = destination.pathname === current.pathname && destination.search === current.search;
      if (sameDocument) return;

      event.preventDefault();
      setIsFadingOut(true);

      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => {
        router.push(`${destination.pathname}${destination.search}${destination.hash}`);
      }, FADE_DURATION_MS);
    };

    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    };
  }, [router]);

  return (
    <div className={`routeFade${isFadingOut ? " isFading" : ""}`}>
      {children}
    </div>
  );
}
