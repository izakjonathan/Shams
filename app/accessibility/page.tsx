import type { Metadata } from "next";
import { InformationPage } from "../components/InformationPage";
import { contentRepository } from "../content";
import { publicContentRepository } from "../content/server";

const content = contentRepository.getInformationPage("accessibility");

export const metadata: Metadata = {
  title: content.title,
  description: content.intro,
  alternates: { canonical: "/accessibility" },
};

export default async function Page() {
  const databaseContent = await publicContentRepository.getInformationPage("accessibility");
  return <InformationPage content={databaseContent ?? content} />;
}
