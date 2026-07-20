import { Building2, ChevronRight, Filter, Mail, MoreHorizontal, Phone, Plus, Search, Users } from "lucide-react";

const contacts = [
  ["Acme Studio", "Maya Chen", "Lead", "€18,000"],
  ["North & Co.", "Theo Martin", "Active", "€42,500"],
  ["Bright Labs", "Sara Evans", "Proposal", "€27,800"],
];

export function CrmPageTemplate() {
  return (
    <section className="template template--crm">
      <aside className="crm-sidebar"><strong>SU</strong><button className="is-active"><Users size={17}/><span>Customers</span></button><button><Building2 size={17}/><span>Companies</span></button><button><Mail size={17}/><span>Messages</span></button></aside>
      <div className="crm-main">
        <header className="crm-header"><div><small>Workspace / CRM</small><h3>Customers</h3></div><button><Plus size={16}/> Add customer</button></header>
        <div className="crm-toolbar"><label><Search size={16}/><input placeholder="Search customers"/></label><button><Filter size={15}/> Filter</button></div>
        <div className="crm-table"><div className="crm-row crm-row--head"><span>Company</span><span>Contact</span><span>Status</span><span>Value</span><span/></div>{contacts.map(([company,name,status,value])=><div className="crm-row" key={company}><span><b>{company.slice(0,2).toUpperCase()}</b><strong>{company}</strong></span><span><strong>{name}</strong><small><Phone size={11}/> +45 20 34 56 78</small></span><span><i className={`crm-status crm-status--${status.toLowerCase()}`}>{status}</i></span><span><strong>{value}</strong><small>Pipeline</small></span><span><button aria-label={`Open ${company}`}><MoreHorizontal size={16}/></button><ChevronRight size={15}/></span></div>)}</div>
      </div>
    </section>
  );
}
