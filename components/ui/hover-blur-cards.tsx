type HoverItem = { title: string; text: string; tone: "rose" | "blue" | "green" };

const defaultItems: HoverItem[] = [
  { title: "Discover", text: "Explore the library", tone: "rose" },
  { title: "Compose", text: "Combine proven blocks", tone: "blue" },
  { title: "Ship", text: "Deploy with confidence", tone: "green" },
];

export function HoverBlurCards({ items = defaultItems }: { items?: HoverItem[] }) {
  return (
    <div className="hover-cards">
      {items.map((item) => (
        <article className={`hover-card hover-card--${item.tone}`} key={item.title} tabIndex={0}>
          <strong>{item.title}</strong>
          <span>{item.text}</span>
        </article>
      ))}
    </div>
  );
}
