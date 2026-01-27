import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import VACalculator from "@/components/VACalculator";

const VA = () => {
  const canonicalUrl = "https://mortgagecalculation.net/va-loan-calculator";

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
        name: "What are the VA loan eligibility requirements?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "VA loan eligibility includes: Active Duty (currently serving at least 90 continuous days), Veterans (served 90 days during wartime, 181 days during peacetime, or 6 years in the Reserves/Guard), National Guard/Reserves (6 years of service or 90 days of active service), and Surviving Spouses (unremarried surviving spouse of a veteran who died in service or from a service-connected disability).",
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

        <main className="flex-1 container py-8">
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
              <h2 className="text-2xl font-display font-semibold mb-4">What is a VA Loan?</h2>
              <p className="text-muted-foreground leading-relaxed">
                A VA loan is a mortgage guaranteed by the U.S. Department of Veterans Affairs (VA). These loans 
                are available to eligible veterans, active-duty service members, National Guard and Reserve members, 
                and surviving spouses. VA loans offer significant advantages including no down payment, no PMI, 
                and competitive interest rates.
              </p>

              <h3 className="text-xl font-display font-semibold mt-8 mb-3">VA Loan Benefits</h3>
              <div className="grid md:grid-cols-3 gap-4 not-prose">
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
              </div>

              <h3 className="text-xl font-display font-semibold mt-8 mb-3">VA Funding Fee Rates (2024)</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The VA funding fee is a one-time payment that helps sustain the VA loan program. The rate depends on 
                your military category, down payment amount, and whether you've used a VA loan before:
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

              <h3 className="text-xl font-display font-semibold mt-8 mb-3">Who is Exempt from the Funding Fee?</h3>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Veterans receiving VA disability compensation for a service-connected disability (10% or higher)</li>
                <li>Veterans entitled to receive disability compensation but receiving retirement or active-duty pay</li>
                <li>Surviving spouses of veterans who died in service or from service-connected disabilities</li>
                <li>Active-duty service members who provide evidence of a Purple Heart award</li>
              </ul>

              <h3 className="text-xl font-display font-semibold mt-8 mb-3">VA Loan Eligibility Requirements</h3>
              <div className="grid md:grid-cols-2 gap-6 not-prose">
                <div className="calculator-card p-4">
                  <h4 className="font-semibold text-foreground mb-2">Active Duty</h4>
                  <p className="text-sm text-muted-foreground">
                    Currently serving at least 90 continuous days, or have completed the required service time.
                  </p>
                </div>
                <div className="calculator-card p-4">
                  <h4 className="font-semibold text-foreground mb-2">Veterans</h4>
                  <p className="text-sm text-muted-foreground">
                    Served 90 days during wartime, 181 days during peacetime, or 6 years in the Reserves/Guard.
                  </p>
                </div>
                <div className="calculator-card p-4">
                  <h4 className="font-semibold text-foreground mb-2">National Guard / Reserves</h4>
                  <p className="text-sm text-muted-foreground">
                    6 years of service in the Selected Reserve or National Guard, or 90 days of active service.
                  </p>
                </div>
                <div className="calculator-card p-4">
                  <h4 className="font-semibold text-foreground mb-2">Surviving Spouses</h4>
                  <p className="text-sm text-muted-foreground">
                    Unremarried surviving spouse of a veteran who died in service or from a service-connected disability.
                  </p>
                </div>
              </div>

              <h3 className="text-xl font-display font-semibold mt-8 mb-3">VA Loan vs. Conventional Loan</h3>
              <p className="text-muted-foreground leading-relaxed">
                VA loans offer significant savings compared to conventional mortgages. With no down payment required 
                and no monthly PMI, eligible borrowers can save thousands of dollars over the life of the loan. 
                VA loans also typically offer lower interest rates and have more flexible credit requirements.
              </p>
            </section>
          </article>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default VA;
