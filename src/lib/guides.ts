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
    title: "How to Remove PMI From Your Mortgage",
    summary: "How to remove PMI: when it ends on its own, how to cancel it sooner, and what's different for FHA loans.",
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
  {
    slug: "usda-loan-requirements-and-limits",
    title: "USDA Loan Requirements and Limits",
    summary: "Income limits, the 1% and 0.35% fees, which homes qualify, and how much you can borrow by income.",
    published: "2026-11-22",
    updated: "2026-11-22",
    calculators: ["/usda-loan-calculator/", "/usda-funding-fee-calculator/"],
  },
  {
    slug: "how-adjustable-rate-mortgages-work",
    title: "How ARM Rates Adjust: Index, Margin and Caps",
    summary: "The fully indexed rate, 2/1/5 caps, a worked 5/6 ARM example, and when an ARM beats a fixed rate.",
    published: "2026-11-22",
    updated: "2026-11-22",
    calculators: ["/adjustable-rate-mortgage-calculator/", "/"],
  },
  {
    slug: "piggyback-loan-vs-pmi",
    title: "Piggyback Loan vs. PMI",
    summary: "80/10/10 vs. one loan with PMI at three credit tiers, and when each one wins.",
    published: "2026-11-22",
    updated: "2026-11-22",
    calculators: ["/second-mortgage-calculator/", "/"],
  },
  {
    slug: "how-much-equity-to-refinance",
    title: "How Much Equity Do You Need to Refinance?",
    summary: "Equity rules by loan type, the 80% cash-out limit, and how much cash you can take out.",
    published: "2026-11-22",
    updated: "2026-11-22",
    calculators: ["/cash-out-refinance-calculator/", "/refinance-calculator/"],
  },
  {
    slug: "fha-mortgage-insurance-mip",
    title: "FHA Mortgage Insurance (MIP) Explained",
    summary: "Upfront and annual MIP rates, how to calculate your premium, and when it ends.",
    published: "2026-11-22",
    updated: "2026-11-22",
    calculators: ["/fha-mip-calculator/", "/fha-loan-calculator/", "/fha-vs-conventional-calculator/"],
  },
  {
    slug: "jumbo-loan-requirements",
    title: "Jumbo Loan Requirements and Limits",
    summary: "When a loan becomes jumbo, typical credit and down payment rules, and how much you can borrow.",
    published: "2026-11-22",
    updated: "2026-11-22",
    calculators: ["/jumbo-loan-calculator/", "/second-mortgage-calculator/"],
  },
  {
    slug: "is-refinancing-worth-it",
    title: "Is Refinancing Worth It?",
    summary: "How to find your break-even point, the cost of restarting your term, and when refinancing pays.",
    published: "2026-11-22",
    updated: "2026-11-22",
    calculators: ["/refinance-calculator/", "/cash-out-refinance-calculator/"],
  },
  {
    slug: "va-funding-fee",
    title: "VA Funding Fee: Rates and Exemptions",
    summary: "Funding fee rates by down payment, who's exempt, and what financing the fee costs.",
    published: "2026-11-22",
    updated: "2026-11-22",
    calculators: ["/va-funding-fee-calculator/", "/va-loan-calculator/"],
  },
];

export const guidePath = (g: Pick<GuideInfo, "slug">) => `${GUIDES_PATH}${g.slug}/`;
