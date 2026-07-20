import {FolderPlus} from "lucide-react";import {ActionButton} from "./action-button";
export function EmptyState(){return <div className="empty-state"><span><FolderPlus size={25}/></span><h3>No projects yet</h3><p>Create your first project to start assembling reusable modules.</p><ActionButton size="sm">Create project</ActionButton></div>}
