import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowDown, ArrowUp, ChevronDown } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import TrustLine from "@/components/TrustLine";
import { formatCurrency } from "@/lib/formatters";
import { SITE_URL } from "@/lib/site";
import {
  EXAMPLE_RATE,
  INSURANCE_DATA_YEAR,
  NATIONAL_INSURANCE,
  STATE_DATA_YEAR,
  STATES_INDEX_NAME,
  STATES_INDEX_PATH,
  examplePayment,
  statePath,
  states,
} from "@/lib/states";

type SortKey = "name" | "medianValue" | "taxRate" | "medianTax" | "insurance" | "payment";

const rows = states.map((s) => ({ ...s, payment: examplePayment(s, 20).total }));

const columns: { key: SortKey; label: string; numeric?: boolean; mobile?: boolean }[] = [
  { key: "name", label: "State", mobile: true },
  { key: "medianValue", label: "Median home value", numeric: true },
  { key: "taxRate", label: "Property tax rate", numeric: true, mobile: true },
  { key: "medianTax", label: "Median property tax", numeric: true },
  { key: "insurance", label: "Home insurance", numeric: true },
  { key: "payment", label: "Typical payment", numeric: true, mobile: true },
];

const byTax = [...rows].sort((a, b) => b.taxRate - a.taxRate);
const byPayment = [...rows].sort((a, b) => b.payment - a.payment);
const byInsurance = [...rows].sort((a, b) => b.insurance - a.insurance);
const list = (xs: typeof rows, f: (r: (typeof rows)[number]) => string) => xs.map((r) => `${r.name} (${f(r)})`).join(", ");

const faqs = [
  {
    q: "Which states have the highest property taxes?",
    a: `By effective rate: ${list(byTax.slice(0, 3), (r) => `${r.taxRate.toFixed(2)}%`)}. The lowest are ${list(
      byTax.slice(-3).reverse(),
      (r) => `${r.taxRate.toFixed(2)}%`,
    )}. A low rate can still mean a large bill where homes are expensive.`,
  },
  {
    q: "Which states have the most expensive homeowners insurance?",
    a: `Average HO-3 premiums in ${INSURANCE_DATA_YEAR} were highest in ${list(byInsurance.slice(0, 3), (r) =>
      formatCurrency(r.insurance),
    )}, against a national average of ${formatCurrency(NATIONAL_INSURANCE)}. They were lowest in ${list(
      byInsurance.slice(-3).reverse(),
      (r) => formatCurrency(r.insurance),
    )}.`,
  },
  {
    q: "Where is the monthly mortgage payment on a typical home highest?",
    a: `On each state's median-value home with 20% down at ${EXAMPLE_RATE}% for 30 years, including property tax and insurance, the payment is highest in ${list(
      byPayment.slice(0, 3),
      (r) => formatCurrency(r.payment),
    )}, and lowest in ${list(byPayment.slice(-3).reverse(), (r) => formatCurrency(r.payment))}.`,
  },
];

const StatesIndex = () => {
  const [sort, setSort] = useState<{ key: SortKey; desc: boolean }>({ key: "name", desc: false });
  const sorted = useMemo(() => {
    const out = [...rows].sort((a, b) =>
      sort.key === "name" ? a.name.localeCompare(b.name) : (a[sort.key] as number) - (b[sort.key] as number),
    );
    return sort.desc ? out.reverse() : out;
  }, [sort]);

  const url = `${SITE_URL}${STATES_INDEX_PATH}`;
  const title = "Mortgage Calculator by State: Property Taxes, Insurance & Payments";
  const description =
    "Mortgage calculators for all 50 states and DC with each state's property tax rate, home insurance and typical monthly payment. Compare states side by side.";

  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: STATES_INDEX_NAME, item: url },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: STATES_INDEX_NAME,
      description,
      url,
      mainEntity: {
        "@type": "ItemList",
        itemListElement: states.map((s, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: `${s.name} Mortgage Calculator`,
          url: `${SITE_URL}${statePath(s)}`,
        })),
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
  ];

  const toggle = (key: SortKey) =>
    setSort((s) => (s.key === key ? { key, desc: !s.desc } : { key, desc: key !== "name" }));

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={url} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={url} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        {schemas.map((s) => (
          <script key={s["@type"]} type="application/ld+json">
            {JSON.stringify(s)}
          </script>
        ))}
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />
        <main id="main-content" className="flex-1 container py-8 sm:py-12">
          <article>
            <header className="page-header">
              <Breadcrumbs trail={[{ label: STATES_INDEX_NAME }]} />
              <h1 className="mb-4 text-3xl font-display font-bold text-foreground sm:text-4xl lg:text-5xl">
                {STATES_INDEX_NAME}
              </h1>
              <p className="text-lg text-muted-foreground">
                Property taxes and insurance can change a mortgage payment by hundreds of dollars a month from one state
                to the next. Pick your state for a calculator with its rates filled in, or compare them all below.
              </p>
              <TrustLine />
            </header>

            <nav aria-label="State mortgage calculators" className="mx-auto max-w-5xl">
              <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4" role="list">
                {states.map((s) => (
                  <li key={s.code}>
                    <Link
                      to={statePath(s)}
                      className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-secondary"
                    >
                      <span className="w-7 shrink-0 text-xs font-semibold text-muted-foreground">{s.code}</span>
                      {s.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <section aria-labelledby="compare-states" className="page-section-wide">
              <h2 id="compare-states" className="mb-2 text-2xl font-display font-semibold text-foreground">
                Compare housing costs by state
              </h2>
              <p className="mb-4 text-sm text-muted-foreground">
                Select a column to sort. Typical payment is for the state's median-value home with 20% down at a {EXAMPLE_RATE}%
                30-year fixed rate, including property tax and insurance.
              </p>
              <div className="max-h-[640px] overflow-auto rounded-2xl border border-border bg-card">
                <table className="w-full border-collapse text-left text-sm tabular-nums">
                  <caption className="sr-only">Housing costs by state</caption>
                  <thead className="sticky top-0 z-10 bg-card shadow-[0_1px_0_hsl(var(--border))]">
                    <tr>
                      {columns.map((c) => (
                        <th
                          key={c.key}
                          scope="col"
                          aria-sort={sort.key === c.key ? (sort.desc ? "descending" : "ascending") : "none"}
                          className={`p-0 ${c.mobile ? "" : "hidden md:table-cell"}`}
                        >
                          <button
                            type="button"
                            onClick={() => toggle(c.key)}
                            className={`flex w-full items-center gap-1 p-3 font-semibold text-foreground hover:text-primary ${
                              c.numeric ? "justify-end text-right" : ""
                            }`}
                          >
                            {c.label}
                            {sort.key === c.key &&
                              (sort.desc ? (
                                <ArrowDown className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                              ) : (
                                <ArrowUp className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                              ))}
                          </button>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sorted.map((r) => (
                      <tr key={r.code} className="border-t border-border">
                        <th scope="row" className="p-3 font-medium">
                          <Link to={statePath(r)} className="text-primary hover:underline">
                            {r.name}
                          </Link>
                        </th>
                        <td className="hidden p-3 text-right md:table-cell">{formatCurrency(r.medianValue)}</td>
                        <td className="p-3 text-right">{r.taxRate.toFixed(2)}%</td>
                        <td className="hidden p-3 text-right md:table-cell">{formatCurrency(r.medianTax)}</td>
                        <td className="hidden p-3 text-right md:table-cell">{formatCurrency(r.insurance)}</td>
                        <td className="p-3 text-right font-medium">{formatCurrency(r.payment)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Median home value and property tax: Census ACS {STATE_DATA_YEAR}. Tax rates: Tax Foundation.
                Insurance: NAIC average HO-3 premium, {INSURANCE_DATA_YEAR}.
              </p>
            </section>

            <section aria-labelledby="states-faq" className="page-section">
              <h2 id="states-faq" className="mb-4 text-2xl font-display font-semibold text-foreground">
                Frequently asked questions
              </h2>
              <div className="space-y-3">
                {faqs.map((f) => (
                  <details key={f.q} className="group calculator-card overflow-hidden" data-faq>
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4 hover:bg-secondary/40 [&::-webkit-details-marker]:hidden">
                      <h3 className="font-sans text-base font-semibold text-foreground">{f.q}</h3>
                      <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" aria-hidden="true" />
                    </summary>
                    <p className="px-4 pb-4 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
                  </details>
                ))}
              </div>
            </section>
          </article>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default StatesIndex;
