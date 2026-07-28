export type ProgrammeCategory = "all" | "music" | "conversation" | "community";

export interface ProgrammeEntry {
  readonly label: string;
  readonly description: string;
  readonly stage: string;
  readonly category: Exclude<ProgrammeCategory, "all">;
}

export const programme: readonly ProgrammeEntry[] = [
  {
    label: "Doors + welcome",
    description: "Arrival, food, installations and an open welcome across the site.",
    stage: "Festival grounds",
    category: "community",
  },
  {
    label: "Community opening",
    description: "A shared opening moment introducing the purpose behind the gathering.",
    stage: "Sun stage",
    category: "community",
  },
  {
    label: "Artist conversation",
    description: "A short hosted exchange on culture, care and collective action.",
    stage: "Listening room",
    category: "conversation",
  },
  {
    label: "Live programme",
    description: "The first sequence of live performances begins across both stages.",
    stage: "Sun + Moon stages",
    category: "music",
  },
  {
    label: "Shared table",
    description: "A slower interval for food, conversation and movement through the installations.",
    stage: "Festival grounds",
    category: "community",
  },
  {
    label: "Night programme",
    description: "Selectors and live sets carry the gathering into its late programme.",
    stage: "Sun + Moon stages",
    category: "music",
  },
  {
    label: "Closing sessions",
    description: "The final collaborative performances and closing listening sessions.",
    stage: "Moon stage",
    category: "music",
  },
  {
    label: "End",
    description: "The first edition comes to a close.",
    stage: "Festival grounds",
    category: "community",
  },
];
