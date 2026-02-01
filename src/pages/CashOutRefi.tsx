import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CashOutRefiCalculator from "@/components/CashOutRefiCalculator";

const CashOutRefi = () => {
  const canonicalUrl = "https://mortgagecalculation.net/cash-out-refinance-calculator/";

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
        name: "Cash-Out Refinance Calculator",
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
        name: "What is a cash-out refinance?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A cash-out refinance replaces your existing mortgage with a new, larger loan. The difference between your old loan balance and the new loan amount is paid to you in cash at closing. This allows homeowners to tap into their home equity for major expenses like home improvements, debt consolidation, or education costs.",
        },
      },
      {
        "@type": "Question",
        name: "How much cash can I get from a cash-out refinance?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Lenders typically allow you to borrow up to 80% of your home's current value (80% LTV). For example, if your home is worth $400,000 and you owe $200,000, you could potentially access up to $120,000 in cash ($400,000 × 80% = $320,000, minus $200,000 owed = $120,000). VA loans may allow up to 100% LTV.",
        },
      },
      {
        "@type": "Question",
        name: "What's the difference between a cash-out refinance and a HELOC?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A cash-out refinance replaces your entire mortgage with a new loan and provides a lump sum of cash. A HELOC (Home Equity Line of Credit) is a second loan that doesn't affect your first mortgage and provides a revolving credit line. HELOCs typically have variable rates, while cash-out refinances usually offer fixed rates.",
        },
      },
      {
        "@type": "Question",
        name: "Is cash-out refinance interest tax deductible?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Interest on a cash-out refinance may be tax deductible if the funds are used for home improvements that substantially improve your home. According to IRS rules, interest on funds used for other purposes (like paying off credit cards or buying a car) is generally not deductible. Consult a tax professional for your specific situation.",
        },
      },
    ],
  };

  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Cash-Out Refinance Calculator",
    applicationCategory: "FinanceApplication",
    description: "Calculate how much cash you can extract from your home equity with a cash-out refinance.",
    operatingSystem: "Any",
    url: canonicalUrl,
    featureList: [
      "Calculate maximum cash-out amount",
      "Determine new loan balance",
      "Estimate new monthly payment",
      "80% LTV limit calculations",
      "Compare with current mortgage",
      "Include closing cost estimates",
    ],
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };

  return (
    <>
      <Helmet>
        <title>Cash-Out Refinance Calculator | How Much Equity Can I Access?</title>
        <meta
          name="description"
          content="Calculate how much cash you can get from your home equity with a cash-out refinance. See your new loan balance, monthly payment, and maximum cash available."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="Cash-Out Refinance Calculator" />
        <meta property="og:description" content="Calculate how much cash you can extract from your home equity with a cash-out refinance." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Cash-Out Refinance Calculator" />
        <meta name="twitter:description" content="Estimate your new loan balance and maximum cash-out amount." />
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
                Cash-Out Refinance Calculator
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                See how much equity you can access from your home and calculate your new monthly payment.
              </p>
            </header>

            <CashOutRefiCalculator />

            {/* Comprehensive Guide Section */}
            <section className="mt-16 prose prose-slate max-w-none">
              <h2 className="text-2xl font-display font-semibold mb-4">Complete Guide to Cash-Out Refinancing</h2>
              <p className="text-muted-foreground leading-relaxed">
                A cash-out refinance allows you to convert home equity into cash by replacing your current mortgage 
                with a larger loan. According to the{" "}
                <a href="https://www.consumerfinance.gov/ask-cfpb/what-is-a-cash-out-refinance-en-1971/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  Consumer Financial Protection Bureau (CFPB)
                </a>, this is one of several ways homeowners can access their home equity—but it's important to 
                understand both the benefits and risks.
              </p>

              {/* How It Works */}
              <h3 className="text-xl font-display font-semibold mt-8 mb-3">How Cash-Out Refinancing Works</h3>
              <p className="text-muted-foreground leading-relaxed">
                Here's a step-by-step breakdown of the cash-out refinance process:
              </p>
              <ol className="text-muted-foreground space-y-2 mt-4 list-decimal pl-5">
                <li>Your home is appraised to determine current market value</li>
                <li>Lender calculates maximum loan (typically 80% of home value)</li>
                <li>Your existing mortgage balance is subtracted from the new loan amount</li>
                <li>The difference (minus closing costs) is paid to you in cash</li>
                <li>You begin making payments on the new, larger mortgage</li>
              </ol>
              <div className="bg-muted/50 p-4 rounded-lg mt-4">
                <h4 className="font-semibold text-foreground mb-2">Example Calculation</h4>
                <p className="text-sm text-muted-foreground">
                  Home value: $400,000 × 80% = $320,000 maximum loan<br />
                  Current mortgage balance: $200,000<br />
                  Maximum cash-out: $320,000 - $200,000 = $120,000<br />
                  After closing costs (~$8,000): ~$112,000 cash in hand
                </p>
              </div>

              {/* Pros and Cons */}
              <h3 className="text-xl font-display font-semibold mt-8 mb-3">Cash-Out Refinance: Pros and Cons</h3>
              <div className="grid md:grid-cols-2 gap-6 mt-4">
                <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">✓ Advantages</h4>
                  <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                    <li>Access large sums at lower rates than personal loans</li>
                    <li>May get a lower rate than your current mortgage</li>
                    <li>Single monthly payment (vs. mortgage + HELOC)</li>
                    <li>Interest may be tax-deductible for home improvements</li>
                    <li>Fixed rate provides payment stability</li>
                    <li>Can consolidate high-interest debt</li>
                  </ul>
                </div>
                <div className="bg-red-50 dark:bg-red-950/30 p-4 rounded-lg">
                  <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">✗ Disadvantages</h4>
                  <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                    <li>Closing costs of 2-5% of loan amount</li>
                    <li>Increases your total debt and monthly payment</li>
                    <li>Reduces your home equity</li>
                    <li>Resets your amortization schedule</li>
                    <li>Your home secures the loan—risk of foreclosure</li>
                    <li>May have higher rate than rate-and-term refinance</li>
                  </ul>
                </div>
              </div>

              {/* Eligibility Requirements */}
              <h3 className="text-xl font-display font-semibold mt-8 mb-3">Eligibility Requirements</h3>
              <p className="text-muted-foreground leading-relaxed">
                Lenders have specific requirements for cash-out refinances:
              </p>
              <div className="overflow-x-auto mt-4">
                <table className="min-w-full text-sm border border-border rounded-lg overflow-hidden">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-4 py-2 text-left font-semibold">Requirement</th>
                      <th className="px-4 py-2 text-left font-semibold">Conventional</th>
                      <th className="px-4 py-2 text-left font-semibold">FHA</th>
                      <th className="px-4 py-2 text-left font-semibold">VA</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    <tr className="border-t border-border">
                      <td className="px-4 py-2 font-medium">Maximum LTV</td>
                      <td className="px-4 py-2">80%</td>
                      <td className="px-4 py-2">80%</td>
                      <td className="px-4 py-2">100%</td>
                    </tr>
                    <tr className="border-t border-border">
                      <td className="px-4 py-2 font-medium">Credit Score</td>
                      <td className="px-4 py-2">620+</td>
                      <td className="px-4 py-2">580+</td>
                      <td className="px-4 py-2">620+ (varies)</td>
                    </tr>
                    <tr className="border-t border-border">
                      <td className="px-4 py-2 font-medium">DTI Ratio</td>
                      <td className="px-4 py-2">≤43-50%</td>
                      <td className="px-4 py-2">≤43-50%</td>
                      <td className="px-4 py-2">≤41% (flexible)</td>
                    </tr>
                    <tr className="border-t border-border">
                      <td className="px-4 py-2 font-medium">Ownership</td>
                      <td className="px-4 py-2">6+ months</td>
                      <td className="px-4 py-2">12+ months</td>
                      <td className="px-4 py-2">210+ days</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Best Uses */}
              <h3 className="text-xl font-display font-semibold mt-8 mb-3">Best Uses for Cash-Out Refinance Funds</h3>
              <p className="text-muted-foreground leading-relaxed">
                Financial experts generally recommend using cash-out funds for purposes that build value or save money:
              </p>
              <ul className="text-muted-foreground space-y-2 mt-4">
                <li>
                  <strong>Home improvements:</strong> Renovations that increase your home's value can offset 
                  the reduced equity. Plus, interest may be tax-deductible.
                </li>
                <li>
                  <strong>Debt consolidation:</strong> Paying off high-interest credit cards (15-25% APR) with 
                  a lower-rate mortgage (6-8%) can save thousands.
                </li>
                <li>
                  <strong>Education expenses:</strong> May offer lower rates than private student loans.
                </li>
                <li>
                  <strong>Emergency reserves:</strong> Building a financial safety net when rates are favorable.
                </li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                <strong>Generally avoid:</strong> Using funds for vacations, cars, or other depreciating assets. 
                You'll be paying for these long after their value is gone.
              </p>

              {/* Using Calculator Results */}
              <h3 className="text-xl font-display font-semibold mt-8 mb-3">How to Use Your Calculator Results</h3>
              <p className="text-muted-foreground leading-relaxed">
                This calculator helps you understand the trade-offs of a cash-out refinance:
              </p>
              <ul className="text-muted-foreground space-y-2 mt-4">
                <li>
                  <strong>Maximum Cash Available:</strong> Based on 80% LTV (or your specified limit). This is 
                  your ceiling—you can take less if needed.
                </li>
                <li>
                  <strong>New Monthly Payment:</strong> Compare to your current payment. Is the increase 
                  affordable for your budget?
                </li>
                <li>
                  <strong>Total Interest Cost:</strong> See how much more interest you'll pay over the life 
                  of the new loan compared to your current mortgage.
                </li>
                <li>
                  <strong>Remaining Equity:</strong> After the cash-out, how much equity remains? Less equity 
                  means less financial cushion.
                </li>
              </ul>

              {/* Cash-Out vs Alternatives */}
              <h3 className="text-xl font-display font-semibold mt-8 mb-3">Cash-Out Refinance vs. Alternatives</h3>
              <div className="overflow-x-auto mt-4">
                <table className="min-w-full text-sm border border-border rounded-lg overflow-hidden">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-4 py-2 text-left font-semibold">Feature</th>
                      <th className="px-4 py-2 text-left font-semibold">Cash-Out Refi</th>
                      <th className="px-4 py-2 text-left font-semibold">HELOC</th>
                      <th className="px-4 py-2 text-left font-semibold">Home Equity Loan</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    <tr className="border-t border-border">
                      <td className="px-4 py-2 font-medium">Rate Type</td>
                      <td className="px-4 py-2">Usually fixed</td>
                      <td className="px-4 py-2">Variable</td>
                      <td className="px-4 py-2">Fixed</td>
                    </tr>
                    <tr className="border-t border-border">
                      <td className="px-4 py-2 font-medium">Closing Costs</td>
                      <td className="px-4 py-2">2-5% of loan</td>
                      <td className="px-4 py-2">Low or none</td>
                      <td className="px-4 py-2">2-5%</td>
                    </tr>
                    <tr className="border-t border-border">
                      <td className="px-4 py-2 font-medium">Disbursement</td>
                      <td className="px-4 py-2">Lump sum</td>
                      <td className="px-4 py-2">As needed</td>
                      <td className="px-4 py-2">Lump sum</td>
                    </tr>
                    <tr className="border-t border-border">
                      <td className="px-4 py-2 font-medium">Payments</td>
                      <td className="px-4 py-2">One mortgage</td>
                      <td className="px-4 py-2">Mortgage + HELOC</td>
                      <td className="px-4 py-2">Mortgage + loan</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-muted-foreground text-sm mt-4">
                Compare options with our <Link to="/heloc-calculator/" className="text-primary hover:underline">HELOC calculator</Link>.
              </p>

              {/* Who This Is Best For */}
              <h3 className="text-xl font-display font-semibold mt-8 mb-3">Who Benefits Most from Cash-Out Refinancing?</h3>
              <ul className="text-muted-foreground space-y-2">
                <li>
                  <strong>Homeowners with significant equity:</strong> Those with 30%+ equity can access 
                  substantial funds while keeping 20% equity cushion.
                </li>
                <li>
                  <strong>Those needing large sums:</strong> For major renovations or debt consolidation 
                  where you need $50,000+ at once.
                </li>
                <li>
                  <strong>Rate reducers:</strong> If current rates are lower than your existing mortgage, 
                  you can get cash AND reduce your rate.
                </li>
                <li>
                  <strong>High-interest debt holders:</strong> Those paying 18%+ on credit cards can 
                  significantly reduce interest costs.
                </li>
              </ul>

              {/* Related Calculators */}
              <h3 className="text-xl font-display font-semibold mt-8 mb-3">Related Calculators</h3>
              <ul className="text-muted-foreground space-y-2">
                <li>
                  <Link to="/refinance-calculator/" className="text-primary hover:underline">Refinance Calculator</Link> — 
                  Compare rate-and-term refinancing without cash out
                </li>
                <li>
                  <Link to="/heloc-calculator/" className="text-primary hover:underline">HELOC Calculator</Link> — 
                  Compare home equity line of credit as an alternative
                </li>
                <li>
                  <Link to="/house-affordability/" className="text-primary hover:underline">Affordability Calculator</Link> — 
                  Ensure your new payment fits your budget
                </li>
                <li>
                  <Link to="/second-mortgage-calculator/" className="text-primary hover:underline">Second Mortgage Calculator</Link> — 
                  Compare second mortgage options
                </li>
              </ul>

              {/* Official Resources */}
              <div className="bg-muted/30 p-6 rounded-lg mt-8">
                <h4 className="font-display font-semibold text-lg mb-4">Official Resources & Citations</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <a href="https://www.consumerfinance.gov/ask-cfpb/what-is-a-cash-out-refinance-en-1971/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      Consumer Financial Protection Bureau (CFPB)
                    </a> — What is a cash-out refinance?
                  </li>
                  <li>
                    <a href="https://www.va.gov/housing-assistance/home-loans/loan-types/cash-out-loan/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      U.S. Department of Veterans Affairs
                    </a> — VA Cash-Out Refinance Loan
                  </li>
                  <li>
                    <a href="https://singlefamily.fanniemae.com/originating-underwriting/mortgage-products/cash-out-refinance-loans" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      Fannie Mae
                    </a> — Cash-out refinance guidelines
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

export default CashOutRefi;
