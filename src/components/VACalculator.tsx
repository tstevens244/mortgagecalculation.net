import { useState, useMemo } from "react";
import { Home, Percent, Calendar, DollarSign, Shield, Building, Users, Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Switch } from "@/components/ui/switch";
import PaymentBreakdown from "./PaymentBreakdown";
import AmortizationSchedule from "./AmortizationSchedule";
import AmortizationChart from "./AmortizationChart";
import CurrencyInput from "./CurrencyInput";
import { formatCurrency } from "@/lib/formatters";

interface VAInputs {
  homePrice: number;
  downPayment: number;
  downPaymentPercent: number;
  loanTerm: number;
  interestRate: number;
  propertyTax: number;
  homeInsurance: number;
  hoaFees: number;
  startDate: string;
  eligibilityType: "active" | "reserves";
  firstTimeUse: boolean;
  hasDisability: boolean;
  financeFundingFee: boolean;
}

// VA Funding Fee rates (as of 2024)
const getFundingFeeRate = (
  eligibilityType: "active" | "reserves",
  firstTimeUse: boolean,
  downPaymentPercent: number,
  hasDisability: boolean
): number => {
  // Exempt from funding fee
  if (hasDisability) return 0;

  // First-time use rates
  if (firstTimeUse) {
    if (downPaymentPercent >= 10) return 1.25;
    if (downPaymentPercent >= 5) return 1.5;
    return eligibilityType === "active" ? 2.15 : 2.4;
  }
  
  // Subsequent use rates
  if (downPaymentPercent >= 10) return 1.25;
  if (downPaymentPercent >= 5) return 1.5;
  return eligibilityType === "active" ? 3.3 : 3.3;
};

const VACalculator = () => {
  const [inputs, setInputs] = useState<VAInputs>({
    homePrice: 400000,
    downPayment: 0,
    downPaymentPercent: 0,
    loanTerm: 30,
    interestRate: 6.25,
    propertyTax: 4800,
    homeInsurance: 1500,
    hoaFees: 0,
    startDate: new Date().toISOString().slice(0, 7),
    eligibilityType: "active",
    firstTimeUse: true,
    hasDisability: false,
    financeFundingFee: true,
  });

  const updateInput = (field: keyof VAInputs, value: number | string | boolean) => {
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
    
    // Calculate VA funding fee
    const fundingFeeRate = getFundingFeeRate(
      inputs.eligibilityType,
      inputs.firstTimeUse,
      inputs.downPaymentPercent,
      inputs.hasDisability
    );
    const fundingFee = baseLoanAmount * (fundingFeeRate / 100);
    
    // Total loan amount depends on whether funding fee is financed
    const totalLoanAmount = inputs.financeFundingFee 
      ? baseLoanAmount + fundingFee 
      : baseLoanAmount;

    const monthlyRate = inputs.interestRate / 100 / 12;
    const numPayments = inputs.loanTerm * 12;

    // Monthly principal & interest
    const monthlyPI =
      monthlyRate > 0
        ? (totalLoanAmount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
          (Math.pow(1 + monthlyRate, numPayments) - 1)
        : totalLoanAmount / numPayments;

    const monthlyTax = inputs.propertyTax / 12;
    const monthlyInsurance = inputs.homeInsurance / 12;
    const monthlyHOA = inputs.hoaFees;

    // VA loans don't require PMI!
    const totalMonthly = monthlyPI + monthlyTax + monthlyInsurance + monthlyHOA;
    const totalInterest = monthlyPI * numPayments - totalLoanAmount;

    return {
      baseLoanAmount,
      fundingFeeRate,
      fundingFee,
      totalLoanAmount,
      monthlyPI,
      monthlyTax,
      monthlyInsurance,
      monthlyHOA,
      totalMonthly,
      totalInterest,
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

  // Calculate first month's principal/interest split for breakdown chart
  const firstMonthInterest = calculations.totalLoanAmount * (inputs.interestRate / 100 / 12);
  const firstMonthPrincipal = calculations.monthlyPI - firstMonthInterest;

  return (
    <div className="fade-in">
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Input Section */}
        <div className="lg:col-span-2">
          <section className="calculator-card p-3 sm:p-6" aria-labelledby="va-loan-details-heading">
            <h2 id="va-loan-details-heading" className="text-base sm:text-xl font-display font-semibold mb-3 sm:mb-6 flex items-center gap-2">
              <Home className="h-4 w-4 sm:h-5 sm:w-5 text-accent" aria-hidden="true" />
              VA Loan Details
            </h2>

            <div className="grid gap-2 sm:gap-4 grid-cols-1 sm:grid-cols-2">
              {/* Home Price */}
              <div className="flex items-center gap-2">
                <Label htmlFor="home-price" className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap flex items-center gap-1 min-w-[80px] sm:min-w-[100px]">
                  <DollarSign className="h-3 w-3 sm:h-4 sm:w-4" aria-hidden="true" />
                  <span className="hidden sm:inline">Home Price</span>
                  <span className="sm:hidden">Price</span>
                </Label>
                <CurrencyInput
                  id="home-price"
                  value={inputs.homePrice}
                  onChange={(value) => updateInput("homePrice", value)}
                />
              </div>

              {/* Down Payment */}
              <div className="flex items-center gap-2">
                <Label htmlFor="down-payment" className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap flex items-center gap-1 min-w-[80px] sm:min-w-[100px]">
                  <Percent className="h-3 w-3 sm:h-4 sm:w-4" aria-hidden="true" />
                  <span className="hidden sm:inline">Down Payment</span>
                  <span className="sm:hidden">Down</span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>VA loans allow 0% down payment. A down payment of 5% or more reduces the funding fee.</p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <div className="flex gap-1 sm:gap-2 flex-1">
                  <CurrencyInput
                    id="down-payment"
                    value={inputs.downPayment}
                    onChange={(value) => updateInput("downPayment", value)}
                  />
                  <Input
                    type="text"
                    inputMode="decimal"
                    value={inputs.downPaymentPercent.toFixed(1)}
                    onChange={(e) => updateInput("downPaymentPercent", parseFloat(e.target.value) || 0)}
                    className="h-8 sm:h-10 w-12 sm:w-16 text-center text-xs sm:text-sm"
                    aria-label="Down payment percentage"
                  />
                  <span className="flex items-center text-muted-foreground text-xs sm:text-sm">%</span>
                </div>
              </div>

              {/* Loan Term */}
              <div className="flex items-center gap-2">
                <Label htmlFor="loan-term" className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap flex items-center gap-1 min-w-[80px] sm:min-w-[100px]">
                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4" aria-hidden="true" />
                  <span className="hidden sm:inline">Loan Term</span>
                  <span className="sm:hidden">Term</span>
                </Label>
                <Select
                  value={inputs.loanTerm.toString()}
                  onValueChange={(v) => updateInput("loanTerm", parseInt(v))}
                >
                  <SelectTrigger id="loan-term" className="h-8 sm:h-10 text-sm sm:text-lg font-medium flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 years</SelectItem>
                    <SelectItem value="20">20 years</SelectItem>
                    <SelectItem value="25">25 years</SelectItem>
                    <SelectItem value="30">30 years</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Interest Rate */}
              <div className="flex items-center gap-2">
                <Label htmlFor="interest-rate" className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap flex items-center gap-1 min-w-[80px] sm:min-w-[100px]">
                  <Percent className="h-3 w-3 sm:h-4 sm:w-4" aria-hidden="true" />
                  <span className="hidden sm:inline">Interest Rate</span>
                  <span className="sm:hidden">Rate</span>
                </Label>
                <div className="flex gap-1 sm:gap-2 flex-1">
                  <Input
                    id="interest-rate"
                    type="text"
                    inputMode="decimal"
                    value={inputs.interestRate}
                    onChange={(e) => updateInput("interestRate", parseFloat(e.target.value) || 0)}
                    className="h-8 sm:h-10 text-sm sm:text-lg font-medium flex-1"
                  />
                  <span className="flex items-center text-muted-foreground text-xs sm:text-sm">%</span>
                </div>
              </div>

              {/* Start Date */}
              <div className="flex items-center gap-2">
                <Label className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap flex items-center gap-1 min-w-[80px] sm:min-w-[100px]">
                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4" aria-hidden="true" />
                  <span className="hidden sm:inline">Start Date</span>
                  <span className="sm:hidden">Start</span>
                </Label>
                <div className="flex gap-1 sm:gap-2 flex-1">
                  <Select
                    value={inputs.startDate.split("-")[1]}
                    onValueChange={(month) => {
                      const year = inputs.startDate.split("-")[0];
                      updateInput("startDate", `${year}-${month}`);
                    }}
                  >
                    <SelectTrigger className="h-8 sm:h-10 text-xs sm:text-sm flex-1">
                      <SelectValue placeholder="Month" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="01">January</SelectItem>
                      <SelectItem value="02">February</SelectItem>
                      <SelectItem value="03">March</SelectItem>
                      <SelectItem value="04">April</SelectItem>
                      <SelectItem value="05">May</SelectItem>
                      <SelectItem value="06">June</SelectItem>
                      <SelectItem value="07">July</SelectItem>
                      <SelectItem value="08">August</SelectItem>
                      <SelectItem value="09">September</SelectItem>
                      <SelectItem value="10">October</SelectItem>
                      <SelectItem value="11">November</SelectItem>
                      <SelectItem value="12">December</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={inputs.startDate.split("-")[0]}
                    onValueChange={(year) => {
                      const month = inputs.startDate.split("-")[1];
                      updateInput("startDate", `${year}-${month}`);
                    }}
                  >
                    <SelectTrigger className="h-8 sm:h-10 text-xs sm:text-sm w-20 sm:w-24">
                      <SelectValue placeholder="Year" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 30 }, (_, i) => {
                        const year = new Date().getFullYear() + i;
                        return (
                          <SelectItem key={year} value={year.toString()}>
                            {year}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* VA Eligibility Section */}
            <h2 className="text-base sm:text-xl font-display font-semibold mt-4 sm:mt-6 mb-3 sm:mb-6 flex items-center gap-2">
              <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-accent" aria-hidden="true" />
              VA Eligibility
            </h2>

            <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
              {/* Eligibility Type */}
              <div className="flex items-center gap-2">
                <Label className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap flex items-center gap-1 min-w-[80px] sm:min-w-[100px]">
                  Service Type
                </Label>
                <Select
                  value={inputs.eligibilityType}
                  onValueChange={(v) => updateInput("eligibilityType", v as "active" | "reserves")}
                >
                  <SelectTrigger className="h-8 sm:h-10 text-xs sm:text-sm flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active Duty / Veteran</SelectItem>
                    <SelectItem value="reserves">Reserves / National Guard</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* First Time Use */}
              <div className="flex items-center gap-2">
                <Label className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap flex items-center gap-1 min-w-[80px] sm:min-w-[100px]">
                  First VA Loan?
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>First-time VA loan users pay a lower funding fee than those who have used their VA benefit before.</p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <div className="flex items-center gap-2 flex-1">
                  <Switch
                    checked={inputs.firstTimeUse}
                    onCheckedChange={(checked) => updateInput("firstTimeUse", checked)}
                  />
                  <span className="text-xs sm:text-sm">{inputs.firstTimeUse ? "Yes" : "No"}</span>
                </div>
              </div>

              {/* Disability Exemption */}
              <div className="flex items-center gap-2">
                <Label className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap flex items-center gap-1 min-w-[80px] sm:min-w-[100px]">
                  Disability 10%+?
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>Veterans with a service-connected disability rating of 10% or higher are exempt from the VA funding fee.</p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <div className="flex items-center gap-2 flex-1">
                  <Switch
                    checked={inputs.hasDisability}
                    onCheckedChange={(checked) => updateInput("hasDisability", checked)}
                  />
                  <span className="text-xs sm:text-sm">{inputs.hasDisability ? "Yes (Exempt)" : "No"}</span>
                </div>
              </div>

              {/* Finance Funding Fee */}
              <div className="flex items-center gap-2">
                <Label className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap flex items-center gap-1 min-w-[80px] sm:min-w-[100px]">
                  Finance Fee?
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>The VA funding fee can be financed into the loan or paid upfront at closing.</p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <div className="flex items-center gap-2 flex-1">
                  <Switch
                    checked={inputs.financeFundingFee}
                    onCheckedChange={(checked) => updateInput("financeFundingFee", checked)}
                    disabled={inputs.hasDisability}
                  />
                  <span className="text-xs sm:text-sm">{inputs.financeFundingFee ? "Financed" : "Paid Upfront"}</span>
                </div>
              </div>
            </div>

            {/* Additional Costs Section */}
            <h2 id="additional-costs-heading" className="text-base sm:text-xl font-display font-semibold mt-4 sm:mt-6 mb-3 sm:mb-6 flex items-center gap-2">
              <Building className="h-4 w-4 sm:h-5 sm:w-5 text-accent" aria-hidden="true" />
              Additional Costs
            </h2>

            <div className="grid gap-2 sm:gap-4 grid-cols-1 sm:grid-cols-2">
              {/* Property Tax */}
              <div className="flex items-center gap-2">
                <Label htmlFor="property-tax" className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap flex items-center gap-1 min-w-[80px] sm:min-w-[100px]">
                  <Building className="h-3 w-3 sm:h-4 sm:w-4" aria-hidden="true" />
                  <span className="hidden sm:inline">Property Tax</span>
                  <span className="sm:hidden">Tax</span>
                </Label>
                <CurrencyInput
                  id="property-tax"
                  value={inputs.propertyTax}
                  onChange={(value) => updateInput("propertyTax", value)}
                />
              </div>

              {/* Home Insurance */}
              <div className="flex items-center gap-2">
                <Label htmlFor="home-insurance" className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap flex items-center gap-1 min-w-[80px] sm:min-w-[100px]">
                  <Shield className="h-3 w-3 sm:h-4 sm:w-4" aria-hidden="true" />
                  <span className="hidden sm:inline">Insurance</span>
                  <span className="sm:hidden">Ins.</span>
                </Label>
                <CurrencyInput
                  id="home-insurance"
                  value={inputs.homeInsurance}
                  onChange={(value) => updateInput("homeInsurance", value)}
                />
              </div>

              {/* HOA Fees */}
              <div className="flex items-center gap-2">
                <Label htmlFor="hoa-fees" className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap flex items-center gap-1 min-w-[80px] sm:min-w-[100px]">
                  <Users className="h-3 w-3 sm:h-4 sm:w-4" aria-hidden="true" />
                  HOA
                </Label>
                <CurrencyInput
                  id="hoa-fees"
                  value={inputs.hoaFees}
                  onChange={(value) => updateInput("hoaFees", value)}
                />
              </div>
            </div>
          </section>
        </div>

        {/* Results Section */}
        <aside className="space-y-6" aria-label="Calculation Results">
          <div className="result-highlight">
            <p className="text-primary-foreground/80 text-sm font-medium uppercase tracking-wide">
              Monthly Payment
            </p>
            <p className="text-4xl lg:text-5xl font-display font-bold mt-2 number-pop">
              {formatCurrency(calculations.totalMonthly)}
            </p>
            <p className="text-primary-foreground/70 text-xs mt-1">No PMI Required!</p>
          </div>

          <div className="calculator-card p-6 space-y-4">
            <h3 className="font-semibold text-lg">Payment Summary</h3>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Base Loan Amount</span>
                <span className="font-medium">{formatCurrency(calculations.baseLoanAmount)}</span>
              </div>
              {calculations.fundingFee > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-1">
                    VA Funding Fee ({calculations.fundingFeeRate}%)
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>The VA funding fee helps sustain the VA loan program. It varies based on service type, down payment, and prior VA loan use.</p>
                      </TooltipContent>
                    </Tooltip>
                  </span>
                  <span className="font-medium">{formatCurrency(calculations.fundingFee)}</span>
                </div>
              )}
              {inputs.hasDisability && (
                <div className="flex justify-between text-sm">
                  <span className="text-accent font-medium">Funding Fee Exempt</span>
                  <span className="text-accent font-medium">$0</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-medium">
                <span className="text-foreground">Total Loan Amount</span>
                <span>{formatCurrency(calculations.totalLoanAmount)}</span>
              </div>
              <hr className="border-border" />
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Principal & Interest</span>
                <span className="font-medium">{formatCurrency(calculations.monthlyPI)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Property Tax</span>
                <span className="font-medium">{formatCurrency(calculations.monthlyTax)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Home Insurance</span>
                <span className="font-medium">{formatCurrency(calculations.monthlyInsurance)}</span>
              </div>
              {calculations.monthlyHOA > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">HOA Fees</span>
                  <span className="font-medium">{formatCurrency(calculations.monthlyHOA)}</span>
                </div>
              )}
              <hr className="border-border" />
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Interest ({inputs.loanTerm} years)</span>
                <span className="font-medium">{formatCurrency(calculations.totalInterest)}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Charts and Schedule Tabs */}
      <section className="mt-8" aria-labelledby="payment-analysis-heading">
        <Tabs defaultValue="breakdown" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="breakdown">Payment Breakdown</TabsTrigger>
            <TabsTrigger value="chart">Amortization Chart</TabsTrigger>
            <TabsTrigger value="schedule">Amortization Schedule</TabsTrigger>
          </TabsList>

          <TabsContent value="breakdown">
            <PaymentBreakdown
              principal={firstMonthPrincipal}
              interest={firstMonthInterest}
              tax={calculations.monthlyTax}
              insurance={calculations.monthlyInsurance}
              pmi={0}
              hoa={calculations.monthlyHOA}
            />
          </TabsContent>

          <TabsContent value="chart">
            <AmortizationChart 
              data={amortizationData}
              monthlyTax={calculations.monthlyTax}
              monthlyInsurance={calculations.monthlyInsurance}
              monthlyPMI={0}
              monthlyHOA={calculations.monthlyHOA}
            />
          </TabsContent>

          <TabsContent value="schedule">
            <AmortizationSchedule data={amortizationData} />
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
};

export default VACalculator;
