export function LineChart() {
  return <figure className="chart-card line-chart-card" aria-label="Monthly active users line chart">
    <figcaption><span>Active users</span><strong>12,840</strong><small>Last 30 days</small></figcaption>
    <svg className="line-chart" viewBox="0 0 520 190" role="img" aria-label="Rising active user trend">
      <defs><linearGradient id="lineFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="currentColor" stopOpacity=".3"/><stop offset="1" stopColor="currentColor" stopOpacity="0"/></linearGradient></defs>
      <path className="line-chart__grid" d="M20 35H500M20 85H500M20 135H500M20 175H500"/>
      <path className="line-chart__area" d="M20 150 C70 142,80 100,135 112 S220 130,260 82 S340 58,380 76 S450 30,500 42 L500 175 L20 175 Z"/>
      <path className="line-chart__line" d="M20 150 C70 142,80 100,135 112 S220 130,260 82 S340 58,380 76 S450 30,500 42"/>
      <circle cx="500" cy="42" r="5" className="line-chart__point"/>
    </svg>
  </figure>;
}
