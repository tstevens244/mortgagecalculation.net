import { useState, useMemo } from "react";
import { Home, Percent, DollarSign, Calculator, Calendar, TrendingDown, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import CurrencyInput from "./CurrencyInput";
import PercentInput from "./PercentInput";
import { formatCurrency } from "@/lib/formatters";
import StickyResult from "./StickyResult";
import VizCard from "./viz/VizCard";
import CompareTable from "./viz/CompareTable";
import { BreakEvenChart } from "./viz/LazyCharts";

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
  const [inputs, setInputs] = useState<RefinanceInputs>({
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
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Original Loan Details */}
            <section className="calculator-card p-4 sm:p-6" aria-labelledby="original-loan-heading">
              <h2 id="original-loan-heading" className="text-base sm:text-xl font-display font-semibold mb-4 flex items-center gap-2">
                <Home className="h-4 w-4 sm:h-5 sm:w-5 text-accent" aria-hidden="true" />
                Original Loan Details
              </h2>

              <div className="space-y-3">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="refinance-original-home-price" className="text-sm font-medium text-foreground">
                    Original Home Price
                  </Label>
                  <CurrencyInput id="refinance-original-home-price"
                    value={inputs.originalHomePrice}
                    onChange={(value) => updateInput("originalHomePrice", value)}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="refinance-original-down-payment" className="text-sm font-medium text-foreground">
                    Original Down Payment
                  </Label>
                  <CurrencyInput id="refinance-original-down-payment"
                    value={inputs.originalDownPayment}
                    onChange={(value) => updateInput("originalDownPayment", value)}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label className="text-sm font-medium text-foreground">
                    Original Loan Amount
                  </Label>
                  <div className="flex-1 h-8 sm:h-10 flex items-center px-3 bg-muted rounded-md text-sm font-medium">
                    {formatCurrency(inputs.originalHomePrice - inputs.originalDownPayment)}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="refinance-loan-term" className="text-sm font-medium text-foreground">
                    Loan Term
                  </Label>
                  <Select
                    value={inputs.originalLoanTerm.toString()}
                    onValueChange={(v) => updateInput("originalLoanTerm", parseInt(v))}
                  >
                    <SelectTrigger id="refinance-loan-term" className="h-8 sm:h-10 text-sm flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10 years</SelectItem>
                      <SelectItem value="15">15 years</SelectItem>
                      <SelectItem value="20">20 years</SelectItem>
                      <SelectItem value="30">30 years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="refinance-interest-rate" className="text-sm font-medium text-foreground">
                    Interest Rate
                  </Label>
                  <div className="flex gap-2 flex-1 items-center">
                    <PercentInput id="refinance-interest-rate"
                      value={inputs.originalInterestRate}
                      onChange={(value) => updateInput("originalInterestRate", value)}
                      min={0}
                      max={30}
                      decimalPlaces={3}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="refinance-months-already-paid" className="text-sm font-medium text-foreground">
                    Months Already Paid
                  </Label>
                  <div className="flex gap-2 flex-1 items-center">
                    <Input id="refinance-months-already-paid"
                      type="text"
                      inputMode="numeric"
                      value={inputs.monthsAlreadyPaid}
                      onChange={(e) => updateInput("monthsAlreadyPaid", parseInt(e.target.value) || 0)}
                      className="h-8 sm:h-10 text-sm"
                    />
                    <span className="text-muted-foreground text-sm">months</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-border">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Current Remaining Balance</span>
                    <span className="font-semibold">{formatCurrency(calculations.original.remainingBalance)}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-muted-foreground">Current Monthly Payment</span>
                    <span className="font-semibold">{formatCurrency(calculations.original.monthlyPayment)}</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Refinanced Loan Details */}
            <section className="calculator-card p-4 sm:p-6" aria-labelledby="refinance-heading">
              <h2 id="refinance-heading" className="text-base sm:text-xl font-display font-semibold mb-4 flex items-center gap-2">
                <Calculator className="h-4 w-4 sm:h-5 sm:w-5 text-accent" aria-hidden="true" />
                Refinanced Loan Details
              </h2>

              <div className="space-y-3">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="refinance-new-loan-term" className="text-sm font-medium text-foreground">
                    New Loan Term
                  </Label>
                  <Select
                    value={inputs.newLoanTerm.toString()}
                    onValueChange={(v) => updateInput("newLoanTerm", parseInt(v))}
                  >
                    <SelectTrigger id="refinance-new-loan-term" className="h-8 sm:h-10 text-sm flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10 years</SelectItem>
                      <SelectItem value="15">15 years</SelectItem>
                      <SelectItem value="20">20 years</SelectItem>
                      <SelectItem value="30">30 years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="refinance-new-interest-rate" className="text-sm font-medium text-foreground">
                    New Interest Rate
                  </Label>
                  <div className="flex gap-2 flex-1 items-center">
                    <PercentInput id="refinance-new-interest-rate"
                      value={inputs.newInterestRate}
                      onChange={(value) => updateInput("newInterestRate", value)}
                      min={0}
                      max={30}
                      decimalPlaces={3}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="refinance-years-before-sell" className="text-sm font-medium text-foreground">
                    Years Before Sell
                  </Label>
                  <div className="flex gap-2 flex-1 items-center">
                    <Input id="refinance-years-before-sell"
                      type="text"
                      inputMode="numeric"
                      value={inputs.yearsBeforeSell}
                      onChange={(e) => updateInput("yearsBeforeSell", parseInt(e.target.value) || 0)}
                      className="h-8 sm:h-10 text-sm"
                    />
                    <span className="text-muted-foreground text-sm">years</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-border">
                  <h3 className="text-sm font-medium mb-2">Fees and Points</h3>
                  
                  <div className="flex items-center gap-3 mb-2">
                    <Label htmlFor="refinance-discount-points" className="text-xs sm:text-sm text-muted-foreground min-w-[130px]">
                      Discount Points
                    </Label>
                      <div className="flex gap-2 flex-1 items-center">
                      <PercentInput id="refinance-discount-points"
                        value={inputs.discountPoints}
                        onChange={(value) => updateInput("discountPoints", value)}
                        min={0}
                        max={10}
                        decimalPlaces={2}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mb-2">
                    <Label htmlFor="refinance-origination-fees" className="text-xs sm:text-sm text-muted-foreground min-w-[130px]">
                      Origination Fees
                    </Label>
                    <div className="flex gap-2 flex-1 items-center">
                      <PercentInput id="refinance-origination-fees"
                        value={inputs.originationFees}
                        onChange={(value) => updateInput("originationFees", value)}
                        min={0}
                        max={10}
                        decimalPlaces={2}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="refinance-other-closing-costs" className="text-sm font-medium text-foreground">
                      Other Closing Costs
                    </Label>
                    <CurrencyInput id="refinance-other-closing-costs"
                      value={inputs.otherClosingCosts}
                      onChange={(value) => updateInput("otherClosingCosts", value)}
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-border">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">New Monthly Payment</span>
                    <span className="font-semibold">{formatCurrency(calculations.refinanced.monthlyPayment)}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-muted-foreground">Total Closing Costs</span>
                    <span className="font-semibold">{formatCurrency(calculations.refinanced.totalClosingCosts)}</span>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Tax Rates */}
          <section className="calculator-card p-4 sm:p-6" aria-labelledby="tax-heading">
            <h2 id="tax-heading" className="text-base sm:text-xl font-display font-semibold mb-4 flex items-center gap-2">
              <Percent className="h-4 w-4 sm:h-5 sm:w-5 text-accent" aria-hidden="true" />
              Federal & State Income Taxes
            </h2>

            <Alert className="mb-4 border-amber-500/50 bg-amber-500/10">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <AlertTitle className="text-amber-600">Are You Itemizing Deductions?</AlertTitle>
              <AlertDescription className="text-xs text-muted-foreground">
                With the higher standard deductions from the 2017 TCJA, few filers itemize. If you don't plan on 
                itemizing, set both tax rates to 0% to remove their impact on your calculation.
              </AlertDescription>
            </Alert>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="refinance-federal-tax-rate" className="text-sm font-medium text-foreground">
                  Federal tax rate (if you itemize)
                </Label>
                <div className="flex gap-2 flex-1 items-center">
                  <PercentInput id="refinance-federal-tax-rate"
                    value={inputs.federalTaxRate}
                    onChange={(v) => updateInput("federalTaxRate", v)}
                    min={0}
                    max={50}
                    decimalPlaces={2}
                    className="h-8 sm:h-10 text-sm"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="refinance-state-tax-rate" className="text-sm font-medium text-foreground">
                  State tax rate (if you itemize)
                </Label>
                <div className="flex gap-2 flex-1 items-center">
                  <PercentInput id="refinance-state-tax-rate"
                    value={inputs.stateTaxRate}
                    onChange={(v) => updateInput("stateTaxRate", v)}
                    min={0}
                    max={20}
                    decimalPlaces={2}
                    className="h-8 sm:h-10 text-sm"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Results Summary Card */}
          <StickyResult targetId="calc-result" label={calculations.comparison.shouldRefinance ? "Refinancing saves" : "Refinancing costs"} value={`${formatCurrency(Math.abs(calculations.comparison.totalBenefit))}${calculations.comparison.shouldRefinance && Number.isFinite(calculations.comparison.breakEvenMonths) ? ` · break-even ${calculations.comparison.breakEvenMonths} mo` : ""}`} />
          <section id="calc-result" className="calculator-card p-4 sm:p-6 bg-gradient-to-br from-primary/5 to-accent/5" aria-labelledby="summary-heading">
            <h2 id="summary-heading" className="text-base sm:text-xl font-display font-semibold mb-4 flex items-center gap-2">
              <TrendingDown className="h-4 w-4 sm:h-5 sm:w-5 text-accent" aria-hidden="true" />
              Should You Refinance? Here Are Your Results
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 text-muted-foreground font-medium">Your Savings</th>
                    <th className="text-right py-2 text-muted-foreground font-medium">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="py-3">Interest Savings Over {inputs.yearsBeforeSell} Years</td>
                    <td className="py-3 text-right font-bold">
                      {formatCurrency(calculations.comparison.interestSavings)}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3">Less Tax Deduction Lost</td>
                    <td className="py-3 text-right font-bold">
                      -{formatCurrency(calculations.comparison.taxSavingsLoss)}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3">Less Total Closing Costs</td>
                    <td className="py-3 text-right font-bold">
                      -{formatCurrency(calculations.refinanced.totalClosingCosts)}
                    </td>
                  </tr>
                  <tr className={`${calculations.comparison.shouldRefinance ? 'bg-accent/10' : 'bg-destructive/10'}`}>
                    <td className="py-4 font-semibold">
                      Net Refinancing {calculations.comparison.shouldRefinance ? 'Benefit' : 'Cost'} Over {inputs.yearsBeforeSell} Years
                    </td>
                    <td className={`py-4 text-right text-xl font-bold ${calculations.comparison.shouldRefinance ? 'text-accent-strong' : 'text-destructive'}`}>
                      {calculations.comparison.totalBenefit >= 0 ? '' : '-'}{formatCurrency(Math.abs(calculations.comparison.totalBenefit))}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 text-muted-foreground">Monthly Payment Change</td>
                    <td className={`py-3 text-right font-medium ${calculations.comparison.monthlySavings > 0 ? 'text-accent-strong' : 'text-destructive'}`}>
                      {calculations.comparison.monthlySavings >= 0 ? 
                        `Save ${formatCurrency(calculations.comparison.monthlySavings)}/mo` : 
                        `Pay ${formatCurrency(Math.abs(calculations.comparison.monthlySavings))}/mo more`}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 text-muted-foreground">Break-Even Point</td>
                    <td className="py-3 text-right font-medium">
                      {calculations.comparison.breakEvenMonths === Infinity 
                        ? 'N/A' 
                        : `${Math.floor(calculations.comparison.breakEvenMonths / 12)} years ${calculations.comparison.breakEvenMonths % 12} months`}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {(() => {
              const be = Number.isFinite(calculations.comparison.breakEvenMonths) ? calculations.comparison.breakEvenMonths : null;
              const horizon = Math.min(30, Math.max(10, inputs.yearsBeforeSell + 3, be ? Math.ceil(be / 12) + 3 : 0));
              const points = calculations.comparison.netByYear.slice(0, horizon + 1);
              return (
                <div className="mt-8">
                  <h3 className="font-display text-base font-semibold">When refinancing pays off</h3>
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
