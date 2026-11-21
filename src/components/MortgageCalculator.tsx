import { useState, useMemo } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PaymentBreakdown from "./PaymentBreakdown";
import AmortizationSchedule from "./AmortizationSchedule";
import AmortizationChart from "./AmortizationChart";
import CurrencyInput from "./CurrencyInput";
import PercentInput from "./PercentInput";
import { formatCurrency } from "@/lib/formatters";
import { monthsUntilBalance } from "@/lib/mortgageMath";
import StickyResult from "./StickyResult";
import { InputCard, FieldGrid, Field, TermChoice, MoreOptions, summarize } from "./calc/Form";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

interface MortgageInputs {
  homePrice: number;
  downPayment: number;
  downPaymentPercent: number;
  loanTerm: number;
  interestRate: number;
  propertyTax: number;
  homeInsurance: number;
  pmi: number;
  hoaFees: number;
  startDate: string;
  /** Property tax as % of price a year. While set, the tax follows the home price; typing a tax amount clears it. */
  taxRate: number | null;
}

export interface TaxArea {
  /** Shown in the picker, e.g. "Travis County". */
  label: string;
  /** Effective property tax rate, % of home value a year. */
  rate: number;
}

interface MortgageCalculatorProps {
  /** Starting values, e.g. a state's median home value, tax rate and insurance. */
  initial?: { homePrice: number; propertyTaxRate: number; homeInsurance: number };
  /** Areas (such as counties) the visitor can pick to set the property tax rate. The first is the default. */
  taxAreas?: TaxArea[];
  /** Label for the area picker, e.g. "County". */
  taxAreaLabel?: string;
}

const MortgageCalculator = ({ initial, taxAreas, taxAreaLabel = "Area" }: MortgageCalculatorProps = {}) => {
  const startPrice = initial?.homePrice ?? 300000;
  const [areaIndex, setAreaIndex] = useState(0);
  const [inputs, setInputs] = useState<MortgageInputs>({
    homePrice: startPrice,
    downPayment: startPrice * 0.2,
    downPaymentPercent: 20,
    loanTerm: 30,
    interestRate: 6.5,
    propertyTax: initial ? Math.round((startPrice * initial.propertyTaxRate) / 100) : 3600,
    taxRate: initial ? initial.propertyTaxRate : null,
    homeInsurance: initial?.homeInsurance ?? 1200,
    pmi: 0,
    hoaFees: 0,
    startDate: new Date().toISOString().slice(0, 7),
  });

  const updateInput = (field: keyof MortgageInputs, value: number | string) => {
    setInputs((prev) => {
      const updated = { ...prev, [field]: value };
      
      if (field === "propertyTax") {
        updated.taxRate = null;
      }
      if (field === "homePrice" && prev.taxRate !== null) {
        updated.propertyTax = Math.round((Number(value) * prev.taxRate) / 100);
      }

      if (field === "downPayment") {
        updated.downPaymentPercent = (Number(value) / prev.homePrice) * 100;
      } else if (field === "downPaymentPercent") {
        updated.downPayment = (Number(value) / 100) * prev.homePrice;
      } else if (field === "homePrice") {
        updated.downPayment = (prev.downPaymentPercent / 100) * Number(value);
      }

      // Estimate PMI (0.5% of the loan a year) when the price or down payment
      // changes. A PMI amount the user typed is kept until one of those changes.
      if (field === "homePrice" || field === "downPayment" || field === "downPaymentPercent") {
        const loanAmount = updated.homePrice - updated.downPayment;
        updated.pmi = updated.downPaymentPercent < 20 ? loanAmount * 0.005 : 0;
      }

      return updated;
    });
  };

  const calculations = useMemo(() => {
    const loanAmount = inputs.homePrice - inputs.downPayment;
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
    const monthlyPMI = inputs.pmi / 12;
    const monthlyHOA = inputs.hoaFees;

    const totalMonthly = monthlyPI + monthlyTax + monthlyInsurance + monthlyPMI + monthlyHOA;
    const totalInterest = monthlyPI * numPayments - loanAmount;
    // PMI ends automatically when the balance reaches 78% of the original value.
    const pmiMonths = monthlyPMI > 0 ? monthsUntilBalance(loanAmount, inputs.interestRate, numPayments, inputs.homePrice * 0.78) : 0;
    const totalPayment =
      (monthlyPI + monthlyTax + monthlyInsurance + monthlyHOA) * numPayments + monthlyPMI * pmiMonths;

    return {
      loanAmount,
      monthlyPI,
      monthlyTax,
      monthlyInsurance,
      monthlyPMI,
      monthlyHOA,
      totalMonthly,
      totalInterest,
      totalPayment,
      pmiMonths,
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

  return (
    <div className="fade-in">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Input Section */}
        <div className="lg:col-span-2">
          <InputCard id="loan-details" title="Your loan" description="Start with these four. Taxes, insurance and fees are filled in for you below.">
            <FieldGrid>
              <Field id="home-price" label="Home price">
                <CurrencyInput id="home-price" value={inputs.homePrice} onChange={(value) => updateInput("homePrice", value)} />
              </Field>

              <Field id="down-payment" label="Down payment" info="Putting down 20% or more avoids PMI. The percent and dollar amount stay in sync.">
                <div className="flex gap-2">
                  <CurrencyInput id="down-payment" value={inputs.downPayment} onChange={(value) => updateInput("downPayment", value)} />
                  <PercentInput
                    value={inputs.downPaymentPercent}
                    onChange={(value) => updateInput("downPaymentPercent", value)}
                    className="w-[4.75rem] shrink-0 px-2"
                    decimalPlaces={1}
                    min={0}
                    max={100}
                    aria-label="Down payment percentage"
                  />
                </div>
              </Field>

              <Field id="interest-rate" label="Interest rate" info="Your quoted rate, not the APR. Rates change daily; check a few lenders.">
                <PercentInput id="interest-rate" value={inputs.interestRate} onChange={(value) => updateInput("interestRate", value)} decimalPlaces={3} min={0} max={30} />
              </Field>

              <Field id="loan-term" label="Loan term">
                <TermChoice id="loan-term" value={inputs.loanTerm} onChange={(years) => updateInput("loanTerm", years)} />
              </Field>
            </FieldGrid>

            <MoreOptions
              title="Taxes, insurance & fees"
              summary={summarize(
                `${formatCurrency(inputs.propertyTax)}/yr tax`,
                `${formatCurrency(inputs.homeInsurance)}/yr insurance`,
                inputs.pmi > 0 ? `${formatCurrency(inputs.pmi)}/yr PMI` : "no PMI",
                inputs.hoaFees > 0 ? `${formatCurrency(inputs.hoaFees)}/mo HOA` : "no HOA",
              )}
            >
              <FieldGrid>
                {taxAreas && taxAreas.length > 1 && (
                  <Field id="tax-area" label={taxAreaLabel} hint="Sets the property tax rate." className="sm:col-span-2">
                    <Select
                      value={String(areaIndex)}
                      onValueChange={(v) => {
                        const i = Number(v);
                        setAreaIndex(i);
                        const rate = taxAreas[i].rate;
                        setInputs((prev) => ({ ...prev, taxRate: rate, propertyTax: Math.round((prev.homePrice * rate) / 100) }));
                      }}
                    >
                      <SelectTrigger id="tax-area" aria-describedby="tax-area-hint">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="max-h-80">
                        {taxAreas.map((a, i) => (
                          <SelectItem key={a.label} value={String(i)}>
                            {a.label} ({a.rate.toFixed(2)}%)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                )}

                <Field
                  id="property-tax"
                  label="Property tax"
                  unit="per year"
                  hint={inputs.taxRate !== null ? `${inputs.taxRate.toFixed(2)}% of the home price` : undefined}
                >
                  <CurrencyInput
                    id="property-tax"
                    value={inputs.propertyTax}
                    onChange={(value) => updateInput("propertyTax", value)}
                    aria-describedby={inputs.taxRate !== null ? "property-tax-hint" : undefined}
                  />
                </Field>

                <Field id="home-insurance" label="Home insurance" unit="per year">
                  <CurrencyInput id="home-insurance" value={inputs.homeInsurance} onChange={(value) => updateInput("homeInsurance", value)} />
                </Field>

                <Field
                  id="pmi"
                  label="PMI"
                  unit="per year"
                  tag={inputs.downPaymentPercent < 20 ? "Auto" : undefined}
                  info="Estimated at 0.5% of the loan a year when you put down less than 20%. It ends once the balance reaches 78% of the price."
                >
                  <CurrencyInput id="pmi" value={Math.round(inputs.pmi)} onChange={(value) => updateInput("pmi", value)} />
                </Field>

                <Field id="hoa-fees" label="HOA dues" unit="per month">
                  <CurrencyInput id="hoa-fees" value={inputs.hoaFees} onChange={(value) => updateInput("hoaFees", value)} />
                </Field>

                <Field id="start-month" label="First payment" hint="Sets the dates in the schedule.">
                  <div className="flex gap-2">
                    <Select
                      value={inputs.startDate.split("-")[1]}
                      onValueChange={(month) => updateInput("startDate", `${inputs.startDate.split("-")[0]}-${month}`)}
                    >
                      <SelectTrigger id="start-month" aria-label="Loan start month" className="flex-1">
                        <SelectValue placeholder="Month" />
                      </SelectTrigger>
                      <SelectContent>
                        {MONTHS.map((m, i) => (
                          <SelectItem key={m} value={String(i + 1).padStart(2, "0")}>
                            {m}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select
                      value={inputs.startDate.split("-")[0]}
                      onValueChange={(year) => updateInput("startDate", `${year}-${inputs.startDate.split("-")[1]}`)}
                    >
                      <SelectTrigger aria-label="Loan start year" className="w-24">
                        <SelectValue placeholder="Year" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 30 }, (_, i) => {
                          const year = new Date().getFullYear() + i;
                          return (
                            <SelectItem key={year} value={year.toString()}>
                              {year}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                </Field>
              </FieldGrid>
            </MoreOptions>
          </InputCard>
        </div>

        {/* Results Section */}
        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start" aria-label="Calculation Results">
          <StickyResult targetId="calc-result" label={"Monthly payment"} value={formatCurrency(calculations.totalMonthly)} />
          <div id="calc-result" className="result-highlight">
            <p className="text-primary-foreground/80 text-sm font-medium uppercase tracking-wide">
              Monthly Payment
            </p>
            <p className="text-4xl lg:text-5xl font-display font-bold mt-2 number-pop">
              {formatCurrency(calculations.totalMonthly)}
            </p>
          </div>

          <div className="calculator-card p-6 space-y-4">
            <h3 className="font-semibold text-lg">Payment Summary</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Loan Amount</span>
                <span className="font-medium">{formatCurrency(calculations.loanAmount)}</span>
              </div>
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
                  <span className="text-muted-foreground">
                    PMI{calculations.pmiMonths > 0 && ` (ends in ~${Math.ceil(calculations.pmiMonths / 12)} yrs)`}
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
                <span className="text-muted-foreground">Total of All Payments</span>
                <span className="font-medium">{formatCurrency(calculations.totalPayment)}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Charts and Schedule */}
      <div className="mt-8">
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
              principal={calculations.monthlyPI - (calculations.loanAmount * (inputs.interestRate / 100 / 12))}
              interest={calculations.loanAmount * (inputs.interestRate / 100 / 12)}
              tax={calculations.monthlyTax}
              insurance={calculations.monthlyInsurance}
              pmi={calculations.monthlyPMI}
              hoa={calculations.monthlyHOA}
              pmiNote={calculations.pmiMonths > 0 ? `Ends after about ${Math.ceil(calculations.pmiMonths / 12)} years` : undefined}
            />
          </TabsContent>

          <TabsContent value="chart">
            <AmortizationChart data={amortizationData} />
          </TabsContent>

          <TabsContent value="schedule">
            <AmortizationSchedule data={amortizationData} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MortgageCalculator;
