import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RentOrBuyCalculator from "@/components/RentOrBuyCalculator";

const RentOrBuy = () => {
  const canonicalUrl = "https://mortgagecalculation.net/rent-or-buy";

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
        name: "Rent or Buy Calculator",
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
        name: "What factors should I consider when deciding to rent or buy?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Key factors include: Time Horizon (buying generally makes more sense if you plan to stay for 5+ years), Home Appreciation (markets vary widely; research local trends carefully), Rent Increases (consider how rent typically increases in your area annually), Transaction Costs (selling a home typically costs 6-10% of the sale price), and Maintenance (homeowners should budget 1-2% of home value annually for repairs).",
        },
      },
      {
        "@type": "Question",
        name: "What are the tax considerations when comparing renting vs buying?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The mortgage interest deduction can provide significant tax benefits for homeowners who itemize. However, with the increased standard deduction, fewer taxpayers now benefit from itemizing. Enter your marginal tax rate only if you plan to itemize deductions.",
        },
      },
      {
        "@type": "Question",
        name: "How long should I plan to stay in a home before buying makes sense?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Buying generally makes more financial sense if you plan to stay in the home for 5+ years. This allows time to recover closing costs and transaction fees, and to benefit from potential home appreciation. Shorter time horizons often favor renting.",
        },
      },
    ],
  };

  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Rent or Buy Calculator",
    applicationCategory: "FinanceApplication",
    description: "Compare the financial costs and benefits of renting vs buying a home.",
    operatingSystem: "Any",
    url: canonicalUrl,
    featureList: [
      "Compare renting vs buying over time",
      "Factor in home appreciation rates",
      "Account for rent increase projections",
      "Calculate tax benefits of homeownership",
      "Include transaction and maintenance costs",
      "Visualize wealth accumulation comparison",
    ],
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };

  return (
    <>
      <Helmet>
        <title>Rent or Buy Calculator | Compare Renting vs Buying a Home</title>
        <meta
          name="description"
          content="Compare the financial costs and benefits of renting vs buying a home. Analyze rent appreciation, home appreciation, tax benefits, and ownership costs."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="Rent or Buy Calculator | Should You Rent or Buy?" />
        <meta property="og:description" content="Compare the long-term financial impact of renting versus purchasing a home." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Rent or Buy Calculator" />
        <meta name="twitter:description" content="Compare renting vs buying a home to make the best financial decision." />
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(webAppSchema)}</script>
      </Helmet>
      
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        
        <main className="flex-1 container py-8">
          <header className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-foreground mb-4">
              Rent or Buy Calculator
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Should you rent or buy? Compare the long-term financial impact of renting versus purchasing a home.
            </p>
          </header>

              <RentOrBuyCalculator />
              
              <section className="mt-12 prose prose-sm max-w-none">
                <h2 className="text-2xl font-display font-semibold text-foreground mb-4">
                  Understanding the Rent vs Buy Decision
                </h2>
                <div className="text-muted-foreground space-y-4">
                  <p>
                    The decision to rent or buy a home is one of the most significant financial choices you'll make. 
                    This calculator helps you compare the true costs of each option by considering multiple factors 
                    including monthly payments, appreciation, tax benefits, and transaction costs.
                  </p>
                  
                  <h3 className="text-lg font-semibold text-foreground mt-6">Key Factors to Consider</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Time Horizon:</strong> Buying generally makes more sense if you plan to stay for 5+ years.</li>
                    <li><strong>Home Appreciation:</strong> Markets vary widely; research local trends carefully.</li>
                    <li><strong>Rent Increases:</strong> Consider how rent typically increases in your area annually.</li>
                    <li><strong>Transaction Costs:</strong> Selling a home typically costs 6-10% of the sale price.</li>
                    <li><strong>Maintenance:</strong> Homeowners should budget 1-2% of home value annually for repairs.</li>
                  </ul>
                  
                  <h3 className="text-lg font-semibold text-foreground mt-6">Tax Considerations</h3>
                  <p>
                    The mortgage interest deduction can provide significant tax benefits for homeowners who itemize. 
                    However, with the increased standard deduction, fewer taxpayers now benefit from itemizing. 
                    Enter your marginal tax rate only if you plan to itemize deductions.
                  </p>
                </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default RentOrBuy;
