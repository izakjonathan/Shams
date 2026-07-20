import { BarChart3, CalendarDays, LayoutDashboard, Settings, Users } from "lucide-react";

export function DashboardLayout() {
  return (
    <section className="dashboard-layout-demo">
      <aside><div className="mini-logo">S</div><nav><button className="is-active" aria-label="Dashboard"><LayoutDashboard size={18}/></button><button aria-label="Analytics"><BarChart3 size={18}/></button><button aria-label="Customers"><Users size={18}/></button><button aria-label="Calendar"><CalendarDays size={18}/></button></nav><button aria-label="Settings"><Settings size={18}/></button></aside>
      <div className="dashboard-layout-content"><header><div><small>Workspace</small><strong>Overview</strong></div><button>New project</button></header><div className="mini-metrics"><article><span>Revenue</span><strong>€24.8k</strong><small>+12.4%</small></article><article><span>Projects</span><strong>18</strong><small>6 active</small></article><article><span>Clients</span><strong>42</strong><small>+4 this month</small></article></div><div className="mini-layout-grid"><div><strong>Performance</strong><span className="mini-chart"/></div><div><strong>Recent activity</strong><ul><li>Invoice paid</li><li>New booking</li><li>Project updated</li></ul></div></div></div>
    </section>
  );
}
