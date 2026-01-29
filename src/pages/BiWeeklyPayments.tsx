import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BiWeeklyCalculator from "@/components/BiWeeklyCalculator";

const BiWeeklyPayments = () => {
  const canonicalUrl = "https://mortgagecalculation.net/bi-weekly-mortgage-payments-calculator/";

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
        item: "https://mortgagecalculation.net/extra-mortgage-payments-calculator/",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Bi-Weekly Payments",
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
        name: "How do bi-weekly mortgage payments work?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "With bi-weekly payments, you pay half your monthly mortgage payment every two weeks. Since there are 52 weeks in a year, you make 26 half-payments, which equals 13 full monthly payments instead of 12. That extra payment goes directly toward your principal, reducing your loan balance faster and saving you money on interest.",
        },
      },
      {
        "@type": "Question",
        name: "What are the benefits of bi-weekly mortgage payments?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Benefits include: Pay Off Faster (you'll pay off a 30-year mortgage 4-6 years early), Save on Interest (less time paying means less interest charged), Build Equity Faster (more frequent principal payments accelerate equity growth), and Budget-Friendly (smaller, more frequent payments may align better with paychecks).",
        },
      },
      {
        "@type": "Question",
        name: "What should I consider before switching to bi-weekly payments?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Important considerations include: Lender Setup (some lenders offer official bi-weekly programs, while others don't), DIY Approach (you can simulate bi-weekly payments by adding 1/12 of your payment to each monthly payment), Watch for Fees (some third-party bi-weekly services charge setup or processing fees), and Tax Implications (paying less interest means a smaller mortgage interest deduction if you itemize).",
        },
      },
    ],
  };

  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Bi-Weekly Mortgage Payment Calculator",
    applicationCategory: "FinanceApplication",
    description: "Calculate how bi-weekly mortgage payments can save you thousands in interest.",
    operatingSystem: "Any",
    url: canonicalUrl,
    featureList: [
      "Compare monthly vs bi-weekly payments",
      "Calculate interest savings",
      "See years saved on loan term",
      "26 payments per year analysis",
      "View payment schedule comparison",
      "Total cost comparison over loan life",
    ],
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };

  return (
    <>
      <Helmet>
        <title>Bi-Weekly Mortgage Payment Calculator | Pay Off Your Loan Faster</title>
        <meta
          name="description"
          content="Calculate how bi-weekly mortgage payments can save you thousands in interest and pay off your loan years early. Compare standard vs bi-weekly payment schedules."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="Bi-Weekly Mortgage Payment Calculator" />
        <meta property="og:description" content="See how bi-weekly payments can save you thousands and shave years off your mortgage." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Bi-Weekly Mortgage Calculator" />
        <meta name="twitter:description" content="Calculate how bi-weekly payments can pay off your mortgage faster." />
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(webAppSchema)}</script>
      </Helmet>
      
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        
        <main className="flex-1 container py-8">
          <header className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-foreground mb-4">
              Bi-Weekly Mortgage Payment Calculator
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              See how switching to bi-weekly payments can save you thousands and shave years off your mortgage.
            </p>
          </header>

              <BiWeeklyCalculator />
              
              <section className="mt-12 prose prose-sm max-w-none">
                <h2 className="text-2xl font-display font-semibold text-foreground mb-4">
                  How Bi-Weekly Payments Work
                </h2>
                <div className="text-muted-foreground space-y-4">
                  <p>
                    With bi-weekly payments, you pay half your monthly mortgage payment every two weeks. 
                    Since there are 52 weeks in a year, you make 26 half-payments, which equals 13 full 
                    monthly payments instead of 12. That extra payment goes directly toward your principal, 
                    reducing your loan balance faster and saving you money on interest.
                  </p>
                  
                  <h3 className="text-lg font-semibold text-foreground mt-6">Benefits of Bi-Weekly Payments</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Pay Off Faster:</strong> You'll pay off a 30-year mortgage 4-6 years early.</li>
                    <li><strong>Save on Interest:</strong> Less time paying means less interest charged.</li>
                    <li><strong>Build Equity Faster:</strong> More frequent principal payments accelerate equity growth.</li>
                    <li><strong>Budget-Friendly:</strong> Smaller, more frequent payments may align better with paychecks.</li>
                  </ul>
                  
                  <h3 className="text-lg font-semibold text-foreground mt-6">Important Considerations</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Lender Setup:</strong> Some lenders offer official bi-weekly programs, while others don't. Check with your lender.</li>
                    <li><strong>DIY Approach:</strong> You can simulate bi-weekly payments by adding 1/12 of your payment to each monthly payment.</li>
                    <li><strong>Watch for Fees:</strong> Some third-party bi-weekly services charge setup or processing fees.</li>
                    <li><strong>Tax Implications:</strong> Paying less interest means a smaller mortgage interest deduction if you itemize.</li>
                  </ul>
                </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default BiWeeklyPayments;
