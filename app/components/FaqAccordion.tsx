"use client";

import { useId, useState } from "react";
import type { FaqEntry } from "../content";

export function FaqAccordion({ faqs }: { faqs: readonly FaqEntry[] }) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const idPrefix = useId();

  return (
    <div className="faqList">
      {faqs.map(({ question, answer }, index) => {
        const isOpen = openFaq === index;
        const buttonId = `${idPrefix}-button-${index}`;
        const answerId = `${idPrefix}-answer-${index}`;

        return (
          <article className={isOpen ? "open" : ""} key={question}>
            <button
              id={buttonId}
              type="button"
              onClick={() => setOpenFaq(isOpen ? null : index)}
              aria-expanded={isOpen}
              aria-controls={answerId}
            >
              <span>{question}</span>
              <span className="faqToggleIcon" aria-hidden="true">{isOpen ? "−" : "+"}</span>
            </button>
            <div
              id={answerId}
              className="faqAnswer"
              role="region"
              aria-labelledby={buttonId}
              aria-hidden={!isOpen}
              inert={!isOpen}
            >
              <div className="faqAnswerInner">
                <p>{answer}</p>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
