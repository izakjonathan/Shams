import type { ContentStatus } from "./status";

export type ProgrammeCategory = "all" | "music" | "conversation" | "community";

/**
 * Stable programme record designed to map directly to a future CMS/API entry.
 * `id` is the permanent content key; `sortOrder` controls editorial order even
 * when the programme continues past midnight.
 */
export interface ProgrammeEntry {
  readonly id: string;
  readonly sortOrder: number;
  readonly time: string;
  readonly label: string;
  readonly description: string;
  readonly stage: string;
  readonly category: Exclude<ProgrammeCategory, "all">;
  readonly status: ContentStatus;
}

export const programme: readonly ProgrammeEntry[] = [
  {
    id: "doors-welcome",
    sortOrder: 10,
    time: "16:00",
    label: "Doors + welcome",
    description: "Arrival, food, installations and an open welcome across the site.",
    stage: "Festival grounds",
    category: "community",
    status: "confirmed",
  },
  {
    id: "community-opening",
    sortOrder: 20,
    time: "17:00",
    label: "Community opening",
    description: "A shared opening moment introducing the purpose behind the gathering.",
    stage: "Sun stage",
    category: "community",
    status: "placeholder",
  },
  {
    id: "artist-conversation",
    sortOrder: 30,
    time: "17:45",
    label: "Artist conversation",
    description: "A short hosted exchange on culture, care and collective action.",
    stage: "Listening room",
    category: "conversation",
    status: "placeholder",
  },
  {
    id: "live-programme",
    sortOrder: 40,
    time: "18:30",
    label: "Live programme",
    description: "The first sequence of live performances begins across both stages.",
    stage: "Sun + Moon stages",
    category: "music",
    status: "placeholder",
  },
  {
    id: "shared-table",
    sortOrder: 50,
    time: "20:00",
    label: "Shared table",
    description: "A slower interval for food, conversation and movement through the installations.",
    stage: "Festival grounds",
    category: "community",
    status: "placeholder",
  },
  {
    id: "night-programme",
    sortOrder: 60,
    time: "21:30",
    label: "Night programme",
    description: "Selectors and live sets carry the gathering into its late programme.",
    stage: "Sun + Moon stages",
    category: "music",
    status: "placeholder",
  },
  {
    id: "closing-sessions",
    sortOrder: 70,
    time: "00:30",
    label: "Closing sessions",
    description: "The final collaborative performances and closing listening sessions.",
    stage: "Moon stage",
    category: "music",
    status: "placeholder",
  },
  {
    id: "event-end",
    sortOrder: 80,
    time: "02:00",
    label: "End",
    description: "The first edition comes to a close.",
    stage: "Festival grounds",
    category: "community",
    status: "confirmed",
  },
];
