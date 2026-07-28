"use client";

import { useMemo, useState } from "react";
import type { ProgrammeCategory, ProgrammeEntry } from "../lib/content/programme";

const filters: ReadonlyArray<{ value: ProgrammeCategory; label: string }> = [
  { value: "all", label: "All" },
  { value: "music", label: "Music" },
  { value: "conversation", label: "Conversations" },
  { value: "community", label: "Community" },
];

interface ProgrammeExplorerProps {
  readonly entries: readonly ProgrammeEntry[];
}

export function ProgrammeExplorer({ entries }: ProgrammeExplorerProps) {
  const [activeFilter, setActiveFilter] = useState<ProgrammeCategory>("all");
  const visibleEntries = useMemo(
    () => entries.filter((entry) => activeFilter === "all" || entry.category === activeFilter),
    [activeFilter, entries]
  );

  return (
    <div className="programmeExplorer">
      <div className="programmeFilters" role="group" aria-label="Filter programme">
        {filters.map((filter) => (
          <button
            className="programmeFilter"
            type="button"
            aria-pressed={activeFilter === filter.value}
            onClick={() => setActiveFilter(filter.value)}
            key={filter.value}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="programmeList" aria-live="polite">
        {visibleEntries.map((entry, index) => (
          <article className="programmeEntry" key={`${entry.time ?? "untimed"}-${entry.label}`}>
            <div className="programmeEntryNumber">{String(index + 1).padStart(2, "0")}</div>
            <div className="programmeEntryContent">
              <h3>{entry.label}</h3>
              <p>{entry.description}</p>
            </div>
            <div className="programmeEntryMeta">
              <span>{entry.stage}</span>
              <span>{entry.category}</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
