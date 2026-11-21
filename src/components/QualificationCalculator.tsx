import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import VizCard from "./viz/VizCard";
import StackedBar from "./viz/StackedBar";
import { SERIES } from "./viz/theme";
import CurrencyInput from "./CurrencyInput";
import PercentInput from "./PercentInput";
import { formatCurrency, formatPercent } from "@/lib/formatters";
import StickyResult from "./StickyResult";
import { InputCard, FieldGrid, Field, TermChoice, MoreOptions, Choice, summarize } from "./calc/Form";

const QualificationCalculator = () => {
  const [homeValue, setHomeValue] = useState(400000);
  const [downPayment, setDownPayment] = useState(80000);
  const [loanTerm, setLoanTerm] = useState("30");
  const [interestRate, setInterestRate] = useState(6.5);
  const [annualTaxes, setAnnualTaxes] = useState(4800);
  const [annualInsurance, setAnnualInsurance] = useState(2400);
  const [annualPMI, setAnnualPMI] = useState(0);
  const [frontEndRatio, setFrontEndRatio] = useState(28);
  const [backEndRatio, setBackEndRatio] = useState(36);
  const [monthlyDebts, setMonthlyDebts] = useState(500);

  const results = useMemo(() => {
    const loanAmount = homeValue - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = parseInt(loanTerm) * 12;
    
    // Calculate monthly P&I
    let monthlyPI = 0;
    if (monthlyRate > 0 && loanAmount > 0) {
      monthlyPI = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
        (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    } else if (loanAmount > 0) {
      monthlyPI = loanAmount / numberOfPayments;
    }
    
    // Monthly housing expenses
    const monthlyTaxes = annualTaxes / 12;
    const monthlyInsurance = annualInsurance / 12;
    const monthlyPMI = annualPMI / 12;
    
    // Total monthly housing payment (PITI + PMI)
    const totalHousingPayment = monthlyPI + monthlyTaxes + monthlyInsurance + monthlyPMI;
    
    // Calculate required income based on front-end ratio
    // Front-end: housing payment / gross income <= front-end ratio
    const requiredIncomeFromFrontEnd = (totalHousingPayment / (frontEndRatio / 100));
    
    // Calculate required income based on back-end ratio
    // Back-end: (housing payment + other debts) / gross income <= back-end ratio
    const requiredIncomeFromBackEnd = ((totalHousingPayment + monthlyDebts) / (backEndRatio / 100));
    
    // Use the higher of the two (more conservative)
    const requiredMonthlyIncome = Math.max(requiredIncomeFromFrontEnd, requiredIncomeFromBackEnd);
    const requiredAnnualIncome = requiredMonthlyIncome * 12;
    
    // Calculate what the DTI ratios would be at the required income
    const actualFrontEnd = (totalHousingPayment / requiredMonthlyIncome) * 100;
    const actualBackEnd = ((totalHousingPayment + monthlyDebts) / requiredMonthlyIncome) * 100;
    
    // Max allowable debt based on the back-end ratio minus housing
    const maxMonthlyDebtAllowance = (requiredMonthlyIncome * (backEndRatio / 100)) - totalHousingPayment;
    
    // Down payment percentage
    const downPaymentPercent = (downPayment / homeValue) * 100;
    
    // LTV
    const ltv = (loanAmount / homeValue) * 100;

    return {
      loanAmount,
      monthlyPI,
      monthlyTaxes,
      monthlyInsurance,
      monthlyPMI,
      totalHousingPayment,
      requiredMonthlyIncome,
      requiredAnnualIncome,
      actualFrontEnd,
      actualBackEnd,
      maxMonthlyDebtAllowance,
      downPaymentPercent,
      ltv,
    };
  }, [homeValue, downPayment, loanTerm, interestRate, annualTaxes, annualInsurance, annualPMI, frontEndRatio, backEndRatio, monthlyDebts]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Input Section */}
        <div className="lg:col-span-3">
          <InputCard id="qualification-inputs" title="The home and your debts" description="See the income a lender would want for this home.">
            <FieldGrid>
              <Field id="qualification-home-value" label="Home price">
                <CurrencyInput id="qualification-home-value" value={homeValue} onChange={setHomeValue} />
              </Field>
              <Field id="qualification-down-payment" label="Down payment" hint={`${results.downPaymentPercent.toFixed(1)}% of the price`}>
                <CurrencyInput id="qualification-down-payment" value={downPayment} onChange={setDownPayment} aria-describedby="qualification-down-payment-hint" />
              </Field>
              <Field id="qualification-interest-rate" label="Interest rate">
                <PercentInput id="qualification-interest-rate" value={interestRate} onChange={setInterestRate} min={0} max={20} decimalPlaces={3} />
              </Field>
              <Field id="qualification-other-debts" label="Monthly debt payments" info="Car, student loan and credit card minimums, and other recurring debts. Not rent or utilities.">
                <CurrencyInput id="qualification-other-debts" value={monthlyDebts} onChange={setMonthlyDebts} />
              </Field>
              <Field id="qualification-loan-type" label="Loan type" info="Sets the lender's limits: the most of your income for housing (first number) and for all debts (second)." className="sm:col-span-2">
                <Choice
                  id="qualification-loan-type"
                  label="Loan type"
                  value={`${frontEndRatio}/${backEndRatio}`}
                  onChange={(v) => {
                    const [f, b] = v.split("/").map(Number);
                    setFrontEndRatio(f);
                    setBackEndRatio(b);
                  }}
                  options={[
                    { value: "28/36", label: "Conventional" },
                    { value: "31/43", label: "FHA" },
                    { value: "41/41", label: "VA" },
                    { value: "29/41", label: "USDA" },
                  ]}
                />
              </Field>
            </FieldGrid>

            <MoreOptions
              title="Term, taxes, insurance & limits"
              summary={summarize(
                `${loanTerm}-year loan`,
                `${formatCurrency(annualTaxes)}/yr tax`,
                `${formatCurrency(annualInsurance)}/yr insurance`,
                annualPMI > 0 ? `${formatCurrency(annualPMI)}/yr PMI` : "no PMI",
                `${frontEndRatio}/${backEndRatio} limits`,
              )}
            >
              <FieldGrid>
                <Field id="qualification-loan-term" label="Loan term">
                  <TermChoice id="qualification-loan-term" value={Number(loanTerm)} onChange={(y) => setLoanTerm(String(y))} />
                </Field>
                <Field id="qualification-property-tax" label="Property tax" unit="per year">
                  <CurrencyInput id="qualification-property-tax" value={annualTaxes} onChange={setAnnualTaxes} />
                </Field>
                <Field id="qualification-insurance" label="Home insurance" unit="per year">
                  <CurrencyInput id="qualification-insurance" value={annualInsurance} onChange={setAnnualInsurance} />
                </Field>
                <Field id="qualification-annual-pmi" label="PMI" unit="per year" info="Usually required when you put down less than 20%. About 0.5% of the loan a year is typical.">
                  <CurrencyInput id="qualification-annual-pmi" value={annualPMI} onChange={setAnnualPMI} />
                </Field>
                <Field id="qualification-front-end" label="Housing limit" unit="% of income" info="The most of your gross income that can go to the housing payment. Conventional loans usually use 28%.">
                  <PercentInput id="qualification-front-end" value={frontEndRatio} onChange={setFrontEndRatio} min={1} max={60} decimalPlaces={0} />
                </Field>
                <Field id="qualification-back-end" label="Total debt limit" unit="% of income" info="The most of your gross income for housing plus all other debts. Conventional loans usually use 36%.">
                  <PercentInput id="qualification-back-end" value={backEndRatio} onChange={setBackEndRatio} min={1} max={65} decimalPlaces={0} />
                </Field>
              </FieldGrid>
            </MoreOptions>
          </InputCard>
        </div>

        {/* Results Section */}
        <div className="space-y-6 lg:col-span-2">
          {/* Main Result */}
          <Card className="result-highlight border-0">
            <CardContent className="p-0">
              <StickyResult targetId="calc-result" label={"Income needed"} value={formatCurrency(results.requiredAnnualIncome)} />
              <div id="calc-result" className="text-center space-y-4">
                <p className="text-white/80 text-sm font-medium">
                  Minimum Annual Income Required
                </p>
                <p className="text-4xl md:text-5xl font-bold text-white number-pop">
                  {formatCurrency(results.requiredAnnualIncome)}
                </p>
                <p className="text-white/70 text-sm">
                  ({formatCurrency(results.requiredMonthlyIncome)}/month)
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Payment breakdown */}
          <VizCard title="Monthly housing payment" description={`${formatCurrency(results.totalHousingPayment)} a month, the number lenders test against your income.`}>
            <StackedBar
              legend
              segments={[
                { label: "Principal & interest", value: results.monthlyPI, color: SERIES.principal },
                { label: "Property tax", value: results.monthlyTaxes, color: SERIES.tax },
                { label: "Home insurance", value: results.monthlyInsurance, color: SERIES.insurance },
                { label: "PMI", value: results.monthlyPMI, color: SERIES.pmi },
              ]}
            />
          </VizCard>

          {/* Income split at the required income */}
          <VizCard
            title="How the income requirement works"
            description={`At ${formatCurrency(results.requiredMonthlyIncome)} a month, your payments just fit the ${frontEndRatio}/${backEndRatio} limits. The ${
              results.actualFrontEnd >= frontEndRatio - 0.05 ? `${frontEndRatio}% housing` : `${backEndRatio}% total debt`
            } limit is the one that sets it.`}
          >
            <StackedBar
              legend
              max={results.requiredMonthlyIncome}
              markers={
                frontEndRatio === backEndRatio
                  ? [{ value: (results.requiredMonthlyIncome * backEndRatio) / 100, label: `${backEndRatio}% limit` }]
                  : [
                      { value: (results.requiredMonthlyIncome * frontEndRatio) / 100, label: `${frontEndRatio}% housing` },
                      { value: (results.requiredMonthlyIncome * backEndRatio) / 100, label: `${backEndRatio}% all debts` },
                    ]
              }
              segments={[
                { label: "Housing payment", value: results.totalHousingPayment, color: SERIES.principal, note: `${formatPercent(results.actualFrontEnd)} of income (front-end ratio)` },
                { label: "Other debt payments", value: monthlyDebts, color: SERIES.interest, note: `Housing + debts: ${formatPercent(results.actualBackEnd)} (back-end ratio)` },
                {
                  label: "Left for everything else",
                  value: Math.max(0, results.requiredMonthlyIncome - results.totalHousingPayment - monthlyDebts),
                  color: SERIES.other,
                  muted: true,
                  note: "Before taxes",
                },
              ]}
            />
            {results.maxMonthlyDebtAllowance > monthlyDebts + 1 && (
              <p className="mt-3 text-sm text-muted-foreground">
                At this income you could carry up to {formatCurrency(results.maxMonthlyDebtAllowance)} a month in other debts.
              </p>
            )}
          </VizCard>

          {/* Qualification Tip */}
          <Card className="calculator-card bg-secondary/30 border-accent/30">
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium text-foreground mb-1">Qualification Tips</p>
                  <p>
                    If your income is below {formatCurrency(results.requiredAnnualIncome)}, consider: 
                    looking for a less expensive home, saving for a larger down payment, 
                    or finding a lender with higher DTI limits (like FHA or VA loans).
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-muted-foreground text-center mt-6">
        This calculator provides estimates for educational purposes only. Actual qualification depends on 
        credit score, employment history, and lender requirements. Consult with a mortgage professional for accurate pre-approval.
      </p>
    </div>
  );
};

export default QualificationCalculator;
