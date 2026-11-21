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
import { HelpCircle, Home, TrendingDown, DollarSign } from "lucide-react";
import VizCard from "./viz/VizCard";
import CompareTable from "./viz/CompareTable";
import PayoffComparison from "./viz/PayoffComparison";
import { yearsMonths } from "@/lib/amortization";
import CurrencyInput from "./CurrencyInput";
import PercentInput from "./PercentInput";
import { formatCurrency } from "@/lib/formatters";
import StickyResult from "./StickyResult";

const BiWeeklyCalculator = () => {
  // Loan Information
  const [homePrice, setHomePrice] = useState(400000);
  const [downPayment, setDownPayment] = useState(80000);
  const [interestRate, setInterestRate] = useState(6.5);
  const [loanTerm, setLoanTerm] = useState("30");

  // Tax Info
  const [taxRate, setTaxRate] = useState(0);

  const loanAmount = Math.max(0, homePrice - downPayment);

  const results = useMemo(() => {
    const monthlyRate = interestRate / 100 / 12;
    const biWeeklyRate = interestRate / 100 / 26;
    const totalMonthlyPayments = parseInt(loanTerm) * 12;

    // ========== STANDARD MONTHLY SCHEDULE ==========
    let standardMonthlyPI = 0;
    if (monthlyRate > 0 && loanAmount > 0) {
      standardMonthlyPI = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonthlyPayments)) /
        (Math.pow(1 + monthlyRate, totalMonthlyPayments) - 1);
    } else if (loanAmount > 0) {
      standardMonthlyPI = loanAmount / totalMonthlyPayments;
    }

    let standardBalance = loanAmount;
    let standardTotalInterest = 0;
    let standardTotalPayments = 0;
    const standardSchedule: Array<{
      year: number;
      balance: number;
      interest: number;
      principal: number;
    }> = [];

    for (let month = 1; month <= totalMonthlyPayments && standardBalance > 0.01; month++) {
      const interestPayment = standardBalance * monthlyRate;
      const principalPayment = Math.min(standardMonthlyPI - interestPayment, standardBalance);

      standardBalance -= principalPayment;
      standardTotalInterest += interestPayment;
      standardTotalPayments += standardMonthlyPI;

      if (month % 12 === 0 || standardBalance <= 0.01) {
        const year = Math.ceil(month / 12);
        standardSchedule.push({
          year,
          balance: Math.max(0, standardBalance),
          interest: standardTotalInterest,
          principal: loanAmount - standardBalance,
        });
      }
    }

    const standardMonths = totalMonthlyPayments;
    const standardYears = Math.floor(standardMonths / 12);
    const standardRemainingMonths = standardMonths % 12;

    // ========== BI-WEEKLY SCHEDULE ==========
    // Bi-weekly payment is half of the monthly payment
    const biWeeklyPayment = standardMonthlyPI / 2;
    
    let biWeeklyBalance = loanAmount;
    let biWeeklyTotalInterest = 0;
    let biWeeklyTotalPayments = 0;
    let biWeeklyPaymentCount = 0;
    const biWeeklySchedule: Array<{
      year: number;
      balance: number;
      interest: number;
      principal: number;
    }> = [];

    // 26 bi-weekly payments per year
    const maxBiWeeklyPayments = parseInt(loanTerm) * 26 * 2; // Extra buffer

    for (let payment = 1; payment <= maxBiWeeklyPayments && biWeeklyBalance > 0.01; payment++) {
      const interestPayment = biWeeklyBalance * biWeeklyRate;
      const principalPayment = Math.min(biWeeklyPayment - interestPayment, biWeeklyBalance);

      biWeeklyBalance -= principalPayment;
      biWeeklyTotalInterest += interestPayment;
      biWeeklyTotalPayments += biWeeklyPayment;
      biWeeklyPaymentCount = payment;

      // Record yearly data (every 26 payments = 1 year)
      if (payment % 26 === 0 || biWeeklyBalance <= 0.01) {
        const year = Math.ceil(payment / 26);
        biWeeklySchedule.push({
          year,
          balance: Math.max(0, biWeeklyBalance),
          interest: biWeeklyTotalInterest,
          principal: loanAmount - biWeeklyBalance,
        });
      }
    }

    // Calculate bi-weekly term in months
    const biWeeklyTotalMonths = Math.round((biWeeklyPaymentCount / 26) * 12);
    const biWeeklyYears = Math.floor(biWeeklyTotalMonths / 12);
    const biWeeklyRemainingMonths = biWeeklyTotalMonths % 12;

    // Effective monthly payment for bi-weekly (26 payments / 12 months * payment)
    const effectiveMonthlyBiWeekly = (biWeeklyPayment * 26) / 12;

    // Interest savings
    const interestSavings = standardTotalInterest - biWeeklyTotalInterest;

    // Time saved
    const monthsSaved = standardMonths - biWeeklyTotalMonths;
    const yearsSaved = Math.floor(monthsSaved / 12);
    const remainingMonthsSaved = monthsSaved % 12;

    // Tax considerations
    const standardTaxSavings = standardTotalInterest * (taxRate / 100);
    const biWeeklyTaxSavings = biWeeklyTotalInterest * (taxRate / 100);
    const taxSavingsLoss = standardTaxSavings - biWeeklyTaxSavings;
    const netBenefit = interestSavings - taxSavingsLoss;

    // Chart data
    const chartData = [];
    const maxYears = Math.max(standardSchedule.length, biWeeklySchedule.length);

    for (let i = 0; i < maxYears; i++) {
      const year = i + 1;
      chartData.push({
        year: `Year ${year}`,
        standardBalance: standardSchedule[i]?.balance ?? 0,
        biWeeklyBalance: biWeeklySchedule[i]?.balance ?? 0,
      });
    }

    return {
      // Standard schedule
      standardMonthlyPayment: standardMonthlyPI,
      standardTotalPayments,
      standardTotalInterest,
      standardYears,
      standardRemainingMonths,
      standardSchedule,
      standardTaxSavings,

      // Bi-weekly schedule
      biWeeklyPayment,
      effectiveMonthlyBiWeekly,
      biWeeklyTotalPayments,
      biWeeklyTotalInterest,
      biWeeklyYears,
      biWeeklyRemainingMonths,
      biWeeklySchedule,
      biWeeklyTaxSavings,

      // Savings
      interestSavings,
      yearsSaved,
      remainingMonthsSaved,
      taxSavingsLoss,
      netBenefit,

      // Chart
      chartData,
      standardMonths,
      biWeeklyTotalMonths,
    };
  }, [loanAmount, interestRate, loanTerm, taxRate]);

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
                  <Label htmlFor="bi-weekly-home-price" className="text-sm font-medium text-foreground">
                    Home Price
                  </Label>
                  <CurrencyInput id="bi-weekly-home-price" value={homePrice} onChange={setHomePrice} />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="bi-weekly-down-payment" className="text-sm font-medium text-foreground">
                    Down Payment
                  </Label>
                  <CurrencyInput id="bi-weekly-down-payment" value={downPayment} onChange={setDownPayment} />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="bi-weekly-interest-rate" className="text-sm font-medium text-foreground">
                    Interest Rate
                  </Label>
                  <div className="flex gap-1 sm:gap-2 flex-1">
                    <PercentInput id="bi-weekly-interest-rate"
                      value={interestRate}
                      onChange={setInterestRate}
                      min={0}
                      max={20}
                      decimalPlaces={3}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="bi-weekly-loan-term" className="text-sm font-medium text-foreground">
                    Loan Term
                  </Label>
                  <Select value={loanTerm} onValueChange={setLoanTerm}>
                    <SelectTrigger id="bi-weekly-loan-term" className="h-8 sm:h-10 text-sm flex-1">
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

          {/* Tax Information */}
          <Card className="calculator-card">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-accent" />
                Tax Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="bi-weekly-tax-rate" className="text-sm font-medium text-foreground flex items-center gap-1">
                  Tax rate (if itemizing)
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-3 w-3 sm:h-4 sm:w-4 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>Enter your combined state & federal marginal tax rate if you itemize deductions. Enter 0 if you take the standard deduction.</p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <div className="flex gap-1 sm:gap-2 flex-1">
                  <PercentInput id="bi-weekly-tax-rate"
                    value={taxRate}
                    onChange={setTaxRate}
                    min={0}
                    max={50}
                    decimalPlaces={0}
                  />
                </div>
              </div>

              <div className="p-3 bg-secondary/50 rounded-lg mt-4">
                <p className="text-xs text-muted-foreground">
                  <strong>Note:</strong> Most taxpayers use standard deductions. If you're not itemizing, enter 0% for an accurate comparison.
                </p>
              </div>
            </CardContent>
        </Card>

          <PayoffComparison
            loanAmount={loanAmount}
            standard={results.standardSchedule}
            plan={results.biWeeklySchedule}
            standardLabel="Monthly payments"
            planLabel="Bi-weekly payments"
            standardMonths={results.standardMonths}
            planMonths={results.biWeeklyTotalMonths}
            extraPaid={results.standardMonthlyPayment}
            extraPaidLabel="Extra you pay a year"
          />
        </div>

        {/* Right Column - Results */}
        <div className="space-y-6 lg:col-span-2">
          {/* Net Benefit Highlight */}
          <Card className="result-highlight border-0">
            <CardContent className="p-0">
              <StickyResult targetId="calc-result" label={taxRate > 0 ? "Net benefit" : "Interest saved"} value={formatCurrency(taxRate > 0 ? results.netBenefit : results.interestSavings)} />
              <div id="calc-result" className="text-center space-y-2">
                <TrendingDown className="h-8 w-8 mx-auto text-white/80" />
                <p className="text-white/80 text-sm font-medium">
                  {taxRate > 0 ? "Net Benefit (After Tax Consideration)" : "Total Interest Savings"}
                </p>
                <p className="text-4xl md:text-5xl font-bold text-white number-pop">
                  {formatCurrency(taxRate > 0 ? results.netBenefit : results.interestSavings)}
                </p>
                <p className="text-white/80 text-sm">
                  Pay off {results.yearsSaved} years {results.remainingMonthsSaved > 0 ? `${results.remainingMonthsSaved} months` : ''} early
                </p>
              </div>
            </CardContent>
          </Card>

          <VizCard
            title="Monthly vs. bi-weekly"
            description="Bi-weekly means 26 half-payments a year: the same as 13 monthly payments instead of 12."
          >
            <CompareTable
              columns={[{ label: "Monthly" }, { label: "Bi-weekly" }]}
              recommended={(taxRate > 0 ? results.netBenefit : results.interestSavings) > 0 ? 1 : null}
              recommendedLabel="Saves more"
              groups={[
                {
                  rows: [
                    {
                      label: "Each payment",
                      values: [results.standardMonthlyPayment, results.biWeeklyPayment],
                      note: "Principal and interest",
                      display: [`${formatCurrency(results.standardMonthlyPayment)} / mo`, `${formatCurrency(results.biWeeklyPayment)} / 2 wks`],
                    },
                    { label: "Paid per year", values: [results.standardMonthlyPayment * 12, results.biWeeklyPayment * 26] },
                    { label: "Paid off in", values: [results.standardMonths, results.biWeeklyTotalMonths], format: yearsMonths, better: "lower" },
                    { label: "Total interest", values: [results.standardTotalInterest, results.biWeeklyTotalInterest], better: "lower", emphasis: true },
                  ],
                },
                ...(taxRate > 0
                  ? [
                      {
                        title: "If you itemize",
                        rows: [
                          { label: "Tax saved on interest", values: [results.standardTaxSavings, results.biWeeklyTaxSavings], note: `At your ${taxRate}% tax rate` },
                          { label: "Interest saved after tax", values: [null, results.netBenefit], emphasis: true },
                        ],
                      },
                    ]
                  : []),
              ]}
            />
          </VizCard>
        </div>
      </div>
    </div>
  );
};

export default BiWeeklyCalculator;
