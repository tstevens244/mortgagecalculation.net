import { ComponentType, lazy } from "react";
import { states, statePath, type CountyRow } from "./lib/states";

type PageModule = { default: ComponentType };

export interface LazyPage {
  (): JSX.Element;
  /** Loads the page's code. Once resolved, the page renders without suspending. */
  preload: () => Promise<void>;
}

/**
 * Like React.lazy, but once preload() has resolved the page renders
 * synchronously. main.tsx preloads the current URL's page before the first
 * render, so React never swaps the prerendered HTML for an empty Suspense
 * fallback while the page's code downloads.
 */
function lazyPage(load: () => Promise<PageModule>): LazyPage {
  let Loaded: ComponentType | null = null;
  const preload = () =>
    load().then((m) => {
      Loaded = m.default;
    });
  const Lazy = lazy(() => preload().then(() => ({ default: Loaded as ComponentType })));
  const Page = (() => (Loaded ? <Loaded /> : <Lazy />)) as LazyPage;
  Page.preload = preload;
  return Page;
}

/** A state's mortgage calculator page: the shared page code plus that state's county data. */
function statePage(slug: string): LazyPage {
  const state = states.find((s) => s.slug === slug)!;
  let Bound: ComponentType | null = null;
  return lazyPage(() =>
    Promise.all([import("./pages/StateMortgage"), import(`./data/states/${slug}.json`)]).then(([m, data]) => {
      if (!Bound) {
        const Page = m.default;
        const counties = (data as { default: { counties: CountyRow[] } }).default.counties;
        Bound = () => <Page state={state} counties={counties} />;
      }
      return { default: Bound };
    }),
  );
}

/** Public pages. Keep in sync with scripts/routes.cjs (prerender, sitemap, SEO check). */
export const pages: { path: string; Component: LazyPage }[] = [
  { path: "/", Component: lazyPage(() => import("./pages/Index")) },
  { path: "/mortgage-assistant", Component: lazyPage(() => import("./pages/AI")) },
  { path: "/conventional-mortgage-calculator", Component: lazyPage(() => import("./pages/Conventional")) },
  { path: "/fha-loan-calculator", Component: lazyPage(() => import("./pages/FHA")) },
  { path: "/usda-loan-calculator", Component: lazyPage(() => import("./pages/USDA")) },
  { path: "/va-loan-calculator", Component: lazyPage(() => import("./pages/VA")) },
  { path: "/jumbo-loan-calculator", Component: lazyPage(() => import("./pages/Jumbo")) },
  { path: "/adjustable-rate-mortgage-calculator", Component: lazyPage(() => import("./pages/ARM")) },
  { path: "/second-mortgage-calculator", Component: lazyPage(() => import("./pages/SecondMortgage")) },
  { path: "/heloc-calculator", Component: lazyPage(() => import("./pages/Heloc")) },
  { path: "/heloc-debt-consolidation-calculator", Component: lazyPage(() => import("./pages/HelocDebtConsolidation")) },
  { path: "/refinance-calculator", Component: lazyPage(() => import("./pages/Refinance")) },
  { path: "/cash-out-refinance-calculator", Component: lazyPage(() => import("./pages/CashOutRefi")) },
  { path: "/house-affordability", Component: lazyPage(() => import("./pages/Affordability")) },
  { path: "/mortgage-qualification-calculator", Component: lazyPage(() => import("./pages/Qualification")) },
  { path: "/rent-or-buy", Component: lazyPage(() => import("./pages/RentOrBuy")) },
  { path: "/extra-mortgage-payments-calculator", Component: lazyPage(() => import("./pages/ExtraPayments")) },
  { path: "/bi-weekly-mortgage-payments-calculator", Component: lazyPage(() => import("./pages/BiWeeklyPayments")) },
  { path: "/home-buying-calculators", Component: lazyPage(() => import("./pages/Hubs").then((m) => ({ default: m.BuyingHub }))) },
  { path: "/mortgage-loan-types", Component: lazyPage(() => import("./pages/Hubs").then((m) => ({ default: m.LoanTypesHub }))) },
  { path: "/refinance-and-home-equity-calculators", Component: lazyPage(() => import("./pages/Hubs").then((m) => ({ default: m.EquityHub }))) },
  { path: "/pay-off-mortgage-early", Component: lazyPage(() => import("./pages/Hubs").then((m) => ({ default: m.PayoffHub }))) },
  { path: "/mortgage-calculator-by-state", Component: lazyPage(() => import("./pages/StatesIndex")) },
  ...states.map((s) => ({ path: statePath(s).slice(0, -1), Component: statePage(s.slug) })),
  { path: "/compare-mortgage-options", Component: lazyPage(() => import("./pages/Hubs").then((m) => ({ default: m.CompareHub }))) },
  { path: "/15-vs-30-year-mortgage-calculator", Component: lazyPage(() => import("./pages/compare/TermComparison")) },
  { path: "/fha-vs-conventional-calculator", Component: lazyPage(() => import("./pages/compare/FhaVsConventional")) },
  { path: "/mortgage-points-calculator", Component: lazyPage(() => import("./pages/compare/Points")) },
  { path: "/mortgage-comparison-calculator", Component: lazyPage(() => import("./pages/compare/LoanOffers")) },
  { path: "/guides", Component: lazyPage(() => import("./pages/GuidesIndex")) },
  { path: "/guides/how-much-house-can-i-afford-by-salary", Component: lazyPage(() => import("./pages/guides/AffordBySalary")) },
  { path: "/guides/mortgage-payment-by-home-price", Component: lazyPage(() => import("./pages/guides/PaymentByPrice")) },
  { path: "/guides/how-to-get-rid-of-pmi", Component: lazyPage(() => import("./pages/guides/RemovePmi")) },
  { path: "/guides/debt-to-income-ratio-for-mortgage", Component: lazyPage(() => import("./pages/guides/DebtToIncome")) },
  { path: "/guides/how-mortgage-amortization-works", Component: lazyPage(() => import("./pages/guides/Amortization")) },
  { path: "/about", Component: lazyPage(() => import("./pages/About")) },
  { path: "/methodology", Component: lazyPage(() => import("./pages/Methodology")) },
  { path: "/privacy-policy", Component: lazyPage(() => import("./pages/Privacy")) },
  { path: "/terms-of-use", Component: lazyPage(() => import("./pages/Terms")) },
];

export const NotFoundPage = lazyPage(() => import("./pages/NotFound"));

/** Loads the code for the page at `pathname` (or the 404 page). */
export function preloadPage(pathname: string): Promise<void> {
  const normalized = pathname !== "/" ? pathname.replace(/\/+$/, "") : "/";
  const match = pages.find((p) => p.path === normalized);
  return (match ? match.Component : NotFoundPage).preload().catch(() => undefined);
}
