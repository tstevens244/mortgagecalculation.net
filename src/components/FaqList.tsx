import { ChevronDown } from "lucide-react";

export interface FaqItem {
  q: string;
  a: string;
}

interface FaqSchema {
  mainEntity: { name: string; acceptedAnswer: { text: string } }[];
}

/** Questions from a page's FAQPage schema, so the visible FAQ always matches the markup. */
export const faqsFromSchema = (schema: FaqSchema): FaqItem[] =>
  schema.mainEntity.map((e) => ({ q: e.name, a: e.acceptedAnswer.text }));

/** Expandable FAQ entries, for use inside an existing FAQ list. */
export const FaqItems = ({ faqs }: { faqs: FaqItem[] }) => (
  <>
    {faqs.map((f) => (
      <details key={f.q} className="group calculator-card overflow-hidden" data-faq>
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4 hover:bg-secondary/40 [&::-webkit-details-marker]:hidden">
          <h3 className="font-sans text-base font-semibold text-foreground">{f.q}</h3>
          <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" aria-hidden="true" />
        </summary>
        <p className="px-4 pb-4 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
      </details>
    ))}
  </>
);

/** A "Frequently asked questions" section. */
const FaqSection = ({ faqs }: { faqs: FaqItem[] }) => (
  <section aria-labelledby="page-faq" className="page-section">
    <h2 id="page-faq" className="mb-4 text-2xl font-display font-semibold text-foreground">
      Frequently asked questions
    </h2>
    <div className="space-y-3">
      <FaqItems faqs={faqs} />
    </div>
  </section>
);

export default FaqSection;
