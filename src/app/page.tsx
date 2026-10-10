import type { Metadata } from "next";
import { contentRepository } from "../features/content";
import { HomePage } from "../features/site/components/HomePage";
const event = contentRepository.getEvent();
export const metadata: Metadata = {
  title: `${event.city} · ${event.date}`,
  description:
    "A one-day festival of music, art and collective care in Copenhagen. A transparent share of every ticket supports humanitarian and community-led initiatives.",
  alternates: { canonical: "/" },
};

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export default function Home() { return <main><HomePage /></main>; }
