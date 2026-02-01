import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HelocCalculator from "@/components/HelocCalculator";

const Heloc = () => {
  const canonicalUrl = "https://mortgagecalculation.net/heloc-calculator/";

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
        name: "HELOC Calculator",
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
        name: "What is a HELOC and how does it work?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A Home Equity Line of Credit (HELOC) is a revolving credit line secured by your home equity. Unlike a loan that gives you a lump sum, a HELOC works like a credit card—you can borrow what you need, when you need it, up to your credit limit. Most HELOCs have a draw period (5-10 years) where you can borrow, followed by a repayment period (10-20 years).",
        },
      },
      {
        "@type": "Question",
        name: "Is HELOC interest tax deductible?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "HELOC interest may be tax deductible if the funds are used to 'buy, build, or substantially improve' your home that secures the loan. According to IRS Publication 936, interest on HELOC funds used for other purposes (like paying off credit cards, buying a car, or paying for college) is generally not deductible.",
        },
      },
      {
        "@type": "Question",
        name: "What's the difference between a HELOC and home equity loan?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A home equity loan provides a lump sum with a fixed interest rate and fixed monthly payments. A HELOC offers a revolving credit line with a variable rate and flexible payments. HELOCs are better for ongoing expenses or when you're unsure how much you'll need. Home equity loans are better for one-time expenses when you want payment predictability.",
        },
      },
      {
        "@type": "Question",
        name: "What are the risks of using a HELOC for debt consolidation?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The main risks include: your home secures the debt, so you could face foreclosure if you can't pay; variable rates can increase your payments over time; you may end up paying more total interest over a longer repayment period; and without financial discipline, you might run up new credit card debt after consolidating.",
        },
      },
    ],
  };

  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "HELOC Calculator",
    applicationCategory: "FinanceApplication",
    description:
      "Free calculator to compare using a home equity line of credit (HELOC) for debt consolidation versus keeping existing debts.",
    operatingSystem: "Any",
    url: canonicalUrl,
    featureList: [
      "Compare HELOC vs existing debts",
      "Calculate monthly payment savings",
      "Total interest comparison",
      "Variable rate considerations",
      "Tax deduction analysis",
      "Debt consolidation payoff timeline",
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
        <title>HELOC Calculator | Home Equity Line of Credit for Debt Consolidation</title>
        <meta
          name="description"
          content="Should you use a HELOC to consolidate debt? Compare keeping existing debts vs home equity line of credit. Calculate monthly savings and total costs."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="HELOC Calculator | Home Equity Line of Credit" />
        <meta
          property="og:description"
          content="Calculate if a HELOC makes sense for debt consolidation. Compare interest rates, monthly payments, and total costs."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="HELOC Calculator" />
        <meta
          name="twitter:description"
          content="Compare HELOC debt consolidation vs keeping existing debts."
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
                HELOC Calculator
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Should you use a Home Equity Line of Credit to consolidate your debts? 
                Compare your options and find out which saves you more.
              </p>
            </header>

            <HelocCalculator />

            {/* Comprehensive Guide Section */}
            <section className="mt-16 prose prose-slate max-w-none">
              <h2 className="text-2xl font-display font-semibold mb-4">Complete Guide to Home Equity Lines of Credit</h2>
              <p className="text-muted-foreground leading-relaxed">
                A Home Equity Line of Credit (HELOC) lets you borrow against the equity in your home as needed, 
                rather than receiving a lump sum. According to the{" "}
                <a href="https://www.consumerfinance.gov/ask-cfpb/what-is-a-home-equity-line-of-credit-heloc-en-106/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  Consumer Financial Protection Bureau (CFPB)
                </a>, HELOCs can be a flexible way to access funds—but they come with risks homeowners should understand.
              </p>

              {/* How HELOCs Work */}
              <h3 className="text-xl font-display font-semibold mt-8 mb-3">How a HELOC Works</h3>
              <p className="text-muted-foreground leading-relaxed">
                A HELOC has two main phases:
              </p>
              <div className="grid md:grid-cols-2 gap-6 mt-4">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-semibold text-foreground mb-2">Draw Period (5-10 years)</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>Borrow up to your credit limit as needed</li>
                    <li>Make interest-only payments (often optional)</li>
                    <li>Credit line replenishes as you pay down</li>
                    <li>Works like a credit card secured by your home</li>
                  </ul>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-semibold text-foreground mb-2">Repayment Period (10-20 years)</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>Can no longer draw additional funds</li>
                    <li>Pay principal + interest on remaining balance</li>
                    <li>Payments may increase significantly</li>
                    <li>Some lenders allow conversion to fixed-rate</li>
                  </ul>
                </div>
              </div>

              {/* Pros and Cons */}
              <h3 className="text-xl font-display font-semibold mt-8 mb-3">HELOC: Pros and Cons</h3>
              <div className="grid md:grid-cols-2 gap-6 mt-4">
                <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">✓ Advantages</h4>
                  <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                    <li>Borrow only what you need, when you need it</li>
                    <li>Lower initial rates than credit cards</li>
                    <li>Interest-only payments during draw period</li>
                    <li>Low or no closing costs with many lenders</li>
                    <li>Potential tax deduction for home improvements</li>
                    <li>Keeps your primary mortgage unchanged</li>
                  </ul>
                </div>
                <div className="bg-red-50 dark:bg-red-950/30 p-4 rounded-lg">
                  <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">✗ Disadvantages</h4>
                  <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                    <li>Variable rates can increase significantly</li>
                    <li>Your home is collateral—foreclosure risk</li>
                    <li>Payment shock when draw period ends</li>
                    <li>May tempt overspending with easy access</li>
                    <li>Reduces equity and financial cushion</li>
                    <li>Can make selling or refinancing complicated</li>
                  </ul>
                </div>
              </div>

              {/* Eligibility Requirements */}
              <h3 className="text-xl font-display font-semibold mt-8 mb-3">HELOC Eligibility Requirements</h3>
              <p className="text-muted-foreground leading-relaxed">
                Lenders typically require:
              </p>
              <ul className="text-muted-foreground space-y-2 mt-4">
                <li>
                  <strong>Equity:</strong> At least 15-20% equity in your home. Most lenders allow borrowing 
                  up to 80-85% of your home's value minus your mortgage balance.
                </li>
                <li>
                  <strong>Credit Score:</strong> Generally 620 minimum, with 700+ for the best rates.
                </li>
                <li>
                  <strong>Debt-to-Income Ratio:</strong> Usually 43% or less, including the potential HELOC payment.
                </li>
                <li>
                  <strong>Income Verification:</strong> Stable income history (2+ years typically).
                </li>
                <li>
                  <strong>Home Appraisal:</strong> Current market value determines available credit.
                </li>
              </ul>

              {/* HELOC for Debt Consolidation */}
              <h3 className="text-xl font-display font-semibold mt-8 mb-3">Using a HELOC for Debt Consolidation</h3>
              <p className="text-muted-foreground leading-relaxed">
                A HELOC can be effective for consolidating high-interest debt when used wisely:
              </p>
              <div className="bg-muted/50 p-4 rounded-lg mt-4">
                <h4 className="font-semibold text-foreground mb-2">Example Scenario</h4>
                <p className="text-sm text-muted-foreground">
                  <strong>Current debts:</strong> $30,000 in credit cards at 20% APR = $500/month minimum<br />
                  <strong>HELOC:</strong> $30,000 at 9% APR = ~$380/month (10-year term)<br />
                  <strong>Monthly savings:</strong> $120<br />
                  <strong>Interest savings over 10 years:</strong> ~$25,000
                </p>
              </div>
              <p className="text-muted-foreground leading-relaxed mt-4">
                <strong>Critical warning:</strong> This strategy only works if you don't run up new credit card 
                debt. Many people consolidate, then accumulate new balances—ending up worse off than before.
              </p>

              {/* HELOC vs Alternatives */}
              <h3 className="text-xl font-display font-semibold mt-8 mb-3">HELOC vs. Other Options</h3>
              <div className="overflow-x-auto mt-4">
                <table className="min-w-full text-sm border border-border rounded-lg overflow-hidden">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-4 py-2 text-left font-semibold">Feature</th>
                      <th className="px-4 py-2 text-left font-semibold">HELOC</th>
                      <th className="px-4 py-2 text-left font-semibold">Home Equity Loan</th>
                      <th className="px-4 py-2 text-left font-semibold">Cash-Out Refi</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    <tr className="border-t border-border">
                      <td className="px-4 py-2 font-medium">Rate Type</td>
                      <td className="px-4 py-2">Variable</td>
                      <td className="px-4 py-2">Fixed</td>
                      <td className="px-4 py-2">Usually Fixed</td>
                    </tr>
                    <tr className="border-t border-border">
                      <td className="px-4 py-2 font-medium">Disbursement</td>
                      <td className="px-4 py-2">As needed</td>
                      <td className="px-4 py-2">Lump sum</td>
                      <td className="px-4 py-2">Lump sum</td>
                    </tr>
                    <tr className="border-t border-border">
                      <td className="px-4 py-2 font-medium">Closing Costs</td>
                      <td className="px-4 py-2">Low/none</td>
                      <td className="px-4 py-2">2-5%</td>
                      <td className="px-4 py-2">2-5%</td>
                    </tr>
                    <tr className="border-t border-border">
                      <td className="px-4 py-2 font-medium">Primary Mortgage</td>
                      <td className="px-4 py-2">Unchanged</td>
                      <td className="px-4 py-2">Unchanged</td>
                      <td className="px-4 py-2">Replaced</td>
                    </tr>
                    <tr className="border-t border-border">
                      <td className="px-4 py-2 font-medium">Best For</td>
                      <td className="px-4 py-2">Ongoing needs</td>
                      <td className="px-4 py-2">One-time expense</td>
                      <td className="px-4 py-2">Large sums + lower rate</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Using Calculator Results */}
              <h3 className="text-xl font-display font-semibold mt-8 mb-3">How to Use Your Calculator Results</h3>
              <p className="text-muted-foreground leading-relaxed">
                This calculator compares keeping your existing debts versus consolidating with a HELOC:
              </p>
              <ul className="text-muted-foreground space-y-2 mt-4">
                <li>
                  <strong>Monthly Payment Comparison:</strong> Lower monthly payments improve cash flow, but 
                  consider the total cost over time.
                </li>
                <li>
                  <strong>Total Interest Paid:</strong> Even with a lower rate, a longer term can mean 
                  paying more total interest.
                </li>
                <li>
                  <strong>Payoff Timeline:</strong> See when each debt would be paid off. Faster isn't 
                  always better if it strains your budget.
                </li>
                <li>
                  <strong>Risk Assessment:</strong> Remember that a HELOC puts your home at risk—credit 
                  cards and personal loans don't.
                </li>
              </ul>

              {/* Tax Considerations */}
              <h3 className="text-xl font-display font-semibold mt-8 mb-3">Tax Considerations</h3>
              <p className="text-muted-foreground leading-relaxed">
                According to <a href="https://www.irs.gov/publications/p936" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">IRS Publication 936</a>, 
                HELOC interest is only deductible if funds are used to "buy, build, or substantially improve" 
                the home securing the loan. Interest on funds used for debt consolidation, cars, vacations, 
                or other purposes is <strong>not</strong> tax deductible.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                If you're planning to deduct HELOC interest, keep detailed records of how funds were used. 
                Consult a tax professional for your specific situation.
              </p>

              {/* Who This Is Best For */}
              <h3 className="text-xl font-display font-semibold mt-8 mb-3">Who Benefits Most from a HELOC?</h3>
              <ul className="text-muted-foreground space-y-2">
                <li>
                  <strong>Home renovators:</strong> Those doing projects in phases who want to draw funds 
                  as needed rather than all at once.
                </li>
                <li>
                  <strong>Disciplined debt consolidators:</strong> Those who won't accumulate new debt 
                  after consolidating.
                </li>
                <li>
                  <strong>Emergency fund seekers:</strong> Homeowners who want access to funds without 
                  paying interest unless they use it.
                </li>
                <li>
                  <strong>Those with stable income:</strong> Who can handle potential payment increases 
                  when rates rise or draw period ends.
                </li>
              </ul>

              {/* Related Calculators */}
              <h3 className="text-xl font-display font-semibold mt-8 mb-3">Related Calculators</h3>
              <ul className="text-muted-foreground space-y-2">
                <li>
                  <Link to="/cash-out-refinance-calculator/" className="text-primary hover:underline">Cash-Out Refinance Calculator</Link> — 
                  Compare lump-sum cash access
                </li>
                <li>
                  <Link to="/second-mortgage-calculator/" className="text-primary hover:underline">Second Mortgage Calculator</Link> — 
                  Compare home equity loan options
                </li>
                <li>
                  <Link to="/refinance-calculator/" className="text-primary hover:underline">Refinance Calculator</Link> — 
                  See if refinancing your primary mortgage makes sense
                </li>
                <li>
                  <Link to="/" className="text-primary hover:underline">Mortgage Calculator</Link> — 
                  Calculate your primary mortgage payment
                </li>
              </ul>

              {/* Official Resources */}
              <div className="bg-muted/30 p-6 rounded-lg mt-8">
                <h4 className="font-display font-semibold text-lg mb-4">Official Resources & Citations</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <a href="https://www.consumerfinance.gov/ask-cfpb/what-is-a-home-equity-line-of-credit-heloc-en-106/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      Consumer Financial Protection Bureau (CFPB)
                    </a> — What is a HELOC?
                  </li>
                  <li>
                    <a href="https://www.irs.gov/publications/p936" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      IRS Publication 936
                    </a> — Home Mortgage Interest Deduction
                  </li>
                  <li>
                    <a href="https://www.federalreserve.gov/pubs/equity/equity_english.htm" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      Federal Reserve Board
                    </a> — What You Should Know About Home Equity Lines of Credit
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

export default Heloc;
