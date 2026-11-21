import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle, Home, TrendingDown, PiggyBank } from "lucide-react";
import VizCard from "./viz/VizCard";
import CompareTable from "./viz/CompareTable";
import PayoffComparison from "./viz/PayoffComparison";
import { yearsMonths } from "@/lib/amortization";
import CurrencyInput from "./CurrencyInput";
import PercentInput from "./PercentInput";
import { formatCurrency } from "@/lib/formatters";
import StickyResult from "./StickyResult";

const ExtraPaymentsCalculator = () => {
  // Loan Information
  const [homePrice, setHomePrice] = useState(400000);
  const [downPayment, setDownPayment] = useState(80000);
  const [interestRate, setInterestRate] = useState(6.5);
  const [loanTerm, setLoanTerm] = useState("30");

  // Extra Payments
  const [initialExtraPayment, setInitialExtraPayment] = useState(0);
  const [monthlyExtraPayment, setMonthlyExtraPayment] = useState(200);

  const loanAmount = Math.max(0, homePrice - downPayment);

  const results = useMemo(() => {
    const monthlyRate = interestRate / 100 / 12;
    const totalPayments = parseInt(loanTerm) * 12;

    // Calculate standard monthly P&I
    let standardMonthlyPI = 0;
    if (monthlyRate > 0 && loanAmount > 0) {
      standardMonthlyPI = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) /
        (Math.pow(1 + monthlyRate, totalPayments) - 1);
    } else if (loanAmount > 0) {
      standardMonthlyPI = loanAmount / totalPayments;
    }

    // ========== ORIGINAL SCHEDULE ==========
    let originalBalance = loanAmount;
    let originalTotalPayments = 0;
    let originalTotalInterest = 0;
    const originalSchedule: Array<{
      year: number;
      principal: number;
      interest: number;
      balance: number;
      totalPaid: number;
    }> = [];

    for (let month = 1; month <= totalPayments && originalBalance > 0; month++) {
      const interestPayment = originalBalance * monthlyRate;
      const principalPayment = Math.min(standardMonthlyPI - interestPayment, originalBalance);
      
      originalBalance -= principalPayment;
      originalTotalPayments += standardMonthlyPI;
      originalTotalInterest += interestPayment;

      // Record yearly data
      if (month % 12 === 0 || originalBalance <= 0) {
        const year = Math.ceil(month / 12);
        originalSchedule.push({
          year,
          principal: loanAmount - originalBalance,
          interest: originalTotalInterest,
          balance: Math.max(0, originalBalance),
          totalPaid: originalTotalPayments,
        });
      }
    }

    const originalMonths = totalPayments;
    const originalYears = Math.floor(originalMonths / 12);
    const originalRemainingMonths = originalMonths % 12;

    // ========== EXTRA PAYMENT SCHEDULE ==========
    let extraBalance = loanAmount - initialExtraPayment;
    let extraTotalPayments = initialExtraPayment;
    let extraTotalInterest = 0;
    let extraMonths = 0;
    const extraSchedule: Array<{
      year: number;
      principal: number;
      interest: number;
      balance: number;
      totalPaid: number;
    }> = [];

    let extraPrincipal = initialExtraPayment;
    let yearlyPrincipal = initialExtraPayment;
    let yearlyInterest = 0;

    for (let month = 1; month <= totalPayments && extraBalance > 0.01; month++) {
      const interestPayment = extraBalance * monthlyRate;
      const standardPrincipal = standardMonthlyPI - interestPayment;
      const totalPrincipalPayment = Math.min(standardPrincipal + monthlyExtraPayment, extraBalance);
      extraPrincipal += Math.max(0, totalPrincipalPayment - standardPrincipal);
      const actualPayment = interestPayment + totalPrincipalPayment;

      extraBalance -= totalPrincipalPayment;
      extraTotalPayments += actualPayment;
      extraTotalInterest += interestPayment;
      yearlyPrincipal += totalPrincipalPayment;
      yearlyInterest += interestPayment;
      extraMonths = month;

      // Record yearly data
      if (month % 12 === 0 || extraBalance <= 0.01) {
        const year = Math.ceil(month / 12);
        extraSchedule.push({
          year,
          principal: loanAmount - extraBalance,
          interest: extraTotalInterest,
          balance: Math.max(0, extraBalance),
          totalPaid: extraTotalPayments,
        });
        yearlyPrincipal = 0;
        yearlyInterest = 0;
      }
    }

    const extraYears = Math.floor(extraMonths / 12);
    const extraRemainingMonths = extraMonths % 12;

    // Calculate savings
    const interestSavings = originalTotalInterest - extraTotalInterest;
    const monthsSaved = originalMonths - extraMonths;
    const yearsSaved = Math.floor(monthsSaved / 12);
    const remainingMonthsSaved = monthsSaved % 12;

    // Create comparison chart data
    const chartData = [];
    const maxYears = Math.max(originalSchedule.length, extraSchedule.length);
    
    for (let i = 0; i < maxYears; i++) {
      const year = i + 1;
      chartData.push({
        year: `Year ${year}`,
        originalBalance: originalSchedule[i]?.balance ?? 0,
        extraBalance: extraSchedule[i]?.balance ?? 0,
      });
    }

    return {
      // Original schedule
      originalMonthlyPayment: standardMonthlyPI,
      originalTotalPayments,
      originalTotalInterest,
      originalYears,
      originalRemainingMonths,
      originalSchedule,

      // Extra payment schedule
      extraMonthlyPayment: standardMonthlyPI + monthlyExtraPayment,
      extraTotalPayments,
      extraTotalInterest,
      extraYears,
      extraRemainingMonths,
      extraSchedule,

      // Savings
      interestSavings,
      yearsSaved,
      remainingMonthsSaved,
      
      // Chart
      chartData,
      originalMonths,
      extraMonths,
      extraPrincipal,
    };
  }, [loanAmount, interestRate, loanTerm, initialExtraPayment, monthlyExtraPayment]);

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-5 gap-6">
        {/* Left Column - Inputs */}
        <div className="space-y-6 lg:col-span-3">
          {/* Loan Information */}
          <Card className="calculator-card">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Home className="h-5 w-5 text-accent" />
                Loan Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="extra-payments-home-price" className="text-sm font-medium text-foreground">
                    Home Price
                  </Label>
                  <CurrencyInput id="extra-payments-home-price" value={homePrice} onChange={setHomePrice} />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="extra-payments-down-payment" className="text-sm font-medium text-foreground">
                    Down Payment
                  </Label>
                  <CurrencyInput id="extra-payments-down-payment" value={downPayment} onChange={setDownPayment} />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="extra-payments-interest-rate" className="text-sm font-medium text-foreground">
                    Interest Rate
                  </Label>
                  <div className="flex gap-1 sm:gap-2 flex-1">
                    <PercentInput id="extra-payments-interest-rate"
                      value={interestRate}
                      onChange={setInterestRate}
                      min={0}
                      max={20}
                      decimalPlaces={3}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="extra-payments-loan-term" className="text-sm font-medium text-foreground">
                    Loan Term
                  </Label>
                  <Select value={loanTerm} onValueChange={setLoanTerm}>
                    <SelectTrigger id="extra-payments-loan-term" className="h-8 sm:h-10 text-sm flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 years</SelectItem>
                      <SelectItem value="25">25 years</SelectItem>
                      <SelectItem value="20">20 years</SelectItem>
                      <SelectItem value="15">15 years</SelectItem>
                      <SelectItem value="10">10 years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Loan Amount</span>
                  <span className="font-semibold">{formatCurrency(loanAmount)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Extra Payments */}
          <Card className="calculator-card">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <PiggyBank className="h-5 w-5 text-accent" />
                Extra Payments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="extra-payments-lump-sum" className="text-sm font-medium text-foreground flex items-center gap-1">
                    Lump Sum
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-3 w-3 sm:h-4 sm:w-4 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>A one-time lump sum payment made at the start of the loan.</p>
                      </TooltipContent>
                    </Tooltip>
                  </Label>
                  <CurrencyInput id="extra-payments-lump-sum" value={initialExtraPayment} onChange={setInitialExtraPayment} />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="extra-payments-extra-month" className="text-sm font-medium text-foreground flex items-center gap-1">
                    Extra/Month
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-3 w-3 sm:h-4 sm:w-4 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>Extra amount added to your regular monthly payment, applied directly to principal.</p>
                      </TooltipContent>
                    </Tooltip>
                  </Label>
                  <CurrencyInput id="extra-payments-extra-month" value={monthlyExtraPayment} onChange={setMonthlyExtraPayment} />
                </div>
              </div>
            </CardContent>
          </Card>

          <PayoffComparison
            loanAmount={loanAmount}
            standard={results.originalSchedule}
            plan={results.extraSchedule}
            standardLabel="Regular payments"
            planLabel="With extra payments"
            standardMonths={results.originalMonths}
            planMonths={results.extraMonths}
            extraPaid={results.extraPrincipal}
          />
        </div>

        {/* Right Column - Results */}
        <div className="space-y-6 lg:col-span-2">
          {/* Interest Savings Highlight */}
          <Card className="result-highlight border-0">
            <CardContent className="p-0">
              <StickyResult targetId="calc-result" label={"Interest saved"} value={formatCurrency(results.interestSavings)} />
              <div id="calc-result" className="text-center space-y-2">
                <TrendingDown className="h-8 w-8 mx-auto text-white/80" />
                <p className="text-white/80 text-sm font-medium">
                  Total Interest Savings
                </p>
                <p className="text-4xl md:text-5xl font-bold text-white number-pop">
                  {formatCurrency(results.interestSavings)}
                </p>
                <p className="text-white/80 text-sm">
                  Pay off {results.yearsSaved} years {results.remainingMonthsSaved > 0 ? `${results.remainingMonthsSaved} months` : ''} early
                </p>
              </div>
            </CardContent>
          </Card>

          <VizCard title="Regular vs. extra payments" description="Lower is better in every row; the check marks the winner.">
            <CompareTable
              columns={[{ label: "Regular" }, { label: "With extra" }]}
              recommended={results.interestSavings > 0 ? 1 : null}
              recommendedLabel="Saves more"
              groups={[
                {
                  rows: [
                    { label: "Monthly payment", values: [results.originalMonthlyPayment, results.extraMonthlyPayment], note: "Principal and interest" },
                    { label: "Paid off in", values: [results.originalMonths, results.extraMonths], format: yearsMonths, better: "lower" },
                    { label: "Total interest", values: [results.originalTotalInterest, results.extraTotalInterest], better: "lower" },
                    { label: "Total paid", values: [results.originalTotalPayments, results.extraTotalPayments], better: "lower", emphasis: true },
                  ],
                },
              ]}
            />
          </VizCard>
        </div>
      </div>
    </div>
  );
};

export default ExtraPaymentsCalculator;
