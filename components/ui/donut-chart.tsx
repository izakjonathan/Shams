const segments = [
  { label: "Direct", value: 48, className: "donut--accent" },
  { label: "Social", value: 31, className: "donut--success" },
  { label: "Referral", value: 21, className: "donut--muted" },
];
export function DonutChart() {
  return <figure className="donut-card" aria-label="Traffic source distribution">
    <div className="donut" aria-hidden="true"><div><strong>100%</strong><span>Traffic</span></div></div>
    <figcaption><strong>Traffic sources</strong>{segments.map((item) => <div key={item.label}><i className={item.className}/><span>{item.label}</span><b>{item.value}%</b></div>)}</figcaption>
  </figure>;
}
