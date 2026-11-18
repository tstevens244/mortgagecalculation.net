// Math for the comparison calculators (15 vs. 30 years, FHA vs. conventional,
// points, loan offers). Pure functions, tested in scripts/test-math.ts.
import { balanceAfter, monthlyPayment, monthsUntilBalance, totalBalanceBasedFee } from "./mortgageMath.ts";
import { FHA_UPFRONT_MIP_RATE, fhaAnnualMipRate, fhaMipMonths } from "./loanLimits.ts";

export interface Horizon {
  /** Monthly principal and interest. */
  payment: number;
  /** Payments counted: the horizon or the full term, whichever is shorter. */
  months: number;
  /** Principal and interest paid in those months. */
  paid: number;
  /** Balance still owed afterwards. */
  balance: number;
  /** Interest paid in those months. */
  interest: number;
}

/** A fixed-rate loan over its first `horizonMonths` (or its full term). */
export function loanOverHorizon(principal: number, ratePercent: number, termMonths: number, horizonMonths: number): Horizon {
  const payment = monthlyPayment(principal, ratePercent, termMonths);
  const months = Math.min(horizonMonths, termMonths);
  const balance = months >= termMonths ? 0 : balanceAfter(principal, ratePercent, payment, months);
  const paid = payment * months;
  return { payment, months, paid, balance, interest: paid - (principal - balance) };
}

/**
 * Annual percentage rate: the rate at which the monthly payment repays the
 * loan amount minus prepaid finance charges (points and lender fees).
 */
export function apr(principal: number, ratePercent: number, termMonths: number, financeCharges: number): number {
  if (financeCharges <= 0) return ratePercent;
  const net = principal - financeCharges;
  if (net <= 0) return NaN;
  const payment = monthlyPayment(principal, ratePercent, termMonths);
  let lo = ratePercent;
  let hi = ratePercent + 50;
  for (let i = 0; i < 100; i++) {
    const mid = (lo + hi) / 2;
    if (monthlyPayment(net, mid, termMonths) > payment) hi = mid;
    else lo = mid;
  }
  return (lo + hi) / 2;
}

// --- 15 vs. 30 years -----------------------------------------------------------

export function termComparison(loan: number, rate30: number, rate15: number) {
  const thirty = loanOverHorizon(loan, rate30, 360, 360);
  const fifteen = loanOverHorizon(loan, rate15, 180, 180);
  const balances = [5, 10, 15, 20, 25].map((year) => ({
    year,
    thirty: balanceAfter(loan, rate30, thirty.payment, year * 12),
    fifteen: year >= 15 ? 0 : balanceAfter(loan, rate15, fifteen.payment, year * 12),
  }));
  return {
    thirty,
    fifteen,
    paymentDifference: fifteen.payment - thirty.payment,
    interestSaved: thirty.interest - fifteen.interest,
    balances,
  };
}

// --- Points --------------------------------------------------------------------

export interface PointsInputs {
  loan: number;
  baseRate: number;
  points: number;
  /** Rate reduction per point, in percentage points (often 0.25). */
  reductionPerPoint: number;
  termMonths: number;
  horizonMonths: number;
}

export function pointsAnalysis(i: PointsInputs) {
  const cost = (i.loan * i.points) / 100;
  const newRate = Math.max(0, i.baseRate - i.points * i.reductionPerPoint);
  const without = loanOverHorizon(i.loan, i.baseRate, i.termMonths, i.horizonMonths);
  const withPts = loanOverHorizon(i.loan, newRate, i.termMonths, i.horizonMonths);
  const monthlySavings = without.payment - withPts.payment;
  const breakEvenMonths = monthlySavings > 0 ? Math.ceil(cost / monthlySavings) : Infinity;
  // Lower rate also pays the balance down faster, so compare payments plus balance left.
  const netSavings = without.paid + without.balance - (withPts.paid + withPts.balance) - cost;
  return { cost, newRate, without, withPts, monthlySavings, breakEvenMonths, netSavings };
}

// --- FHA vs. conventional --------------------------------------------------------

export interface FhaVsConventionalInputs {
  price: number;
  downPercent: number;
  termYears: number;
  fhaRate: number;
  convRate: number;
  /** Conventional PMI, % of the loan a year. */
  pmiRate: number;
  horizonYears: number;
}

export function fhaVsConventional(i: FhaVsConventionalInputs) {
  const term = i.termYears * 12;
  const horizon = Math.min(i.horizonYears * 12, term);
  const base = i.price * (1 - i.downPercent / 100);
  const ltv = 100 - i.downPercent;

  // FHA: upfront MIP financed into the loan; annual MIP on the base loan, recalculated yearly.
  const upfrontMip = (base * FHA_UPFRONT_MIP_RATE) / 100;
  const fhaLoan = base + upfrontMip;
  const mipRate = fhaAnnualMipRate(i.termYears, ltv, base);
  const mipMonths = fhaMipMonths(i.termYears, ltv);
  const fha = loanOverHorizon(fhaLoan, i.fhaRate, term, horizon);
  const fhaMonthlyMi = (base * mipRate) / 100 / 12;
  const fhaMi = totalBalanceBasedFee(fhaLoan, i.fhaRate, term, mipRate, Math.min(mipMonths, horizon)) * (base / fhaLoan);

  // Conventional: PMI on the original loan until the balance reaches 78% of the price.
  const conv = loanOverHorizon(base, i.convRate, term, horizon);
  const hasPmi = i.downPercent < 20;
  const pmiMonths = hasPmi ? monthsUntilBalance(base, i.convRate, term, i.price * 0.78) : 0;
  const convMonthlyMi = hasPmi ? (base * i.pmiRate) / 100 / 12 : 0;
  const convMi = convMonthlyMi * Math.min(pmiMonths, horizon);

  // Cost of borrowing over the horizon: everything paid, plus what's still owed, minus the cash borrowed.
  const fhaCost = fha.paid + fhaMi + fha.balance - base;
  const convCost = conv.paid + convMi + conv.balance - base;

  return {
    base,
    horizonMonths: horizon,
    fha: {
      loan: fhaLoan,
      upfrontMip,
      mipRate,
      mipMonths,
      payment: fha.payment + fhaMonthlyMi,
      pi: fha.payment,
      monthlyMi: fhaMonthlyMi,
      miPaid: fhaMi,
      balance: fha.balance,
      cost: fhaCost,
    },
    conv: {
      loan: base,
      pmiMonths,
      payment: conv.payment + convMonthlyMi,
      pi: conv.payment,
      monthlyMi: convMonthlyMi,
      miPaid: convMi,
      balance: conv.balance,
      cost: convCost,
    },
  };
}

// --- Loan offers ------------------------------------------------------------------

export interface Offer {
  rate: number;
  /** Points and lender fees paid up front, in dollars. */
  upfront: number;
}

export function compareOffers(loan: number, termMonths: number, horizonMonths: number, offers: Offer[]) {
  return offers.map((o) => {
    const h = loanOverHorizon(loan, o.rate, termMonths, horizonMonths);
    return {
      ...o,
      payment: h.payment,
      apr: apr(loan, o.rate, termMonths, o.upfront),
      // Up-front costs plus interest, counting principal still owed as not yet paid.
      cost: o.upfront + h.interest,
      balance: h.balance,
    };
  });
}
