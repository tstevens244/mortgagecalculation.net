import { ReactNode } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronDown } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import TrustLine from "@/components/TrustLine";
import { calculatorGroups, type CalculatorGroup } from "@/lib/calculators";
import { SITE_URL } from "@/lib/site";

export interface HubFaq {
  q: string;
  a: string;
}

export interface HubContent {
  title: string;
  description: string;
  intro: ReactNode;
  /** "Use it when…" line for each calculator, keyed by path. */
  useWhen: Record<string, string>;
  /** Guide sections below the calculator cards. */
  body: ReactNode;
  faqs: HubFaq[];
}

interface CategoryHubProps {
  groupId: string;
  content: HubContent;
}

/** Landing page for one calculator group: what each tool answers, a short guide and FAQs. */
const CategoryHub = ({ groupId, content }: CategoryHubProps) => {
  const group = calculatorGroups.find((g) => g.id === groupId) as CalculatorGroup;
  const url = `${SITE_URL}${group.hubPath}`;
  const others = calculatorGroups.filter((g) => g.id !== groupId);

  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: group.hubName, item: url },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: group.hubName,
      description: content.description,
      url,
      mainEntity: {
        "@type": "ItemList",
        itemListElement: group.calculators.map((c, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: c.name,
          url: `${SITE_URL}${c.path}`,
        })),
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: content.faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];

  return (
    <>
      <Helmet>
        <title>{content.title}</title>
        <meta name="description" content={content.description} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={url} />
        <meta property="og:title" content={content.title} />
        <meta property="og:description" content={content.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={url} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={content.title} />
        <meta name="twitter:description" content={content.description} />
        {schemas.map((s) => (
          <script key={s["@type"]} type="application/ld+json">
            {JSON.stringify(s)}
          </script>
        ))}
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main id="main-content" className="flex-1 container py-8">
          <article>
            <header className="mx-auto mb-10 max-w-3xl text-center">
              <Breadcrumbs />
              <h1 className="mb-4 text-3xl font-display font-bold text-foreground sm:text-4xl lg:text-5xl">
                {group.hubName}
              </h1>
              <div className="text-lg text-muted-foreground">{content.intro}</div>
              <TrustLine />
            </header>

            <section aria-labelledby="hub-calculators">
              <h2 id="hub-calculators" className="sr-only">
                Calculators
              </h2>
              <ul
                className={
                  group.calculators.length > 4
                    ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
                    : "mx-auto grid max-w-4xl gap-4 sm:grid-cols-2"
                }
                role="list"
              >
                {group.calculators.map((calc) => (
                  <li key={calc.path}>
                    <Link
                      to={calc.path}
                      className="group flex h-full flex-col rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
                    >
                      <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                        <calc.icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <span className="text-lg font-semibold text-foreground">{calc.name}</span>
                      <span className="mt-1 text-sm text-muted-foreground">{calc.description}</span>
                      {content.useWhen[calc.path] && (
                        <span className="mt-3 border-t border-border pt-3 text-sm text-foreground">
                          <span className="font-medium">Use it when: </span>
                          {content.useWhen[calc.path]}
                        </span>
                      )}
                      <span className="mt-auto flex items-center gap-1 pt-4 text-sm font-semibold text-primary">
                        Open calculator
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>

            <div className="hub-content mx-auto mt-16 max-w-3xl">{content.body}</div>

            <section aria-labelledby="hub-faq" className="mx-auto mt-14 max-w-3xl">
              <h2 id="hub-faq" className="mb-4 text-2xl font-display font-semibold text-foreground">
                Frequently asked questions
              </h2>
              <div className="space-y-3">
                {content.faqs.map((f) => (
                  <details key={f.q} className="group calculator-card overflow-hidden" data-faq>
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4 hover:bg-secondary/40 [&::-webkit-details-marker]:hidden">
                      <h3 className="font-sans text-base font-semibold text-foreground">{f.q}</h3>
                      <ChevronDown
                        className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180"
                        aria-hidden="true"
                      />
                    </summary>
                    <p className="px-4 pb-4 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
                  </details>
                ))}
              </div>
            </section>

            <nav aria-labelledby="hub-more" className="mx-auto mt-14 max-w-4xl">
              <h2 id="hub-more" className="mb-4 text-xl font-display font-semibold text-foreground">
                More calculators
              </h2>
              <ul className="grid gap-3 sm:grid-cols-3" role="list">
                {others.map((g) => (
                  <li key={g.id}>
                    <Link
                      to={g.hubPath}
                      className="group flex h-full flex-col rounded-2xl border border-border bg-card p-4 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
                    >
                      <span className="flex items-center gap-1 text-sm font-semibold text-foreground">
                        {g.hubName}
                        <ArrowRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
                      </span>
                      <span className="mt-1 text-xs leading-snug text-muted-foreground">{g.description}</span>
                      <span className="mt-2 text-xs text-muted-foreground">
                        {g.calculators.length} calculators
                      </span>
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

export default CategoryHub;
