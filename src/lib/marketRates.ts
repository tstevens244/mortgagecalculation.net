import { MARKET_RATES } from "../data/marketRates.ts";

export interface MarketRates {
  source: string;
  sourceUrl: string;
  /** Survey week, YYYY-MM-DD. */
  asOf: string;
  rate30: number;
  rate15: number;
  prev30: number;
  prev15: number;
  /** Last 52 weeks, oldest first. */
  history: { date: string; r30: number; r15: number }[];
}

export { MARKET_RATES };

/**
 * National average fixed rate for a loan term. Freddie Mac surveys 30- and 15-year
 * loans; 20- and 25-year loans fall between the two, so they're interpolated.
 */
export function averageRate(termYears: number, rates: MarketRates = MARKET_RATES): number {
  if (termYears <= 15) return rates.rate15;
  if (termYears >= 30) return rates.rate30;
  const t = (termYears - 15) / 15;
  return Math.round((rates.rate15 + (rates.rate30 - rates.rate15) * t) * 100) / 100;
}

/** "Nov 25, 2026" */
export function formatSurveyDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
}
