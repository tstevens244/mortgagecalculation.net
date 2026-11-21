import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DollarSign, PiggyBank } from "lucide-react";
import VizCard from "./viz/VizCard";
import StackedBar from "./viz/StackedBar";
import { SERIES } from "./viz/theme";
import CurrencyInput from "./CurrencyInput";
import PercentInput from "./PercentInput";
import { maxAffordablePrice } from "@/lib/mortgageMath";
import { formatCurrency } from "@/lib/formatters";
import StickyResult from "./StickyResult";
import { InputCard, FieldGrid, Field, TermChoice, MoreOptions, summarize } from "./calc/Form";

// Estimated PMI, % of the loan per year, applied when the down payment is under 20%.
const PMI_RATE = 0.5;

const AffordabilityCalculator = () => {
  // Income-based calculator state
  const [annualIncome, setAnnualIncome] = useState(120000);
  const [loanTerm, setLoanTerm] = useState("30");
  const [interestRate, setInterestRate] = useState(6.5);
  const [monthlyDebts, setMonthlyDebts] = useState(500);
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [propertyTaxRate, setPropertyTaxRate] = useState(1.5);
  const [hoaFee, setHoaFee] = useState(0);
  const [insuranceRate, setInsuranceRate] = useState(0.5);
  const [dtiRule, setDtiRule] = useState("28/36");

  // Budget-based calculator state
  const [monthlyBudget, setMonthlyBudget] = useState(3500);
  const [budgetLoanTerm, setBudgetLoanTerm] = useState("30");
  const [budgetInterestRate, setBudgetInterestRate] = useState(6.5);
  const [budgetDownPaymentPercent, setBudgetDownPaymentPercent] = useState(20);
  const [budgetPropertyTaxRate, setBudgetPropertyTaxRate] = useState(1.5);
  const [budgetHoaFee, setBudgetHoaFee] = useState(0);
  const [budgetInsuranceRate, setBudgetInsuranceRate] = useState(0.5);

  // Income-based calculation
  const incomeResults = useMemo(() => {
    const monthlyIncome = annualIncome / 12;
    
    // Get DTI limits based on rule
    let frontEndLimit = 0.28;
    let backEndLimit = 0.36;
    
    switch (dtiRule) {
      case "28/36":
        frontEndLimit = 0.28;
        backEndLimit = 0.36;
        break;
      case "31/43":
        frontEndLimit = 0.31;
        backEndLimit = 0.43;
        break;
      case "41":
        frontEndLimit = 0.41;
        backEndLimit = 0.41;
        break;
      default:
        const customRate = parseInt(dtiRule) / 100;
        frontEndLimit = customRate;
        backEndLimit = customRate;
    }
    
    // Max housing payment based on front-end ratio
    const maxHousingFromFrontEnd = monthlyIncome * frontEndLimit;
    
    // Max housing payment based on back-end ratio (total debt)
    const maxHousingFromBackEnd = (monthlyIncome * backEndLimit) - monthlyDebts;
    
    // Use the lower of the two
    const maxMonthlyPayment = Math.max(0, Math.min(maxHousingFromFrontEnd, maxHousingFromBackEnd));
    
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = parseInt(loanTerm) * 12;
    const homePrice = Math.floor(
      maxAffordablePrice({
        maxPayment: maxMonthlyPayment,
        annualRatePercent: interestRate,
        months: numberOfPayments,
        downPaymentPercent,
        propertyTaxRatePercent: propertyTaxRate,
        insuranceRatePercent: insuranceRate,
        pmiRatePercent: PMI_RATE,
        monthlyHoa: hoaFee,
      }),
    );

    const downPayment = homePrice * (downPaymentPercent / 100);
    const loanAmount = homePrice - downPayment;
    
    // Calculate final monthly payment breakdown
    let monthlyPI = 0;
    if (monthlyRate > 0 && loanAmount > 0) {
      monthlyPI = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
        (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    }
    
    const monthlyTaxes = (homePrice * propertyTaxRate / 100) / 12;
    const monthlyInsurance = (homePrice * insuranceRate / 100) / 12;
    const monthlyHOA = hoaFee;
    const monthlyPMI = downPaymentPercent < 20 ? (loanAmount * PMI_RATE) / 100 / 12 : 0;
    const totalMonthlyPayment = monthlyPI + monthlyTaxes + monthlyInsurance + monthlyHOA + monthlyPMI;

    return {
      homePrice: Math.max(0, homePrice),
      downPayment,
      loanAmount,
      monthlyPayment: totalMonthlyPayment,
      monthlyPI,
      monthlyTaxes,
      monthlyInsurance,
      monthlyHOA,
      monthlyPMI,
      frontEndLimit,
      backEndLimit,
    };
  }, [annualIncome, loanTerm, interestRate, monthlyDebts, downPaymentPercent, propertyTaxRate, hoaFee, insuranceRate, dtiRule]);

  // Budget-based calculation
  const budgetResults = useMemo(() => {
    const monthlyRate = budgetInterestRate / 100 / 12;
    const numberOfPayments = parseInt(budgetLoanTerm) * 12;
    
    const homePrice = Math.floor(
      maxAffordablePrice({
        maxPayment: monthlyBudget,
        annualRatePercent: budgetInterestRate,
        months: numberOfPayments,
        downPaymentPercent: budgetDownPaymentPercent,
        propertyTaxRatePercent: budgetPropertyTaxRate,
        insuranceRatePercent: budgetInsuranceRate,
        pmiRatePercent: PMI_RATE,
        monthlyHoa: budgetHoaFee,
      }),
    );

    const downPayment = homePrice * (budgetDownPaymentPercent / 100);
    const loanAmount = homePrice - downPayment;
    
    // Calculate final monthly payment breakdown
    let monthlyPI = 0;
    if (monthlyRate > 0 && loanAmount > 0) {
      monthlyPI = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
        (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    }
    
    const monthlyTaxes = (homePrice * budgetPropertyTaxRate / 100) / 12;
    const monthlyInsurance = (homePrice * budgetInsuranceRate / 100) / 12;
    const monthlyHOA = budgetHoaFee;
    const monthlyPMI = budgetDownPaymentPercent < 20 ? (loanAmount * PMI_RATE) / 100 / 12 : 0;
    const totalMonthlyPayment = monthlyPI + monthlyTaxes + monthlyInsurance + monthlyHOA + monthlyPMI;

    return {
      homePrice: Math.max(0, homePrice),
      downPayment,
      loanAmount,
      monthlyPayment: totalMonthlyPayment,
      monthlyPI,
      monthlyTaxes,
      monthlyInsurance,
      monthlyHOA,
      monthlyPMI,
    };
  }, [monthlyBudget, budgetLoanTerm, budgetInterestRate, budgetDownPaymentPercent, budgetPropertyTaxRate, budgetHoaFee, budgetInsuranceRate]);

  const ResultsCard = ({
    results,
    title,
    income,
  }: {
    results: typeof budgetResults;
    title: string;
    income?: { monthly: number; debts: number; front: number; back: number };
  }) => (
    <div className="space-y-6 lg:col-span-2">
      {/* Main Result */}
      <Card className="result-highlight border-0">
        <CardContent className="p-0">
          <StickyResult targetId="calc-result" label={title} value={formatCurrency(results.homePrice)} />
          <div id="calc-result" className="text-center space-y-2">
            <p className="text-white/80 text-sm font-medium">
              {title}
            </p>
            <p className="text-4xl md:text-5xl font-bold text-white number-pop">
              {formatCurrency(results.homePrice)}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Payment breakdown */}
      <VizCard title="Monthly payment at this price" description={`${formatCurrency(results.monthlyPayment)} a month, split into its parts.`}>
        <StackedBar
          legend
          segments={[
            { label: "Principal & interest", value: results.monthlyPI, color: SERIES.principal },
            { label: "Property tax", value: results.monthlyTaxes, color: SERIES.tax },
            { label: "Home insurance", value: results.monthlyInsurance, color: SERIES.insurance },
            { label: "PMI", value: results.monthlyPMI, color: SERIES.pmi, note: "Until you reach 20% equity" },
            { label: "HOA dues", value: results.monthlyHOA, color: SERIES.hoa },
          ]}
        />
      </VizCard>

      {income && (
        <VizCard
          title="Where your income goes"
          description={`Lenders compare your payments to your ${formatCurrency(income.monthly)} gross monthly income. The lines are the limits for the ${dtiRule} rule.`}
        >
          <StackedBar
            legend
            max={income.monthly}
            markers={
              income.front === income.back
                ? [{ value: income.monthly * income.back, label: `${Math.round(income.back * 100)}% limit` }]
                : [
                    { value: income.monthly * income.front, label: `${Math.round(income.front * 100)}% housing` },
                    { value: income.monthly * income.back, label: `${Math.round(income.back * 100)}% all debts` },
                  ]
            }
            segments={[
              { label: "Housing payment", value: results.monthlyPayment, color: SERIES.principal, note: `${((results.monthlyPayment / income.monthly) * 100).toFixed(0)}% of income (limit ${Math.round(income.front * 100)}%)` },
              { label: "Other debt payments", value: income.debts, color: SERIES.interest, note: `Housing + debts: ${(((results.monthlyPayment + income.debts) / income.monthly) * 100).toFixed(0)}% (limit ${Math.round(income.back * 100)}%)` },
              { label: "Left for everything else", value: Math.max(0, income.monthly - results.monthlyPayment - income.debts), color: SERIES.other, muted: true, note: "Before taxes" },
            ]}
          />
        </VizCard>
      )}

      {/* Loan Summary */}
      <Card className="calculator-card bg-secondary/30">
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Down Payment</p>
              <p className="text-xl font-bold text-foreground">{formatCurrency(results.downPayment)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Loan Amount</p>
              <p className="text-xl font-bold text-foreground">{formatCurrency(results.loanAmount)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      <Tabs defaultValue="income" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="income" className="text-sm">
            <DollarSign className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Income-Based</span>
            <span className="sm:hidden">Income</span>
          </TabsTrigger>
          <TabsTrigger value="budget" className="text-sm">
            <PiggyBank className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Budget-Based</span>
            <span className="sm:hidden">Budget</span>
          </TabsTrigger>
        </TabsList>

        {/* Income-Based Calculator */}
        <TabsContent value="income">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <InputCard className="lg:col-span-3" id="affordability-income" title="Your income and debts" description="Lenders size your budget from your gross income and monthly debts.">
              <FieldGrid>
                <Field id="affordability-annual-household-income" label="Annual household income" info="Total income before taxes for everyone on the loan.">
                  <CurrencyInput id="affordability-annual-household-income" value={annualIncome} onChange={setAnnualIncome} />
                </Field>
                <Field id="affordability-monthly-debt-payments" label="Monthly debt payments" info="Car, student loan and credit card minimums, child support. Not rent or utilities.">
                  <CurrencyInput id="affordability-monthly-debt-payments" value={monthlyDebts} onChange={setMonthlyDebts} />
                </Field>
                <Field id="affordability-down-payment" label="Down payment" unit="% of price">
                  <PercentInput id="affordability-down-payment" value={downPaymentPercent} onChange={setDownPaymentPercent} min={0} max={100} decimalPlaces={1} />
                </Field>
                <Field id="affordability-interest-rate" label="Interest rate">
                  <PercentInput id="affordability-interest-rate" value={interestRate} onChange={setInterestRate} min={0} max={20} decimalPlaces={3} />
                </Field>
              </FieldGrid>
              <MoreOptions
                title="Loan term, taxes & fees"
                summary={summarize(
                  `${loanTerm}-year loan`,
                  `${dtiRule} rule`,
                  `${propertyTaxRate}% tax`,
                  `${insuranceRate}% insurance`,
                  hoaFee > 0 ? `${formatCurrency(hoaFee)}/mo HOA` : "no HOA",
                )}
              >
                <FieldGrid>
                  <Field id="affordability-loan-term" label="Loan term">
                    <TermChoice id="affordability-loan-term" value={Number(loanTerm)} onChange={(y) => setLoanTerm(String(y))} />
                  </Field>
                  <Field id="affordability-debt-to-income-dti-ratio" label="Lender rule" info="The most of your income lenders let go to housing (first number) and to all debts (second).">
                    <Select value={dtiRule} onValueChange={setDtiRule}>
                      <SelectTrigger id="affordability-debt-to-income-dti-ratio">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="28/36">Conventional (28/36)</SelectItem>
                        <SelectItem value="31/43">FHA (31/43)</SelectItem>
                        <SelectItem value="41">VA (41%)</SelectItem>
                        <SelectItem value="25">Conservative (25%)</SelectItem>
                        <SelectItem value="30">Moderate (30%)</SelectItem>
                        <SelectItem value="35">Aggressive (35%)</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field id="affordability-property-tax-rate-per-year" label="Property tax rate" unit="per year" info="As a % of the home price. The U.S. average is about 0.9%; it varies a lot by county.">
                    <PercentInput id="affordability-property-tax-rate-per-year" value={propertyTaxRate} onChange={setPropertyTaxRate} min={0} max={5} decimalPlaces={2} />
                  </Field>
                  <Field id="affordability-home-insurance-rate-per-year" label="Home insurance rate" unit="per year" info="As a % of the home price. About 0.4% to 0.6% is typical.">
                    <PercentInput id="affordability-home-insurance-rate-per-year" value={insuranceRate} onChange={setInsuranceRate} min={0} max={3} decimalPlaces={2} />
                  </Field>
                  <Field id="affordability-hoa-fee-per-year" label="HOA dues" unit="per month">
                    <CurrencyInput id="affordability-hoa-fee-per-year" value={hoaFee} onChange={setHoaFee} />
                  </Field>
                </FieldGrid>
              </MoreOptions>
            </InputCard>

            <ResultsCard
              results={incomeResults}
              title="You Can Afford a Home Up To"
              income={{ monthly: annualIncome / 12, debts: monthlyDebts, front: incomeResults.frontEndLimit, back: incomeResults.backEndLimit }}
            />
          </div>
        </TabsContent>

        {/* Budget-Based Calculator */}
        <TabsContent value="budget">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <InputCard className="lg:col-span-3" id="affordability-budget" title="Your monthly budget" description="Start from what you want to spend each month, all-in.">
              <FieldGrid>
                <Field id="affordability-monthly-housing-budget" label="Monthly housing budget" info="Everything: loan payment, property tax, insurance, PMI and HOA dues." className="sm:col-span-2">
                  <CurrencyInput id="affordability-monthly-housing-budget" value={monthlyBudget} onChange={setMonthlyBudget} />
                </Field>
                <Field id="affordability-down-payment-2" label="Down payment" unit="% of price">
                  <PercentInput id="affordability-down-payment-2" value={budgetDownPaymentPercent} onChange={setBudgetDownPaymentPercent} min={0} max={100} decimalPlaces={1} />
                </Field>
                <Field id="affordability-interest-rate-2" label="Interest rate">
                  <PercentInput id="affordability-interest-rate-2" value={budgetInterestRate} onChange={setBudgetInterestRate} min={0} max={20} decimalPlaces={3} />
                </Field>
              </FieldGrid>
              <MoreOptions
                title="Loan term, taxes & fees"
                summary={summarize(
                  `${budgetLoanTerm}-year loan`,
                  `${budgetPropertyTaxRate}% tax`,
                  `${budgetInsuranceRate}% insurance`,
                  budgetHoaFee > 0 ? `${formatCurrency(budgetHoaFee)}/mo HOA` : "no HOA",
                )}
              >
                <FieldGrid>
                  <Field id="affordability-loan-term-2" label="Loan term">
                    <TermChoice id="affordability-loan-term-2" value={Number(budgetLoanTerm)} onChange={(y) => setBudgetLoanTerm(String(y))} />
                  </Field>
                  <Field id="affordability-property-tax-rate-per-year-2" label="Property tax rate" unit="per year" info="As a % of the home price. The U.S. average is about 0.9%; it varies a lot by county.">
                    <PercentInput id="affordability-property-tax-rate-per-year-2" value={budgetPropertyTaxRate} onChange={setBudgetPropertyTaxRate} min={0} max={5} decimalPlaces={2} />
                  </Field>
                  <Field id="affordability-home-insurance-rate-per-year-2" label="Home insurance rate" unit="per year" info="As a % of the home price. About 0.4% to 0.6% is typical.">
                    <PercentInput id="affordability-home-insurance-rate-per-year-2" value={budgetInsuranceRate} onChange={setBudgetInsuranceRate} min={0} max={3} decimalPlaces={2} />
                  </Field>
                  <Field id="affordability-hoa-fee-per-year-2" label="HOA dues" unit="per month">
                    <CurrencyInput id="affordability-hoa-fee-per-year-2" value={budgetHoaFee} onChange={setBudgetHoaFee} />
                  </Field>
                </FieldGrid>
              </MoreOptions>
            </InputCard>

            <ResultsCard results={budgetResults} title="You Can Afford a Home Up To" />
          </div>
        </TabsContent>
      </Tabs>

      {/* Disclaimer */}
      <p className="text-xs text-muted-foreground text-center mt-6">
        This calculator provides estimates for educational purposes only. Actual affordability depends on 
        credit score, debt levels, and lender requirements. Consult with a mortgage professional for accurate pre-approval.
      </p>
    </div>
  );
};

export default AffordabilityCalculator;
