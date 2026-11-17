// Program limits and fee schedules used by the calculators and the guide text.
// Update this one file each year (FHFA and HUD publish next-year limits in late
// November) and every calculator and page picks up the new figures.
//
// Sources:
// - Conforming limits: FHFA, Conforming Loan Limit Values for 2026.
// - FHA limits: HUD, 2026 FHA single-family forward mortgage limits.
// - FHA MIP: HUD Mortgagee Letter 2023-05 (annual MIP reduction, effective March 20, 2023).
// - VA funding fee: VA funding fee chart for loans closed on or after April 7, 2023.
// - USDA fees: USDA Single Family Housing Guaranteed Loan Program fee schedule.

export const LIMITS_YEAR = 2026;

/** Date the figures in this file were last checked against the sources above. */
export const FIGURES_REVIEWED = "2026-11-17";

// One-unit property limits.
export const CONFORMING_LIMIT = 832_750;
export const CONFORMING_LIMIT_HIGH_COST = 1_249_125;
export const FHA_LIMIT_FLOOR = 541_287;
export const FHA_LIMIT_CEILING = 1_249_125;

// --- FHA mortgage insurance -------------------------------------------------

export const FHA_UPFRONT_MIP_RATE = 1.75;
/** Base loan amount above which the higher annual MIP schedule applies (ML 2023-05). */
export const FHA_MIP_LARGE_LOAN_THRESHOLD = 726_200;

/** Annual FHA MIP rate (%) by term, loan-to-value and base loan amount. */
export function fhaAnnualMipRate(loanTermYears: number, ltvPercent: number, baseLoanAmount: number): number {
  const large = baseLoanAmount > FHA_MIP_LARGE_LOAN_THRESHOLD;
  if (loanTermYears > 15) {
    if (large) return ltvPercent <= 95 ? 0.7 : 0.75;
    return ltvPercent <= 95 ? 0.5 : 0.55;
  }
  if (large) {
    if (ltvPercent <= 78) return 0.15;
    if (ltvPercent <= 90) return 0.4;
    return 0.65;
  }
  return ltvPercent <= 90 ? 0.15 : 0.4;
}

/** Months annual MIP is charged: 11 years with 10%+ down (LTV <= 90%), otherwise the full term. */
export function fhaMipMonths(loanTermYears: number, ltvPercent: number): number {
  const termMonths = loanTermYears * 12;
  return ltvPercent <= 90 ? Math.min(132, termMonths) : termMonths;
}

// --- VA funding fee ----------------------------------------------------------

/**
 * VA funding fee (%) for a purchase or construction loan. Since 2020 the rate is
 * the same for regular military and Reserves/National Guard.
 */
export function vaFundingFeeRate(firstTimeUse: boolean, downPaymentPercent: number, exempt: boolean): number {
  if (exempt) return 0;
  if (downPaymentPercent >= 10) return 1.25;
  if (downPaymentPercent >= 5) return 1.5;
  return firstTimeUse ? 2.15 : 3.3;
}

// --- USDA guarantee fees -----------------------------------------------------

export const USDA_UPFRONT_FEE_RATE = 1.0;
export const USDA_ANNUAL_FEE_RATE = 0.35;
