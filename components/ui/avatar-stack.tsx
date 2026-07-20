const people = [
  { initials: "MC", name: "Maya Chen" },
  { initials: "NS", name: "Noah Smith" },
  { initials: "EW", name: "Emma Wilson" },
  { initials: "LB", name: "Liam Brown" },
];
export function AvatarStack() {
  return <div className="avatar-demo"><div className="avatar-stack">{people.map((person) => <span key={person.name} title={person.name} aria-label={person.name}>{person.initials}</span>)}<span aria-label="3 more members">+3</span></div><div><strong>Project team</strong><small>7 collaborators</small></div></div>;
}
