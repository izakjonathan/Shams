import type { ReactNode } from "react";

interface SectionHeaderProps {
  readonly index: string;
  readonly title: string;
  readonly description?: ReactNode;
  readonly light?: boolean;
  readonly className?: string;
}

export function SectionHeader({ index, title, description, light = false, className = "" }: SectionHeaderProps) {
  return (
    <div className={`sectionHeading${className ? ` ${className}` : ""}`}>
      <div>
        <div className={`sectionIndex${light ? " light" : ""}`}>{index}</div>
        <h2>{title}</h2>
      </div>
      {description ? <p>{description}</p> : null}
    </div>
  );
}
