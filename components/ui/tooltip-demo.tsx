import {Info} from "lucide-react";
export function TooltipDemo(){return <div className="tooltip-wrap"><button aria-describedby="tip-info"><Info size={18}/>Hover or focus</button><span role="tooltip" id="tip-info">Helpful context without cluttering the interface.</span></div>}
