import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ARMCalculator from "@/components/ARMCalculator";

const ARM = () => {
  const canonicalUrl = "https://mortgagecalculation.net/adjustable-rate-mortgage-calculator/";

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://mortgagecalculation.net/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Loan Programs",
        item: "https://mortgagecalculation.net/fha-loan-calculator",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "ARM",
        item: canonicalUrl,
      },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is an Adjustable Rate Mortgage (ARM)?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "An Adjustable Rate Mortgage (ARM) is a home loan with an interest rate that can change periodically. Unlike fixed-rate mortgages, ARMs start with an initial fixed-rate period, after which the rate adjusts based on market conditions and a reference index. ARMs are named by their structure: a 5/1 ARM has a fixed rate for 5 years, then adjusts annually.",
        },
      },
      {
        "@type": "Question",
        name: "What index is used to adjust ARM rates?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Most ARMs today are tied to the Secured Overnight Financing Rate (SOFR), which replaced LIBOR in 2023. Your ARM rate equals the index value plus a margin (typically 2-3%). For example, if SOFR is 4% and your margin is 2.5%, your rate would adjust to 6.5%, subject to rate caps.",
        },
      },
      {
        "@type": "Question",
        name: "What are ARM rate caps and how do they protect borrowers?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "ARM rate caps limit how much your interest rate can change. There are three types: Initial cap (maximum first adjustment, often 2-5%), Periodic cap (maximum change per adjustment, typically 1-2%), and Lifetime cap (maximum total increase, usually 5-6% above start rate). These caps protect against extreme rate spikes.",
        },
      },
      {
        "@type": "Question",
        name: "Should I choose an ARM or fixed-rate mortgage in 2025?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Choose an ARM if: you plan to sell or refinance before the fixed period ends, rates are expected to decrease, you want lower initial payments, or you need to qualify for more house. Choose fixed-rate if: you plan to stay long-term, you value payment predictability, current rates are historically low, or you have a tight budget.",
        },
      },
    ],
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
      "Support for 1/1, 3/1, 5/1, 7/1, 10/1 ARMs",
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
        <title>ARM Calculator - Adjustable Rate Mortgage Calculator | MortgageCalculation.net</title>
        <meta
          name="description"
          content="Calculate adjustable rate mortgage payments with our free ARM calculator. Compare initial vs maximum payments, understand rate caps, and see payment projections for 3/1, 5/1, 7/1, and 10/1 ARMs."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="ARM Calculator - Adjustable Rate Mortgage Calculator" />
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
            <header className="mb-8 text-center">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground">
                Adjustable Rate Mortgage Calculator
              </h1>
              <p className="text-muted-foreground mt-2 text-base sm:text-lg max-w-3xl mx-auto">
                Calculate your ARM payments before and after rate adjustments. See initial payments, maximum possible payments, and understand how rate caps protect you.
              </p>
            </header>

            <ARMCalculator />

            {/* Educational Content */}
            <section className="mt-12 space-y-8">
              <div className="prose prose-slate max-w-none">
                <h2 className="text-2xl font-display font-semibold mb-4">The Complete Guide to Adjustable Rate Mortgages in 2025</h2>
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
                  and the second is how often the rate adjusts afterward. A <strong>5/1 ARM</strong> has a 
                  fixed rate for 5 years, then adjusts annually. A <strong>7/6 ARM</strong> is fixed for 
                  7 years, then adjusts every 6 months.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="calculator-card p-6">
                  <h3 className="text-xl font-display font-semibold mb-4">Common ARM Types</h3>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-accent font-bold">1/1 ARM:</span>
                      <span>Fixed for 1 year, adjusts annually. Highest risk but lowest initial rate.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent font-bold">3/1 ARM:</span>
                      <span>Fixed for 3 years. Good for short-term ownership or frequent movers.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent font-bold">5/1 ARM:</span>
                      <span>Fixed for 5 years. Most popular ARM, balancing savings with stability.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent font-bold">7/1 ARM:</span>
                      <span>Fixed for 7 years. More stability with moderate initial savings.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent font-bold">10/1 ARM:</span>
                      <span>Fixed for 10 years. Most stable ARM, closest to fixed-rate behavior.</span>
                    </li>
                  </ul>
                </div>

                <div className="calculator-card p-6">
                  <h3 className="text-xl font-display font-semibold mb-4">Understanding Rate Caps</h3>
                  <p className="text-muted-foreground mb-4">
                    Rate caps protect borrowers from extreme rate increases. Most ARMs have a "2/2/5" or "5/2/5" cap structure:
                  </p>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-accent font-bold">Initial Cap:</span>
                      <span>Maximum increase at first adjustment (often 2-5%).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent font-bold">Periodic Cap:</span>
                      <span>Maximum change per adjustment period (typically 1-2%).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent font-bold">Lifetime Cap:</span>
                      <span>Maximum total increase over the loan's life (usually 5-6%).</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="prose prose-slate max-w-none">
                <h2 className="text-2xl font-display font-semibold mt-10 mb-4">ARM Loan Pros and Cons</h2>
              </div>
              <div className="grid gap-6 md:grid-cols-2 not-prose">
                <div className="calculator-card p-4">
                  <h4 className="font-display font-semibold text-lg mb-3 text-accent">✓ Advantages of ARMs</h4>
                  <ul className="space-y-2 text-muted-foreground text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-accent">✓</span>
                      <span>Lower initial rate—typically 0.5-1% below fixed rates</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent">✓</span>
                      <span>Lower monthly payments during fixed period</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent">✓</span>
                      <span>May qualify for a larger loan amount</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent">✓</span>
                      <span>Rate caps protect against extreme increases</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent">✓</span>
                      <span>Potential savings if rates decrease</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent">✓</span>
                      <span>Great for planned short-term ownership</span>
                    </li>
                  </ul>
                </div>

                <div className="calculator-card p-4">
                  <h4 className="font-display font-semibold text-lg mb-3 text-primary">✗ Disadvantages of ARMs</h4>
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

              <div className="prose prose-slate max-w-none">
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
                        <td className="py-3 px-4 text-accent font-semibold">Lower (0.5-1% less)</td>
                        <td className="py-3 px-4">Higher</td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="py-3 px-4">Rate Stability</td>
                        <td className="py-3 px-4">Changes after fixed period</td>
                        <td className="py-3 px-4 text-accent font-semibold">Never changes</td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="py-3 px-4">Payment Predictability</td>
                        <td className="py-3 px-4">Uncertain after initial period</td>
                        <td className="py-3 px-4 text-accent font-semibold">Always the same</td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="py-3 px-4">Best For</td>
                        <td className="py-3 px-4">Short-term, falling rates</td>
                        <td className="py-3 px-4">Long-term, rising rates</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4">Risk Level</td>
                        <td className="py-3 px-4">Higher (rate can increase)</td>
                        <td className="py-3 px-4 text-accent font-semibold">Lower (rate locked)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="prose prose-slate max-w-none">
                <h2 className="text-2xl font-display font-semibold mt-10 mb-4">Frequently Asked Questions About ARMs</h2>
              </div>
              <div className="space-y-6 not-prose">
                <div className="calculator-card p-4">
                  <h4 className="font-semibold text-foreground mb-2">Can I refinance out of an ARM before it adjusts?</h4>
                  <p className="text-sm text-muted-foreground">
                    Yes, and many ARM borrowers do exactly this. If rates are favorable before your fixed period ends, 
                    you can <Link to="/refinance-calculator/" className="text-primary hover:underline">refinance into a fixed-rate mortgage</Link> to 
                    lock in a permanent rate. Just ensure you'll stay long enough to recoup closing costs.
                  </p>
                </div>
                <div className="calculator-card p-4">
                  <h4 className="font-semibold text-foreground mb-2">What happens if I can't afford my ARM payment after it adjusts?</h4>
                  <p className="text-sm text-muted-foreground">
                    Options include: refinancing to a fixed rate or new ARM, selling the home, or contacting your 
                    lender about modification programs. This is why it's crucial to calculate the worst-case scenario 
                    before choosing an ARM—make sure you can handle the maximum possible payment.
                  </p>
                </div>
                <div className="calculator-card p-4">
                  <h4 className="font-semibold text-foreground mb-2">Are ARM rates tied to the Federal Reserve rate?</h4>
                  <p className="text-sm text-muted-foreground">
                    Indirectly. Most ARMs are tied to the Secured Overnight Financing Rate (SOFR), which is influenced 
                    by the Fed's actions but doesn't move in lockstep. Your new rate = Index (SOFR) + Margin (set at 
                    loan origination, typically 2-3%).
                  </p>
                </div>
                <div className="calculator-card p-4">
                  <h4 className="font-semibold text-foreground mb-2">Can I get an ARM for an FHA or VA loan?</h4>
                  <p className="text-sm text-muted-foreground">
                    Yes, both <Link to="/fha-loan-calculator/" className="text-primary hover:underline">FHA</Link> and 
                    <Link to="/va-loan-calculator/" className="text-primary hover:underline"> VA</Link> offer ARM programs. 
                    FHA ARMs typically have 1/5/5 or 2/6 cap structures. VA ARMs (called "VA Hybrids") offer 
                    3/1, 5/1, 7/1, and 10/1 options with annual rate caps of 1%.
                  </p>
                </div>
              </div>

              <div className="calculator-card p-6 mt-10 not-prose">
                <h4 className="font-display font-semibold text-lg mb-4">Official Resources & Citations</h4>
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
                    <a href="https://singlefamily.fanniemae.com/originating-underwriting/mortgage-products/arm-products" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
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
