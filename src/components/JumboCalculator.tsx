import { useState, useMemo } from "react";
import { Info, AlertTriangle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Alert, AlertDescription } from "@/components/ui/alert";
import PaymentBreakdown from "./PaymentBreakdown";
import AmortizationSchedule from "./AmortizationSchedule";
import AmortizationChart from "./AmortizationChart";
import CurrencyInput from "./CurrencyInput";
import PercentInput from "./PercentInput";
import { formatCurrency } from "@/lib/formatters";
import { monthsUntilBalance } from "@/lib/mortgageMath";
import StickyResult from "./StickyResult";
import { AnimatedCurrency } from "@/components/AnimatedNumber";
import { InputCard, FieldGrid, Field, TermChoice, MoreOptions, DownPaymentField, StartDateField, summarize } from "./calc/Form";
import { CONFORMING_LIMIT, CONFORMING_LIMIT_HIGH_COST as HIGH_COST_LIMIT } from "@/lib/loanLimits";

interface JumboInputs {
  homePrice: number;
  downPayment: number;
  downPaymentPercent: number;
  loanTerm: number;
  interestRate: number;
  propertyTax: number;
  homeInsurance: number;
  hoaFees: number;
  startDate: string;
}

// Current-year conforming loan limits (see src/lib/loanLimits.ts)
const CONFORMING_LIMIT_STANDARD = CONFORMING_LIMIT;
const CONFORMING_LIMIT_HIGH_COST = HIGH_COST_LIMIT;

const JumboCalculator = () => {
  const [inputs, setInputs] = useState<JumboInputs>({
    homePrice: 1000000,
    downPayment: 200000, // 20% typical for jumbo
    downPaymentPercent: 20,
    loanTerm: 30,
    interestRate: 6.75,
    propertyTax: 12000,
    homeInsurance: 3000,
    hoaFees: 0,
    startDate: new Date().toISOString().slice(0, 7),
  });

  const updateInput = (field: keyof JumboInputs, value: number | string) => {
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
    const loanAmount = inputs.homePrice - inputs.downPayment;
    const isJumboLoan = loanAmount > CONFORMING_LIMIT_STANDARD;
    const isHighCostJumbo = loanAmount > CONFORMING_LIMIT_HIGH_COST;
    
    // PMI typically not required for jumbo loans with 20%+ down
    // Some lenders may require it for lower down payments
    const requiresPMI = inputs.downPaymentPercent < 20;
    const annualPMIRate = requiresPMI ? 0.5 : 0; // Estimated 0.5% for jumbo if needed
    const monthlyPMI = (loanAmount * (annualPMIRate / 100)) / 12;

    const monthlyRate = inputs.interestRate / 100 / 12;
    const numPayments = inputs.loanTerm * 12;

    // Monthly principal & interest
    const monthlyPI =
      monthlyRate > 0
        ? (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
          (Math.pow(1 + monthlyRate, numPayments) - 1)
        : loanAmount / numPayments;

    const monthlyTax = inputs.propertyTax / 12;
    const monthlyInsurance = inputs.homeInsurance / 12;
    const monthlyHOA = inputs.hoaFees;

    const totalMonthly = monthlyPI + monthlyTax + monthlyInsurance + monthlyPMI + monthlyHOA;
    const totalInterest = monthlyPI * numPayments - loanAmount;
    const pmiMonths = monthlyPMI > 0 ? monthsUntilBalance(loanAmount, inputs.interestRate, numPayments, inputs.homePrice * 0.78) : 0;
    const totalPayment =
      (monthlyPI + monthlyTax + monthlyInsurance + monthlyHOA) * numPayments + monthlyPMI * pmiMonths;

    return {
      loanAmount,
      isJumboLoan,
      isHighCostJumbo,
      requiresPMI,
      monthlyPMI,
      monthlyPI,
      monthlyTax,
      monthlyInsurance,
      monthlyHOA,
      totalMonthly,
      totalInterest,
      totalPayment,
      numPayments,
    };
  }, [inputs]);

  const amortizationData = useMemo(() => {
    const data = [];
    let balance = calculations.loanAmount;
    const monthlyRate = inputs.interestRate / 100 / 12;
    const startDate = new Date(inputs.startDate + "-01");

    for (let i = 1; i <= calculations.numPayments && balance > 0; i++) {
      const interestPayment = balance * monthlyRate;
      const principalPayment = Math.min(calculations.monthlyPI - interestPayment, balance);
      balance = Math.max(0, balance - principalPayment);

      const paymentDate = new Date(startDate);
      paymentDate.setMonth(paymentDate.getMonth() + i);

      data.push({
        month: i,
        date: paymentDate,
        payment: calculations.monthlyPI,
        principal: principalPayment,
        interest: interestPayment,
        balance,
      });
    }

    return data;
  }, [calculations, inputs.interestRate, inputs.startDate]);

  // Calculate first month's principal/interest split for breakdown chart
  const firstMonthInterest = calculations.loanAmount * (inputs.interestRate / 100 / 12);
  const firstMonthPrincipal = calculations.monthlyPI - firstMonthInterest;

  return (
    <div className="fade-in">
      {/* Loan Type Alert */}
      {!calculations.isJumboLoan && (
        <Alert className="mb-6 border-accent">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Your loan amount of {formatCurrency(calculations.loanAmount)} is below the conforming limit of {formatCurrency(CONFORMING_LIMIT_STANDARD)}. 
            You may qualify for a conventional conforming loan with potentially better rates.
          </AlertDescription>
        </Alert>
      )}

      <div className="calc-layout">
        {/* Input Section */}
        <div>
          <InputCard id="loan-details" title="Your jumbo loan" description="Start with these four. Taxes, insurance and the rest are filled in for you below.">
            <FieldGrid>
              <Field id="home-price" label="Home price">
                <CurrencyInput id="home-price" value={inputs.homePrice} onChange={(value) => updateInput("homePrice", value)} />
              </Field>
              <DownPaymentField
                amount={inputs.downPayment}
                percent={inputs.downPaymentPercent}
                onAmount={(value) => updateInput("downPayment", value)}
                onPercent={(value) => updateInput("downPaymentPercent", value)}
                info="Jumbo lenders usually want 10% to 20% down. Putting down 20% or more avoids PMI."
              />
              <Field id="interest-rate" label="Interest rate" info="Your quoted rate, not the APR. Rates change daily; check a few lenders.">
                <PercentInput id="interest-rate" value={inputs.interestRate} onChange={(value) => updateInput("interestRate", value)} min={0} max={30} decimalPlaces={3} />
              </Field>
              <Field id="loan-term" label="Loan term">
                <TermChoice id="loan-term" value={inputs.loanTerm} onChange={(years) => updateInput("loanTerm", years)} terms={[30, 20, 15, 10]} />
              </Field>
            </FieldGrid>

            <MoreOptions
              title="Taxes, insurance & HOA"
              summary={summarize(
                `${formatCurrency(inputs.propertyTax)}/yr tax`,
                `${formatCurrency(inputs.homeInsurance)}/yr insurance`,
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
                <Field id="hoa-fees" label="HOA dues" unit="per month">
                  <CurrencyInput id="hoa-fees" value={inputs.hoaFees} onChange={(value) => updateInput("hoaFees", value)} />
                </Field>
                <StartDateField value={inputs.startDate} onChange={(v) => updateInput("startDate", v)} />
              </FieldGrid>
            </MoreOptions>
          </InputCard>
        </div>

        {/* Results Section */}
        <aside className="calc-results" aria-label="Calculation Results">
          <StickyResult targetId="calc-result" label={"Monthly payment"} value={formatCurrency(calculations.totalMonthly)} />
          <div id="calc-result" className="result-highlight">
            <p className="text-primary-foreground/80 text-sm font-medium uppercase tracking-wide">
              Monthly Payment
            </p>
            <p className="text-4xl lg:text-5xl font-display font-bold mt-2">
              <AnimatedCurrency value={calculations.totalMonthly} />
            </p>
            {calculations.isJumboLoan && (
              <p className="text-primary-foreground/70 text-xs mt-1">Jumbo Loan</p>
            )}
          </div>

          <div className="calculator-card p-6 space-y-4">
            <h3 className="font-semibold text-lg">Payment Summary</h3>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Loan Amount</span>
                <span className="font-medium">{formatCurrency(calculations.loanAmount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Conforming Limit</span>
                <span className="font-medium">{formatCurrency(CONFORMING_LIMIT_STANDARD)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className={calculations.isJumboLoan ? "text-accent font-medium" : "text-muted-foreground"}>
                  {calculations.isJumboLoan ? "Jumbo Amount" : "Under Limit"}
                </span>
                <span className={calculations.isJumboLoan ? "text-accent font-medium" : "font-medium"}>
                  {calculations.isJumboLoan 
                    ? formatCurrency(calculations.loanAmount - CONFORMING_LIMIT_STANDARD)
                    : formatCurrency(CONFORMING_LIMIT_STANDARD - calculations.loanAmount)}
                </span>
              </div>
              <hr className="border-border" />
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Principal & Interest</span>
                <span className="font-medium">{formatCurrency(calculations.monthlyPI)}</span>
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
                  <span className="text-muted-foreground flex items-center gap-1">
                    PMI
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>PMI may be required for jumbo loans with less than 20% down payment.</p>
                      </TooltipContent>
                    </Tooltip>
                  </span>
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
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Interest ({inputs.loanTerm} years)</span>
                <span className="font-medium">{formatCurrency(calculations.totalInterest)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Cost of Loan</span>
                <span className="font-medium">{formatCurrency(calculations.totalPayment)}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Charts and Schedule Tabs */}
      <section className="mt-8" aria-labelledby="payment-analysis-heading">
        <Tabs defaultValue="breakdown" className="w-full">
          <TabsList className="mb-6 w-full flex justify-start overflow-x-auto">
            <TabsTrigger value="breakdown" className="flex-shrink-0 text-xs sm:text-sm px-2 sm:px-3">
              <span className="hidden sm:inline">Payment Breakdown</span>
              <span className="sm:hidden">Breakdown</span>
            </TabsTrigger>
            <TabsTrigger value="chart" className="flex-shrink-0 text-xs sm:text-sm px-2 sm:px-3">
              <span className="hidden sm:inline">Amortization Chart</span>
              <span className="sm:hidden">Chart</span>
            </TabsTrigger>
            <TabsTrigger value="schedule" className="flex-shrink-0 text-xs sm:text-sm px-2 sm:px-3">
              <span className="hidden sm:inline">Amortization Schedule</span>
              <span className="sm:hidden">Schedule</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="breakdown">
            <PaymentBreakdown
              principal={firstMonthPrincipal}
              interest={firstMonthInterest}
              tax={calculations.monthlyTax}
              insurance={calculations.monthlyInsurance}
              pmi={calculations.monthlyPMI}
              hoa={calculations.monthlyHOA}
            />
          </TabsContent>

          <TabsContent value="chart">
            <AmortizationChart data={amortizationData} />
          </TabsContent>

          <TabsContent value="schedule">
            <AmortizationSchedule data={amortizationData} />
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
};

export default JumboCalculator;
