import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import AIChatbot from "@/components/AIChatbot";

const AI = () => {
  const canonicalUrl = "https://mortgagecalculation.net/mortgage-assistant/";

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
        name: "Mortgage Assistant",
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
        name: "What can the AI Mortgage Assistant help with?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The AI Mortgage Assistant can help you find the right mortgage calculator for your needs, answer questions about different loan types (FHA, VA, USDA, Conventional, Jumbo, ARM), explain mortgage terms and concepts, and provide personalized recommendations based on your situation.",
        },
      },
      {
        "@type": "Question",
        name: "Is the Mortgage Assistant free to use?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, the AI Mortgage Assistant is completely free to use. It's designed to help you navigate our suite of mortgage calculators and understand your home financing options.",
        },
      },
      {
        "@type": "Question",
        name: "What types of questions can I ask the Mortgage Assistant?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "You can ask about: Which calculator is right for your situation, Differences between loan types (FHA vs Conventional, ARM vs Fixed), How much house you can afford, Whether to rent or buy, Refinancing options, Extra payment strategies, and General mortgage terminology.",
        },
      },
    ],
  };

  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "AI Mortgage Assistant",
    applicationCategory: "FinanceApplication",
    description: "Chat with our AI assistant to find the right mortgage calculator for your needs.",
    operatingSystem: "Any",
    url: canonicalUrl,
    featureList: [
      "Personalized calculator recommendations",
      "Mortgage terminology explanations",
      "Loan type comparisons",
      "Instant answers to mortgage questions",
      "Guidance on home buying decisions",
      "Free unlimited access",
    ],
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };

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
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(webAppSchema)}</script>
      </Helmet>

      <div className="h-dvh flex flex-col overflow-hidden">
        <Header />
        <main id="main-content" className="flex-1 flex flex-col overflow-hidden">
          <AIChatbot />
        </main>
      </div>
    </>
  );
};

export default AI;
