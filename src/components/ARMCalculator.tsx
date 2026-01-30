import { useState, useMemo } from "react";
import { Home, Percent, Calendar, DollarSign, Shield, Building, Users, Info, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import PaymentBreakdown from "./PaymentBreakdown";
import AmortizationSchedule from "./AmortizationSchedule";
import AmortizationChart from "./AmortizationChart";
import CurrencyInput from "./CurrencyInput";
import PercentInput from "./PercentInput";
import { formatCurrency } from "@/lib/formatters";

interface ARMInputs {
  homePrice: number;
  downPayment: number;
  downPaymentPercent: number;
  loanTerm: number;
  initialRate: number;
  propertyTax: number;
  homeInsurance: number;
  hoaFees: number;
  closingCosts: number;
  pmiRate: number;
  startDate: string;
  // ARM-specific inputs
  yearsBeforeFirstAdjustment: number;
  expectedFirstAdjustment: number;
  monthsBetweenAdjustments: number;
  expectedSubsequentAdjustment: number;
  lifetimeCap: number;
}

const ARMCalculator = () => {
  const [inputs, setInputs] = useState<ARMInputs>({
    homePrice: 400000,
    downPayment: 80000,
    downPaymentPercent: 20,
    loanTerm: 30,
    initialRate: 6.5,
    propertyTax: 4800,
    homeInsurance: 1500,
    hoaFees: 0,
    closingCosts: 0,
    pmiRate: 0.5,
    startDate: new Date().toISOString().slice(0, 7),
    // ARM defaults (5/1 ARM common structure)
    yearsBeforeFirstAdjustment: 5,
    expectedFirstAdjustment: 1.0,
    monthsBetweenAdjustments: 12,
    expectedSubsequentAdjustment: 0.25,
    lifetimeCap: 5.0,
  });

  const updateInput = (field: keyof ARMInputs, value: number | string) => {
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
    const baseLoanAmount = inputs.homePrice - inputs.downPayment + inputs.closingCosts;
    const ltvPercent = ((inputs.homePrice - inputs.downPayment) / inputs.homePrice) * 100;
    const requiresPMI = ltvPercent > 80;
    
    const monthlyRate = inputs.initialRate / 100 / 12;
    const numPayments = inputs.loanTerm * 12;

    // Calculate initial monthly P&I
    const initialMonthlyPI =
      monthlyRate > 0
        ? (baseLoanAmount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
          (Math.pow(1 + monthlyRate, numPayments) - 1)
        : baseLoanAmount / numPayments;

    // Calculate maximum rate based on lifetime cap
    const maxRate = Math.min(inputs.initialRate + inputs.lifetimeCap, 18); // Most ARMs cap at 18%
    const maxMonthlyRate = maxRate / 100 / 12;

    // Calculate the remaining balance after the fixed period
    const fixedPeriodPayments = inputs.yearsBeforeFirstAdjustment * 12;
    let remainingBalance = baseLoanAmount;
    for (let i = 0; i < fixedPeriodPayments; i++) {
      const interestPayment = remainingBalance * monthlyRate;
      const principalPayment = initialMonthlyPI - interestPayment;
      remainingBalance -= principalPayment;
    }

    // Calculate max P&I based on remaining balance and remaining term at max rate
    const remainingPayments = numPayments - fixedPeriodPayments;
    const maxMonthlyPI =
      maxMonthlyRate > 0 && remainingPayments > 0
        ? (remainingBalance * maxMonthlyRate * Math.pow(1 + maxMonthlyRate, remainingPayments)) /
          (Math.pow(1 + maxMonthlyRate, remainingPayments) - 1)
        : remainingBalance / remainingPayments;

    const monthlyTax = inputs.propertyTax / 12;
    const monthlyInsurance = inputs.homeInsurance / 12;
    const monthlyHOA = inputs.hoaFees;
    const monthlyPMI = requiresPMI ? (baseLoanAmount * (inputs.pmiRate / 100)) / 12 : 0;
    const monthlyOtherCosts = monthlyTax + monthlyInsurance + monthlyHOA + monthlyPMI;

    const initialTotalMonthly = initialMonthlyPI + monthlyOtherCosts;
    const maxTotalMonthly = maxMonthlyPI + monthlyOtherCosts;

    // Estimate total interest (simplified - using average rate scenario)
    const avgRate = (inputs.initialRate + maxRate) / 2;
    const avgMonthlyRate = avgRate / 100 / 12;
    const avgMonthlyPI =
      avgMonthlyRate > 0
        ? (baseLoanAmount * avgMonthlyRate * Math.pow(1 + avgMonthlyRate, numPayments)) /
          (Math.pow(1 + avgMonthlyRate, numPayments) - 1)
        : baseLoanAmount / numPayments;
    const estimatedTotalInterest = avgMonthlyPI * numPayments - baseLoanAmount;
    const totalTaxesInsurance = (monthlyTax + monthlyInsurance + monthlyHOA) * numPayments;

    return {
      baseLoanAmount,
      ltvPercent,
      requiresPMI,
      initialRate: inputs.initialRate,
      maxRate,
      initialMonthlyPI,
      maxMonthlyPI,
      monthlyTax,
      monthlyInsurance,
      monthlyHOA,
      monthlyPMI,
      monthlyOtherCosts,
      initialTotalMonthly,
      maxTotalMonthly,
      estimatedTotalInterest,
      totalTaxesInsurance,
      totalAllPayments: baseLoanAmount + estimatedTotalInterest + totalTaxesInsurance,
      avgMonthlyTotal: (baseLoanAmount + estimatedTotalInterest + totalTaxesInsurance) / numPayments,
      numPayments,
      remainingBalance,
    };
  }, [inputs]);

  // Generate amortization data using initial rate for simplicity
  const amortizationData = useMemo(() => {
    const data = [];
    let balance = calculations.baseLoanAmount;
    const monthlyRate = inputs.initialRate / 100 / 12;
    const startDate = new Date(inputs.startDate + "-01");

    for (let i = 1; i <= calculations.numPayments && balance > 0; i++) {
      const interestPayment = balance * monthlyRate;
      const principalPayment = Math.min(calculations.initialMonthlyPI - interestPayment, balance);
      balance = Math.max(0, balance - principalPayment);

      const paymentDate = new Date(startDate);
      paymentDate.setMonth(paymentDate.getMonth() + i);

      data.push({
        month: i,
        date: paymentDate,
        payment: calculations.initialMonthlyPI,
        principal: principalPayment,
        interest: interestPayment,
        balance,
      });
    }

    return data;
  }, [calculations, inputs.initialRate, inputs.startDate]);

  const armTypeLabel = `${inputs.yearsBeforeFirstAdjustment}/1 ARM`;

  return (
    <div className="fade-in">
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Input Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Loan Details */}
          <section className="calculator-card p-3 sm:p-6" aria-labelledby="arm-loan-details-heading">
            <h2 id="arm-loan-details-heading" className="text-base sm:text-xl font-display font-semibold mb-3 sm:mb-6 flex items-center gap-2">
              <Home className="h-4 w-4 sm:h-5 sm:w-5 text-accent" aria-hidden="true" />
              Home Loan Information
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
                  <span className="hidden lg:inline">Down Payment</span>
                  <span className="lg:hidden">Down</span>
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

              {/* Initial APR */}
              <div className="flex items-center gap-2">
                <Label htmlFor="initial-rate" className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap flex items-center gap-1 min-w-[80px] sm:min-w-[100px]">
                  <Percent className="h-3 w-3 sm:h-4 sm:w-4" aria-hidden="true" />
                  <span className="hidden sm:inline">Initial APR</span>
                  <span className="sm:hidden">APR</span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>The introductory rate charged during the initial fixed-rate period of the ARM.</p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <div className="flex gap-1 sm:gap-2 flex-1">
                  <Input
                    id="initial-rate"
                    type="text"
                    inputMode="decimal"
                    value={inputs.initialRate}
                    onChange={(e) => updateInput("initialRate", parseFloat(e.target.value) || 0)}
                    className="h-8 sm:h-10 text-sm font-medium flex-1"
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
                  <SelectTrigger id="loan-term" className="h-8 sm:h-10 text-sm font-medium flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 years</SelectItem>
                    <SelectItem value="30">30 years</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Closing Costs */}
              <div className="flex items-center gap-2">
                <Label htmlFor="closing-costs" className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap flex items-center gap-1 min-w-[80px] sm:min-w-[100px]">
                  <DollarSign className="h-3 w-3 sm:h-4 sm:w-4" aria-hidden="true" />
                  <span className="hidden sm:inline">Closing Costs</span>
                  <span className="sm:hidden">Closing</span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>Enter closing costs if they are rolled into the loan amount.</p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <CurrencyInput
                  id="closing-costs"
                  value={inputs.closingCosts}
                  onChange={(value) => updateInput("closingCosts", value)}
                />
              </div>

              {/* PMI Rate */}
              <div className="flex items-center gap-2">
                <Label htmlFor="pmi-rate" className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap flex items-center gap-1 min-w-[80px] sm:min-w-[100px]">
                  <Shield className="h-3 w-3 sm:h-4 sm:w-4" aria-hidden="true" />
                  PMI
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>Private Mortgage Insurance is required when down payment is less than 20%.</p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <div className="flex gap-1 sm:gap-2 flex-1">
                  <Input
                    id="pmi-rate"
                    type="text"
                    inputMode="decimal"
                    value={inputs.pmiRate}
                    onChange={(e) => updateInput("pmiRate", parseFloat(e.target.value) || 0)}
                    className="h-8 sm:h-10 text-sm font-medium flex-1"
                  />
                  <span className="flex items-center text-muted-foreground text-xs sm:text-sm">%</span>
                </div>
              </div>
            </div>
          </section>

          {/* Rate Adjustments */}
          <section className="calculator-card p-3 sm:p-6" aria-labelledby="rate-adjustments-heading">
            <h2 id="rate-adjustments-heading" className="text-base sm:text-xl font-display font-semibold mb-3 sm:mb-6 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-accent" aria-hidden="true" />
              Rate Adjustments
            </h2>

            <div className="grid gap-2 sm:gap-4 grid-cols-1 sm:grid-cols-2">
              {/* Years Before First Adjustment */}
              <div className="flex items-center gap-2">
                <Label htmlFor="years-first-adj" className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap flex items-center gap-1 min-w-[80px] sm:min-w-[100px]">
                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4" aria-hidden="true" />
                  <span className="hidden sm:inline">Fixed Period</span>
                  <span className="sm:hidden">Fixed</span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>Years before the first rate adjustment. For a 5/1 ARM, this is 5 years.</p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <Select
                  value={inputs.yearsBeforeFirstAdjustment.toString()}
                  onValueChange={(v) => updateInput("yearsBeforeFirstAdjustment", parseInt(v))}
                >
                  <SelectTrigger id="years-first-adj" className="h-8 sm:h-10 text-sm font-medium flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 year (1/1 ARM)</SelectItem>
                    <SelectItem value="3">3 years (3/1 ARM)</SelectItem>
                    <SelectItem value="5">5 years (5/1 ARM)</SelectItem>
                    <SelectItem value="7">7 years (7/1 ARM)</SelectItem>
                    <SelectItem value="10">10 years (10/1 ARM)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Expected First Adjustment */}
              <div className="flex items-center gap-2">
                <Label htmlFor="first-adj" className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap flex items-center gap-1 min-w-[80px] sm:min-w-[100px]">
                  <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" aria-hidden="true" />
                  <span className="hidden sm:inline">1st Adjustment</span>
                  <span className="sm:hidden">1st Adj</span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>Expected rate change at the first adjustment. Often larger than subsequent adjustments.</p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <div className="flex gap-1 sm:gap-2 flex-1">
                  <Input
                    id="first-adj"
                    type="text"
                    inputMode="decimal"
                    value={inputs.expectedFirstAdjustment}
                    onChange={(e) => updateInput("expectedFirstAdjustment", parseFloat(e.target.value) || 0)}
                    className="h-8 sm:h-10 text-sm font-medium flex-1"
                  />
                  <span className="flex items-center text-muted-foreground text-xs sm:text-sm">%</span>
                </div>
              </div>

              {/* Months Between Adjustments */}
              <div className="flex items-center gap-2">
                <Label htmlFor="months-between" className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap flex items-center gap-1 min-w-[80px] sm:min-w-[100px]">
                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4" aria-hidden="true" />
                  <span className="hidden sm:inline">Adj. Frequency</span>
                  <span className="sm:hidden">Freq.</span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>Months between subsequent rate adjustments. Typically 12 months for most ARMs.</p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <Select
                  value={inputs.monthsBetweenAdjustments.toString()}
                  onValueChange={(v) => updateInput("monthsBetweenAdjustments", parseInt(v))}
                >
                  <SelectTrigger id="months-between" className="h-8 sm:h-10 text-sm font-medium flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6">6 months</SelectItem>
                    <SelectItem value="12">12 months</SelectItem>
                    <SelectItem value="24">24 months</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Expected Subsequent Adjustment */}
              <div className="flex items-center gap-2">
                <Label htmlFor="subsequent-adj" className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap flex items-center gap-1 min-w-[80px] sm:min-w-[100px]">
                  <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" aria-hidden="true" />
                  <span className="hidden sm:inline">Later Adj.</span>
                  <span className="sm:hidden">Later</span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>Expected rate change for each subsequent adjustment after the first.</p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <div className="flex gap-1 sm:gap-2 flex-1">
                  <Input
                    id="subsequent-adj"
                    type="text"
                    inputMode="decimal"
                    value={inputs.expectedSubsequentAdjustment}
                    onChange={(e) => updateInput("expectedSubsequentAdjustment", parseFloat(e.target.value) || 0)}
                    className="h-8 sm:h-10 text-sm font-medium flex-1"
                  />
                  <span className="flex items-center text-muted-foreground text-xs sm:text-sm">%</span>
                </div>
              </div>

              {/* Lifetime Cap */}
              <div className="flex items-center gap-2 sm:col-span-2">
                <Label htmlFor="lifetime-cap" className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap flex items-center gap-1 min-w-[80px] sm:min-w-[100px]">
                  <Shield className="h-3 w-3 sm:h-4 sm:w-4" aria-hidden="true" />
                  <span className="hidden sm:inline">Lifetime Cap</span>
                  <span className="sm:hidden">Cap</span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>Maximum rate increase over the life of the loan. If initial rate is 6% and cap is 5%, max rate is 11%.</p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <div className="flex gap-1 sm:gap-2 flex-1">
                  <Input
                    id="lifetime-cap"
                    type="text"
                    inputMode="decimal"
                    value={inputs.lifetimeCap}
                    onChange={(e) => updateInput("lifetimeCap", parseFloat(e.target.value) || 0)}
                    className="h-8 sm:h-10 text-sm font-medium flex-1"
                  />
                  <span className="flex items-center text-muted-foreground text-xs sm:text-sm">%</span>
                </div>
              </div>
            </div>
          </section>

          {/* Additional Costs */}
          <section className="calculator-card p-3 sm:p-6" aria-labelledby="additional-costs-heading">
            <h2 id="additional-costs-heading" className="text-base sm:text-xl font-display font-semibold mb-3 sm:mb-6 flex items-center gap-2">
              <Building className="h-4 w-4 sm:h-5 sm:w-5 text-accent" aria-hidden="true" />
              Other Costs of Ownership
            </h2>

            <div className="grid gap-2 sm:gap-4 grid-cols-1 sm:grid-cols-2">
              {/* Property Tax */}
              <div className="flex items-center gap-2">
                <Label htmlFor="property-tax" className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap flex items-center gap-1 min-w-[80px] sm:min-w-[100px]">
                  <Building className="h-3 w-3 sm:h-4 sm:w-4" aria-hidden="true" />
                  <span className="hidden sm:inline">Property Tax/yr</span>
                  <span className="sm:hidden">Tax/yr</span>
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
                  <span className="hidden sm:inline">Insurance/yr</span>
                  <span className="sm:hidden">Ins./yr</span>
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
                  HOA/mo
                </Label>
                <CurrencyInput
                  id="hoa-fees"
                  value={inputs.hoaFees}
                  onChange={(value) => updateInput("hoaFees", value)}
                />
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
          </section>
        </div>

        {/* Results Section */}
        <aside className="space-y-6" aria-label="Calculation Results">
          {/* Initial Payment */}
          <div className="result-highlight">
            <p className="text-primary-foreground/80 text-sm font-medium uppercase tracking-wide">
              Initial Monthly Payment
            </p>
            <p className="text-4xl lg:text-5xl font-display font-bold mt-2 number-pop">
              {formatCurrency(calculations.initialTotalMonthly)}
            </p>
            <p className="text-primary-foreground/70 text-sm mt-2">
              {armTypeLabel} • Initial Rate: {inputs.initialRate}%
            </p>
          </div>

          {/* Maximum Payment */}
          <div className="calculator-card p-6 border-2 border-destructive/20 bg-destructive/5">
            <h3 className="font-semibold text-lg flex items-center gap-2 text-destructive">
              <TrendingUp className="h-5 w-5" />
              Maximum Payment
            </h3>
            <p className="text-3xl font-display font-bold mt-2">
              {formatCurrency(calculations.maxTotalMonthly)}
            </p>
            <p className="text-muted-foreground text-sm mt-2">
              At max rate of {calculations.maxRate.toFixed(2)}%
            </p>
          </div>

          {/* Payment Details */}
          <div className="calculator-card p-6 space-y-4">
            <h3 className="font-semibold text-lg">Initial Payment Breakdown</h3>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Principal & Interest</span>
                <span className="font-medium">{formatCurrency(calculations.initialMonthlyPI)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Property Tax</span>
                <span className="font-medium">{formatCurrency(calculations.monthlyTax)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Home Insurance</span>
                <span className="font-medium">{formatCurrency(calculations.monthlyInsurance)}</span>
              </div>
              {calculations.monthlyPMI > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">PMI</span>
                  <span className="font-medium">{formatCurrency(calculations.monthlyPMI)}</span>
                </div>
              )}
              {calculations.monthlyHOA > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">HOA Fees</span>
                  <span className="font-medium">{formatCurrency(calculations.monthlyHOA)}</span>
                </div>
              )}
              <hr className="border-border" />
              <div className="flex justify-between text-sm font-medium">
                <span>Total Initial</span>
                <span>{formatCurrency(calculations.initialTotalMonthly)}</span>
              </div>
            </div>
          </div>

          {/* Loan Totals */}
          <div className="calculator-card p-6 space-y-4">
            <h3 className="font-semibold text-lg">Loan Totals (Estimated)</h3>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Amount Financed</span>
                <span className="font-medium">{formatCurrency(calculations.baseLoanAmount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Est. Total Interest</span>
                <span className="font-medium">{formatCurrency(calculations.estimatedTotalInterest)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Taxes & Insurance</span>
                <span className="font-medium">{formatCurrency(calculations.totalTaxesInsurance)}</span>
              </div>
              <hr className="border-border" />
              <div className="flex justify-between text-sm font-medium">
                <span>Total All Payments</span>
                <span>{formatCurrency(calculations.totalAllPayments)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Average Monthly</span>
                <span className="font-medium">{formatCurrency(calculations.avgMonthlyTotal)}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Tabs for Charts and Schedule */}
      <div className="mt-8">
        <Tabs defaultValue="breakdown" className="w-full">
          <TabsList className="w-full overflow-x-auto flex justify-start sm:justify-center mb-4">
            <TabsTrigger value="breakdown" className="text-xs sm:text-sm whitespace-nowrap">
              <span className="hidden sm:inline">Payment Breakdown</span>
              <span className="sm:hidden">Breakdown</span>
            </TabsTrigger>
            <TabsTrigger value="chart" className="text-xs sm:text-sm whitespace-nowrap">
              <span className="hidden sm:inline">Amortization Chart</span>
              <span className="sm:hidden">Chart</span>
            </TabsTrigger>
            <TabsTrigger value="schedule" className="text-xs sm:text-sm whitespace-nowrap">
              <span className="hidden sm:inline">Amortization Schedule</span>
              <span className="sm:hidden">Schedule</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="breakdown" className="mt-4">
            <div className="calculator-card p-4 sm:p-6">
              <PaymentBreakdown
                principal={calculations.initialMonthlyPI * 0.3}
                interest={calculations.initialMonthlyPI * 0.7}
                tax={calculations.monthlyTax}
                insurance={calculations.monthlyInsurance}
                pmi={calculations.monthlyPMI}
                hoa={calculations.monthlyHOA}
              />
            </div>
          </TabsContent>

          <TabsContent value="chart" className="mt-4">
            <div className="calculator-card p-4 sm:p-6">
              <AmortizationChart
                data={amortizationData}
                monthlyTax={calculations.monthlyTax}
                monthlyInsurance={calculations.monthlyInsurance}
                monthlyPMI={calculations.monthlyPMI}
                monthlyHOA={calculations.monthlyHOA}
              />
            </div>
          </TabsContent>

          <TabsContent value="schedule" className="mt-4">
            <div className="calculator-card p-4 sm:p-6">
              <AmortizationSchedule data={amortizationData} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ARMCalculator;
