import { CalendarDays, Clock3, MapPin, Users } from "lucide-react";

export function BookingCard() {
  return (
    <article className="booking-card">
      <div className="booking-date"><strong>18</strong><span>JUL</span></div>
      <div className="booking-content">
        <header><div><span>Confirmed booking</span><h3>Product strategy workshop</h3></div><span className="booking-status">Confirmed</span></header>
        <div className="booking-details"><span><Clock3 size={15}/> 10:00–13:30</span><span><MapPin size={15}/> Studio 4B</span><span><Users size={15}/> 8 guests</span><span><CalendarDays size={15}/> Friday</span></div>
        <footer><div className="booking-host"><span>IH</span><div><small>Hosted by</small><strong>Izak Hyllested</strong></div></div><button>Manage booking</button></footer>
      </div>
    </article>
  );
}
