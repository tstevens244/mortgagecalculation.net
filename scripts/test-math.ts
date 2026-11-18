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
