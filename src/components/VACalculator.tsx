import { useState, useMemo } from "react";
import { Info } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import PaymentBreakdown from "./PaymentBreakdown";
import AmortizationSchedule from "./AmortizationSchedule";
import AmortizationChart from "./AmortizationChart";
import CurrencyInput from "./CurrencyInput";
import PercentInput from "./PercentInput";
import { formatCurrency } from "@/lib/formatters";
import StickyResult from "./StickyResult";
import { AnimatedCurrency } from "@/components/AnimatedNumber";
import { InputCard, FieldGrid, Field, TermChoice, MoreOptions, DownPaymentField, StartDateField, summarize, Choice } from "./calc/Form";
import { vaFundingFeeRate } from "@/lib/loanLimits";

interface VAInputs {
  homePrice: number;
  downPayment: number;
  downPaymentPercent: number;
  loanTerm: number;
  interestRate: number;
  propertyTax: number;
  homeInsurance: number;
  hoaFees: number;
  startDate: string;
  firstTimeUse: boolean;
  hasDisability: boolean;
  financeFundingFee: boolean;
}

const VACalculator = () => {
  const [inputs, setInputs] = useState<VAInputs>({
    homePrice: 400000,
    downPayment: 0,
    downPaymentPercent: 0,
    loanTerm: 30,
    interestRate: 6.25,
    propertyTax: 4800,
    homeInsurance: 1500,
    hoaFees: 0,
    startDate: new Date().toISOString().slice(0, 7),
    firstTimeUse: true,
    hasDisability: false,
    financeFundingFee: true,
  });

  const updateInput = (field: keyof VAInputs, value: number | string | boolean) => {
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
    const baseLoanAmount = inputs.homePrice - inputs.downPayment;
    
    // Calculate VA funding fee
    const fundingFeeRate = vaFundingFeeRate(inputs.firstTimeUse, inputs.downPaymentPercent, inputs.hasDisability);
    const fundingFee = baseLoanAmount * (fundingFeeRate / 100);
    
    // Total loan amount depends on whether funding fee is financed
    const totalLoanAmount = inputs.financeFundingFee 
      ? baseLoanAmount + fundingFee 
      : baseLoanAmount;

    const monthlyRate = inputs.interestRate / 100 / 12;
    const numPayments = inputs.loanTerm * 12;

    // Monthly principal & interest
    const monthlyPI =
      monthlyRate > 0
        ? (totalLoanAmount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
          (Math.pow(1 + monthlyRate, numPayments) - 1)
        : totalLoanAmount / numPayments;

    const monthlyTax = inputs.propertyTax / 12;
    const monthlyInsurance = inputs.homeInsurance / 12;
    const monthlyHOA = inputs.hoaFees;

    // VA loans don't require PMI!
    const totalMonthly = monthlyPI + monthlyTax + monthlyInsurance + monthlyHOA;
    const totalInterest = monthlyPI * numPayments - totalLoanAmount;

    return {
      baseLoanAmount,
      fundingFeeRate,
      fundingFee,
      totalLoanAmount,
      monthlyPI,
      monthlyTax,
      monthlyInsurance,
      monthlyHOA,
      totalMonthly,
      totalInterest,
      numPayments,
    };
  }, [inputs]);

  const amortizationData = useMemo(() => {
    const data = [];
    let balance = calculations.totalLoanAmount;
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
  const firstMonthInterest = calculations.totalLoanAmount * (inputs.interestRate / 100 / 12);
  const firstMonthPrincipal = calculations.monthlyPI - firstMonthInterest;

  return (
    <div className="fade-in">
      <div className="calc-layout">
        {/* Input Section */}
        <div>
          <InputCard id="loan-details" title="Your VA loan" description="Start with these four. Taxes, insurance and the rest are filled in for you below.">
            <FieldGrid>
              <Field id="home-price" label="Home price">
                <CurrencyInput id="home-price" value={inputs.homePrice} onChange={(value) => updateInput("homePrice", value)} />
              </Field>
              <DownPaymentField
                amount={inputs.downPayment}
                percent={inputs.downPaymentPercent}
                onAmount={(value) => updateInput("downPayment", value)}
                onPercent={(value) => updateInput("downPaymentPercent", value)}
                info="VA loans allow 0% down. Putting down 5% or more lowers the funding fee."
              />
              <Field id="interest-rate" label="Interest rate" info="Your quoted rate, not the APR. Rates change daily; check a few lenders.">
                <PercentInput id="interest-rate" value={inputs.interestRate} onChange={(value) => updateInput("interestRate", value)} min={0} max={30} decimalPlaces={3} />
              </Field>
              <Field id="loan-term" label="Loan term">
                <TermChoice id="loan-term" value={inputs.loanTerm} onChange={(years) => updateInput("loanTerm", years)} terms={[30, 25, 20, 15]} />
              </Field>
            </FieldGrid>

            <MoreOptions
              title="VA funding fee"
              summary={summarize(
                inputs.hasDisability ? "Exempt (disability rating)" : inputs.firstTimeUse ? "First VA loan" : "Used VA benefit before",
                !inputs.hasDisability && (inputs.financeFundingFee ? "added to the loan" : "paid at closing"),
              )}
            >
              <FieldGrid>
                <Field id="va-first-va-loan" label="First VA loan?" info="First-time users pay a lower funding fee than borrowers who have used their VA benefit before.">
                  <Choice
                    id="va-first-va-loan"
                    label="First VA loan?"
                    value={inputs.firstTimeUse ? "yes" : "no"}
                    onChange={(v) => updateInput("firstTimeUse", v === "yes")}
                    options={[{ value: "yes", label: "Yes" }, { value: "no", label: "No" }]}
                  />
                </Field>
                <Field id="va-disability-10" label="Disability rating 10% or more?" info="Veterans with a service-connected disability rating of 10% or higher don't pay the funding fee.">
                  <Choice
                    id="va-disability-10"
                    label="Disability rating 10% or more?"
                    value={inputs.hasDisability ? "yes" : "no"}
                    onChange={(v) => updateInput("hasDisability", v === "yes")}
                    options={[{ value: "yes", label: "Yes" }, { value: "no", label: "No" }]}
                  />
                </Field>
                {!inputs.hasDisability && (
                  <Field id="va-finance-fee" label="Pay the funding fee" info="You can add the funding fee to the loan or pay it in cash at closing.">
                    <Choice
                      id="va-finance-fee"
                      label="Pay the funding fee"
                      value={inputs.financeFundingFee ? "financed" : "upfront"}
                      onChange={(v) => updateInput("financeFundingFee", v === "financed")}
                      options={[{ value: "financed", label: "In the loan" }, { value: "upfront", label: "At closing" }]}
                    />
                  </Field>
                )}
              </FieldGrid>
            </MoreOptions>

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
            <p className="text-primary-foreground/70 text-xs mt-1">No PMI Required!</p>
          </div>

          <div className="calculator-card p-6 space-y-4">
            <h3 className="font-semibold text-lg">Payment Summary</h3>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Base Loan Amount</span>
                <span className="font-medium">{formatCurrency(calculations.baseLoanAmount)}</span>
              </div>
              {calculations.fundingFee > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-1">
                    VA Funding Fee ({calculations.fundingFeeRate}%)
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>The VA funding fee helps sustain the VA loan program. It varies based on service type, down payment, and prior VA loan use.</p>
                      </TooltipContent>
                    </Tooltip>
                  </span>
                  <span className="font-medium">{formatCurrency(calculations.fundingFee)}</span>
                </div>
              )}
              {inputs.hasDisability && (
                <div className="flex justify-between text-sm">
                  <span className="text-accent-strong font-medium">Funding Fee Exempt</span>
                  <span className="text-accent-strong font-medium">$0</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-medium">
                <span className="text-foreground">Total Loan Amount</span>
                <span>{formatCurrency(calculations.totalLoanAmount)}</span>
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
              pmi={0}
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

export default VACalculator;
