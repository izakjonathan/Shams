import { AlertTriangle, CheckCircle2, Info, XCircle } from "lucide-react";
import type { ReactNode } from "react";
const icons={info:Info,success:CheckCircle2,warning:AlertTriangle,danger:XCircle};
export function AlertBanner({title,children,tone="info"}:{title:string;children:ReactNode;tone?:keyof typeof icons}){
 const Icon=icons[tone]; return <div className={`alert-banner alert-banner--${tone}`} role="status"><Icon size={20}/><div><strong>{title}</strong><p>{children}</p></div></div>;
}
