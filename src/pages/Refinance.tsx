import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RefinanceCalculator from "@/components/RefinanceCalculator";

const Refinance = () => {
  const canonicalUrl = "https://mortgagecalculation.net/refinance-calculator/";

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
        name: "Refinance Calculator",
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
        name: "When should I refinance my mortgage?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Refinancing typically makes sense when: you can lower your interest rate by at least 0.5-1%, you plan to stay in your home long enough to recover closing costs (usually 2-5 years), you want to switch from an adjustable-rate to a fixed-rate mortgage, or you want to shorten your loan term to build equity faster.",
        },
      },
      {
        "@type": "Question",
        name: "What is the break-even point for refinancing?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The break-even point is how long it takes for your monthly savings to exceed your closing costs. Calculate it by dividing your total closing costs by your monthly savings. For example, if refinancing costs $6,000 and saves you $200/month, your break-even point is 30 months (2.5 years).",
        },
      },
      {
        "@type": "Question",
        name: "What are typical refinance closing costs?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Refinance closing costs typically range from 2-5% of the loan amount. Common fees include origination fees, appraisal ($300-$600), title insurance, recording fees, and prepaid items like property taxes and insurance. Some lenders offer 'no-closing-cost' refinances with slightly higher interest rates.",
        },
      },
      {
        "@type": "Question",
        name: "Can I refinance with bad credit?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, but your options may be limited. Conventional refinances typically require a 620+ credit score. FHA Streamline refinances may be available with lower scores if you have an existing FHA loan. VA and USDA loans also offer streamlined refinance options for eligible borrowers.",
        },
      },
    ],
  };

  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Refinance Calculator",
    applicationCategory: "FinanceApplication",
    description:
      "Free calculator to determine if refinancing your mortgage makes financial sense by comparing interest savings against closing costs.",
    operatingSystem: "Any",
    url: canonicalUrl,
    featureList: [
      "Compare current vs new loan payments",
      "Calculate total interest savings",
      "Determine break-even point",
      "Account for closing costs",
      "Include tax benefit analysis",
      "Compare equity accumulation",
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
        <title>Refinance Calculator | Should I Refinance My Mortgage in 2025?</title>
        <meta
          name="description"
          content="Calculate if refinancing your mortgage makes sense. Compare interest savings, closing costs, and break-even timeline to make an informed refinancing decision."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="Refinance Calculator | Mortgage Refinancing Analysis" />
        <meta
          property="og:description"
          content="Should you refinance your mortgage? Calculate potential savings, compare monthly payments, and find your break-even point."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Refinance Calculator" />
        <meta
          name="twitter:description"
          content="Calculate if refinancing your mortgage will save you money."
        />
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(webAppSchema)}</script>
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main id="main-content" className="flex-1 container py-8">
          <article>
            <header className="text-center mb-10">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-foreground mb-4">
                Refinance Calculator
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Unsure if you should refinance? Compare interest savings and equity gains against closing costs 
                to make an informed decision.
              </p>
            </header>

            <RefinanceCalculator />

            {/* Comprehensive Guide Section */}
            <section className="mt-16 prose prose-slate max-w-none">
              <h2 className="text-2xl font-display font-semibold mb-4">Complete Guide to Mortgage Refinancing</h2>
              <p className="text-muted-foreground leading-relaxed">
                Refinancing replaces your existing mortgage with a new loan, typically to get a lower interest rate, 
                change your loan term, or switch from an adjustable to fixed rate. According to the{" "}
                <a href="https://www.consumerfinance.gov/consumer-tools/mortgages/answers/key-terms/#refinance" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  Consumer Financial Protection Bureau (CFPB)
                </a>, refinancing can save thousands over the life of your loan—but it's not always the right choice.
              </p>

              {/* Pros and Cons */}
              <h3 className="text-xl font-display font-semibold mt-8 mb-3">Refinancing: Pros and Cons</h3>
              <div className="grid md:grid-cols-2 gap-6 mt-4">
                <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">✓ Advantages</h4>
                  <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                    <li>Lower your interest rate and monthly payment</li>
                    <li>Save thousands in total interest over loan life</li>
                    <li>Switch from adjustable to fixed rate for stability</li>
                    <li>Shorten your loan term to build equity faster</li>
                    <li>Remove PMI if you've reached 20% equity</li>
                    <li>Consolidate debt with a <Link to="/cash-out-refinance-calculator/" className="underline">cash-out refinance</Link></li>
                  </ul>
                </div>
                <div className="bg-red-50 dark:bg-red-950/30 p-4 rounded-lg">
                  <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">✗ Disadvantages</h4>
                  <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                    <li>Closing costs of 2-5% of loan amount</li>
                    <li>Resets your amortization schedule</li>
                    <li>May extend total time paying mortgage</li>
                    <li>Requires good credit and equity for best rates</li>
                    <li>Appraisal and inspection fees required</li>
                    <li>Time and paperwork to complete the process</li>
                  </ul>
                </div>
              </div>

              {/* Types of Refinancing */}
              <h3 className="text-xl font-display font-semibold mt-8 mb-3">Types of Mortgage Refinancing</h3>
              <div className="space-y-4 text-muted-foreground">
                <div className="border-l-4 border-primary pl-4">
                  <h4 className="font-semibold text-foreground">Rate-and-Term Refinance</h4>
                  <p className="text-sm">
                    The most common type. You replace your existing loan with a new one that has a different 
                    interest rate and/or term. No cash is taken out—the new loan simply pays off the old one.
                  </p>
                </div>
                <div className="border-l-4 border-primary pl-4">
                  <h4 className="font-semibold text-foreground">Cash-Out Refinance</h4>
                  <p className="text-sm">
                    Borrow more than you owe and receive the difference in cash. Use our{" "}
                    <Link to="/cash-out-refinance-calculator/" className="text-primary hover:underline">cash-out calculator</Link>{" "}
                    to see how much you can access. Great for home improvements or debt consolidation.
                  </p>
                </div>
                <div className="border-l-4 border-primary pl-4">
                  <h4 className="font-semibold text-foreground">Streamline Refinance</h4>
                  <p className="text-sm">
                    Available for FHA, VA, and USDA loans. Requires less documentation and may not need an appraisal. 
                    Check our <Link to="/fha-loan-calculator/" className="text-primary hover:underline">FHA</Link> or{" "}
                    <Link to="/va-loan-calculator/" className="text-primary hover:underline">VA calculators</Link> for eligibility.
                  </p>
                </div>
                <div className="border-l-4 border-primary pl-4">
                  <h4 className="font-semibold text-foreground">Cash-In Refinance</h4>
                  <p className="text-sm">
                    You bring cash to closing to reduce your loan balance. This can help you reach 20% equity 
                    to eliminate PMI or qualify for a better interest rate.
                  </p>
                </div>
              </div>

              {/* Eligibility Requirements */}
              <h3 className="text-xl font-display font-semibold mt-8 mb-3">Refinance Eligibility Requirements</h3>
              <p className="text-muted-foreground leading-relaxed">
                Lenders evaluate several factors when you apply to refinance. Here's what you typically need:
              </p>
              <div className="overflow-x-auto mt-4">
                <table className="min-w-full text-sm border border-border rounded-lg overflow-hidden">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-4 py-2 text-left font-semibold">Requirement</th>
                      <th className="px-4 py-2 text-left font-semibold">Conventional</th>
                      <th className="px-4 py-2 text-left font-semibold">FHA Streamline</th>
                      <th className="px-4 py-2 text-left font-semibold">VA IRRRL</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    <tr className="border-t border-border">
                      <td className="px-4 py-2 font-medium">Credit Score</td>
                      <td className="px-4 py-2">620+</td>
                      <td className="px-4 py-2">580+ (varies)</td>
                      <td className="px-4 py-2">No minimum</td>
                    </tr>
                    <tr className="border-t border-border">
                      <td className="px-4 py-2 font-medium">Equity/LTV</td>
                      <td className="px-4 py-2">≤97% LTV</td>
                      <td className="px-4 py-2">No maximum</td>
                      <td className="px-4 py-2">No maximum</td>
                    </tr>
                    <tr className="border-t border-border">
                      <td className="px-4 py-2 font-medium">DTI Ratio</td>
                      <td className="px-4 py-2">≤43-50%</td>
                      <td className="px-4 py-2">Not verified</td>
                      <td className="px-4 py-2">Not verified</td>
                    </tr>
                    <tr className="border-t border-border">
                      <td className="px-4 py-2 font-medium">Appraisal</td>
                      <td className="px-4 py-2">Required</td>
                      <td className="px-4 py-2">Usually waived</td>
                      <td className="px-4 py-2">Usually waived</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Using Calculator Results */}
              <h3 className="text-xl font-display font-semibold mt-8 mb-3">How to Use Your Calculator Results</h3>
              <p className="text-muted-foreground leading-relaxed">
                This calculator compares your current loan against a potential new loan to show:
              </p>
              <ul className="text-muted-foreground space-y-2 mt-4">
                <li>
                  <strong>Monthly Savings:</strong> The difference between your current and new payment. Even $100/month 
                  savings equals $1,200/year.
                </li>
                <li>
                  <strong>Break-Even Point:</strong> How many months until your savings exceed closing costs. If you 
                  plan to move before this date, refinancing may not make sense.
                </li>
                <li>
                  <strong>Total Interest Savings:</strong> The difference in total interest paid over the life of 
                  both loans. This is often the most compelling number.
                </li>
                <li>
                  <strong>Net Benefit:</strong> After accounting for closing costs, tax implications, and time 
                  horizon, this shows your true savings.
                </li>
              </ul>

              {/* Decision Guidance */}
              <h3 className="text-xl font-display font-semibold mt-8 mb-3">Should You Refinance? Decision Guide</h3>
              <p className="text-muted-foreground leading-relaxed">
                Consider refinancing if your results show:
              </p>
              <ul className="text-muted-foreground space-y-2 mt-4">
                <li>
                  <strong>Rate reduction of 0.5%+:</strong> Even a half-point reduction can save significant money 
                  on a large loan balance.
                </li>
                <li>
                  <strong>Break-even under 3 years:</strong> If you'll stay in your home longer than the break-even 
                  period, refinancing makes financial sense.
                </li>
                <li>
                  <strong>Positive net benefit:</strong> After all costs, you come out ahead over your planned 
                  ownership period.
                </li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                <strong>Consider alternatives if:</strong> You're close to paying off your mortgage, plan to move 
                within 2-3 years, or can't qualify for a meaningfully lower rate.
              </p>

              {/* Who This Is Best For */}
              <h3 className="text-xl font-display font-semibold mt-8 mb-3">Who Benefits Most from Refinancing?</h3>
              <ul className="text-muted-foreground space-y-2">
                <li>
                  <strong>Rate drop beneficiaries:</strong> Homeowners who bought when rates were higher and can 
                  now qualify for significantly lower rates.
                </li>
                <li>
                  <strong>ARM holders:</strong> Those with adjustable-rate mortgages nearing adjustment who want 
                  the stability of a fixed rate.
                </li>
                <li>
                  <strong>Equity builders:</strong> Homeowners who want to switch from a 30-year to 15-year loan 
                  to pay off their home faster.
                </li>
                <li>
                  <strong>PMI eliminators:</strong> Those who now have 20%+ equity and can refinance to remove 
                  private mortgage insurance.
                </li>
              </ul>

              {/* Related Tools */}
              <h3 className="text-xl font-display font-semibold mt-8 mb-3">Related Calculators</h3>
              <ul className="text-muted-foreground space-y-2">
                <li>
                  <Link to="/cash-out-refinance-calculator/" className="text-primary hover:underline">Cash-Out Refinance Calculator</Link> — 
                  Calculate how much equity you can access
                </li>
                <li>
                  <Link to="/" className="text-primary hover:underline">Mortgage Calculator</Link> — 
                  Compare your current payment to potential new payments
                </li>
                <li>
                  <Link to="/extra-mortgage-payments-calculator/" className="text-primary hover:underline">Extra Payments Calculator</Link> — 
                  Alternative to refinancing: see how extra payments can save interest
                </li>
                <li>
                  <Link to="/heloc-calculator/" className="text-primary hover:underline">HELOC Calculator</Link> — 
                  Consider a home equity line instead of cash-out refinance
                </li>
              </ul>

              {/* Official Resources */}
              <div className="bg-muted/30 p-6 rounded-lg mt-8">
                <h4 className="font-display font-semibold text-lg mb-4">Official Resources & Citations</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <a href="https://www.consumerfinance.gov/consumer-tools/mortgages/answers/key-terms/#refinance" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      Consumer Financial Protection Bureau (CFPB)
                    </a> — What is a mortgage refinance?
                  </li>
                  <li>
                    <a href="https://www.hud.gov/topics/home_improvements" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      U.S. Department of Housing and Urban Development (HUD)
                    </a> — FHA refinancing programs
                  </li>
                  <li>
                    <a href="https://www.va.gov/housing-assistance/home-loans/loan-types/interest-rate-reduction-loan/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      U.S. Department of Veterans Affairs
                    </a> — VA Interest Rate Reduction Refinance Loan (IRRRL)
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

export default Refinance;
