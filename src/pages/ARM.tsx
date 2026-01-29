import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ARMCalculator from "@/components/ARMCalculator";

const ARM = () => {
  const canonicalUrl = "https://mortgagecalculation.net/adjustable-rate-mortgage-calculator/";

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
        name: "ARM",
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
        name: "What is an Adjustable Rate Mortgage (ARM)?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "An Adjustable Rate Mortgage (ARM) is a home loan with an interest rate that can change periodically. Unlike fixed-rate mortgages, ARMs start with an initial fixed-rate period, after which the rate adjusts based on market conditions and a reference index. ARMs are named by their structure: a 5/1 ARM has a fixed rate for 5 years, then adjusts annually.",
        },
      },
      {
        "@type": "Question",
        name: "What are ARM rate caps?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "ARM rate caps protect borrowers from extreme rate increases. There are three types: Initial Cap (maximum rate increase at first adjustment, often 2-5%), Periodic Cap (maximum rate change per adjustment period, typically 1-2%), and Lifetime Cap (maximum total rate increase over the loan's life, usually 5-6%).",
        },
      },
      {
        "@type": "Question",
        name: "When should I consider an ARM vs a fixed-rate mortgage?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "ARMs may be right if you plan to sell before the fixed period ends, expect to refinance within a few years, believe interest rates will decrease, want lower initial payments to qualify for more home, or have income expected to increase. Consider a fixed-rate if you plan to stay long-term, value payment predictability, current rates are historically low, or prefer financial certainty.",
        },
      },
    ],
  };

  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "ARM Calculator",
    description:
      "Free adjustable rate mortgage calculator to estimate ARM payments, compare initial vs maximum rates, and understand rate adjustment caps.",
    url: canonicalUrl,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    featureList: [
      "Calculate ARM payments before and after adjustments",
      "Compare initial vs maximum possible payments",
      "Understand rate cap protection",
      "Support for 1/1, 3/1, 5/1, 7/1, 10/1 ARMs",
      "Compare ARM vs fixed-rate mortgages",
      "Payment projection over loan term",
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
        <title>ARM Calculator - Adjustable Rate Mortgage Calculator | MortgageCalculation.net</title>
        <meta
          name="description"
          content="Calculate adjustable rate mortgage payments with our free ARM calculator. Compare initial vs maximum payments, understand rate caps, and see payment projections for 3/1, 5/1, 7/1, and 10/1 ARMs."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="ARM Calculator - Adjustable Rate Mortgage Calculator" />
        <meta
          property="og:description"
          content="Calculate adjustable rate mortgage payments with our free ARM calculator. Compare initial vs maximum payments and understand rate adjustment caps."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="ARM Calculator - Adjustable Rate Mortgage Calculator" />
        <meta
          name="twitter:description"
          content="Calculate adjustable rate mortgage payments with our free ARM calculator. Compare initial vs maximum payments."
        />
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(webAppSchema)}</script>
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background">
        <Header />

        <main className="flex-1">
          <article className="container py-8">
            <header className="mb-8 text-center">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground">
                Adjustable Rate Mortgage Calculator
              </h1>
              <p className="text-muted-foreground mt-2 text-base sm:text-lg max-w-3xl mx-auto">
                Calculate your ARM payments before and after rate adjustments. See initial payments, maximum possible payments, and understand how rate caps protect you.
              </p>
            </header>

            <ARMCalculator />

            {/* Educational Content */}
            <section className="mt-12 space-y-8">
              <div className="calculator-card p-6">
                <h2 className="text-2xl font-display font-semibold mb-4">What is an Adjustable Rate Mortgage (ARM)?</h2>
                <p className="text-muted-foreground mb-4">
                  An Adjustable Rate Mortgage (ARM) is a home loan with an interest rate that can change periodically. Unlike fixed-rate mortgages, ARMs start with an initial fixed-rate period, after which the rate adjusts based on market conditions and a reference index.
                </p>
                <p className="text-muted-foreground">
                  ARMs are named by their structure: a 5/1 ARM has a fixed rate for 5 years, then adjusts annually. A 7/1 ARM is fixed for 7 years, and so on. The lower initial rate can save money if you plan to sell or refinance before the adjustment period begins.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="calculator-card p-6">
                  <h3 className="text-xl font-display font-semibold mb-4">Common ARM Types</h3>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-accent font-bold">1/1 ARM:</span>
                      <span>Fixed for 1 year, adjusts annually. Highest risk but lowest initial rate.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent font-bold">3/1 ARM:</span>
                      <span>Fixed for 3 years, then annual adjustments. Good for short-term ownership.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent font-bold">5/1 ARM:</span>
                      <span>Fixed for 5 years. Most popular ARM type, balancing savings with stability.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent font-bold">7/1 ARM:</span>
                      <span>Fixed for 7 years. More stability with moderate initial savings.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent font-bold">10/1 ARM:</span>
                      <span>Fixed for 10 years. Most stable ARM, closest to fixed-rate behavior.</span>
                    </li>
                  </ul>
                </div>

                <div className="calculator-card p-6">
                  <h3 className="text-xl font-display font-semibold mb-4">Understanding Rate Caps</h3>
                  <p className="text-muted-foreground mb-4">
                    ARM rate caps protect borrowers from extreme rate increases. There are typically three types of caps:
                  </p>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-accent font-bold">Initial Cap:</span>
                      <span>Maximum rate increase at the first adjustment (often 2-5%).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent font-bold">Periodic Cap:</span>
                      <span>Maximum rate change per adjustment period (typically 1-2%).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent font-bold">Lifetime Cap:</span>
                      <span>Maximum total rate increase over the loan's life (usually 5-6%).</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="calculator-card p-6">
                <h3 className="text-xl font-display font-semibold mb-4">ARM vs Fixed-Rate Mortgage</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 font-semibold">Feature</th>
                        <th className="text-left py-3 px-4 font-semibold">ARM</th>
                        <th className="text-left py-3 px-4 font-semibold">Fixed-Rate</th>
                      </tr>
                    </thead>
                    <tbody className="text-muted-foreground">
                      <tr className="border-b border-border">
                        <td className="py-3 px-4">Initial Rate</td>
                        <td className="py-3 px-4">Lower (typically 0.5-1% less)</td>
                        <td className="py-3 px-4">Higher</td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="py-3 px-4">Rate Stability</td>
                        <td className="py-3 px-4">Changes after fixed period</td>
                        <td className="py-3 px-4">Never changes</td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="py-3 px-4">Payment Predictability</td>
                        <td className="py-3 px-4">Uncertain after initial period</td>
                        <td className="py-3 px-4">Always the same</td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="py-3 px-4">Best For</td>
                        <td className="py-3 px-4">Short-term ownership, falling rate environments</td>
                        <td className="py-3 px-4">Long-term ownership, rising rate environments</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4">Risk Level</td>
                        <td className="py-3 px-4">Higher (rate can increase significantly)</td>
                        <td className="py-3 px-4">Lower (rate is locked in)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="calculator-card p-6">
                <h3 className="text-xl font-display font-semibold mb-4">When to Consider an ARM</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">ARMs May Be Right If You:</h4>
                    <ul className="space-y-2 text-muted-foreground text-sm">
                      <li>• Plan to sell before the fixed period ends</li>
                      <li>• Expect to refinance within a few years</li>
                      <li>• Believe interest rates will decrease</li>
                      <li>• Want lower initial payments to qualify for more home</li>
                      <li>• Have income expected to increase</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Consider Fixed-Rate If You:</h4>
                    <ul className="space-y-2 text-muted-foreground text-sm">
                      <li>• Plan to stay in the home long-term</li>
                      <li>• Value payment predictability</li>
                      <li>• Current rates are historically low</li>
                      <li>• Have a tight budget with little flexibility</li>
                      <li>• Prefer financial certainty</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>
          </article>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default ARM;
