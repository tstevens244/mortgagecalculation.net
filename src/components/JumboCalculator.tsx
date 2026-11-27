import { useMemo } from "react";
import LoanTypeSwitch from "@/components/calc/LoanTypeSwitch";
import MarketRate from "@/components/calc/MarketRate";
import { AlertTriangle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import PaymentBreakdown from "./PaymentBreakdown";
import AmortizationSchedule from "./AmortizationSchedule";
import AmortizationChart from "./AmortizationChart";
import CurrencyInput from "./CurrencyInput";
import PercentInput from "./PercentInput";
import { formatCurrency } from "@/lib/formatters";
import { monthsUntilBalance } from "@/lib/mortgageMath";
import StickyResult from "./StickyResult";
import { AnswerCard } from "./PaymentAnswer";
import { useUrlState } from "@/lib/urlState";
import { HOME_INPUT_KEYS, localInsurance, localTax, withLocalHome } from "@/lib/localCosts";
import { useLocalCosts } from "@/lib/useLocalCosts";
import { averageRate } from "@/lib/marketRates";
import { INSURANCE_SOURCE, LocalFigure, LocalPrice, TAX_SOURCE, insuranceDetail, taxDetail } from "@/components/calc/LocalValue";
import { InputCard, FieldGrid, Field, TermChoice, MoreOptions, DownPaymentField, StartDateField, summarize } from "./calc/Form";
import { CONFORMING_LIMIT, CONFORMING_LIMIT_HIGH_COST as HIGH_COST_LIMIT } from "@/lib/loanLimits";

interface JumboInputs {
  homePrice: number;
  downPayment: number;
  downPaymentPercent: number;
  loanTerm: number;
  interestRate: number;
  propertyTax: number;
  homeInsurance: number;
  hoaFees: number;
  startDate: string;
}

// Current-year conforming loan limits (see src/lib/loanLimits.ts)
const CONFORMING_LIMIT_STANDARD = CONFORMING_LIMIT;
const CONFORMING_LIMIT_HIGH_COST = HIGH_COST_LIMIT;

const JumboCalculator = () => {
  const [inputs, setInputs] = useUrlState<JumboInputs>({
    homePrice: 1000000,
    downPayment: 200000, // 20% typical for jumbo
    downPaymentPercent: 20,
    loanTerm: 30,
    interestRate: averageRate(30),
    propertyTax: 12000,
    homeInsurance: 3000,
    hoaFees: 0,
    startDate: new Date().toISOString().slice(0, 7),
  });

  const { costs } = useLocalCosts((c) => setInputs((prev) => withLocalHome(prev, c, "jumbo")), { keys: HOME_INPUT_KEYS });

  const updateInput = (field: keyof JumboInputs, value: number | string) => {
    setInputs((prev) => {
      const updated = { ...prev, [field]: value };

      if (field === "downPayment") {
        updated.downPaymentPercent = (Number(value) / prev.homePrice) * 100;
      } else if (field === "downPaymentPercent") {
        updated.downPayment = (Number(value) / 100) * prev.homePrice;
      } else if (field === "homePrice") {
        updated.downPayment = (prev.downPaymentPercent / 100) * Number(value);
      }

      return updated;
    });
  };

  const calculations = useMemo(() => {
    const loanAmount = inputs.homePrice - inputs.downPayment;
    const isJumboLoan = loanAmount > CONFORMING_LIMIT_STANDARD;
    const isHighCostJumbo = loanAmount > CONFORMING_LIMIT_HIGH_COST;
    
    // PMI typically not required for jumbo loans with 20%+ down
    // Some lenders may require it for lower down payments
    const requiresPMI = inputs.downPaymentPercent < 20;
    const annualPMIRate = requiresPMI ? 0.5 : 0; // Estimated 0.5% for jumbo if needed
    const monthlyPMI = (loanAmount * (annualPMIRate / 100)) / 12;

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
    const monthlyHOA = inputs.hoaFees;

    const totalMonthly = monthlyPI + monthlyTax + monthlyInsurance + monthlyPMI + monthlyHOA;
    const totalInterest = monthlyPI * numPayments - loanAmount;
    const pmiMonths = monthlyPMI > 0 ? monthsUntilBalance(loanAmount, inputs.interestRate, numPayments, inputs.homePrice * 0.78) : 0;
    const totalPayment =
      (monthlyPI + monthlyTax + monthlyInsurance + monthlyHOA) * numPayments + monthlyPMI * pmiMonths;

    return {
      loanAmount,
      isJumboLoan,
      isHighCostJumbo,
      requiresPMI,
      monthlyPMI,
      monthlyPI,
      monthlyTax,
      monthlyInsurance,
      monthlyHOA,
      totalMonthly,
      totalInterest,
      totalPayment,
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

  // Calculate first month's principal/interest split for breakdown chart
  const firstMonthInterest = calculations.loanAmount * (inputs.interestRate / 100 / 12);
  const firstMonthPrincipal = calculations.monthlyPI - firstMonthInterest;

  return (
    <div className="fade-in">
      {/* Loan Type Alert */}
      {!calculations.isJumboLoan && (
        <Alert className="mb-6 border-accent">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Your loan amount of {formatCurrency(calculations.loanAmount)} is below the conforming limit of {formatCurrency(CONFORMING_LIMIT_STANDARD)}. 
            You may qualify for a conventional conforming loan with potentially better rates.
          </AlertDescription>
        </Alert>
      )}

      <div className="calc-layout">
        {/* Input Section */}
        <div>
          <InputCard id="loan-details" title="Your jumbo loan" description="Start with these four. Taxes, insurance and the rest are filled in for you below.">
            <FieldGrid>
              <Field id="home-price" label="Home price" hint={<LocalPrice costs={costs} kind="jumbo" downPercent={inputs.downPaymentPercent} value={inputs.homePrice} onUse={(v) => updateInput("homePrice", v)} />}>
                <CurrencyInput id="home-price" value={inputs.homePrice} onChange={(value) => updateInput("homePrice", value)} aria-describedby="home-price-hint" />
              </Field>
              <DownPaymentField
                amount={inputs.downPayment}
                percent={inputs.downPaymentPercent}
                onAmount={(value) => updateInput("downPayment", value)}
                onPercent={(value) => updateInput("downPaymentPercent", value)}
                info="Jumbo lenders usually want 10% to 20% down. Putting down 20% or more avoids PMI."
              />
              <Field id="interest-rate" label="Interest rate" info="Your quoted rate, not the APR. Rates change daily; check a few lenders." hint={<MarketRate term={inputs.loanTerm} value={inputs.interestRate} onUse={(r) => updateInput("interestRate", r)} note="Conventional average; Jumbo rates can differ." />}>
                <PercentInput id="interest-rate" value={inputs.interestRate} onChange={(value) => updateInput("interestRate", value)} min={0} max={30} decimalPlaces={3} />
              </Field>
              <Field id="loan-term" label="Loan term">
                <TermChoice id="loan-term" value={inputs.loanTerm} onChange={(years) => updateInput("loanTerm", years)} terms={[30, 20, 15, 10]} />
              </Field>
            </FieldGrid>

            <MoreOptions
              title="Taxes, insurance & HOA"
              summary={summarize(
                `${formatCurrency(inputs.propertyTax)}/yr tax`,
                `${formatCurrency(inputs.homeInsurance)}/yr insurance`,
                inputs.hoaFees > 0 ? `${formatCurrency(inputs.hoaFees)}/mo HOA` : "no HOA",
              )}
            >
              <FieldGrid>
                <Field id="property-tax" label="Property tax" unit="per year" hint={<LocalFigure costs={costs} figure={localTax(costs, inputs.homePrice)} value={inputs.propertyTax} onUse={(v) => updateInput("propertyTax", v)} detail={taxDetail(costs)} source={TAX_SOURCE} />}>
                  <CurrencyInput id="property-tax" value={inputs.propertyTax} onChange={(value) => updateInput("propertyTax", value)} />
                </Field>
                <Field id="home-insurance" label="Home insurance" unit="per year" hint={<LocalFigure costs={costs} figure={localInsurance(costs, inputs.homePrice)} value={inputs.homeInsurance} onUse={(v) => updateInput("homeInsurance", v)} detail={insuranceDetail(costs)} source={INSURANCE_SOURCE} />}>
                  <CurrencyInput id="home-insurance" value={inputs.homeInsurance} onChange={(value) => updateInput("homeInsurance", value)} />
                </Field>
                <Field id="hoa-fees" label="HOA dues" unit="per month">
                  <CurrencyInput id="hoa-fees" value={inputs.hoaFees} onChange={(value) => updateInput("hoaFees", value)} />
                </Field>
                <StartDateField value={inputs.startDate} onChange={(v) => updateInput("startDate", v)} />
              </FieldGrid>
            </MoreOptions>
          </InputCard>
        </div>

        {/* Results Section */}
        <aside className="calc-results" aria-label="Calculation Results">
          <StickyResult targetId="calc-result" label={"Monthly payment"} value={formatCurrency(calculations.totalMonthly)} />
          <AnswerCard
            label="Your jumbo payment"
            total={calculations.totalMonthly}
            context={`on a ${formatCurrency(calculations.loanAmount)} loan at ${inputs.interestRate}% for ${inputs.loanTerm} years`}
            parts={[
              { label: "Principal & interest", value: calculations.monthlyPI },
              { label: "Tax", value: calculations.monthlyTax },
              { label: "Insurance", value: calculations.monthlyInsurance },
              { label: "PMI", value: calculations.monthlyPMI },
              { label: "HOA", value: calculations.monthlyHOA },
            ]}
            stats={[
              {
                label: calculations.isJumboLoan ? "Above the conforming limit" : "Under the conforming limit",
                value: formatCurrency(Math.abs(calculations.loanAmount - CONFORMING_LIMIT_STANDARD)),
                hint: `limit ${formatCurrency(CONFORMING_LIMIT_STANDARD)}${calculations.isJumboLoan ? "" : " · not a jumbo loan"}`,
              },
              { label: "Total interest", value: formatCurrency(calculations.totalInterest), hint: `over ${inputs.loanTerm} years` },
              { label: "Total of all payments", value: formatCurrency(calculations.totalPayment), hint: "incl. tax, insurance & fees" },
              { label: "Paid off", value: amortizationData.length ? amortizationData[amortizationData.length - 1].date.toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "—", hint: `${calculations.numPayments} payments` },
            ]}
          />
          <LoanTypeSwitch current="jumbo" price={inputs.homePrice} down={inputs.downPayment} rate={inputs.interestRate} term={inputs.loanTerm} />
        </aside>
      </div>

      {/* Charts and Schedule Tabs */}
      <section className="mt-8" aria-labelledby="payment-analysis-heading">
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
              principal={firstMonthPrincipal}
              interest={firstMonthInterest}
              tax={calculations.monthlyTax}
              insurance={calculations.monthlyInsurance}
              pmi={calculations.monthlyPMI}
              hoa={calculations.monthlyHOA}
            />
          </TabsContent>

          <TabsContent value="chart">
            <AmortizationChart data={amortizationData} />
          </TabsContent>

          <TabsContent value="schedule">
            <AmortizationSchedule data={amortizationData} />
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
};

export default JumboCalculator;
