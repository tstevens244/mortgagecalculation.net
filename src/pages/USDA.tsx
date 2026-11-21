import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TrustLine from "@/components/TrustLine";
import GuideContents from "@/components/GuideContents";
import RelatedCalculators from "@/components/RelatedCalculators";
import Breadcrumbs from "@/components/Breadcrumbs";
import USDACalculator from "@/components/USDACalculator";
import USDAQualifier from "@/components/USDAQualifier";
import { calculatorBreadcrumbSchema } from "@/lib/calculators";

const faqs = [
  {
    q: "What is a USDA Rural Development (RD) loan?",
    a: "A USDA loan, also called a Rural Development or RD loan, is a mortgage backed by the U.S. Department of Agriculture for low- to moderate-income buyers in eligible rural and suburban areas. The guaranteed program, offered through private lenders, requires no down payment.",
  },
  {
    q: "How much USDA loan do I qualify for?",
    a: "USDA guidelines generally cap your housing payment at 29% of gross monthly income and all debt payments at 41%. On a $72,000 household income with $400 a month of other debts, that's a payment of about $1,740 a month. Use the qualification calculator on this page with your own income, debts and local taxes.",
  },
  {
    q: "What are the income limits for USDA loans?",
    a: "Household income can't exceed 115% of the area median income. In most counties the 2026 limit is about $119,850 for a household of 1 to 4 people and $158,250 for 5 to 8, and it's higher in many high-cost counties. Income from everyone living in the home counts. Check your county with the USDA income eligibility lookup.",
  },
  {
    q: "What areas qualify for USDA loans?",
    a: "Rural areas and many small towns and suburbs, generally places with populations under 35,000. Much of the country qualifies, including areas you might not think of as rural. Check a specific address on the USDA property eligibility map.",
  },
  {
    q: "Are USDA loans only for first-time homebuyers?",
    a: "No. Repeat buyers qualify too, as long as the home will be your primary residence and you don't already own an adequate home nearby.",
  },
  {
    q: "Can I use a USDA loan for a manufactured home?",
    a: "Yes, if it's permanently affixed to a foundation, meets HUD standards and has at least 400 square feet of living space. Lenders apply extra rules, such as limits on the home's age.",
  },
  {
    q: "Can I build a new home with a USDA loan?",
    a: "Yes. The USDA single-close construction loan combines the land, construction and permanent mortgage into one loan through a USDA-approved lender.",
  },
  {
    q: "Can I refinance my USDA loan?",
    a: "Yes. The USDA Streamlined Assist refinance needs little documentation and no appraisal. You can also refinance into a conventional loan once you have about 20% equity, which ends the annual fee.",
  },
];

const USDA = () => {
  const canonicalUrl = "https://mortgagecalculation.net/usda-loan-calculator/";

  const breadcrumbSchema = calculatorBreadcrumbSchema("/usda-loan-calculator/");

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "USDA Loan Calculator",
    applicationCategory: "FinanceApplication",
    description:
      "Free USDA loan calculator to estimate monthly payments with 0% down, including upfront and annual guarantee fees.",
    operatingSystem: "Any",
    url: canonicalUrl,
    featureList: [
      "Calculate USDA loan payments with 0% down",
      "Include upfront guarantee fee (1%)",
      "Calculate annual guarantee fee (0.35%)",
      "Rural area eligibility information",
      "How much USDA loan you qualify for (29% / 41% guidelines)",
      "Income limit guidelines",
      "Compare USDA vs FHA vs conventional",
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
        <title>USDA Loan Calculator: Rural Development Payment & Qualifying</title>
        <meta
          name="description"
          content="Free USDA Rural Development (RD) loan calculator: your monthly payment with 0% down and guarantee fees, how much USDA loan you qualify for, and 2026 income limits."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="USDA Rural Development Loan Calculator" />
        <meta
          property="og:description"
          content="Calculate your USDA loan payment with 0% down. See how USDA guarantee fees affect your monthly payment."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="USDA Loan Calculator" />
        <meta
          name="twitter:description"
          content="Calculate your USDA rural home loan payment with 0% down payment."
        />
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(webAppSchema)}</script>
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main id="main-content" className="flex-1 container py-8 sm:py-12">
          <article>
            <header className="page-header">
              <Breadcrumbs />
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-foreground mb-4">
                USDA Loan Calculator
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Estimate your USDA Rural Development (RD) home loan payment with 0% down, including the guarantee
                fees, and{" "}
                <a href="#usda-qualify" className="text-primary underline-offset-2 hover:underline">
                  see how much you qualify for
                </a>
                .
              </p>
              <TrustLine />
            </header>

            <USDACalculator />

            <USDAQualifier />


            <RelatedCalculators />

            <GuideContents />
            <section className="page-section guide">
              <h2 className="text-2xl font-display font-semibold mb-4">The Complete Guide to USDA Loans</h2>
              <p className="text-muted-foreground leading-relaxed">
                A USDA loan (also called a Rural Development or RD loan) is a government-backed mortgage offered 
                by the <a href="https://www.rd.usda.gov/programs-services/single-family-housing-programs/single-family-housing-guaranteed-loan-program" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">United States Department of Agriculture</a>. 
                Created to promote homeownership in rural America, USDA loans offer an incredible benefit: 0% down payment 
                for eligible borrowers in qualifying areas. Despite the name, you don't need to live on a farm—many 
                suburban communities qualify.
              </p>

              <h3 className="text-xl font-display font-semibold mt-8 mb-3">Key USDA Loan Benefits</h3>
              <div className="grid md:grid-cols-4 gap-4 not-prose">
                <div className="calculator-card p-4 text-center">
                  <p className="text-2xl font-bold text-primary mb-1">0%</p>
                  <p className="text-sm text-muted-foreground">Down Payment</p>
                </div>
                <div className="calculator-card p-4 text-center">
                  <p className="text-2xl font-bold text-primary mb-1">0.35%</p>
                  <p className="text-sm text-muted-foreground">Annual Fee</p>
                </div>
                <div className="calculator-card p-4 text-center">
                  <p className="text-2xl font-bold text-primary mb-1">Low</p>
                  <p className="text-sm text-muted-foreground">Interest Rates</p>
                </div>
                <div className="calculator-card p-4 text-center">
                  <p className="text-2xl font-bold text-primary mb-1">97%</p>
                  <p className="text-sm text-muted-foreground">U.S. Land Eligible</p>
                </div>
              </div>

              <h2 className="text-2xl font-display font-semibold mt-10 mb-4">USDA Loan Eligibility Requirements</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                According to <a href="https://www.rd.usda.gov/programs-services/single-family-housing-programs" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">USDA Rural Development guidelines</a>, 
                eligibility is based on three main factors:
              </p>
              <div className="grid md:grid-cols-2 gap-6 not-prose">
                <div className="calculator-card p-4">
                  <h3 className="font-semibold text-foreground mb-2 text-base font-sans">Location Eligibility</h3>
                  <p className="text-sm text-muted-foreground">
                    Property must be in an eligible rural area (populations generally under 35,000). Use the 
                    <a href="https://eligibility.sc.egov.usda.gov/eligibility/welcomeAction.do?pageAction=sfp" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline"> USDA eligibility map</a> to 
                    check specific addresses.
                  </p>
                </div>
                <div className="calculator-card p-4">
                  <h3 className="font-semibold text-foreground mb-2 text-base font-sans">Income Limits</h3>
                  <p className="text-sm text-muted-foreground">
                    Household income cannot exceed 115% of area median income (AMI). Limits vary by location and 
                    family size. Check <a href="https://eligibility.sc.egov.usda.gov/eligibility/incomeEligibilityAction.do" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">USDA income limits</a> for 
                    your area.
                  </p>
                </div>
                <div className="calculator-card p-4">
                  <h3 className="font-semibold text-foreground mb-2 text-base font-sans">Credit Score</h3>
                  <p className="text-sm text-muted-foreground">
                    Most lenders require 640+ for automated approval (GUS). Scores below 640 may qualify with 
                    manual underwriting. USDA has no official minimum score.
                  </p>
                </div>
                <div className="calculator-card p-4">
                  <h3 className="font-semibold text-foreground mb-2 text-base font-sans">Primary Residence</h3>
                  <p className="text-sm text-muted-foreground">
                    Must be your primary residence. Cannot own another adequate home at time of purchase. 
                    No investment properties or vacation homes.
                  </p>
                </div>
                <div className="calculator-card p-4">
                  <h3 className="font-semibold text-foreground mb-2 text-base font-sans">Debt-to-Income Ratio</h3>
                  <p className="text-sm text-muted-foreground">
                    Standard limits: 29% front-end (housing), 41% back-end (total debt). Higher ratios may 
                    be approved with compensating factors.
                  </p>
                </div>
                <div className="calculator-card p-4">
                  <h3 className="font-semibold text-foreground mb-2 text-base font-sans">U.S. Citizenship</h3>
                  <p className="text-sm text-muted-foreground">
                    Must be a U.S. citizen, U.S. non-citizen national, or qualified alien. Permanent 
                    residents with a Green Card typically qualify.
                  </p>
                </div>
              </div>

              <h2 className="text-2xl font-display font-semibold mt-10 mb-4">USDA Loan Pros and Cons</h2>
              <div className="not-prose grid gap-6 md:grid-cols-2">
                <div className="calculator-card p-4">
                  <h3 className="font-display font-semibold text-lg mb-3 text-accent-strong">✓ Advantages of USDA Loans</h3>
                  <ul className="space-y-2 text-muted-foreground text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-accent-strong">✓</span>
                      <span>No down payment required—100% financing</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent-strong">✓</span>
                      <span>Lower annual fee (0.35%) than FHA MIP (0.55%+)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent-strong">✓</span>
                      <span>Competitive interest rates, often below market</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent-strong">✓</span>
                      <span>No loan limit—borrow based on ability to repay</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent-strong">✓</span>
                      <span>Flexible credit requirements with manual underwriting</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent-strong">✓</span>
                      <span>Seller can pay up to 6% of closing costs</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent-strong">✓</span>
                      <span>Available to repeat homebuyers, not just first-time</span>
                    </li>
                  </ul>
                </div>

                <div className="calculator-card p-4">
                  <h3 className="font-display font-semibold text-lg mb-3 text-primary">✗ Disadvantages of USDA Loans</h3>
                  <ul className="space-y-2 text-muted-foreground text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-primary">✗</span>
                      <span>Geographic restrictions—rural/suburban areas only</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">✗</span>
                      <span>Income limits may exclude higher earners</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">✗</span>
                      <span>1% upfront guarantee fee adds to loan balance</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">✗</span>
                      <span>Primary residence only—no investment properties</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">✗</span>
                      <span>Guarantee fee required for life of loan</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">✗</span>
                      <span>Longer processing times than conventional loans</span>
                    </li>
                  </ul>
                </div>
              </div>

              <h2 className="text-2xl font-display font-semibold mt-10 mb-4">Understanding USDA Guarantee Fees</h2>
              <p className="text-muted-foreground leading-relaxed">
                USDA loans require two types of guarantee fees instead of traditional mortgage insurance:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>
                  <strong>Upfront Guarantee Fee:</strong> 1% of the loan amount, typically financed into the loan. 
                  On a $250,000 loan, this adds $2,500 to your balance.
                </li>
                <li>
                  <strong>Annual Guarantee Fee:</strong> 0.35% of the remaining loan balance, paid monthly. 
                  This is significantly lower than FHA's annual MIP (0.55%+), saving you money each month.
                </li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Unlike <Link to="/fha-loan-calculator/" className="text-primary hover:underline">FHA loans</Link> where 
                MIP remains for the life of the loan, USDA's lower fee rates make it one of the most affordable 
                government-backed loan options.
              </p>

              <h2 className="text-2xl font-display font-semibold mt-10 mb-4">Who Is a USDA Loan Best For?</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                USDA loans are ideal for borrowers who:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li><strong>Live in or want to move to rural/suburban areas</strong></li>
                <li><strong>Have moderate income</strong> within program limits</li>
                <li><strong>Have limited savings</strong> for a down payment</li>
                <li><strong>Want lower mortgage insurance costs</strong> than FHA</li>
                <li><strong>Aren't eligible for VA loans</strong> but want 0% down</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                If you're a veteran, <Link to="/va-loan-calculator/" className="text-primary hover:underline">VA loans</Link> offer 
                similar 0% down benefits without geographic restrictions. For urban buyers, consider 
                <Link to="/fha-loan-calculator/" className="text-primary hover:underline"> FHA</Link> or 
                <Link to="/conventional-mortgage-calculator/" className="text-primary hover:underline"> conventional</Link> options.
              </p>

              <h2 className="text-2xl font-display font-semibold mt-10 mb-4">How to Interpret Your Calculator Results</h2>
              <div className="calculator-card p-6 not-prose">
                <h3 className="font-semibold text-foreground mb-4 text-base font-sans">Making Sense of Your USDA Loan Estimate</h3>
                <ul className="space-y-3 text-muted-foreground text-sm">
                  <li>
                    <strong>Verify location eligibility:</strong> Before getting excited about your payment estimate, 
                    confirm the property qualifies using the <a href="https://eligibility.sc.egov.usda.gov/eligibility/welcomeAction.do?pageAction=sfp" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">USDA eligibility map</a>.
                  </li>
                  <li>
                    <strong>Check income limits:</strong> Your household income must be under 115% of AMI. 
                    This includes income from all adults in the household, not just borrowers.
                  </li>
                  <li>
                    <strong>Compare to FHA:</strong> If you're over income limits for USDA, an 
                    <Link to="/fha-loan-calculator/" className="text-primary hover:underline"> FHA loan</Link> with 
                    3.5% down may be your next best option.
                  </li>
                  <li>
                    <strong>Factor in all costs:</strong> Your payment estimate includes guarantee fees, but verify 
                    property taxes and insurance are accurate for your specific county.
                  </li>
                </ul>
              </div>

              <h2 className="text-2xl font-display font-semibold mt-10 mb-4">USDA vs. Other Zero-Down Options</h2>
              <div className="overflow-x-auto not-prose">
                <table className="w-full text-sm border-collapse calculator-card">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="p-3 text-left text-foreground font-semibold">Feature</th>
                      <th className="p-3 text-left text-foreground font-semibold">USDA</th>
                      <th className="p-3 text-left text-foreground font-semibold">VA</th>
                      <th className="p-3 text-left text-foreground font-semibold">FHA</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    <tr className="border-b border-border">
                      <td className="p-3">Down Payment</td>
                      <td className="p-3 text-accent-strong font-semibold">0%</td>
                      <td className="p-3 text-accent-strong font-semibold">0%</td>
                      <td className="p-3">3.5%</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="p-3">Upfront Fee</td>
                      <td className="p-3">1%</td>
                      <td className="p-3">2.15-3.30%</td>
                      <td className="p-3">1.75%</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="p-3">Annual Fee</td>
                      <td className="p-3 text-accent-strong font-semibold">0.35%</td>
                      <td className="p-3 text-accent-strong font-semibold">None</td>
                      <td className="p-3">0.55%+</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="p-3">Location</td>
                      <td className="p-3">Rural/Suburban</td>
                      <td className="p-3 text-accent-strong font-semibold">Any</td>
                      <td className="p-3 text-accent-strong font-semibold">Any</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="p-3">Income Limits</td>
                      <td className="p-3">Yes (115% AMI)</td>
                      <td className="p-3 text-accent-strong font-semibold">None</td>
                      <td className="p-3 text-accent-strong font-semibold">None</td>
                    </tr>
                    <tr>
                      <td className="p-3">Eligibility</td>
                      <td className="p-3">All buyers</td>
                      <td className="p-3">Veterans only</td>
                      <td className="p-3">All buyers</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h2 className="text-2xl font-display font-semibold mt-10 mb-4">Frequently Asked Questions About USDA Loans</h2>
              <div className="space-y-3 not-prose">
                {faqs.map((f) => (
                  <details key={f.q} className="group calculator-card overflow-hidden" data-faq>
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4 hover:bg-secondary/40 [&::-webkit-details-marker]:hidden">
                      <h3 className="text-base font-semibold text-foreground font-sans">{f.q}</h3>
                      <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" aria-hidden="true" />
                    </summary>
                    <p className="px-4 pb-4 text-sm text-muted-foreground">{f.a}</p>
                  </details>
                ))}
              </div>

              <div className="calculator-card p-6 mt-10 not-prose">
                <h3 className="font-display font-semibold text-lg mb-4">Official Resources & Citations</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <a href="https://www.rd.usda.gov/programs-services/single-family-housing-programs/single-family-housing-guaranteed-loan-program" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      USDA Single Family Housing Guaranteed Loan Program
                    </a> — Official program information
                  </li>
                  <li>
                    <a href="https://eligibility.sc.egov.usda.gov/eligibility/welcomeAction.do?pageAction=sfp" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      USDA Property Eligibility Map
                    </a> — Check if an address qualifies
                  </li>
                  <li>
                    <a href="https://www.consumerfinance.gov/owning-a-home/loan-options/#checks-group-usda-loans" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      Consumer Financial Protection Bureau (CFPB)
                    </a> — USDA loan consumer information
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

export default USDA;
