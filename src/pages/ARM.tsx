import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TrustLine from "@/components/TrustLine";
import GuideContents from "@/components/GuideContents";
import RelatedCalculators from "@/components/RelatedCalculators";
import Breadcrumbs from "@/components/Breadcrumbs";
import ARMCalculator from "@/components/ARMCalculator";
import { calculatorBreadcrumbSchema } from "@/lib/calculators";

const faqs = [
  {
    q: "What is a 5/6 ARM?",
    a: "A 5/6 ARM has a fixed rate for the first 5 years, then adjusts every 6 months. It's the most common ARM today, tied to the SOFR index. A 7/6 ARM is fixed for 7 years and a 10/6 ARM for 10, both then adjusting every 6 months.",
  },
  {
    q: "What's the difference between a 5/1 and a 5/6 ARM?",
    a: "Both are fixed for 5 years. A 5/1 then adjusts once a year; a 5/6 adjusts every 6 months. Most new conventional ARMs are 5/6, 7/6 or 10/6 since lenders moved from LIBOR to SOFR; 5/1-style annual ARMs are still common for FHA, VA and some jumbo loans.",
  },
  {
    q: "What index is used to adjust ARM rates?",
    a: "Most ARMs today use the Secured Overnight Financing Rate (SOFR), which replaced LIBOR in 2023. Your new rate equals the index plus a margin set when you take the loan, often 2 to 3 points, within the rate caps.",
  },
  {
    q: "What are ARM rate caps?",
    a: "Caps limit how much the rate can rise: at the first adjustment, at each later adjustment, and over the life of the loan. A 5/6 ARM sold to Fannie Mae or Freddie Mac usually has 2/1/5 caps: up to 2 points at the first change, 1 point at each later change, and 5 points in total. 7/6 and 10/6 ARMs usually have 5/1/5 caps.",
  },
  {
    q: "Should I choose an ARM or a fixed-rate mortgage?",
    a: "An ARM can save money if you'll sell or refinance before the fixed period ends. A fixed rate is safer if you'll stay long-term or your budget couldn't absorb a higher payment. Check the worst-case payment in the calculator before choosing an ARM.",
  },
  {
    q: "Can I refinance out of an ARM before it adjusts?",
    a: "Yes, and many borrowers do. If rates are reasonable before the fixed period ends, you can refinance into a fixed-rate loan. Make sure you'll keep the new loan long enough to recover its closing costs.",
  },
  {
    q: "What happens if I can't afford my ARM payment after it adjusts?",
    a: "Your options are refinancing, selling, or asking your servicer about a loan modification. That's why it's important to check the worst-case payment at the lifetime cap before you choose an ARM.",
  },
  {
    q: "Can I get an ARM with an FHA or VA loan?",
    a: "Yes. FHA and VA ARMs adjust once a year after the fixed period. Shorter fixed periods usually have 1/1/5 caps, and 7- and 10-year fixed periods have larger caps, often 2/2/6.",
  },
];

const ARM = () => {
  const canonicalUrl = "https://mortgagecalculation.net/adjustable-rate-mortgage-calculator/";

  const breadcrumbSchema = calculatorBreadcrumbSchema("/adjustable-rate-mortgage-calculator/");

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "ARM Calculator",
    description:
      "Free adjustable rate mortgage calculator to estimate ARM payments, compare initial vs maximum rates, and understand rate adjustment caps.",
    url: canonicalUrl,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    featureList: [
      "Calculate ARM payments before and after adjustments",
      "Compare initial vs maximum possible payments",
      "Understand rate cap protection",
      "5/6, 7/6 and 10/6 SOFR ARMs and 3/1, 5/1, 7/1 and 10/1 annual ARMs",
      "Compare ARM vs fixed-rate mortgages",
      "Payment projection over loan term",
    ],
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  return (
    <>
      <Helmet>
        <title>ARM Calculator: 5/6, 7/6 & 10/6 Adjustable-Rate Mortgages</title>
        <meta
          name="description"
          content="Free ARM calculator for 5/6, 7/6 and 10/6 SOFR ARMs and 5/1-style annual ARMs: your payment after each rate adjustment, the worst case at the cap, and the full schedule."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="ARM Calculator: 5/6, 7/6 & 10/6 Adjustable-Rate Mortgages" />
        <meta
          property="og:description"
          content="Calculate adjustable rate mortgage payments with our free ARM calculator. Compare initial vs maximum payments and understand rate adjustment caps."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="ARM Calculator - Adjustable Rate Mortgage Calculator" />
        <meta
          name="twitter:description"
          content="Calculate adjustable rate mortgage payments with our free ARM calculator. Compare initial vs maximum payments."
        />
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(webAppSchema)}</script>
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background">
        <Header />

        <main id="main-content" className="flex-1">
          <article className="container py-8">
            <header className="page-header">
              <Breadcrumbs />
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground">
                Adjustable-Rate Mortgage (ARM) Calculator
              </h1>
              <p className="text-muted-foreground mt-2 text-base sm:text-lg max-w-3xl mx-auto">
                See your payment on a 5/6, 7/6 or 10/6 ARM, or a 5/1-style annual ARM, before and after the rate
                adjusts, and the worst case if it rises to the cap.
              </p>
              <TrustLine />
            </header>

            <ARMCalculator />


            <RelatedCalculators />

            <GuideContents />
            {/* Educational Content */}
            <section className="page-section guide space-y-12">
              <div>
                <h2 className="text-2xl font-display font-semibold mb-4">The Complete Guide to Adjustable Rate Mortgages</h2>
                <p className="text-muted-foreground leading-relaxed">
                  An Adjustable Rate Mortgage (ARM) is a home loan with an interest rate that can change periodically 
                  based on market conditions. Unlike <Link to="/" className="text-primary hover:underline">fixed-rate mortgages</Link> where 
                  your rate never changes, ARMs offer a lower initial rate that adjusts after a set period. According to 
                  the <a href="https://www.consumerfinance.gov/ask-cfpb/what-is-the-difference-between-a-fixed-rate-and-adjustable-rate-mortgage-arm-loan-en-100/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Consumer Financial Protection Bureau</a>, 
                  understanding how ARMs work is essential before choosing this loan type.
                </p>

                <h3 className="text-xl font-display font-semibold mt-8 mb-3">How ARM Naming Works</h3>
                <p className="text-muted-foreground leading-relaxed">
                  ARMs are named by their structure: the first number is the fixed-rate period (in years), 
                  and the second is how often the rate adjusts afterward. In a <strong>5/6 ARM</strong> the
                  second number is months: fixed for 5 years, then adjusting every 6 months. In a{" "}
                  <strong>5/1 ARM</strong> it's years: fixed for 5 years, then adjusting once a year. Since lenders
                  moved from LIBOR to the SOFR index, most new conventional ARMs are 5/6, 7/6 or 10/6.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="calculator-card p-6">
                  <h3 className="text-xl font-display font-semibold mb-4">Common ARM Types</h3>
                  <ul className="space-y-3 text-muted-foreground">
                    {[
                      ["5/6 ARM", "Fixed for 5 years, then adjusts every 6 months. The most common ARM today; caps usually 2/1/5."],
                      ["7/6 ARM", "Fixed for 7 years, then every 6 months. A middle ground; caps usually 5/1/5."],
                      ["10/6 ARM", "Fixed for 10 years, then every 6 months. Closest to a fixed rate; caps usually 5/1/5."],
                      ["5/1, 7/1, 10/1 ARM", "Adjust once a year after the fixed period. Common for FHA, VA and some jumbo loans."],
                      ["3/1 ARM", "Fixed for 3 years. Lowest starting rate, most rate risk; less common today."],
                    ].map(([name, text]) => (
                      <li key={name} className="flex items-start gap-2">
                        <span className="shrink-0 font-bold text-accent-strong">{name}:</span>
                        <span>{text}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="calculator-card p-6">
                  <h3 className="text-xl font-display font-semibold mb-4">Understanding Rate Caps</h3>
                  <p className="text-muted-foreground mb-4">
                    Rate caps protect borrowers from extreme rate increases. Caps are written as three numbers, such as 2/1/5 on a 5/6 ARM:
                  </p>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-accent-strong font-bold">Initial Cap:</span>
                      <span>Maximum increase at first adjustment (often 2-5%).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent-strong font-bold">Periodic Cap:</span>
                      <span>Maximum change at each later adjustment (typically 1% on 6-month ARMs, 1-2% on annual ARMs).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent-strong font-bold">Lifetime Cap:</span>
                      <span>Maximum total increase over the loan's life (usually 5-6%).</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-display font-semibold mt-10 mb-4">ARM Loan Pros and Cons</h2>
              </div>
              <div className="grid gap-6 md:grid-cols-2 not-prose">
                <div className="calculator-card p-4">
                  <h3 className="font-display font-semibold text-lg mb-3 text-accent-strong">✓ Advantages of ARMs</h3>
                  <ul className="space-y-2 text-muted-foreground text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-accent-strong">✓</span>
                      <span>Lower initial rate—typically 0.5-1% below fixed rates</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent-strong">✓</span>
                      <span>Lower monthly payments during fixed period</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent-strong">✓</span>
                      <span>May qualify for a larger loan amount</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent-strong">✓</span>
                      <span>Rate caps protect against extreme increases</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent-strong">✓</span>
                      <span>Potential savings if rates decrease</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent-strong">✓</span>
                      <span>Great for planned short-term ownership</span>
                    </li>
                  </ul>
                </div>

                <div className="calculator-card p-4">
                  <h3 className="font-display font-semibold text-lg mb-3 text-primary">✗ Disadvantages of ARMs</h3>
                  <ul className="space-y-2 text-muted-foreground text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-primary">✗</span>
                      <span>Payment uncertainty after fixed period</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">✗</span>
                      <span>Rate could increase significantly</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">✗</span>
                      <span>Complex terms can be confusing</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">✗</span>
                      <span>Risk if you can't sell/refinance as planned</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">✗</span>
                      <span>Negative amortization possible on some products</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">✗</span>
                      <span>Harder to budget long-term</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-display font-semibold mt-10 mb-4">Who Is an ARM Best For?</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  ARMs can be excellent choices for certain borrowers and situations:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li><strong>Short-term homeowners:</strong> Planning to sell within 5-7 years</li>
                  <li><strong>Frequent relocators:</strong> Military, corporate transfers, job changes</li>
                  <li><strong>Refinance planners:</strong> Intend to <Link to="/refinance-calculator/" className="text-primary hover:underline">refinance</Link> before adjustment</li>
                  <li><strong>Rising income earners:</strong> Expect higher income to offset potential increases</li>
                  <li><strong>Rate speculators:</strong> Believe rates will decrease in the future</li>
                  <li><strong>Jumbo borrowers:</strong> <Link to="/jumbo-loan-calculator/" className="text-primary hover:underline">Jumbo ARMs</Link> often have better rates than jumbo fixed</li>
                </ul>
              </div>

              <div className="calculator-card p-6">
                <h3 className="text-xl font-display font-semibold mb-4">How to Interpret Your ARM Calculator Results</h3>
                <ul className="space-y-3 text-muted-foreground text-sm">
                  <li>
                    <strong>Compare worst-case scenario:</strong> Look at the maximum possible payment after 
                    all rate caps are reached. Can you afford this payment if rates spike?
                  </li>
                  <li>
                    <strong>Calculate break-even:</strong> Determine how many years of ARM savings would 
                    offset potential future rate increases. Compare total costs over your expected ownership period.
                  </li>
                  <li>
                    <strong>Plan your exit strategy:</strong> If you're choosing a 5/1 ARM, have a clear plan 
                    for what happens in year 5—sell, refinance, or prepare for adjustments.
                  </li>
                  <li>
                    <strong>Compare to fixed rates:</strong> If the ARM rate is only 0.25% lower than fixed, 
                    the savings may not justify the risk. ARMs typically make sense when the spread is 0.5%+.
                  </li>
                </ul>
              </div>

              <div className="calculator-card p-6">
                <h3 className="text-xl font-display font-semibold mb-4">ARM vs Fixed-Rate Mortgage Comparison</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 font-semibold">Feature</th>
                        <th className="text-left py-3 px-4 font-semibold">ARM</th>
                        <th className="text-left py-3 px-4 font-semibold">Fixed-Rate</th>
                      </tr>
                    </thead>
                    <tbody className="text-muted-foreground">
                      <tr className="border-b border-border">
                        <td className="py-3 px-4">Initial Rate</td>
                        <td className="py-3 px-4 text-accent-strong font-semibold">Lower (0.5-1% less)</td>
                        <td className="py-3 px-4">Higher</td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="py-3 px-4">Rate Stability</td>
                        <td className="py-3 px-4">Changes after fixed period</td>
                        <td className="py-3 px-4 text-accent-strong font-semibold">Never changes</td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="py-3 px-4">Payment Predictability</td>
                        <td className="py-3 px-4">Uncertain after initial period</td>
                        <td className="py-3 px-4 text-accent-strong font-semibold">Always the same</td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="py-3 px-4">Best For</td>
                        <td className="py-3 px-4">Short-term, falling rates</td>
                        <td className="py-3 px-4">Long-term, rising rates</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4">Risk Level</td>
                        <td className="py-3 px-4">Higher (rate can increase)</td>
                        <td className="py-3 px-4 text-accent-strong font-semibold">Lower (rate locked)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-display font-semibold mt-10 mb-4">Frequently Asked Questions About ARMs</h2>
              </div>
              <div className="space-y-3 not-prose">
                {faqs.map((f) => (
                  <details key={f.q} className="group calculator-card overflow-hidden" data-faq>
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4 hover:bg-secondary/40 [&::-webkit-details-marker]:hidden">
                      <h3 className="text-base font-semibold text-foreground font-sans">{f.q}</h3>
                      <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" aria-hidden="true" />
                    </summary>
                    <p className="px-4 pb-4 text-sm text-muted-foreground">{f.a}</p>
                  </details>
                ))}
              </div>

              <div className="calculator-card p-6 mt-10 not-prose">
                <h3 className="font-display font-semibold text-lg mb-4">Official Resources & Citations</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <a href="https://www.consumerfinance.gov/ask-cfpb/what-is-the-difference-between-a-fixed-rate-and-adjustable-rate-mortgage-arm-loan-en-100/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      Consumer Financial Protection Bureau (CFPB)
                    </a> — ARM consumer information and protections
                  </li>
                  <li>
                    <a href="https://www.federalreserve.gov/consumerinfo/mortgage_armbooklet.htm" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      Federal Reserve Consumer Handbook on ARMs
                    </a> — Detailed ARM guide
                  </li>
                  <li>
                    <a href="https://singlefamily.fanniemae.com/originating-underwriting/mortgage-products" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      Fannie Mae ARM Products
                    </a> — Conforming ARM guidelines
                  </li>
                </ul>
              </div>
            </section>
          </article>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default ARM;
