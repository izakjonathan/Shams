const items = [
  { label: "Design system", value: 82 },
  { label: "Dashboard", value: 64 },
  { label: "Mobile app", value: 38 },
];
export function ProgressList() {
  return <div className="progress-list">{items.map((item) => <div key={item.label} className="progress-item"><div><span>{item.label}</span><strong>{item.value}%</strong></div><div className="progress-track"><span style={{width:`${item.value}%`}}/></div></div>)}</div>;
}
