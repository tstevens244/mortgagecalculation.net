import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ChevronDown, Search } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import TrustLine from "@/components/TrustLine";
import MortgageCalculator, { type TaxArea } from "@/components/MortgageCalculator";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/formatters";
import { CONFORMING_LIMIT, CONFORMING_LIMIT_HIGH_COST, LIMITS_YEAR } from "@/lib/loanLimits";
import { SITE_URL } from "@/lib/site";
import {
  EXAMPLE_RATE,
  HIGH_BASELINE,
  PMI_RATE,
  STATES_INDEX_NAME,
  STATES_INDEX_PATH,
  examplePayment,
  INSURANCE_DATA_YEAR,
  NATIONAL_INSURANCE,
  STATE_DATA_YEAR,
  statePath,
  states,
  type CountyRow,
  type StateInfo,
} from "@/lib/states";

const pct = (n: number) => `${n.toFixed(2)}%`;
const ordinal = (n: number) => {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return `${n}${s[(v - 20) % 10] || s[v] || s[0]}`;
};

/** Rank by effective tax rate, 1 = highest, among the 50 states and DC. */
const taxRank = (state: StateInfo) =>
  [...states].sort((a, b) => b.taxRate - a.taxRate || b.medianTax - a.medianTax).findIndex((s) => s.code === state.code) + 1;

const areaWord = (state: StateInfo) => (state.code === "LA" ? "parish" : state.code === "AK" ? "borough" : "county");

interface StateMortgageProps {
  state: StateInfo;
  counties: CountyRow[];
}

const StateMortgage = ({ state, counties }: StateMortgageProps) => {
  const url = `${SITE_URL}${statePath(state)}`;
  const rank = taxRank(state);
  const area = areaWord(state);
  const Area = area[0].toUpperCase() + area.slice(1);
  const highBaseline = HIGH_BASELINE.has(state.code);
  const baselineLimit = highBaseline ? CONFORMING_LIMIT_HIGH_COST : CONFORMING_LIMIT;
  const ex20 = examplePayment(state, 20);
  const ex10 = examplePayment(state, 10);
  const insuranceDiff = ((state.insurance - NATIONAL_INSURANCE) / NATIONAL_INSURANCE) * 100;

  const sortedCounties = useMemo(() => [...counties].sort((a, b) => a[0].localeCompare(b[0])), [counties]);
  const byRate = useMemo(() => [...counties].sort((a, b) => b[3] - a[3]), [counties]);
  const taxAreas: TaxArea[] = useMemo(
    () => [{ label: `${state.name} average`, rate: state.taxRate }, ...sortedCounties.map((c) => ({ label: c[0], rate: c[3] }))],
    [state, sortedCounties],
  );
  const showCounties = counties.length > 1;
  const highest = byRate.slice(0, 3);
  const lowest = byRate.slice(-3).reverse();

  const [filter, setFilter] = useState("");
  const visibleCounties = filter
    ? sortedCounties.filter((c) => c[0].toLowerCase().includes(filter.trim().toLowerCase()))
    : sortedCounties;

  const faqs = [
    {
      q: `What is the property tax rate in ${state.name}?`,
      a: `The effective property tax rate in ${state.name} is about ${pct(state.taxRate)} of a home's value a year, the ${ordinal(rank)} highest of the 50 states and DC. The median homeowner pays ${formatCurrency(state.medianTax)} a year.${
        showCounties ? ` Rates vary by ${area}, from ${pct(lowest[0][3])} in ${lowest[0][0]} to ${pct(highest[0][3])} in ${highest[0][0]}.` : ""
      }`,
    },
    {
      q: `How much is homeowners insurance in ${state.name}?`,
      a: `The average premium for a standard homeowners policy (HO-3) in ${state.name} was ${formatCurrency(state.insurance)} a year in ${INSURANCE_DATA_YEAR}, ${
        Math.abs(insuranceDiff) < 2 ? "about the same as" : `${Math.abs(insuranceDiff).toFixed(0)}% ${insuranceDiff > 0 ? "more than" : "less than"}`
      } the national average of ${formatCurrency(NATIONAL_INSURANCE)}. Premiums have risen since, so get quotes for your home.`,
    },
    {
      q: `What is the monthly mortgage payment on a typical ${state.name} home?`,
      a: `On a ${formatCurrency(ex20.price)} home, the ${state.name} median, with 20% down and a ${EXAMPLE_RATE}% 30-year fixed rate, the payment is about ${formatCurrency(ex20.total)} a month including property tax and insurance. With 10% down it's about ${formatCurrency(ex10.total)}, including PMI.`,
    },
    {
      q: `What is the conforming loan limit in ${state.name} for ${LIMITS_YEAR}?`,
      a: highBaseline
        ? `${formatCurrency(CONFORMING_LIMIT_HIGH_COST)} for a one-unit home. ${state.name} has a higher baseline limit than the rest of the country. Larger loans are jumbo loans.`
        : `${formatCurrency(CONFORMING_LIMIT)} for a one-unit home in most ${area === "county" ? "counties" : `${area}s`}, and up to ${formatCurrency(CONFORMING_LIMIT_HIGH_COST)} in high-cost areas. Larger loans are jumbo loans.`,
    },
  ];

  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: STATES_INDEX_NAME, item: `${SITE_URL}${STATES_INDEX_PATH}` },
        { "@type": "ListItem", position: 3, name: `${state.name} Mortgage Calculator`, item: url },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: `${state.name} Mortgage Calculator`,
      applicationCategory: "FinanceApplication",
      operatingSystem: "Any",
      url,
      description: `Mortgage payment calculator for ${state.name} with ${state.name} property tax rates by ${area} and average homeowners insurance.`,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
  ];

  const title = `${state.name} Mortgage Calculator: Payment With ${state.code} Taxes & Insurance`;
  const description = `Estimate your ${state.name} mortgage payment with the state's ${pct(state.taxRate)} property tax rate${
    showCounties ? ` or your ${area}'s` : ""
  } and ${formatCurrency(state.insurance)} average home insurance. Free, with an amortization schedule.`;

  const stats = [
    { label: "Median home value", value: formatCurrency(state.medianValue), note: `Owner-occupied homes, ${STATE_DATA_YEAR}` },
    { label: "Property tax rate", value: pct(state.taxRate), note: `${ordinal(rank)} highest of 50 states and DC` },
    { label: "Median property tax", value: formatCurrency(state.medianTax), note: "Per year" },
    {
      label: "Home insurance",
      value: formatCurrency(state.insurance),
      note: `Per year; national average ${formatCurrency(NATIONAL_INSURANCE)}`,
    },
  ];

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

        <main id="main-content" className="flex-1 container py-8">
          <article>
            <header className="mx-auto mb-8 max-w-3xl text-center">
              <Breadcrumbs trail={[{ label: STATES_INDEX_NAME, to: STATES_INDEX_PATH }, { label: state.name }]} />
              <h1 className="mb-4 text-3xl font-display font-bold text-foreground sm:text-4xl lg:text-5xl">
                {state.name} Mortgage Calculator
              </h1>
              <p className="text-lg text-muted-foreground">
                Your monthly payment with {state.name}'s property tax rate and average homeowners insurance already
                filled in.{showCounties && ` Pick your ${area} to use its tax rate.`}
              </p>
              <TrustLine />
            </header>

            <ul className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4" role="list" aria-label={`${state.name} housing costs`}>
              {stats.map((s) => (
                <li key={s.label} className="rounded-2xl border border-border bg-card p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{s.label}</p>
                  <p className="mt-1 text-2xl font-semibold tabular-nums text-foreground">{s.value}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{s.note}</p>
                </li>
              ))}
            </ul>

            <MortgageCalculator
              initial={{ homePrice: state.medianValue, propertyTaxRate: state.taxRate, homeInsurance: state.insurance }}
              taxAreas={showCounties ? taxAreas : undefined}
              taxAreaLabel={Area}
            />

            <div className="hub-content mx-auto mt-16 max-w-3xl">
              <h2>What a typical {state.name} home costs a month</h2>
              <p>
                For a {formatCurrency(ex20.price)} home, the median value of owner-occupied homes in {state.name}, at a{" "}
                {EXAMPLE_RATE}% 30-year fixed rate:
              </p>
              <div className="hub-table-wrap">
                <table>
                  <caption className="sr-only">Monthly payment on a median-value {state.name} home</caption>
                  <thead>
                    <tr>
                      <th scope="col">Monthly cost</th>
                      <th scope="col">20% down</th>
                      <th scope="col">10% down</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["Principal and interest", ex20.pi, ex10.pi],
                      ["Property tax", ex20.tax, ex10.tax],
                      ["Homeowners insurance", ex20.insurance, ex10.insurance],
                      ["PMI", ex20.pmi, ex10.pmi],
                    ].map(([label, a, b]) => (
                      <tr key={label as string}>
                        <th scope="row">{label}</th>
                        <td data-label="20% down">{formatCurrency(a as number)}</td>
                        <td data-label="10% down">{formatCurrency(b as number)}</td>
                      </tr>
                    ))}
                    <tr>
                      <th scope="row">Total</th>
                      <td data-label="20% down">
                        <strong>{formatCurrency(ex20.total)}</strong>
                      </td>
                      <td data-label="10% down">
                        <strong>{formatCurrency(ex10.total)}</strong>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="hub-note">
                Loan amounts {formatCurrency(ex20.loan)} and {formatCurrency(ex10.loan)}. PMI estimated at {PMI_RATE}% of
                the loan a year. HOA dues not included. Your rate, tax bill and insurance quote will differ.
              </p>

              <h2>{state.name} property taxes</h2>
              <p>
                {state.name}'s effective property tax rate is <strong>{pct(state.taxRate)}</strong>: the {ordinal(rank)}{" "}
                highest of the 50 states and DC. The median homeowner pays <strong>{formatCurrency(state.medianTax)}</strong>{" "}
                a year. On a {formatCurrency(ex20.price)} home, the state rate works out to{" "}
                {formatCurrency(ex20.tax * 12)} a year, or {formatCurrency(ex20.tax)} a month in your payment.
              </p>
              {showCounties && (
                <p>
                  Rates differ by {area}. The highest are in {highest.map((c) => `${c[0]} (${pct(c[3])})`).join(", ")};
                  the lowest are in {lowest.map((c) => `${c[0]} (${pct(c[3])})`).join(", ")}. Your actual bill also
                  depends on your city, school district, assessed value and any homestead exemption.
                </p>
              )}

              {showCounties && (
                <section aria-labelledby="county-table" className="space-y-3">
                  <h3 id="county-table" className="text-lg font-semibold text-foreground">
                    Property tax rates by {area} in {state.name}
                  </h3>
                  {counties.length > 12 && (
                    <div className="relative">
                      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                      <Input
                        type="search"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        placeholder={`Find a ${area}`}
                        aria-label={`Find a ${area}`}
                        className="pl-9"
                      />
                    </div>
                  )}
                  <div className="county-table max-h-[480px] overflow-auto rounded-2xl border border-border bg-card">
                    <table className="w-full border-collapse text-left text-sm tabular-nums">
                      <thead className="sticky top-0 bg-card shadow-[0_1px_0_hsl(var(--border))]">
                        <tr>
                          <th scope="col" className="p-3 font-semibold text-foreground">{Area}</th>
                          <th scope="col" className="p-3 text-right font-semibold text-foreground">Tax rate</th>
                          <th scope="col" className="p-3 text-right font-semibold text-foreground">Median tax</th>
                          <th scope="col" className="hidden p-3 text-right font-semibold text-foreground sm:table-cell">
                            Median home value
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {visibleCounties.map((c) => (
                          <tr key={c[0]} className="border-t border-border">
                            <th scope="row" className="p-3 font-medium text-foreground">{c[0]}</th>
                            <td className="p-3 text-right">{pct(c[3])}</td>
                            <td className="p-3 text-right">{formatCurrency(c[2])}</td>
                            <td className="hidden p-3 text-right sm:table-cell">{formatCurrency(c[1])}</td>
                          </tr>
                        ))}
                        {visibleCounties.length === 0 && (
                          <tr>
                            <td colSpan={4} className="p-3 text-muted-foreground">
                              No {area} matches "{filter}".
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  <p className="hub-note">
                    Median property tax paid each year and median value of owner-occupied homes, {STATE_DATA_YEAR - 4}–
                    {STATE_DATA_YEAR} averages. Effective rate = taxes paid ÷ home value.
                  </p>
                </section>
              )}

              <h2>Homeowners insurance in {state.name}</h2>
              <p>
                The average standard homeowners policy (HO-3) in {state.name} cost{" "}
                <strong>{formatCurrency(state.insurance)}</strong> a year in {INSURANCE_DATA_YEAR}
                {Math.abs(insuranceDiff) < 2
                  ? ", about the same as the national average"
                  : `, ${Math.abs(insuranceDiff).toFixed(0)}% ${insuranceDiff > 0 ? "above" : "below"} the national average of ${formatCurrency(
                      NATIONAL_INSURANCE,
                    )}`}
                . That's {formatCurrency(state.insurance / 12)} a month in your payment. Premiums have risen since and
                depend on the home's age, location and coverage, so replace it with a quote once you have one. Flood and
                earthquake coverage are separate policies.
              </p>

              <h2>Loan limits in {state.name}</h2>
              <p>
                {highBaseline ? (
                  <>
                    The {LIMITS_YEAR} conforming loan limit for a one-unit home in {state.name} is{" "}
                    <strong>{formatCurrency(baselineLimit)}</strong>. Alaska and Hawaii have a higher baseline limit than
                    the rest of the country, equal to the ceiling for its most expensive counties.
                  </>
                ) : (
                  <>
                    The {LIMITS_YEAR} conforming loan limit for a one-unit home is{" "}
                    <strong>{formatCurrency(CONFORMING_LIMIT)}</strong> in most of {state.name}, and up to{" "}
                    {formatCurrency(CONFORMING_LIMIT_HIGH_COST)} in high-cost {area === "county" ? "counties" : `${area}s`}.
                  </>
                )}{" "}
                Borrowing more means a <Link to="/jumbo-loan-calculator/">jumbo loan</Link>. FHA limits are also set
                by {area === "county" ? "county" : "area"}; check yours with the{" "}
                <a href="https://entp.hud.gov/idapp/html/hicostlook.cfm" target="_blank" rel="noopener noreferrer">
                  HUD FHA limit lookup
                </a>
                .
              </p>
              <p>
                Compare loan programs for a {state.name} home: <Link to="/fha-loan-calculator/">FHA</Link>,{" "}
                <Link to="/va-loan-calculator/">VA</Link>, <Link to="/usda-loan-calculator/">USDA</Link> or{" "}
                <Link to="/conventional-mortgage-calculator/">conventional</Link>. To find your price range, try{" "}
                <Link to="/house-affordability/">how much house you can afford</Link>.
              </p>
            </div>

            <section aria-labelledby="state-faq" className="mx-auto mt-14 max-w-3xl">
              <h2 id="state-faq" className="mb-4 text-2xl font-display font-semibold text-foreground">
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

            <section aria-labelledby="state-sources" className="mx-auto mt-10 max-w-3xl text-xs leading-relaxed text-muted-foreground">
              <h2 id="state-sources" className="mb-2 text-sm font-semibold text-foreground">
                Sources
              </h2>
              <ul className="list-disc space-y-1 pl-5">
                <li>
                  Median home value and property tax: U.S. Census Bureau, American Community Survey {STATE_DATA_YEAR}{" "}
                  1-year estimates (tables B25077, B25103).
                </li>
                <li>
                  Effective tax rates, state and {area}:{" "}
                  <a href="https://taxfoundation.org/data/all/state/property-taxes-by-state-county/" target="_blank" rel="noopener noreferrer" className="underline">
                    Tax Foundation, Property Taxes by State and County
                  </a>
                  , from Census data.
                </li>
                <li>
                  Homeowners insurance: National Association of Insurance Commissioners, Homeowners Insurance Report,
                  data for {INSURANCE_DATA_YEAR}, average HO-3 premium.
                </li>
                <li>
                  Loan limits: FHFA conforming loan limits for {LIMITS_YEAR}. See{" "}
                  <Link to="/methodology/" className="underline">
                    how we calculate
                  </Link>
                  .
                </li>
              </ul>
            </section>

            <nav aria-labelledby="other-states" className="mx-auto mt-14 max-w-5xl">
              <h2 id="other-states" className="mb-4 text-xl font-display font-semibold text-foreground">
                Mortgage calculators for other states
              </h2>
              <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm sm:grid-cols-3 lg:grid-cols-5" role="list">
                {states
                  .filter((s) => s.code !== state.code)
                  .map((s) => (
                    <li key={s.code}>
                      <Link to={statePath(s)} className="text-muted-foreground hover:text-primary hover:underline">
                        {s.name}
                      </Link>
                    </li>
                  ))}
              </ul>
              <p className="mt-4 text-sm">
                <Link to={STATES_INDEX_PATH} className="font-semibold text-primary hover:underline">
                  Compare all states side by side →
                </Link>
              </p>
            </nav>
          </article>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default StateMortgage;
