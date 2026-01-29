import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FHACalculator from "@/components/FHACalculator";

const FHA = () => {
  const canonicalUrl = "https://mortgagecalculation.net/fha-loan-calculator";

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
        name: "What are FHA loan requirements?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "FHA loans require: Minimum 3.5% down with a credit score of 580 or higher (10% down for scores between 500-579), Minimum 500 credit score, total monthly debt payments should not exceed 43% of gross monthly income, and the home must be your primary residence meeting FHA minimum property standards.",
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

        <main className="flex-1 container py-8">
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
              <h2 className="text-2xl font-display font-semibold mb-4">What is an FHA Loan?</h2>
              <p className="text-muted-foreground leading-relaxed">
                An FHA loan is a mortgage insured by the Federal Housing Administration (FHA), a government agency 
                within the U.S. Department of Housing and Urban Development. FHA loans are popular among first-time 
                homebuyers because they offer more flexible qualification requirements and lower down payment options 
                compared to conventional mortgages.
              </p>

              <h3 className="text-xl font-display font-semibold mt-8 mb-3">FHA Loan Requirements</h3>
              <div className="grid md:grid-cols-2 gap-6 not-prose">
                <div className="calculator-card p-4">
                  <h4 className="font-semibold text-foreground mb-2">Down Payment</h4>
                  <p className="text-sm text-muted-foreground">
                    Minimum 3.5% down with a credit score of 580 or higher. 10% down required for scores between 500-579.
                  </p>
                </div>
                <div className="calculator-card p-4">
                  <h4 className="font-semibold text-foreground mb-2">Credit Score</h4>
                  <p className="text-sm text-muted-foreground">
                    Minimum 500 credit score required. Most lenders prefer 580+ for the 3.5% down payment option.
                  </p>
                </div>
                <div className="calculator-card p-4">
                  <h4 className="font-semibold text-foreground mb-2">Debt-to-Income Ratio</h4>
                  <p className="text-sm text-muted-foreground">
                    Generally, your total monthly debt payments should not exceed 43% of your gross monthly income.
                  </p>
                </div>
                <div className="calculator-card p-4">
                  <h4 className="font-semibold text-foreground mb-2">Property Requirements</h4>
                  <p className="text-sm text-muted-foreground">
                    The home must be your primary residence and meet FHA minimum property standards.
                  </p>
                </div>
              </div>

              <h3 className="text-xl font-display font-semibold mt-8 mb-3">Understanding FHA Mortgage Insurance (MIP)</h3>
              <p className="text-muted-foreground leading-relaxed">
                FHA loans require two types of mortgage insurance premiums (MIP):
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>
                  <strong>Upfront MIP (UFMIP):</strong> 1.75% of the base loan amount, typically financed into the loan.
                </li>
                <li>
                  <strong>Annual MIP:</strong> Ranges from 0.15% to 0.75% of the loan amount, paid monthly. For most 
                  30-year FHA loans with less than 10% down, MIP is required for the life of the loan.
                </li>
              </ul>

              <h3 className="text-xl font-display font-semibold mt-8 mb-3">FHA vs. Conventional Loans</h3>
              <p className="text-muted-foreground leading-relaxed">
                While FHA loans offer easier qualification, they come with mortgage insurance for the life of the loan 
                (for most borrowers). Conventional loans with less than 20% down require Private Mortgage Insurance (PMI), 
                but PMI can be removed once you reach 20% equity. Consider both options to determine which is more 
                cost-effective for your situation.
              </p>

              <h3 className="text-xl font-display font-semibold mt-8 mb-3">FHA Loan Limits</h3>
              <p className="text-muted-foreground leading-relaxed">
                FHA loan limits vary by county and are updated annually. In 2024, the floor limit for low-cost areas 
                is $498,257, while the ceiling in high-cost areas is $1,149,825. Check the FHA's official website 
                for specific limits in your area.
              </p>
            </section>
          </article>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default FHA;
