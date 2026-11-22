import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingDown } from "lucide-react";
import VizCard from "./viz/VizCard";
import CompareTable from "./viz/CompareTable";
import PayoffComparison from "./viz/PayoffComparison";
import { yearsMonths } from "@/lib/amortization";
import CurrencyInput from "./CurrencyInput";
import PercentInput from "./PercentInput";
import { formatCurrency } from "@/lib/formatters";
import StickyResult from "./StickyResult";
import { AnimatedCurrency } from "@/components/AnimatedNumber";
import { InputCard, FieldGrid, Field, TermChoice, MoreOptions } from "./calc/Form";

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
      <div className="calc-layout">
        {/* Left Column - Inputs */}
        <div className="contents">
          <InputCard id="loan-details" title="Your loan" description="Bi-weekly payments are half your monthly payment every two weeks.">
            <FieldGrid>
              <Field id="bi-weekly-home-price" label="Home price">
                <CurrencyInput id="bi-weekly-home-price" value={homePrice} onChange={setHomePrice} />
              </Field>
              <Field id="bi-weekly-down-payment" label="Down payment" hint={`Loan amount: ${formatCurrency(loanAmount)}`}>
                <CurrencyInput id="bi-weekly-down-payment" value={downPayment} onChange={setDownPayment} aria-describedby="bi-weekly-down-payment-hint" />
              </Field>
              <Field id="bi-weekly-interest-rate" label="Interest rate">
                <PercentInput id="bi-weekly-interest-rate" value={interestRate} onChange={setInterestRate} min={0} max={20} decimalPlaces={3} />
              </Field>
              <Field id="bi-weekly-loan-term" label="Loan term">
                <TermChoice id="bi-weekly-loan-term" value={Number(loanTerm)} onChange={(y) => setLoanTerm(String(y))} terms={[30, 20, 15, 10]} />
              </Field>
            </FieldGrid>
            <MoreOptions title="Taxes (only if you itemize)" summary={taxRate > 0 ? `${taxRate}% tax rate on mortgage interest` : "Not itemizing (most people)"}>
              <FieldGrid>
                <Field
                  id="bi-weekly-tax-rate"
                  label="Tax rate if itemizing"
                  info="Your combined federal and state marginal rate, only if you itemize deductions. Most people take the standard deduction: leave it at 0."
                >
                  <PercentInput id="bi-weekly-tax-rate" value={taxRate} onChange={setTaxRate} min={0} max={50} decimalPlaces={0} />
                </Field>
              </FieldGrid>
            </MoreOptions>
          </InputCard>
          <div className="order-2 space-y-6">

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
        </div>

        {/* Right Column - Results */}
        <div className="calc-results order-1">
          {/* Net Benefit Highlight */}
          <Card className="result-highlight border-0">
            <CardContent className="p-0">
              <StickyResult targetId="calc-result" label={taxRate > 0 ? "Net benefit" : "Interest saved"} value={formatCurrency(taxRate > 0 ? results.netBenefit : results.interestSavings)} />
              <div id="calc-result" className="text-center space-y-2">
                <TrendingDown className="h-8 w-8 mx-auto text-white/80" />
                <p className="text-white/80 text-sm font-medium">
                  {taxRate > 0 ? "Net Benefit (After Tax Consideration)" : "Total Interest Savings"}
                </p>
                <p className="text-4xl md:text-5xl font-bold text-white">
                  <AnimatedCurrency value={taxRate > 0 ? results.netBenefit : results.interestSavings} />
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
