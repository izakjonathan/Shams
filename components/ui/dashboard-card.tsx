import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";

type DashboardCardProps = {
  title: string;
  value: string;
  change: string;
  progress: number;
  icon?: ReactNode;
};

export function DashboardCard({ title, value, change, progress, icon }: DashboardCardProps) {
  const safeProgress = Math.min(100, Math.max(0, progress));
  return (
    <article className="dashboard-card">
      <div className="dashboard-card__title">
        <span className="dashboard-card__icon">{icon ?? <ArrowUpRight size={16} />}</span>
        <h3>{title}</h3>
        <span className="dashboard-card__change"><ArrowUpRight size={14} />{change}</span>
      </div>
      <div className="dashboard-card__data">
        <p>{value}</p>
        <div className="dashboard-card__range" aria-label={`${safeProgress}% progress`}>
          <span style={{ width: `${safeProgress}%` }} />
        </div>
      </div>
    </article>
  );
}
