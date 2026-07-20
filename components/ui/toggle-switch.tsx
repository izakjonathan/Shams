import { useId, useState } from "react";

export function ToggleSwitch({ label = "Enable notifications", defaultChecked = true }: { label?: string; defaultChecked?: boolean }) {
  const id = useId();
  const [checked, setChecked] = useState(defaultChecked);
  return (
    <label className="toggle-row" htmlFor={id}>
      <span><strong>{label}</strong><small>{checked ? "Enabled" : "Disabled"}</small></span>
      <input id={id} type="checkbox" checked={checked} onChange={(event) => setChecked(event.target.checked)} />
      <span className="toggle-switch" aria-hidden="true"><span /></span>
    </label>
  );
}
