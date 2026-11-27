import { useMemo } from "react";
import VizCard from "./viz/VizCard";
import CompareTable from "./viz/CompareTable";
import PayoffComparison from "./viz/PayoffComparison";
import { yearsMonths } from "@/lib/amortization";
import CurrencyInput from "./CurrencyInput";
import PercentInput from "./PercentInput";
import { formatCurrency } from "@/lib/formatters";
import StickyResult from "./StickyResult";
import { AnswerCard } from "./PaymentAnswer";
import { InputCard, FieldGrid, Field, TermChoice } from "./calc/Form";
import { useUrlParam } from "@/lib/urlState";
import { useLocalCosts } from "@/lib/useLocalCosts";
import { averageRate } from "@/lib/marketRates";
import { localPrice } from "@/lib/localCosts";
import { LocalPrice } from "@/components/calc/LocalValue";

const ExtraPaymentsCalculator = () => {
  // Loan Information
  const [homePrice, setHomePrice] = useUrlParam("homePrice", 400000);
  const [downPayment, setDownPayment] = useUrlParam("downPayment", 80000);
  const [interestRate, setInterestRate] = useUrlParam("interestRate", averageRate(30));
  const [loanTerm, setLoanTerm] = useUrlParam("loanTerm", "30");

  // Extra Payments
  const [initialExtraPayment, setInitialExtraPayment] = useUrlParam("initialExtraPayment", 0);
  const [monthlyExtraPayment, setMonthlyExtraPayment] = useUrlParam("monthlyExtraPayment", 200);
  const { costs: local } = useLocalCosts(
    (c) => {
      const p = localPrice(c, "typical");
      setDownPayment(Math.round((downPayment / homePrice) * p));
      setHomePrice(p);
    },
    { keys: ["homePrice", "downPayment"] },
  );

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
      <div className="calc-layout">
        {/* Left Column - Inputs */}
        <div className="contents">
          <InputCard id="loan-details" title="Your loan and extra payments" description="Enter your loan, then how much extra you'd pay.">
            <FieldGrid>
              <Field id="extra-payments-home-price" label="Home price" hint={<LocalPrice costs={local} kind="typical" value={homePrice} onUse={setHomePrice} />}>
                <CurrencyInput id="extra-payments-home-price" value={homePrice} onChange={setHomePrice} />
              </Field>
              <Field id="extra-payments-down-payment" label="Down payment" hint={`Loan amount: ${formatCurrency(loanAmount)}`}>
                <CurrencyInput id="extra-payments-down-payment" value={downPayment} onChange={setDownPayment} aria-describedby="extra-payments-down-payment-hint" />
              </Field>
              <Field id="extra-payments-interest-rate" label="Interest rate">
                <PercentInput id="extra-payments-interest-rate" value={interestRate} onChange={setInterestRate} min={0} max={20} decimalPlaces={3} />
              </Field>
              <Field id="extra-payments-loan-term" label="Loan term">
                <TermChoice id="extra-payments-loan-term" value={Number(loanTerm)} onChange={(y) => setLoanTerm(String(y))} terms={[30, 20, 15, 10]} />
              </Field>
            </FieldGrid>
            <div className="mt-5 rounded-xl border border-primary/15 bg-primary/[0.03] p-4">
              <p className="mb-3 text-sm font-semibold text-foreground">Extra payments</p>
              <FieldGrid>
                <Field id="extra-payments-extra-month" label="Extra each month" info="Added to your regular payment and applied straight to principal.">
                  <CurrencyInput id="extra-payments-extra-month" value={monthlyExtraPayment} onChange={setMonthlyExtraPayment} />
                </Field>
                <Field id="extra-payments-lump-sum" label="One-time lump sum" info="A single extra payment made at the start of the loan.">
                  <CurrencyInput id="extra-payments-lump-sum" value={initialExtraPayment} onChange={setInitialExtraPayment} />
                </Field>
              </FieldGrid>
            </div>
          </InputCard>
          <div className="order-2 space-y-6">

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
        </div>

        {/* Right Column - Results */}
        <div className="calc-results order-1">
          <StickyResult targetId="calc-result" label={"Interest saved"} value={formatCurrency(results.interestSavings)} />
          <AnswerCard
            label="Interest you'd save"
            total={results.interestSavings}
            context={`by paying ${formatCurrency(monthlyExtraPayment)} extra a month${initialExtraPayment > 0 ? ` plus ${formatCurrency(initialExtraPayment)} up front` : ""}`}
            stats={[
              { label: "Paid off sooner by", value: yearsMonths(results.originalMonths - results.extraMonths) },
              { label: "Paid off in", value: yearsMonths(results.extraMonths), hint: `instead of ${yearsMonths(results.originalMonths)}` },
              { label: "New monthly payment", value: formatCurrency(results.extraMonthlyPayment), hint: `was ${formatCurrency(results.originalMonthlyPayment)}` },
              {
                label: "Extra you pay in",
                value: formatCurrency(results.extraPrincipal),
                hint: results.extraPrincipal > 0 ? `$${(results.interestSavings / results.extraPrincipal).toFixed(2)} saved per $1` : undefined,
              },
            ]}
          />

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
