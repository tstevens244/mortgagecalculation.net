import { HOME_VALUES } from "../data/homeValues.ts";
import { HIGH_BASELINE, NATIONAL_INSURANCE, states, type StateInfo } from "./states.ts";
import { CONFORMING_LIMIT, CONFORMING_LIMIT_HIGH_COST, FHA_LIMIT_FLOOR } from "./loanLimits.ts";

/*
 * Local housing costs for the calculators' starting values.
 *
 * - Home prices: Zillow Home Value Index by state, refreshed weekly by
 *   scripts/fetch-home-values.cjs (Zillow publishes monthly).
 * - Property tax: the state's effective rate (Tax Foundation, from Census ACS).
 * - Insurance: the state's average HO-3 premium (NAIC), as a share of the state's
 *   median home value, so it scales with the price of the home.
 * Taxes and insurance live in src/lib/states.ts and are updated once a year.
 * PMI isn't regional: it comes from the down payment and credit score (src/lib/pmi.ts).
 * HOA dues depend on the property, not the area, so they're left at $0.
 */

export interface HomeValueRegion {
  /** Bottom third of home values (5th–35th percentile). */
  entry: number;
  /** Middle third (35th–65th percentile): Zillow's "typical home value". */
  typical: number;
  /** Top third (65th–95th percentile). */
  upper: number;
  /** Typical value for the last 13 months, oldest first. */
  history: number[];
}

export interface HomeValues {
  source: string;
  sourceUrl: string;
  /** Month the values are for, YYYY-MM-DD (last day of the month). */
  asOf: string;
  national: HomeValueRegion;
  states: Record<string, HomeValueRegion>;
}

export { HOME_VALUES };

export interface LocalCosts {
  /** Two-letter state code, or null for U.S. figures. */
  code: string | null;
  /** "Texas", or "the U.S." */
  name: string;
  /** Short form for tight spots: "TX" or "U.S." */
  short: string;
  values: HomeValueRegion;
  /** Effective property tax rate, % of value a year. Null for the U.S. (no single figure is used). */
  taxRate: number | null;
  /** Average annual homeowners insurance premium. */
  insurance: number;
  /** Insurance as % of home value a year, to scale the premium with the price. Null for the U.S. */
  insuranceRate: number | null;
}

export function findStateByCode(code: string | null | undefined): StateInfo | undefined {
  return code ? states.find((s) => s.code === code) : undefined;
}

export function localCosts(code: string | null): LocalCosts {
  const state = findStateByCode(code);
  if (!state) {
    return { code: null, name: "the U.S.", short: "U.S.", values: HOME_VALUES.national, taxRate: null, insurance: NATIONAL_INSURANCE, insuranceRate: null };
  }
  return {
    code: state.code,
    name: state.name,
    short: state.code,
    values: HOME_VALUES.states[state.code] ?? HOME_VALUES.national,
    taxRate: state.taxRate,
    insurance: state.insurance,
    insuranceRate: Math.round((state.insurance / state.medianValue) * 100_000) / 1000,
  };
}

/**
 * Which home price fits a calculator:
 * - typical: most calculators (conventional, VA, refinancing, comparisons)
 * - entry:   USDA (rural, lower-priced homes)
 * - fha:     typical, capped so the loan fits under the FHA limit most counties use
 * - jumbo:   the upper tier, but always enough that the loan is above the conforming limit
 */
export type PriceKind = "typical" | "entry" | "fha" | "jumbo";

const roundTo = (v: number, step: number) => Math.round(v / step) * step;

export function localPrice(c: LocalCosts, kind: PriceKind, downPercent = 20): number {
  const v = c.values;
  switch (kind) {
    case "entry":
      return v.entry;
    case "fha": {
      if (c.code && HIGH_BASELINE.has(c.code)) return v.typical;
      const cap = Math.floor(FHA_LIMIT_FLOOR / (1 - 0.035) / 1000) * 1000;
      return Math.min(v.typical, cap);
    }
    case "jumbo": {
      const limit = c.code && HIGH_BASELINE.has(c.code) ? CONFORMING_LIMIT_HIGH_COST : CONFORMING_LIMIT;
      // Loan at least 15% over the limit, in round $25k steps.
      const floor = Math.ceil((limit * 1.15) / (1 - downPercent / 100) / 25_000) * 25_000;
      return Math.max(v.upper, floor);
    }
    default:
      return v.typical;
  }
}

/** Why a price differs from the plain typical value, for the hint under the field. */
export function priceLabel(c: LocalCosts, kind: PriceKind, downPercent = 20): string {
  const price = localPrice(c, kind, downPercent);
  if (kind === "entry") return "Entry-level home value";
  if (kind === "jumbo") return price > c.values.upper ? "Jumbo-size price" : "Upper-tier home value";
  if (kind === "fha" && price < c.values.typical) return "Typical value, capped at the FHA limit";
  return "Typical home value";
}

/** Annual property tax on a price at the local rate, to the dollar. Null when there's no local rate. */
export function localTax(c: LocalCosts, price: number): number | null {
  return c.taxRate === null ? null : Math.round((price * c.taxRate) / 100);
}

/** Annual insurance on a price at the local rate, to the nearest $10. Null when there's no local rate. */
export function localInsurance(c: LocalCosts, price: number): number | null {
  return c.insuranceRate === null ? null : roundTo((price * c.insuranceRate) / 100, 10);
}

/** "Oct 2026" */
export function formatValueMonth(iso: string): string {
  const [y, m] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, 1)).toLocaleDateString("en-US", { month: "short", year: "numeric", timeZone: "UTC" });
}

interface HomeInputs {
  homePrice: number;
  downPayment: number;
  downPaymentPercent: number;
  propertyTax: number;
  homeInsurance: number;
}

/** URL keys of HomeInputs, for useLocalCosts. */
export const HOME_INPUT_KEYS = ["homePrice", "downPayment", "downPaymentPercent", "propertyTax", "homeInsurance"];

/**
 * A calculator's inputs with the local price, tax and insurance. The down payment
 * keeps its percentage. Where there's no local figure (U.S.), the old value stays.
 */
export function withLocalHome<T extends HomeInputs>(prev: T, c: LocalCosts, kind: PriceKind): T {
  const homePrice = localPrice(c, kind, prev.downPaymentPercent);
  return {
    ...prev,
    homePrice,
    downPayment: Math.round((prev.downPaymentPercent / 100) * homePrice),
    propertyTax: localTax(c, homePrice) ?? prev.propertyTax,
    homeInsurance: localInsurance(c, homePrice) ?? prev.homeInsurance,
  };
}

/** Loan on the local typical home with 20% down, in round $5,000s. */
export const localLoan = (c: LocalCosts) => roundTo(c.values.typical * 0.8, 5000);

/** Round a dollar amount the way the calculators' defaults are (nearest $5,000). */
export const round5k = (v: number) => roundTo(v, 5000);
