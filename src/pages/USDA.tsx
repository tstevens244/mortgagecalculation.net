import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import USDACalculator from "@/components/USDACalculator";

const USDA = () => {
  const canonicalUrl = "https://mortgagecalculation.net/usda-loan-calculator";

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
        name: "USDA Loan",
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
        name: "What is a USDA loan?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A USDA loan (also called a Rural Development loan) is a government-backed mortgage offered by the United States Department of Agriculture. These loans are designed to help low-to-moderate income borrowers purchase homes in eligible rural and suburban areas with no down payment required.",
        },
      },
      {
        "@type": "Question",
        name: "What are USDA guarantee fees?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "USDA loans require two types of guarantee fees: Upfront Guarantee Fee of 1% of the loan amount (typically financed into the loan), and Annual Fee of 0.35% of the remaining loan balance paid monthly. This is significantly lower than FHA's annual MIP rate.",
        },
      },
      {
        "@type": "Question",
        name: "What are the USDA loan requirements?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "USDA loan requirements include: Location Eligibility (property must be in an eligible rural area), Income Limits (household income cannot exceed 115% of area median income), Credit Score (most lenders require 640 for automated approval), and the home must be your primary residence.",
        },
      },
    ],
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
        <title>USDA Loan Calculator | Rural Home Loan Payment Estimator | Mortgage Calculation</title>
        <meta
          name="description"
          content="Calculate your USDA loan payment with 0% down. See how USDA guarantee fees affect your monthly payment. Free calculator for rural home buyers."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="USDA Loan Calculator | Rural Home Loan Payment Estimator" />
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

        <main className="flex-1 container py-8">
          <article>
            <header className="text-center mb-10">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-foreground mb-4">
                USDA Loan Calculator
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Calculate your USDA rural development loan payment with 0% down payment. 
                USDA loans help low-to-moderate income families purchase homes in eligible rural areas.
              </p>
            </header>

            <USDACalculator />

            <section className="mt-12 prose prose-slate max-w-none">
              <h2 className="text-2xl font-display font-semibold mb-4">What is a USDA Loan?</h2>
              <p className="text-muted-foreground leading-relaxed">
                A USDA loan (also called a Rural Development loan) is a government-backed mortgage offered 
                by the United States Department of Agriculture. These loans are designed to help low-to-moderate 
                income borrowers purchase homes in eligible rural and suburban areas with no down payment required.
              </p>

              <h3 className="text-xl font-display font-semibold mt-8 mb-3">USDA Loan Requirements</h3>
              <div className="grid md:grid-cols-2 gap-6 not-prose">
                <div className="calculator-card p-4">
                  <h4 className="font-semibold text-foreground mb-2">Location Eligibility</h4>
                  <p className="text-sm text-muted-foreground">
                    The property must be located in an eligible rural area as defined by the USDA. Many suburban areas qualify.
                  </p>
                </div>
                <div className="calculator-card p-4">
                  <h4 className="font-semibold text-foreground mb-2">Income Limits</h4>
                  <p className="text-sm text-muted-foreground">
                    Household income cannot exceed 115% of the area median income. Limits vary by location and family size.
                  </p>
                </div>
                <div className="calculator-card p-4">
                  <h4 className="font-semibold text-foreground mb-2">Credit Score</h4>
                  <p className="text-sm text-muted-foreground">
                    Most lenders require a minimum 640 credit score for automated approval. Manual underwriting may allow lower scores.
                  </p>
                </div>
                <div className="calculator-card p-4">
                  <h4 className="font-semibold text-foreground mb-2">Primary Residence</h4>
                  <p className="text-sm text-muted-foreground">
                    The home must be your primary residence. USDA loans cannot be used for investment properties or vacation homes.
                  </p>
                </div>
              </div>

              <h3 className="text-xl font-display font-semibold mt-8 mb-3">Understanding USDA Guarantee Fees</h3>
              <p className="text-muted-foreground leading-relaxed">
                USDA loans require two types of guarantee fees instead of traditional mortgage insurance:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>
                  <strong>Upfront Guarantee Fee:</strong> 1% of the loan amount, typically financed into the loan.
                </li>
                <li>
                  <strong>Annual Fee:</strong> 0.35% of the remaining loan balance, paid monthly. This is significantly 
                  lower than FHA's annual MIP rate.
                </li>
              </ul>

              <h3 className="text-xl font-display font-semibold mt-8 mb-3">Benefits of USDA Loans</h3>
              <div className="grid md:grid-cols-3 gap-4 not-prose">
                <div className="calculator-card p-4 text-center">
                  <p className="text-2xl font-bold text-primary mb-1">0%</p>
                  <p className="text-sm text-muted-foreground">Down Payment Required</p>
                </div>
                <div className="calculator-card p-4 text-center">
                  <p className="text-2xl font-bold text-primary mb-1">0.35%</p>
                  <p className="text-sm text-muted-foreground">Low Annual Fee</p>
                </div>
                <div className="calculator-card p-4 text-center">
                  <p className="text-2xl font-bold text-primary mb-1">Competitive</p>
                  <p className="text-sm text-muted-foreground">Interest Rates</p>
                </div>
              </div>

              <h3 className="text-xl font-display font-semibold mt-8 mb-3">USDA vs. FHA vs. Conventional</h3>
              <p className="text-muted-foreground leading-relaxed">
                USDA loans offer significant advantages for eligible borrowers: no down payment (vs. 3.5% for FHA, 
                3-5% for conventional), lower mortgage insurance costs than FHA, and competitive interest rates. 
                However, they have geographic and income restrictions that FHA and conventional loans don't have.
              </p>

              <h3 className="text-xl font-display font-semibold mt-8 mb-3">How to Check USDA Eligibility</h3>
              <p className="text-muted-foreground leading-relaxed">
                Visit the USDA's eligibility website to check if a property's location qualifies for a USDA loan. 
                You can search by address to see if the area is designated as rural or suburban under USDA guidelines. 
                Income eligibility can also be verified through the USDA's online tool.
              </p>
            </section>
          </article>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default USDA;
