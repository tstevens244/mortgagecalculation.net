import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MortgageCalculator from "@/components/MortgageCalculator";

const Index = () => {
  const canonicalUrl = "https://mortgagecalculation.net/";

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
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How do I calculate my monthly mortgage payment?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Your monthly mortgage payment is calculated using the loan amount, interest rate, and loan term. The formula divides the total loan into equal monthly payments that cover both principal and interest. Additional costs like property taxes, insurance, PMI, and HOA fees are then added to get your total monthly housing payment.",
        },
      },
      {
        "@type": "Question",
        name: "What does my monthly mortgage payment include?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Your monthly mortgage payment typically consists of four main components, often referred to as PITI: Principal (the loan amount), Interest (the cost of borrowing), Taxes (property taxes), and Insurance (homeowner's insurance). If your down payment is less than 20%, you may also need to pay PMI (Private Mortgage Insurance).",
        },
      },
      {
        "@type": "Question",
        name: "What is an amortization schedule?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "An amortization schedule shows how your monthly payments are split between principal and interest over the life of your loan. In the early years, a larger portion goes toward interest. As you continue making payments, more goes toward paying down the principal balance.",
        },
      },
      {
        "@type": "Question",
        name: "How much house can I afford?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Most lenders use the 28/36 rule: your monthly housing costs shouldn't exceed 28% of your gross monthly income (front-end ratio), and your total monthly debts shouldn't exceed 36% of gross income (back-end ratio). Use our affordability calculator for a personalized estimate based on your income and debts.",
        },
      },
    ],
  };

  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Mortgage Calculator",
    applicationCategory: "FinanceApplication",
    description:
      "Free online mortgage calculator to estimate monthly payments, including property tax, insurance, PMI, and amortization schedule.",
    operatingSystem: "Any",
    url: canonicalUrl,
    featureList: [
      "Calculate monthly mortgage payments",
      "Include property taxes, insurance, and PMI",
      "View complete amortization schedule",
      "Visualize payment breakdown with charts",
      "Compare different loan scenarios",
      "Export amortization data",
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
        <title>Free Mortgage Calculator | Estimate Monthly Payments & Amortization</title>
        <meta
          name="description"
          content="Calculate your monthly mortgage payment with our free mortgage calculator. Includes property tax, insurance, PMI, and full amortization schedule."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="Free Mortgage Calculator | Estimate Monthly Payments" />
        <meta
          property="og:description"
          content="Calculate your monthly mortgage payment including taxes, insurance, and PMI. View your complete amortization schedule."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free Mortgage Calculator" />
        <meta
          name="twitter:description"
          content="Calculate your monthly mortgage payment including taxes, insurance, and PMI."
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
                Mortgage Calculator
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Estimate your monthly mortgage payment with our free calculator. Includes principal, interest,
                taxes, insurance, and PMI.
              </p>
            </header>

            <MortgageCalculator />

            {/* Comprehensive Guide Section */}
            <section className="mt-16 prose prose-slate max-w-none">
              <h2 className="text-2xl font-display font-semibold mb-4">Complete Guide to Mortgage Payments</h2>
              <p className="text-muted-foreground leading-relaxed">
                Understanding your mortgage payment is essential for making informed home buying decisions. According to 
                the <a href="https://www.consumerfinance.gov/consumer-tools/mortgages/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Consumer Financial Protection Bureau (CFPB)</a>, 
                your monthly payment is just one piece of the total cost of homeownership. This calculator helps you 
                understand all the components that make up your housing expense.
              </p>

              {/* How Mortgage Payments Work */}
              <h3 className="text-xl font-display font-semibold mt-8 mb-3">How Mortgage Payments Work</h3>
              <p className="text-muted-foreground leading-relaxed">
                When you take out a mortgage, you're borrowing money to buy a home and agreeing to pay it back over 
                time with interest. Your monthly payment is calculated using an amortization formula that ensures 
                you pay off both the loan amount (principal) and the borrowing cost (interest) over your loan term.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                The standard mortgage payment formula is: M = P × [r(1+r)^n] / [(1+r)^n – 1], where M is your monthly 
                payment, P is the loan principal, r is the monthly interest rate, and n is the number of payments. 
                Our calculator does this math automatically and adds other housing costs for a complete picture.
              </p>

              {/* PITI Breakdown */}
              <h3 className="text-xl font-display font-semibold mt-8 mb-3">Understanding PITI: The Four Components of Your Payment</h3>
              <p className="text-muted-foreground leading-relaxed">
                Lenders and real estate professionals often refer to "PITI" when discussing mortgage payments. 
                This acronym represents the four main components of your monthly housing expense:
              </p>
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-semibold text-foreground">Principal</h4>
                  <p className="text-sm text-muted-foreground">
                    The portion of your payment that reduces your loan balance. Early in your loan, this is a 
                    smaller part of your payment, but it grows over time.
                  </p>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-semibold text-foreground">Interest</h4>
                  <p className="text-sm text-muted-foreground">
                    The cost of borrowing money. This is larger early in your loan when your balance is highest, 
                    and decreases as you pay down principal.
                  </p>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-semibold text-foreground">Taxes</h4>
                  <p className="text-sm text-muted-foreground">
                    Property taxes vary significantly by location. Many lenders collect 1/12 of your annual 
                    property tax each month and hold it in escrow.
                  </p>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-semibold text-foreground">Insurance</h4>
                  <p className="text-sm text-muted-foreground">
                    Homeowner's insurance protects your property. Lenders require coverage at minimum equal to 
                    your loan amount. This is often escrowed with taxes.
                  </p>
                </div>
              </div>

              {/* PMI Section */}
              <h3 className="text-xl font-display font-semibold mt-8 mb-3">Private Mortgage Insurance (PMI)</h3>
              <p className="text-muted-foreground leading-relaxed">
                If your down payment is less than 20% of the home's purchase price, you'll typically need to pay 
                Private Mortgage Insurance. According to <a href="https://singlefamily.fanniemae.com/originating-underwriting/mortgage-products" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Fannie Mae</a>, 
                PMI protects the lender if you default on the loan. PMI typically costs 0.3% to 1.5% of the original 
                loan amount annually.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                The good news: PMI isn't permanent. Under the Homeowners Protection Act, your lender must automatically 
                cancel PMI when your loan balance reaches 78% of the original home value. You can also request 
                cancellation when you reach 80% loan-to-value.
              </p>

              {/* Using Calculator Results */}
              <h3 className="text-xl font-display font-semibold mt-8 mb-3">How to Use Your Calculator Results</h3>
              <p className="text-muted-foreground leading-relaxed">
                This calculator provides several key outputs to help you plan your home purchase:
              </p>
              <ul className="text-muted-foreground space-y-2 mt-4">
                <li>
                  <strong>Monthly Payment:</strong> Your total housing payment including all components. Compare this 
                  to 28% of your gross monthly income—if it's higher, you may be stretching your budget.
                </li>
                <li>
                  <strong>Payment Breakdown:</strong> See exactly how much goes to each category. This helps you 
                  understand where your money is going each month.
                </li>
                <li>
                  <strong>Total Interest:</strong> The total amount you'll pay in interest over the life of the loan. 
                  This can help you decide between different loan terms.
                </li>
                <li>
                  <strong>Amortization Schedule:</strong> View how your balance decreases over time and when you'll 
                  hit key equity milestones.
                </li>
              </ul>

              {/* Loan Types Section */}
              <h3 className="text-xl font-display font-semibold mt-8 mb-3">Choosing the Right Loan Type</h3>
              <p className="text-muted-foreground leading-relaxed">
                Different loan programs have different requirements and benefits. Understanding your options can 
                help you save money and qualify for a better loan:
              </p>
              <ul className="text-muted-foreground space-y-2 mt-4">
                <li>
                  <Link to="/conventional-mortgage-calculator/" className="text-primary hover:underline font-medium">Conventional Loans</Link>: 
                  Standard loans with competitive rates for borrowers with good credit and 5-20%+ down payment.
                </li>
                <li>
                  <Link to="/fha-loan-calculator/" className="text-primary hover:underline font-medium">FHA Loans</Link>: 
                  Government-backed loans with lower credit requirements and 3.5% minimum down payment.
                </li>
                <li>
                  <Link to="/va-loan-calculator/" className="text-primary hover:underline font-medium">VA Loans</Link>: 
                  Zero down payment loans for eligible veterans, active military, and surviving spouses.
                </li>
                <li>
                  <Link to="/usda-loan-calculator/" className="text-primary hover:underline font-medium">USDA Loans</Link>: 
                  Zero down payment loans for moderate-income buyers in eligible rural areas.
                </li>
                <li>
                  <Link to="/jumbo-loan-calculator/" className="text-primary hover:underline font-medium">Jumbo Loans</Link>: 
                  Loans exceeding conforming limits (${">"}$806,500 in most areas for 2025).
                </li>
              </ul>

              {/* Saving Strategies */}
              <h3 className="text-xl font-display font-semibold mt-8 mb-3">Strategies to Lower Your Payment</h3>
              <p className="text-muted-foreground leading-relaxed">
                If your calculated payment is higher than you'd like, consider these strategies:
              </p>
              <ul className="text-muted-foreground space-y-2 mt-4">
                <li>
                  <strong>Increase your down payment:</strong> A larger down payment means a smaller loan and may 
                  eliminate PMI if you reach 20%.
                </li>
                <li>
                  <strong>Shop for better rates:</strong> Even a 0.25% difference in interest rate can save 
                  thousands over the life of your loan.
                </li>
                <li>
                  <strong>Choose a longer term:</strong> A 30-year loan has lower monthly payments than a 15-year 
                  loan (though you'll pay more interest overall).
                </li>
                <li>
                  <strong>Consider <Link to="/adjustable-rate-mortgage-calculator/" className="text-primary hover:underline">adjustable rates</Link>:</strong> 
                  ARMs often have lower initial rates if you plan to sell or refinance before the rate adjusts.
                </li>
              </ul>

              {/* Decision Guidance */}
              <h3 className="text-xl font-display font-semibold mt-8 mb-3">Making Your Decision</h3>
              <p className="text-muted-foreground leading-relaxed">
                Use this calculator alongside our other tools for a complete financial picture:
              </p>
              <ul className="text-muted-foreground space-y-2 mt-4">
                <li>
                  <Link to="/house-affordability/" className="text-primary hover:underline">How Much House Can I Afford?</Link> — 
                  Start here to determine your maximum budget based on income.
                </li>
                <li>
                  <Link to="/mortgage-qualification-calculator/" className="text-primary hover:underline">Mortgage Qualification Calculator</Link> — 
                  Find out the income needed to qualify for a specific home price.
                </li>
                <li>
                  <Link to="/rent-or-buy/" className="text-primary hover:underline">Rent or Buy Calculator</Link> — 
                  Compare the long-term costs of renting versus buying.
                </li>
                <li>
                  <Link to="/extra-mortgage-payments-calculator/" className="text-primary hover:underline">Extra Payments Calculator</Link> — 
                  See how paying extra can save you thousands in interest.
                </li>
              </ul>

              {/* Official Resources */}
              <div className="bg-muted/30 p-6 rounded-lg mt-8">
                <h4 className="font-display font-semibold text-lg mb-4">Official Resources & Citations</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <a href="https://www.consumerfinance.gov/consumer-tools/mortgages/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      Consumer Financial Protection Bureau (CFPB)
                    </a> — Mortgage tools and consumer protection information
                  </li>
                  <li>
                    <a href="https://www.hud.gov/topics/buying_a_home" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      U.S. Department of Housing and Urban Development (HUD)
                    </a> — Home buying resources and loan programs
                  </li>
                  <li>
                    <a href="https://singlefamily.fanniemae.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      Fannie Mae Single Family
                    </a> — Conforming loan guidelines and PMI requirements
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

export default Index;
