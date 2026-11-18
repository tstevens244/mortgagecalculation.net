// Single list of public routes, shared by the prerender, sitemap and SEO check scripts.
// Keep in sync with the <Route> list in src/App.tsx.
//
// path:    URL path without the trailing slash (the site serves "/path/").
// sources: files whose last git commit date becomes the sitemap <lastmod>.
// indexed: false keeps the page out of the sitemap (the page itself sets noindex).
// One page per state, from the data files in src/data/states/ (file name = URL slug).
const fs = require("fs");
const path = require("path");
const stateRoutes = fs
  .readdirSync(path.join(__dirname, "..", "src", "data", "states"))
  .filter((f) => f.endsWith(".json"))
  .sort()
  .map((f) => {
    const slug = f.replace(/\.json$/, "");
    return {
      path: `/${slug}-mortgage-calculator`,
      sources: ["src/pages/StateMortgage.tsx", "src/lib/states.ts", `src/data/states/${f}`],
    };
  });

const routes = [
  { path: "/", sources: ["src/pages/Index.tsx", "src/components/MortgageCalculator.tsx"] },
  { path: "/conventional-mortgage-calculator", sources: ["src/pages/Conventional.tsx", "src/components/MortgageCalculator.tsx"] },
  { path: "/fha-loan-calculator", sources: ["src/pages/FHA.tsx", "src/components/FHACalculator.tsx"] },
  { path: "/usda-loan-calculator", sources: ["src/pages/USDA.tsx", "src/components/USDACalculator.tsx"] },
  { path: "/va-loan-calculator", sources: ["src/pages/VA.tsx", "src/components/VACalculator.tsx"] },
  { path: "/jumbo-loan-calculator", sources: ["src/pages/Jumbo.tsx", "src/components/JumboCalculator.tsx"] },
  { path: "/adjustable-rate-mortgage-calculator", sources: ["src/pages/ARM.tsx", "src/components/ARMCalculator.tsx"] },
  { path: "/second-mortgage-calculator", sources: ["src/pages/SecondMortgage.tsx", "src/components/SecondMortgageCalculator.tsx"] },
  { path: "/heloc-calculator", sources: ["src/pages/Heloc.tsx", "src/components/HelocCalculator.tsx"] },
  { path: "/heloc-debt-consolidation-calculator", sources: ["src/pages/HelocDebtConsolidation.tsx", "src/components/HelocDebtConsolidationCalculator.tsx"] },
  { path: "/refinance-calculator", sources: ["src/pages/Refinance.tsx", "src/components/RefinanceCalculator.tsx"] },
  { path: "/cash-out-refinance-calculator", sources: ["src/pages/CashOutRefi.tsx", "src/components/CashOutRefiCalculator.tsx"] },
  { path: "/house-affordability", sources: ["src/pages/Affordability.tsx", "src/components/AffordabilityCalculator.tsx"] },
  { path: "/mortgage-qualification-calculator", sources: ["src/pages/Qualification.tsx", "src/components/QualificationCalculator.tsx"] },
  { path: "/rent-or-buy", sources: ["src/pages/RentOrBuy.tsx", "src/components/RentOrBuyCalculator.tsx"] },
  { path: "/extra-mortgage-payments-calculator", sources: ["src/pages/ExtraPayments.tsx", "src/components/ExtraPaymentsCalculator.tsx"] },
  { path: "/bi-weekly-mortgage-payments-calculator", sources: ["src/pages/BiWeeklyPayments.tsx", "src/components/BiWeeklyCalculator.tsx"] },
  { path: "/home-buying-calculators", sources: ["src/pages/Hubs.tsx", "src/components/CategoryHub.tsx", "src/lib/calculators.ts"] },
  { path: "/mortgage-loan-types", sources: ["src/pages/Hubs.tsx", "src/components/CategoryHub.tsx", "src/lib/calculators.ts"] },
  { path: "/refinance-and-home-equity-calculators", sources: ["src/pages/Hubs.tsx", "src/components/CategoryHub.tsx", "src/lib/calculators.ts"] },
  { path: "/pay-off-mortgage-early", sources: ["src/pages/Hubs.tsx", "src/components/CategoryHub.tsx", "src/lib/calculators.ts"] },
  { path: "/mortgage-calculator-by-state", sources: ["src/pages/StatesIndex.tsx", "src/lib/states.ts"] },
  ...stateRoutes,
  { path: "/about", sources: ["src/pages/About.tsx"] },
  { path: "/methodology", sources: ["src/pages/Methodology.tsx", "src/lib/loanLimits.ts"] },
  { path: "/privacy-policy", sources: ["src/pages/Privacy.tsx"] },
  { path: "/terms-of-use", sources: ["src/pages/Terms.tsx"] },
  { path: "/mortgage-assistant", sources: ["src/pages/AI.tsx"], indexed: false },
];

module.exports = { routes, SITE: "https://mortgagecalculation.net" };
