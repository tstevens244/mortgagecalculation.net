import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MortgageCalculator from "@/components/MortgageCalculator";

const Index = () => {
  const canonicalUrl = "https://mortgagecalculation.net/";

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
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How do I use this mortgage calculator?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Enter your home price, down payment, loan term, and interest rate to calculate your estimated monthly payment. You can also add property taxes, home insurance, PMI (Private Mortgage Insurance), and HOA fees for a complete picture of your housing costs.",
        },
      },
      {
        "@type": "Question",
        name: "What does my monthly mortgage payment include?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Your monthly mortgage payment typically consists of four main components, often referred to as PITI: Principal (the loan amount), Interest (the cost of borrowing), Taxes (property taxes), and Insurance (homeowner's insurance). If your down payment is less than 20%, you may also need to pay PMI.",
        },
      },
      {
        "@type": "Question",
        name: "What is an amortization schedule?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "An amortization schedule shows how your monthly payments are split between principal and interest over the life of your loan. In the early years, a larger portion goes toward interest. As you continue making payments, more goes toward paying down the principal balance.",
        },
      },
    ],
  };

  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Mortgage Calculator",
    applicationCategory: "FinanceApplication",
    description:
      "Free online mortgage calculator to estimate monthly payments, including property tax, insurance, PMI, and amortization schedule.",
    operatingSystem: "Any",
    url: canonicalUrl,
    featureList: [
      "Calculate monthly mortgage payments",
      "Include property taxes, insurance, and PMI",
      "View complete amortization schedule",
      "Visualize payment breakdown with charts",
      "Compare different loan scenarios",
      "Export amortization data",
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
        <title>Free Mortgage Calculator | Estimate Monthly Payments & Amortization</title>
        <meta
          name="description"
          content="Calculate your monthly mortgage payment with our free mortgage calculator. Includes property tax, insurance, PMI, and full amortization schedule."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="Free Mortgage Calculator | Estimate Monthly Payments" />
        <meta
          property="og:description"
          content="Calculate your monthly mortgage payment including taxes, insurance, and PMI. View your complete amortization schedule."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free Mortgage Calculator" />
        <meta
          name="twitter:description"
          content="Calculate your monthly mortgage payment including taxes, insurance, and PMI."
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
                Mortgage Calculator
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Estimate your monthly mortgage payment with our free calculator. Includes principal, interest,
                taxes, insurance, and PMI.
              </p>
            </header>

            <MortgageCalculator />

            <section className="mt-12 prose prose-slate max-w-none">
              <h2 className="text-2xl font-display font-semibold mb-4">How to Use This Mortgage Calculator</h2>
              <p className="text-muted-foreground leading-relaxed">
                Enter your home price, down payment, loan term, and interest rate to calculate your estimated
                monthly payment. You can also add property taxes, home insurance, PMI (Private Mortgage Insurance),
                and HOA fees for a complete picture of your housing costs.
              </p>

              <h3 className="text-xl font-display font-semibold mt-8 mb-3">Understanding Your Mortgage Payment</h3>
              <p className="text-muted-foreground leading-relaxed">
                Your monthly mortgage payment typically consists of four main components, often referred to as PITI:
                Principal (the loan amount), Interest (the cost of borrowing), Taxes (property taxes), and Insurance
                (homeowner's insurance). If your down payment is less than 20%, you may also need to pay PMI.
              </p>

              <h3 className="text-xl font-display font-semibold mt-8 mb-3">What is an Amortization Schedule?</h3>
              <p className="text-muted-foreground leading-relaxed">
                An amortization schedule shows how your monthly payments are split between principal and interest
                over the life of your loan. In the early years, a larger portion goes toward interest. As you
                continue making payments, more goes toward paying down the principal balance.
              </p>
            </section>
          </article>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Index;
