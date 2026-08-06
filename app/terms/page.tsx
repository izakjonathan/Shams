import type { Metadata } from "next";
import { InformationPage } from "../components/InformationPage";
import { contentRepository, publicContentRepository } from "../content";

const content = contentRepository.getInformationPage("terms");

export const metadata: Metadata = {
  title: content.title,
  description: content.intro,
  alternates: { canonical: "/terms" },
};

export default async function Page() {
  const databaseContent = await publicContentRepository.getInformationPage("terms");
  return <InformationPage content={databaseContent ?? content} />;
}
