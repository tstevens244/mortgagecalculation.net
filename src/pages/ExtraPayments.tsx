import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ExtraPaymentsCalculator from "@/components/ExtraPaymentsCalculator";

const ExtraPayments = () => {
  const canonicalUrl = "https://mortgagecalculation.net/extra-mortgage-payments-calculator/";

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
        name: "Savings Strategies",
        item: "https://mortgagecalculation.net/extra-mortgage-payments-calculator",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Extra Payments",
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
        name: "How do extra mortgage payments save money?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Making extra payments on your mortgage is one of the most effective ways to build equity faster and reduce the total cost of your home. Extra payments go directly toward your principal balance, which means you pay less interest over the life of the loan and can pay off your mortgage years early.",
        },
      },
      {
        "@type": "Question",
        name: "What are strategies for making extra mortgage payments?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Common strategies include: Round Up (round your monthly payment to the nearest $100), Bi-Weekly Payments (pay half your mortgage every two weeks to make 13 payments per year), Annual Lump Sum (use tax refunds or bonuses for yearly payments), and Refinance Savings (if you refinance to a lower rate, continue paying the original amount).",
        },
      },
      {
        "@type": "Question",
        name: "What should I consider before making extra mortgage payments?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Important considerations include: Verify your lender applies extra payments to principal (not future interest), Check for prepayment penalties before making large extra payments, Consider whether the money might be better used for higher-interest debt or investments, and Maintain an emergency fund before aggressively paying down your mortgage.",
        },
      },
    ],
  };

  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Extra Mortgage Payments Calculator",
    applicationCategory: "FinanceApplication",
    description: "Calculate how extra mortgage payments can save you thousands in interest and pay off your loan early.",
    operatingSystem: "Any",
    url: canonicalUrl,
    featureList: [
      "Calculate interest savings from extra payments",
      "See payoff date acceleration",
      "Compare with and without extra payments",
      "Monthly and lump sum payment options",
      "View modified amortization schedule",
      "Total savings over loan term",
    ],
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };

  return (
    <>
      <Helmet>
        <title>Extra Mortgage Payments Calculator | Save on Interest</title>
        <meta
          name="description"
          content="Calculate how extra mortgage payments can save you thousands in interest and pay off your loan years early. See the impact of additional monthly or lump-sum payments."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="Extra Mortgage Payments Calculator" />
        <meta property="og:description" content="See how paying extra each month can save you thousands and pay off your mortgage early." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Extra Mortgage Payments Calculator" />
        <meta name="twitter:description" content="Calculate how extra payments can save you thousands in interest." />
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(webAppSchema)}</script>
      </Helmet>
      
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        
        <main id="main-content" className="flex-1 container py-8">
          <header className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-foreground mb-4">
              Extra Mortgage Payments Calculator
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              See how paying a little extra each month can save you thousands and help you become mortgage-free years sooner.
            </p>
          </header>

              <ExtraPaymentsCalculator />
              
              <section className="mt-12 prose prose-sm max-w-none">
                <h2 className="text-2xl font-display font-semibold text-foreground mb-4">
                  The Power of Extra Mortgage Payments
                </h2>
                <div className="text-muted-foreground space-y-4">
                  <p>
                    Making extra payments on your mortgage is one of the most effective ways to build equity faster 
                    and reduce the total cost of your home. Even small additional amounts can make a significant 
                    difference over time.
                  </p>
                  
                  <h3 className="text-lg font-semibold text-foreground mt-6">Strategies for Extra Payments</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Round Up:</strong> Round your monthly payment to the nearest $100 for easy, painless extra payments.</li>
                    <li><strong>Bi-Weekly Payments:</strong> Pay half your mortgage every two weeks instead of monthly to make 13 full payments per year.</li>
                    <li><strong>Annual Lump Sum:</strong> Use tax refunds or bonuses to make yearly lump-sum payments.</li>
                    <li><strong>Refinance Savings:</strong> If you refinance to a lower rate, continue paying the original amount.</li>
                  </ul>
                  
                  <h3 className="text-lg font-semibold text-foreground mt-6">Important Considerations</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Verify your lender applies extra payments to principal, not future interest.</li>
                    <li>Check for prepayment penalties before making large extra payments.</li>
                    <li>Consider whether the money might be better used for higher-interest debt or investments.</li>
                    <li>Maintain an emergency fund before aggressively paying down your mortgage.</li>
                  </ul>
                </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default ExtraPayments;
