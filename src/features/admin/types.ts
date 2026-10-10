import type { ContentStatus } from "../content/models";

export type AdminContentType = "artist" | "gallery" | "programme" | "ticket" | "faq" | "page";

export interface AdminRecord {
  id: string;
  type: AdminContentType;
  slug: string | null;
  status: ContentStatus;
  sortOrder: number;
  data: Record<string, unknown>;
  updatedAt: string | null;
}

