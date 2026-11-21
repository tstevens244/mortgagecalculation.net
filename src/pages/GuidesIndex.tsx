import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { GUIDES_PATH, guidePath, guides } from "@/lib/guides";
import { SITE_URL, formatLongDate } from "@/lib/site";

const GuidesIndex = () => {
  const url = `${SITE_URL}${GUIDES_PATH}`;
  const title = "Mortgage Guides: Affordability, Payments, PMI & More";
  const description =
    "Plain-English mortgage guides with real numbers: what you can afford on your salary, payments by home price, getting rid of PMI, debt-to-income ratios and amortization.";
  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "Guides", item: url },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Mortgage Guides",
      description,
      url,
      mainEntity: {
        "@type": "ItemList",
        itemListElement: guides.map((g, i) => ({ "@type": "ListItem", position: i + 1, name: g.title, url: `${SITE_URL}${guidePath(g)}` })),
      },
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
          <script key={s["@type"]} type="application/ld+json">
            {JSON.stringify(s)}
          </script>
        ))}
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />
        <main id="main-content" className="flex-1 container py-8 sm:py-12">
          <header className="page-header">
            <Breadcrumbs trail={[{ label: "Guides" }]} />
            <h1 className="mb-4 text-3xl font-display font-bold text-foreground sm:text-4xl lg:text-5xl">Mortgage Guides</h1>
            <p className="text-lg text-muted-foreground">
              Straight answers to common mortgage questions, worked through with real numbers from the same math as
              our calculators.
            </p>
          </header>
          <ul className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2" role="list">
            {guides.map((g) => (
              <li key={g.slug}>
                <Link
                  to={guidePath(g)}
                  className="group flex h-full flex-col rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
                >
                  <h2 className="text-lg font-semibold text-foreground">{g.title}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{g.summary}</p>
                  <span className="mt-auto flex items-center justify-between pt-4 text-xs text-muted-foreground">
                    <time dateTime={g.updated}>Updated {formatLongDate(g.updated)}</time>
                    <span className="flex items-center gap-1 text-sm font-semibold text-primary">
                      Read
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default GuidesIndex;
