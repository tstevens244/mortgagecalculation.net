import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JumboCalculator from "@/components/JumboCalculator";
import { formatCurrency } from "@/lib/formatters";

const Jumbo = () => {
  const canonicalUrl = "https://mortgagecalculation.net/jumbo-loan-calculator/";

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
        name: "Loan Programs",
        item: "https://mortgagecalculation.net/fha-loan-calculator",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Jumbo Loan",
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
        name: "What is a jumbo loan?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A jumbo loan is a mortgage that exceeds the conforming loan limits set by the Federal Housing Finance Agency (FHFA). Because these loans can't be purchased by Fannie Mae or Freddie Mac, they're considered non-conforming loans and typically have stricter qualification requirements.",
        },
      },
      {
        "@type": "Question",
        name: "What is the jumbo loan limit for 2025?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "For 2025, the conforming loan limit is $806,500 for most U.S. counties. Loans above this amount are considered jumbo loans. In high-cost areas like parts of California, New York, and Hawaii, the limit is $1,209,750. Any loan exceeding these area-specific limits requires jumbo financing.",
        },
      },
      {
        "@type": "Question",
        name: "Are jumbo loan interest rates higher than conventional loans?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Historically, jumbo loan rates were 0.25-0.50% higher than conforming loans. However, in recent years, jumbo rates have become increasingly competitive and sometimes even lower than conforming rates, especially for well-qualified borrowers with strong credit and substantial down payments.",
        },
      },
      {
        "@type": "Question",
        name: "How much down payment do I need for a jumbo loan?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Most jumbo lenders require 10-20% down, with 20% being most common. Some lenders offer jumbo loans with as little as 10% down, but you'll typically pay higher rates or need to purchase private mortgage insurance. For loan amounts above $1.5 million, 20-30% down is often required.",
        },
      },
    ],
  };

  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Jumbo Loan Calculator",
    applicationCategory: "FinanceApplication",
    description: "Free jumbo loan calculator to estimate monthly payments for mortgages above conforming loan limits.",
    operatingSystem: "Any",
    url: canonicalUrl,
    featureList: [
      "Calculate jumbo loan payments",
      "Current conforming loan limits",
      "High-cost area limit information",
      "Stricter qualification requirements",
      "Compare jumbo vs conforming loans",
      "No PMI with 20% down payment",
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
        <title>Jumbo Loan Calculator | High-Value Mortgage Payment Estimator | Mortgage Calculation</title>
        <meta name="description" content="Calculate your jumbo loan payment for high-value homes. Estimate monthly payments for loans above the conforming limit. Free jumbo mortgage calculator." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="Jumbo Loan Calculator | High-Value Mortgage Payment Estimator" />
        <meta property="og:description" content="Calculate your jumbo loan payment for high-value homes above the conforming loan limit." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Jumbo Loan Calculator" />
        <meta name="twitter:description" content="Calculate your jumbo mortgage payment for high-value homes above conforming limits." />
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
                Jumbo Loan Calculator
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Calculate your monthly payment for jumbo mortgages that exceed conforming loan limits. 
                Ideal for luxury homes and high-cost real estate markets.
              </p>
            </header>

            <JumboCalculator />

            <section className="mt-12 prose prose-slate max-w-none">
              <h2 className="text-2xl font-display font-semibold mb-4">The Complete Guide to Jumbo Loans in 2025</h2>
              <p className="text-muted-foreground leading-relaxed">
                A jumbo loan is a mortgage that exceeds the conforming loan limits set by the 
                <a href="https://www.fhfa.gov/DataTools/Downloads/Pages/Conforming-Loan-Limit.aspx" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline"> Federal Housing Finance Agency (FHFA)</a>. 
                Because these loans can't be purchased by Fannie Mae or Freddie Mac, they're considered 
                non-conforming loans. Jumbo loans are essential for purchasing luxury properties or homes 
                in expensive markets like San Francisco, New York City, or Los Angeles.
              </p>

              <h3 className="text-xl font-display font-semibold mt-8 mb-3">2025 Conforming Loan Limits</h3>
              <div className="grid md:grid-cols-2 gap-4 not-prose">
                <div className="calculator-card p-4 text-center">
                  <p className="text-sm text-muted-foreground mb-1">Standard Areas</p>
                  <p className="text-2xl font-bold text-primary">{formatCurrency(806500)}</p>
                  <p className="text-xs text-muted-foreground mt-1">Most U.S. counties</p>
                </div>
                <div className="calculator-card p-4 text-center">
                  <p className="text-sm text-muted-foreground mb-1">High-Cost Areas</p>
                  <p className="text-2xl font-bold text-primary">{formatCurrency(1209750)}</p>
                  <p className="text-xs text-muted-foreground mt-1">Alaska, Hawaii, and select metros</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Loans above these amounts require jumbo financing.
              </p>

              <h2 className="text-2xl font-display font-semibold mt-10 mb-4">Jumbo Loan Eligibility Requirements</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Jumbo loans have stricter requirements than <Link to="/conventional-mortgage-calculator/" className="text-primary hover:underline">conforming conventional loans</Link>:
              </p>
              <div className="grid md:grid-cols-2 gap-6 not-prose">
                <div className="calculator-card p-4">
                  <h4 className="font-semibold text-foreground mb-2">Credit Score</h4>
                  <p className="text-sm text-muted-foreground">
                    Most lenders require 700-720+ for jumbo loans. Some offer programs starting at 680, 
                    but expect higher rates. Excellent credit (760+) secures the best terms.
                  </p>
                </div>
                <div className="calculator-card p-4">
                  <h4 className="font-semibold text-foreground mb-2">Down Payment</h4>
                  <p className="text-sm text-muted-foreground">
                    Typically 10-20% minimum. Very large loans ($1.5M+) may require 25-30%. 
                    Some lenders offer 10% down with PMI or higher rates.
                  </p>
                </div>
                <div className="calculator-card p-4">
                  <h4 className="font-semibold text-foreground mb-2">Debt-to-Income Ratio</h4>
                  <p className="text-sm text-muted-foreground">
                    Most lenders cap DTI at 43%, with some requiring 36% or lower. 
                    Strong compensating factors may allow up to 45%.
                  </p>
                </div>
                <div className="calculator-card p-4">
                  <h4 className="font-semibold text-foreground mb-2">Cash Reserves</h4>
                  <p className="text-sm text-muted-foreground">
                    6-12 months of mortgage payments in liquid assets after closing. 
                    Larger loans may require 12-18 months of reserves.
                  </p>
                </div>
                <div className="calculator-card p-4">
                  <h4 className="font-semibold text-foreground mb-2">Documentation</h4>
                  <p className="text-sm text-muted-foreground">
                    Full documentation required: 2 years tax returns, W-2s/1099s, 2 months bank statements. 
                    Asset and income verification is thorough.
                  </p>
                </div>
                <div className="calculator-card p-4">
                  <h4 className="font-semibold text-foreground mb-2">Appraisal</h4>
                  <p className="text-sm text-muted-foreground">
                    Two appraisals may be required for very large loans. Unique or luxury 
                    properties may require specialized appraisers.
                  </p>
                </div>
              </div>

              <h2 className="text-2xl font-display font-semibold mt-10 mb-4">Jumbo Loan Pros and Cons</h2>
              <div className="not-prose grid gap-6 md:grid-cols-2">
                <div className="calculator-card p-4">
                  <h4 className="font-display font-semibold text-lg mb-3 text-accent">✓ Advantages of Jumbo Loans</h4>
                  <ul className="space-y-2 text-muted-foreground text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-accent">✓</span>
                      <span>Finance expensive properties with a single loan</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent">✓</span>
                      <span>Competitive rates—sometimes below conforming rates</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent">✓</span>
                      <span>No PMI with 20% down payment</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent">✓</span>
                      <span>Various term options: 10, 15, 20, 30-year fixed and ARMs</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent">✓</span>
                      <span>Interest-only options available from some lenders</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent">✓</span>
                      <span>No upper loan limit—borrow what you need</span>
                    </li>
                  </ul>
                </div>

                <div className="calculator-card p-4">
                  <h4 className="font-display font-semibold text-lg mb-3 text-primary">✗ Disadvantages of Jumbo Loans</h4>
                  <ul className="space-y-2 text-muted-foreground text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-primary">✗</span>
                      <span>Higher credit score requirements (700-720+)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">✗</span>
                      <span>Larger down payment required (10-20%+)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">✗</span>
                      <span>Substantial cash reserves needed (6-12 months)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">✗</span>
                      <span>More extensive documentation and underwriting</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">✗</span>
                      <span>May require two appraisals</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">✗</span>
                      <span>Fewer lenders offer jumbo products</span>
                    </li>
                  </ul>
                </div>
              </div>

              <h2 className="text-2xl font-display font-semibold mt-10 mb-4">Who Is a Jumbo Loan Best For?</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Jumbo loans are designed for financially strong borrowers purchasing high-value properties:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li><strong>High-income earners</strong> buying in expensive markets (CA, NY, MA, WA)</li>
                <li><strong>Borrowers with excellent credit</strong> (720+) who can secure competitive rates</li>
                <li><strong>Those with substantial savings</strong> for down payment and reserves</li>
                <li><strong>Luxury home buyers</strong> financing properties above $800K-$1M+</li>
                <li><strong>Self-employed professionals</strong> with documented high income</li>
              </ul>

              <h2 className="text-2xl font-display font-semibold mt-10 mb-4">How to Interpret Your Calculator Results</h2>
              <div className="calculator-card p-6 not-prose">
                <h4 className="font-semibold text-foreground mb-4">Making Sense of Your Jumbo Loan Estimate</h4>
                <ul className="space-y-3 text-muted-foreground text-sm">
                  <li>
                    <strong>Check conforming limits first:</strong> If your loan is close to the limit, 
                    consider a slightly larger down payment to stay under and qualify for conforming rates.
                  </li>
                  <li>
                    <strong>Compare ARM vs fixed:</strong> <Link to="/adjustable-rate-mortgage-calculator/" className="text-primary hover:underline">ARMs</Link> often 
                    offer lower initial rates on jumbo loans. If you'll sell or refinance within 5-7 years, an ARM may save thousands.
                  </li>
                  <li>
                    <strong>Verify reserve requirements:</strong> Ensure you'll have 6-12 months of payments 
                    remaining after closing. This is a deal-breaker for jumbo approval.
                  </li>
                  <li>
                    <strong>Shop multiple lenders:</strong> Jumbo rates and terms vary significantly. 
                    Credit unions and private banks often have competitive jumbo programs.
                  </li>
                </ul>
              </div>

              <h2 className="text-2xl font-display font-semibold mt-10 mb-4">Jumbo vs. Conforming Loans</h2>
              <div className="overflow-x-auto not-prose">
                <table className="w-full text-sm border-collapse calculator-card">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="p-3 text-left text-foreground font-semibold">Feature</th>
                      <th className="p-3 text-left text-foreground font-semibold">Jumbo Loan</th>
                      <th className="p-3 text-left text-foreground font-semibold">Conforming Loan</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    <tr className="border-b border-border">
                      <td className="p-3">Loan Limit</td>
                      <td className="p-3 text-accent font-semibold">No upper limit</td>
                      <td className="p-3">Up to $806,500*</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="p-3">Min. Credit Score</td>
                      <td className="p-3">700-720+</td>
                      <td className="p-3">620+</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="p-3">Down Payment</td>
                      <td className="p-3">10-20%+</td>
                      <td className="p-3">3-5%+</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="p-3">DTI Requirement</td>
                      <td className="p-3">36-43%</td>
                      <td className="p-3">Up to 50%</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="p-3">Cash Reserves</td>
                      <td className="p-3">6-12 months</td>
                      <td className="p-3">0-2 months</td>
                    </tr>
                    <tr>
                      <td className="p-3">Interest Rates</td>
                      <td className="p-3">Competitive/sometimes lower</td>
                      <td className="p-3">Market rates</td>
                    </tr>
                  </tbody>
                </table>
                <p className="text-xs text-muted-foreground mt-2">*$1,209,750 in high-cost areas</p>
              </div>

              <h2 className="text-2xl font-display font-semibold mt-10 mb-4">Frequently Asked Questions About Jumbo Loans</h2>
              <div className="space-y-6 not-prose">
                <div className="calculator-card p-4">
                  <h4 className="font-semibold text-foreground mb-2">Can I get a jumbo loan for an investment property?</h4>
                  <p className="text-sm text-muted-foreground">
                    Yes, jumbo loans are available for investment properties. Expect higher rates 
                    (0.25-0.75% more), larger down payments (25-30%), and stricter reserve requirements 
                    (12-18 months) compared to primary residence jumbo loans.
                  </p>
                </div>
                <div className="calculator-card p-4">
                  <h4 className="font-semibold text-foreground mb-2">Are jumbo loan interest rates higher?</h4>
                  <p className="text-sm text-muted-foreground">
                    Not necessarily. While jumbo rates were historically higher, they've become very 
                    competitive in recent years. With excellent credit (760+) and 20%+ down, you may 
                    find jumbo rates equal to or even below conforming rates.
                  </p>
                </div>
                <div className="calculator-card p-4">
                  <h4 className="font-semibold text-foreground mb-2">Can I refinance a jumbo loan?</h4>
                  <p className="text-sm text-muted-foreground">
                    Yes, jumbo loans can be refinanced like any mortgage. If your home has appreciated 
                    and your loan is now under conforming limits, you may be able to <Link to="/refinance-calculator/" className="text-primary hover:underline">refinance into a conforming loan</Link> for 
                    potentially easier qualification.
                  </p>
                </div>
                <div className="calculator-card p-4">
                  <h4 className="font-semibold text-foreground mb-2">What documents do I need for a jumbo loan?</h4>
                  <p className="text-sm text-muted-foreground">
                    Prepare: 2 years of tax returns, 2 years of W-2s/1099s, 60 days of bank/investment 
                    statements, proof of reserves, recent pay stubs, and documentation of any other 
                    income sources. Self-employed borrowers need business tax returns and P&L statements.
                  </p>
                </div>
              </div>

              <div className="calculator-card p-6 mt-10 not-prose">
                <h4 className="font-display font-semibold text-lg mb-4">Official Resources & Citations</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <a href="https://www.fhfa.gov/DataTools/Downloads/Pages/Conforming-Loan-Limit.aspx" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      FHFA Conforming Loan Limits
                    </a> — Official annual loan limit announcements
                  </li>
                  <li>
                    <a href="https://www.consumerfinance.gov/ask-cfpb/what-is-a-jumbo-loan-en-1991/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      Consumer Financial Protection Bureau (CFPB)
                    </a> — Jumbo loan consumer information
                  </li>
                  <li>
                    <a href="https://singlefamily.fanniemae.com/originating-underwriting/loan-limits" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      Fannie Mae Loan Limits
                    </a> — Conforming limit details by county
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

export default Jumbo;
