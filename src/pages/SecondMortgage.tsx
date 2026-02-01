import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SecondMortgageCalculator from "@/components/SecondMortgageCalculator";

const SecondMortgage = () => {
  const canonicalUrl = "https://mortgagecalculation.net/second-mortgage-calculator/";

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
        name: "Second Mortgage Calculator",
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
        name: "What is a piggyback loan or second mortgage?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A piggyback loan, also known as an 80/10/10 or 80/20 loan, involves taking out two mortgages simultaneously to avoid PMI. The first mortgage covers 80% of the home's value, a second mortgage covers 10-20%, and your down payment covers the remainder. This keeps the first mortgage at 80% LTV, eliminating the PMI requirement.",
        },
      },
      {
        "@type": "Question",
        name: "Is it better to pay PMI or get a second mortgage?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "It depends on several factors: your PMI rate vs second mortgage rate, how long you'll keep the loan, your down payment amount, and whether you plan to refinance. Generally, a second mortgage makes sense when: PMI rates are high in your area, you can get a competitive second mortgage rate, and you plan to stay long enough to recoup higher closing costs.",
        },
      },
      {
        "@type": "Question",
        name: "What are common piggyback loan structures?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The most common structures are: 80/10/10 (80% first mortgage, 10% second mortgage, 10% down payment), 80/15/5 (80% first, 15% second, 5% down), and 80/20/0 (80% first, 20% second, no down payment—rare). The first number always keeps the primary mortgage at 80% to avoid PMI.",
        },
      },
      {
        "@type": "Question",
        name: "What are the risks of a second mortgage?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Risks include: higher combined interest expense if rates are unfavorable, two separate payments to manage, second mortgage typically has higher rates than first, may have variable rate that can increase, and second mortgage is subordinate (paid second in foreclosure). Always compare total costs over your expected ownership period.",
        },
      },
    ],
  };

  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Second Mortgage Calculator",
    applicationCategory: "FinanceApplication",
    description:
      "Free calculator to compare PMI costs versus taking a second mortgage (piggyback loan) to avoid PMI.",
    operatingSystem: "Any",
    url: canonicalUrl,
    featureList: [
      "Compare PMI vs second mortgage costs",
      "80/10/10 and 80/20 loan analysis",
      "Calculate total interest over loan term",
      "Include closing costs comparison",
      "Monthly payment breakdown",
      "Break-even analysis",
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
        <title>Second Mortgage Calculator | PMI vs Piggyback Loan Comparison</title>
        <meta
          name="description"
          content="Compare the cost of PMI versus a second mortgage (piggyback loan). Calculate if an 80/10/10 or 80/20 loan structure saves you money vs paying PMI."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="Second Mortgage Calculator | PMI vs Piggyback Loan" />
        <meta
          property="og:description"
          content="Should you pay PMI or take a second mortgage? Use our calculator to compare costs and find the best option for your home purchase."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Second Mortgage Calculator" />
        <meta
          name="twitter:description"
          content="Compare PMI costs vs second mortgage to find the best financing option."
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
                Second Mortgage Calculator
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Compare obtaining a piggyback home equity loan versus paying PMI. 
                Find out which option saves you more money.
              </p>
            </header>

            <SecondMortgageCalculator />

            {/* Comprehensive Guide Section */}
            <section className="mt-16 prose prose-slate max-w-none">
              <h2 className="text-2xl font-display font-semibold mb-4">Complete Guide to Second Mortgages & Piggyback Loans</h2>
              <p className="text-muted-foreground leading-relaxed">
                When you can't make a 20% down payment, you face a choice: pay Private Mortgage Insurance (PMI) 
                or use a second mortgage to avoid it. According to the{" "}
                <a href="https://www.consumerfinance.gov/ask-cfpb/what-is-private-mortgage-insurance-en-122/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  Consumer Financial Protection Bureau (CFPB)
                </a>, PMI typically costs 0.5% to 1.5% of your loan amount annually. But is it cheaper than 
                a second mortgage? This calculator helps you decide.
              </p>

              {/* How Piggyback Loans Work */}
              <h3 className="text-xl font-display font-semibold mt-8 mb-3">How Piggyback Loans Work</h3>
              <p className="text-muted-foreground leading-relaxed">
                A piggyback loan uses two mortgages to finance your home purchase while keeping the primary 
                mortgage at 80% loan-to-value (LTV), which eliminates the need for PMI:
              </p>
              <div className="bg-muted/50 p-4 rounded-lg mt-4">
                <h4 className="font-semibold text-foreground mb-2">Common Piggyback Structures</h4>
                <p className="text-sm text-muted-foreground">
                  <strong>80/10/10:</strong> 80% first mortgage + 10% second mortgage + 10% down payment<br />
                  <strong>80/15/5:</strong> 80% first mortgage + 15% second mortgage + 5% down payment<br />
                  <strong>80/20:</strong> 80% first mortgage + 20% second mortgage + 0% down payment (rare)<br />
                  <br />
                  <strong>Example ($400,000 home with 80/10/10):</strong><br />
                  First mortgage: $320,000 (80%)<br />
                  Second mortgage: $40,000 (10%)<br />
                  Down payment: $40,000 (10%)
                </p>
              </div>

              {/* PMI vs Second Mortgage */}
              <h3 className="text-xl font-display font-semibold mt-8 mb-3">PMI vs. Second Mortgage: Comparison</h3>
              <div className="overflow-x-auto mt-4">
                <table className="min-w-full text-sm border border-border rounded-lg overflow-hidden">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-4 py-2 text-left font-semibold">Feature</th>
                      <th className="px-4 py-2 text-left font-semibold">PMI</th>
                      <th className="px-4 py-2 text-left font-semibold">Second Mortgage</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    <tr className="border-t border-border">
                      <td className="px-4 py-2 font-medium">Monthly cost</td>
                      <td className="px-4 py-2">0.5-1.5% of loan/year</td>
                      <td className="px-4 py-2">Based on loan amount & rate</td>
                    </tr>
                    <tr className="border-t border-border">
                      <td className="px-4 py-2 font-medium">Tax deductible</td>
                      <td className="px-4 py-2">Sometimes (income limits)</td>
                      <td className="px-4 py-2">Yes (mortgage interest)</td>
                    </tr>
                    <tr className="border-t border-border">
                      <td className="px-4 py-2 font-medium">Cancellation</td>
                      <td className="px-4 py-2">At 78-80% LTV</td>
                      <td className="px-4 py-2">When paid off or refinanced</td>
                    </tr>
                    <tr className="border-t border-border">
                      <td className="px-4 py-2 font-medium">Equity building</td>
                      <td className="px-4 py-2">No</td>
                      <td className="px-4 py-2">Yes (paying principal)</td>
                    </tr>
                    <tr className="border-t border-border">
                      <td className="px-4 py-2 font-medium">Closing costs</td>
                      <td className="px-4 py-2">None additional</td>
                      <td className="px-4 py-2">Additional loan costs</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Pros and Cons */}
              <h3 className="text-xl font-display font-semibold mt-8 mb-3">Second Mortgage: Pros and Cons</h3>
              <div className="grid md:grid-cols-2 gap-6 mt-4">
                <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">✓ Advantages</h4>
                  <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                    <li>Avoid PMI entirely</li>
                    <li>Interest is typically tax deductible</li>
                    <li>Building equity with each payment</li>
                    <li>May have lower total monthly cost</li>
                    <li>Can pay off second mortgage independently</li>
                    <li>First mortgage may have better rate at 80% LTV</li>
                  </ul>
                </div>
                <div className="bg-red-50 dark:bg-red-950/30 p-4 rounded-lg">
                  <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">✗ Disadvantages</h4>
                  <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                    <li>Higher combined interest rate than first mortgage</li>
                    <li>Two payments to manage each month</li>
                    <li>Additional closing costs</li>
                    <li>May have variable rate (HELOC type)</li>
                    <li>More complex to refinance later</li>
                    <li>Second mortgage is subordinate in foreclosure</li>
                  </ul>
                </div>
              </div>

              {/* When Each Makes Sense */}
              <h3 className="text-xl font-display font-semibold mt-8 mb-3">When Each Option Makes Sense</h3>
              <div className="space-y-4 text-muted-foreground">
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-semibold text-foreground">Second Mortgage May Be Better If:</h4>
                  <ul className="text-sm mt-1 space-y-1">
                    <li>• PMI rates are high (1%+ of loan annually)</li>
                    <li>• You can get a competitive second mortgage rate</li>
                    <li>• You plan to stay 7+ years (recoup closing costs)</li>
                    <li>• You itemize taxes (deduct interest)</li>
                    <li>• You want to build equity faster</li>
                  </ul>
                </div>
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold text-foreground">PMI May Be Better If:</h4>
                  <ul className="text-sm mt-1 space-y-1">
                    <li>• PMI rates are low (0.5% or less)</li>
                    <li>• Second mortgage rates are high</li>
                    <li>• You'll reach 80% LTV quickly (fast appreciation or high payments)</li>
                    <li>• You plan to move within 5 years</li>
                    <li>• You prefer simpler payment structure</li>
                  </ul>
                </div>
              </div>

              {/* Using Calculator Results */}
              <h3 className="text-xl font-display font-semibold mt-8 mb-3">How to Use Your Calculator Results</h3>
              <p className="text-muted-foreground leading-relaxed">
                This calculator compares the total cost of each option over your expected ownership period:
              </p>
              <ul className="text-muted-foreground space-y-2 mt-4">
                <li>
                  <strong>Monthly Payment Comparison:</strong> See the combined payment for each scenario. 
                  Note that PMI payments eventually stop, while second mortgage payments continue until paid off.
                </li>
                <li>
                  <strong>Total Cost Over Time:</strong> The most important metric—which option costs less 
                  over your expected time in the home?
                </li>
                <li>
                  <strong>PMI Cancellation Point:</strong> See when you'd reach 80% LTV and eliminate PMI. 
                  After this point, the PMI option becomes more attractive.
                </li>
                <li>
                  <strong>Break-Even Analysis:</strong> How long until the lower-cost option saves enough 
                  to offset any additional upfront costs?
                </li>
              </ul>

              {/* Eligibility Requirements */}
              <h3 className="text-xl font-display font-semibold mt-8 mb-3">Eligibility for Piggyback Loans</h3>
              <p className="text-muted-foreground leading-relaxed">
                Not all borrowers qualify for piggyback loans. Typical requirements include:
              </p>
              <ul className="text-muted-foreground space-y-2 mt-4">
                <li>
                  <strong>Credit score:</strong> Generally 680+ for second mortgage (higher than first mortgage requirements)
                </li>
                <li>
                  <strong>DTI ratio:</strong> Combined DTI typically under 43% including both loans
                </li>
                <li>
                  <strong>Property type:</strong> Primary residences are easier; investment properties may not qualify
                </li>
                <li>
                  <strong>Lender availability:</strong> Not all lenders offer piggyback loans; you may need different 
                  lenders for first and second mortgages
                </li>
              </ul>

              {/* Who This Is Best For */}
              <h3 className="text-xl font-display font-semibold mt-8 mb-3">Who Benefits Most from Second Mortgages?</h3>
              <ul className="text-muted-foreground space-y-2">
                <li>
                  <strong>High PMI cost markets:</strong> Where PMI rates exceed 1% annually
                </li>
                <li>
                  <strong>Tax-conscious buyers:</strong> Who itemize and can deduct mortgage interest
                </li>
                <li>
                  <strong>Long-term homeowners:</strong> Planning to stay 7+ years to recoup added costs
                </li>
                <li>
                  <strong>Strong credit borrowers:</strong> Who can qualify for competitive second mortgage rates
                </li>
              </ul>

              {/* Related Calculators */}
              <h3 className="text-xl font-display font-semibold mt-8 mb-3">Related Calculators</h3>
              <ul className="text-muted-foreground space-y-2">
                <li>
                  <Link to="/" className="text-primary hover:underline">Mortgage Calculator</Link> — 
                  Calculate your primary mortgage payment with PMI
                </li>
                <li>
                  <Link to="/heloc-calculator/" className="text-primary hover:underline">HELOC Calculator</Link> — 
                  Compare home equity line of credit options
                </li>
                <li>
                  <Link to="/cash-out-refinance-calculator/" className="text-primary hover:underline">Cash-Out Refinance Calculator</Link> — 
                  Alternative for accessing home equity
                </li>
                <li>
                  <Link to="/conventional-mortgage-calculator/" className="text-primary hover:underline">Conventional Loan Calculator</Link> — 
                  See conventional loan options with different down payments
                </li>
              </ul>

              {/* Official Resources */}
              <div className="bg-muted/30 p-6 rounded-lg mt-8">
                <h4 className="font-display font-semibold text-lg mb-4">Official Resources & Citations</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <a href="https://www.consumerfinance.gov/ask-cfpb/what-is-private-mortgage-insurance-en-122/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      Consumer Financial Protection Bureau (CFPB)
                    </a> — What is Private Mortgage Insurance?
                  </li>
                  <li>
                    <a href="https://www.consumerfinance.gov/ask-cfpb/when-can-i-remove-private-mortgage-insurance-pmi-from-my-loan-en-202/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      CFPB
                    </a> — When can I remove PMI?
                  </li>
                  <li>
                    <a href="https://singlefamily.fanniemae.com/originating-underwriting/mortgage-products/borrower-paid-mortgage-insurance" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      Fannie Mae
                    </a> — Mortgage insurance requirements
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

export default SecondMortgage;
