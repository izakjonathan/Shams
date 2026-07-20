import { Check, FileText, MessageCircle, Upload } from "lucide-react";
const activities = [
  { icon: Upload, title: "Maya uploaded brand-assets.zip", time: "4 minutes ago" },
  { icon: MessageCircle, title: "Noah left a comment on Dashboard", time: "26 minutes ago" },
  { icon: Check, title: "Emma completed Mobile QA", time: "1 hour ago" },
  { icon: FileText, title: "Liam updated the project brief", time: "Yesterday" },
];
export function ActivityFeed() {
  return <div className="activity-feed">{activities.map(({icon:Icon,title,time}) => <div key={title}><span><Icon size={16}/></span><p><strong>{title}</strong><small>{time}</small></p></div>)}</div>;
}
