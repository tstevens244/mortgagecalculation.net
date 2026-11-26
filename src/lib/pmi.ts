/*
 * Typical borrower-paid monthly PMI rates (annual % of the loan) for a 30-year
 * fixed conventional loan with standard coverage, one borrower and a DTI under
 * 45%. Built from the published rate cards of the large mortgage insurers; real
 * quotes vary by insurer, loan size and DTI, so treat these as estimates.
 */

export const CREDIT_TIERS = [
  { min: 760, label: "760+" },
  { min: 740, label: "740–759" },
  { min: 720, label: "720–739" },
  { min: 700, label: "700–719" },
  { min: 680, label: "680–699" },
  { min: 660, label: "660–679" },
  { min: 640, label: "640–659" },
  { min: 620, label: "620–639" },
] as const;

export type CreditTier = (typeof CREDIT_TIERS)[number]["min"];

// Rows: loan-to-value bands. Columns: CREDIT_TIERS order (760+ … 620–639).
const RATES: { maxLtv: number; rates: number[] }[] = [
  { maxLtv: 85, rates: [0.19, 0.2, 0.23, 0.26, 0.29, 0.39, 0.42, 0.47] },
  { maxLtv: 90, rates: [0.28, 0.38, 0.46, 0.55, 0.65, 0.87, 0.94, 1.04] },
  { maxLtv: 95, rates: [0.38, 0.53, 0.66, 0.78, 0.92, 1.24, 1.34, 1.49] },
  { maxLtv: 97, rates: [0.58, 0.7, 0.87, 0.99, 1.21, 1.54, 1.65, 1.86] },
];

/** The tier a score falls in; below 620 uses the lowest tier (most conventional loans need 620). */
export function creditTier(score: number): CreditTier {
  return (CREDIT_TIERS.find((t) => score >= t.min) ?? CREDIT_TIERS[CREDIT_TIERS.length - 1]).min;
}

/** Estimated annual PMI rate (%) for a loan-to-value and credit score. 0 at 80% LTV or less. */
export function pmiRate(ltvPercent: number, score: number): number {
  if (ltvPercent <= 80) return 0;
  const col = CREDIT_TIERS.findIndex((t) => t.min === creditTier(score));
  const row = RATES.find((r) => ltvPercent <= r.maxLtv + 1e-9) ?? RATES[RATES.length - 1];
  return row.rates[col];
}

export const tierLabel = (min: number) => CREDIT_TIERS.find((t) => t.min === min)?.label ?? `${min}+`;
