import { Mail, MapPin, MoreHorizontal, Phone } from "lucide-react";

export function CustomerCard() {
  return (
    <article className="customer-card">
      <header>
        <div className="customer-avatar" aria-hidden="true">AM</div>
        <div><strong>Amelia Morgan</strong><span>Northstar Studio</span></div>
        <button aria-label="More customer actions"><MoreHorizontal size={18}/></button>
      </header>
      <dl>
        <div><dt><Mail size={15}/> Email</dt><dd>amelia@northstar.co</dd></div>
        <div><dt><Phone size={15}/> Phone</dt><dd>+45 22 84 16 90</dd></div>
        <div><dt><MapPin size={15}/> Location</dt><dd>Copenhagen, DK</dd></div>
      </dl>
      <footer><span>Customer since Jan 2026</span><button>Open profile</button></footer>
    </article>
  );
}
