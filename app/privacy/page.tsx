import type { Metadata } from "next";
import { InformationPage } from "../components/InformationPage";
import { contentRepository } from "../content";

const content = contentRepository.getInformationPage("privacy");

export const metadata: Metadata = {
  title: content.title,
  description: content.intro,
  alternates: { canonical: "/privacy" },
};

export default function Page() {
  return <InformationPage content={content} />;
}
