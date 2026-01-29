import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import QualificationCalculator from "@/components/QualificationCalculator";

const Qualification = () => {
  const canonicalUrl = "https://mortgagecalculation.net/mortgage-qualification-calculator/";

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
        name: "Qualification Calculator",
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
        name: "What are debt-to-income ratios and why do they matter?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Lenders typically look at two DTI ratios: the front-end ratio (housing costs divided by gross income) and the back-end ratio (all monthly debts divided by gross income). Common limits are 28% front-end and 36% back-end for conventional loans, though FHA loans may allow up to 31%/43%.",
        },
      },
      {
        "@type": "Question",
        name: "What factors affect mortgage qualification?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Key factors include: Credit score (higher scores may qualify for better rates and higher loan amounts), Down payment (larger down payments reduce the loan amount needed), Existing debts (car loans, student loans, and credit cards reduce borrowing power), Interest rate (lower rates mean lower monthly payments and easier qualification), and Loan type (FHA, VA, and USDA loans have different qualification requirements).",
        },
      },
      {
        "@type": "Question",
        name: "How can I improve my mortgage qualification?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "To qualify for a larger mortgage or improve your chances of approval: pay down existing debts to lower your DTI, improve your credit score, save for a larger down payment, consider a longer loan term to reduce monthly payments, or look for homes in a lower price range. Getting pre-approved shows sellers you're a serious buyer.",
        },
      },
    ],
  };

  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Mortgage Qualification Calculator",
    applicationCategory: "FinanceApplication",
    description: "Calculate the minimum income required to qualify for a mortgage.",
    operatingSystem: "Any",
    url: canonicalUrl,
    featureList: [
      "Calculate minimum income requirements",
      "Apply front-end and back-end DTI ratios",
      "Factor in existing monthly debts",
      "Include property taxes and insurance",
      "Compare conventional vs FHA qualification",
      "Estimate required salary for target home price",
    ],
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };

  return (
    <>
      <Helmet>
        <title>Mortgage Qualification Calculator | How Much Income Do I Need?</title>
        <meta
          name="description"
          content="Calculate the minimum income required to qualify for a mortgage. Estimate your required annual salary based on home price, down payment, and debt-to-income ratios."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="Mortgage Qualification Calculator" />
        <meta property="og:description" content="Calculate the minimum income required to qualify for a mortgage." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Mortgage Qualification Calculator" />
        <meta name="twitter:description" content="Estimate your required annual salary to qualify for a mortgage." />
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
                Mortgage Qualification Calculator
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Calculate the minimum income needed to qualify for your desired home
              </p>
            </header>

            <QualificationCalculator />

            <section className="mt-12 prose prose-slate max-w-none">
              <h2 className="text-2xl font-display font-semibold mb-4">How Much Income Do You Need for a Mortgage?</h2>
              <p className="text-muted-foreground leading-relaxed">
                Mortgage lenders use debt-to-income (DTI) ratios to determine how much you can borrow. This calculator 
                works backward from your desired home price to show the minimum annual income required to qualify. 
                Understanding these requirements helps you set realistic home-buying goals.
              </p>

              <h3 className="text-xl font-display font-semibold mt-8 mb-3">Understanding Debt-to-Income Ratios</h3>
              <p className="text-muted-foreground leading-relaxed">
                Lenders typically look at two DTI ratios: the front-end ratio (housing costs divided by gross income) 
                and the back-end ratio (all monthly debts divided by gross income). Common limits are 28% front-end 
                and 36% back-end for conventional loans, though FHA loans may allow up to 31%/43%.
              </p>

              <h3 className="text-xl font-display font-semibold mt-8 mb-3">Factors That Affect Qualification</h3>
              <ul className="text-muted-foreground space-y-2">
                <li><strong>Credit score:</strong> Higher scores may qualify for better rates and higher loan amounts.</li>
                <li><strong>Down payment:</strong> Larger down payments reduce the loan amount needed.</li>
                <li><strong>Existing debts:</strong> Car loans, student loans, and credit cards reduce borrowing power.</li>
                <li><strong>Interest rate:</strong> Lower rates mean lower monthly payments and easier qualification.</li>
                <li><strong>Loan type:</strong> FHA, VA, and USDA loans have different qualification requirements.</li>
              </ul>

              <h3 className="text-xl font-display font-semibold mt-8 mb-3">Tips for Improving Your Qualification</h3>
              <p className="text-muted-foreground leading-relaxed">
                To qualify for a larger mortgage or improve your chances of approval: pay down existing debts to 
                lower your DTI, improve your credit score, save for a larger down payment, consider a longer loan 
                term to reduce monthly payments, or look for homes in a lower price range. Getting pre-approved 
                shows sellers you're a serious buyer.
              </p>
            </section>
          </article>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Qualification;
