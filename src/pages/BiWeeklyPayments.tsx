import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BiWeeklyCalculator from "@/components/BiWeeklyCalculator";

const BiWeeklyPayments = () => {
  const canonicalUrl = "https://mortgagecalculation.net/bi-weekly-mortgage-payments-calculator/";

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
        name: "Bi-Weekly Payments Calculator",
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
        name: "How do bi-weekly mortgage payments work?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "With bi-weekly payments, you pay half your monthly mortgage payment every two weeks. Since there are 52 weeks in a year, you make 26 half-payments, which equals 13 full monthly payments instead of 12. That extra payment goes directly toward your principal, reducing your loan balance faster and saving you money on interest.",
        },
      },
      {
        "@type": "Question",
        name: "How much can I save with bi-weekly mortgage payments?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "On a $300,000 30-year mortgage at 7% interest, bi-weekly payments can save you approximately $65,000-$75,000 in total interest and pay off your loan 4-5 years early. The exact savings depend on your loan amount, interest rate, and how long you've been paying.",
        },
      },
      {
        "@type": "Question",
        name: "Do all lenders offer bi-weekly payment programs?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Not all lenders offer official bi-weekly programs. Some charge setup fees or processing fees for bi-weekly services. The good news: you can achieve the same result by DIY—simply add 1/12 of your monthly payment as extra principal each month, or make one extra monthly payment per year.",
        },
      },
      {
        "@type": "Question",
        name: "Is bi-weekly better than making extra monthly payments?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Bi-weekly payments and adding 1/12 extra to each monthly payment achieve similar results. The key advantage of bi-weekly is it aligns with many people's paychecks (paid every two weeks), making budgeting easier. The math works out almost identically—choose whichever fits your cash flow better.",
        },
      },
    ],
  };

  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Bi-Weekly Mortgage Payment Calculator",
    applicationCategory: "FinanceApplication",
    description: "Calculate how bi-weekly mortgage payments can save you thousands in interest and pay off your loan years early.",
    operatingSystem: "Any",
    url: canonicalUrl,
    featureList: [
      "Compare monthly vs bi-weekly payments",
      "Calculate interest savings",
      "See years saved on loan term",
      "26 payments per year analysis",
      "View payment schedule comparison",
      "Total cost comparison over loan life",
    ],
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };

  return (
    <>
      <Helmet>
        <title>Bi-Weekly Mortgage Payment Calculator | Pay Off Your Loan 4-5 Years Early</title>
        <meta
          name="description"
          content="Calculate how bi-weekly mortgage payments can save you thousands in interest and pay off your loan years early. Compare monthly vs bi-weekly payment schedules."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="Bi-Weekly Mortgage Payment Calculator" />
        <meta property="og:description" content="See how bi-weekly payments can save you thousands and shave years off your mortgage." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Bi-Weekly Mortgage Calculator" />
        <meta name="twitter:description" content="Calculate how bi-weekly payments can pay off your mortgage faster." />
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
                Bi-Weekly Mortgage Payment Calculator
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                See how switching to bi-weekly payments can save you thousands and shave years off your mortgage.
              </p>
            </header>

            <BiWeeklyCalculator />
            
            {/* Comprehensive Guide Section */}
            <section className="mt-16 prose prose-slate max-w-none">
              <h2 className="text-2xl font-display font-semibold mb-4">Complete Guide to Bi-Weekly Mortgage Payments</h2>
              <p className="text-muted-foreground leading-relaxed">
                Bi-weekly mortgage payments are one of the simplest strategies to pay off your home faster and 
                save tens of thousands in interest. The math is straightforward: by paying every two weeks instead 
                of monthly, you make the equivalent of 13 monthly payments per year instead of 12. According to the{" "}
                <a href="https://www.consumerfinance.gov/ask-cfpb/what-happens-if-i-make-additional-principal-payments-on-my-mortgage-en-1803/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  Consumer Financial Protection Bureau (CFPB)
                </a>, this extra payment goes directly toward principal, accelerating your payoff.
              </p>

              {/* How It Works */}
              <h3 className="text-xl font-display font-semibold mt-8 mb-3">How Bi-Weekly Payments Work</h3>
              <div className="bg-muted/50 p-4 rounded-lg mt-4">
                <h4 className="font-semibold text-foreground mb-2">The Math</h4>
                <p className="text-sm text-muted-foreground">
                  <strong>Monthly payments:</strong> 12 payments per year<br />
                  <strong>Bi-weekly payments:</strong> 26 half-payments = 13 full payments per year<br />
                  <strong>Extra payment per year:</strong> 1 full monthly payment toward principal<br />
                  <br />
                  <strong>Example:</strong> If your mortgage payment is $2,000/month<br />
                  • Monthly: $2,000 × 12 = $24,000/year<br />
                  • Bi-weekly: $1,000 × 26 = $26,000/year<br />
                  • Extra toward principal: $2,000/year
                </p>
              </div>

              {/* Pros and Cons */}
              <h3 className="text-xl font-display font-semibold mt-8 mb-3">Bi-Weekly Payments: Pros and Cons</h3>
              <div className="grid md:grid-cols-2 gap-6 mt-4">
                <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">✓ Advantages</h4>
                  <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                    <li>Pay off 30-year mortgage in ~25-26 years</li>
                    <li>Save $50,000-$100,000+ in interest</li>
                    <li>Aligns with bi-weekly paychecks</li>
                    <li>Smaller payments feel more manageable</li>
                    <li>Build equity faster</li>
                    <li>Simple "set it and forget it" strategy</li>
                  </ul>
                </div>
                <div className="bg-red-50 dark:bg-red-950/30 p-4 rounded-lg">
                  <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">✗ Considerations</h4>
                  <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                    <li>Two months have 3 payments (budget carefully)</li>
                    <li>Some lenders charge fees for bi-weekly programs</li>
                    <li>Not all lenders accept bi-weekly payments</li>
                    <li>Money could potentially earn more invested</li>
                    <li>Less mortgage interest tax deduction</li>
                    <li>DIY alternative achieves same result</li>
                  </ul>
                </div>
              </div>

              {/* Savings Examples */}
              <h3 className="text-xl font-display font-semibold mt-8 mb-3">Bi-Weekly Savings Examples</h3>
              <div className="overflow-x-auto mt-4">
                <table className="min-w-full text-sm border border-border rounded-lg overflow-hidden">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-4 py-2 text-left font-semibold">Loan Amount</th>
                      <th className="px-4 py-2 text-left font-semibold">Rate</th>
                      <th className="px-4 py-2 text-left font-semibold">Years Saved</th>
                      <th className="px-4 py-2 text-left font-semibold">Interest Saved</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    <tr className="border-t border-border">
                      <td className="px-4 py-2">$200,000</td>
                      <td className="px-4 py-2">6.5%</td>
                      <td className="px-4 py-2">~5 years</td>
                      <td className="px-4 py-2">~$43,000</td>
                    </tr>
                    <tr className="border-t border-border">
                      <td className="px-4 py-2">$300,000</td>
                      <td className="px-4 py-2">7.0%</td>
                      <td className="px-4 py-2">~5 years</td>
                      <td className="px-4 py-2">~$72,000</td>
                    </tr>
                    <tr className="border-t border-border">
                      <td className="px-4 py-2">$400,000</td>
                      <td className="px-4 py-2">7.0%</td>
                      <td className="px-4 py-2">~5 years</td>
                      <td className="px-4 py-2">~$96,000</td>
                    </tr>
                    <tr className="border-t border-border">
                      <td className="px-4 py-2">$500,000</td>
                      <td className="px-4 py-2">7.5%</td>
                      <td className="px-4 py-2">~5 years</td>
                      <td className="px-4 py-2">~$138,000</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                *Based on 30-year fixed mortgages. Use the calculator above for your exact scenario.
              </p>

              {/* Setting Up Bi-Weekly */}
              <h3 className="text-xl font-display font-semibold mt-8 mb-3">How to Set Up Bi-Weekly Payments</h3>
              <div className="space-y-4 text-muted-foreground">
                <div className="border-l-4 border-primary pl-4">
                  <h4 className="font-semibold text-foreground">Option 1: Through Your Lender</h4>
                  <p className="text-sm">
                    Contact your mortgage servicer to ask about their bi-weekly program. Some offer this free, 
                    while others charge setup or processing fees. Watch for fees—they can eat into your savings.
                  </p>
                </div>
                <div className="border-l-4 border-primary pl-4">
                  <h4 className="font-semibold text-foreground">Option 2: DIY Method (Recommended)</h4>
                  <p className="text-sm">
                    Divide your monthly payment by 12 and add that amount as extra principal each month. 
                    For a $2,000 payment: add $166.67 to each payment. This achieves the same result with 
                    no fees and works with any lender.
                  </p>
                </div>
                <div className="border-l-4 border-primary pl-4">
                  <h4 className="font-semibold text-foreground">Option 3: One Annual Payment</h4>
                  <p className="text-sm">
                    Make one extra payment per year (use your tax refund or bonus). This is equivalent to 
                    bi-weekly payments and may be easier to budget for some people.
                  </p>
                </div>
              </div>

              {/* Using Calculator Results */}
              <h3 className="text-xl font-display font-semibold mt-8 mb-3">How to Use Your Calculator Results</h3>
              <p className="text-muted-foreground leading-relaxed">
                This calculator compares your standard monthly payment schedule to a bi-weekly schedule:
              </p>
              <ul className="text-muted-foreground space-y-2 mt-4">
                <li>
                  <strong>Total Interest Comparison:</strong> See exactly how much you'll save in interest 
                  over the life of your loan. This is often $50,000-$100,000+.
                </li>
                <li>
                  <strong>Payoff Date Comparison:</strong> See your new payoff date—typically 4-5 years 
                  earlier than your original schedule.
                </li>
                <li>
                  <strong>Payment Amount:</strong> Your bi-weekly payment is exactly half your monthly 
                  payment, making budgeting straightforward.
                </li>
                <li>
                  <strong>Equivalent Extra Payment:</strong> See the annual extra amount going toward 
                  principal—helpful for the DIY approach.
                </li>
              </ul>

              {/* Watch Out For */}
              <h3 className="text-xl font-display font-semibold mt-8 mb-3">What to Watch Out For</h3>
              <ul className="text-muted-foreground space-y-2">
                <li>
                  <strong>Third-party services:</strong> Some companies charge $300-$500 to set up bi-weekly 
                  payments. This is unnecessary—use the DIY method instead.
                </li>
                <li>
                  <strong>Lender fees:</strong> Some lenders charge monthly or per-payment fees for bi-weekly 
                  programs. Ask upfront and calculate if savings exceed fees.
                </li>
                <li>
                  <strong>Payment timing:</strong> Some servicers hold bi-weekly payments until month-end, 
                  defeating the purpose. Confirm payments apply immediately to principal.
                </li>
                <li>
                  <strong>Three-payment months:</strong> Twice a year, you'll have 3 bi-weekly payments 
                  in one month. Budget for these months carefully.
                </li>
              </ul>

              {/* Who This Is Best For */}
              <h3 className="text-xl font-display font-semibold mt-8 mb-3">Who Benefits Most from Bi-Weekly Payments?</h3>
              <ul className="text-muted-foreground space-y-2">
                <li>
                  <strong>Bi-weekly earners:</strong> If you're paid every two weeks, bi-weekly mortgage 
                  payments align perfectly with your cash flow.
                </li>
                <li>
                  <strong>Early payoff seekers:</strong> Those who want to be mortgage-free faster without 
                  dramatically increasing their payment.
                </li>
                <li>
                  <strong>Set-it-and-forget-it types:</strong> Once set up, bi-weekly payments happen 
                  automatically—no discipline required.
                </li>
                <li>
                  <strong>Higher-rate borrowers:</strong> The higher your rate, the more you save with 
                  bi-weekly payments.
                </li>
              </ul>

              {/* Related Calculators */}
              <h3 className="text-xl font-display font-semibold mt-8 mb-3">Related Calculators</h3>
              <ul className="text-muted-foreground space-y-2">
                <li>
                  <Link to="/extra-mortgage-payments-calculator/" className="text-primary hover:underline">Extra Payments Calculator</Link> — 
                  Compare other extra payment strategies
                </li>
                <li>
                  <Link to="/" className="text-primary hover:underline">Mortgage Calculator</Link> — 
                  Calculate your baseline monthly payment
                </li>
                <li>
                  <Link to="/refinance-calculator/" className="text-primary hover:underline">Refinance Calculator</Link> — 
                  Compare refinancing to bi-weekly payments
                </li>
                <li>
                  <Link to="/house-affordability/" className="text-primary hover:underline">Affordability Calculator</Link> — 
                  Calculate how much house you can afford
                </li>
              </ul>

              {/* Official Resources */}
              <div className="bg-muted/30 p-6 rounded-lg mt-8">
                <h4 className="font-display font-semibold text-lg mb-4">Official Resources & Citations</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <a href="https://www.consumerfinance.gov/ask-cfpb/what-happens-if-i-make-additional-principal-payments-on-my-mortgage-en-1803/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      Consumer Financial Protection Bureau (CFPB)
                    </a> — Making additional principal payments
                  </li>
                  <li>
                    <a href="https://www.consumerfinance.gov/consumer-tools/mortgages/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      CFPB Mortgage Tools
                    </a> — Consumer mortgage resources
                  </li>
                  <li>
                    <a href="https://www.ftc.gov/business-guidance/resources/mortgage-assistance-relief-services-advertising-disclosures" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      Federal Trade Commission
                    </a> — Avoiding mortgage payment service scams
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

export default BiWeeklyPayments;
