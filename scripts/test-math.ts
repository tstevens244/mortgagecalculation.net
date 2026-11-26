// Checks the calculator math against independently known values.
// Run with `npm test` (Node 22.18+ runs TypeScript directly).
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  monthlyPayment,
  balanceAfter,
  monthsUntilBalance,
  totalBalanceBasedFee,
  monthsToPayoff,
  totalPaidOnBalance,
  armSchedule,
  maxAffordablePrice,
  usdaMaxPrice,
} from "../src/lib/mortgageMath.ts";
import { fhaAnnualMipRate, fhaMipMonths, vaFundingFeeRate } from "../src/lib/loanLimits.ts";

const near = (actual: number, expected: number, tolerance = 0.01) =>
  assert.ok(Math.abs(actual - expected) <= tolerance, `expected ${expected}, got ${actual}`);

test("monthly payment matches published amortization values", () => {
  near(monthlyPayment(240_000, 6.5, 360), 1516.96); // $240k, 6.5%, 30 yr
  near(monthlyPayment(200_000, 6, 360), 1199.10); // $200k, 6%, 30 yr
  near(monthlyPayment(100_000, 5, 180), 790.79); // $100k, 5%, 15 yr
  near(monthlyPayment(120_000, 0, 360), 333.33); // zero rate
  assert.equal(monthlyPayment(0, 6, 360), 0);
});

test("balance after payments", () => {
  const pay = monthlyPayment(200_000, 6, 360);
  near(balanceAfter(200_000, 6, pay, 60), 186_108.71, 0.05); // after 5 years
  near(balanceAfter(200_000, 6, pay, 360), 0, 0.05);
});

test("PMI ends when the balance reaches 78% of value", () => {
  // $300k home, 10% down ($270k loan) at 6.5%: 78% of value is $234k.
  const months = monthsUntilBalance(270_000, 6.5, 360, 234_000);
  const pay = monthlyPayment(270_000, 6.5, 360);
  assert.ok(balanceAfter(270_000, 6.5, pay, months) <= 234_000);
  assert.ok(balanceAfter(270_000, 6.5, pay, months - 1) > 234_000);
  assert.ok(months > 100 && months < 130, `months ${months}`);
  assert.equal(monthsUntilBalance(200_000, 6.5, 360, 234_000), 0);
});

test("balance-based annual fee declines with the balance", () => {
  // First year of FHA MIP at 0.55% on $289,500 is $1,592.25.
  near(totalBalanceBasedFee(289_500, 6.5, 360, 0.55, 12), 1592.25);
  const flat = ((289_500 * 0.0055) / 12) * 360;
  const declining = totalBalanceBasedFee(289_500, 6.5, 360, 0.55, 360);
  assert.ok(declining < flat * 0.8, "fee over the life of the loan must be well below the flat estimate");
});

test("debt payoff", () => {
  // $5,000 at 18% paying $200/month takes 32 months.
  assert.equal(monthsToPayoff(5_000, 18, 200), 32);
  assert.equal(monthsToPayoff(5_000, 18, 75), Infinity); // payment below interest
  const paid = totalPaidOnBalance(5_000, 18, 200);
  assert.ok(paid > 6_200 && paid < 6_400, `total ${paid}`);
  near(totalPaidOnBalance(1_200, 0, 100), 1_200);
});

test("ARM schedule follows the adjustments and caps", () => {
  const rows = armSchedule({
    principal: 320_000,
    termMonths: 360,
    initialRatePercent: 6,
    fixedMonths: 60,
    firstAdjustment: 2,
    subsequentAdjustment: 1,
    monthsBetweenAdjustments: 12,
    lifetimeCap: 5,
  });
  assert.equal(rows.length, 360);
  assert.equal(rows[59].rate, 6);
  assert.equal(rows[60].rate, 8);
  assert.equal(rows[72].rate, 9);
  assert.equal(rows[84].rate, 10);
  assert.equal(rows[96].rate, 11);
  assert.equal(rows[108].rate, 11); // capped at 6 + 5
  near(rows[0].payment, monthlyPayment(320_000, 6, 360));
  const balance60 = balanceAfter(320_000, 6, monthlyPayment(320_000, 6, 360), 60);
  near(rows[60].payment, monthlyPayment(balance60, 8, 300), 0.02);
  near(rows[359].balance, 0, 0.05);
});

test("affordability solves for the price that fits the payment", () => {
  const opts = {
    maxPayment: 2_800,
    annualRatePercent: 6.5,
    months: 360,
    downPaymentPercent: 20,
    propertyTaxRatePercent: 1.5,
    insuranceRatePercent: 0.5,
    pmiRatePercent: 0.5,
    monthlyHoa: 0,
  };
  const price = maxAffordablePrice(opts);
  const pay =
    monthlyPayment(price * 0.8, 6.5, 360) + (price * 0.015) / 12 + (price * 0.005) / 12;
  near(pay, 2_800, 0.01);
  // Less than 20% down adds PMI, so the same budget buys less.
  assert.ok(maxAffordablePrice({ ...opts, downPaymentPercent: 10 }) < price * 1.01);
  assert.equal(maxAffordablePrice({ ...opts, maxPayment: 0 }), 0);
});

test("FHA MIP and VA funding fee rules", () => {
  assert.equal(fhaAnnualMipRate(30, 96.5, 300_000), 0.55);
  assert.equal(fhaAnnualMipRate(30, 95, 300_000), 0.5);
  assert.equal(fhaAnnualMipRate(30, 96.5, 800_000), 0.75);
  assert.equal(fhaAnnualMipRate(15, 90, 300_000), 0.15);
  assert.equal(fhaMipMonths(30, 90), 132);
  assert.equal(fhaMipMonths(30, 96.5), 360);
  assert.equal(vaFundingFeeRate(true, 0, false), 2.15);
  assert.equal(vaFundingFeeRate(false, 0, false), 3.3);
  assert.equal(vaFundingFeeRate(true, 5, false), 1.5);
  assert.equal(vaFundingFeeRate(true, 10, false), 1.25);
  assert.equal(vaFundingFeeRate(false, 0, true), 0);
});

import { apr, termComparison, pointsAnalysis, fhaVsConventional, compareOffers } from "../src/lib/compareMath.ts";

test("15 vs 30 years", () => {
  const t = termComparison(300_000, 6.5, 5.75);
  near(t.thirty.payment, 1896.2);
  near(t.thirty.interest, 382_633.47, 0.5);
  near(t.fifteen.payment, 2491.23);
  near(t.fifteen.interest, 148_421.45, 0.5);
  near(t.balances[1].thirty, 254_328.38, 0.5); // after 10 years
  assert.equal(t.balances[2].fifteen, 0);
});

test("APR includes up-front finance charges", () => {
  near(apr(300_000, 6.5, 360, 6_000), 6.6953, 0.0005);
  assert.equal(apr(300_000, 6.5, 360, 0), 6.5);
  const [a, b] = compareOffers(300_000, 360, 84, [
    { rate: 6.5, upfront: 6_000 },
    { rate: 6.75, upfront: 0 },
  ]);
  near(a.apr, 6.6953, 0.0005);
  assert.equal(b.apr, 6.75);
});

test("points break-even and net savings", () => {
  const p = pointsAnalysis({ loan: 300_000, baseRate: 6.75, points: 1, reductionPerPoint: 0.25, termMonths: 360, horizonMonths: 84 });
  near(p.cost, 3_000);
  near(p.monthlySavings, 49.59);
  assert.equal(p.breakEvenMonths, 61);
  near(p.netSavings, 2_279.26, 0.5);
});

test("FHA vs conventional over 7 years", () => {
  const r = fhaVsConventional({ price: 400_000, downPercent: 5, termYears: 30, fhaRate: 6.5, convRate: 6.5, pmiRate: 0.5, horizonYears: 7 });
  near(r.fha.payment, 2602.22);
  near(r.conv.payment, 2560.19);
  near(r.fha.cost, 187_682.03, 0.5);
  near(r.conv.cost, 178_637.84, 0.5);
});

test("USDA qualifying price under 29/41", () => {
  const r = usdaMaxPrice({
    monthlyIncome: 6_000,
    monthlyDebts: 500,
    annualRatePercent: 6.5,
    propertyTaxRatePercent: 1,
    annualInsurance: 1_500,
    monthlyHoa: 0,
    upfrontFeePercent: 1,
    annualFeePercent: 0.35,
  });
  near(r.maxPayment, 1_740);
  assert.equal(r.limitedBy, "housing");
  near(r.price, 215_078.48, 0.5);
  // Heavier debts make the 41% total limit the binding one.
  assert.equal(usdaMaxPrice({ monthlyIncome: 6_000, monthlyDebts: 1_000, annualRatePercent: 6.5, propertyTaxRatePercent: 1, annualInsurance: 1_500, monthlyHoa: 0, upfrontFeePercent: 1, annualFeePercent: 0.35 }).limitedBy, "total");
});

// --- Chart and schedule summaries -------------------------------------------

import { byLoanYear, milestones, crossingYear, type AmortizationRow } from "../src/lib/amortization.ts";
import { rentVsBuy, rentVsBuyByYear } from "../src/lib/rentVsBuy.ts";

const schedule = (loan: number, rate: number, months: number, start = new Date(2026, 10, 1)): AmortizationRow[] => {
  const pay = monthlyPayment(loan, rate, months);
  const rows: AmortizationRow[] = [];
  let balance = loan;
  for (let m = 1; m <= months; m++) {
    const interest = (balance * rate) / 100 / 12;
    const principal = Math.min(pay - interest, balance);
    balance = Math.max(0, balance - principal);
    rows.push({ month: m, date: new Date(start.getFullYear(), start.getMonth() + m, 1), payment: pay, principal, interest, balance });
  }
  return rows;
};

test("loan-year summary groups 12 payments per year and keeps running totals", () => {
  const rows = schedule(300_000, 6.5, 360);
  const years = byLoanYear(rows);
  assert.equal(years.length, 30);
  // A November start still gives a full first year (not two calendar-year months).
  near(years[0].principal + years[0].interest, rows[0].payment * 12, 0.01);
  near(years[29].balance, 0, 0.01);
  near(years[29].cumPrincipal, 300_000, 0.01);
  near(years[29].paidOff, 1, 1e-9);
  near(years[29].cumInterest, rows[0].payment * 360 - 300_000, 0.05);
});

test("milestones: principal passes interest, half paid off", () => {
  const m = milestones(schedule(300_000, 6.5, 360));
  near(m.loanAmount, 300_000, 0.01);
  // At 6.5% / 30 years, principal (271.20 x 1.0054167^(k-1)) first reaches half
  // the 1,896.20 payment at k = 233 (year 20). The balance halves when
  // 1.0054167^k >= (1.0054167^360 + 1) / 2, at k = 257 (year 22).
  assert.equal(m.crossoverMonth, 233);
  assert.equal(m.halfwayMonth, 257);
  assert.equal(m.payoffMonth, 360);
  // 15 years at 5%: 748.26 x 1.0041667^(k-1) passes half of 1,581.59 at k = 15.
  assert.equal(milestones(schedule(200_000, 5, 180)).crossoverMonth, 15);
  // 10 years at 3% is principal-heavy from the first payment.
  assert.equal(milestones(schedule(100_000, 3, 120)).crossoverMonth, 1);
});

test("break-even year is interpolated where the line crosses zero", () => {
  near(crossingYear([{ year: 0, value: -100 }, { year: 1, value: -50 }, { year: 2, value: 50 }])!, 1.5, 1e-9);
  assert.equal(crossingYear([{ year: 0, value: -100 }, { year: 1, value: -10 }]), null);
  assert.equal(crossingYear([{ year: 0, value: 10 }, { year: 1, value: 20 }]), null);
});

const rvb = {
  monthlyRent: 0, annualRentIncrease: 0, homePrice: 100_000, annualAppreciation: 0, sellingCost: 0, buyingCost: 0,
  investmentReturn: 0, downPaymentPercent: 100, interestRate: 6, termYears: 30, annualPMIPercent: 0,
  annualPropertyTaxRate: 0, annualInsuranceRate: 0, annualMaintenance: 0, incomeTaxRate: 0,
};

test("rent vs. buy: the down payment comes back when you sell (not counted twice)", () => {
  // Pay cash, no costs, no appreciation, sell for what you paid: buying costs nothing.
  near(rentVsBuy({ ...rvb, years: 5 }).totalBuyCost, 0, 0.01);
  // With 20% down, the cost of buying is the interest paid (principal comes back at sale).
  const r = rentVsBuy({ ...rvb, downPaymentPercent: 20, years: 5 });
  const loan = 80_000;
  const pay = monthlyPayment(loan, 6, 360);
  const interest = pay * 60 - (loan - balanceAfter(loan, 6, pay, 60));
  near(r.totalBuyCost, interest, 0.5);
  // 5% appreciation over one year with cash: buying comes out $5,000 ahead.
  near(rentVsBuy({ ...rvb, annualAppreciation: 5, years: 1 }).totalBuyCost, -5000, 0.01);
});

test("rent vs. buy by year reruns the model for each holding period", () => {
  const series = rentVsBuyByYear({ ...rvb, monthlyRent: 1000 }, 10);
  assert.equal(series.length, 10);
  near(series[0].rent, 12_000, 0.01);
  near(series[9].advantage, 120_000, 0.01); // rent paid, while cash buying costs nothing
});

import { usdaFees, vaFees, vaFeeRate, fhaMip } from "../src/lib/feeMath.ts";

test("USDA guarantee fee: 1% upfront, 0.35% a year on the base loan's balance", () => {
  const u = usdaFees({ price: 250_000, down: 0, ratePercent: 6.5, financed: true });
  near(u.upfront, 2500);
  near(u.loan, 252_500);
  near(u.firstMonthly, (250_000 * 0.35) / 100 / 12); // $72.92
  assert.equal(u.byYear.length, 30);
  assert.ok(u.byYear[29].monthly < u.byYear[0].monthly / 5);
  // Paid at closing: same fee, smaller loan, no financing cost.
  const cash = usdaFees({ price: 250_000, down: 0, ratePercent: 6.5, financed: false });
  near(cash.loan, 250_000);
  assert.equal(cash.financing.monthly, 0);
  near(u.financing.monthly, monthlyPayment(2500, 6.5, 360));
});

test("VA funding fee by purpose, use and down payment", () => {
  near(vaFeeRate("purchase", true, 0, false), 2.15);
  near(vaFeeRate("purchase", false, 0, false), 3.3);
  near(vaFeeRate("purchase", false, 5, false), 1.5);
  near(vaFeeRate("purchase", true, 10, false), 1.25);
  near(vaFeeRate("cashout", false, 0, false), 3.3);
  near(vaFeeRate("irrrl", false, 0, false), 0.5);
  near(vaFeeRate("cashout", true, 0, true), 0);
  const v = vaFees({ purpose: "purchase", amount: 350_000, down: 17_500, firstUse: true, exempt: false, financed: true, ratePercent: 6.25, termYears: 30 });
  near(v.downPercent, 5);
  near(v.fee, 332_500 * 0.015);
  near(v.loan, 332_500 + 4987.5);
  const refi = vaFees({ purpose: "irrrl", amount: 300_000, down: 50_000, firstUse: false, exempt: false, financed: false, ratePercent: 6, termYears: 30 });
  near(refi.baseLoan, 300_000); // down payment ignored on a refinance
  near(refi.fee, 1500);
});

test("FHA MIP: upfront, annual rate and how long it lasts", () => {
  const low = fhaMip({ price: 400_000, down: 14_000, ratePercent: 6.5, termYears: 30 });
  near(low.upfront, 386_000 * 0.0175);
  near(low.annualRate, 0.55);
  assert.ok(low.lifeOfLoan);
  near(low.monthly, (386_000 * 0.55) / 100 / 12);
  const ten = fhaMip({ price: 400_000, down: 40_000, ratePercent: 6.5, termYears: 30 });
  near(ten.annualRate, 0.5);
  assert.equal(ten.mipMonths, 132);
  assert.equal(ten.byYear.length, 11);
  assert.ok(ten.totalMip < low.totalMip);
});
