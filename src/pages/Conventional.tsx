import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MortgageCalculator from "@/components/MortgageCalculator";

const Conventional = () => {
  const canonicalUrl = "https://mortgagecalculation.net/conventional";

  return (
    <>
      <Helmet>
        <title>Conventional Mortgage Calculator | Estimate Your Monthly Payment</title>
        <meta
          name="description"
          content="Calculate your conventional mortgage payment with our free calculator. See principal, interest, taxes, insurance, and PMI for conforming loans."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="Conventional Mortgage Calculator | Monthly Payment Estimator" />
        <meta
          property="og:description"
          content="Calculate your conventional loan payment including taxes, insurance, and PMI. View your complete amortization schedule."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Conventional Mortgage Calculator" />
        <meta
          name="twitter:description"
          content="Calculate your conventional mortgage payment including taxes, insurance, and PMI."
        />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Conventional Mortgage Calculator",
            applicationCategory: "FinanceApplication",
            description:
              "Free online conventional mortgage calculator to estimate monthly payments, including property tax, insurance, PMI, and amortization schedule.",
            operatingSystem: "Any",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
            },
          })}
        </script>
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1 container py-8">
          <article>
            <header className="text-center mb-10">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-foreground mb-4">
                Conventional Mortgage Calculator
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Estimate your monthly payment for a conventional loan. Includes principal, interest,
                taxes, insurance, and PMI for down payments under 20%.
              </p>
            </header>

            <MortgageCalculator />

            <section className="mt-12 prose prose-slate max-w-none">
              <h2 className="text-2xl font-display font-semibold mb-4">What is a Conventional Mortgage?</h2>
              <p className="text-muted-foreground leading-relaxed">
                A conventional mortgage is a home loan that is not insured or guaranteed by the federal government. 
                Unlike FHA, VA, or USDA loans, conventional mortgages are backed by private lenders and typically 
                follow guidelines set by Fannie Mae and Freddie Mac. They are the most common type of mortgage 
                and offer flexible terms for qualified borrowers.
              </p>

              <h3 className="text-xl font-display font-semibold mt-8 mb-3">Conventional Loan Requirements</h3>
              <p className="text-muted-foreground leading-relaxed">
                To qualify for a conventional mortgage, lenders typically require a minimum credit score of 620, 
                though better rates are available with scores of 740 or higher. You'll need a debt-to-income (DTI) 
                ratio of 43% or less, stable employment history, and documentation of income and assets. Down 
                payments can be as low as 3%, but putting down less than 20% requires Private Mortgage Insurance (PMI).
              </p>

              <h3 className="text-xl font-display font-semibold mt-8 mb-3">Conforming vs. Non-Conforming Loans</h3>
              <p className="text-muted-foreground leading-relaxed">
                Conventional loans fall into two categories: conforming and non-conforming. Conforming loans meet 
                the guidelines and loan limits set by Fannie Mae and Freddie Mac—currently $766,550 for most areas 
                in 2024 (higher in high-cost areas). Non-conforming loans, including jumbo loans, exceed these limits 
                or don't meet other standard criteria.
              </p>

              <div className="mt-8 grid gap-6 md:grid-cols-2">
                <div className="calculator-card">
                  <h4 className="font-display font-semibold text-lg mb-3">Advantages of Conventional Loans</h4>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-accent">✓</span>
                      <span>No upfront mortgage insurance premium</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent">✓</span>
                      <span>PMI can be removed once you reach 20% equity</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent">✓</span>
                      <span>Competitive interest rates for good credit</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent">✓</span>
                      <span>Flexible property types (primary, second home, investment)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent">✓</span>
                      <span>Down payments as low as 3%</span>
                    </li>
                  </ul>
                </div>

                <div className="calculator-card">
                  <h4 className="font-display font-semibold text-lg mb-3">Considerations</h4>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Higher credit score requirements than government loans</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>PMI required for down payments under 20%</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Stricter debt-to-income requirements</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>May require larger down payment for best rates</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>More documentation typically required</span>
                    </li>
                  </ul>
                </div>
              </div>

              <h3 className="text-xl font-display font-semibold mt-8 mb-3">Understanding Private Mortgage Insurance (PMI)</h3>
              <p className="text-muted-foreground leading-relaxed">
                If your down payment is less than 20%, you'll be required to pay PMI on a conventional loan. 
                PMI protects the lender if you default on the loan. The cost typically ranges from 0.3% to 1.5% 
                of the original loan amount annually. The good news is that unlike FHA mortgage insurance, PMI 
                can be canceled once you've built 20% equity in your home, either through payments or appreciation.
              </p>

              <div className="calculator-card mt-8">
                <h4 className="font-display font-semibold text-lg mb-4">Conventional vs. Government-Backed Loans</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 font-semibold">Feature</th>
                        <th className="text-left py-3 px-4 font-semibold">Conventional</th>
                        <th className="text-left py-3 px-4 font-semibold">FHA</th>
                        <th className="text-left py-3 px-4 font-semibold">VA</th>
                      </tr>
                    </thead>
                    <tbody className="text-muted-foreground">
                      <tr className="border-b border-border">
                        <td className="py-3 px-4">Min. Credit Score</td>
                        <td className="py-3 px-4">620+</td>
                        <td className="py-3 px-4">580+</td>
                        <td className="py-3 px-4">No minimum</td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="py-3 px-4">Min. Down Payment</td>
                        <td className="py-3 px-4">3%</td>
                        <td className="py-3 px-4">3.5%</td>
                        <td className="py-3 px-4">0%</td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="py-3 px-4">Mortgage Insurance</td>
                        <td className="py-3 px-4">PMI (removable)</td>
                        <td className="py-3 px-4">MIP (lifetime)</td>
                        <td className="py-3 px-4">Funding fee</td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="py-3 px-4">Loan Limits</td>
                        <td className="py-3 px-4">$766,550*</td>
                        <td className="py-3 px-4">$498,257*</td>
                        <td className="py-3 px-4">No limit</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4">Property Types</td>
                        <td className="py-3 px-4">Most types</td>
                        <td className="py-3 px-4">Primary only</td>
                        <td className="py-3 px-4">Primary only</td>
                      </tr>
                    </tbody>
                  </table>
                  <p className="text-xs text-muted-foreground mt-2">*2024 limits for most areas; higher in high-cost areas</p>
                </div>
              </div>

              <h3 className="text-xl font-display font-semibold mt-8 mb-3">Who Should Consider a Conventional Loan?</h3>
              <p className="text-muted-foreground leading-relaxed">
                Conventional loans are ideal for borrowers with good to excellent credit (620+), stable income, 
                and the ability to make at least a 3% down payment. They're especially advantageous if you can 
                put 20% down to avoid PMI, or if you're purchasing a second home or investment property. If you 
                have a lower credit score or limited savings, government-backed options like FHA or VA loans 
                might offer better terms.
              </p>
            </section>
          </article>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Conventional;
