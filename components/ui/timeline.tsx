const events = [
  { time: "Today, 10:42", title: "Prototype approved", text: "The dashboard direction was approved for development." },
  { time: "Yesterday", title: "Review completed", text: "Accessibility and responsive checks were completed." },
  { time: "Monday", title: "Project created", text: "Initial scope, owners and milestones were added." },
];
export function Timeline() {
  return <ol className="timeline">{events.map((event, index) => <li key={event.title}><span className={index === 0 ? "is-current" : ""}/><div><time>{event.time}</time><strong>{event.title}</strong><p>{event.text}</p></div></li>)}</ol>;
}
