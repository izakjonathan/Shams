"use client";

import { useMemo, useState } from "react";
import type { ProgrammeCategory, ProgrammeEntry } from "../content";

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
    () =>
      entries
        .filter((entry) => activeFilter === "all" || entry.category === activeFilter)
        .toSorted((a, b) => a.sortOrder - b.sortOrder),
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
        {visibleEntries.map((entry) => (
          <article
            className="programmeEntry"
            id={`programme-${entry.id}`}
            data-content-id={entry.id}
            data-content-status={entry.status}
            key={entry.id}
          >
            <time className="programmeEntryTime" dateTime={entry.time}>
              {entry.time}
            </time>
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
