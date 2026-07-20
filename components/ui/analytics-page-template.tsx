import { ArrowDownRight, ArrowUpRight, CalendarDays, Download, MoreHorizontal } from "lucide-react";

const metrics = [["Revenue","€84,260","12.8%",true],["Orders","1,248","8.2%",true],["Refunds","€2,410","3.4%",false]] as const;
const bars=[42,58,50,74,65,86,78,94,82,100,91,108];

export function AnalyticsPageTemplate() {
  return (
    <section className="template template--analytics">
      <header className="analytics-header"><div><small>Analytics</small><h3>Performance overview</h3></div><div><button><CalendarDays size={15}/> Last 30 days</button><button><Download size={15}/> Export</button></div></header>
      <div className="analytics-metrics">{metrics.map(([label,value,change,up])=><article key={label}><header><span>{label}</span><button aria-label={`More ${label} options`}><MoreHorizontal size={16}/></button></header><strong>{value}</strong><small className={up?"is-up":"is-down"}>{up?<ArrowUpRight size={13}/>:<ArrowDownRight size={13}/>} {change} vs previous</small></article>)}</div>
      <div className="analytics-grid"><article className="analytics-chart"><header><div><strong>Revenue trend</strong><small>Monthly net revenue</small></div><span>€84.2k</span></header><div className="analytics-bars">{bars.map((value,index)=><i key={index} style={{height:`${Math.min(value,100)}%`}}><b/></i>)}</div><footer>{["Jan","Mar","May","Jul","Sep","Nov"].map(month=><span key={month}>{month}</span>)}</footer></article><article className="analytics-sources"><header><strong>Revenue sources</strong><small>Share by channel</small></header><div className="analytics-donut"><span><strong>€84k</strong><small>Total</small></span></div><ul><li><i/>Direct sales <b>48%</b></li><li><i/>Subscriptions <b>32%</b></li><li><i/>Partners <b>20%</b></li></ul></article></div>
    </section>
  );
}
