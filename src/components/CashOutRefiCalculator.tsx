import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle, TrendingUp, DollarSign, Percent } from "lucide-react";
import VizCard, { StatRow } from "./viz/VizCard";
import StackedBar from "./viz/StackedBar";
import { SERIES } from "./viz/theme";
import CurrencyInput from "./CurrencyInput";
import PercentInput from "./PercentInput";
import { formatCurrency, formatPercent } from "@/lib/formatters";
import StickyResult from "./StickyResult";
import { InputCard, FieldGrid, Field, TermChoice, MoreOptions, Choice, summarize } from "./calc/Form";

const CashOutRefiCalculator = () => {
  const [homeValue, setHomeValue] = useState(400000);
  const [currentMortgageBalance, setCurrentMortgageBalance] = useState(200000);
  const [loanTerm, setLoanTerm] = useState("30");
  const [interestRate, setInterestRate] = useState(6.5);
  const [desiredCashOut, setDesiredCashOut] = useState(50000);
  const [refinanceFees, setRefinanceFees] = useState(5000);
  const [rollFeesIntoLoan, setRollFeesIntoLoan] = useState(false);

  const results = useMemo(() => {
    // Maximum LTV is typically 80% for cash-out refi
    const maxLTV = 0.80;
    const maxLoanAmount = homeValue * maxLTV;
    // Fees rolled into the loan count toward the 80% limit too.
    const maxCashOut = maxLoanAmount - currentMortgageBalance - (rollFeesIntoLoan ? refinanceFees : 0);
    
    // Adjusted cash out (capped at max)
    const actualCashOut = Math.min(Math.max(0, desiredCashOut), maxCashOut);
    
    // New loan balance
    let newLoanBalance = currentMortgageBalance + actualCashOut;
    if (rollFeesIntoLoan) {
      newLoanBalance += refinanceFees;
    }
    
    // Combined LTV
    const combinedLTV = (newLoanBalance / homeValue) * 100;
    
    // Monthly payment calculation
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = parseInt(loanTerm) * 12;
    
    let monthlyPayment = 0;
    if (monthlyRate > 0) {
      monthlyPayment =
        (newLoanBalance * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
        (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    } else {
      monthlyPayment = newLoanBalance / numberOfPayments;
    }
    
    // Total interest over life of loan
    const totalPayments = monthlyPayment * numberOfPayments;
    const totalInterest = totalPayments - newLoanBalance;
    
    // Adjusted estimate (cash out minus fees if not rolled in)
    const adjustedCashOut = rollFeesIntoLoan ? actualCashOut : actualCashOut - refinanceFees;

    return {
      maxCashOut: Math.max(0, maxCashOut),
      actualCashOut,
      adjustedCashOut: Math.max(0, adjustedCashOut),
      newLoanBalance,
      combinedLTV: Math.min(combinedLTV, 100),
      monthlyPayment,
      totalInterest,
      equity: homeValue - currentMortgageBalance,
    };
  }, [homeValue, currentMortgageBalance, loanTerm, interestRate, desiredCashOut, refinanceFees, rollFeesIntoLoan]);

  return (
    <div className="space-y-6">
      {/* Introduction */}
      <div className="prose prose-sm max-w-none">
        <p className="text-muted-foreground leading-relaxed">
          A cash-out refinance allows you to leverage the equity in your home to pull out cash for other expenses, 
          like a home remodel or to pay off high-interest credit cards. Use this calculator to estimate your 
          maximum cash-out amount and new loan balance with or without refinance fees.
        </p>
      </div>

      <div className="calc-layout">
        {/* Input Section */}
        <InputCard id="cash-out-inputs" title="Your home and new loan">
          <FieldGrid>
            <Field id="cash-out-refi-home-value" label="Home value">
              <CurrencyInput id="cash-out-refi-home-value" value={homeValue} onChange={setHomeValue} />
            </Field>
            <Field id="cash-out-refi-current-balance" label="Mortgage balance" info="What you still owe on your current mortgage.">
              <CurrencyInput id="cash-out-refi-current-balance" value={currentMortgageBalance} onChange={setCurrentMortgageBalance} />
            </Field>
            <Field id="cash-out-refi-cash-out" label="Cash you want" info="Capped so the new loan stays within 80% of the home's value.">
              <CurrencyInput id="cash-out-refi-cash-out" value={desiredCashOut} onChange={setDesiredCashOut} />
            </Field>
            <Field id="cash-out-refi-interest-rate" label="New interest rate">
              <PercentInput id="cash-out-refi-interest-rate" value={interestRate} onChange={setInterestRate} min={0} max={20} decimalPlaces={3} />
            </Field>
          </FieldGrid>
          <MoreOptions
            title="Loan term & fees"
            summary={summarize(`${loanTerm}-year fixed`, `${formatCurrency(refinanceFees)} in fees`, rollFeesIntoLoan ? "added to the loan" : "paid at closing")}
          >
            <FieldGrid>
              <Field id="cash-out-refi-loan-term" label="New loan term" className="sm:col-span-2">
                <TermChoice id="cash-out-refi-loan-term" value={Number(loanTerm)} onChange={(y) => setLoanTerm(String(y))} />
              </Field>
              <Field id="cash-out-refi-refi-fees" label="Closing costs" info="Usually 2% to 5% of the new loan.">
                <CurrencyInput id="cash-out-refi-refi-fees" value={refinanceFees} onChange={setRefinanceFees} />
              </Field>
              <Field id="rollFees" label="Pay closing costs">
                <Choice
                  id="rollFees"
                  label="Pay closing costs"
                  value={rollFeesIntoLoan ? "loan" : "cash"}
                  onChange={(v) => setRollFeesIntoLoan(v === "loan")}
                  options={[{ value: "cash", label: "At closing" }, { value: "loan", label: "In the loan" }]}
                />
              </Field>
            </FieldGrid>
          </MoreOptions>
        </InputCard>

        {/* Home value split: what you owe, what you take out, what you keep */}
        <VizCard
          className="order-2"
          title="Your home's value, split up"
          description="Lenders usually cap a cash-out refinance at 80% of the home's value. Everything past the line stays as equity."
        >
          <StackedBar
            size="lg"
            legend
            max={homeValue}
            markers={[{ value: homeValue * 0.8, label: "80% limit" }]}
            segments={[
              { label: "Current mortgage", value: currentMortgageBalance, color: SERIES.principal, note: "Paid off by the new loan" },
              ...(rollFeesIntoLoan ? [{ label: "Fees added to the loan", value: refinanceFees, color: SERIES.fees }] : []),
              {
                label: "Cash out",
                value: results.actualCashOut,
                color: SERIES.interest,
                note: rollFeesIntoLoan ? undefined : `About ${formatCurrency(results.adjustedCashOut)} after ${formatCurrency(refinanceFees)} in fees`,
              },
              { label: "Equity you keep", value: Math.max(0, homeValue - results.newLoanBalance), color: SERIES.equity, muted: true },
            ]}
          />
          <StatRow
            className="mt-5"
            stats={[
              { label: "Equity today", value: formatCurrency(results.equity) },
              { label: "New loan", value: formatCurrency(results.newLoanBalance), hint: `${results.combinedLTV.toFixed(0)}% of the home's value` },
              { label: "Interest over the loan", value: formatCurrency(results.totalInterest) },
            ]}
          />
        </VizCard>

        {/* Results Section */}
        <div className="calc-results order-1">
          {/* Main Result */}
          <Card className="result-highlight border-0">
            <CardContent className="p-0">
              <StickyResult targetId="calc-result" label={"Max cash-out"} value={formatCurrency(results.maxCashOut)} />
              <div id="calc-result" className="text-center space-y-2">
                <p className="text-white/80 text-sm font-medium">
                  Estimated Max Cash-Out Amount
                </p>
                <p className="text-4xl md:text-5xl font-bold text-white number-pop">
                  {formatCurrency(results.maxCashOut)}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Results */}
          <Card className="calculator-card">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-accent" />
                Cash-Out Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-border">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Adjusted Estimate
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-4 w-4 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>Your cash-out amount after accounting for refinance fees (if not rolled into loan).</p>
                      </TooltipContent>
                    </Tooltip>
                  </span>
                  <span className="font-semibold text-lg">{formatCurrency(results.adjustedCashOut)}</span>
                </div>

                <div className="flex justify-between items-center py-3 border-b border-border">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Percent className="h-4 w-4" />
                    Combined Loan-to-Value
                  </span>
                  <span className="font-semibold text-lg">{formatPercent(results.combinedLTV)}</span>
                </div>

                <div className="flex justify-between items-center py-3 border-b border-border">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    New Loan Balance
                  </span>
                  <span className="font-semibold text-lg">{formatCurrency(results.newLoanBalance)}</span>
                </div>

                <div className="flex justify-between items-center py-3">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    New Monthly Payment
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-4 w-4 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>Principal and interest only. Does not include taxes, insurance, or other fees.</p>
                      </TooltipContent>
                    </Tooltip>
                  </span>
                  <span className="font-semibold text-lg text-accent-strong">{formatCurrency(results.monthlyPayment)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-muted-foreground text-center mt-6">
        This calculator is for educational purposes only. Actual cash-out amounts, rates, and terms may vary. 
        Consult with a mortgage professional for accurate quotes.
      </p>
    </div>
  );
};

export default CashOutRefiCalculator;
