import { MoreHorizontal, Plus } from "lucide-react";

const columns = [
  { title: "Backlog", count: 3, cards: ["Client research", "Write content brief"] },
  { title: "In progress", count: 2, cards: ["Build dashboard", "Review mobile states"] },
  { title: "Complete", count: 4, cards: ["Create design tokens", "Set up repository"] },
];

export function KanbanBoard() {
  return (
    <section className="kanban-board" aria-label="Project board">
      {columns.map((column) => <div className="kanban-column" key={column.title}><header><div><strong>{column.title}</strong><span>{column.count}</span></div><button aria-label={`Add to ${column.title}`}><Plus size={16}/></button></header><div>{column.cards.map((card,index) => <article key={card}><div><small>{index % 2 ? "Design" : "Product"}</small><button aria-label="Card actions"><MoreHorizontal size={16}/></button></div><strong>{card}</strong><footer><span>{index % 2 ? "SH" : "IH"}</span><time>{index + 2}d</time></footer></article>)}</div></div>)}
    </section>
  );
}
