import { useMemo } from "react";
import MarketRate from "@/components/calc/MarketRate";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CurrencyInput from "./CurrencyInput";
import PercentInput from "./PercentInput";
import { formatCurrency } from "@/lib/formatters";
import StickyResult from "./StickyResult";
import { InputCard, FieldGrid, Field, TermChoice, MoreOptions, summarize } from "./calc/Form";
import VizCard from "./viz/VizCard";
import CompareTable from "./viz/CompareTable";
import { BreakEvenChart } from "./viz/LazyCharts";
import { useUrlState } from "@/lib/urlState";
import { AnswerCard } from "./PaymentAnswer";
import { yearsMonths } from "@/lib/amortization";

interface RefinanceInputs {
  // Original loan
  originalHomePrice: number;
  originalDownPayment: number;
  originalLoanTerm: number;
  originalInterestRate: number;
  monthsAlreadyPaid: number;
  // New loan
  newLoanTerm: number;
  newInterestRate: number;
  yearsBeforeSell: number;
  // Fees
  discountPoints: number;
  originationFees: number;
  otherClosingCosts: number;
  // Tax rates
  federalTaxRate: number;
  stateTaxRate: number;
}

const RefinanceCalculator = () => {
  const [inputs, setInputs] = useUrlState<RefinanceInputs>({
    originalHomePrice: 400000,
    originalDownPayment: 80000,
    originalLoanTerm: 30,
    originalInterestRate: 6.5,
    monthsAlreadyPaid: 60,
    newLoanTerm: 15,
    newInterestRate: 5.75,
    yearsBeforeSell: 7,
    discountPoints: 1.0,
    originationFees: 0.5,
    otherClosingCosts: 1200,
    federalTaxRate: 0,
    stateTaxRate: 0,
  });

  const updateInput = (field: keyof RefinanceInputs, value: number) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const calculations = useMemo(() => {
    // Original loan calculations
    const originalLoanAmount = inputs.originalHomePrice - inputs.originalDownPayment;
    const originalMonthlyRate = inputs.originalInterestRate / 100 / 12;
    const originalTotalPayments = inputs.originalLoanTerm * 12;

    const originalMonthlyPayment =
      originalMonthlyRate > 0
        ? (originalLoanAmount * originalMonthlyRate * Math.pow(1 + originalMonthlyRate, originalTotalPayments)) /
          (Math.pow(1 + originalMonthlyRate, originalTotalPayments) - 1)
        : originalLoanAmount / originalTotalPayments;

    // Calculate remaining balance after months paid
    let remainingBalance = originalLoanAmount;
    let totalInterestPaidSoFar = 0;
    for (let i = 0; i < inputs.monthsAlreadyPaid; i++) {
      const interestPayment = remainingBalance * originalMonthlyRate;
      const principalPayment = originalMonthlyPayment - interestPayment;
      remainingBalance -= principalPayment;
      totalInterestPaidSoFar += interestPayment;
    }
    remainingBalance = Math.max(0, remainingBalance);

    // Remaining months on original loan
    const remainingMonthsOriginal = originalTotalPayments - inputs.monthsAlreadyPaid;

    // Calculate original loan balance at "years before sell" point
    const monthsUntilSell = inputs.yearsBeforeSell * 12;
    let originalBalanceAtSell = remainingBalance;
    let originalInterestOverPeriod = 0;
    let originalPaymentsOverPeriod = 0;

    for (let i = 0; i < monthsUntilSell && i < remainingMonthsOriginal; i++) {
      const interestPayment = originalBalanceAtSell * originalMonthlyRate;
      const principalPayment = Math.min(originalMonthlyPayment - interestPayment, originalBalanceAtSell);
      originalBalanceAtSell = Math.max(0, originalBalanceAtSell - principalPayment);
      originalInterestOverPeriod += interestPayment;
      originalPaymentsOverPeriod += originalMonthlyPayment;
    }

    // New loan calculations (refinance)
    const newLoanAmount = remainingBalance;
    const newMonthlyRate = inputs.newInterestRate / 100 / 12;
    const newTotalPayments = inputs.newLoanTerm * 12;

    const newMonthlyPayment =
      newMonthlyRate > 0
        ? (newLoanAmount * newMonthlyRate * Math.pow(1 + newMonthlyRate, newTotalPayments)) /
          (Math.pow(1 + newMonthlyRate, newTotalPayments) - 1)
        : newLoanAmount / newTotalPayments;

    // Closing costs
    const discountPointsCost = (inputs.discountPoints / 100) * newLoanAmount;
    const originationFeesCost = (inputs.originationFees / 100) * newLoanAmount;
    const totalClosingCosts = discountPointsCost + originationFeesCost + inputs.otherClosingCosts;

    // Calculate new loan balance at "years before sell" point
    let newBalanceAtSell = newLoanAmount;
    let newInterestOverPeriod = 0;
    let newPaymentsOverPeriod = 0;

    for (let i = 0; i < monthsUntilSell && i < newTotalPayments; i++) {
      const interestPayment = newBalanceAtSell * newMonthlyRate;
      const principalPayment = Math.min(newMonthlyPayment - interestPayment, newBalanceAtSell);
      newBalanceAtSell = Math.max(0, newBalanceAtSell - principalPayment);
      newInterestOverPeriod += interestPayment;
      newPaymentsOverPeriod += newMonthlyPayment;
    }

    // Tax calculations
    const combinedTaxRate = (inputs.federalTaxRate + inputs.stateTaxRate) / 100;
    const originalTaxSavings = originalInterestOverPeriod * combinedTaxRate;
    const newTaxSavings = newInterestOverPeriod * combinedTaxRate;
    const taxSavingsLoss = originalTaxSavings - newTaxSavings;

    // Balance difference (equity gained through faster principal paydown)
    // Positive when new loan has lower remaining balance (more equity built)
    const balanceDifference = originalBalanceAtSell - newBalanceAtSell;

    // Interest savings over the comparison period
    const interestSavings = originalInterestOverPeriod - newInterestOverPeriod;

    // Monthly payment difference (positive = new payment is higher)
    const monthlyPaymentDiff = newMonthlyPayment - originalMonthlyPayment;
    
    // Total additional out-of-pocket payments over the period
    // Positive = you pay more with new loan each month
    // Negative = you save money each month with new loan
    const additionalMonthlyPayments = monthlyPaymentDiff * monthsUntilSell;

    // ============================================
    // TOTAL COST COMPARISON (Industry Standard)
    // ============================================
    // Compare true cost of staying with old loan vs refinancing
    //
    // Old loan total cost over period:
    //   Payments made + Remaining balance at end
    //   = originalPaymentsOverPeriod + originalBalanceAtSell
    //
    // New loan total cost over period:
    //   Payments made + Closing costs + Remaining balance at end
    //   = newPaymentsOverPeriod + totalClosingCosts + newBalanceAtSell
    //
    // Benefit = Old cost - New cost (after tax adjustment)
    //
    // Simplified:
    // = (originalPayments + originalBalance) - (newPayments + closingCosts + newBalance)
    // = (originalPayments - newPayments) + (originalBalance - newBalance) - closingCosts
    // = -additionalMonthlyPayments + balanceDifference - closingCosts
    // = balanceDifference - additionalMonthlyPayments - closingCosts - taxSavingsLoss
    //
    // But note: balanceDifference - additionalMonthlyPayments = interestSavings
    // Because: (what you paid extra) - (balance reduction) = interest paid
    
    // Net benefit calculation
    const totalBenefit = interestSavings - taxSavingsLoss - totalClosingCosts;

    // Monthly savings (positive when new payment is lower)
    const monthlySavings = originalMonthlyPayment - newMonthlyPayment;

    // Break-even: the first month when interest saved (after any lost tax
    // deduction) has covered the closing costs. Tracked month by month for up to
    // 30 years so the chart can show the whole path.
    const netByYear: { year: number; value: number }[] = [{ year: 0, value: -totalClosingCosts }];
    let breakEvenMonths = Infinity;
    {
      let ob = remainingBalance;
      let nb = newLoanAmount;
      let oi = 0;
      let ni = 0;
      for (let m = 1; m <= 360; m++) {
        if (m <= remainingMonthsOriginal && ob > 0) {
          const interest = ob * originalMonthlyRate;
          ob = Math.max(0, ob - Math.min(originalMonthlyPayment - interest, ob));
          oi += interest;
        }
        if (m <= newTotalPayments && nb > 0) {
          const interest = nb * newMonthlyRate;
          nb = Math.max(0, nb - Math.min(newMonthlyPayment - interest, nb));
          ni += interest;
        }
        const net = (oi - ni) * (1 - combinedTaxRate) - totalClosingCosts;
        if (breakEvenMonths === Infinity && net > 0) breakEvenMonths = m;
        if (m % 12 === 0) netByYear.push({ year: m / 12, value: net });
      }
    }

    return {
      original: {
        loanAmount: originalLoanAmount,
        monthlyPayment: originalMonthlyPayment,
        remainingBalance,
        balanceAtSell: originalBalanceAtSell,
        interestOverPeriod: originalInterestOverPeriod,
        paymentsOverPeriod: originalPaymentsOverPeriod,
        taxSavings: originalTaxSavings,
      },
      refinanced: {
        loanAmount: newLoanAmount,
        monthlyPayment: newMonthlyPayment,
        balanceAtSell: newBalanceAtSell,
        interestOverPeriod: newInterestOverPeriod,
        paymentsOverPeriod: newPaymentsOverPeriod,
        taxSavings: newTaxSavings,
        discountPointsCost,
        originationFeesCost,
        totalClosingCosts,
      },
      comparison: {
        monthlyPaymentDiff,
        additionalMonthlyPayments,
        balanceDifference,
        interestSavings,
        taxSavingsLoss,
        totalBenefit,
        breakEvenMonths,
        monthlySavings,
        netByYear,
        shouldRefinance: totalBenefit > 0,
      },
    };
  }, [inputs]);

  return (
    <div className="fade-in">
      <Tabs defaultValue="calculator" className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-6">
          <TabsTrigger value="calculator">Calculator</TabsTrigger>
          <TabsTrigger value="breakdown">Detailed Breakdown</TabsTrigger>
        </TabsList>

        <TabsContent value="calculator" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <InputCard id="original-loan" title="Your current loan">
              <FieldGrid>
                <Field id="refinance-original-home-price" label="Purchase price">
                  <CurrencyInput id="refinance-original-home-price" value={inputs.originalHomePrice} onChange={(value) => updateInput("originalHomePrice", value)} />
                </Field>
                <Field id="refinance-original-down-payment" label="Down payment">
                  <CurrencyInput id="refinance-original-down-payment" value={inputs.originalDownPayment} onChange={(value) => updateInput("originalDownPayment", value)} />
                </Field>
                <Field id="refinance-interest-rate" label="Interest rate">
                  <PercentInput id="refinance-interest-rate" value={inputs.originalInterestRate} onChange={(value) => updateInput("originalInterestRate", value)} min={0} max={20} decimalPlaces={3} />
                </Field>
                <Field id="refinance-months-already-paid" label="Payments made so far" hint={`About ${(inputs.monthsAlreadyPaid / 12).toFixed(1).replace(/\.0$/, "")} years`}>
                  <Input
                    id="refinance-months-already-paid"
                    type="text"
                    inputMode="numeric"
                    value={inputs.monthsAlreadyPaid}
                    onChange={(e) => updateInput("monthsAlreadyPaid", parseInt(e.target.value) || 0)}
                    aria-describedby="refinance-months-already-paid-hint"
                  />
                </Field>
                <Field id="refinance-loan-term" label="Original term" className="sm:col-span-2">
                  <TermChoice id="refinance-loan-term" value={inputs.originalLoanTerm} onChange={(y) => updateInput("originalLoanTerm", y)} />
                </Field>
              </FieldGrid>
              <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-border pt-4 text-sm">
                <div>
                  <dt className="text-muted-foreground">Balance today</dt>
                  <dd className="text-base font-semibold tabular-nums text-foreground">{formatCurrency(calculations.original.remainingBalance)}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Payment today</dt>
                  <dd className="text-base font-semibold tabular-nums text-foreground">{formatCurrency(calculations.original.monthlyPayment)}</dd>
                </div>
              </dl>
            </InputCard>

            <InputCard id="refinance" title="The new loan">
              <FieldGrid>
                <Field id="refinance-new-interest-rate" label="New interest rate" hint={<MarketRate term={inputs.newLoanTerm} value={inputs.newInterestRate} onUse={(r) => updateInput("newInterestRate", r)} note="Refinance rates can run a bit higher" />}>
                  <PercentInput id="refinance-new-interest-rate" value={inputs.newInterestRate} onChange={(value) => updateInput("newInterestRate", value)} min={0} max={20} decimalPlaces={3} />
                </Field>
                <Field id="refinance-years-before-sell" label="Years you'll keep it" info="Until you expect to sell or refinance again. Refinancing only pays off if you keep the loan past the break-even point.">
                  <Input
                    id="refinance-years-before-sell"
                    type="text"
                    inputMode="numeric"
                    value={inputs.yearsBeforeSell}
                    onChange={(e) => updateInput("yearsBeforeSell", parseInt(e.target.value) || 0)}
                  />
                </Field>
                <Field id="refinance-new-loan-term" label="New term" className="sm:col-span-2">
                  <TermChoice id="refinance-new-loan-term" value={inputs.newLoanTerm} onChange={(y) => updateInput("newLoanTerm", y)} />
                </Field>
              </FieldGrid>

              <MoreOptions
                title="Closing costs"
                summary={summarize(
                  `${inputs.discountPoints} pts`,
                  `${inputs.originationFees}% origination`,
                  `${formatCurrency(inputs.otherClosingCosts)} other`,
                  `${formatCurrency(calculations.refinanced.totalClosingCosts)} total`,
                )}
              >
                <FieldGrid>
                  <Field id="refinance-discount-points" label="Discount points" unit="% of loan" info="Each point costs 1% of the loan and usually lowers the rate about 0.25%.">
                    <PercentInput id="refinance-discount-points" value={inputs.discountPoints} onChange={(value) => updateInput("discountPoints", value)} min={0} max={10} decimalPlaces={2} />
                  </Field>
                  <Field id="refinance-origination-fees" label="Origination fee" unit="% of loan">
                    <PercentInput id="refinance-origination-fees" value={inputs.originationFees} onChange={(value) => updateInput("originationFees", value)} min={0} max={10} decimalPlaces={2} />
                  </Field>
                  <Field id="refinance-other-closing-costs" label="Other closing costs" info="Appraisal, title, recording and other fees.">
                    <CurrencyInput id="refinance-other-closing-costs" value={inputs.otherClosingCosts} onChange={(value) => updateInput("otherClosingCosts", value)} />
                  </Field>
                </FieldGrid>
              </MoreOptions>

              <MoreOptions
                title="Taxes (only if you itemize)"
                summary={inputs.federalTaxRate + inputs.stateTaxRate > 0 ? `${inputs.federalTaxRate + inputs.stateTaxRate}% combined tax rate` : "Not itemizing (most people)"}
              >
                <FieldGrid>
                  <Field id="refinance-federal-tax-rate" label="Federal tax rate" info="Your marginal rate, only if you itemize. Most people take the standard deduction: leave at 0.">
                    <PercentInput id="refinance-federal-tax-rate" value={inputs.federalTaxRate} onChange={(v) => updateInput("federalTaxRate", v)} min={0} max={50} decimalPlaces={0} />
                  </Field>
                  <Field id="refinance-state-tax-rate" label="State tax rate">
                    <PercentInput id="refinance-state-tax-rate" value={inputs.stateTaxRate} onChange={(v) => updateInput("stateTaxRate", v)} min={0} max={20} decimalPlaces={1} />
                  </Field>
                </FieldGrid>
              </MoreOptions>

              <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-border pt-4 text-sm">
                <div>
                  <dt className="text-muted-foreground">New payment</dt>
                  <dd className="text-base font-semibold tabular-nums text-foreground">{formatCurrency(calculations.refinanced.monthlyPayment)}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Closing costs</dt>
                  <dd className="text-base font-semibold tabular-nums text-foreground">{formatCurrency(calculations.refinanced.totalClosingCosts)}</dd>
                </div>
              </dl>
            </InputCard>
          </div>

          {/* Results Summary Card */}
          <StickyResult targetId="calc-result" label={calculations.comparison.shouldRefinance ? "Refinancing saves" : "Refinancing costs"} value={`${formatCurrency(Math.abs(calculations.comparison.totalBenefit))}${calculations.comparison.shouldRefinance && Number.isFinite(calculations.comparison.breakEvenMonths) ? ` · break-even ${calculations.comparison.breakEvenMonths} mo` : ""}`} />
          <AnswerCard
            label={calculations.comparison.shouldRefinance ? "Refinancing saves you" : "Refinancing would cost you"}
            total={Math.abs(calculations.comparison.totalBenefit)}
            context={`over the ${inputs.yearsBeforeSell} years you'd keep the loan, after closing costs${inputs.federalTaxRate + inputs.stateTaxRate > 0 ? " and lost tax savings" : ""}`}
            stats={[
              {
                label: "Break-even",
                value: Number.isFinite(calculations.comparison.breakEvenMonths) ? yearsMonths(calculations.comparison.breakEvenMonths) : "Never",
                hint: Number.isFinite(calculations.comparison.breakEvenMonths) ? "when interest saved covers the costs" : "within 30 years",
              },
              {
                label: "Monthly payment",
                value: `${calculations.comparison.monthlySavings >= 0 ? "−" : "+"}${formatCurrency(Math.abs(calculations.comparison.monthlySavings))}/mo`,
                hint: `${formatCurrency(calculations.refinanced.monthlyPayment)} new vs. ${formatCurrency(calculations.original.monthlyPayment)} now`,
              },
              { label: "Interest saved", value: formatCurrency(calculations.comparison.interestSavings), hint: `over ${inputs.yearsBeforeSell} years` },
              { label: "Closing costs", value: formatCurrency(calculations.refinanced.totalClosingCosts), hint: "points, fees and other costs" },
            ]}
          />

          <section className="viz-card" aria-label="When refinancing pays off">

            {(() => {
              const be = Number.isFinite(calculations.comparison.breakEvenMonths) ? calculations.comparison.breakEvenMonths : null;
              const horizon = Math.min(30, Math.max(10, inputs.yearsBeforeSell + 3, be ? Math.ceil(be / 12) + 3 : 0));
              const points = calculations.comparison.netByYear.slice(0, horizon + 1);
              return (
                <div>
                  <h3 className="font-display text-lg font-semibold">When refinancing pays off</h3>
                  <p className="mb-4 mt-1 text-sm text-muted-foreground">
                    Interest saved{inputs.federalTaxRate + inputs.stateTaxRate > 0 ? " (after lost tax savings)" : ""}, minus
                    closing costs, by how long you keep the new loan. It starts below zero by the closing costs.
                  </p>
                  <BreakEvenChart
                    points={points}
                    aheadLabel="Refinancing is ahead"
                    behindLabel="Not paid back yet"
                    breakEvenYear={be ? be / 12 : null}
                    markerYear={inputs.yearsBeforeSell}
                    markerLabel="You sell"
                    yearTitle={(y) => (y === 0 ? "At closing" : `After ${y} year${y === 1 ? "" : "s"}`)}
                  />
                </div>
              );
            })()}
          </section>
        </TabsContent>

        <TabsContent value="breakdown" className="space-y-6">
          <VizCard
            title="Keep your loan or refinance, line by line"
            description={`Everything over the ${inputs.yearsBeforeSell} years you expect to keep the loan. The check marks the better number in each row.`}
          >
            <CompareTable
              columns={[{ label: "Keep current loan" }, { label: "Refinance" }]}
              recommended={calculations.comparison.shouldRefinance ? 1 : 0}
              recommendedLabel={calculations.comparison.shouldRefinance ? "Saves money" : "Costs less"}
              groups={[
                {
                  title: "Closing costs",
                  rows: [
                    { label: "Discount points", values: [null, calculations.refinanced.discountPointsCost] },
                    { label: "Origination fees", values: [null, calculations.refinanced.originationFeesCost] },
                    { label: "Other closing costs", values: [null, inputs.otherClosingCosts] },
                    { label: "Total closing costs", values: [0, calculations.refinanced.totalClosingCosts], emphasis: true },
                  ],
                },
                {
                  title: "Every month",
                  rows: [
                    {
                      label: "Principal and interest",
                      values: [calculations.original.monthlyPayment, calculations.refinanced.monthlyPayment],
                      better: "lower",
                      note: `New loan: ${formatCurrency(calculations.refinanced.loanAmount)} over ${inputs.newLoanTerm} years`,
                    },
                  ],
                },
                {
                  title: `Over ${inputs.yearsBeforeSell} years`,
                  rows: [
                    { label: "Payments made", values: [calculations.original.paymentsOverPeriod, calculations.refinanced.paymentsOverPeriod] },
                    { label: "Interest paid", values: [calculations.original.interestOverPeriod, calculations.refinanced.interestOverPeriod], better: "lower" },
                    ...(inputs.federalTaxRate + inputs.stateTaxRate > 0
                      ? [
                          {
                            label: "Tax saved on interest",
                            values: [calculations.original.taxSavings, calculations.refinanced.taxSavings] as (number | null)[],
                            note: "If you itemize",
                          },
                        ]
                      : []),
                    { label: "Balance left when you sell", values: [calculations.original.balanceAtSell, calculations.refinanced.balanceAtSell], better: "lower" },
                  ],
                },
                {
                  rows: [
                    {
                      label: "Net result of refinancing",
                      values: [null, calculations.comparison.totalBenefit],
                      display: [
                        undefined,
                        `${calculations.comparison.totalBenefit >= 0 ? "Saves " : "Costs "}${formatCurrency(Math.abs(calculations.comparison.totalBenefit))}`,
                      ],
                      emphasis: true,
                      note: "Interest saved, minus lost tax savings and closing costs",
                    },
                  ],
                },
              ]}
            />
          </VizCard>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RefinanceCalculator;
