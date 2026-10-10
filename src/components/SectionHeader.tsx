import type { ReactNode } from "react";

interface SectionHeaderProps {
  readonly index: string;
  readonly title: string;
  readonly description?: ReactNode;
  readonly light?: boolean;
  readonly className?: string;
  readonly reveal?: boolean;
}

export function SectionHeader({ index, title, description, light = false, className = "", reveal = false }: SectionHeaderProps) {
  return (
    <div className={`sectionHeading${className ? ` ${className}` : ""}`} data-lower-reveal={reveal ? "" : undefined}>
      <div>
        <div className={`sectionIndex${light ? " light" : ""}`}>{index}</div>
        <h2>{title}</h2>
      </div>
      {description ? <p>{description}</p> : null}
    </div>
  );
}
