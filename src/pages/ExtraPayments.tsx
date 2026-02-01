import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ExtraPaymentsCalculator from "@/components/ExtraPaymentsCalculator";

const ExtraPayments = () => {
  const canonicalUrl = "https://mortgagecalculation.net/extra-mortgage-payments-calculator/";

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
        name: "Extra Payments Calculator",
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
        name: "How much can I save by making extra mortgage payments?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The savings depend on your loan amount, interest rate, and how much extra you pay. For example, on a $300,000 loan at 7% for 30 years, paying an extra $200/month could save over $80,000 in interest and pay off your mortgage 7 years early. Even modest extra payments can save tens of thousands over time.",
        },
      },
      {
        "@type": "Question",
        name: "Should I pay extra on my mortgage or invest the money?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Compare your mortgage interest rate to potential investment returns. If your mortgage is at 7% and you expect 8-10% average stock market returns, investing might yield more (but with risk). However, paying down your mortgage provides a guaranteed 'return' equal to your interest rate. Many financial advisors recommend a balanced approach: maintain emergency savings, capture any 401k match, then split extra money between mortgage paydown and investing.",
        },
      },
      {
        "@type": "Question",
        name: "How do I ensure extra payments go toward principal?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Contact your lender to confirm how to apply extra payments to principal. Many require you to indicate 'apply to principal' when making payments, or offer a separate principal-only payment option online. Some lenders automatically apply extra to next month's payment (including interest), which doesn't save as much. Get this in writing and verify each payment is applied correctly.",
        },
      },
      {
        "@type": "Question",
        name: "Are there penalties for paying off my mortgage early?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Most conventional mortgages today don't have prepayment penalties, but some loans—especially subprime, certain ARMs, or hard money loans—may include them. Check your loan documents or ask your lender. Federal law prohibits prepayment penalties after 3 years on qualified mortgages. If you have a penalty, calculate whether the interest savings still outweigh the penalty cost.",
        },
      },
    ],
  };

  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Extra Mortgage Payments Calculator",
    applicationCategory: "FinanceApplication",
    description: "Calculate how extra mortgage payments can save you thousands in interest and pay off your loan early.",
    operatingSystem: "Any",
    url: canonicalUrl,
    featureList: [
      "Calculate interest savings from extra payments",
      "See payoff date acceleration",
      "Compare with and without extra payments",
      "Monthly and lump sum payment options",
      "View modified amortization schedule",
      "Total savings over loan term",
    ],
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };

  return (
    <>
      <Helmet>
        <title>Extra Mortgage Payments Calculator | Save Thousands on Interest</title>
        <meta
          name="description"
          content="Calculate how extra mortgage payments can save you thousands in interest and pay off your loan years early. See the impact of additional monthly or lump-sum payments."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="Extra Mortgage Payments Calculator" />
        <meta property="og:description" content="See how paying extra each month can save you thousands and pay off your mortgage early." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Extra Mortgage Payments Calculator" />
        <meta name="twitter:description" content="Calculate how extra payments can save you thousands in interest." />
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
                Extra Mortgage Payments Calculator
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                See how paying a little extra each month can save you thousands and help you become mortgage-free years sooner.
              </p>
            </header>

            <ExtraPaymentsCalculator />
            
            {/* Comprehensive Guide Section */}
            <section className="mt-16 prose prose-slate max-w-none">
              <h2 className="text-2xl font-display font-semibold mb-4">Complete Guide to Extra Mortgage Payments</h2>
              <p className="text-muted-foreground leading-relaxed">
                Making extra payments on your mortgage is one of the most effective ways to build wealth through 
                homeownership. According to the{" "}
                <a href="https://www.consumerfinance.gov/ask-cfpb/what-happens-if-i-make-additional-principal-payments-on-my-mortgage-en-1803/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  Consumer Financial Protection Bureau (CFPB)
                </a>, extra payments reduce your principal balance faster, which means you pay less interest 
                over the life of your loan.
              </p>

              {/* How Extra Payments Work */}
              <h3 className="text-xl font-display font-semibold mt-8 mb-3">How Extra Payments Save You Money</h3>
              <p className="text-muted-foreground leading-relaxed">
                When you make extra payments toward principal, you're essentially fast-forwarding through 
                your amortization schedule. Here's why this is so powerful:
              </p>
              <ul className="text-muted-foreground space-y-2 mt-4">
                <li>
                  <strong>Interest is calculated on remaining balance:</strong> Lower balance = less interest each month
                </li>
                <li>
                  <strong>Compound effect:</strong> Every dollar of extra principal you pay today saves interest for the 
                  remaining life of your loan
                </li>
                <li>
                  <strong>Snowball savings:</strong> As your balance drops faster, more of each regular payment goes 
                  to principal, accelerating payoff even more
                </li>
              </ul>
              <div className="bg-muted/50 p-4 rounded-lg mt-4">
                <h4 className="font-semibold text-foreground mb-2">Example: $300,000 Loan at 7% for 30 Years</h4>
                <p className="text-sm text-muted-foreground">
                  Regular monthly payment: $1,996<br />
                  Total interest over 30 years: $418,527<br />
                  <br />
                  With $200 extra per month:<br />
                  Payoff time: ~23 years (7 years early)<br />
                  Total interest: $294,892<br />
                  <strong className="text-green-600 dark:text-green-400">You save: $123,635</strong>
                </p>
              </div>

              {/* Pros and Cons */}
              <h3 className="text-xl font-display font-semibold mt-8 mb-3">Extra Payments: Pros and Cons</h3>
              <div className="grid md:grid-cols-2 gap-6 mt-4">
                <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">✓ Advantages</h4>
                  <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                    <li>Guaranteed "return" equal to your interest rate</li>
                    <li>Pay off mortgage years early</li>
                    <li>Save tens of thousands in interest</li>
                    <li>Build equity faster for future flexibility</li>
                    <li>Peace of mind of reduced debt</li>
                    <li>No fees to make extra payments (usually)</li>
                  </ul>
                </div>
                <div className="bg-red-50 dark:bg-red-950/30 p-4 rounded-lg">
                  <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">✗ Considerations</h4>
                  <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                    <li>Money is tied up in home equity (illiquid)</li>
                    <li>May miss higher returns from investing</li>
                    <li>Lose mortgage interest tax deduction faster</li>
                    <li>Doesn't reduce monthly payment obligation</li>
                    <li>Some loans have prepayment penalties</li>
                    <li>May be better to pay off higher-interest debt first</li>
                  </ul>
                </div>
              </div>

              {/* Strategies */}
              <h3 className="text-xl font-display font-semibold mt-8 mb-3">Strategies for Making Extra Payments</h3>
              <div className="space-y-4 text-muted-foreground">
                <div className="border-l-4 border-primary pl-4">
                  <h4 className="font-semibold text-foreground">Round Up Your Payment</h4>
                  <p className="text-sm">
                    If your payment is $1,847, round up to $1,900 or $2,000. This painless strategy can shave 
                    years off your mortgage with minimal budget impact.
                  </p>
                </div>
                <div className="border-l-4 border-primary pl-4">
                  <h4 className="font-semibold text-foreground">Bi-Weekly Payments</h4>
                  <p className="text-sm">
                    Pay half your mortgage every two weeks instead of monthly. Since there are 52 weeks, 
                    you'll make 26 half-payments (13 full payments) per year. See our{" "}
                    <Link to="/bi-weekly-mortgage-payments-calculator/" className="text-primary hover:underline">bi-weekly calculator</Link>.
                  </p>
                </div>
                <div className="border-l-4 border-primary pl-4">
                  <h4 className="font-semibold text-foreground">Annual Lump Sum</h4>
                  <p className="text-sm">
                    Put your tax refund, bonus, or other windfalls toward your mortgage once a year. 
                    A single $3,000 payment can save thousands in interest.
                  </p>
                </div>
                <div className="border-l-4 border-primary pl-4">
                  <h4 className="font-semibold text-foreground">Refinance and Keep Old Payment</h4>
                  <p className="text-sm">
                    If you <Link to="/refinance-calculator/" className="text-primary hover:underline">refinance</Link> to a lower 
                    rate, keep making your old (higher) payment. The difference goes straight to principal.
                  </p>
                </div>
              </div>

              {/* Using Calculator Results */}
              <h3 className="text-xl font-display font-semibold mt-8 mb-3">How to Use Your Calculator Results</h3>
              <p className="text-muted-foreground leading-relaxed">
                This calculator shows you the full impact of extra payments:
              </p>
              <ul className="text-muted-foreground space-y-2 mt-4">
                <li>
                  <strong>Interest Savings:</strong> The total interest you'll avoid paying. This is often 
                  the most motivating number—seeing $50,000+ in savings makes extra payments tangible.
                </li>
                <li>
                  <strong>Time Saved:</strong> How many years/months earlier you'll be mortgage-free. 
                  Imagine what you'd do with those extra years of no mortgage payment!
                </li>
                <li>
                  <strong>New Payoff Date:</strong> Your target date for being debt-free. Some people 
                  use this to plan for retirement.
                </li>
                <li>
                  <strong>Modified Amortization:</strong> See exactly how your balance decreases faster 
                  with extra payments applied.
                </li>
              </ul>

              {/* Decision Framework */}
              <h3 className="text-xl font-display font-semibold mt-8 mb-3">Should You Make Extra Payments? Decision Guide</h3>
              <p className="text-muted-foreground leading-relaxed">
                Before accelerating your mortgage payoff, ensure these financial basics are covered:
              </p>
              <ol className="text-muted-foreground space-y-2 mt-4 list-decimal pl-5">
                <li>
                  <strong>Emergency fund:</strong> Have 3-6 months of expenses saved in accessible accounts
                </li>
                <li>
                  <strong>Employer 401(k) match:</strong> Capture any "free money" from employer matching first
                </li>
                <li>
                  <strong>High-interest debt:</strong> Pay off credit cards (15-25%) before extra mortgage payments
                </li>
                <li>
                  <strong>No prepayment penalty:</strong> Verify your loan doesn't penalize early payoff
                </li>
              </ol>
              <p className="text-muted-foreground leading-relaxed mt-4">
                If all boxes are checked, extra mortgage payments are an excellent low-risk way to build wealth. 
                They provide a guaranteed "return" equal to your interest rate with no market risk.
              </p>

              {/* Important Tips */}
              <h3 className="text-xl font-display font-semibold mt-8 mb-3">Important Tips for Extra Payments</h3>
              <ul className="text-muted-foreground space-y-2">
                <li>
                  <strong>Specify "apply to principal":</strong> When making extra payments, clearly indicate 
                  they should reduce principal, not advance your due date.
                </li>
                <li>
                  <strong>Verify each payment:</strong> Check your statement to confirm extra payments were 
                  applied to principal, not held in escrow or applied to interest.
                </li>
                <li>
                  <strong>Consider your rate:</strong> At 7%+, extra payments provide great returns. At 3%, 
                  investing might be better—but the psychological benefit of being debt-free has value too.
                </li>
                <li>
                  <strong>Stay flexible:</strong> Don't lock yourself into payments you can't sustain. It's 
                  better to make smaller consistent extra payments than large sporadic ones.
                </li>
              </ul>

              {/* Who This Is Best For */}
              <h3 className="text-xl font-display font-semibold mt-8 mb-3">Who Benefits Most from Extra Payments?</h3>
              <ul className="text-muted-foreground space-y-2">
                <li>
                  <strong>Risk-averse savers:</strong> Those who prefer guaranteed returns over market volatility
                </li>
                <li>
                  <strong>Near-retirees:</strong> Those wanting to eliminate mortgage payments before retirement
                </li>
                <li>
                  <strong>High-rate borrowers:</strong> Those with 6%+ rates where extra payments yield strong returns
                </li>
                <li>
                  <strong>Equity builders:</strong> Those planning to sell and wanting maximum proceeds
                </li>
              </ul>

              {/* Related Calculators */}
              <h3 className="text-xl font-display font-semibold mt-8 mb-3">Related Calculators</h3>
              <ul className="text-muted-foreground space-y-2">
                <li>
                  <Link to="/bi-weekly-mortgage-payments-calculator/" className="text-primary hover:underline">Bi-Weekly Payment Calculator</Link> — 
                  See savings from bi-weekly instead of monthly payments
                </li>
                <li>
                  <Link to="/" className="text-primary hover:underline">Mortgage Calculator</Link> — 
                  Calculate your baseline monthly payment
                </li>
                <li>
                  <Link to="/refinance-calculator/" className="text-primary hover:underline">Refinance Calculator</Link> — 
                  Compare refinancing to extra payments
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
                    <a href="https://www.consumerfinance.gov/ask-cfpb/what-is-a-prepayment-penalty-en-1957/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      CFPB
                    </a> — Understanding prepayment penalties
                  </li>
                  <li>
                    <a href="https://www.investor.gov/introduction-investing/investing-basics/save-and-invest" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      SEC Investor.gov
                    </a> — Saving and investing basics (for comparison)
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

export default ExtraPayments;
