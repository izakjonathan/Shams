import type { ContentStatus } from "./status";

export interface EventContent {
  readonly id: string;
  readonly status: ContentStatus;
  readonly name: string;
  readonly tagline: string;
  readonly city: string;
  readonly country: string;
  readonly date: string;
  readonly numericDate: string;
  readonly timeRange: string;
  readonly isoStart: string;
  readonly isoEnd: string;
}

export const event: EventContent = {
  id: "event-2026-01",
  status: "placeholder",
  name: "Shams for Humanity",
  tagline: "A gathering of music, art and collective care.",
  city: "Copenhagen",
  country: "Denmark",
  date: "06 September 2026",
  numericDate: "06.09.2026",
  timeRange: "16:00—02:00",
  isoStart: "2026-09-06T16:00:00+02:00",
  isoEnd: "2026-09-07T02:00:00+02:00",
};
