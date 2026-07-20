import { ArrowRight, Plus, Trash2 } from "lucide-react";
import { ActionButton } from "./action-button";

export function ButtonShowcase() {
  return <div className="button-showcase">
    <ActionButton leftIcon={<Plus size={16}/>}>Primary</ActionButton>
    <ActionButton variant="secondary">Secondary</ActionButton>
    <ActionButton variant="outline" rightIcon={<ArrowRight size={16}/>}>Outline</ActionButton>
    <ActionButton variant="ghost">Ghost</ActionButton>
    <ActionButton variant="danger" leftIcon={<Trash2 size={16}/>}>Delete</ActionButton>
    <ActionButton loading>Saving</ActionButton>
  </div>;
}
