import { ChevronRight, Home } from "lucide-react";
export function Breadcrumbs(){return <nav className="breadcrumbs" aria-label="Breadcrumb"><a href="/"><Home size={15}/><span className="sr-only">Home</span></a><ChevronRight size={14}/><a href="/#library">Components</a><ChevronRight size={14}/><span aria-current="page">Navigation</span></nav>}
