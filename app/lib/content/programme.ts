import type { ContentStatus } from "./status";

export type ProgrammeCategory = "all" | "music" | "conversation" | "community";

export interface ProgrammeEntry {
  readonly time: string;
  readonly label: string;
  readonly description: string;
  readonly stage: string;
  readonly category: Exclude<ProgrammeCategory, "all">;
  readonly status: ContentStatus;
}

export const programme: readonly ProgrammeEntry[] = [
  {
    time: "16:00",
    label: "Doors + welcome",
    description: "Arrival, food, installations and an open welcome across the site.",
    stage: "Festival grounds",
    category: "community",
    status: "confirmed",
  },
  {
    time: "17:00",
    label: "Community opening",
    description: "A shared opening moment introducing the purpose behind the gathering.",
    stage: "Sun stage",
    category: "community",
    status: "placeholder",
  },
  {
    time: "17:45",
    label: "Artist conversation",
    description: "A short hosted exchange on culture, care and collective action.",
    stage: "Listening room",
    category: "conversation",
    status: "placeholder",
  },
  {
    time: "18:30",
    label: "Live programme",
    description: "The first sequence of live performances begins across both stages.",
    stage: "Sun + Moon stages",
    category: "music",
    status: "placeholder",
  },
  {
    time: "20:00",
    label: "Shared table",
    description: "A slower interval for food, conversation and movement through the installations.",
    stage: "Festival grounds",
    category: "community",
    status: "placeholder",
  },
  {
    time: "21:30",
    label: "Night programme",
    description: "Selectors and live sets carry the gathering into its late programme.",
    stage: "Sun + Moon stages",
    category: "music",
    status: "placeholder",
  },
  {
    time: "00:30",
    label: "Closing sessions",
    description: "The final collaborative performances and closing listening sessions.",
    stage: "Moon stage",
    category: "music",
    status: "placeholder",
  },
  {
    time: "02:00",
    label: "End",
    description: "The first edition comes to a close.",
    stage: "Festival grounds",
    category: "community",
    status: "confirmed",
  },
];
