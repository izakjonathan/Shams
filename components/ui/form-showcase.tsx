import { Send } from "lucide-react";
import { ActionButton } from "./action-button";
import { CheckboxField } from "./checkbox-field";
import { FloatingField } from "./floating-field";
import { SelectField } from "./select-field";
import { TextareaField } from "./textarea-field";
import { ToggleSwitch } from "./toggle-switch";

export function FormShowcase() {
  return (
    <form className="form-showcase" onSubmit={(event) => event.preventDefault()}>
      <div className="form-showcase__heading"><span>New client request</span><h3>Project brief</h3><p>A composed example using reusable Studio UI controls.</p></div>
      <FloatingField id="client-name" label="Client name" required />
      <SelectField id="project-type" aria-label="Project type" defaultValue="dashboard">
        <option value="dashboard">Dashboard</option>
        <option value="website">Marketing website</option>
        <option value="portal">Client portal</option>
      </SelectField>
      <TextareaField id="brief" aria-label="Project summary" placeholder="Describe the outcome…" maxLength={500} />
      <ToggleSwitch label="Send status updates" />
      <CheckboxField label="I have reviewed the project details" defaultChecked />
      <ActionButton type="submit" rightIcon={<Send size={16} />}>Create request</ActionButton>
    </form>
  );
}
