import { event } from "./data/event";
import { informationNavigation, primaryNavigation } from "./data/navigation";
import type { NavigationItem } from "./models";

const bySortOrder = <T extends { sortOrder: number }>(records: readonly T[]): T[] =>
  [...records].sort((a, b) => a.sortOrder - b.sortOrder);

const primary: NavigationItem[] = bySortOrder<NavigationItem>(primaryNavigation);
const information: NavigationItem[] = bySortOrder<NavigationItem>(informationNavigation);

export const navigationRepository = {
  getEventSummary: () => ({ city: event.city, date: event.date }),
  getPrimaryNavigation: () => primary,
  getInformationNavigation: () => information,
} as const;
