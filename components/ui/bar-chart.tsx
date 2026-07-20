const values = [42, 64, 49, 78, 58, 92, 70];
export function BarChart() {
  return <figure className="chart-card" aria-label="Weekly revenue bar chart">
    <figcaption><span>Weekly revenue</span><strong>€28.4k</strong><small>+12.8% from last week</small></figcaption>
    <div className="bar-chart" aria-hidden="true">{values.map((value, i) => <div key={i}><span style={{height:`${value}%`}}/><small>{["M","T","W","T","F","S","S"][i]}</small></div>)}</div>
  </figure>;
}
