import { useState, useMemo } from "react";
import { Calculator, CreditCard, Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CurrencyInput from "./CurrencyInput";
import PercentInput from "./PercentInput";
import { formatCurrency } from "@/lib/formatters";
import CompareTable from "./viz/CompareTable";
import { InputCard, FieldGrid, Field, TermChoice } from "./calc/Form";
import StackedBar from "./viz/StackedBar";
import { Legend } from "./viz/VizCard";
import { SERIES } from "./viz/theme";
import { yearsMonths } from "@/lib/amortization";
import { monthsToPayoff, totalPaidOnBalance } from "@/lib/mortgageMath";

interface Debt {
  id: string;
  name: string;
  balance: number;
  monthlyPayment: number;
  interestRate: number;
}

interface HelocInputs {
  helocTerm: number;
  helocClosingCosts: number;
  helocInterestRate: number;
  federalTaxRate: number;
}

const defaultDebts: Debt[] = [
  { id: "1", name: "Auto Loan", balance: 8000, monthlyPayment: 350, interestRate: 7.5 },
  { id: "2", name: "Credit Card 1", balance: 5000, monthlyPayment: 200, interestRate: 18.99 },
  { id: "3", name: "Credit Card 2", balance: 3000, monthlyPayment: 150, interestRate: 22.99 },
  { id: "4", name: "Personal Loan", balance: 3000, monthlyPayment: 407, interestRate: 12.0 },
];

const HelocDebtConsolidationCalculator = () => {
  const [debts, setDebts] = useState<Debt[]>(defaultDebts);
  const [inputs, setInputs] = useState<HelocInputs>({
    helocTerm: 15,
    helocClosingCosts: 1200,
    helocInterestRate: 6.0,
    federalTaxRate: 0,
  });

  const updateInput = (field: keyof HelocInputs, value: number) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const updateDebt = (id: string, field: keyof Debt, value: string | number) => {
    setDebts((prev) =>
      prev.map((debt) => (debt.id === id ? { ...debt, [field]: value } : debt))
    );
  };

  const addDebt = () => {
    const newId = (Math.max(...debts.map((d) => parseInt(d.id)), 0) + 1).toString();
    setDebts((prev) => [
      ...prev,
      { id: newId, name: "Other Debt", balance: 0, monthlyPayment: 0, interestRate: 0 },
    ]);
  };

  const removeDebt = (id: string) => {
    if (debts.length > 1) {
      setDebts((prev) => prev.filter((debt) => debt.id !== id));
    }
  };

  const calculations = useMemo(() => {
    // Total existing debts
    const totalDebtBalance = debts.reduce((sum, d) => sum + d.balance, 0);
    const totalMonthlyPayment = debts.reduce((sum, d) => sum + d.monthlyPayment, 0);

    // Calculate weighted average interest rate
    const weightedInterest = debts.reduce((sum, d) => sum + d.balance * d.interestRate, 0);
    const avgInterestRate = totalDebtBalance > 0 ? weightedInterest / totalDebtBalance : 0;

    // Pay each debt off on its own schedule with its current payment.
    let existingTotalInterest = 0;
    let existingTotalPayments = 0;
    let maxMonthsToPayoff = 0;
    let neverPaysOff = false;
    debts.forEach((debt) => {
      if (debt.balance <= 0) return;
      const months = monthsToPayoff(debt.balance, debt.interestRate, debt.monthlyPayment);
      if (!Number.isFinite(months)) {
        neverPaysOff = true;
        return;
      }
      const paid = totalPaidOnBalance(debt.balance, debt.interestRate, debt.monthlyPayment);
      existingTotalPayments += paid;
      existingTotalInterest += paid - debt.balance;
      maxMonthsToPayoff = Math.max(maxMonthsToPayoff, months);
    });

    const existingYears = Math.floor(maxMonthsToPayoff / 12);
    const existingMonths = maxMonthsToPayoff % 12;

    // HELOC calculations
    const helocLoanAmount = totalDebtBalance;
    const helocMonthlyRate = inputs.helocInterestRate / 100 / 12;
    const helocNumPayments = inputs.helocTerm * 12;

    const helocMonthlyPayment =
      helocMonthlyRate > 0
        ? (helocLoanAmount * helocMonthlyRate * Math.pow(1 + helocMonthlyRate, helocNumPayments)) /
          (Math.pow(1 + helocMonthlyRate, helocNumPayments) - 1)
        : helocLoanAmount / helocNumPayments;

    const helocTotalPayments = helocMonthlyPayment * helocNumPayments;
    const helocTotalInterest = helocTotalPayments - helocLoanAmount;

    // HELOC interest is deductible only when the money improves the home, never
    // for paying off other debts, so this calculator applies no tax savings.
    const helocDeductibleInterest = 0;
    const annualTaxSavings = 0;
    const totalTaxSavings = 0;

    // Comparison
    const existingCostAfterTax = existingTotalPayments; // No tax deduction on consumer debt
    const helocCostAfterTax = helocTotalPayments + inputs.helocClosingCosts - totalTaxSavings;

    const savings = existingCostAfterTax - helocCostAfterTax;
    const monthlySavings = totalMonthlyPayment - helocMonthlyPayment;
    const betterOption = savings > 0 ? "heloc" : "existing";

    return {
      existing: {
        totalBalance: totalDebtBalance,
        monthlyPayment: totalMonthlyPayment,
        avgInterestRate,
        yearsToPayoff: existingYears,
        monthsToPayoff: existingMonths,
        totalPayments: existingTotalPayments,
        totalInterest: existingTotalInterest,
        neverPaysOff,
        deductibleInterest: 0,
      },
      heloc: {
        loanAmount: helocLoanAmount,
        monthlyPayment: helocMonthlyPayment,
        interestRate: inputs.helocInterestRate,
        yearsToPayoff: inputs.helocTerm,
        monthsToPayoff: 0,
        totalPayments: helocTotalPayments,
        totalInterest: helocTotalInterest,
        deductibleInterest: helocDeductibleInterest,
        annualTaxSavings,
        totalTaxSavings,
        closingCosts: inputs.helocClosingCosts,
      },
      monthlySavings,
      totalSavings: savings,
      betterOption,
    };
  }, [debts, inputs]);

  return (
    <div className="fade-in">
      <Tabs defaultValue="calculator" className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-6">
          <TabsTrigger value="calculator">Calculator</TabsTrigger>
          <TabsTrigger value="details">HELOC Details</TabsTrigger>
        </TabsList>

        <TabsContent value="calculator" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <InputCard id="heloc-details" title="The home equity loan">
              <FieldGrid className="sm:grid-cols-1">
                <Field id="heloc-dc-interest-rate" label="Interest rate">
                  <PercentInput id="heloc-dc-interest-rate" value={inputs.helocInterestRate} onChange={(value) => updateInput("helocInterestRate", value)} min={0} max={30} decimalPlaces={3} />
                </Field>
                <Field id="heloc-dc-loan-term" label="Pay it off over">
                  <TermChoice id="heloc-dc-loan-term" value={inputs.helocTerm} onChange={(y) => updateInput("helocTerm", y)} terms={[5, 10, 15, 20]} />
                </Field>
                <Field id="heloc-dc-closing-costs" label="Closing costs">
                  <CurrencyInput id="heloc-dc-closing-costs" value={inputs.helocClosingCosts} onChange={(value) => updateInput("helocClosingCosts", value)} />
                </Field>
              </FieldGrid>
              <p className="mt-5 rounded-lg border border-accent/30 bg-accent/10 p-3 text-xs leading-relaxed text-muted-foreground">
                <strong className="text-foreground">No tax deduction for paying off debts.</strong> Home equity interest is deductible only
                when the money buys, builds or improves your home, so this comparison includes no tax savings.
              </p>
            </InputCard>

            {/* Existing Debts */}
            <section className="calculator-card p-4 sm:p-6" aria-labelledby="debts-heading">
              <h2 id="debts-heading" className="text-base sm:text-xl font-display font-semibold mb-4 flex items-center gap-2">
                <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-accent" aria-hidden="true" />
                Current Debts
              </h2>

              <div className="space-y-3">
                {/* Header */}
                <div className="grid grid-cols-12 gap-2 text-xs text-muted-foreground font-medium">
                  <div className="col-span-3">Debt</div>
                  <div className="col-span-3">Balance</div>
                  <div className="col-span-3">Payment</div>
                  <div className="col-span-2">Rate</div>
                  <div className="col-span-1"></div>
                </div>

                {/* Debt Rows */}
                {debts.map((debt) => (
                  <div key={debt.id} className="grid grid-cols-12 gap-2 items-center">
                    <div className="col-span-3">
                      <Input
                        type="text"
                        aria-label="Debt name"
                        value={debt.name}
                        onChange={(e) => updateDebt(debt.id, "name", e.target.value)}
                        className="h-8 text-xs"
                      />
                    </div>
                    <div className="col-span-3">
                      <CurrencyInput
                        aria-label={`${debt.name || "Debt"} balance`}
                        value={debt.balance}
                        onChange={(value) => updateDebt(debt.id, "balance", value)}
                        className="h-8 text-xs"
                      />
                    </div>
                    <div className="col-span-3">
                      <CurrencyInput
                        aria-label={`${debt.name || "Debt"} monthly payment`}
                        value={debt.monthlyPayment}
                        onChange={(value) => updateDebt(debt.id, "monthlyPayment", value)}
                        className="h-8 text-xs"
                      />
                    </div>
                    <div className="col-span-2">
                      <div className="flex items-center gap-1">
                        <PercentInput
                          aria-label={`${debt.name || "Debt"} interest rate`}
                          value={debt.interestRate}
                          onChange={(value) => updateDebt(debt.id, "interestRate", value)}
                          min={0}
                          max={50}
                          decimalPlaces={2}
                          className="h-8 text-xs w-full"
                        />
                      </div>
                    </div>
                    <div className="col-span-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => removeDebt(debt.id)}
                        aria-label={`Remove ${debt.name || "debt"}`}
                        disabled={debts.length <= 1}
                      >
                        <Trash2 className="h-3 w-3 text-muted-foreground" aria-hidden="true" />
                      </Button>
                    </div>
                  </div>
                ))}

                {/* Totals Row */}
                <div className="grid grid-cols-12 gap-2 items-center pt-2 border-t border-border font-medium">
                  <div className="col-span-3 text-sm">Totals</div>
                  <div className="col-span-3 text-sm">{formatCurrency(calculations.existing.totalBalance)}</div>
                  <div className="col-span-3 text-sm">{formatCurrency(calculations.existing.monthlyPayment)}</div>
                  <div className="col-span-2 text-sm">{calculations.existing.avgInterestRate.toFixed(2)}%</div>
                  <div className="col-span-1"></div>
                </div>

                <Button variant="outline" size="sm" onClick={addDebt} className="w-full mt-2">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Debt
                </Button>
              </div>
            </section>
          </div>

          {/* Results Comparison */}
          <section className="calculator-card p-4 sm:p-6" aria-labelledby="results-heading">
            <h2 id="results-heading" className="text-base sm:text-xl font-display font-semibold mb-4 flex items-center gap-2">
              <Calculator className="h-4 w-4 sm:h-5 sm:w-5 text-accent" aria-hidden="true" />
              Financial Analysis
            </h2>

            {calculations.existing.neverPaysOff && (
              <p className="mb-4 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm" role="status">
                At least one debt's monthly payment doesn't cover its interest, so it would never be paid off. It's
                left out of the "keep existing debts" totals below; raise its payment to include it.
              </p>
            )}

            {(() => {
              const e = calculations.existing;
              const h = calculations.heloc;
              const existingMonths = e.yearsToPayoff * 12 + e.monthsToPayoff;
              const helocMonths = h.yearsToPayoff * 12;
              const max = Math.max(e.totalPayments, h.totalPayments + h.closingCosts);
              const consolidate = calculations.betterOption === "heloc";
              return (
                <>
                  <p className="mb-5 text-sm text-muted-foreground sm:text-base">
                    <strong className="text-foreground">
                      {consolidate ? "Consolidating" : "Keeping your current debts"} costs {formatCurrency(Math.abs(calculations.totalSavings))} less
                    </strong>{" "}
                    in total.{" "}
                    {calculations.monthlySavings > 0
                      ? `The home equity loan lowers your payment by ${formatCurrency(calculations.monthlySavings)} a month`
                      : `The home equity loan raises your payment by ${formatCurrency(-calculations.monthlySavings)} a month`}
                    {helocMonths > existingMonths
                      ? `, but stretches payoff from ${yearsMonths(existingMonths)} to ${yearsMonths(helocMonths)}${consolidate ? "." : ", and the extra time adds interest."}`
                      : ` and pays everything off in ${yearsMonths(helocMonths)} instead of ${yearsMonths(existingMonths)}.`}{" "}
                    Your home secures the new loan, so missed payments put it at risk.
                  </p>

                  <h3 className="mb-3 font-display text-base font-semibold">Total you'd pay</h3>
                  <div className="space-y-4">
                    <StackedBar
                      title="Keep current debts"
                      total={formatCurrency(e.totalPayments)}
                      max={max}
                      segments={[
                        { label: "Balance", value: e.totalBalance, color: SERIES.principal },
                        { label: "Interest", value: e.totalInterest, color: SERIES.interest },
                      ]}
                    />
                    <StackedBar
                      title="Home equity loan"
                      total={formatCurrency(h.totalPayments + h.closingCosts)}
                      max={max}
                      segments={[
                        { label: "Balance", value: h.loanAmount, color: SERIES.principal },
                        { label: "Interest", value: h.totalInterest, color: SERIES.interest },
                        { label: "Closing costs", value: h.closingCosts, color: SERIES.fees },
                      ]}
                    />
                    <Legend
                      items={[
                        { label: "Balance you owe", color: SERIES.principal },
                        { label: "Interest", color: SERIES.interest },
                        { label: "Closing costs", color: SERIES.fees },
                      ]}
                    />
                  </div>

                  <h3 className="mb-1 mt-8 font-display text-base font-semibold">Line by line</h3>
                  <CompareTable
                    columns={[{ label: "Keep debts" }, { label: "Home equity loan" }]}
                    recommended={consolidate ? 1 : 0}
                    recommendedLabel="Costs less"
                    groups={[
                      {
                        rows: [
                          { label: "Amount owed", values: [e.totalBalance, h.loanAmount] },
                          { label: "Monthly payment", values: [e.monthlyPayment, h.monthlyPayment], better: "lower" },
                          {
                            label: "Interest rate",
                            values: [e.avgInterestRate, h.interestRate],
                            format: (v) => `${v.toFixed(2)}%`,
                            better: "lower",
                            note: "Current debts: balance-weighted average",
                          },
                          { label: "Paid off in", values: [existingMonths, helocMonths], format: yearsMonths, better: "lower" },
                          { label: "Total interest", values: [e.totalInterest, h.totalInterest], better: "lower" },
                          { label: "Closing costs", values: [0, h.closingCosts] },
                          { label: "Total paid", values: [e.totalPayments, h.totalPayments + h.closingCosts], better: "lower", emphasis: true },
                        ],
                      },
                    ]}
                  />
                </>
              );
            })()}
          </section>
        </TabsContent>

        <TabsContent value="details">
          <section className="calculator-card p-4 sm:p-6">
            <h2 className="text-xl font-display font-semibold mb-4">What is a HELOC?</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                A <strong>Home Equity Line of Credit (HELOC)</strong> is a revolving line of credit secured by your home's equity. 
                Unlike a traditional loan, a HELOC works more like a credit card – you can borrow up to a certain limit, 
                repay, and borrow again during the draw period.
              </p>
              
              <h3 className="text-lg font-semibold text-foreground mt-6">How HELOCs Work</h3>
              <ul className="list-disc list-inside space-y-2">
                <li><strong>Draw Period:</strong> Typically 5-10 years where you can borrow funds and make interest-only payments</li>
                <li><strong>Repayment Period:</strong> Usually 10-20 years where you repay principal and interest</li>
                <li><strong>Variable Rates:</strong> Most HELOCs have variable interest rates tied to the prime rate</li>
                <li><strong>Credit Limit:</strong> Based on your home equity, typically up to 80-85% of home value minus mortgage balance</li>
              </ul>

              <h3 className="text-lg font-semibold text-foreground mt-6">HELOC vs Home Equity Loan</h3>
              <ul className="list-disc list-inside space-y-2">
                <li><strong>HELOC:</strong> Revolving credit, variable rate, flexible borrowing</li>
                <li><strong>Home Equity Loan:</strong> Lump sum, fixed rate, predictable payments</li>
              </ul>

              <h3 className="text-lg font-semibold text-foreground mt-6">Tax Considerations</h3>
              <p>
                Since the Tax Cuts and Jobs Act of 2017, HELOC interest is only tax deductible if the funds are used to 
                "buy, build, or substantially improve" the home securing the loan. Interest on HELOCs used for debt 
                consolidation, vacations, or other purposes is no longer deductible.
              </p>
            </div>
          </section>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HelocDebtConsolidationCalculator;
