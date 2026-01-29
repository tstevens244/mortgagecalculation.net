import { Helmet } from "react-helmet-async";
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
        item: "https://mortgagecalculation.net/fha-loan-calculator/",
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
        name: "What are the jumbo loan requirements?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Jumbo loan requirements typically include: Credit Score of 700-720+ (higher than conventional loans), Down Payment of 10-20% minimum (some lenders require up to 30%), DTI Ratio of 43% or lower (some require 36%), and Cash Reserves of 6-12 months of mortgage payments in liquid assets after closing.",
        },
      },
      {
        "@type": "Question",
        name: "What are the 2026 conforming loan limits?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "For 2026, the conforming loan limit is $832,750 for most U.S. counties (standard areas). In high-cost areas like Alaska, Hawaii, and select counties, the limit is $1,249,125. Loans above these amounts are considered jumbo loans.",
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

        <main className="flex-1 container py-8">
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
              <h2 className="text-2xl font-display font-semibold mb-4">What is a Jumbo Loan?</h2>
              <p className="text-muted-foreground leading-relaxed">
                A jumbo loan is a mortgage that exceeds the conforming loan limits set by the Federal Housing 
                Finance Agency (FHFA). Because these loans can't be purchased by Fannie Mae or Freddie Mac, 
                they're considered non-conforming loans and typically have stricter qualification requirements.
              </p>

              <h3 className="text-xl font-display font-semibold mt-8 mb-3">2026 Conforming Loan Limits</h3>
              <div className="grid md:grid-cols-2 gap-4 not-prose">
                <div className="calculator-card p-4 text-center">
                  <p className="text-sm text-muted-foreground mb-1">Standard Areas</p>
                  <p className="text-2xl font-bold text-primary">{formatCurrency(832750)}</p>
                  <p className="text-xs text-muted-foreground mt-1">Most U.S. counties</p>
                </div>
                <div className="calculator-card p-4 text-center">
                  <p className="text-sm text-muted-foreground mb-1">High-Cost Areas</p>
                  <p className="text-2xl font-bold text-primary">{formatCurrency(1249125)}</p>
                  <p className="text-xs text-muted-foreground mt-1">Alaska, Hawaii, and select counties</p>
                </div>
              </div>

              <h3 className="text-xl font-display font-semibold mt-8 mb-3">Jumbo Loan Requirements</h3>
              <div className="grid md:grid-cols-2 gap-6 not-prose">
                <div className="calculator-card p-4">
                  <h4 className="font-semibold text-foreground mb-2">Credit Score</h4>
                  <p className="text-sm text-muted-foreground">
                    Most lenders require a minimum credit score of 700-720 for jumbo loans, higher than conventional loans.
                  </p>
                </div>
                <div className="calculator-card p-4">
                  <h4 className="font-semibold text-foreground mb-2">Down Payment</h4>
                  <p className="text-sm text-muted-foreground">
                    Typically 10-20% minimum. Some lenders may require up to 30% for very large loan amounts.
                  </p>
                </div>
                <div className="calculator-card p-4">
                  <h4 className="font-semibold text-foreground mb-2">Debt-to-Income Ratio</h4>
                  <p className="text-sm text-muted-foreground">
                    Most lenders prefer a DTI of 43% or lower, with some requiring 36% or less.
                  </p>
                </div>
                <div className="calculator-card p-4">
                  <h4 className="font-semibold text-foreground mb-2">Cash Reserves</h4>
                  <p className="text-sm text-muted-foreground">
                    Lenders typically require 6-12 months of mortgage payments in liquid assets after closing.
                  </p>
                </div>
              </div>

              <h3 className="text-xl font-display font-semibold mt-8 mb-3">Jumbo Loan Advantages</h3>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>
                  <strong>Finance expensive properties:</strong> Purchase luxury homes or properties in high-cost 
                  markets with a single loan instead of multiple mortgages.
                </li>
                <li>
                  <strong>Competitive rates:</strong> Jumbo loan rates have become increasingly competitive with 
                  conforming loan rates in recent years.
                </li>
                <li>
                  <strong>No PMI with 20% down:</strong> Unlike FHA loans, jumbo loans typically don't require 
                  mortgage insurance with adequate down payment.
                </li>
                <li>
                  <strong>Various loan terms:</strong> Available in 10, 15, 20, and 30-year terms, as well as 
                  adjustable-rate options.
                </li>
              </ul>

              <h3 className="text-xl font-display font-semibold mt-8 mb-3">Jumbo vs. Conforming Loans</h3>
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
                      <td className="p-3">Above $832,750</td>
                      <td className="p-3">Up to $832,750</td>
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
                    <tr>
                      <td className="p-3">Cash Reserves</td>
                      <td className="p-3">6-12 months</td>
                      <td className="p-3">0-2 months</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="text-xl font-display font-semibold mt-8 mb-3">Tips for Getting a Jumbo Loan</h3>
              <p className="text-muted-foreground leading-relaxed">
                To improve your chances of jumbo loan approval: maintain excellent credit, reduce existing debt, 
                save for a larger down payment, document all income sources thoroughly, and shop multiple lenders 
                to compare rates and terms. Consider working with a mortgage broker who specializes in jumbo financing.
              </p>
            </section>
          </article>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Jumbo;
