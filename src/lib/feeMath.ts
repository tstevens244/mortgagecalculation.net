import { balanceAfter, monthlyPayment, totalBalanceBasedFee } from "./mortgageMath.ts";
import {
  FHA_UPFRONT_MIP_RATE,
  USDA_ANNUAL_FEE_RATE,
  USDA_UPFRONT_FEE_RATE,
  fhaAnnualMipRate,
  fhaMipMonths,
  vaFundingFeeRate,
} from "./loanLimits.ts";

/*
 * Government loan fees: the USDA guarantee fee, the VA funding fee and FHA
 * mortgage insurance. The annual fees follow the loan calculators: recalculated
 * each year on the balance of the base loan (not the financed upfront fee).
 */

/** Monthly annual fee at the start of each loan year, on the base loan's share of the balance. */
function feeByYear(baseLoan: number, totalLoan: number, ratePercent: number, months: number, feePercent: number, chargeMonths: number) {
  const pay = monthlyPayment(totalLoan, ratePercent, months);
  const share = totalLoan > 0 ? baseLoan / totalLoan : 0;
  const years: { year: number; monthly: number }[] = [];
  for (let y = 0; y * 12 < Math.min(chargeMonths, months); y++) {
    const balance = balanceAfter(totalLoan, ratePercent, pay, y * 12);
    years.push({ year: y + 1, monthly: (balance * share * feePercent) / 100 / 12 });
  }
  return years;
}

/** Extra monthly payment and total extra paid (with interest) from adding `fee` to a loan. */
function financingCost(baseLoan: number, fee: number, ratePercent: number, months: number) {
  const monthly = monthlyPayment(baseLoan + fee, ratePercent, months) - monthlyPayment(baseLoan, ratePercent, months);
  return { monthly, total: monthly * months };
}

export interface UsdaFeeInput {
  price: number;
  down: number;
  ratePercent: number;
  /** Add the upfront fee to the loan (most buyers do). */
  financed: boolean;
}

export function usdaFees({ price, down, ratePercent, financed }: UsdaFeeInput) {
  const months = 360;
  const baseLoan = Math.max(0, price - down);
  const upfront = (baseLoan * USDA_UPFRONT_FEE_RATE) / 100;
  const loan = baseLoan + (financed ? upfront : 0);
  const byYear = feeByYear(baseLoan, loan, ratePercent, months, USDA_ANNUAL_FEE_RATE, months);
  const totalAnnual = totalBalanceBasedFee(loan, ratePercent, months, USDA_ANNUAL_FEE_RATE, months) * (loan > 0 ? baseLoan / loan : 0);
  const pi = monthlyPayment(loan, ratePercent, months);
  const firstMonthly = byYear[0]?.monthly ?? 0;
  return {
    baseLoan,
    upfront,
    loan,
    pi,
    firstMonthly,
    byYear,
    totalAnnual,
    totalFees: upfront + totalAnnual,
    financing: financed ? financingCost(baseLoan, upfront, ratePercent, months) : { monthly: 0, total: 0 },
    upfrontRate: USDA_UPFRONT_FEE_RATE,
    annualRate: USDA_ANNUAL_FEE_RATE,
  };
}

export type VaPurpose = "purchase" | "cashout" | "irrrl";

/** VA funding fee (%) for any loan purpose. */
export function vaFeeRate(purpose: VaPurpose, firstUse: boolean, downPercent: number, exempt: boolean): number {
  if (exempt) return 0;
  if (purpose === "irrrl") return 0.5;
  if (purpose === "cashout") return firstUse ? 2.15 : 3.3;
  return vaFundingFeeRate(firstUse, downPercent, false);
}

export interface VaFeeInput {
  purpose: VaPurpose;
  /** Purchase: the home price. Refinances: the new loan amount. */
  amount: number;
  /** Purchase only. */
  down: number;
  firstUse: boolean;
  exempt: boolean;
  financed: boolean;
  ratePercent: number;
  termYears: number;
}

export function vaFees({ purpose, amount, down, firstUse, exempt, financed, ratePercent, termYears }: VaFeeInput) {
  const purchase = purpose === "purchase";
  const baseLoan = Math.max(0, purchase ? amount - down : amount);
  const downPercent = purchase && amount > 0 ? (down / amount) * 100 : 0;
  const rate = vaFeeRate(purpose, firstUse, downPercent, exempt);
  const fee = (baseLoan * rate) / 100;
  const months = termYears * 12;
  const loan = baseLoan + (financed ? fee : 0);
  return {
    baseLoan,
    downPercent,
    rate,
    fee,
    loan,
    pi: monthlyPayment(loan, ratePercent, months),
    financing: financed ? financingCost(baseLoan, fee, ratePercent, months) : { monthly: 0, total: 0 },
  };
}

export interface FhaMipInput {
  price: number;
  down: number;
  ratePercent: number;
  termYears: number;
}

/** FHA upfront and annual MIP. Upfront MIP is always added to the loan here, as almost every borrower does. */
export function fhaMip({ price, down, ratePercent, termYears }: FhaMipInput) {
  const months = termYears * 12;
  const baseLoan = Math.max(0, price - down);
  const ltv = price > 0 ? (baseLoan / price) * 100 : 0;
  const upfront = (baseLoan * FHA_UPFRONT_MIP_RATE) / 100;
  const loan = baseLoan + upfront;
  const annualRate = fhaAnnualMipRate(termYears, ltv, baseLoan);
  const mipMonths = fhaMipMonths(termYears, ltv);
  const monthly = (baseLoan * annualRate) / 100 / 12;
  const totalAnnual = totalBalanceBasedFee(loan, ratePercent, months, annualRate, mipMonths) * (loan > 0 ? baseLoan / loan : 0);
  return {
    baseLoan,
    ltv,
    upfront,
    upfrontRate: FHA_UPFRONT_MIP_RATE,
    loan,
    annualRate,
    mipMonths,
    lifeOfLoan: mipMonths >= months,
    monthly,
    byYear: feeByYear(baseLoan, loan, ratePercent, months, annualRate, mipMonths),
    totalAnnual,
    totalMip: upfront + totalAnnual,
    pi: monthlyPayment(loan, ratePercent, months),
  };
}
