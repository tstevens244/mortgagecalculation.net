import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import AIChatbot from "@/components/AIChatbot";

const AI = () => {
  const canonicalUrl = "https://mortgagecalculation.net/mortgage-assistant";

  return (
    <>
      <Helmet>
        <title>AI Mortgage Assistant | Get Personalized Calculator Recommendations</title>
        <meta
          name="description"
          content="Chat with our AI assistant to find the right mortgage calculator for your needs. Get personalized recommendations and answers to your mortgage questions."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="AI Mortgage Assistant" />
        <meta property="og:description" content="Get personalized mortgage calculator recommendations with our AI assistant." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AI Mortgage Assistant" />
        <meta name="twitter:description" content="Chat with our AI to find the right mortgage calculator for your needs." />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "AI Mortgage Assistant",
            applicationCategory: "FinanceApplication",
            description: "Chat with our AI assistant to find the right mortgage calculator for your needs.",
            operatingSystem: "Any",
            url: "https://mortgagecalculation.net/mortgage-assistant",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          })}
        </script>
      </Helmet>

      <div className="h-dvh flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 flex flex-col overflow-hidden">
          <AIChatbot />
        </main>
      </div>
    </>
  );
};

export default AI;
