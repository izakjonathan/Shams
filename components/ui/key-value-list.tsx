const items = [
  ["Plan", "Studio Pro"],
  ["Billing", "Monthly"],
  ["Renewal", "12 August 2026"],
  ["Workspace", "Copenhagen Studio"],
];
export function KeyValueList() {
  return <dl className="key-value-list">{items.map(([term,value]) => <div key={term}><dt>{term}</dt><dd>{value}</dd></div>)}</dl>;
}
