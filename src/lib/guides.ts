/** Guide articles. Drives the guides index, routes, sitemap sources and "more guides" links. */
export interface GuideInfo {
  slug: string;
  title: string;
  /** Short card description. */
  summary: string;
  published: string;
  updated: string;
  /** Calculator paths to feature in the article's call-to-action. */
  calculators: string[];
}

export const GUIDES_PATH = "/guides/";

export const guides: GuideInfo[] = [
  {
    slug: "how-much-house-can-i-afford-by-salary",
    title: "How Much House Can I Afford on My Salary?",
    summary: "Home prices you can afford at salaries from $40,000 to $250,000, using the rules lenders use.",
    published: "2026-11-17",
    updated: "2026-11-17",
    calculators: ["/house-affordability/", "/mortgage-qualification-calculator/"],
  },
  {
    slug: "mortgage-payment-by-home-price",
    title: "Monthly Mortgage Payment by Home Price",
    summary: "The payment on a $200,000 to $1 million home, and how much each rate change adds.",
    published: "2026-11-17",
    updated: "2026-11-17",
    calculators: ["/", "/15-vs-30-year-mortgage-calculator/"],
  },
  {
    slug: "how-to-get-rid-of-pmi",
    title: "How to Get Rid of PMI",
    summary: "When PMI ends on its own, how to cancel it sooner, and what's different for FHA loans.",
    published: "2026-11-17",
    updated: "2026-11-17",
    calculators: ["/extra-mortgage-payments-calculator/", "/second-mortgage-calculator/"],
  },
  {
    slug: "debt-to-income-ratio-for-mortgage",
    title: "Debt-to-Income Ratio for a Mortgage",
    summary: "How lenders calculate DTI, the limits for each loan type, and how to lower yours.",
    published: "2026-11-17",
    updated: "2026-11-17",
    calculators: ["/mortgage-qualification-calculator/", "/house-affordability/"],
  },
  {
    slug: "how-mortgage-amortization-works",
    title: "How Mortgage Amortization Works",
    summary: "Why early payments are mostly interest, and when your payments start building real equity.",
    published: "2026-11-17",
    updated: "2026-11-17",
    calculators: ["/", "/extra-mortgage-payments-calculator/"],
  },
];

export const guidePath = (g: Pick<GuideInfo, "slug">) => `${GUIDES_PATH}${g.slug}/`;
