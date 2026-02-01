import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MortgageCalculator from "@/components/MortgageCalculator";

const Conventional = () => {
  const canonicalUrl = "https://mortgagecalculation.net/conventional-mortgage-calculator/";

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
        item: "https://mortgagecalculation.net/conventional-mortgage-calculator",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Conventional",
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
        name: "What is a conventional mortgage?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A conventional mortgage is a home loan that is not insured or guaranteed by the federal government. Unlike FHA, VA, or USDA loans, conventional mortgages are backed by private lenders and typically follow guidelines set by Fannie Mae and Freddie Mac. They are the most common type of mortgage and offer flexible terms for qualified borrowers.",
        },
      },
      {
        "@type": "Question",
        name: "What credit score do I need for a conventional loan?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The minimum credit score for a conventional loan is typically 620, though some lenders require 640. For the best interest rates, aim for a score of 740 or higher. Borrowers with scores between 620-680 may face higher rates and stricter requirements.",
        },
      },
      {
        "@type": "Question",
        name: "How much down payment do I need for a conventional mortgage?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Conventional loans are available with down payments as low as 3% through programs like Fannie Mae's HomeReady or Freddie Mac's Home Possible. However, putting down less than 20% requires Private Mortgage Insurance (PMI) until you reach 20% equity.",
        },
      },
      {
        "@type": "Question",
        name: "When can I remove PMI from my conventional loan?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "You can request PMI removal once you reach 20% equity based on the original purchase price. Lenders are required to automatically cancel PMI when you reach 22% equity. You may also be able to remove PMI earlier if your home has appreciated significantly, through a new appraisal.",
        },
      },
    ],
  };

  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Conventional Mortgage Calculator",
    applicationCategory: "FinanceApplication",
    description:
      "Free online conventional mortgage calculator to estimate monthly payments, including property tax, insurance, PMI, and amortization schedule.",
    operatingSystem: "Any",
    url: canonicalUrl,
    featureList: [
      "Calculate conventional loan payments",
      "Include PMI for low down payments",
      "View complete amortization schedule",
      "Compare with government-backed loans",
      "Estimate property taxes and insurance",
      "No upfront mortgage insurance premium",
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
        <title>Conventional Mortgage Calculator | Estimate Your Monthly Payment</title>
        <meta
          name="description"
          content="Calculate your conventional mortgage payment with our free calculator. See principal, interest, taxes, insurance, and PMI for conforming loans."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="Conventional Mortgage Calculator | Monthly Payment Estimator" />
        <meta
          property="og:description"
          content="Calculate your conventional loan payment including taxes, insurance, and PMI. View your complete amortization schedule."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Conventional Mortgage Calculator" />
        <meta
          name="twitter:description"
          content="Calculate your conventional mortgage payment including taxes, insurance, and PMI."
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
                Conventional Mortgage Calculator
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Estimate your monthly payment for a conventional loan. Includes principal, interest,
                taxes, insurance, and PMI for down payments under 20%.
              </p>
            </header>

            <MortgageCalculator />

            <section className="mt-12 prose prose-slate max-w-none">
              <h2 className="text-2xl font-display font-semibold mb-4">The Complete Guide to Conventional Mortgages in 2025</h2>
              <p className="text-muted-foreground leading-relaxed">
                A conventional mortgage is a home loan that is not insured or guaranteed by the federal government. 
                Unlike <Link to="/fha-loan-calculator/" className="text-primary hover:underline">FHA</Link>, 
                <Link to="/va-loan-calculator/" className="text-primary hover:underline"> VA</Link>, or 
                <Link to="/usda-loan-calculator/" className="text-primary hover:underline"> USDA loans</Link>, conventional mortgages are backed by private lenders and typically 
                follow guidelines set by <a href="https://singlefamily.fanniemae.com/originating-underwriting/mortgage-products" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Fannie Mae</a> and 
                <a href="https://sf.freddiemac.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline"> Freddie Mac</a>. 
                They are the most common type of mortgage, accounting for about 70% of all home loans.
              </p>

              <h2 className="text-2xl font-display font-semibold mt-10 mb-4">Conventional Loan Eligibility Requirements</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                According to <a href="https://www.consumerfinance.gov/ask-cfpb/what-is-a-conventional-loan-en-117/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Consumer Financial Protection Bureau guidelines</a>, 
                conventional loans have stricter requirements than government-backed options:
              </p>
              <div className="grid md:grid-cols-2 gap-6 not-prose">
                <div className="calculator-card p-4">
                  <h4 className="font-semibold text-foreground mb-2">Credit Score</h4>
                  <p className="text-sm text-muted-foreground">
                    Minimum 620 for most lenders. Scores of 740+ qualify for the best rates. Each 20-point drop typically increases rates by 0.125-0.25%.
                  </p>
                </div>
                <div className="calculator-card p-4">
                  <h4 className="font-semibold text-foreground mb-2">Down Payment</h4>
                  <p className="text-sm text-muted-foreground">
                    As low as 3% for first-time buyers (HomeReady/Home Possible). 5-20% is typical. 20%+ eliminates PMI requirement.
                  </p>
                </div>
                <div className="calculator-card p-4">
                  <h4 className="font-semibold text-foreground mb-2">Debt-to-Income Ratio (DTI)</h4>
                  <p className="text-sm text-muted-foreground">
                    Maximum 43-45% back-end DTI for most borrowers. Up to 50% may be allowed with compensating factors like high credit or cash reserves.
                  </p>
                </div>
                <div className="calculator-card p-4">
                  <h4 className="font-semibold text-foreground mb-2">Employment & Income</h4>
                  <p className="text-sm text-muted-foreground">
                    Two years of stable employment history preferred. Income must be documented with W-2s, tax returns, and pay stubs.
                  </p>
                </div>
                <div className="calculator-card p-4">
                  <h4 className="font-semibold text-foreground mb-2">Property Types Allowed</h4>
                  <p className="text-sm text-muted-foreground">
                    Primary residence, second homes, and investment properties. More flexibility than government loans.
                  </p>
                </div>
                <div className="calculator-card p-4">
                  <h4 className="font-semibold text-foreground mb-2">Cash Reserves</h4>
                  <p className="text-sm text-muted-foreground">
                    Typically 2 months of mortgage payments in reserve. Investment properties may require 6 months.
                  </p>
                </div>
              </div>

              <h2 className="text-2xl font-display font-semibold mt-10 mb-4">Conventional Loan Pros and Cons</h2>
              <div className="not-prose grid gap-6 md:grid-cols-2">
                <div className="calculator-card p-4">
                  <h4 className="font-display font-semibold text-lg mb-3 text-accent">✓ Advantages of Conventional Loans</h4>
                  <ul className="space-y-2 text-muted-foreground text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-accent">✓</span>
                      <span>No upfront mortgage insurance premium</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent">✓</span>
                      <span>PMI can be removed at 20% equity (unlike FHA MIP)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent">✓</span>
                      <span>Competitive rates for borrowers with good credit</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent">✓</span>
                      <span>Flexible property types: primary, second home, investment</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent">✓</span>
                      <span>Higher loan limits than FHA ($766,550 in most areas)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent">✓</span>
                      <span>Less paperwork and faster closing than government loans</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent">✓</span>
                      <span>No occupancy requirements for investment properties</span>
                    </li>
                  </ul>
                </div>

                <div className="calculator-card p-4">
                  <h4 className="font-display font-semibold text-lg mb-3 text-primary">✗ Disadvantages of Conventional Loans</h4>
                  <ul className="space-y-2 text-muted-foreground text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-primary">✗</span>
                      <span>Higher credit score requirements than FHA (620 vs 500)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">✗</span>
                      <span>PMI required for down payments under 20%</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">✗</span>
                      <span>Stricter DTI requirements than government loans</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">✗</span>
                      <span>Less forgiving of past credit issues</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">✗</span>
                      <span>Higher rates for lower credit scores</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">✗</span>
                      <span>Gift funds may have restrictions</span>
                    </li>
                  </ul>
                </div>
              </div>

              <h2 className="text-2xl font-display font-semibold mt-10 mb-4">Conforming vs. Non-Conforming Loans</h2>
              <p className="text-muted-foreground leading-relaxed">
                Conventional loans fall into two categories based on loan limits set by the Federal Housing Finance Agency (FHFA):
              </p>
              <div className="grid md:grid-cols-2 gap-4 not-prose mt-4">
                <div className="calculator-card p-4">
                  <h4 className="font-semibold text-foreground mb-2">Conforming Loans</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Meet Fannie Mae/Freddie Mac guidelines and fall within loan limits:
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• $832,750 for most U.S. counties (2026)</li>
                    <li>• Up to $1,249,125 in high-cost areas</li>
                    <li>• Generally offer best rates</li>
                  </ul>
                </div>
                <div className="calculator-card p-4">
                  <h4 className="font-semibold text-foreground mb-2">Non-Conforming (Jumbo) Loans</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Exceed conforming limits or don't meet standard criteria:
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• No upper limit—finance luxury homes</li>
                    <li>• Stricter requirements (700+ credit typical)</li>
                    <li>• <Link to="/jumbo-loan-calculator/" className="text-primary hover:underline">Calculate jumbo loan payments →</Link></li>
                  </ul>
                </div>
              </div>

              <h2 className="text-2xl font-display font-semibold mt-10 mb-4">Understanding Private Mortgage Insurance (PMI)</h2>
              <p className="text-muted-foreground leading-relaxed">
                If your down payment is less than 20%, you'll pay PMI to protect the lender against default. 
                PMI costs typically range from 0.3% to 1.5% of the loan amount annually, or $50-$250/month per $100,000 borrowed. 
                Unlike FHA mortgage insurance, PMI can be removed once you reach 20% equity:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li><strong>Request removal at 20% equity:</strong> Based on original purchase price or current appraised value</li>
                <li><strong>Automatic cancellation at 22% equity:</strong> Lenders must remove PMI when you hit this threshold</li>
                <li><strong>Refinance to remove PMI:</strong> If your home has appreciated significantly, consider <Link to="/refinance-calculator/" className="text-primary hover:underline">refinancing</Link></li>
              </ul>

              <h2 className="text-2xl font-display font-semibold mt-10 mb-4">Who Is a Conventional Loan Best For?</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Conventional loans are ideal for borrowers who have:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li><strong>Good to excellent credit (680+)</strong> to qualify for competitive rates</li>
                <li><strong>Stable income and employment</strong> with documented history</li>
                <li><strong>10-20% down payment</strong> to minimize or eliminate PMI</li>
                <li><strong>Plans to buy a second home or investment property</strong></li>
                <li><strong>Need for higher loan amounts</strong> above FHA limits</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                If your credit score is below 620 or you have limited savings, consider an 
                <Link to="/fha-loan-calculator/" className="text-primary hover:underline"> FHA loan</Link>. 
                Veterans should explore <Link to="/va-loan-calculator/" className="text-primary hover:underline">VA loans</Link> for 
                0% down with no PMI.
              </p>

              <h2 className="text-2xl font-display font-semibold mt-10 mb-4">How to Interpret Your Calculator Results</h2>
              <div className="calculator-card p-6 not-prose">
                <h4 className="font-semibold text-foreground mb-4">Making Sense of Your Conventional Loan Estimate</h4>
                <ul className="space-y-3 text-muted-foreground text-sm">
                  <li>
                    <strong>Evaluate PMI impact:</strong> If PMI adds $150+/month, calculate how long until you reach 20% equity 
                    and compare total costs to an FHA loan.
                  </li>
                  <li>
                    <strong>Check conforming limits:</strong> If your loan exceeds $766,550, you'll need a 
                    <Link to="/jumbo-loan-calculator/" className="text-primary hover:underline"> jumbo loan</Link> with stricter requirements.
                  </li>
                  <li>
                    <strong>Compare loan terms:</strong> A 15-year loan has higher payments but saves thousands in interest. 
                    Use our <Link to="/" className="text-primary hover:underline">mortgage calculator</Link> to compare.
                  </li>
                  <li>
                    <strong>Verify affordability:</strong> Keep your housing payment under 28% of gross income. 
                    Use our <Link to="/house-affordability/" className="text-primary hover:underline">affordability calculator</Link> to check.
                  </li>
                </ul>
              </div>

              <h2 className="text-2xl font-display font-semibold mt-10 mb-4">Conventional vs. Government-Backed Loans</h2>
              <div className="overflow-x-auto not-prose">
                <table className="w-full text-sm border-collapse calculator-card">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="p-3 text-left text-foreground font-semibold">Feature</th>
                      <th className="p-3 text-left text-foreground font-semibold">Conventional</th>
                      <th className="p-3 text-left text-foreground font-semibold">FHA</th>
                      <th className="p-3 text-left text-foreground font-semibold">VA</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    <tr className="border-b border-border">
                      <td className="p-3">Min. Credit Score</td>
                      <td className="p-3">620+</td>
                      <td className="p-3">580+</td>
                      <td className="p-3">No VA minimum</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="p-3">Min. Down Payment</td>
                      <td className="p-3">3%</td>
                      <td className="p-3">3.5%</td>
                      <td className="p-3 text-accent font-semibold">0%</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="p-3">Mortgage Insurance</td>
                      <td className="p-3 text-accent font-semibold">PMI (removable)</td>
                      <td className="p-3">MIP (lifetime)</td>
                      <td className="p-3">Funding fee</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="p-3">Loan Limits (2024)</td>
                      <td className="p-3">$766,550*</td>
                      <td className="p-3">$498,257*</td>
                      <td className="p-3 text-accent font-semibold">No limit</td>
                    </tr>
                    <tr>
                      <td className="p-3">Property Types</td>
                      <td className="p-3 text-accent font-semibold">All types</td>
                      <td className="p-3">Primary only</td>
                      <td className="p-3">Primary only</td>
                    </tr>
                  </tbody>
                </table>
                <p className="text-xs text-muted-foreground mt-2">*Higher limits in high-cost areas</p>
              </div>

              <h2 className="text-2xl font-display font-semibold mt-10 mb-4">Frequently Asked Questions About Conventional Loans</h2>
              <div className="space-y-6 not-prose">
                <div className="calculator-card p-4">
                  <h4 className="font-semibold text-foreground mb-2">Can I get a conventional loan with a bankruptcy or foreclosure?</h4>
                  <p className="text-sm text-muted-foreground">
                    Yes, but waiting periods apply. After Chapter 7 bankruptcy: 4 years. After foreclosure: 7 years 
                    (or 3 years with extenuating circumstances). After Chapter 13 bankruptcy: 2 years from discharge.
                  </p>
                </div>
                <div className="calculator-card p-4">
                  <h4 className="font-semibold text-foreground mb-2">What's the difference between HomeReady and Home Possible?</h4>
                  <p className="text-sm text-muted-foreground">
                    Both are 3% down payment programs. HomeReady (Fannie Mae) allows income from non-borrower household members. 
                    Home Possible (Freddie Mac) has similar features. Both have income limits in most areas.
                  </p>
                </div>
                <div className="calculator-card p-4">
                  <h4 className="font-semibold text-foreground mb-2">Should I choose a 15-year or 30-year conventional loan?</h4>
                  <p className="text-sm text-muted-foreground">
                    15-year loans have lower rates and save significantly on interest but require higher monthly payments. 
                    30-year loans offer lower payments and more flexibility. Consider <Link to="/extra-mortgage-payments-calculator/" className="text-primary hover:underline">making extra payments</Link> on 
                    a 30-year loan for the best of both worlds.
                  </p>
                </div>
                <div className="calculator-card p-4">
                  <h4 className="font-semibold text-foreground mb-2">Can I use gift funds for my conventional loan down payment?</h4>
                  <p className="text-sm text-muted-foreground">
                    Yes, gift funds are allowed from family members, employers, or other approved sources. For down payments 
                    under 20%, you may need to contribute some of your own funds depending on the program.
                  </p>
                </div>
              </div>

              <div className="calculator-card p-6 mt-10 not-prose">
                <h4 className="font-display font-semibold text-lg mb-4">Official Resources & Citations</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <a href="https://singlefamily.fanniemae.com/originating-underwriting/mortgage-products" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      Fannie Mae Conventional Financing
                    </a> — Official guidelines and requirements
                  </li>
                  <li>
                    <a href="https://sf.freddiemac.com/working-with-us/origination-underwriting/mortgage-products" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      Freddie Mac Mortgage Products
                    </a> — Loan programs and eligibility
                  </li>
                  <li>
                    <a href="https://www.consumerfinance.gov/ask-cfpb/what-is-a-conventional-loan-en-117/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      Consumer Financial Protection Bureau (CFPB)
                    </a> — Consumer information on conventional loans
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

export default Conventional;
