import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import QualificationCalculator from "@/components/QualificationCalculator";

const Qualification = () => {
  const canonicalUrl = "https://mortgagecalculation.net/mortgage-qualification-calculator/";

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
        name: "Qualification Calculator",
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
        name: "What income do I need to qualify for a mortgage?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The income needed depends on the home price, your down payment, interest rate, and existing debts. As a rough guide, you typically need an income of about 2.5-4 times the home price for a 30-year mortgage. For example, a $300,000 home might require $75,000-$120,000 annual income, depending on your other debts and down payment.",
        },
      },
      {
        "@type": "Question",
        name: "How do lenders calculate mortgage qualification?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Lenders use debt-to-income (DTI) ratios. The front-end ratio compares your housing costs to gross income (typically max 28-31%). The back-end ratio compares all monthly debts to gross income (typically max 36-43%). Lenders also consider credit score, down payment, employment history, and asset reserves.",
        },
      },
      {
        "@type": "Question",
        name: "What factors affect how much mortgage I can qualify for?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Key factors include: credit score (affects rate and loan programs), down payment amount (larger = more options), existing monthly debts (reduces borrowing power), interest rates (lower rates = higher qualification), loan type (FHA/VA may be more flexible), and employment stability (lenders prefer 2+ years same field).",
        },
      },
      {
        "@type": "Question",
        name: "How can I qualify for a larger mortgage?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "To qualify for more: pay down existing debts to lower your DTI, improve your credit score for better rates, save for a larger down payment, consider a co-borrower with income, look for lower interest rates, or choose a different loan program (FHA allows higher DTI). Also consider if maximizing qualification is actually wise for your budget.",
        },
      },
    ],
  };

  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Mortgage Qualification Calculator",
    applicationCategory: "FinanceApplication",
    description: "Calculate the minimum income required to qualify for a mortgage based on home price and debts.",
    operatingSystem: "Any",
    url: canonicalUrl,
    featureList: [
      "Calculate minimum income requirements",
      "Apply front-end and back-end DTI ratios",
      "Factor in existing monthly debts",
      "Include property taxes and insurance",
      "Compare conventional vs FHA qualification",
      "Estimate required salary for target home price",
    ],
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };

  return (
    <>
      <Helmet>
        <title>Mortgage Qualification Calculator | What Income Do I Need to Buy a House?</title>
        <meta
          name="description"
          content="Calculate the minimum income required to qualify for a mortgage. See what salary you need to buy a house based on price, down payment, and DTI ratios."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="Mortgage Qualification Calculator" />
        <meta property="og:description" content="Calculate the minimum income required to qualify for a mortgage." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Mortgage Qualification Calculator" />
        <meta name="twitter:description" content="Estimate your required annual salary to qualify for a mortgage." />
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
                Mortgage Qualification Calculator
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Calculate the minimum income needed to qualify for your desired home purchase.
              </p>
            </header>

            <QualificationCalculator />

            {/* Comprehensive Guide Section */}
            <section className="mt-16 prose prose-slate max-w-none">
              <h2 className="text-2xl font-display font-semibold mb-4">Complete Guide to Mortgage Qualification</h2>
              <p className="text-muted-foreground leading-relaxed">
                Understanding mortgage qualification requirements helps you set realistic homebuying goals. 
                According to the{" "}
                <a href="https://www.consumerfinance.gov/owning-a-home/loan-estimate/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  Consumer Financial Protection Bureau (CFPB)
                </a>, lenders evaluate multiple factors when determining how much you can borrow—and this 
                calculator helps you understand the income side of that equation.
              </p>

              {/* How Qualification Works */}
              <h3 className="text-xl font-display font-semibold mt-8 mb-3">How Mortgage Qualification Works</h3>
              <p className="text-muted-foreground leading-relaxed">
                Lenders work backward from your potential monthly payment to determine if your income can 
                support it. Here's the process:
              </p>
              <ol className="text-muted-foreground space-y-2 mt-4 list-decimal pl-5">
                <li>Calculate total monthly housing payment (PITI: principal, interest, taxes, insurance)</li>
                <li>Add your existing monthly debts (car payments, student loans, credit cards)</li>
                <li>Divide housing payment by gross monthly income (front-end ratio)</li>
                <li>Divide total debts by gross monthly income (back-end ratio)</li>
                <li>Compare ratios to lender limits (typically 28/36 or 31/43)</li>
              </ol>

              {/* DTI Requirements by Loan Type */}
              <h3 className="text-xl font-display font-semibold mt-8 mb-3">DTI Requirements by Loan Type</h3>
              <div className="overflow-x-auto mt-4">
                <table className="min-w-full text-sm border border-border rounded-lg overflow-hidden">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-4 py-2 text-left font-semibold">Loan Type</th>
                      <th className="px-4 py-2 text-left font-semibold">Front-End Max</th>
                      <th className="px-4 py-2 text-left font-semibold">Back-End Max</th>
                      <th className="px-4 py-2 text-left font-semibold">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    <tr className="border-t border-border">
                      <td className="px-4 py-2 font-medium">Conventional</td>
                      <td className="px-4 py-2">28%</td>
                      <td className="px-4 py-2">36-45%</td>
                      <td className="px-4 py-2">Higher allowed with compensating factors</td>
                    </tr>
                    <tr className="border-t border-border">
                      <td className="px-4 py-2 font-medium">FHA</td>
                      <td className="px-4 py-2">31%</td>
                      <td className="px-4 py-2">43%</td>
                      <td className="px-4 py-2">May allow up to 50% with reserves</td>
                    </tr>
                    <tr className="border-t border-border">
                      <td className="px-4 py-2 font-medium">VA</td>
                      <td className="px-4 py-2">No limit</td>
                      <td className="px-4 py-2">41%</td>
                      <td className="px-4 py-2">Residual income also evaluated</td>
                    </tr>
                    <tr className="border-t border-border">
                      <td className="px-4 py-2 font-medium">USDA</td>
                      <td className="px-4 py-2">29%</td>
                      <td className="px-4 py-2">41%</td>
                      <td className="px-4 py-2">Income limits also apply</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Income Reference Table */}
              <h3 className="text-xl font-display font-semibold mt-8 mb-3">Income Requirements by Home Price</h3>
              <p className="text-muted-foreground leading-relaxed">
                Here's a general guide for required income based on the 28% front-end ratio, assuming 
                a 20% down payment, 7% interest rate, and typical taxes/insurance:
              </p>
              <div className="overflow-x-auto mt-4">
                <table className="min-w-full text-sm border border-border rounded-lg overflow-hidden">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-4 py-2 text-left font-semibold">Home Price</th>
                      <th className="px-4 py-2 text-left font-semibold">Monthly Payment*</th>
                      <th className="px-4 py-2 text-left font-semibold">Required Income (28%)</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    <tr className="border-t border-border">
                      <td className="px-4 py-2">$200,000</td>
                      <td className="px-4 py-2">~$1,450</td>
                      <td className="px-4 py-2">~$62,000</td>
                    </tr>
                    <tr className="border-t border-border">
                      <td className="px-4 py-2">$300,000</td>
                      <td className="px-4 py-2">~$2,175</td>
                      <td className="px-4 py-2">~$93,000</td>
                    </tr>
                    <tr className="border-t border-border">
                      <td className="px-4 py-2">$400,000</td>
                      <td className="px-4 py-2">~$2,900</td>
                      <td className="px-4 py-2">~$124,000</td>
                    </tr>
                    <tr className="border-t border-border">
                      <td className="px-4 py-2">$500,000</td>
                      <td className="px-4 py-2">~$3,625</td>
                      <td className="px-4 py-2">~$155,000</td>
                    </tr>
                    <tr className="border-t border-border">
                      <td className="px-4 py-2">$750,000</td>
                      <td className="px-4 py-2">~$5,440</td>
                      <td className="px-4 py-2">~$233,000</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                *Includes principal, interest, taxes, and insurance. Use the calculator for precise figures.
              </p>

              {/* Factors Affecting Qualification */}
              <h3 className="text-xl font-display font-semibold mt-8 mb-3">Factors That Affect Your Qualification</h3>
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-semibold text-foreground mb-2">Increase Qualification</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>✓ Higher credit score → better rates</li>
                    <li>✓ Larger down payment → smaller loan</li>
                    <li>✓ Lower existing debts → better DTI</li>
                    <li>✓ Shopping for lower interest rates</li>
                    <li>✓ Adding a co-borrower with income</li>
                    <li>✓ FHA loan (higher DTI allowed)</li>
                  </ul>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-semibold text-foreground mb-2">Decrease Qualification</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>✗ High existing debt payments</li>
                    <li>✗ Lower credit score</li>
                    <li>✗ Smaller down payment (need PMI)</li>
                    <li>✗ Higher interest rates</li>
                    <li>✗ Short employment history</li>
                    <li>✗ Self-employment income (harder to verify)</li>
                  </ul>
                </div>
              </div>

              {/* Using Calculator Results */}
              <h3 className="text-xl font-display font-semibold mt-8 mb-3">How to Use Your Calculator Results</h3>
              <p className="text-muted-foreground leading-relaxed">
                This calculator shows the minimum income required to qualify for your target home:
              </p>
              <ul className="text-muted-foreground space-y-2 mt-4">
                <li>
                  <strong>Required Income (28% ratio):</strong> The conservative approach most lenders prefer. 
                  This leaves more room in your budget for other expenses.
                </li>
                <li>
                  <strong>Required Income (31% ratio):</strong> What FHA and some other programs allow. 
                  This maximizes your buying power but tightens your budget.
                </li>
                <li>
                  <strong>Gap Analysis:</strong> Compare the required income to your actual income. If there's 
                  a gap, you'll need to adjust your target price, save more for down payment, or pay down debt.
                </li>
                <li>
                  <strong>Debt Impact:</strong> See how your existing debts affect qualification. Each $500/month 
                  in debt can reduce your buying power by $75,000-$100,000.
                </li>
              </ul>

              {/* Improving Your Qualification */}
              <h3 className="text-xl font-display font-semibold mt-8 mb-3">How to Qualify for More</h3>
              <p className="text-muted-foreground leading-relaxed">
                If you need to qualify for a larger mortgage, consider these strategies:
              </p>
              <ul className="text-muted-foreground space-y-2 mt-4">
                <li>
                  <strong>Pay off a car loan:</strong> Eliminating a $400/month car payment could increase 
                  your qualification by $65,000-$80,000.
                </li>
                <li>
                  <strong>Pay down credit cards:</strong> Lower minimum payments reduce your DTI ratio. 
                  Pay balances below 30% of limits for credit score boost too.
                </li>
                <li>
                  <strong>Increase your down payment:</strong> A larger down payment means a smaller loan 
                  and potentially no PMI, improving your ratios.
                </li>
                <li>
                  <strong>Add a co-borrower:</strong> A spouse or partner's income can significantly 
                  increase qualification (their debts count too, though).
                </li>
                <li>
                  <strong>Consider FHA:</strong> <Link to="/fha-loan-calculator/" className="text-primary hover:underline">FHA loans</Link> allow 
                  higher DTI ratios and lower credit scores.
                </li>
              </ul>

              {/* Who This Is Best For */}
              <h3 className="text-xl font-display font-semibold mt-8 mb-3">Who Should Use This Calculator?</h3>
              <ul className="text-muted-foreground space-y-2">
                <li>
                  <strong>Goal setters:</strong> Those planning to buy in 1-2 years who want to know 
                  what income target to aim for.
                </li>
                <li>
                  <strong>Home shoppers:</strong> Buyers who want to know if their target home price 
                  is realistic before getting pre-approved.
                </li>
                <li>
                  <strong>Debt evaluators:</strong> Those deciding whether to pay off debt or save for 
                  a down payment first.
                </li>
                <li>
                  <strong>Co-buyer planners:</strong> Couples figuring out if they need both incomes 
                  to qualify for their desired home.
                </li>
              </ul>

              {/* Related Calculators */}
              <h3 className="text-xl font-display font-semibold mt-8 mb-3">Related Calculators</h3>
              <ul className="text-muted-foreground space-y-2">
                <li>
                  <Link to="/house-affordability/" className="text-primary hover:underline">Affordability Calculator</Link> — 
                  Calculate maximum home price from your income
                </li>
                <li>
                  <Link to="/" className="text-primary hover:underline">Mortgage Calculator</Link> — 
                  See monthly payments for specific home prices
                </li>
                <li>
                  <Link to="/fha-loan-calculator/" className="text-primary hover:underline">FHA Loan Calculator</Link> — 
                  Calculate with FHA's more flexible qualification rules
                </li>
                <li>
                  <Link to="/va-loan-calculator/" className="text-primary hover:underline">VA Loan Calculator</Link> — 
                  Veterans may qualify with different criteria
                </li>
              </ul>

              {/* Official Resources */}
              <div className="bg-muted/30 p-6 rounded-lg mt-8">
                <h4 className="font-display font-semibold text-lg mb-4">Official Resources & Citations</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <a href="https://www.consumerfinance.gov/owning-a-home/loan-estimate/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      Consumer Financial Protection Bureau (CFPB)
                    </a> — Understanding loan estimates
                  </li>
                  <li>
                    <a href="https://singlefamily.fanniemae.com/originating-underwriting/borrower-asset-income-property/income-assessment" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      Fannie Mae
                    </a> — Income and DTI requirements
                  </li>
                  <li>
                    <a href="https://www.hud.gov/sites/dfiles/OCHCO/documents/4000.1hsgh-112021.pdf" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      HUD/FHA Handbook 4000.1
                    </a> — FHA underwriting guidelines
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

export default Qualification;
