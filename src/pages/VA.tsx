import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import VACalculator from "@/components/VACalculator";

const VA = () => {
  const canonicalUrl = "https://mortgagecalculation.net/va-loan-calculator/";

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
        name: "VA Loan",
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
        name: "What is a VA loan?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A VA loan is a mortgage guaranteed by the U.S. Department of Veterans Affairs (VA). These loans are available to eligible veterans, active-duty service members, National Guard and Reserve members, and surviving spouses. VA loans offer significant advantages including no down payment, no PMI, and competitive interest rates.",
        },
      },
      {
        "@type": "Question",
        name: "Who is exempt from the VA funding fee?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The following are exempt from the VA funding fee: Veterans receiving VA disability compensation for a service-connected disability (10% or higher), Veterans entitled to receive disability compensation but receiving retirement or active-duty pay, Surviving spouses of veterans who died in service or from service-connected disabilities, and Active-duty service members who provide evidence of a Purple Heart award.",
        },
      },
      {
        "@type": "Question",
        name: "Can I use a VA loan more than once?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, VA loan benefits can be used multiple times throughout your lifetime. You can restore your full entitlement by paying off your current VA loan and selling the property, or you may have remaining entitlement to use for a second VA loan while keeping your first home.",
        },
      },
      {
        "@type": "Question",
        name: "Is there a VA loan limit?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "For veterans with full entitlement, there is no VA loan limit as of 2020. However, if you have reduced entitlement (existing VA loan or previous default), county loan limits apply. The VA guarantees up to 25% of the loan amount, which determines maximum financing without a down payment.",
        },
      },
    ],
  };

  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "VA Loan Calculator",
    applicationCategory: "FinanceApplication",
    description:
      "Free VA loan calculator to estimate monthly payments with 0% down and no PMI, including VA funding fee calculations.",
    operatingSystem: "Any",
    url: canonicalUrl,
    featureList: [
      "Calculate VA loan payments with 0% down",
      "No private mortgage insurance (PMI)",
      "VA funding fee calculator",
      "First-time vs subsequent use rates",
      "Funding fee exemption options",
      "Compare VA vs conventional loans",
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
        <title>VA Loan Calculator | Military Home Loan Payment Estimator | Mortgage Calculation</title>
        <meta
          name="description"
          content="Calculate your VA loan payment with 0% down and no PMI. Estimate VA funding fees based on your service type and eligibility. Free VA mortgage calculator."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="VA Loan Calculator | Military Home Loan Payment Estimator" />
        <meta
          property="og:description"
          content="Calculate your VA loan payment with 0% down and no PMI. Estimate VA funding fees based on your eligibility."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="VA Loan Calculator" />
        <meta
          name="twitter:description"
          content="Calculate your VA home loan payment with 0% down payment and no mortgage insurance."
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
                VA Loan Calculator
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Calculate your VA home loan payment with 0% down payment and no private mortgage insurance. 
                VA loans offer exceptional benefits for eligible veterans, active-duty service members, and surviving spouses.
              </p>
            </header>

            <VACalculator />

            <section className="mt-12 prose prose-slate max-w-none">
              <h2 className="text-2xl font-display font-semibold mb-4">The Complete Guide to VA Home Loans in 2025</h2>
              <p className="text-muted-foreground leading-relaxed">
                A VA loan is a mortgage guaranteed by the <a href="https://www.va.gov/housing-assistance/home-loans/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">U.S. Department of Veterans Affairs</a>. 
                Originally created in 1944 as part of the GI Bill, VA loans have helped more than 25 million veterans and service members 
                achieve homeownership. These loans are available to eligible veterans, active-duty service members, National Guard and 
                Reserve members, and certain surviving spouses.
              </p>

              <h3 className="text-xl font-display font-semibold mt-8 mb-3">VA Loan Benefits at a Glance</h3>
              <div className="grid md:grid-cols-4 gap-4 not-prose">
                <div className="calculator-card p-4 text-center">
                  <p className="text-2xl font-bold text-primary mb-1">0%</p>
                  <p className="text-sm text-muted-foreground">Down Payment</p>
                </div>
                <div className="calculator-card p-4 text-center">
                  <p className="text-2xl font-bold text-primary mb-1">No PMI</p>
                  <p className="text-sm text-muted-foreground">Mortgage Insurance</p>
                </div>
                <div className="calculator-card p-4 text-center">
                  <p className="text-2xl font-bold text-primary mb-1">Lower</p>
                  <p className="text-sm text-muted-foreground">Interest Rates</p>
                </div>
                <div className="calculator-card p-4 text-center">
                  <p className="text-2xl font-bold text-primary mb-1">No Limit</p>
                  <p className="text-sm text-muted-foreground">Loan Amount*</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">*For veterans with full entitlement</p>

              <h2 className="text-2xl font-display font-semibold mt-10 mb-4">VA Loan Eligibility Requirements</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                According to the <a href="https://www.va.gov/housing-assistance/home-loans/eligibility/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">VA's official eligibility requirements</a>, 
                you may qualify for a VA loan if you meet one of these service criteria:
              </p>
              <div className="grid md:grid-cols-2 gap-6 not-prose">
                <div className="calculator-card p-4">
                  <h4 className="font-semibold text-foreground mb-2">Active Duty Service Members</h4>
                  <p className="text-sm text-muted-foreground">
                    Currently serving at least 90 continuous days, or completed the required service time based on when you served.
                  </p>
                </div>
                <div className="calculator-card p-4">
                  <h4 className="font-semibold text-foreground mb-2">Veterans</h4>
                  <p className="text-sm text-muted-foreground">
                    Served 90 days during wartime, 181 days during peacetime, or 6 years in the Reserves/National Guard.
                  </p>
                </div>
                <div className="calculator-card p-4">
                  <h4 className="font-semibold text-foreground mb-2">National Guard / Reserves</h4>
                  <p className="text-sm text-muted-foreground">
                    6 years of service in the Selected Reserve or National Guard, or 90 days of active federal service.
                  </p>
                </div>
                <div className="calculator-card p-4">
                  <h4 className="font-semibold text-foreground mb-2">Surviving Spouses</h4>
                  <p className="text-sm text-muted-foreground">
                    Unremarried surviving spouse of a veteran who died in service or from a service-connected disability.
                  </p>
                </div>
              </div>

              <h2 className="text-2xl font-display font-semibold mt-10 mb-4">VA Loan Pros and Cons</h2>
              <div className="not-prose grid gap-6 md:grid-cols-2">
                <div className="calculator-card p-4">
                  <h4 className="font-display font-semibold text-lg mb-3 text-accent">✓ Advantages of VA Loans</h4>
                  <ul className="space-y-2 text-muted-foreground text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-accent">✓</span>
                      <span>No down payment required—100% financing</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent">✓</span>
                      <span>No private mortgage insurance (PMI) ever</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent">✓</span>
                      <span>Lower interest rates than conventional or FHA loans</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent">✓</span>
                      <span>No loan limit for borrowers with full entitlement</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent">✓</span>
                      <span>More lenient credit requirements (no VA minimum)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent">✓</span>
                      <span>No prepayment penalty—pay off early without fees</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent">✓</span>
                      <span>Seller can pay up to 4% of closing costs</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent">✓</span>
                      <span>Benefit can be used multiple times</span>
                    </li>
                  </ul>
                </div>

                <div className="calculator-card p-4">
                  <h4 className="font-display font-semibold text-lg mb-3 text-primary">✗ Disadvantages of VA Loans</h4>
                  <ul className="space-y-2 text-muted-foreground text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-primary">✗</span>
                      <span>VA funding fee adds to loan cost (unless exempt)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">✗</span>
                      <span>Primary residence only—no investment properties</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">✗</span>
                      <span>Property must meet VA Minimum Property Requirements</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">✗</span>
                      <span>Some sellers prefer conventional offers</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">✗</span>
                      <span>Requires Certificate of Eligibility (COE)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">✗</span>
                      <span>Limited to eligible veterans and spouses</span>
                    </li>
                  </ul>
                </div>
              </div>

              <h2 className="text-2xl font-display font-semibold mt-10 mb-4">Understanding the VA Funding Fee</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The VA funding fee is a one-time payment that helps sustain the VA loan program so it remains available 
                for future veterans. The fee varies based on your military category, down payment amount, and whether 
                you've used a VA loan before:
              </p>
              
              <div className="overflow-x-auto not-prose">
                <table className="w-full text-sm border-collapse calculator-card">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="p-3 text-left text-foreground font-semibold">Down Payment</th>
                      <th className="p-3 text-left text-foreground font-semibold">First Use (Active)</th>
                      <th className="p-3 text-left text-foreground font-semibold">First Use (Reserves)</th>
                      <th className="p-3 text-left text-foreground font-semibold">Subsequent Use</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    <tr className="border-b border-border">
                      <td className="p-3">Less than 5%</td>
                      <td className="p-3">2.15%</td>
                      <td className="p-3">2.40%</td>
                      <td className="p-3">3.30%</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="p-3">5% - 9.99%</td>
                      <td className="p-3">1.50%</td>
                      <td className="p-3">1.50%</td>
                      <td className="p-3">1.50%</td>
                    </tr>
                    <tr>
                      <td className="p-3">10% or more</td>
                      <td className="p-3">1.25%</td>
                      <td className="p-3">1.25%</td>
                      <td className="p-3">1.25%</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="text-xl font-display font-semibold mt-8 mb-3">Who is Exempt from the VA Funding Fee?</h3>
              <p className="text-muted-foreground leading-relaxed mb-2">
                According to <a href="https://www.va.gov/housing-assistance/home-loans/funding-fee-and-closing-costs/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">VA guidelines</a>, 
                the following individuals are exempt from paying the funding fee:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Veterans receiving VA disability compensation for a service-connected disability (10% or higher)</li>
                <li>Veterans entitled to receive disability compensation but receiving retirement or active-duty pay</li>
                <li>Surviving spouses of veterans who died in service or from service-connected disabilities</li>
                <li>Active-duty service members who provide evidence of a Purple Heart award</li>
              </ul>

              <h2 className="text-2xl font-display font-semibold mt-10 mb-4">Who Is a VA Loan Best For?</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                VA loans are typically the best mortgage option for eligible borrowers. Consider a VA loan if you are:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li><strong>Active-duty military</strong> purchasing your first home or relocating for PCS</li>
                <li><strong>Veterans</strong> who want to leverage their earned benefit</li>
                <li><strong>Buyers with limited savings</strong> who benefit from 0% down payment</li>
                <li><strong>Those with service-connected disability</strong> who qualify for funding fee exemption</li>
                <li><strong>Borrowers with moderate credit</strong> who might not qualify for conventional loans</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                If you're eligible, a VA loan is almost always more advantageous than an <Link to="/fha-loan-calculator/" className="text-primary hover:underline">FHA loan</Link> or 
                <Link to="/conventional-mortgage-calculator/" className="text-primary hover:underline"> conventional mortgage</Link> due to 
                the combination of no down payment and no PMI.
              </p>

              <h2 className="text-2xl font-display font-semibold mt-10 mb-4">How to Interpret Your Calculator Results</h2>
              <div className="calculator-card p-6 not-prose">
                <h4 className="font-semibold text-foreground mb-4">Making Sense of Your VA Loan Estimate</h4>
                <ul className="space-y-3 text-muted-foreground text-sm">
                  <li>
                    <strong>Check funding fee exemption:</strong> If you have a service-connected disability rating, 
                    you may qualify for funding fee exemption—potentially saving thousands.
                  </li>
                  <li>
                    <strong>Compare to conventional:</strong> Even with the funding fee, VA loans often cost less than 
                    <Link to="/conventional-mortgage-calculator/" className="text-primary hover:underline"> conventional loans</Link> with 
                    PMI over the life of the loan.
                  </li>
                  <li>
                    <strong>Consider a down payment:</strong> While 0% down is available, putting 5-10% down reduces 
                    your funding fee and builds immediate equity.
                  </li>
                  <li>
                    <strong>Verify affordability:</strong> Use our <Link to="/house-affordability/" className="text-primary hover:underline">affordability calculator</Link> to 
                    ensure your payment fits comfortably within your BAH or civilian income.
                  </li>
                </ul>
              </div>

              <h2 className="text-2xl font-display font-semibold mt-10 mb-4">VA Loan vs. Other Loan Types</h2>
              <div className="overflow-x-auto not-prose">
                <table className="w-full text-sm border-collapse calculator-card">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="p-3 text-left text-foreground font-semibold">Feature</th>
                      <th className="p-3 text-left text-foreground font-semibold">VA Loan</th>
                      <th className="p-3 text-left text-foreground font-semibold">FHA Loan</th>
                      <th className="p-3 text-left text-foreground font-semibold">Conventional</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    <tr className="border-b border-border">
                      <td className="p-3">Min. Down Payment</td>
                      <td className="p-3 text-accent font-semibold">0%</td>
                      <td className="p-3">3.5%</td>
                      <td className="p-3">3%</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="p-3">Mortgage Insurance</td>
                      <td className="p-3 text-accent font-semibold">None</td>
                      <td className="p-3">MIP (lifetime)</td>
                      <td className="p-3">PMI until 20%</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="p-3">Upfront Fee</td>
                      <td className="p-3">Funding fee (waivable)</td>
                      <td className="p-3">1.75% UFMIP</td>
                      <td className="p-3">None</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="p-3">Credit Score Min.</td>
                      <td className="p-3">No VA minimum (lender varies)</td>
                      <td className="p-3">500-580</td>
                      <td className="p-3">620</td>
                    </tr>
                    <tr>
                      <td className="p-3">Loan Limit</td>
                      <td className="p-3 text-accent font-semibold">None (full entitlement)</td>
                      <td className="p-3">Area limits</td>
                      <td className="p-3">Conforming limits</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h2 className="text-2xl font-display font-semibold mt-10 mb-4">Frequently Asked Questions About VA Loans</h2>
              <div className="space-y-6 not-prose">
                <div className="calculator-card p-4">
                  <h4 className="font-semibold text-foreground mb-2">Can I use a VA loan for a second home?</h4>
                  <p className="text-sm text-muted-foreground">
                    VA loans are for primary residences only. However, you may use your VA benefit for a new primary residence 
                    while keeping a previous VA-financed home as a rental, subject to remaining entitlement limits.
                  </p>
                </div>
                <div className="calculator-card p-4">
                  <h4 className="font-semibold text-foreground mb-2">How do I get my Certificate of Eligibility (COE)?</h4>
                  <p className="text-sm text-muted-foreground">
                    You can obtain your COE through <a href="https://www.va.gov/housing-assistance/home-loans/how-to-request-coe/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">eBenefits</a>, 
                    through your lender (most can retrieve it instantly), or by mail using VA Form 26-1880.
                  </p>
                </div>
                <div className="calculator-card p-4">
                  <h4 className="font-semibold text-foreground mb-2">Can I refinance my VA loan?</h4>
                  <p className="text-sm text-muted-foreground">
                    Yes! The VA offers the Interest Rate Reduction Refinance Loan (IRRRL), also called a "streamline refinance," 
                    which has minimal documentation requirements. You can also do a <Link to="/cash-out-refinance-calculator/" className="text-primary hover:underline">cash-out refinance</Link> with 
                    a VA loan to access your home's equity.
                  </p>
                </div>
                <div className="calculator-card p-4">
                  <h4 className="font-semibold text-foreground mb-2">What if I'm buying with a non-veteran spouse?</h4>
                  <p className="text-sm text-muted-foreground">
                    You can still use a VA loan with a non-veteran co-borrower (spouse or otherwise), but their income can only 
                    be counted if they're on the loan. If they're not a spouse, a 12.5% down payment is typically required.
                  </p>
                </div>
              </div>

              <div className="calculator-card p-6 mt-10 not-prose">
                <h4 className="font-display font-semibold text-lg mb-4">Official Resources & Citations</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <a href="https://www.va.gov/housing-assistance/home-loans/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      VA Home Loans Official Site
                    </a> — Department of Veterans Affairs
                  </li>
                  <li>
                    <a href="https://www.consumerfinance.gov/owning-a-home/loan-options/#checks-group-va-loans" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      Consumer Financial Protection Bureau (CFPB)
                    </a> — VA loan consumer information
                  </li>
                  <li>
                    <a href="https://www.benefits.va.gov/homeloans/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      VA Benefits Home Loans Portal
                    </a> — Eligibility and benefit details
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

export default VA;
