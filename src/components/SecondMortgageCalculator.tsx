import { useState, useMemo } from "react";
import { Home, Percent, Calendar, DollarSign, Shield, Building, Users, Calculator } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CompareTable from "./viz/CompareTable";
import StackedBar from "./viz/StackedBar";
import { Legend } from "./viz/VizCard";
import { SERIES } from "./viz/theme";
import CurrencyInput from "./CurrencyInput";
import PercentInput from "./PercentInput";
import { formatCurrency } from "@/lib/formatters";
import { monthsUntilBalance } from "@/lib/mortgageMath";
import StickyResult from "./StickyResult";

interface SecondMortgageInputs {
  homeValue: number;
  downPayment: number;
  downPaymentPercent: number;
  annualPMI: number;
  propertyTax: number;
  homeInsurance: number;
  hoaFees: number;
  // With PMI scenario
  pmiInterestRate: number;
  pmiLoanTerm: number;
  pmiDiscountPoints: number;
  pmiClosingCosts: number;
  // 80% First Mortgage
  firstMortInterestRate: number;
  firstMortLoanTerm: number;
  firstMortDiscountPoints: number;
  firstMortClosingCosts: number;
  // Second Mortgage
  secondMortInterestRate: number;
  secondMortLoanTerm: number;
  secondMortDiscountPoints: number;
  secondMortClosingCosts: number;
}

const SecondMortgageCalculator = () => {
  const [inputs, setInputs] = useState<SecondMortgageInputs>({
    homeValue: 400000,
    downPayment: 20000,
    downPaymentPercent: 5,
    annualPMI: 0.5,
    propertyTax: 2700,
    homeInsurance: 2400,
    hoaFees: 0,
    // With PMI
    pmiInterestRate: 6.0,
    pmiLoanTerm: 30,
    pmiDiscountPoints: 1.0,
    pmiClosingCosts: 1200,
    // 80% First
    firstMortInterestRate: 6.0,
    firstMortLoanTerm: 30,
    firstMortDiscountPoints: 2.0,
    firstMortClosingCosts: 700,
    // Second Mortgage
    secondMortInterestRate: 8.0,
    secondMortLoanTerm: 15,
    secondMortDiscountPoints: 1.0,
    secondMortClosingCosts: 1000,
  });

  const updateInput = (field: keyof SecondMortgageInputs, value: number) => {
    setInputs((prev) => {
      const updated = { ...prev, [field]: value };
      
      if (field === "downPayment") {
        updated.downPaymentPercent = (value / prev.homeValue) * 100;
      } else if (field === "downPaymentPercent") {
        updated.downPayment = (value / 100) * prev.homeValue;
      } else if (field === "homeValue") {
        updated.downPayment = (prev.downPaymentPercent / 100) * value;
      }

      return updated;
    });
  };

  const calculations = useMemo(() => {
    const homeValue = inputs.homeValue;
    const downPayment = inputs.downPayment;
    const downPaymentPercent = inputs.downPaymentPercent;

    // Calculate monthly payment helper
    const calcMonthlyPayment = (principal: number, rate: number, years: number) => {
      const monthlyRate = rate / 100 / 12;
      const numPayments = years * 12;
      if (monthlyRate === 0) return principal / numPayments;
      return (principal * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
             (Math.pow(1 + monthlyRate, numPayments) - 1);
    };

    // Scenario 1: With PMI (full loan amount)
    const pmiLoanAmount = homeValue - downPayment;
    const pmiMonthlyPI = calcMonthlyPayment(pmiLoanAmount, inputs.pmiInterestRate, inputs.pmiLoanTerm);
    const pmiPointsCost = (inputs.pmiDiscountPoints / 100) * pmiLoanAmount;
    const pmiTotalClosing = pmiPointsCost + inputs.pmiClosingCosts;
    const pmiMonthlyPMI = (pmiLoanAmount * (inputs.annualPMI / 100)) / 12;
    const pmiMonthlyPayment = pmiMonthlyPI + pmiMonthlyPMI;
    const pmiTotalInterest = (pmiMonthlyPI * inputs.pmiLoanTerm * 12) - pmiLoanAmount;
    // PMI ends automatically once the balance reaches 78% of the home's value.
    const pmiMonths = monthsUntilBalance(pmiLoanAmount, inputs.pmiInterestRate, inputs.pmiLoanTerm * 12, homeValue * 0.78);
    const totalPMIPaid = pmiMonths * pmiMonthlyPMI;

    // Scenario 2: 80% First + Second Mortgage (Piggyback)
    // With 20% or more down there's nothing to piggyback: the first mortgage covers it all.
    const firstMortAmount = Math.min(homeValue * 0.8, homeValue - downPayment);
    const secondMortAmount = Math.max(0, homeValue - downPayment - firstMortAmount);
    
    const firstMortMonthlyPI = calcMonthlyPayment(firstMortAmount, inputs.firstMortInterestRate, inputs.firstMortLoanTerm);
    const firstMortPointsCost = (inputs.firstMortDiscountPoints / 100) * firstMortAmount;
    const firstMortTotalClosing = firstMortPointsCost + inputs.firstMortClosingCosts;
    const firstMortTotalInterest = (firstMortMonthlyPI * inputs.firstMortLoanTerm * 12) - firstMortAmount;

    const secondMortMonthlyPI = secondMortAmount > 0 ? 
      calcMonthlyPayment(secondMortAmount, inputs.secondMortInterestRate, inputs.secondMortLoanTerm) : 0;
    const secondMortPointsCost = (inputs.secondMortDiscountPoints / 100) * secondMortAmount;
    const secondMortTotalClosing = secondMortPointsCost + inputs.secondMortClosingCosts;
    const secondMortTotalInterest = secondMortAmount > 0 ? 
      (secondMortMonthlyPI * inputs.secondMortLoanTerm * 12) - secondMortAmount : 0;

    const piggybackMonthlyPayment = firstMortMonthlyPI + secondMortMonthlyPI;
    const piggybackTotalClosing = firstMortTotalClosing + secondMortTotalClosing;

    // Monthly costs (same for both scenarios)
    const monthlyTax = inputs.propertyTax / 12;
    const monthlyInsurance = inputs.homeInsurance / 12;
    const monthlyHOA = inputs.hoaFees;
    const monthlyOther = monthlyTax + monthlyInsurance + monthlyHOA;

    // Total monthly costs
    const pmiTotalMonthly = pmiMonthlyPayment + monthlyOther;
    const piggybackTotalMonthly = piggybackMonthlyPayment + monthlyOther;

    // Total costs over loan life (using first mortgage term for comparison)
    const termMonths = inputs.pmiLoanTerm * 12;
    const pmiTotalCost = (pmiMonthlyPI * termMonths) + totalPMIPaid + pmiTotalClosing + downPayment;
    const piggybackTotalCost = (firstMortMonthlyPI * inputs.firstMortLoanTerm * 12) + 
                               (secondMortMonthlyPI * inputs.secondMortLoanTerm * 12) + 
                               piggybackTotalClosing + downPayment;

    const savings = pmiTotalCost - piggybackTotalCost;
    const betterOption = savings > 0 ? "piggyback" : "pmi";

    return {
      pmi: {
        loanAmount: pmiLoanAmount,
        monthlyPI: pmiMonthlyPI,
        monthlyPMI: pmiMonthlyPMI,
        monthlyPayment: pmiMonthlyPayment,
        totalMonthly: pmiTotalMonthly,
        pointsCost: pmiPointsCost,
        closingCosts: inputs.pmiClosingCosts,
        totalClosing: pmiTotalClosing,
        upfrontCost: pmiTotalClosing + downPayment,
        totalInterest: pmiTotalInterest,
        totalPMIPaid,
        pmiMonths,
        totalCost: pmiTotalCost,
      },
      firstMort: {
        loanAmount: firstMortAmount,
        monthlyPI: firstMortMonthlyPI,
        pointsCost: firstMortPointsCost,
        closingCosts: inputs.firstMortClosingCosts,
        totalClosing: firstMortTotalClosing,
        totalInterest: firstMortTotalInterest,
      },
      secondMort: {
        loanAmount: secondMortAmount,
        monthlyPI: secondMortMonthlyPI,
        pointsCost: secondMortPointsCost,
        closingCosts: inputs.secondMortClosingCosts,
        totalClosing: secondMortTotalClosing,
        totalInterest: secondMortTotalInterest,
      },
      piggyback: {
        monthlyPayment: piggybackMonthlyPayment,
        totalMonthly: piggybackTotalMonthly,
        totalClosing: piggybackTotalClosing,
        upfrontCost: piggybackTotalClosing + downPayment,
        totalCost: piggybackTotalCost,
      },
      monthlyOther,
      monthlyTax,
      monthlyInsurance,
      monthlyHOA,
      savings: Math.abs(savings),
      betterOption,
      downPayment,
    };
  }, [inputs]);

  return (
    <div className="fade-in">
      <Tabs defaultValue="calculator" className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-6">
          <TabsTrigger value="calculator">Calculator</TabsTrigger>
          <TabsTrigger value="first-mort">First Mort</TabsTrigger>
          <TabsTrigger value="second-mort">Second Mort</TabsTrigger>
        </TabsList>

        <TabsContent value="calculator" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Input Section */}
            <section className="calculator-card p-4 sm:p-6" aria-labelledby="home-details-heading">
              <h2 id="home-details-heading" className="text-base sm:text-xl font-display font-semibold mb-4 flex items-center gap-2">
                <Home className="h-4 w-4 sm:h-5 sm:w-5 text-accent" aria-hidden="true" />
                Home Price & Down Payment
              </h2>

              <div className="space-y-3">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="second-mortgage-home-value" className="text-sm font-medium text-foreground">
                    Home Value
                  </Label>
                  <CurrencyInput id="second-mortgage-home-value"
                    value={inputs.homeValue}
                    onChange={(value) => updateInput("homeValue", value)}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <span className="text-sm font-medium text-foreground">Loan structure</span>
                  <div className="flex flex-wrap gap-2" role="group" aria-label="Piggyback loan structure">
                    {[
                      { label: "80/10/10", down: 10 },
                      { label: "80/15/5", down: 5 },
                      { label: "80/20", down: 0 },
                    ].map((preset) => {
                      const active = Math.abs(inputs.downPaymentPercent - preset.down) < 0.05;
                      return (
                        <button
                          key={preset.label}
                          type="button"
                          aria-pressed={active}
                          onClick={() => updateInput("downPaymentPercent", preset.down)}
                          className={`rounded-full border px-3 py-1 text-sm font-medium transition-colors ${
                            active
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border bg-background text-foreground hover:border-primary/40 hover:bg-secondary"
                          }`}
                        >
                          {preset.label}
                        </button>
                      );
                    })}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    80% first mortgage / {Math.max(0, 20 - inputs.downPaymentPercent).toFixed(1).replace(/\.0$/, "")}% second mortgage /{" "}
                    {inputs.downPaymentPercent.toFixed(1).replace(/\.0$/, "")}% down
                  </span>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="second-mortgage-down-payment" className="text-sm font-medium text-foreground">
                    Down Payment
                  </Label>
                  <div className="flex gap-2 flex-1">
                    <CurrencyInput id="second-mortgage-down-payment"
                      value={inputs.downPayment}
                      onChange={(value) => updateInput("downPayment", value)}
                    />
                    <PercentInput
                      aria-label="Down payment percentage"
                      value={inputs.downPaymentPercent}
                      onChange={(value) => updateInput("downPaymentPercent", value)}
                      min={0}
                      max={100}
                      decimalPlaces={1}
                      className="w-16"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="second-mortgage-annual-pmi-rate" className="text-sm font-medium text-foreground">
                    Annual PMI Rate
                  </Label>
                  <div className="flex gap-2 flex-1">
                    <PercentInput id="second-mortgage-annual-pmi-rate"
                      value={inputs.annualPMI}
                      onChange={(value) => updateInput("annualPMI", value)}
                      min={0}
                      max={5}
                      decimalPlaces={2}
                    />
                  </div>
                </div>
              </div>

              <h2 className="text-base sm:text-xl font-display font-semibold mt-6 mb-4 flex items-center gap-2">
                <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-accent" aria-hidden="true" />
                Other Ownership Costs
              </h2>

              <div className="space-y-3">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="second-mortgage-annual-property-tax" className="text-sm font-medium text-foreground">
                    Annual Property Tax
                  </Label>
                  <CurrencyInput id="second-mortgage-annual-property-tax"
                    value={inputs.propertyTax}
                    onChange={(value) => updateInput("propertyTax", value)}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="second-mortgage-annual-insurance" className="text-sm font-medium text-foreground">
                    Annual Insurance
                  </Label>
                  <CurrencyInput id="second-mortgage-annual-insurance"
                    value={inputs.homeInsurance}
                    onChange={(value) => updateInput("homeInsurance", value)}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="second-mortgage-monthly-hoa" className="text-sm font-medium text-foreground">
                    Monthly HOA
                  </Label>
                  <CurrencyInput id="second-mortgage-monthly-hoa"
                    value={inputs.hoaFees}
                    onChange={(value) => updateInput("hoaFees", value)}
                  />
                </div>
              </div>
            </section>

            {/* Loan Scenarios */}
            <section className="calculator-card p-4 sm:p-6" aria-labelledby="scenarios-heading">
              <h2 id="scenarios-heading" className="text-base sm:text-xl font-display font-semibold mb-4 flex items-center gap-2">
                <Calculator className="h-4 w-4 sm:h-5 sm:w-5 text-accent" aria-hidden="true" />
                Loan Scenarios
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 text-muted-foreground font-medium">Scenario</th>
                      <th className="text-center py-2 text-muted-foreground font-medium">With PMI</th>
                      <th className="text-center py-2 text-muted-foreground font-medium">80% Loan</th>
                      <th className="text-center py-2 text-muted-foreground font-medium">2nd Loan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr>
                      <td className="py-2">Interest Rate</td>
                      <td className="py-2 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <PercentInput aria-label="With pmi loan interest rate"
                            value={inputs.pmiInterestRate}
                            onChange={(value) => updateInput("pmiInterestRate", value)}
                            min={0}
                            max={30}
                            decimalPlaces={3}
                            className="h-7 w-14 text-center text-xs"
                          />
                        </div>
                      </td>
                      <td className="py-2 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <PercentInput aria-label="80% first mortgage interest rate"
                            value={inputs.firstMortInterestRate}
                            onChange={(value) => updateInput("firstMortInterestRate", value)}
                            min={0}
                            max={30}
                            decimalPlaces={3}
                            className="h-7 w-14 text-center text-xs"
                          />
                        </div>
                      </td>
                      <td className="py-2 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <PercentInput aria-label="Second mortgage interest rate"
                            value={inputs.secondMortInterestRate}
                            onChange={(value) => updateInput("secondMortInterestRate", value)}
                            min={0}
                            max={30}
                            decimalPlaces={3}
                            className="h-7 w-14 text-center text-xs"
                          />
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2">Loan Term</td>
                      <td className="py-2 text-center">
                        <Select
                          value={inputs.pmiLoanTerm.toString()}
                          onValueChange={(v) => updateInput("pmiLoanTerm", parseInt(v))}
                        >
                          <SelectTrigger aria-label="With pmi loan loan term" className="h-7 w-20 text-xs mx-auto">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="10">10 yrs</SelectItem>
                            <SelectItem value="15">15 yrs</SelectItem>
                            <SelectItem value="20">20 yrs</SelectItem>
                            <SelectItem value="30">30 yrs</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="py-2 text-center">
                        <Select
                          value={inputs.firstMortLoanTerm.toString()}
                          onValueChange={(v) => updateInput("firstMortLoanTerm", parseInt(v))}
                        >
                          <SelectTrigger aria-label="80% first mortgage loan term" className="h-7 w-20 text-xs mx-auto">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="10">10 yrs</SelectItem>
                            <SelectItem value="15">15 yrs</SelectItem>
                            <SelectItem value="20">20 yrs</SelectItem>
                            <SelectItem value="30">30 yrs</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="py-2 text-center">
                        <Select
                          value={inputs.secondMortLoanTerm.toString()}
                          onValueChange={(v) => updateInput("secondMortLoanTerm", parseInt(v))}
                        >
                          <SelectTrigger aria-label="Second mortgage loan term" className="h-7 w-20 text-xs mx-auto">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="5">5 yrs</SelectItem>
                            <SelectItem value="10">10 yrs</SelectItem>
                            <SelectItem value="15">15 yrs</SelectItem>
                            <SelectItem value="20">20 yrs</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2">Discount Points</td>
                      <td className="py-2 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <PercentInput aria-label="With pmi loan discount points"
                    value={inputs.pmiDiscountPoints}
                    onChange={(v) => updateInput("pmiDiscountPoints", v)}
                    min={0}
                    max={5}
                    decimalPlaces={2}
                    className="h-7 w-14 text-center text-xs"
                  />
                        </div>
                      </td>
                      <td className="py-2 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <PercentInput aria-label="80% first mortgage discount points"
                    value={inputs.firstMortDiscountPoints}
                    onChange={(v) => updateInput("firstMortDiscountPoints", v)}
                    min={0}
                    max={5}
                    decimalPlaces={2}
                    className="h-7 w-14 text-center text-xs"
                  />
                        </div>
                      </td>
                      <td className="py-2 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <PercentInput aria-label="Second mortgage discount points"
                    value={inputs.secondMortDiscountPoints}
                    onChange={(v) => updateInput("secondMortDiscountPoints", v)}
                    min={0}
                    max={5}
                    decimalPlaces={2}
                    className="h-7 w-14 text-center text-xs"
                  />
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2">Other Closing</td>
                      <td className="py-2 text-center">
                        <CurrencyInput aria-label="With pmi loan other closing costs"
                          value={inputs.pmiClosingCosts}
                          onChange={(value) => updateInput("pmiClosingCosts", value)}
                          className="h-7 w-20 text-center text-xs mx-auto"
                        />
                      </td>
                      <td className="py-2 text-center">
                        <CurrencyInput aria-label="80% first mortgage other closing costs"
                          value={inputs.firstMortClosingCosts}
                          onChange={(value) => updateInput("firstMortClosingCosts", value)}
                          className="h-7 w-20 text-center text-xs mx-auto"
                        />
                      </td>
                      <td className="py-2 text-center">
                        <CurrencyInput aria-label="Second mortgage other closing costs"
                          value={inputs.secondMortClosingCosts}
                          onChange={(value) => updateInput("secondMortClosingCosts", value)}
                          className="h-7 w-20 text-center text-xs mx-auto"
                        />
                      </td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="py-2 font-medium">Loan Amount</td>
                      <td className="py-2 text-center font-medium">{formatCurrency(calculations.pmi.loanAmount)}</td>
                      <td className="py-2 text-center font-medium">{formatCurrency(calculations.firstMort.loanAmount)}</td>
                      <td className="py-2 text-center font-medium">{formatCurrency(calculations.secondMort.loanAmount)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          {/* Results Comparison */}
          <StickyResult targetId="calc-result" label="Cheaper option" value={`${calculations.betterOption === "piggyback" ? "Piggyback loan" : "Single loan + PMI"} · saves ${formatCurrency(calculations.savings)}`} />
          <section id="calc-result" className="calculator-card p-4 sm:p-6" aria-labelledby="results-heading">
            <h2 id="results-heading" className="text-base sm:text-xl font-display font-semibold mb-4 flex items-center gap-2">
              <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-accent" aria-hidden="true" />
              Financial Analysis
            </h2>

            <p className="mb-5 text-sm text-muted-foreground sm:text-base">
              <strong className="text-foreground">
                {calculations.betterOption === "piggyback" ? "The piggyback loan" : "One loan with PMI"} costs{" "}
                {formatCurrency(calculations.savings)} less
              </strong>{" "}
              over the full terms, counting the down payment, closing costs, payments and PMI.{" "}
              {calculations.betterOption === "piggyback"
                ? "You avoid PMI entirely, at the cost of a second, higher-rate loan."
                : `PMI ends after about ${Math.ceil(calculations.pmi.pmiMonths / 12)} years, which keeps its total cost down.`}
            </p>

            <h3 className="mb-3 font-display text-base font-semibold">Monthly cost, side by side</h3>
            <div className="space-y-4">
              <StackedBar
                title="One loan + PMI"
                total={`${formatCurrency(calculations.pmi.totalMonthly)}/mo`}
                max={Math.max(calculations.pmi.totalMonthly, calculations.piggyback.totalMonthly)}
                segments={[
                  { label: "First mortgage", value: calculations.pmi.monthlyPI, color: SERIES.principal },
                  { label: "PMI", value: calculations.pmi.monthlyPMI, color: SERIES.pmi },
                  { label: "Tax, insurance, HOA", value: calculations.monthlyTax + calculations.monthlyInsurance + calculations.monthlyHOA, color: SERIES.other },
                ]}
              />
              <StackedBar
                title="Piggyback (two loans)"
                total={`${formatCurrency(calculations.piggyback.totalMonthly)}/mo`}
                max={Math.max(calculations.pmi.totalMonthly, calculations.piggyback.totalMonthly)}
                segments={[
                  { label: "First mortgage", value: calculations.firstMort.monthlyPI, color: SERIES.principal },
                  { label: "Second mortgage", value: calculations.secondMort.monthlyPI, color: SERIES.interest },
                  { label: "Tax, insurance, HOA", value: calculations.monthlyTax + calculations.monthlyInsurance + calculations.monthlyHOA, color: SERIES.other },
                ]}
              />
              <Legend
                items={[
                  { label: "First mortgage", color: SERIES.principal },
                  { label: "Second mortgage", color: SERIES.interest },
                  { label: "PMI", color: SERIES.pmi },
                  { label: "Tax, insurance, HOA", color: SERIES.other },
                ]}
              />
            </div>

            <h3 className="mb-1 mt-8 font-display text-base font-semibold">Line by line</h3>
            <CompareTable
              columns={[{ label: "One loan + PMI" }, { label: "Piggyback" }]}
              recommended={calculations.betterOption === "piggyback" ? 1 : 0}
              recommendedLabel="Costs less"
              groups={[
                {
                  title: "Up front",
                  rows: [
                    { label: "Amount borrowed", values: [calculations.pmi.loanAmount, calculations.firstMort.loanAmount + calculations.secondMort.loanAmount] },
                    { label: "Down payment", values: [calculations.downPayment, calculations.downPayment] },
                    { label: "Discount points", values: [calculations.pmi.pointsCost, calculations.firstMort.pointsCost + calculations.secondMort.pointsCost], better: "lower" },
                    { label: "Other closing costs", values: [calculations.pmi.closingCosts, inputs.firstMortClosingCosts + inputs.secondMortClosingCosts], better: "lower" },
                    { label: "Cash needed at closing", values: [calculations.pmi.upfrontCost, calculations.piggyback.upfrontCost], better: "lower", emphasis: true },
                  ],
                },
                {
                  title: "Every month",
                  rows: [
                    {
                      label: "Loan payments",
                      values: [calculations.pmi.monthlyPI, calculations.piggyback.monthlyPayment],
                      display: [undefined, `${formatCurrency(calculations.firstMort.monthlyPI)} + ${formatCurrency(calculations.secondMort.monthlyPI)}`],
                    },
                    { label: "PMI", values: [calculations.pmi.monthlyPMI, 0], note: `Ends after about ${Math.ceil(calculations.pmi.pmiMonths / 12)} years` },
                    { label: "Tax, insurance, HOA", values: [calculations.monthlyTax + calculations.monthlyInsurance + calculations.monthlyHOA, calculations.monthlyTax + calculations.monthlyInsurance + calculations.monthlyHOA] },
                    { label: "Total monthly cost", values: [calculations.pmi.totalMonthly, calculations.piggyback.totalMonthly], better: "lower", emphasis: true },
                  ],
                },
                {
                  title: "Over the full terms",
                  rows: [
                    { label: "Interest", values: [calculations.pmi.totalInterest, calculations.firstMort.totalInterest + calculations.secondMort.totalInterest], better: "lower" },
                    { label: "PMI", values: [calculations.pmi.totalPMIPaid, 0], better: "lower" },
                    { label: "Total cost", values: [calculations.pmi.totalCost, calculations.piggyback.totalCost], better: "lower", emphasis: true, note: "Down payment, closing costs, loan payments and PMI" },
                  ],
                },
              ]}
            />
          </section>
        </TabsContent>

        <TabsContent value="first-mort">
          <section className="calculator-card p-4 sm:p-6">
            <h2 className="text-xl font-display font-semibold mb-4">First Mortgage Details (80% LTV)</h2>
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Loan Amount</p>
                  <p className="text-2xl font-bold">{formatCurrency(calculations.firstMort.loanAmount)}</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Monthly P&I</p>
                  <p className="text-2xl font-bold">{formatCurrency(calculations.firstMort.monthlyPI)}</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Total Interest</p>
                  <p className="text-2xl font-bold">{formatCurrency(calculations.firstMort.totalInterest)}</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Total Closing Costs</p>
                  <p className="text-2xl font-bold">{formatCurrency(calculations.firstMort.totalClosing)}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                The first mortgage covers 80% of the home value at {inputs.firstMortInterestRate}% interest over {inputs.firstMortLoanTerm} years. 
                By keeping this loan at 80% LTV, you avoid PMI requirements.
              </p>
            </div>
          </section>
        </TabsContent>

        <TabsContent value="second-mort">
          <section className="calculator-card p-4 sm:p-6">
            <h2 className="text-xl font-display font-semibold mb-4">Second Mortgage Details</h2>
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Loan Amount</p>
                  <p className="text-2xl font-bold">{formatCurrency(calculations.secondMort.loanAmount)}</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Monthly P&I</p>
                  <p className="text-2xl font-bold">{formatCurrency(calculations.secondMort.monthlyPI)}</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Total Interest</p>
                  <p className="text-2xl font-bold">{formatCurrency(calculations.secondMort.totalInterest)}</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Total Closing Costs</p>
                  <p className="text-2xl font-bold">{formatCurrency(calculations.secondMort.totalClosing)}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                The second mortgage covers the gap between your down payment and the 80% first mortgage. 
                At {inputs.secondMortInterestRate}% interest over {inputs.secondMortLoanTerm} years, this "piggyback" loan helps you avoid PMI.
              </p>
            </div>
          </section>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SecondMortgageCalculator;
