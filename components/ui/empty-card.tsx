import type { ReactNode } from "react";

export function EmptyCard({ children }: { children?: ReactNode }) {
  return <div className="empty-card">{children}</div>;
}
