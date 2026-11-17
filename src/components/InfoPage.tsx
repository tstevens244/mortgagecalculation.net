import { ReactNode } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SITE_URL, formatLongDate } from "@/lib/site";

interface InfoPageProps {
  /** URL path with leading and trailing slash, e.g. "/about/". */
  path: string;
  title: string;
  description: string;
  heading: string;
  updated: string;
  breadcrumbName: string;
  children: ReactNode;
}

/** Layout and head tags for text pages such as About, Methodology and Privacy. */
const InfoPage = ({ path, title, description, heading, updated, breadcrumbName, children }: InfoPageProps) => {
  const url = `${SITE_URL}${path}`;
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: breadcrumbName, item: url },
    ],
  };

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
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />
        <main id="main-content" className="flex-1 container py-8">
          <article className="mx-auto max-w-3xl">
            <header className="mb-8">
              <h1 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-2">{heading}</h1>
              <p className="text-sm text-muted-foreground">
                Last updated <time dateTime={updated}>{formatLongDate(updated)}</time>
              </p>
            </header>
            <div className="prose prose-slate max-w-none prose-headings:font-display prose-a:text-primary">{children}</div>
          </article>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default InfoPage;
