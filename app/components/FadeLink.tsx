"use client";

import Link from "next/link";
import type { ComponentProps, MouseEvent } from "react";
import { useRouteTransition } from "./RouteFade";

type TransitionKind = "artist-open" | "artist-close" | "artist-switch" | "page-open" | "page-close" | "page-switch";

type FadeLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  readonly href: string;
  readonly onBeforeNavigate?: () => void;
  readonly transitionKind?: TransitionKind;
};

export function FadeLink({
  href,
  onClick,
  onBeforeNavigate,
  transitionKind,
  target,
  onPointerEnter,
  onFocus,
  onTouchStart,
  ...props
}: FadeLinkProps) {
  const routeTransition = useRouteTransition();
  const transitioning = routeTransition?.transitioning ?? false;

  const warmRoute = () => routeTransition?.prefetch(href);

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      target === "_blank"
    ) return;

    const destination = new URL(href, window.location.href);
    if (destination.origin !== window.location.origin || !routeTransition) return;

    event.preventDefault();
    if (transitioning) return;
    onBeforeNavigate?.();
    routeTransition.navigate(href, {
      focusOnArrival: event.detail === 0,
      transitionKind,
    });
  };

  return (
    <Link
      {...props}
      href={href}
      target={target}
      aria-disabled={transitioning || props["aria-disabled"] ? true : undefined}
      onPointerEnter={(event) => {
        onPointerEnter?.(event);
        warmRoute();
      }}
      onFocus={(event) => {
        onFocus?.(event);
        warmRoute();
      }}
      onTouchStart={(event) => {
        onTouchStart?.(event);
        warmRoute();
      }}
      onClick={handleClick}
    />
  );
}
