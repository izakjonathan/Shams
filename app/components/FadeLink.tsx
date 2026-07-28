"use client";

import Link from "next/link";
import type { ComponentProps, MouseEvent } from "react";
import { useRouteTransition } from "./RouteFade";

type FadeLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  readonly href: string;
  readonly onBeforeNavigate?: () => void;
};

export function FadeLink({ href, onClick, onBeforeNavigate, target, ...props }: FadeLinkProps) {
  const { navigate, transitioning } = useRouteTransition();

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
    if (destination.origin !== window.location.origin) return;

    event.preventDefault();
    if (transitioning) return;
    onBeforeNavigate?.();
    navigate(href, { focusDestination: event.detail === 0 });
  };

  return (
    <Link
      {...props}
      href={href}
      target={target}
      aria-disabled={transitioning || props["aria-disabled"] ? true : undefined}
      onClick={handleClick}
    />
  );
}
