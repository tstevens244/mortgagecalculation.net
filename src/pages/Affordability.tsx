import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AffordabilityCalculator from "@/components/AffordabilityCalculator";

const Affordability = () => {
  const canonicalUrl = "https://mortgagecalculation.net/house-affordability/";

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
        name: "Affordability Calculator",
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
        name: "How much house can I afford on my salary?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A common rule of thumb is that you can afford a home 2-3 times your annual gross income. However, the more precise approach uses debt-to-income ratios. With the 28/36 rule, your housing costs shouldn't exceed 28% of gross income, and total debts shouldn't exceed 36%. For example, with a $100,000 income and the 28% rule, your maximum monthly housing payment would be about $2,333.",
        },
      },
      {
        "@type": "Question",
        name: "What is the 28/36 rule for buying a house?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The 28/36 rule is a lending guideline: your monthly housing costs (mortgage, taxes, insurance) shouldn't exceed 28% of your gross monthly income (front-end ratio), and your total monthly debts (housing + car payments + student loans + credit cards) shouldn't exceed 36% of gross income (back-end ratio). FHA loans may allow higher ratios of 31/43.",
        },
      },
      {
        "@type": "Question",
        name: "What percentage of income should go to a mortgage?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Most financial experts recommend spending no more than 25-28% of your gross monthly income on housing costs (mortgage principal and interest, property taxes, homeowner's insurance, and PMI if applicable). Some lenders will approve up to 43% of income for total debts, but this can leave little room for savings and emergencies.",
        },
      },
      {
        "@type": "Question",
        name: "What hidden costs should I budget for when buying a home?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Beyond your mortgage payment, budget for: closing costs (2-5% of home price), property taxes (varies by location), homeowner's insurance, PMI if down payment under 20%, HOA fees, maintenance and repairs (1-2% of home value annually), utilities, and furnishing costs. These can add $500-$1,500+ per month to your housing costs.",
        },
      },
    ],
  };

  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Mortgage Affordability Calculator",
    applicationCategory: "FinanceApplication",
    description: "Calculate how much house you can afford based on your income, debts, and monthly budget.",
    operatingSystem: "Any",
    url: canonicalUrl,
    featureList: [
      "Calculate maximum home price based on income",
      "Budget-based affordability analysis",
      "Apply 28/36 or 31/43 DTI rules",
      "Include property taxes and insurance",
      "Account for existing debts",
      "Compare conservative vs aggressive scenarios",
    ],
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };

  return (
    <>
      <Helmet>
        <title>How Much House Can I Afford? | Home Affordability Calculator</title>
        <meta
          name="description"
          content="Calculate how much house you can afford based on your income, debts, and monthly budget. Use DTI ratios to estimate your maximum home price and mortgage payment."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="How Much House Can I Afford? | Affordability Calculator" />
        <meta property="og:description" content="Calculate how much house you can afford based on your income, debts, and monthly budget." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Mortgage Affordability Calculator" />
        <meta name="twitter:description" content="Estimate your maximum home price based on income or monthly budget." />
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
                How Much House Can I Afford?
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Estimate your maximum home price based on income or monthly budget using industry-standard DTI ratios.
              </p>
            </header>

            <AffordabilityCalculator />

            {/* Comprehensive Guide Section */}
            <section className="mt-16 prose prose-slate max-w-none">
              <h2 className="text-2xl font-display font-semibold mb-4">Complete Guide to Home Affordability</h2>
              <p className="text-muted-foreground leading-relaxed">
                Determining how much house you can afford is one of the most important financial decisions you'll 
                make. According to the{" "}
                <a href="https://www.consumerfinance.gov/ask-cfpb/how-can-i-figure-out-if-i-can-afford-to-buy-a-home-and-take-out-a-mortgage-en-118/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  Consumer Financial Protection Bureau (CFPB)
                </a>, understanding your true affordability—not just what a lender will approve—helps you 
                avoid becoming "house poor" and maintain financial flexibility.
              </p>

              {/* DTI Rules Explained */}
              <h3 className="text-xl font-display font-semibold mt-8 mb-3">Understanding Debt-to-Income (DTI) Ratios</h3>
              <p className="text-muted-foreground leading-relaxed">
                Lenders use two DTI ratios to evaluate how much you can borrow:
              </p>
              <div className="grid md:grid-cols-2 gap-6 mt-4">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-semibold text-foreground mb-2">Front-End Ratio (Housing)</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Housing costs ÷ Gross monthly income
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Conservative: 28%</li>
                    <li>• FHA loans: up to 31%</li>
                    <li>• Aggressive: up to 35%</li>
                  </ul>
                  <p className="text-xs text-muted-foreground mt-2 italic">
                    Includes: mortgage P&I, property taxes, insurance, PMI, HOA
                  </p>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-semibold text-foreground mb-2">Back-End Ratio (Total Debt)</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    All monthly debts ÷ Gross monthly income
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Conservative: 36%</li>
                    <li>• FHA loans: up to 43%</li>
                    <li>• Some lenders: up to 50%</li>
                  </ul>
                  <p className="text-xs text-muted-foreground mt-2 italic">
                    Includes: housing + car payments + student loans + credit cards + other debts
                  </p>
                </div>
              </div>

              {/* Income-Based vs Budget-Based */}
              <h3 className="text-xl font-display font-semibold mt-8 mb-3">Two Approaches to Affordability</h3>
              <div className="space-y-4 text-muted-foreground">
                <div className="border-l-4 border-primary pl-4">
                  <h4 className="font-semibold text-foreground">Income-Based Approach</h4>
                  <p className="text-sm">
                    Calculates your maximum home price based on your income and DTI ratios. This shows what 
                    lenders will likely approve. Use this to understand your ceiling—but remember, the maximum 
                    isn't always the smartest choice.
                  </p>
                </div>
                <div className="border-l-4 border-primary pl-4">
                  <h4 className="font-semibold text-foreground">Budget-Based Approach</h4>
                  <p className="text-sm">
                    Starts with a monthly payment you're comfortable with, then calculates the corresponding 
                    home price. This is often more realistic because it's based on what you can actually 
                    afford after considering your lifestyle and savings goals.
                  </p>
                </div>
              </div>

              {/* Quick Reference Tables */}
              <h3 className="text-xl font-display font-semibold mt-8 mb-3">Quick Affordability Reference</h3>
              <p className="text-muted-foreground leading-relaxed">
                Here's a general guide based on the 28% front-end ratio with a 30-year fixed mortgage at 7% 
                interest rate, 20% down payment, and typical taxes/insurance:
              </p>
              <div className="overflow-x-auto mt-4">
                <table className="min-w-full text-sm border border-border rounded-lg overflow-hidden">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-4 py-2 text-left font-semibold">Annual Income</th>
                      <th className="px-4 py-2 text-left font-semibold">Max Monthly Payment (28%)</th>
                      <th className="px-4 py-2 text-left font-semibold">Approx. Home Price</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    <tr className="border-t border-border">
                      <td className="px-4 py-2">$50,000</td>
                      <td className="px-4 py-2">$1,167</td>
                      <td className="px-4 py-2">~$165,000</td>
                    </tr>
                    <tr className="border-t border-border">
                      <td className="px-4 py-2">$75,000</td>
                      <td className="px-4 py-2">$1,750</td>
                      <td className="px-4 py-2">~$250,000</td>
                    </tr>
                    <tr className="border-t border-border">
                      <td className="px-4 py-2">$100,000</td>
                      <td className="px-4 py-2">$2,333</td>
                      <td className="px-4 py-2">~$340,000</td>
                    </tr>
                    <tr className="border-t border-border">
                      <td className="px-4 py-2">$150,000</td>
                      <td className="px-4 py-2">$3,500</td>
                      <td className="px-4 py-2">~$510,000</td>
                    </tr>
                    <tr className="border-t border-border">
                      <td className="px-4 py-2">$200,000</td>
                      <td className="px-4 py-2">$4,667</td>
                      <td className="px-4 py-2">~$680,000</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                *These are estimates. Use the calculator above for precise numbers based on your situation.
              </p>

              {/* Hidden Costs */}
              <h3 className="text-xl font-display font-semibold mt-8 mb-3">Hidden Costs of Homeownership</h3>
              <p className="text-muted-foreground leading-relaxed">
                Many first-time buyers underestimate the true cost of owning a home. Budget for these expenses 
                beyond your mortgage payment:
              </p>
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-semibold text-foreground mb-2">Upfront Costs</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Closing costs: 2-5% of home price</li>
                    <li>• Home inspection: $300-$500</li>
                    <li>• Moving expenses: $1,000-$5,000+</li>
                    <li>• Immediate repairs/updates</li>
                    <li>• Furniture and appliances</li>
                  </ul>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-semibold text-foreground mb-2">Ongoing Costs</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Property taxes: varies by location</li>
                    <li>• Homeowner's insurance: $1,200-$3,000/year</li>
                    <li>• Maintenance: 1-2% of home value/year</li>
                    <li>• HOA fees: $200-$800/month if applicable</li>
                    <li>• Higher utilities than renting</li>
                  </ul>
                </div>
              </div>

              {/* Using Calculator Results */}
              <h3 className="text-xl font-display font-semibold mt-8 mb-3">How to Use Your Calculator Results</h3>
              <p className="text-muted-foreground leading-relaxed">
                This calculator shows you multiple perspectives on affordability:
              </p>
              <ul className="text-muted-foreground space-y-2 mt-4">
                <li>
                  <strong>Maximum Home Price:</strong> The ceiling based on your income and chosen DTI ratio. 
                  This is what lenders might approve, not necessarily what you should spend.
                </li>
                <li>
                  <strong>Conservative vs. Aggressive:</strong> Compare the 28/36 rule (safer) against 31/43 
                  (more risk). Consider your job stability and other goals.
                </li>
                <li>
                  <strong>Impact of Down Payment:</strong> See how different down payment amounts affect your 
                  maximum purchase price and monthly payment.
                </li>
                <li>
                  <strong>Debt Impact:</strong> Notice how existing debts reduce your borrowing power. Paying 
                  down debt before buying can significantly increase affordability.
                </li>
              </ul>

              {/* Decision Guidance */}
              <h3 className="text-xl font-display font-semibold mt-8 mb-3">Making a Smart Affordability Decision</h3>
              <p className="text-muted-foreground leading-relaxed">
                Financial experts recommend these guidelines:
              </p>
              <ul className="text-muted-foreground space-y-2 mt-4">
                <li>
                  <strong>Use the conservative ratio:</strong> The 28/36 rule leaves room for savings, 
                  emergencies, and life changes.
                </li>
                <li>
                  <strong>Factor in your lifestyle:</strong> If you travel frequently, have expensive hobbies, 
                  or plan to start a family, budget accordingly.
                </li>
                <li>
                  <strong>Maintain emergency savings:</strong> Keep 3-6 months of expenses accessible after 
                  your down payment and closing costs.
                </li>
                <li>
                  <strong>Consider future changes:</strong> Will your income increase? Are you planning career 
                  changes? Kids? Plan for 5-10 years ahead.
                </li>
              </ul>

              {/* Who This Is Best For */}
              <h3 className="text-xl font-display font-semibold mt-8 mb-3">Who Should Use This Calculator?</h3>
              <ul className="text-muted-foreground space-y-2">
                <li>
                  <strong>First-time homebuyers:</strong> Get a realistic picture of what you can afford 
                  before falling in love with homes out of your budget.
                </li>
                <li>
                  <strong>Pre-approval shoppers:</strong> Understand your limits before talking to lenders.
                </li>
                <li>
                  <strong>Move-up buyers:</strong> See how your current equity and new income affect 
                  your next purchase.
                </li>
                <li>
                  <strong>Financial planners:</strong> Those working toward homeownership goals who want 
                  to know what income or savings targets to aim for.
                </li>
              </ul>

              {/* Related Calculators */}
              <h3 className="text-xl font-display font-semibold mt-8 mb-3">Related Calculators</h3>
              <ul className="text-muted-foreground space-y-2">
                <li>
                  <Link to="/mortgage-qualification-calculator/" className="text-primary hover:underline">Mortgage Qualification Calculator</Link> — 
                  Calculate the income needed for a specific home price
                </li>
                <li>
                  <Link to="/" className="text-primary hover:underline">Mortgage Calculator</Link> — 
                  Calculate monthly payments for specific home prices
                </li>
                <li>
                  <Link to="/rent-or-buy/" className="text-primary hover:underline">Rent or Buy Calculator</Link> — 
                  Compare the cost of renting vs. buying
                </li>
                <li>
                  <Link to="/fha-loan-calculator/" className="text-primary hover:underline">FHA Loan Calculator</Link> — 
                  See if an FHA loan with lower down payment fits your budget
                </li>
              </ul>

              {/* Official Resources */}
              <div className="bg-muted/30 p-6 rounded-lg mt-8">
                <h4 className="font-display font-semibold text-lg mb-4">Official Resources & Citations</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <a href="https://www.consumerfinance.gov/ask-cfpb/how-can-i-figure-out-if-i-can-afford-to-buy-a-home-and-take-out-a-mortgage-en-118/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      Consumer Financial Protection Bureau (CFPB)
                    </a> — How much can I afford?
                  </li>
                  <li>
                    <a href="https://www.hud.gov/topics/buying_a_home" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      U.S. Department of Housing and Urban Development (HUD)
                    </a> — Home buying resources
                  </li>
                  <li>
                    <a href="https://singlefamily.fanniemae.com/originating-underwriting" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      Fannie Mae
                    </a> — Debt-to-income ratio guidelines
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

export default Affordability;
