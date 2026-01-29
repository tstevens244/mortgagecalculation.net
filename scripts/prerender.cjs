const { run } = require("react-snap");

// All routes that need to be prerendered
const routes = [
  "/",
  "/mortgage-assistant/",
  "/conventional-mortgage-calculator/",
  "/fha-loan-calculator/",
  "/usda-loan-calculator/",
  "/va-loan-calculator/",
  "/jumbo-loan-calculator/",
  "/adjustable-rate-mortgage-calculator/",
  "/second-mortgage-calculator/",
  "/heloc-calculator/",
  "/refinance-calculator/",
  "/cash-out-refinance-calculator/",
  "/house-affordability/",
  "/mortgage-qualification-calculator/",
  "/rent-or-buy/",
  "/extra-mortgage-payments-calculator/",
  "/bi-weekly-mortgage-payments-calculator/",
];

run({
  source: "dist",
  destination: "dist",
  include: routes,
  headless: true,
  puppeteerArgs: ["--no-sandbox", "--disable-setuid-sandbox"],
  // Inline critical CSS for faster initial render
  inlineCss: true,
  // Remove script tags for purely static pages (optional - comment out if you need JS)
  // removeScriptTags: true,
  // Use Chrome from environment variable if available (for CI)
  puppeteerExecutablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
  skipThirdPartyRequests: false,
  // Ensure all content is loaded
  waitFor: 1000,
}).catch((error) => {
  console.error("Prerender failed:", error);
  process.exit(1);
});
