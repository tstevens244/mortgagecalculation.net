import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RentOrBuyCalculator from "@/components/RentOrBuyCalculator";

const RentOrBuy = () => {
  const canonicalUrl = "https://mortgagecalculation.net/rent-or-buy/";

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
        name: "Rent or Buy Calculator",
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
        name: "Is it better to rent or buy a home?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "There's no universal answer—it depends on your situation. Buying typically makes more financial sense if you'll stay 5+ years, home prices are appreciating, and you have a stable income. Renting may be better if you need flexibility, home prices are inflated, or you can invest the down payment difference for higher returns. Use this calculator to compare your specific scenario.",
        },
      },
      {
        "@type": "Question",
        name: "How long should I plan to stay before buying makes sense?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The general rule is 5+ years. Buying involves significant upfront costs (closing costs of 2-5%) and selling costs (6-10% for agent fees and closing). These transaction costs typically take 3-7 years to recoup through home appreciation and equity building. If you might move sooner, renting often makes more financial sense.",
        },
      },
      {
        "@type": "Question",
        name: "What costs should I compare when deciding to rent or buy?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Compare all costs, not just monthly payments. For buying: mortgage payment, property taxes, insurance, maintenance (1-2% of home value annually), HOA fees, and opportunity cost of your down payment. For renting: monthly rent, renter's insurance, and potential rent increases. Also consider tax benefits of homeownership if you itemize deductions.",
        },
      },
      {
        "@type": "Question",
        name: "How does home appreciation affect the rent vs buy decision?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Home appreciation is crucial. If homes appreciate 3-5% annually, buying becomes more attractive because you're building equity while your home gains value. If appreciation is flat or negative, renting may be better since you avoid the risk of owning a depreciating asset. Research local market trends before deciding.",
        },
      },
    ],
  };

  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Rent or Buy Calculator",
    applicationCategory: "FinanceApplication",
    description: "Compare the financial costs and benefits of renting vs buying a home over time.",
    operatingSystem: "Any",
    url: canonicalUrl,
    featureList: [
      "Compare renting vs buying over time",
      "Factor in home appreciation rates",
      "Account for rent increase projections",
      "Calculate tax benefits of homeownership",
      "Include transaction and maintenance costs",
      "Visualize wealth accumulation comparison",
    ],
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };

  return (
    <>
      <Helmet>
        <title>Rent or Buy Calculator | Should I Rent or Buy a House?</title>
        <meta
          name="description"
          content="Compare the financial costs and benefits of renting vs buying a home. Analyze appreciation, taxes, maintenance costs, and time horizon to make an informed decision."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="Rent or Buy Calculator | Should You Rent or Buy?" />
        <meta property="og:description" content="Compare the long-term financial impact of renting versus purchasing a home." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Rent or Buy Calculator" />
        <meta name="twitter:description" content="Compare renting vs buying a home to make the best financial decision." />
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(webAppSchema)}</script>
      </Helmet>
      
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        
        <main id="main-content" className="flex-1 container py-8">
          <article>
            <header className="text-center mb-10">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-foreground mb-4">
                Rent or Buy Calculator
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Should you rent or buy? Compare the long-term financial impact of renting versus purchasing a home.
              </p>
            </header>

            <RentOrBuyCalculator />
            
            {/* Comprehensive Guide Section */}
            <section className="mt-16 prose prose-slate max-w-none">
              <h2 className="text-2xl font-display font-semibold mb-4">Complete Guide to the Rent vs. Buy Decision</h2>
              <p className="text-muted-foreground leading-relaxed">
                The decision to rent or buy is one of the biggest financial choices you'll make. While homeownership 
                is often considered part of the "American Dream," it's not always the best financial move. According to the{" "}
                <a href="https://www.consumerfinance.gov/about-us/blog/making-decision-rent-or-buy/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  Consumer Financial Protection Bureau (CFPB)
                </a>, the right choice depends on your financial situation, local market conditions, and personal goals.
              </p>

              {/* Key Factors */}
              <h3 className="text-xl font-display font-semibold mt-8 mb-3">Key Factors in the Rent vs. Buy Decision</h3>
              <div className="grid md:grid-cols-2 gap-6 mt-4">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-semibold text-foreground mb-2">Time Horizon</h4>
                  <p className="text-sm text-muted-foreground">
                    <strong>5+ years:</strong> Buying often makes sense<br />
                    <strong>3-5 years:</strong> Depends on market conditions<br />
                    <strong>&lt;3 years:</strong> Renting usually wins<br />
                    <br />
                    Transaction costs (buying + selling) typically require 5+ years to recoup.
                  </p>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-semibold text-foreground mb-2">Market Conditions</h4>
                  <p className="text-sm text-muted-foreground">
                    <strong>Price-to-rent ratio:</strong> Home price ÷ annual rent<br />
                    • Under 15: Buying favored<br />
                    • 15-20: Close call<br />
                    • Over 20: Renting favored<br />
                    <br />
                    In hot markets, ratios can exceed 25-30.
                  </p>
                </div>
              </div>

              {/* Pros and Cons */}
              <h3 className="text-xl font-display font-semibold mt-8 mb-3">Renting vs. Buying: Comprehensive Comparison</h3>
              <div className="grid md:grid-cols-2 gap-6 mt-4">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Renting: Pros & Cons</h4>
                  <div className="bg-green-50 dark:bg-green-950/30 p-3 rounded-lg mb-2">
                    <p className="text-sm text-green-700 dark:text-green-300 font-medium">✓ Advantages</p>
                    <ul className="text-sm text-green-700 dark:text-green-300 space-y-1 mt-1">
                      <li>Flexibility to move easily</li>
                      <li>No maintenance responsibilities</li>
                      <li>Lower upfront costs</li>
                      <li>Predictable monthly expenses</li>
                      <li>Can invest down payment elsewhere</li>
                    </ul>
                  </div>
                  <div className="bg-red-50 dark:bg-red-950/30 p-3 rounded-lg">
                    <p className="text-sm text-red-700 dark:text-red-300 font-medium">✗ Disadvantages</p>
                    <ul className="text-sm text-red-700 dark:text-red-300 space-y-1 mt-1">
                      <li>No equity building</li>
                      <li>Rent increases over time</li>
                      <li>Less control over living space</li>
                      <li>No tax benefits</li>
                      <li>May face eviction/non-renewal</li>
                    </ul>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Buying: Pros & Cons</h4>
                  <div className="bg-green-50 dark:bg-green-950/30 p-3 rounded-lg mb-2">
                    <p className="text-sm text-green-700 dark:text-green-300 font-medium">✓ Advantages</p>
                    <ul className="text-sm text-green-700 dark:text-green-300 space-y-1 mt-1">
                      <li>Build equity over time</li>
                      <li>Potential appreciation gains</li>
                      <li>Fixed mortgage payments (if fixed-rate)</li>
                      <li>Tax deductions (if itemizing)</li>
                      <li>Freedom to customize</li>
                    </ul>
                  </div>
                  <div className="bg-red-50 dark:bg-red-950/30 p-3 rounded-lg">
                    <p className="text-sm text-red-700 dark:text-red-300 font-medium">✗ Disadvantages</p>
                    <ul className="text-sm text-red-700 dark:text-red-300 space-y-1 mt-1">
                      <li>Large upfront costs (down payment + closing)</li>
                      <li>Responsible for all maintenance</li>
                      <li>Less flexibility to move</li>
                      <li>Market risk (prices can fall)</li>
                      <li>Property taxes can increase</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Hidden Costs */}
              <h3 className="text-xl font-display font-semibold mt-8 mb-3">True Costs of Homeownership</h3>
              <p className="text-muted-foreground leading-relaxed">
                Many buyers underestimate the full cost of owning a home. Beyond your mortgage payment, budget for:
              </p>
              <div className="overflow-x-auto mt-4">
                <table className="min-w-full text-sm border border-border rounded-lg overflow-hidden">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-4 py-2 text-left font-semibold">Cost</th>
                      <th className="px-4 py-2 text-left font-semibold">Typical Amount</th>
                      <th className="px-4 py-2 text-left font-semibold">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    <tr className="border-t border-border">
                      <td className="px-4 py-2 font-medium">Property taxes</td>
                      <td className="px-4 py-2">0.5-2.5% of home value/year</td>
                      <td className="px-4 py-2">Varies widely by location</td>
                    </tr>
                    <tr className="border-t border-border">
                      <td className="px-4 py-2 font-medium">Homeowner's insurance</td>
                      <td className="px-4 py-2">$1,200-$3,000/year</td>
                      <td className="px-4 py-2">Higher in disaster-prone areas</td>
                    </tr>
                    <tr className="border-t border-border">
                      <td className="px-4 py-2 font-medium">Maintenance</td>
                      <td className="px-4 py-2">1-2% of home value/year</td>
                      <td className="px-4 py-2">Includes repairs, upkeep</td>
                    </tr>
                    <tr className="border-t border-border">
                      <td className="px-4 py-2 font-medium">HOA fees</td>
                      <td className="px-4 py-2">$0-$1,000+/month</td>
                      <td className="px-4 py-2">Common in condos/planned communities</td>
                    </tr>
                    <tr className="border-t border-border">
                      <td className="px-4 py-2 font-medium">Selling costs</td>
                      <td className="px-4 py-2">6-10% of sale price</td>
                      <td className="px-4 py-2">Agent fees + closing costs</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Using Calculator Results */}
              <h3 className="text-xl font-display font-semibold mt-8 mb-3">How to Use Your Calculator Results</h3>
              <p className="text-muted-foreground leading-relaxed">
                This calculator compares the total financial impact of renting versus buying over your specified time horizon:
              </p>
              <ul className="text-muted-foreground space-y-2 mt-4">
                <li>
                  <strong>Net Cost Comparison:</strong> Shows which option costs more over your time frame, 
                  accounting for all expenses and equity gains.
                </li>
                <li>
                  <strong>Equity Accumulation:</strong> For buying, see how much equity you'd build through 
                  principal payments and home appreciation.
                </li>
                <li>
                  <strong>Rent Escalation:</strong> See how rent increases compound over time, potentially 
                  making buying more attractive in later years.
                </li>
                <li>
                  <strong>Break-Even Point:</strong> The year when buying becomes cheaper than renting 
                  (if it does in your scenario).
                </li>
              </ul>

              {/* Decision Framework */}
              <h3 className="text-xl font-display font-semibold mt-8 mb-3">Making Your Decision</h3>
              <p className="text-muted-foreground leading-relaxed">
                Based on your calculator results, consider these scenarios:
              </p>
              <div className="space-y-4 text-muted-foreground mt-4">
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-semibold text-foreground">Buying likely makes sense if:</h4>
                  <ul className="text-sm mt-1 space-y-1">
                    <li>• You'll stay 5+ years and break-even is under 3 years</li>
                    <li>• Home prices are appreciating in your area</li>
                    <li>• Your rent would exceed mortgage + costs</li>
                    <li>• You want stability and control over your home</li>
                  </ul>
                </div>
                <div className="border-l-4 border-yellow-500 pl-4">
                  <h4 className="font-semibold text-foreground">It's a close call if:</h4>
                  <ul className="text-sm mt-1 space-y-1">
                    <li>• Break-even is 3-5 years</li>
                    <li>• You're unsure about your timeline</li>
                    <li>• Price-to-rent ratio is 15-20</li>
                    <li>• Your situation could change (job, family)</li>
                  </ul>
                </div>
                <div className="border-l-4 border-red-500 pl-4">
                  <h4 className="font-semibold text-foreground">Renting likely makes sense if:</h4>
                  <ul className="text-sm mt-1 space-y-1">
                    <li>• You'll likely move within 3 years</li>
                    <li>• Home prices seem inflated (high price-to-rent)</li>
                    <li>• You value flexibility and low commitment</li>
                    <li>• You can invest the down payment for higher returns</li>
                  </ul>
                </div>
              </div>

              {/* Non-Financial Factors */}
              <h3 className="text-xl font-display font-semibold mt-8 mb-3">Beyond the Numbers</h3>
              <p className="text-muted-foreground leading-relaxed">
                The calculator focuses on finances, but some important factors can't be quantified:
              </p>
              <ul className="text-muted-foreground space-y-2 mt-4">
                <li>
                  <strong>Stability and roots:</strong> Owning provides stability for families, schools, 
                  and community ties.
                </li>
                <li>
                  <strong>Pride of ownership:</strong> Many people value the emotional satisfaction of 
                  owning their home.
                </li>
                <li>
                  <strong>Freedom to customize:</strong> Owners can renovate, paint, and modify as they wish.
                </li>
                <li>
                  <strong>Stress and responsibility:</strong> Some prefer the simplicity of renting where 
                  maintenance is someone else's problem.
                </li>
              </ul>

              {/* Related Calculators */}
              <h3 className="text-xl font-display font-semibold mt-8 mb-3">Related Calculators</h3>
              <ul className="text-muted-foreground space-y-2">
                <li>
                  <Link to="/house-affordability/" className="text-primary hover:underline">Affordability Calculator</Link> — 
                  Calculate how much house you can afford
                </li>
                <li>
                  <Link to="/" className="text-primary hover:underline">Mortgage Calculator</Link> — 
                  Calculate monthly mortgage payments
                </li>
                <li>
                  <Link to="/mortgage-qualification-calculator/" className="text-primary hover:underline">Qualification Calculator</Link> — 
                  See what income you need to qualify
                </li>
                <li>
                  <Link to="/fha-loan-calculator/" className="text-primary hover:underline">FHA Loan Calculator</Link> — 
                  Explore low down payment options
                </li>
              </ul>

              {/* Official Resources */}
              <div className="bg-muted/30 p-6 rounded-lg mt-8">
                <h4 className="font-display font-semibold text-lg mb-4">Official Resources & Citations</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <a href="https://www.consumerfinance.gov/about-us/blog/making-decision-rent-or-buy/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      Consumer Financial Protection Bureau (CFPB)
                    </a> — How do I decide if buying is right for me?
                  </li>
                  <li>
                    <a href="https://www.hud.gov/topics/buying_a_home" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      U.S. Department of Housing and Urban Development (HUD)
                    </a> — Home buying resources
                  </li>
                  <li>
                    <a href="https://www.irs.gov/taxtopics/tc701" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      IRS Topic 701
                    </a> — Sale of your home and tax implications
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

export default RentOrBuy;
