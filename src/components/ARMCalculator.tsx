import { useState, useMemo } from "react";
import { TrendingUp } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PaymentBreakdown from "./PaymentBreakdown";
import AmortizationSchedule from "./AmortizationSchedule";
import AmortizationChart from "./AmortizationChart";
import CurrencyInput from "./CurrencyInput";
import PercentInput from "./PercentInput";
import { formatCurrency } from "@/lib/formatters";
import { armSchedule } from "@/lib/mortgageMath";
import StickyResult from "./StickyResult";
import { InputCard, FieldGrid, Field, TermChoice, MoreOptions, DownPaymentField, StartDateField, summarize, Choice } from "./calc/Form";

interface ARMInputs {
  homePrice: number;
  downPayment: number;
  downPaymentPercent: number;
  loanTerm: number;
  initialRate: number;
  propertyTax: number;
  homeInsurance: number;
  hoaFees: number;
  closingCosts: number;
  pmiRate: number;
  startDate: string;
  // ARM-specific inputs
  yearsBeforeFirstAdjustment: number;
  expectedFirstAdjustment: number;
  monthsBetweenAdjustments: number;
  expectedSubsequentAdjustment: number;
  lifetimeCap: number;
}

const ARM_TYPES = [
  { label: "5/6", years: 5, months: 6 },
  { label: "7/6", years: 7, months: 6 },
  { label: "10/6", years: 10, months: 6 },
  { label: "5/1", years: 5, months: 12 },
  { label: "7/1", years: 7, months: 12 },
  { label: "10/1", years: 10, months: 12 },
];

const ARMCalculator = () => {
  const [inputs, setInputs] = useState<ARMInputs>({
    homePrice: 400000,
    downPayment: 80000,
    downPaymentPercent: 20,
    loanTerm: 30,
    initialRate: 6.5,
    propertyTax: 4800,
    homeInsurance: 1500,
    hoaFees: 0,
    closingCosts: 0,
    pmiRate: 0.5,
    startDate: new Date().toISOString().slice(0, 7),
    // ARM defaults: a 5/6 SOFR ARM, the most common structure today
    yearsBeforeFirstAdjustment: 5,
    expectedFirstAdjustment: 1.0,
    monthsBetweenAdjustments: 6,
    expectedSubsequentAdjustment: 0.25,
    lifetimeCap: 5.0,
  });

  const updateInput = (field: keyof ARMInputs, value: number | string) => {
    setInputs((prev) => {
      const updated = { ...prev, [field]: value };

      if (field === "downPayment") {
        updated.downPaymentPercent = (Number(value) / prev.homePrice) * 100;
      } else if (field === "downPaymentPercent") {
        updated.downPayment = (Number(value) / 100) * prev.homePrice;
      } else if (field === "homePrice") {
        updated.downPayment = (prev.downPaymentPercent / 100) * Number(value);
      }

      return updated;
    });
  };

  const calculations = useMemo(() => {
    const baseLoanAmount = inputs.homePrice - inputs.downPayment + inputs.closingCosts;
    const ltvPercent = ((inputs.homePrice - inputs.downPayment) / inputs.homePrice) * 100;
    const requiresPMI = ltvPercent > 80;
    
    const monthlyRate = inputs.initialRate / 100 / 12;
    const numPayments = inputs.loanTerm * 12;

    // Calculate initial monthly P&I
    const initialMonthlyPI =
      monthlyRate > 0
        ? (baseLoanAmount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
          (Math.pow(1 + monthlyRate, numPayments) - 1)
        : baseLoanAmount / numPayments;

    // Calculate maximum rate based on lifetime cap
    const maxRate = Math.min(inputs.initialRate + inputs.lifetimeCap, 18); // Most ARMs cap at 18%
    const maxMonthlyRate = maxRate / 100 / 12;

    // Calculate the remaining balance after the fixed period
    const fixedPeriodPayments = inputs.yearsBeforeFirstAdjustment * 12;
    let remainingBalance = baseLoanAmount;
    for (let i = 0; i < fixedPeriodPayments; i++) {
      const interestPayment = remainingBalance * monthlyRate;
      const principalPayment = initialMonthlyPI - interestPayment;
      remainingBalance -= principalPayment;
    }

    // Calculate max P&I based on remaining balance and remaining term at max rate
    const remainingPayments = numPayments - fixedPeriodPayments;
    const maxMonthlyPI =
      maxMonthlyRate > 0 && remainingPayments > 0
        ? (remainingBalance * maxMonthlyRate * Math.pow(1 + maxMonthlyRate, remainingPayments)) /
          (Math.pow(1 + maxMonthlyRate, remainingPayments) - 1)
        : remainingBalance / remainingPayments;

    const monthlyTax = inputs.propertyTax / 12;
    const monthlyInsurance = inputs.homeInsurance / 12;
    const monthlyHOA = inputs.hoaFees;
    const monthlyPMI = requiresPMI ? (baseLoanAmount * (inputs.pmiRate / 100)) / 12 : 0;
    const monthlyOtherCosts = monthlyTax + monthlyInsurance + monthlyHOA + monthlyPMI;

    const initialTotalMonthly = initialMonthlyPI + monthlyOtherCosts;
    const maxTotalMonthly = maxMonthlyPI + monthlyOtherCosts;

    // Expected path: the rate changes by the expected adjustments you entered,
    // within the lifetime cap, and the payment is recalculated at each change.
    const schedule = armSchedule({
      principal: baseLoanAmount,
      termMonths: numPayments,
      initialRatePercent: inputs.initialRate,
      fixedMonths: fixedPeriodPayments,
      firstAdjustment: inputs.expectedFirstAdjustment,
      subsequentAdjustment: inputs.expectedSubsequentAdjustment,
      monthsBetweenAdjustments: inputs.monthsBetweenAdjustments,
      lifetimeCap: inputs.lifetimeCap,
    });
    const estimatedTotalInterest = schedule.reduce((sum, row) => sum + row.interest, 0);
    const firstAdjustedRow = schedule[fixedPeriodPayments];
    const adjustedMonthlyPI = firstAdjustedRow ? firstAdjustedRow.payment : initialMonthlyPI;
    const adjustedRate = firstAdjustedRow ? firstAdjustedRow.rate : inputs.initialRate;
    const expectedPeakPI = schedule.reduce((max, row) => Math.max(max, row.payment), 0);
    const totalTaxesInsurance = (monthlyTax + monthlyInsurance + monthlyHOA) * numPayments;

    return {
      baseLoanAmount,
      ltvPercent,
      requiresPMI,
      initialRate: inputs.initialRate,
      maxRate,
      initialMonthlyPI,
      maxMonthlyPI,
      monthlyTax,
      monthlyInsurance,
      monthlyHOA,
      monthlyPMI,
      monthlyOtherCosts,
      initialTotalMonthly,
      maxTotalMonthly,
      estimatedTotalInterest,
      totalTaxesInsurance,
      totalAllPayments: baseLoanAmount + estimatedTotalInterest + totalTaxesInsurance,
      avgMonthlyTotal: (baseLoanAmount + estimatedTotalInterest + totalTaxesInsurance) / numPayments,
      numPayments,
      remainingBalance,
      schedule,
      adjustedMonthlyPI,
      adjustedRate,
      adjustedTotalMonthly: adjustedMonthlyPI + monthlyOtherCosts,
      expectedPeakTotalMonthly: expectedPeakPI + monthlyOtherCosts,
    };
  }, [inputs]);

  // Generate amortization data using initial rate for simplicity
  const amortizationData = useMemo(() => {
    // Uses the expected rate path, so payments change after the fixed period.
    const startDate = new Date(inputs.startDate + "-01");
    return calculations.schedule.map((row) => {
      const paymentDate = new Date(startDate);
      paymentDate.setMonth(paymentDate.getMonth() + row.month);
      return {
        month: row.month,
        date: paymentDate,
        payment: row.payment,
        principal: row.principal,
        interest: row.interest,
        balance: row.balance,
      };
    });
  }, [calculations, inputs.startDate]);

  const armTypeLabel = `${inputs.yearsBeforeFirstAdjustment}/${inputs.monthsBetweenAdjustments === 12 ? 1 : inputs.monthsBetweenAdjustments} ARM`;

  return (
    <div className="fade-in">
      <div className="calc-layout">
        {/* Input Section */}
        <div>
          <InputCard id="loan-details" title="Your ARM" description="Pick the ARM type and enter the basics. Rate changes, taxes and fees are filled in for you below.">
            <FieldGrid>
              <Field id="home-price" label="Home price">
                <CurrencyInput id="home-price" value={inputs.homePrice} onChange={(value) => updateInput("homePrice", value)} />
              </Field>
              <DownPaymentField
                amount={inputs.downPayment}
                percent={inputs.downPaymentPercent}
                onAmount={(value) => updateInput("downPayment", value)}
                onPercent={(value) => updateInput("downPaymentPercent", value)}
                info="Putting down 20% or more avoids PMI."
              />
              <Field id="initial-rate" label="Starting rate" info="The rate during the fixed period. ARMs usually start below 30-year fixed rates.">
                <PercentInput id="initial-rate" value={inputs.initialRate} onChange={(value) => updateInput("initialRate", value)} min={0} max={30} decimalPlaces={3} />
              </Field>
              <Field
                id="arm-type"
                label="ARM type"
                info="The first number is the fixed period in years. /6 ARMs then adjust every 6 months; /1 ARMs once a year."
              >
                <Choice
                  id="arm-type"
                  label="ARM type"
                  value={`${inputs.yearsBeforeFirstAdjustment}/${inputs.monthsBetweenAdjustments}`}
                  onChange={(v) => {
                    const [years, months] = v.split("/").map(Number);
                    updateInput("yearsBeforeFirstAdjustment", years);
                    updateInput("monthsBetweenAdjustments", months);
                  }}
                  options={ARM_TYPES.map((t) => ({ value: `${t.years}/${t.months}`, label: t.label }))}
                  className="flex-wrap sm:flex-nowrap"
                />
              </Field>
            </FieldGrid>

            <MoreOptions
              title="Rate changes after the fixed period"
              summary={summarize(
                `${inputs.expectedFirstAdjustment >= 0 ? "+" : ""}${inputs.expectedFirstAdjustment.toFixed(2)}% at the first change`,
                `${inputs.expectedSubsequentAdjustment >= 0 ? "+" : ""}${inputs.expectedSubsequentAdjustment.toFixed(2)}% at each later change`,
                `capped at +${inputs.lifetimeCap.toFixed(2)}%`,
                `${inputs.loanTerm}-year term`,
              )}
            >
              <FieldGrid>
                <Field id="first-adj" label="First change" info="Expected rate change at the first adjustment. It's often bigger than later ones.">
                  <PercentInput id="first-adj" value={inputs.expectedFirstAdjustment} onChange={(v) => updateInput("expectedFirstAdjustment", v)} min={-5} max={10} decimalPlaces={2} allowNegative />
                </Field>
                <Field id="subsequent-adj" label="Each later change" info="Expected rate change at each adjustment after the first.">
                  <PercentInput id="subsequent-adj" value={inputs.expectedSubsequentAdjustment} onChange={(v) => updateInput("expectedSubsequentAdjustment", v)} min={-5} max={10} decimalPlaces={2} allowNegative />
                </Field>
                <Field id="lifetime-cap" label="Lifetime cap" info="The most the rate can rise over the life of the loan. A 6% start with a 5% cap can't go above 11%.">
                  <PercentInput id="lifetime-cap" value={inputs.lifetimeCap} onChange={(v) => updateInput("lifetimeCap", v)} min={0} max={15} decimalPlaces={2} />
                </Field>
                <Field id="years-first-adj" label="Fixed period">
                  <Select value={inputs.yearsBeforeFirstAdjustment.toString()} onValueChange={(v) => updateInput("yearsBeforeFirstAdjustment", parseInt(v))}>
                    <SelectTrigger id="years-first-adj">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 3, 5, 7, 10].map((y) => (
                        <SelectItem key={y} value={String(y)}>
                          {y} year{y === 1 ? "" : "s"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field id="months-between" label="Adjusts every">
                  <Select value={inputs.monthsBetweenAdjustments.toString()} onValueChange={(v) => updateInput("monthsBetweenAdjustments", parseInt(v))}>
                    <SelectTrigger id="months-between">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="6">6 months</SelectItem>
                      <SelectItem value="12">12 months</SelectItem>
                      <SelectItem value="24">24 months</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field id="loan-term" label="Loan term">
                  <TermChoice id="loan-term" value={inputs.loanTerm} onChange={(years) => updateInput("loanTerm", years)} terms={[30, 15]} />
                </Field>
              </FieldGrid>
            </MoreOptions>

            <MoreOptions
              title="Taxes, insurance & fees"
              summary={summarize(
                `${formatCurrency(inputs.propertyTax)}/yr tax`,
                `${formatCurrency(inputs.homeInsurance)}/yr insurance`,
                inputs.downPaymentPercent < 20 ? `PMI ${inputs.pmiRate}%/yr` : "no PMI",
                inputs.hoaFees > 0 ? `${formatCurrency(inputs.hoaFees)}/mo HOA` : "no HOA",
              )}
            >
              <FieldGrid>
                <Field id="property-tax" label="Property tax" unit="per year">
                  <CurrencyInput id="property-tax" value={inputs.propertyTax} onChange={(value) => updateInput("propertyTax", value)} />
                </Field>
                <Field id="home-insurance" label="Home insurance" unit="per year">
                  <CurrencyInput id="home-insurance" value={inputs.homeInsurance} onChange={(value) => updateInput("homeInsurance", value)} />
                </Field>
                <Field id="pmi-rate" label="PMI rate" unit="% of loan per year" info="Charged only when you put down less than 20%.">
                  <PercentInput id="pmi-rate" value={inputs.pmiRate} onChange={(value) => updateInput("pmiRate", value)} min={0} max={5} decimalPlaces={2} />
                </Field>
                <Field id="hoa-fees" label="HOA dues" unit="per month">
                  <CurrencyInput id="hoa-fees" value={inputs.hoaFees} onChange={(value) => updateInput("hoaFees", value)} />
                </Field>
                <Field id="closing-costs" label="Closing costs added to the loan" info="Only if you're rolling closing costs into the loan amount.">
                  <CurrencyInput id="closing-costs" value={inputs.closingCosts} onChange={(value) => updateInput("closingCosts", value)} />
                </Field>
                <StartDateField value={inputs.startDate} onChange={(v) => updateInput("startDate", v)} />
              </FieldGrid>
            </MoreOptions>
          </InputCard>
        </div>

        {/* Results Section */}
        <aside className="calc-results" aria-label="Calculation Results">
          {/* Initial Payment */}
          <StickyResult targetId="calc-result" label={"Initial monthly payment"} value={formatCurrency(calculations.initialTotalMonthly)} />
          <div id="calc-result" className="result-highlight">
            <p className="text-primary-foreground/80 text-sm font-medium uppercase tracking-wide">
              Initial Monthly Payment
            </p>
            <p className="text-4xl lg:text-5xl font-display font-bold mt-2 number-pop">
              {formatCurrency(calculations.initialTotalMonthly)}
            </p>
            <p className="text-primary-foreground/70 text-sm mt-2">
              {armTypeLabel} • Initial Rate: {inputs.initialRate}%
            </p>
          </div>

          {/* After first adjustment (expected) */}
          <div className="calculator-card p-6">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-accent" aria-hidden="true" />
              After first adjustment
            </h3>
            <p className="text-3xl font-display font-bold mt-2">
              {formatCurrency(calculations.adjustedTotalMonthly)}
            </p>
            <p className="text-muted-foreground text-sm mt-2">
              Year {inputs.yearsBeforeFirstAdjustment + 1}, at an expected {calculations.adjustedRate.toFixed(2)}%.
              Highest expected payment: {formatCurrency(calculations.expectedPeakTotalMonthly)}.
            </p>
          </div>

          {/* Maximum Payment */}
          <div className="calculator-card p-6 border-2 border-destructive/20 bg-destructive/5">
            <h3 className="font-semibold text-lg flex items-center gap-2 text-red-700 dark:text-red-400">
              <TrendingUp className="h-5 w-5" aria-hidden="true" />
              Worst-case payment
            </h3>
            <p className="text-3xl font-display font-bold mt-2">
              {formatCurrency(calculations.maxTotalMonthly)}
            </p>
            <p className="text-muted-foreground text-sm mt-2">
              If the rate hits the {calculations.maxRate.toFixed(2)}% lifetime cap at the first adjustment
            </p>
          </div>

          {/* Payment Details */}
          <div className="calculator-card p-6 space-y-4">
            <h3 className="font-semibold text-lg">Initial Payment Breakdown</h3>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Principal & Interest</span>
                <span className="font-medium">{formatCurrency(calculations.initialMonthlyPI)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Property Tax</span>
                <span className="font-medium">{formatCurrency(calculations.monthlyTax)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Home Insurance</span>
                <span className="font-medium">{formatCurrency(calculations.monthlyInsurance)}</span>
              </div>
              {calculations.monthlyPMI > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">PMI</span>
                  <span className="font-medium">{formatCurrency(calculations.monthlyPMI)}</span>
                </div>
              )}
              {calculations.monthlyHOA > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">HOA Fees</span>
                  <span className="font-medium">{formatCurrency(calculations.monthlyHOA)}</span>
                </div>
              )}
              <hr className="border-border" />
              <div className="flex justify-between text-sm font-medium">
                <span>Total Initial</span>
                <span>{formatCurrency(calculations.initialTotalMonthly)}</span>
              </div>
            </div>
          </div>

          {/* Loan Totals */}
          <div className="calculator-card p-6 space-y-4">
            <h3 className="font-semibold text-lg">Loan Totals (Estimated)</h3>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Amount Financed</span>
                <span className="font-medium">{formatCurrency(calculations.baseLoanAmount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Est. Total Interest</span>
                <span className="font-medium">{formatCurrency(calculations.estimatedTotalInterest)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Taxes & Insurance</span>
                <span className="font-medium">{formatCurrency(calculations.totalTaxesInsurance)}</span>
              </div>
              <hr className="border-border" />
              <div className="flex justify-between text-sm font-medium">
                <span>Total All Payments</span>
                <span>{formatCurrency(calculations.totalAllPayments)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Average Monthly</span>
                <span className="font-medium">{formatCurrency(calculations.avgMonthlyTotal)}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Tabs for Charts and Schedule */}
      <div className="mt-8">
        <Tabs defaultValue="breakdown" className="w-full">
          <TabsList className="w-full overflow-x-auto flex justify-start sm:justify-center mb-4">
            <TabsTrigger value="breakdown" className="text-xs sm:text-sm whitespace-nowrap">
              <span className="hidden sm:inline">Payment Breakdown</span>
              <span className="sm:hidden">Breakdown</span>
            </TabsTrigger>
            <TabsTrigger value="chart" className="text-xs sm:text-sm whitespace-nowrap">
              <span className="hidden sm:inline">Amortization Chart</span>
              <span className="sm:hidden">Chart</span>
            </TabsTrigger>
            <TabsTrigger value="schedule" className="text-xs sm:text-sm whitespace-nowrap">
              <span className="hidden sm:inline">Amortization Schedule</span>
              <span className="sm:hidden">Schedule</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="breakdown" className="mt-4">
            <div className="calculator-card p-4 sm:p-6">
              <PaymentBreakdown
                principal={amortizationData[0]?.principal ?? 0}
                interest={amortizationData[0]?.interest ?? 0}
                tax={calculations.monthlyTax}
                insurance={calculations.monthlyInsurance}
                pmi={calculations.monthlyPMI}
                hoa={calculations.monthlyHOA}
              />
            </div>
          </TabsContent>

          <TabsContent value="chart" className="mt-4">
            <div className="calculator-card p-4 sm:p-6">
              <AmortizationChart data={amortizationData} />
            </div>
          </TabsContent>

          <TabsContent value="schedule" className="mt-4">
            <div className="calculator-card p-4 sm:p-6">
              <AmortizationSchedule data={amortizationData} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ARMCalculator;
