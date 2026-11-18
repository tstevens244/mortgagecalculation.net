import { ReactNode } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronDown } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import GuideContents from "@/components/GuideContents";
import type { Faq } from "@/components/CalculatorPage";
import { allCalculators } from "@/lib/calculators";
import { GUIDES_PATH, guidePath, guides } from "@/lib/guides";
import { SITE_NAME, SITE_URL, formatLongDate } from "@/lib/site";

interface GuidePageProps {
  slug: string;
  /** <title>, if different from the guide title. */
  metaTitle?: string;
  description: string;
  /** Opening paragraph(s), shown before the contents. */
  lead: ReactNode;
  children: ReactNode;
  faqs?: Faq[];
}

/** Layout and head tags for a guide article. */
const GuidePage = ({ slug, metaTitle, description, lead, children, faqs = [] }: GuidePageProps) => {
  const guide = guides.find((g) => g.slug === slug)!;
  const url = `${SITE_URL}${guidePath(guide)}`;
  const title = metaTitle ?? guide.title;
  const featured = guide.calculators.map((p) => allCalculators.find((c) => c.path === p)!).filter(Boolean);
  const others = guides.filter((g) => g.slug !== slug);

  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "Guides", item: `${SITE_URL}${GUIDES_PATH}` },
        { "@type": "ListItem", position: 3, name: guide.title, item: url },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: guide.title,
      description,
      datePublished: guide.published,
      dateModified: guide.updated,
      mainEntityOfPage: url,
      image: `${SITE_URL}/og-image.png`,
      author: { "@type": "Organization", name: SITE_NAME, url: `${SITE_URL}/about/` },
      publisher: { "@type": "Organization", name: SITE_NAME, logo: { "@type": "ImageObject", url: `${SITE_URL}/logo-64.png` } },
    },
    ...(faqs.length
      ? [
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
          },
        ]
      : []),
  ];

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={url} />
        <meta property="og:title" content={guide.title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={url} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={guide.title} />
        <meta name="twitter:description" content={description} />
        {schemas.map((s) => (
          <script key={s["@type"]} type="application/ld+json">
            {JSON.stringify(s)}
          </script>
        ))}
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />
        <main id="main-content" className="flex-1 container py-8">
          <article className="mx-auto max-w-3xl">
            <header className="mb-6">
              <Breadcrumbs trail={[{ label: "Guides", to: GUIDES_PATH }, { label: guide.title }]} />
              <h1 className="mb-3 text-center text-3xl font-display font-bold text-foreground sm:text-4xl">{guide.title}</h1>
              <p className="text-center text-sm text-muted-foreground">
                Updated <time dateTime={guide.updated}>{formatLongDate(guide.updated)}</time> ·{" "}
                <Link to="/methodology/" className="underline-offset-2 hover:underline">
                  How we calculate
                </Link>
              </p>
            </header>

            <div className="hub-content text-lg">{lead}</div>

            <aside aria-label="Calculators for this guide" className="mt-8 grid gap-3 sm:grid-cols-2">
              {featured.map((c) => (
                <Link
                  key={c.path}
                  to={c.path}
                  className="group flex items-center gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-4 transition-colors hover:border-primary/40 hover:bg-primary/10"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                    <c.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="flex items-center gap-1 text-sm font-semibold text-foreground">
                      {c.name}
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                    </span>
                    <span className="block text-xs text-muted-foreground">{c.description}</span>
                  </span>
                </Link>
              ))}
            </aside>

            <GuideContents />
            <div className="hub-content mt-10">{children}</div>

            {faqs.length > 0 && (
              <section aria-labelledby="guide-faq" className="mt-14">
                <h2 id="guide-faq" className="mb-4 text-2xl font-display font-semibold text-foreground">
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
            )}

            <nav aria-labelledby="more-guides" className="mt-14" data-no-toc>
              <h2 id="more-guides" className="mb-4 text-xl font-display font-semibold text-foreground">
                More guides
              </h2>
              <ul className="grid gap-3 sm:grid-cols-2" role="list">
                {others.map((g) => (
                  <li key={g.slug}>
                    <Link
                      to={guidePath(g)}
                      className="flex h-full flex-col rounded-2xl border border-border bg-card p-4 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
                    >
                      <span className="text-sm font-semibold text-foreground">{g.title}</span>
                      <span className="mt-1 text-xs text-muted-foreground">{g.summary}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </article>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default GuidePage;
