import Link from "next/link";
import { ArrowIcon } from "../../../components/ArrowIcon";
import type { TicketTier } from "../../content";

interface TicketSectionProps {
  readonly editing?: boolean;
  readonly tickets: readonly TicketTier[];
  readonly ticketUrl?: string;
}

function actionLabel(ticket: TicketTier, hasTicketUrl: boolean) {
  if (ticket.availability === "sold-out") return "Sold out";
  if (ticket.availability === "coming-soon" || !hasTicketUrl) return "Tickets soon";
  return "Get ticket";
}

export function TicketSection({ tickets, ticketUrl, editing = false }: TicketSectionProps) {
  return (
    <section className="tickets section darkGlowSection" id="tickets">
      {editing && <Link className="inlineEdit" href="/admin/tickets">Manage tickets</Link>}
      <div className="darkGlow darkGlowOne" aria-hidden="true" />
      <div className="ticketsHeader" data-lower-reveal>
        <div className="sectionIndex">05 — TICKETS</div>
        <span>Limited capacity</span>
      </div>
      <div className="ticketIntro" data-lower-reveal>
        <h2>Choose your way in.</h2>
        <p>Every ticket gives full access to the festival. The tiers simply offer different ways to support the shared purpose.</p>
      </div>
      <div className="ticketGrid">
        {tickets.map((ticket) => {
          const canPurchase = ticket.availability === "available" && Boolean(ticketUrl);
          return (
            <article
              data-lower-reveal
              className={ticket.featured ? "featuredTicket" : ""}
              data-availability={ticket.availability}
              key={ticket.type}
            >
              {editing && <Link className="inlineEdit" href={`/admin/tickets?edit=${encodeURIComponent(ticket.id)}#record-editor`}>Edit <span className="srOnly">{ticket.type}</span></Link>}
              <div className="ticketCardTopline">
                <span className="ticketType">{ticket.type}</span>
                <span className="badge">{ticket.badge}</span>
              </div>
              <p>{ticket.description}</p>
              <ul className="ticketIncludes">
                {ticket.includes.map((item) => <li key={item}>{item}</li>)}
              </ul>
              <strong>{ticket.price} <small>{ticket.currency}</small></strong>
              {canPurchase ? (
                <a className="ticketAction" href={ticketUrl} target="_blank" rel="noreferrer">
                  Get ticket <ArrowIcon /><span className="srOnly"> (opens in a new tab)</span>
                </a>
              ) : (
                <button type="button" disabled>
                  {actionLabel(ticket, Boolean(ticketUrl))}
                </button>
              )}
            </article>
          );
        })}
      </div>
      <div className="ticketFooter" data-lower-reveal>
        <p>All prices include fees. A portion of every ticket supports the festival’s humanitarian purpose.</p>
        <p>Ticket information remains placeholder content for now.</p>
      </div>
    </section>
  );
}
