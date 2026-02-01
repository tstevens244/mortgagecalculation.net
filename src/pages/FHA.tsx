import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FHACalculator from "@/components/FHACalculator";

const FHA = () => {
  const canonicalUrl = "https://mortgagecalculation.net/fha-loan-calculator/";

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
        name: "FHA Loan",
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
        name: "What is an FHA loan?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "An FHA loan is a mortgage insured by the Federal Housing Administration (FHA), a government agency within the U.S. Department of Housing and Urban Development. FHA loans are popular among first-time homebuyers because they offer more flexible qualification requirements and lower down payment options compared to conventional mortgages.",
        },
      },
      {
        "@type": "Question",
        name: "What is FHA Mortgage Insurance Premium (MIP)?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "FHA loans require two types of mortgage insurance premiums (MIP): Upfront MIP (UFMIP) at 1.75% of the base loan amount (typically financed into the loan), and Annual MIP ranging from 0.15% to 0.75% of the loan amount paid monthly. For most 30-year FHA loans with less than 10% down, MIP is required for the life of the loan.",
        },
      },
      {
        "@type": "Question",
        name: "What credit score do I need for an FHA loan?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The minimum credit score for an FHA loan is 500. With a score of 580 or higher, you qualify for the 3.5% down payment option. Scores between 500-579 require a 10% down payment. Most lenders prefer scores of 620 or higher for easier approval.",
        },
      },
      {
        "@type": "Question",
        name: "Can I get an FHA loan if I've had a bankruptcy?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, you can qualify for an FHA loan after bankruptcy. For Chapter 7 bankruptcy, you must wait 2 years from the discharge date. For Chapter 13 bankruptcy, you may qualify after 1 year of on-time payments with court approval, or immediately after discharge with a good payment history.",
        },
      },
    ],
  };

  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "FHA Loan Calculator",
    applicationCategory: "FinanceApplication",
    description:
      "Free FHA loan calculator to estimate monthly payments including upfront MIP, annual MIP, property tax, and insurance.",
    operatingSystem: "Any",
    url: canonicalUrl,
    featureList: [
      "Calculate FHA loan payments",
      "Include upfront MIP (1.75%)",
      "Calculate annual MIP costs",
      "Low 3.5% down payment option",
      "Compare FHA vs conventional loans",
      "View complete amortization schedule",
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
        <title>FHA Loan Calculator | Estimate FHA Mortgage Payments | Mortgage Calculation</title>
        <meta
          name="description"
          content="Calculate your FHA loan payment including upfront and annual MIP. See how FHA mortgage insurance affects your monthly payment with our free FHA calculator."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="FHA Loan Calculator | Estimate FHA Mortgage Payments" />
        <meta
          property="og:description"
          content="Calculate your FHA loan payment including upfront and annual MIP. See how FHA mortgage insurance affects your monthly payment."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="FHA Loan Calculator" />
        <meta
          name="twitter:description"
          content="Calculate your FHA loan payment including upfront and annual mortgage insurance premiums."
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
                FHA Loan Calculator
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Calculate your FHA mortgage payment including upfront and annual mortgage insurance premiums (MIP). 
                FHA loans offer lower down payment options for qualified borrowers.
              </p>
            </header>

            <FHACalculator />

            <section className="mt-12 prose prose-slate max-w-none">
              <h2 className="text-2xl font-display font-semibold mb-4">The Complete Guide to FHA Loans in 2025</h2>
              <p className="text-muted-foreground leading-relaxed">
                An FHA loan is a mortgage insured by the <a href="https://www.hud.gov/program_offices/housing/fhahistory" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Federal Housing Administration (FHA)</a>, 
                a government agency within the U.S. Department of Housing and Urban Development. Created in 1934 during the Great Depression, 
                FHA loans were designed to stimulate the housing market by making homeownership more accessible. Today, FHA loans remain 
                popular among first-time homebuyers because they offer more flexible qualification requirements and lower down payment options 
                compared to <Link to="/conventional-mortgage-calculator/" className="text-primary hover:underline">conventional mortgages</Link>.
              </p>

              <h2 className="text-2xl font-display font-semibold mt-10 mb-4">FHA Loan Eligibility Requirements</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                According to <a href="https://www.consumerfinance.gov/ask-cfpb/what-is-an-fha-loan-en-1963/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Consumer Financial Protection Bureau guidelines</a>, 
                FHA loans have specific eligibility criteria:
              </p>
              <div className="grid md:grid-cols-2 gap-6 not-prose">
                <div className="calculator-card p-4">
                  <h4 className="font-semibold text-foreground mb-2">Credit Score Requirements</h4>
                  <p className="text-sm text-muted-foreground">
                    Minimum 580 for 3.5% down payment. Scores 500-579 require 10% down. Most lenders prefer 620+ for easier approval.
                  </p>
                </div>
                <div className="calculator-card p-4">
                  <h4 className="font-semibold text-foreground mb-2">Down Payment</h4>
                  <p className="text-sm text-muted-foreground">
                    As low as 3.5% with credit score of 580+. Gift funds from family are allowed for the entire down payment amount.
                  </p>
                </div>
                <div className="calculator-card p-4">
                  <h4 className="font-semibold text-foreground mb-2">Debt-to-Income Ratio (DTI)</h4>
                  <p className="text-sm text-muted-foreground">
                    Front-end ratio up to 31%, back-end up to 43%. Some lenders may accept up to 50% with compensating factors.
                  </p>
                </div>
                <div className="calculator-card p-4">
                  <h4 className="font-semibold text-foreground mb-2">Employment & Income</h4>
                  <p className="text-sm text-muted-foreground">
                    Two years of steady employment history. Self-employed borrowers need 2 years of tax returns showing consistent income.
                  </p>
                </div>
                <div className="calculator-card p-4">
                  <h4 className="font-semibold text-foreground mb-2">Property Requirements</h4>
                  <p className="text-sm text-muted-foreground">
                    Must be your primary residence. Property must pass FHA appraisal for safety, security, and soundness standards.
                  </p>
                </div>
                <div className="calculator-card p-4">
                  <h4 className="font-semibold text-foreground mb-2">Bankruptcy & Foreclosure</h4>
                  <p className="text-sm text-muted-foreground">
                    2 years after Chapter 7 bankruptcy, 3 years after foreclosure. Chapter 13 may qualify after 1 year of on-time payments.
                  </p>
                </div>
              </div>

              <h2 className="text-2xl font-display font-semibold mt-10 mb-4">FHA Loan Pros and Cons</h2>
              <div className="not-prose grid gap-6 md:grid-cols-2">
                <div className="calculator-card p-4">
                  <h4 className="font-display font-semibold text-lg mb-3 text-accent">✓ Advantages of FHA Loans</h4>
                  <ul className="space-y-2 text-muted-foreground text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-accent">✓</span>
                      <span>Low 3.5% down payment makes homeownership more accessible</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent">✓</span>
                      <span>Credit scores as low as 500 accepted (with 10% down)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent">✓</span>
                      <span>Higher DTI ratios allowed than conventional loans</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent">✓</span>
                      <span>Gift funds can cover entire down payment</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent">✓</span>
                      <span>Competitive interest rates, often lower than conventional</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent">✓</span>
                      <span>Shorter waiting period after bankruptcy or foreclosure</span>
                    </li>
                  </ul>
                </div>

                <div className="calculator-card p-4">
                  <h4 className="font-display font-semibold text-lg mb-3 text-primary">✗ Disadvantages of FHA Loans</h4>
                  <ul className="space-y-2 text-muted-foreground text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-primary">✗</span>
                      <span>MIP required for life of loan (with less than 10% down)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">✗</span>
                      <span>1.75% upfront MIP adds to loan balance</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">✗</span>
                      <span>Loan limits may be restrictive in high-cost areas</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">✗</span>
                      <span>Primary residence only—no investment properties</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">✗</span>
                      <span>Stricter property standards may limit home choices</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">✗</span>
                      <span>Sellers may view FHA offers less favorably than conventional</span>
                    </li>
                  </ul>
                </div>
              </div>

              <h2 className="text-2xl font-display font-semibold mt-10 mb-4">Understanding FHA Mortgage Insurance (MIP)</h2>
              <p className="text-muted-foreground leading-relaxed">
                FHA loans require two types of mortgage insurance premiums (MIP) to protect lenders against default:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>
                  <strong>Upfront MIP (UFMIP):</strong> 1.75% of the base loan amount, typically financed into the loan. 
                  On a $300,000 loan, this adds $5,250 to your loan balance.
                </li>
                <li>
                  <strong>Annual MIP:</strong> Ranges from 0.15% to 0.75% of the loan amount, paid monthly. For most 
                  30-year FHA loans with less than 10% down, MIP is required for the life of the loan. With 10% or more down, 
                  MIP can be removed after 11 years.
                </li>
              </ul>

              <h2 className="text-2xl font-display font-semibold mt-10 mb-4">Who Is an FHA Loan Best For?</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                FHA loans are ideal for specific types of borrowers. Consider an FHA loan if you are:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li><strong>First-time homebuyers</strong> with limited savings for a down payment</li>
                <li><strong>Borrowers with credit challenges</strong> who may not qualify for conventional financing</li>
                <li><strong>Recent bankruptcy or foreclosure survivors</strong> who meet waiting period requirements</li>
                <li><strong>Buyers with high DTI ratios</strong> from student loans or other debts</li>
                <li><strong>Those receiving gift funds</strong> for their entire down payment</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                However, if you have a credit score above 700 and can put 10-20% down, compare FHA to a 
                <Link to="/conventional-mortgage-calculator/" className="text-primary hover:underline"> conventional loan</Link>—you 
                may save money by avoiding lifetime MIP.
              </p>

              <h2 className="text-2xl font-display font-semibold mt-10 mb-4">How to Interpret Your Calculator Results</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Your FHA calculator results should guide your decision-making in several ways:
              </p>
              <div className="calculator-card p-6 not-prose">
                <h4 className="font-semibold text-foreground mb-4">Making Sense of Your FHA Payment Estimate</h4>
                <ul className="space-y-3 text-muted-foreground text-sm">
                  <li>
                    <strong>Compare MIP costs:</strong> If your annual MIP adds $150+ monthly, calculate whether 
                    <Link to="/conventional-mortgage-calculator/" className="text-primary hover:underline"> conventional PMI</Link> (which can be removed) 
                    saves money long-term.
                  </li>
                  <li>
                    <strong>Check affordability:</strong> Your total PITI payment should not exceed 31% of gross monthly income. 
                    Use our <Link to="/house-affordability/" className="text-primary hover:underline">affordability calculator</Link> to verify.
                  </li>
                  <li>
                    <strong>Consider the break-even:</strong> If you plan to stay less than 5 years, lifetime MIP costs 
                    may not justify the lower down payment benefit.
                  </li>
                  <li>
                    <strong>Factor in closing costs:</strong> FHA allows sellers to contribute up to 6% toward closing costs. 
                    This can reduce your upfront cash needs significantly.
                  </li>
                </ul>
              </div>

              <h2 className="text-2xl font-display font-semibold mt-10 mb-4">FHA Loan Limits by Area (2026)</h2>
              <p className="text-muted-foreground leading-relaxed">
                According to <a href="https://www.hud.gov/program_offices/housing/sfh/lender/origination/mortgage_limits" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">HUD's official loan limits</a>, 
                FHA loan limits vary by county:
              </p>
              <div className="grid md:grid-cols-2 gap-4 not-prose mt-4">
                <div className="calculator-card p-4 text-center">
                  <p className="text-sm text-muted-foreground mb-1">Low-Cost Areas (Floor)</p>
                  <p className="text-2xl font-bold text-primary">$541,287</p>
                  <p className="text-xs text-muted-foreground mt-1">Single-family home</p>
                </div>
                <div className="calculator-card p-4 text-center">
                  <p className="text-sm text-muted-foreground mb-1">High-Cost Areas (Ceiling)</p>
                  <p className="text-2xl font-bold text-primary">$1,249,125</p>
                  <p className="text-xs text-muted-foreground mt-1">Alaska, Hawaii, select metros</p>
                </div>
              </div>

              <h2 className="text-2xl font-display font-semibold mt-10 mb-4">FHA vs. Other Loan Types</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Not sure which loan is right for you? Here's how FHA compares to other popular options:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>
                  <strong>FHA vs. <Link to="/conventional-mortgage-calculator/" className="text-primary hover:underline">Conventional</Link>:</strong> FHA 
                  has easier qualification but lifetime MIP. Conventional requires higher credit but PMI is removable.
                </li>
                <li>
                  <strong>FHA vs. <Link to="/va-loan-calculator/" className="text-primary hover:underline">VA Loan</Link>:</strong> If 
                  you're a veteran, VA loans offer 0% down and no mortgage insurance—often the better choice.
                </li>
                <li>
                  <strong>FHA vs. <Link to="/usda-loan-calculator/" className="text-primary hover:underline">USDA Loan</Link>:</strong> For 
                  rural properties, USDA offers 0% down with lower fees than FHA.
                </li>
              </ul>

              <h2 className="text-2xl font-display font-semibold mt-10 mb-4">Frequently Asked Questions About FHA Loans</h2>
              <div className="space-y-6 not-prose">
                <div className="calculator-card p-4">
                  <h4 className="font-semibold text-foreground mb-2">Can I get an FHA loan for a fixer-upper?</h4>
                  <p className="text-sm text-muted-foreground">
                    Yes! The FHA 203(k) loan program allows you to finance both the purchase and renovation costs in a single mortgage. 
                    This is ideal for homes that don't meet FHA's minimum property standards in their current condition.
                  </p>
                </div>
                <div className="calculator-card p-4">
                  <h4 className="font-semibold text-foreground mb-2">How long do I have to live in an FHA home?</h4>
                  <p className="text-sm text-muted-foreground">
                    FHA requires you to occupy the property as your primary residence within 60 days of closing and live there 
                    for at least one year. After that, you can convert it to a rental property.
                  </p>
                </div>
                <div className="calculator-card p-4">
                  <h4 className="font-semibold text-foreground mb-2">Can I refinance out of an FHA loan later?</h4>
                  <p className="text-sm text-muted-foreground">
                    Absolutely. Many borrowers use an FHA loan to purchase their first home, then <Link to="/refinance-calculator/" className="text-primary hover:underline">refinance into a conventional loan</Link> once 
                    they've built 20% equity to eliminate mortgage insurance entirely.
                  </p>
                </div>
                <div className="calculator-card p-4">
                  <h4 className="font-semibold text-foreground mb-2">Are FHA closing costs higher than conventional?</h4>
                  <p className="text-sm text-muted-foreground">
                    FHA closing costs are comparable to conventional loans, typically 2-5% of the loan amount. The main difference 
                    is the 1.75% upfront MIP, which is usually financed into the loan rather than paid at closing.
                  </p>
                </div>
              </div>

              <div className="calculator-card p-6 mt-10 not-prose">
                <h4 className="font-display font-semibold text-lg mb-4">Official Resources & Citations</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <a href="https://www.hud.gov/program_offices/housing/sfh/fharesourcectr" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      HUD FHA Resource Center
                    </a> — Official FHA program information
                  </li>
                  <li>
                    <a href="https://www.consumerfinance.gov/ask-cfpb/what-is-an-fha-loan-en-112/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      Consumer Financial Protection Bureau (CFPB)
                    </a> — FHA loan overview and consumer protections
                  </li>
                  <li>
                    <a href="https://singlefamily.fanniemae.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      Fannie Mae Single Family
                    </a> — Loan comparison resources
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

export default FHA;
