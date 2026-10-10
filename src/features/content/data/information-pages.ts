import type { InformationPageContent } from "../models";

export const informationPages = {
  privacy: {
    id: "page-privacy",
    slug: "privacy",
    status: "placeholder",
    index: '01 — PRIVACY',
    title: 'Privacy, in plain language.',
    intro: 'This draft explains what information Shams for Humanity may collect, why we use it and the choices available to you. It must be reviewed when the final organizer, providers and contact details are confirmed.',
    updated: '27 July 2026',
    sections: [
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
    ].map((section, index) => ({ id: `privacy-section-${index + 1}`, sortOrder: index + 1, status: "placeholder" as const, ...section })),
  } satisfies InformationPageContent,
  terms: {
    id: "page-terms",
    slug: "terms",
    status: "placeholder",
    index: '02 — TERMS',
    title: 'Clear terms for a shared day.',
    intro: 'These are draft website and event terms. Final ticketing, organizer and venue terms must be inserted and legally reviewed before public ticket sales begin.',
    updated: '27 July 2026',
    sections: [
{
        heading: "About these terms",
        paragraphs: [
          "These terms apply to your use of the Shams for Humanity website and, once tickets are available, to attendance at the event unless the ticket provider or venue presents additional terms. The organizer’s final legal identity and contact details will be added before launch.",
        ],
      },
      {
        heading: "Tickets and payment",
        paragraphs: [
          "Tickets will be sold through an external ticket provider. Prices, fees, payment methods and booking confirmation will be shown during checkout. The provider’s purchasing terms will form part of the agreement and should be read before payment.",
          "A booking is complete only when the ticket provider has accepted payment and issued a confirmation. Do not publish this section until the final ticket provider and ticket conditions have been confirmed.",
        ],
      },
      {
        heading: "Refunds, cancellation and changes",
        paragraphs: [
          "The final refund policy will explain what happens if the event is cancelled, postponed, moved or materially changed. Festival programmes may change because of artist availability, safety requirements or circumstances outside the organizer’s reasonable control.",
          "Any limitation on refunds must be consistent with applicable consumer law and the final ticket-provider agreement. Placeholder wording should not be relied on when handling a real claim.",
        ],
      },
      {
        heading: "Entry and conduct",
        items: [
          "Bring a valid ticket and any identification required by the announced age policy.",
          "Follow reasonable instructions from event, venue, security and access staff.",
          "Treat other guests, artists, staff and the surrounding community with respect.",
          "Harassment, discrimination, violence, dangerous behavior and deliberate damage are not accepted.",
          "Entry may be refused or a guest may be removed where reasonably necessary for safety, legal compliance or serious breach of these terms.",
        ],
      },
      {
        heading: "Accessibility and individual needs",
        paragraphs: [
          "We aim to provide clear access information and reasonable support. Guests are encouraged to contact the access team in advance when they need specific arrangements. See the Accessibility page for the current draft commitments.",
        ],
      },
      {
        heading: "Photography and recording",
        paragraphs: [
          "Event photography or filming may take place. Final signage and terms will explain how official content is used and how guests can raise a concern. Commercial recording, professional equipment and artist-performance recording may be restricted.",
        ],
      },
      {
        heading: "Website content",
        paragraphs: [
          "We try to keep event information accurate, but provisional schedules, artist details and venue information may change. Content may not be copied or commercially reused without permission, except where applicable law allows it.",
        ],
      },
      {
        heading: "Responsibility and contact",
        paragraphs: [
          "Nothing in these terms excludes responsibility that cannot legally be excluded. The final version should define the organizer’s responsibility, complaint process, governing law and dispute-resolution information after professional review.",
          "For current questions, use the Contact page. Replace all placeholder addresses before public launch.",
        ],
      },
    ].map((section, index) => ({ id: `terms-section-${index + 1}`, sortOrder: index + 1, status: "placeholder" as const, ...section })),
  } satisfies InformationPageContent,
  accessibility: {
    id: "page-accessibility",
    slug: "accessibility",
    status: "placeholder",
    index: '03 — ACCESSIBILITY',
    title: 'A festival designed for access.',
    intro: 'This draft sets out our intended website and event access approach. Exact venue facilities and booking procedures will be confirmed when the venue is announced.',
    updated: '27 July 2026',
    sections: [
{
        heading: "Our commitment",
        paragraphs: [
          "Shams for Humanity aims to create an event that more people can use, understand and enjoy. We will treat access as part of the event design rather than an afterthought and will communicate honestly where limitations remain.",
        ],
      },
      {
        heading: "Planned venue access",
        items: [
          "Step-free entry and routes between the main public areas where the final venue allows it.",
          "Accessible toilet information published before the event.",
          "Seating and rest opportunities across the site.",
          "A quieter area away from the main stages.",
          "Clear arrival, transport and entrance information.",
          "A contact route for individual access questions and companion arrangements.",
        ],
      },
      {
        heading: "Sound, light and sensory information",
        paragraphs: [
          "Live music events may include high sound levels, bass, haze, darkness, moving light and flashing effects. We will publish more specific warnings with the final programme and make hearing protection information available.",
          "Guests who need to leave and return to a performance area should contact the access team about the available options at the final venue.",
        ],
      },
      {
        heading: "Website accessibility",
        paragraphs: [
          "The website is designed for keyboard navigation, visible focus, screen-reader structure, reduced-motion preferences and responsive text. We continue to test the experience as content and integrations are added.",
          "Some final artist images, ticket-provider pages and third-party services are not yet present. Their accessibility will need separate review before launch.",
        ],
      },
      {
        heading: "Requesting support",
        paragraphs: [
          "Please contact us as early as possible with access questions or requests. Tell us what would help rather than providing medical details unless they are necessary for the arrangement.",
          "Draft access contact: access@shamsforhumanity.example. Replace this address before publication.",
        ],
      },
      {
        heading: "Feedback",
        paragraphs: [
          "If you encounter a barrier on the website or at the event, we want to hear about it. Include the page, area or situation involved and the format in which you would prefer a response. We will acknowledge feedback and explain what can be changed or why a limitation remains.",
        ],
      },
    ].map((section, index) => ({ id: `accessibility-section-${index + 1}`, sortOrder: index + 1, status: "placeholder" as const, ...section })),
  } satisfies InformationPageContent,
} as const;
