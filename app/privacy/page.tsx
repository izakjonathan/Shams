import type { Metadata } from "next";
import { InformationPage } from "../components/InformationPage";

export const metadata: Metadata = {
  title: "Privacy",
  description: "How Shams for Humanity handles personal information.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return <InformationPage
    index="01 — PRIVACY"
    title="Privacy, in plain language."
    intro="This draft explains what information Shams for Humanity may collect, why we use it and the choices available to you. It must be reviewed when the final organizer, providers and contact details are confirmed."
    updated="27 July 2026"
    sections={[
      {
        heading: "Who is responsible",
        paragraphs: [
          "Shams for Humanity is responsible for the personal information processed through this website and its event communications. Before launch, this section will be updated with the organizer’s legal name, postal address, CVR number and direct privacy contact.",
          "Draft contact: privacy@shamsforhumanity.example. Replace this address before publication.",
        ],
      },
      {
        heading: "Information we may collect",
        items: [
          "Contact details you provide, such as your name and email address.",
          "Messages, access requests or other information you send directly to us.",
          "Newsletter preferences and evidence of consent where a mailing list is used.",
          "Limited technical information needed for security, delivery and basic website operation.",
          "Ticket information supplied by the ticket provider where necessary to support your booking or event access.",
        ],
      },
      {
        heading: "Why we use it",
        paragraphs: [
          "We use personal information only for defined purposes: responding to enquiries, providing requested event information, managing access needs, operating a newsletter you have chosen to join, supporting ticket-related questions and keeping the website secure.",
          "The final notice will identify the relevant legal basis for each activity, including consent, performance of a contract, legal obligations and legitimate interests where applicable.",
        ],
      },
      {
        heading: "Who receives information",
        paragraphs: [
          "We may use carefully selected service providers for website hosting, email delivery, ticketing and event administration. They should receive only the information required for their role and must handle it under appropriate contractual and security safeguards.",
          "The final version will name the main providers and explain any processing or transfers outside the EU/EEA, including the safeguards used.",
        ],
      },
      {
        heading: "How long we keep it",
        paragraphs: [
          "We keep personal information only for as long as needed for the purpose for which it was collected, or for a longer period where accounting, legal or dispute-resolution requirements apply. Newsletter information is retained until you unsubscribe or the mailing list is closed, subject to any limited record needed to document consent.",
        ],
      },
      {
        heading: "Your choices and rights",
        items: [
          "Ask for access to the personal information we hold about you.",
          "Ask us to correct inaccurate or incomplete information.",
          "Ask for deletion or restriction where the applicable rules allow it.",
          "Object to certain processing or withdraw consent at any time.",
          "Ask for portable data where the right applies.",
          "Complain to the Danish Data Protection Agency if you believe your information has been handled unlawfully.",
        ],
      },
      {
        heading: "Cookies and local storage",
        paragraphs: [
          "The current site uses session storage to remember that the splash screen has already been shown in the active browser tab. This is used only for interface behavior and is not used to track you across websites.",
          "If analytics, marketing tools or other non-essential cookies are added later, the site and this notice must be updated before those tools are enabled.",
        ],
      },
      {
        heading: "Changes to this notice",
        paragraphs: [
          "We may update this notice when the event setup, providers or legal requirements change. The current publication date will always be shown at the top of the page.",
        ],
      },
    ]}
  />;
}
