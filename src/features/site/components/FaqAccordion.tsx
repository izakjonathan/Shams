"use client";

import Link from "next/link";
import { useId, useState } from "react";
import type { FaqEntry } from "../../content";

export function FaqAccordion({ faqs, editing = false }: { faqs: readonly FaqEntry[]; editing?: boolean }) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const idPrefix = useId();

  return (
    <div className="faqList">
      {faqs.map(({ question, answer }, index) => {
        const isOpen = openFaq === index;
        const buttonId = `${idPrefix}-button-${index}`;
        const answerId = `${idPrefix}-answer-${index}`;

        return (
          <article data-lower-reveal className={isOpen ? "open" : ""} key={question}>
            {editing && <Link className="inlineEdit" href={`/admin/faqs?edit=${encodeURIComponent(faqs[index].id)}#record-editor`}>Edit FAQ <span className="srOnly">{question}</span></Link>}
            <button
              id={buttonId}
              type="button"
              onClick={() => setOpenFaq(isOpen ? null : index)}
              aria-expanded={isOpen}
              aria-controls={answerId}
            >
              <span>{question}</span>
              <span className="faqToggleIcon" aria-hidden="true" />
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
