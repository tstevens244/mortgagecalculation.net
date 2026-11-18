import type { LucideIcon } from "lucide-react";
import { SITE_URL } from "@/lib/site";
import {
  Activity,
  Banknote,
  ArrowLeftRight,
  CalendarDays,
  CalendarRange,
  Coins,
  Calculator,
  CreditCard,
  FileCheck,
  Gem,
  Home,
  KeyRound,
  Landmark,
  Layers,
  ListChecks,
  Medal,
  PiggyBank,
  RefreshCw,
  Scale,
  Trees,
  Wallet,
} from "lucide-react";

export interface CalculatorInfo {
  path: string;
  /** Full name, used in menus and cards. */
  name: string;
  /** Short name for breadcrumbs and tight spaces. */
  shortName: string;
  /** One line on what the calculator answers. */
  description: string;
  icon: LucideIcon;
}

export interface CalculatorGroup {
  id: string;
  title: string;
  /** Shorter title for the desktop header menu. */
  navTitle: string;
  description: string;
  /** URL of the group's hub page, with leading and trailing slash. */
  hubPath: string;
  /** Hub page name, used in its H1, breadcrumbs and "see all" links. */
  hubName: string;
  calculators: CalculatorInfo[];
}

/** Every calculator, grouped by what the visitor is trying to do. Drives the menus, finder and related links. */
export const calculatorGroups: CalculatorGroup[] = [
  {
    id: "buying",
    hubPath: "/home-buying-calculators/",
    hubName: "Home Buying Calculators",
    title: "Buying a home",
    navTitle: "Buying",
    description: "Payments, budget and whether to buy at all.",
    calculators: [
      { path: "/", name: "Mortgage Calculator", shortName: "Mortgage", description: "Monthly payment with taxes, insurance and PMI.", icon: Calculator },
      { path: "/house-affordability/", name: "How Much House Can I Afford?", shortName: "Affordability", description: "Your price range from income, debts or a monthly budget.", icon: Wallet },
      { path: "/mortgage-qualification-calculator/", name: "Mortgage Qualification", shortName: "Qualification", description: "The income you need for a specific home price.", icon: FileCheck },
      { path: "/rent-or-buy/", name: "Rent or Buy", shortName: "Rent or Buy", description: "Compare the full cost of renting and owning.", icon: Scale },
    ],
  },
  {
    id: "loan-types",
    hubPath: "/mortgage-loan-types/",
    hubName: "Mortgage Loan Types",
    title: "Loan types",
    navTitle: "Loan types",
    description: "Payments with each program's own fees and rules.",
    calculators: [
      { path: "/conventional-mortgage-calculator/", name: "Conventional Loan", shortName: "Conventional", description: "Standard loans with PMI under 20% down.", icon: Landmark },
      { path: "/fha-loan-calculator/", name: "FHA Loan", shortName: "FHA", description: "3.5% down, with upfront and annual MIP.", icon: Home },
      { path: "/va-loan-calculator/", name: "VA Loan", shortName: "VA", description: "0% down for veterans, with the funding fee.", icon: Medal },
      { path: "/usda-loan-calculator/", name: "USDA Loan", shortName: "USDA", description: "0% down in eligible rural areas.", icon: Trees },
      { path: "/jumbo-loan-calculator/", name: "Jumbo Loan", shortName: "Jumbo", description: "Loans above the conforming limit.", icon: Gem },
      { path: "/adjustable-rate-mortgage-calculator/", name: "Adjustable-Rate Mortgage", shortName: "ARM", description: "How the payment changes after the fixed period.", icon: Activity },
    ],
  },
  {
    id: "compare",
    hubPath: "/compare-mortgage-options/",
    hubName: "Compare Mortgage Options",
    title: "Compare options",
    navTitle: "Compare",
    description: "Side by side: terms, loan types, points and offers.",
    calculators: [
      { path: "/15-vs-30-year-mortgage-calculator/", name: "15 vs. 30-Year Mortgage", shortName: "15 vs. 30 Year", description: "Payment, interest and equity for each term.", icon: CalendarRange },
      { path: "/fha-vs-conventional-calculator/", name: "FHA vs. Conventional", shortName: "FHA vs. Conventional", description: "Which loan costs less for your down payment.", icon: ArrowLeftRight },
      { path: "/mortgage-points-calculator/", name: "Mortgage Points", shortName: "Points", description: "Is buying down the rate worth it?", icon: Coins },
      { path: "/mortgage-comparison-calculator/", name: "Compare Loan Offers", shortName: "Loan Offers", description: "Up to 3 offers by APR and total cost.", icon: ListChecks },
    ],
  },
  {
    id: "equity",
    hubPath: "/refinance-and-home-equity-calculators/",
    hubName: "Refinance & Home Equity Calculators",
    title: "Refinance & home equity",
    navTitle: "Refinance & equity",
    description: "Lower your rate or borrow against your home.",
    calculators: [
      { path: "/refinance-calculator/", name: "Refinance", shortName: "Refinance", description: "Savings and break-even point of a new loan.", icon: RefreshCw },
      { path: "/cash-out-refinance-calculator/", name: "Cash-Out Refinance", shortName: "Cash-Out Refi", description: "How much equity you can take out.", icon: Banknote },
      { path: "/heloc-calculator/", name: "HELOC", shortName: "HELOC", description: "Credit line and draw and repayment payments.", icon: KeyRound },
      { path: "/heloc-debt-consolidation-calculator/", name: "HELOC Debt Consolidation", shortName: "HELOC Debt Payoff", description: "Pay off debts with a HELOC, or keep them?", icon: CreditCard },
      { path: "/second-mortgage-calculator/", name: "Second Mortgage", shortName: "Second Mortgage", description: "Piggyback loan vs. paying PMI.", icon: Layers },
    ],
  },
  {
    id: "payoff",
    hubPath: "/pay-off-mortgage-early/",
    hubName: "Pay Off Your Mortgage Early",
    title: "Pay off faster",
    navTitle: "Pay off early",
    description: "Save interest and own your home sooner.",
    calculators: [
      { path: "/extra-mortgage-payments-calculator/", name: "Extra Payments", shortName: "Extra Payments", description: "Interest saved by paying a little more.", icon: PiggyBank },
      { path: "/bi-weekly-mortgage-payments-calculator/", name: "Bi-Weekly Payments", shortName: "Bi-Weekly", description: "Half payments every two weeks.", icon: CalendarDays },
    ],
  },
];

export const allCalculators = calculatorGroups.flatMap((g) => g.calculators);

/** Group whose hub page is at `pathname`. */
export function findHub(pathname: string): CalculatorGroup | null {
  const normalized = `${pathname.replace(/\/+$/, "")}/`;
  return calculatorGroups.find((g) => g.hubPath === normalized) ?? null;
}

/** BreadcrumbList schema matching the visible Home › Hub › Calculator trail. */
export function calculatorBreadcrumbSchema(path: string) {
  const found = findCalculator(path);
  if (!found) throw new Error(`Unknown calculator path ${path}`);
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: found.group.hubName, item: `${SITE_URL}${found.group.hubPath}` },
      { "@type": "ListItem", position: 3, name: found.calculator.name, item: `${SITE_URL}${found.calculator.path}` },
    ],
  };
}

/** Calculator and group for a URL path, with or without the trailing slash. */
export function findCalculator(pathname: string): { calculator: CalculatorInfo; group: CalculatorGroup } | null {
  const normalized = pathname === "/" ? "/" : `${pathname.replace(/\/+$/, "")}/`;
  for (const group of calculatorGroups) {
    const calculator = group.calculators.find((c) => c.path === normalized);
    if (calculator) return { calculator, group };
  }
  return null;
}
