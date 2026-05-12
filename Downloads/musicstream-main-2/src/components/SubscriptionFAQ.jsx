import { useState } from "react";

const ITEMS = [
  {
    q: "Can I switch between monthly and yearly later?",
    a: "Yes. When you change billing period, the new rate applies at the start of your next renewal cycle. Yearly plans include a 20% discount compared to paying monthly for 12 months.",
  },
  {
    q: "How does Student verification work?",
    a: "We verify eligibility through a supported institution email or approved partner. Once verified, you keep Student pricing until you need to reconfirm or your status expires.",
  },
  {
    q: "What is included in the Family plan?",
    a: "Family covers up to six accounts on one bill, with every member getting Individual-tier benefits plus shared parental controls for explicit content and listening insights.",
  },
  {
    q: "Can I download music for offline listening?",
    a: "Offline downloads are available on Individual and Family plans. Student streaming is standard quality online-first; offline may be limited by policy.",
  },
];

export default function SubscriptionFAQ() {
  const [open, setOpen] = useState(0);

  return (
    <section className="subscription-faq glass-card" aria-labelledby="faq-heading">
      <h2 id="faq-heading" className="subscription-faq__heading">
        Frequently asked questions
      </h2>
      <div className="subscription-faq__list">
        {ITEMS.map((item, i) => {
          const isOpen = open === i;
          return (
            <div
              key={item.q}
              className={`subscription-faq__item ${isOpen ? "subscription-faq__item--open" : ""}`}
            >
              <button
                type="button"
                className="subscription-faq__trigger"
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${i}`}
                id={`faq-trigger-${i}`}
                onClick={() => setOpen(isOpen ? -1 : i)}
              >
                <span>{item.q}</span>
                <span className="subscription-faq__chev" aria-hidden />
              </button>
              <div
                className={`subscription-faq__panel ${isOpen ? "subscription-faq__panel--open" : ""}`}
                id={`faq-panel-${i}`}
              >
                <p>{item.a}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
