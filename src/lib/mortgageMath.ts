// Shared mortgage math. Pure functions with no React or DOM, so they can be
// tested directly: `npm test` runs scripts/test-math.ts against known values.

/** Monthly principal and interest for a fully amortizing loan. */
export function monthlyPayment(principal: number, annualRatePercent: number, months: number): number {
  if (principal <= 0 || months <= 0) return 0;
  const r = annualRatePercent / 100 / 12;
  if (r === 0) return principal / months;
  const f = Math.pow(1 + r, months);
  return (principal * r * f) / (f - 1);
}

/** Loan balance after `paid` monthly payments of `payment` at a fixed rate. */
export function balanceAfter(principal: number, annualRatePercent: number, payment: number, paid: number): number {
  const r = annualRatePercent / 100 / 12;
  let balance = principal;
  for (let i = 0; i < paid && balance > 0; i++) {
    balance = Math.max(0, balance - (payment - balance * r));
  }
  return balance;
}

/**
 * Number of monthly payments until the balance falls to `targetBalance` or
 * below (e.g. 78% of the home's original value, when PMI ends automatically).
 * Returns 0 if it already is.
 */
export function monthsUntilBalance(
  principal: number,
  annualRatePercent: number,
  months: number,
  targetBalance: number,
): number {
  if (principal <= targetBalance) return 0;
  const r = annualRatePercent / 100 / 12;
  const pay = monthlyPayment(principal, annualRatePercent, months);
  let balance = principal;
  for (let m = 1; m <= months; m++) {
    balance -= pay - balance * r;
    if (balance <= targetBalance + 1e-6) return m;
  }
  return months;
}

/**
 * Sum of an annual charge set each year as a % of the balance at the start of
 * that year (how FHA annual MIP and the USDA annual fee are recalculated),
 * charged for `chargeMonths` months.
 */
export function totalBalanceBasedFee(
  principal: number,
  annualRatePercent: number,
  months: number,
  feeRatePercent: number,
  chargeMonths: number,
): number {
  const r = annualRatePercent / 100 / 12;
  const pay = monthlyPayment(principal, annualRatePercent, months);
  let balance = principal;
  let total = 0;
  let monthlyFee = 0;
  for (let m = 0; m < Math.min(chargeMonths, months); m++) {
    if (m % 12 === 0) monthlyFee = (balance * feeRatePercent) / 100 / 12;
    total += monthlyFee;
    balance -= pay - balance * r;
  }
  return total;
}

/** Months to pay off a balance with a fixed payment, or Infinity if the payment doesn't cover interest. */
export function monthsToPayoff(balance: number, annualRatePercent: number, payment: number): number {
  if (balance <= 0) return 0;
  if (payment <= 0) return Infinity;
  const r = annualRatePercent / 100 / 12;
  if (r === 0) return Math.ceil(balance / payment);
  if (payment <= balance * r) return Infinity;
  return Math.ceil(-Math.log(1 - (balance * r) / payment) / Math.log(1 + r));
}

/** Total paid on a balance with a fixed payment, with the last payment reduced to what's owed. */
export function totalPaidOnBalance(balance: number, annualRatePercent: number, payment: number): number {
  const n = monthsToPayoff(balance, annualRatePercent, payment);
  if (!Number.isFinite(n)) return Infinity;
  const r = annualRatePercent / 100 / 12;
  let b = balance;
  let total = 0;
  for (let m = 0; m < n && b > 0.005; m++) {
    const due = b * (1 + r);
    const pay = Math.min(payment, due);
    total += pay;
    b = due - pay;
  }
  return total;
}

export interface ArmScheduleRow {
  month: number;
  rate: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

export interface ArmInputs {
  principal: number;
  termMonths: number;
  initialRatePercent: number;
  fixedMonths: number;
  /** Rate change at the first adjustment, in percentage points. */
  firstAdjustment: number;
  /** Rate change at each later adjustment, in percentage points. */
  subsequentAdjustment: number;
  monthsBetweenAdjustments: number;
  /** Maximum total increase over the initial rate, in percentage points. */
  lifetimeCap: number;
}

/**
 * Month-by-month ARM schedule. The rate stays fixed for `fixedMonths`, then
 * changes by `firstAdjustment`, then by `subsequentAdjustment` every
 * `monthsBetweenAdjustments`, never above initial + lifetimeCap or below 0.
 * The payment is recalculated at each change over the remaining term.
 */
export function armSchedule(i: ArmInputs): ArmScheduleRow[] {
  const maxRate = i.initialRatePercent + i.lifetimeCap;
  const rows: ArmScheduleRow[] = [];
  let rate = i.initialRatePercent;
  let balance = i.principal;
  let payment = monthlyPayment(balance, rate, i.termMonths);
  for (let m = 1; m <= i.termMonths && balance > 0.005; m++) {
    const monthIndex = m - 1;
    if (monthIndex >= i.fixedMonths) {
      const sinceFirst = monthIndex - i.fixedMonths;
      const isFirst = sinceFirst === 0;
      const isLater = sinceFirst > 0 && i.monthsBetweenAdjustments > 0 && sinceFirst % i.monthsBetweenAdjustments === 0;
      if (isFirst || isLater) {
        const next = rate + (isFirst ? i.firstAdjustment : i.subsequentAdjustment);
        rate = Math.max(0, Math.min(maxRate, next));
        payment = monthlyPayment(balance, rate, i.termMonths - monthIndex);
      }
    }
    const interest = balance * (rate / 100 / 12);
    const principal = Math.min(payment - interest, balance);
    balance = Math.max(0, balance - principal);
    rows.push({ month: m, rate, payment: principal + interest, principal, interest, balance });
  }
  return rows;
}

/**
 * Highest home price whose full monthly payment (principal and interest,
 * property tax, insurance, PMI when under 20% down, HOA) fits `maxPayment`.
 * Every cost is linear in the price, so this solves directly.
 */
export function maxAffordablePrice(opts: {
  maxPayment: number;
  annualRatePercent: number;
  months: number;
  downPaymentPercent: number;
  propertyTaxRatePercent: number;
  insuranceRatePercent: number;
  pmiRatePercent: number;
  monthlyHoa: number;
}): number {
  const loanShare = 1 - opts.downPaymentPercent / 100;
  const piPerDollar = monthlyPayment(1, opts.annualRatePercent, opts.months);
  const pmiShare = opts.downPaymentPercent < 20 ? opts.pmiRatePercent / 100 / 12 : 0;
  const perDollar =
    loanShare * piPerDollar + loanShare * pmiShare + opts.propertyTaxRatePercent / 100 / 12 + opts.insuranceRatePercent / 100 / 12;
  const budget = opts.maxPayment - opts.monthlyHoa;
  if (budget <= 0 || perDollar <= 0) return 0;
  return budget / perDollar;
}

/**
 * Highest USDA home price a buyer qualifies for with no down payment: the
 * full payment (principal and interest on the price plus the financed upfront
 * guarantee fee, the annual fee, property tax, insurance and HOA) must fit
 * within 29% of gross monthly income and, with other debts, 41%.
 */
export function usdaMaxPrice(opts: {
  monthlyIncome: number;
  monthlyDebts: number;
  annualRatePercent: number;
  propertyTaxRatePercent: number;
  annualInsurance: number;
  monthlyHoa: number;
  upfrontFeePercent: number;
  annualFeePercent: number;
  housingRatio?: number;
  totalRatio?: number;
}): { price: number; maxPayment: number; limitedBy: "housing" | "total" } {
  const housing = (opts.housingRatio ?? 29) / 100;
  const total = (opts.totalRatio ?? 41) / 100;
  const byHousing = opts.monthlyIncome * housing;
  const byTotal = opts.monthlyIncome * total - opts.monthlyDebts;
  const maxPayment = Math.max(0, Math.min(byHousing, byTotal));
  const perDollar =
    monthlyPayment(1 + opts.upfrontFeePercent / 100, opts.annualRatePercent, 360) +
    opts.annualFeePercent / 100 / 12 +
    opts.propertyTaxRatePercent / 100 / 12;
  const fixed = opts.annualInsurance / 12 + opts.monthlyHoa;
  const price = Math.max(0, (maxPayment - fixed) / perDollar);
  return { price, maxPayment, limitedBy: byHousing <= byTotal ? "housing" : "total" };
}
