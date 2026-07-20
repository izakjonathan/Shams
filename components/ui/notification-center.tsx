import { Bell, CheckCircle2, MessageSquare, ReceiptText } from "lucide-react";

const notifications = [
  { icon: MessageSquare, title: "New client reply", text: "Amelia commented on Project Atlas.", time: "4m" },
  { icon: ReceiptText, title: "Invoice paid", text: "Invoice #INV-1041 was paid in full.", time: "1h" },
  { icon: CheckCircle2, title: "Task completed", text: "Homepage QA has been marked complete.", time: "3h" },
];

export function NotificationCenter() {
  return (
    <section className="notification-center">
      <header><div><Bell size={18}/><strong>Notifications</strong><span>3</span></div><button>Mark all read</button></header>
      <div className="notification-list">{notifications.map(({icon: Icon,title,text,time}) => <article key={title}><span><Icon size={16}/></span><div><strong>{title}</strong><p>{text}</p></div><time>{time}</time></article>)}</div>
      <footer><button>View all notifications</button></footer>
    </section>
  );
}
