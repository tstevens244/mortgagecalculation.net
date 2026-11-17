import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TrustLine from "@/components/TrustLine";
import GuideContents from "@/components/GuideContents";
import RelatedCalculators from "@/components/RelatedCalculators";
import Breadcrumbs from "@/components/Breadcrumbs";
import HelocCalculator from "@/components/HelocCalculator";

const faqs = [
  {
    q: "How much can I borrow with a HELOC?",
    a: "Most lenders let your mortgage and HELOC together reach 80% to 85% of your home's value, and some go to 90%. Multiply your home value by the lender's limit and subtract your mortgage balance. For a $450,000 home with a $250,000 mortgage and an 85% limit, that's $450,000 × 0.85 − $250,000 = $132,500.",
  },
  {
    q: "How is a HELOC payment calculated?",
    a: "During the draw period, usually 10 years, most HELOCs require interest-only payments: the balance times the annual rate, divided by 12. During the repayment period, usually 20 years, you pay principal and interest like a regular loan, so the payment rises.",
  },
  {
    q: "What happens when the HELOC draw period ends?",
    a: "You can no longer borrow, and the payment switches to principal plus interest over the repayment period. On a $50,000 balance at 8%, the payment goes from about $333 a month interest-only to about $418 a month over 20 years.",
  },
  {
    q: "Are HELOC rates fixed or variable?",
    a: "Most HELOC rates are variable, set as the prime rate plus a margin, so your payment changes when the prime rate moves. Some lenders let you lock part of the balance at a fixed rate.",
  },
  {
    q: "What's the difference between a HELOC and a home equity loan?",
    a: "A HELOC is a revolving line you draw from as needed, usually at a variable rate. A home equity loan pays a lump sum up front at a fixed rate, with fixed payments from the start.",
  },
  {
    q: "Is HELOC interest tax deductible?",
    a: "Under current IRS rules, HELOC interest is deductible only if you itemize and use the money to buy, build or substantially improve the home that secures the loan. Interest on money used for other purposes, such as paying off credit cards, isn't deductible.",
  },
];

const Heloc = () => {
  const canonicalUrl = "https://mortgagecalculation.net/heloc-calculator/";

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://mortgagecalculation.net/" },
      { "@type": "ListItem", position: 2, name: "HELOC Calculator", item: canonicalUrl },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "HELOC Calculator",
    applicationCategory: "FinanceApplication",
    description:
      "Free HELOC calculator to estimate how much you can borrow against your home and your payments during the draw and repayment periods.",
    operatingSystem: "Any",
    url: canonicalUrl,
    featureList: [
      "Maximum HELOC credit line from home value and mortgage balance",
      "Interest-only draw period payment",
      "Repayment period principal and interest payment",
      "Payment increase when the draw period ends",
      "Rate increase stress test",
    ],
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };

  return (
    <>
      <Helmet>
        <title>HELOC Calculator | How Much Can I Borrow & What Will I Pay?</title>
        <meta
          name="description"
          content="Free HELOC calculator: see how much you can borrow against your home, your interest-only draw payment, and your payment once repayment starts."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="HELOC Calculator | How Much Can I Borrow?" />
        <meta
          property="og:description"
          content="Estimate your HELOC credit line and payments during the draw and repayment periods."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="HELOC Calculator" />
        <meta
          name="twitter:description"
          content="Estimate your HELOC credit line and payments during the draw and repayment periods."
        />
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(webAppSchema)}</script>
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main id="main-content" className="flex-1 container py-8">
          <article>
            <header className="text-center mb-8">
              <Breadcrumbs />
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-foreground mb-4">
                HELOC Calculator
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                See how much you can borrow against your home and what your payments will be, both while you draw
                and after repayment starts.
              </p>
              <TrustLine />
            </header>

            <HelocCalculator />


            <RelatedCalculators />

            <GuideContents />
            <section className="mt-16 prose prose-slate max-w-none">
              <h2 className="text-2xl font-display font-semibold mb-4">How a HELOC works</h2>
              <p className="text-muted-foreground leading-relaxed">
                A home equity line of credit (HELOC) is a revolving credit line secured by your home. You can borrow,
                repay and borrow again up to your limit during the <strong>draw period</strong>, usually 10 years.
                After that comes the <strong>repayment period</strong>, usually 20 years, when you can't borrow and
                pay the balance down with principal and interest. The{" "}
                <a
                  href="https://www.consumerfinance.gov/ask-cfpb/what-is-a-home-equity-line-of-credit-heloc-en-106/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Consumer Financial Protection Bureau
                </a>{" "}
                explains the basics and the risks, including that you could lose your home if you can't repay.
              </p>

              <h2 className="text-2xl font-display font-semibold mt-10 mb-4">How much can you borrow?</h2>
              <p className="text-muted-foreground leading-relaxed">
                Lenders cap the total of your mortgage and HELOC at a share of your home's value, called the combined
                loan-to-value (CLTV) limit. It's usually 80% to 85%, and some lenders allow 90% for strong
                borrowers.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                <strong>Maximum credit line = home value × CLTV limit − mortgage balance</strong>
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Example: a $450,000 home, a $250,000 mortgage and an 85% limit give $450,000 × 0.85 − $250,000 ={" "}
                <strong>$132,500</strong>. Your credit score, income and debts can lower the line a lender actually
                offers.
              </p>

              <h2 className="text-2xl font-display font-semibold mt-10 mb-4">Draw period vs. repayment period payments</h2>
              <p className="text-muted-foreground leading-relaxed">
                Most HELOCs charge interest only during the draw period: balance × rate ÷ 12. When repayment starts,
                the payment covers principal too, so it rises, sometimes sharply. Lenders call this payment shock.
              </p>
              <div className="overflow-x-auto not-prose">
                <table className="w-full text-sm border-collapse calculator-card">
                  <caption className="sr-only">Monthly payments on a $50,000 HELOC balance</caption>
                  <thead>
                    <tr className="border-b border-border">
                      <th className="p-3 text-left font-semibold">Rate</th>
                      <th className="p-3 text-left font-semibold">Draw (interest only)</th>
                      <th className="p-3 text-left font-semibold">Repayment (20 years)</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    <tr className="border-b border-border">
                      <td className="p-3">7%</td>
                      <td className="p-3">$292</td>
                      <td className="p-3">$388</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="p-3">8%</td>
                      <td className="p-3">$333</td>
                      <td className="p-3">$418</td>
                    </tr>
                    <tr>
                      <td className="p-3">10%</td>
                      <td className="p-3">$417</td>
                      <td className="p-3">$483</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-muted-foreground mt-2">Payments on a $50,000 balance, rounded to the nearest dollar.</p>

              <h2 className="text-2xl font-display font-semibold mt-10 mb-4">Variable rates</h2>
              <p className="text-muted-foreground leading-relaxed">
                HELOC rates are usually the prime rate plus a margin set by your lender, and they change when prime
                changes. The calculator shows what your repayment payment would be if rates rose 2 points, so you can
                check it still fits your budget. Ask lenders about rate caps and whether you can lock part of the
                balance at a fixed rate.
              </p>

              <h2 className="text-2xl font-display font-semibold mt-10 mb-4">HELOC, home equity loan or cash-out refinance?</h2>
              <ul className="text-muted-foreground space-y-2">
                <li>
                  <strong>HELOC:</strong> flexible, borrow only what you need, variable rate. Good for projects paid
                  over time.
                </li>
                <li>
                  <strong>Home equity loan:</strong> lump sum at a fixed rate with fixed payments. Good for a single
                  known cost.
                </li>
                <li>
                  <strong>Cash-out refinance:</strong> replaces your mortgage with a bigger one. Worth it mainly if the
                  new mortgage rate isn't higher than your current one. Try our{" "}
                  <Link to="/cash-out-refinance-calculator/" className="text-primary hover:underline">
                    cash-out refinance calculator
                  </Link>
                  .
                </li>
              </ul>
              <p className="text-muted-foreground leading-relaxed">
                Thinking of using a HELOC to pay off credit cards or other debt? The{" "}
                <Link to="/heloc-debt-consolidation-calculator/" className="text-primary hover:underline">
                  HELOC debt consolidation calculator
                </Link>{" "}
                compares your current debts with a HELOC payoff.
              </p>

              <h2 className="text-2xl font-display font-semibold mt-10 mb-4">Frequently asked questions</h2>
              <div className="not-prose space-y-4">
                {faqs.map((f) => (
                  <div key={f.q} className="calculator-card p-4">
                    <h3 className="font-semibold text-foreground mb-2 text-base font-sans">{f.q}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{f.a}</p>
                  </div>
                ))}
              </div>
            </section>
          </article>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Heloc;
