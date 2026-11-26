import { useMemo } from "react";
import LoanTypeSwitch from "@/components/calc/LoanTypeSwitch";
import MarketRate from "@/components/calc/MarketRate";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PaymentBreakdown from "./PaymentBreakdown";
import AmortizationSchedule from "./AmortizationSchedule";
import AmortizationChart from "./AmortizationChart";
import CurrencyInput from "./CurrencyInput";
import PercentInput from "./PercentInput";
import { formatCurrency } from "@/lib/formatters";
import StickyResult from "./StickyResult";
import { AnswerCard } from "./PaymentAnswer";
import { useUrlState } from "@/lib/urlState";
import { InputCard, FieldGrid, Field, TermChoice, MoreOptions, DownPaymentField, StartDateField, summarize } from "./calc/Form";
import { FHA_UPFRONT_MIP_RATE, fhaAnnualMipRate, fhaMipMonths } from "@/lib/loanLimits";
import { totalBalanceBasedFee } from "@/lib/mortgageMath";

interface FHAInputs {
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

const FHACalculator = () => {
  const [inputs, setInputs] = useUrlState<FHAInputs>({
    homePrice: 300000,
    downPayment: 10500, // 3.5% minimum for FHA
    downPaymentPercent: 3.5,
    loanTerm: 30,
    interestRate: 6.5,
    propertyTax: 3600,
    homeInsurance: 1200,
    hoaFees: 0,
    startDate: new Date().toISOString().slice(0, 7),
  });

  const updateInput = (field: keyof FHAInputs, value: number | string) => {
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
    const baseLoanAmount = inputs.homePrice - inputs.downPayment;
    const ltvPercent = (baseLoanAmount / inputs.homePrice) * 100;
    
    // FHA requires upfront MIP to be financed into the loan
    const upfrontMIP = baseLoanAmount * (FHA_UPFRONT_MIP_RATE / 100);
    const totalLoanAmount = baseLoanAmount + upfrontMIP;
    
    // Annual MIP rate based on loan term and LTV
    const annualMIPRate = fhaAnnualMipRate(inputs.loanTerm, ltvPercent, baseLoanAmount);
    const mipMonths = fhaMipMonths(inputs.loanTerm, ltvPercent);
    const monthlyMIP = (baseLoanAmount * (annualMIPRate / 100)) / 12;

    const monthlyRate = inputs.interestRate / 100 / 12;
    const numPayments = inputs.loanTerm * 12;

    // Monthly principal & interest (on total loan including upfront MIP)
    const monthlyPI =
      monthlyRate > 0
        ? (totalLoanAmount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
          (Math.pow(1 + monthlyRate, numPayments) - 1)
        : totalLoanAmount / numPayments;

    const monthlyTax = inputs.propertyTax / 12;
    const monthlyInsurance = inputs.homeInsurance / 12;
    const monthlyHOA = inputs.hoaFees;

    const totalMonthly = monthlyPI + monthlyTax + monthlyInsurance + monthlyMIP + monthlyHOA;
    const totalInterest = monthlyPI * numPayments - totalLoanAmount;
    // Annual MIP is recalculated each year on the balance, and charged for 11
    // years with 10%+ down, otherwise for the full term.
    const totalMIP =
      totalBalanceBasedFee(totalLoanAmount, inputs.interestRate, numPayments, annualMIPRate, mipMonths) *
        (baseLoanAmount / totalLoanAmount) +
      upfrontMIP;

    return {
      baseLoanAmount,
      upfrontMIP,
      totalLoanAmount,
      ltvPercent,
      annualMIPRate,
      monthlyPI,
      monthlyTax,
      monthlyInsurance,
      monthlyMIP,
      monthlyHOA,
      totalMonthly,
      totalInterest,
      totalMIP,
      mipMonths,
      numPayments,
    };
  }, [inputs]);

  const amortizationData = useMemo(() => {
    const data = [];
    let balance = calculations.totalLoanAmount;
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

  return (
    <div className="fade-in">
      <div className="calc-layout">
        {/* Input Section */}
        <div>
          <InputCard id="loan-details" title="Your FHA loan" description="Start with these four. Taxes, insurance and the rest are filled in for you below.">
            <FieldGrid>
              <Field id="home-price" label="Home price">
                <CurrencyInput id="home-price" value={inputs.homePrice} onChange={(value) => updateInput("homePrice", value)} />
              </Field>
              <DownPaymentField
                amount={inputs.downPayment}
                percent={inputs.downPaymentPercent}
                onAmount={(value) => updateInput("downPayment", value)}
                onPercent={(value) => updateInput("downPaymentPercent", value)}
                info="FHA requires at least 3.5% down with a credit score of 580 or higher, or 10% with a score of 500 to 579."
              />
              <Field id="interest-rate" label="Interest rate" info="Your quoted rate, not the APR. Rates change daily; check a few lenders." hint={<MarketRate term={inputs.loanTerm} value={inputs.interestRate} onUse={(r) => updateInput("interestRate", r)} note="Conventional average; FHA rates are often a little lower." />}>
                <PercentInput id="interest-rate" value={inputs.interestRate} onChange={(value) => updateInput("interestRate", value)} min={0} max={30} decimalPlaces={3} />
              </Field>
              <Field id="loan-term" label="Loan term">
                <TermChoice id="loan-term" value={inputs.loanTerm} onChange={(years) => updateInput("loanTerm", years)} terms={[30, 15]} />
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
                <Field id="property-tax" label="Property tax" unit="per year">
                  <CurrencyInput id="property-tax" value={inputs.propertyTax} onChange={(value) => updateInput("propertyTax", value)} />
                </Field>
                <Field id="home-insurance" label="Home insurance" unit="per year">
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
            label="Your FHA payment"
            total={calculations.totalMonthly}
            context={`on a ${formatCurrency(calculations.totalLoanAmount)} loan (incl. ${formatCurrency(calculations.upfrontMIP)} upfront MIP) at ${inputs.interestRate}% for ${inputs.loanTerm} years`}
            parts={[
              { label: "Principal & interest", value: calculations.monthlyPI },
              { label: "Tax", value: calculations.monthlyTax },
              { label: "Insurance", value: calculations.monthlyInsurance },
              { label: "MIP", value: calculations.monthlyMIP },
              { label: "HOA", value: calculations.monthlyHOA },
            ]}
            stats={[
              { label: "Loan amount", value: formatCurrency(calculations.totalLoanAmount), hint: `${formatCurrency(calculations.baseLoanAmount)} + ${formatCurrency(calculations.upfrontMIP)} upfront MIP` },
              { label: "Total interest", value: formatCurrency(calculations.totalInterest), hint: `over ${inputs.loanTerm} years` },
              { label: "Annual MIP", value: formatCurrency(calculations.totalMIP), hint: `${calculations.annualMIPRate}% a year, ${calculations.mipMonths === calculations.numPayments ? "for the life of the loan" : `for ${calculations.mipMonths / 12} years`}` },
              { label: "Paid off", value: amortizationData.length ? amortizationData[amortizationData.length - 1].date.toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "—", hint: `${calculations.numPayments} payments` },
            ]}
          />
          <LoanTypeSwitch current="fha" price={inputs.homePrice} down={inputs.downPayment} rate={inputs.interestRate} term={inputs.loanTerm} />
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
              pmiLabel="MIP"
              principal={calculations.monthlyPI - (calculations.totalLoanAmount * (inputs.interestRate / 100 / 12))}
              interest={calculations.totalLoanAmount * (inputs.interestRate / 100 / 12)}
              tax={calculations.monthlyTax}
              insurance={calculations.monthlyInsurance}
              pmi={calculations.monthlyMIP}
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

export default FHACalculator;
