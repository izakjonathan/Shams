import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { InformationPage } from "../../features/site/components/InformationPage";
import { contentRepository } from "../../features/content";
import { publicContentRepository } from "../../features/content/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const content = contentRepository.getInformationPage("terms");

export const metadata: Metadata = {
  title: content.title,
  description: content.intro,
  alternates: { canonical: "/terms" },
};

export default async function Page() {
  const databaseContent = await publicContentRepository.getInformationPage("terms");
  if (!databaseContent) notFound();
  return <InformationPage content={databaseContent} />;
}
