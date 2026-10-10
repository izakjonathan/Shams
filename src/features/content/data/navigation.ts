import type { NavigationItem } from "../models";

export const primaryNavigation = [
  { id: "nav-about", sortOrder: 1, status: "published", label: "About", mobileLabel: "About", href: "/#about" },
  { id: "nav-artists", sortOrder: 2, status: "published", label: "Artists", mobileLabel: "Artists", href: "/#lineup" },
  { id: "nav-info", sortOrder: 3, status: "published", label: "Info", mobileLabel: "Event info", href: "/#info" },
  { id: "nav-tickets", sortOrder: 4, status: "published", label: "Tickets", mobileLabel: "Tickets", href: "/#tickets" },
] as const satisfies readonly NavigationItem[];

export const informationNavigation = [
  { id: "nav-privacy", sortOrder: 1, status: "published", label: "Privacy", href: "/privacy" },
  { id: "nav-terms", sortOrder: 2, status: "published", label: "Terms", href: "/terms" },
  { id: "nav-accessibility", sortOrder: 3, status: "published", label: "Accessibility", href: "/accessibility" },
  { id: "nav-contact", sortOrder: 4, status: "published", label: "Contact", href: "/contact" },
] as const satisfies readonly NavigationItem[];
