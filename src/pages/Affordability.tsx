import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AffordabilityCalculator from "@/components/AffordabilityCalculator";

const Affordability = () => {
  const canonicalUrl = "https://mortgagecalculation.net/house-affordability";

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
        name: "Affordability Calculator",
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
        name: "What is the 28/36 rule for mortgage affordability?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The traditional guideline says your monthly housing costs (mortgage, taxes, insurance) shouldn't exceed 28% of your gross monthly income (front-end ratio), and your total monthly debts shouldn't exceed 36% of gross income (back-end ratio). More aggressive ratios like 31/43 (FHA) may allow for a higher purchase price but come with greater financial risk.",
        },
      },
      {
        "@type": "Question",
        name: "What is the difference between income-based and budget-based affordability?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Income-based affordability uses DTI rules to calculate maximum housing payment from your income, best for understanding lender limits. Budget-based affordability starts with what you're comfortable paying monthly, best for personal financial planning.",
        },
      },
      {
        "@type": "Question",
        name: "What hidden costs should I consider when buying a home?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Beyond your mortgage payment, budget for: property taxes (varies widely by location), homeowner's insurance, PMI if your down payment is under 20%, HOA fees for condos or planned communities, maintenance and repairs (typically 1-2% of home value annually), and utilities. These costs can add hundreds or thousands to your monthly housing expenses.",
        },
      },
    ],
  };

  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Mortgage Affordability Calculator",
    applicationCategory: "FinanceApplication",
    description: "Calculate how much house you can afford based on your income, debts, and monthly budget.",
    operatingSystem: "Any",
    url: canonicalUrl,
    featureList: [
      "Calculate maximum home price based on income",
      "Budget-based affordability analysis",
      "Apply 28/36 or 31/43 DTI rules",
      "Include property taxes and insurance",
      "Account for existing debts",
      "Compare conservative vs aggressive scenarios",
    ],
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };

  return (
    <>
      <Helmet>
        <title>How Much House Can I Afford? | Mortgage Affordability Calculator</title>
        <meta
          name="description"
          content="Calculate how much house you can afford based on your income, debts, and monthly budget. Estimate your maximum home price with our free affordability calculator."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="How Much House Can I Afford? | Affordability Calculator" />
        <meta property="og:description" content="Calculate how much house you can afford based on your income, debts, and monthly budget." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Mortgage Affordability Calculator" />
        <meta name="twitter:description" content="Estimate your maximum home price based on income or monthly budget." />
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
                How Much House Can I Afford?
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Estimate your maximum home price based on income or monthly budget
              </p>
            </header>

            <AffordabilityCalculator />

            <section className="mt-12 prose prose-slate max-w-none">
              <h2 className="text-2xl font-display font-semibold mb-4">Calculating Home Affordability</h2>
              <p className="text-muted-foreground leading-relaxed">
                Determining how much house you can afford involves more than just your income. This calculator 
                considers your debt-to-income ratio, down payment, interest rate, property taxes, insurance, 
                and HOA fees to give you a realistic maximum home price. Use either the income-based or 
                budget-based approach depending on your situation.
              </p>

              <h3 className="text-xl font-display font-semibold mt-8 mb-3">The 28/36 Rule Explained</h3>
              <p className="text-muted-foreground leading-relaxed">
                The traditional guideline says your monthly housing costs (mortgage, taxes, insurance) shouldn't 
                exceed 28% of your gross monthly income (front-end ratio), and your total monthly debts shouldn't 
                exceed 36% of gross income (back-end ratio). More aggressive ratios like 31/43 (FHA) may allow 
                for a higher purchase price but come with greater financial risk.
              </p>

              <h3 className="text-xl font-display font-semibold mt-8 mb-3">Income-Based vs Budget-Based</h3>
              <ul className="text-muted-foreground space-y-2">
                <li><strong>Income-based:</strong> Uses DTI rules to calculate maximum housing payment from your income. Best for understanding lender limits.</li>
                <li><strong>Budget-based:</strong> Starts with what you're comfortable paying monthly. Best for personal financial planning.</li>
              </ul>

              <h3 className="text-xl font-display font-semibold mt-8 mb-3">Don't Forget Hidden Costs</h3>
              <p className="text-muted-foreground leading-relaxed">
                Beyond your mortgage payment, budget for: property taxes (varies widely by location), homeowner's 
                insurance, PMI if your down payment is under 20%, HOA fees for condos or planned communities, 
                maintenance and repairs (typically 1-2% of home value annually), and utilities. These costs can 
                add hundreds or thousands to your monthly housing expenses.
              </p>

              <h3 className="text-xl font-display font-semibold mt-8 mb-3">Tips for First-Time Buyers</h3>
              <p className="text-muted-foreground leading-relaxed">
                Just because you qualify for a certain amount doesn't mean you should borrow it all. Consider 
                your lifestyle, savings goals, and job stability. A conservative approach leaves room for 
                unexpected expenses and prevents becoming "house poor." Many financial advisors suggest aiming 
                for the lower end of your affordability range.
              </p>
            </section>
          </article>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Affordability;
