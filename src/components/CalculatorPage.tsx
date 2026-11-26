import { ReactNode } from "react";
import { Helmet } from "react-helmet-async";
import { ChevronDown } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import TrustLine from "@/components/TrustLine";
import GuideContents from "@/components/GuideContents";
import RelatedCalculators from "@/components/RelatedCalculators";
import { calculatorBreadcrumbSchema } from "@/lib/calculators";
import { SITE_URL, webPageSchema } from "@/lib/site";
import { FIGURES_REVIEWED } from "@/lib/loanLimits";

export interface Faq {
  q: string;
  a: string;
}

interface CalculatorPageProps {
  /** URL path with leading and trailing slash; must be in calculatorGroups. */
  path: string;
  title: string;
  description: string;
  heading: string;
  intro: ReactNode;
  calculator: ReactNode;
  /** Guide below the calculator. */
  children: ReactNode;
  faqs: Faq[];
  featureList: string[];
}

/** Head tags, header, calculator, guide and FAQs for a calculator page. */
const CalculatorPage = ({ path, title, description, heading, intro, calculator, children, faqs, featureList }: CalculatorPageProps) => {
  const url = `${SITE_URL}${path}`;
  const schemas = [
    webPageSchema(url, title, FIGURES_REVIEWED),
    calculatorBreadcrumbSchema(path),
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: heading,
      applicationCategory: "FinanceApplication",
      operatingSystem: "Any",
      url,
      description,
      featureList,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
  ];

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={url} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={url} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        {schemas.map((s) => (
          <script key={s["@type"] as string} type="application/ld+json">
            {JSON.stringify(s)}
          </script>
        ))}
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />
        <main id="main-content" className="flex-1 container py-8 sm:py-12">
          <article>
            <header className="page-header">
              <Breadcrumbs />
              <h1 className="mb-4 text-3xl font-display font-bold text-foreground sm:text-4xl lg:text-5xl">{heading}</h1>
              <div className="text-lg text-muted-foreground">{intro}</div>
              <TrustLine />
            </header>

            {calculator}

            <RelatedCalculators />

            <GuideContents />
            <div className="hub-content page-section">{children}</div>

            <section aria-labelledby="calc-faq" className="page-section" data-no-toc>
              <h2 id="calc-faq" className="mb-4 text-2xl font-display font-semibold text-foreground">
                Frequently asked questions
              </h2>
              <div className="space-y-3">
                {faqs.map((f) => (
                  <details key={f.q} className="group calculator-card overflow-hidden" data-faq>
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4 hover:bg-secondary/40 [&::-webkit-details-marker]:hidden">
                      <h3 className="font-sans text-base font-semibold text-foreground">{f.q}</h3>
                      <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" aria-hidden="true" />
                    </summary>
                    <p className="px-4 pb-4 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
                  </details>
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

export default CalculatorPage;
