"use client";

import { useState } from "react";
import type { FaqEntry } from "../lib/content";

export function FaqAccordion({ faqs }: { faqs: FaqEntry[] }) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="faqList">
      {faqs.map(({ question, answer }, index) => {
        const isOpen = openFaq === index;
        const answerId = `faq-answer-${index}`;
        return (
          <article className={isOpen ? "open" : ""} key={question}>
            <button
              type="button"
              onClick={() => setOpenFaq(isOpen ? null : index)}
              aria-expanded={isOpen}
              aria-controls={answerId}
            >
              <span>{question}</span>
              <i aria-hidden="true">{isOpen ? "−" : "+"}</i>
            </button>
            <div id={answerId} className="faqAnswer">
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
