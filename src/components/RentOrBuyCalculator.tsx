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
import { HelpCircle, Home, Building2, TrendingUp, DollarSign, PiggyBank, Scale } from "lucide-react";
import { rentVsBuy, rentVsBuyByYear } from "@/lib/rentVsBuy";
import { crossingYear } from "@/lib/amortization";
import VizCard, { StatRow } from "./viz/VizCard";
import CompareTable from "./viz/CompareTable";
import StackedBar from "./viz/StackedBar";
import { BreakEvenChart } from "./viz/LazyCharts";
import { SERIES } from "./viz/theme";
import CurrencyInput from "./CurrencyInput";
import PercentInput from "./PercentInput";
import { formatCurrency } from "@/lib/formatters";
import StickyResult from "./StickyResult";

const RentOrBuyCalculator = () => {
  // Rent Info
  const [monthlyRent, setMonthlyRent] = useState(2000);
  const [annualRentIncrease, setAnnualRentIncrease] = useState(3);

  // Property Info
  const [homePrice, setHomePrice] = useState(400000);
  const [annualAppreciation, setAnnualAppreciation] = useState(3);
  const [yearsBeforeSell, setYearsBeforeSell] = useState("7");
  const [sellingCost, setSellingCost] = useState(6);
  const [buyingCost, setBuyingCost] = useState(3);
  const [investmentReturn, setInvestmentReturn] = useState(4);

  // Loan Information
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [interestRate, setInterestRate] = useState(6.5);
  const [loanTerm, setLoanTerm] = useState("30");
  const [annualPMIPercent, setAnnualPMIPercent] = useState(0.5);

  // Ownership Costs
  const [annualPropertyTaxRate, setAnnualPropertyTaxRate] = useState(1.25);
  const [annualInsuranceRate, setAnnualInsuranceRate] = useState(0.5);
  const [annualMaintenance, setAnnualMaintenance] = useState(2000);

  // Tax Info
  const [incomeTaxRate, setIncomeTaxRate] = useState(0);

  const { results, byYear } = useMemo(() => {
    const base = {
      monthlyRent,
      annualRentIncrease,
      homePrice,
      annualAppreciation,
      sellingCost,
      buyingCost,
      investmentReturn,
      downPaymentPercent,
      interestRate,
      termYears: parseInt(loanTerm),
      annualPMIPercent,
      annualPropertyTaxRate,
      annualInsuranceRate,
      annualMaintenance,
      incomeTaxRate,
    };
    const years = parseInt(yearsBeforeSell);
    return {
      results: rentVsBuy({ ...base, years }),
      // Every holding period up to 30 years (or your own, if longer), for the break-even chart.
      byYear: rentVsBuyByYear(base, Math.max(30, years)),
    };
  }, [
    monthlyRent, annualRentIncrease, homePrice, annualAppreciation,
    yearsBeforeSell, sellingCost, downPaymentPercent, interestRate,
    loanTerm, annualPMIPercent, annualPropertyTaxRate, annualInsuranceRate,
    annualMaintenance, incomeTaxRate, buyingCost, investmentReturn,
  ]);
  const breakEvenYear = crossingYear(byYear.map((y) => ({ year: y.year, value: y.advantage })));

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-5 gap-6">
        {/* Left Column - Inputs */}
        <div className="space-y-6 lg:col-span-3">
          {/* Rent Information */}
          <Card className="calculator-card">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Building2 className="h-5 w-5 text-accent" />
                Rent Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="rent-or-buy-monthly-rent" className="text-sm font-medium text-foreground">
                    Monthly Rent
                  </Label>
                  <CurrencyInput id="rent-or-buy-monthly-rent" value={monthlyRent} onChange={setMonthlyRent} />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="rent-or-buy-rent-increase" className="text-sm font-medium text-foreground flex items-center gap-1">
                    Rent Increase
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-3 w-3 sm:h-4 sm:w-4 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>Expected average annual rent increase percentage.</p>
                      </TooltipContent>
                    </Tooltip>
                  </Label>
                  <div className="flex gap-1 sm:gap-2 flex-1">
                    <PercentInput id="rent-or-buy-rent-increase"
                      value={annualRentIncrease}
                      onChange={setAnnualRentIncrease}
                      min={0}
                      max={20}
                      decimalPlaces={1}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Property & Loan Information */}
          <Card className="calculator-card">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Home className="h-5 w-5 text-accent" />
                Property & Loan Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Property Section */}
              <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="rent-or-buy-home-price" className="text-sm font-medium text-foreground">
                    Home Price
                  </Label>
                  <CurrencyInput id="rent-or-buy-home-price" value={homePrice} onChange={setHomePrice} />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="rent-or-buy-appreciation" className="text-sm font-medium text-foreground flex items-center gap-1">
                    Appreciation
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-3 w-3 sm:h-4 sm:w-4 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>Expected annual home value appreciation rate.</p>
                      </TooltipContent>
                    </Tooltip>
                  </Label>
                  <div className="flex gap-1 sm:gap-2 flex-1">
                    <PercentInput id="rent-or-buy-appreciation"
                      value={annualAppreciation}
                      onChange={setAnnualAppreciation}
                      min={-10}
                      max={20}
                      decimalPlaces={1}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="rent-or-buy-years-to-sell" className="text-sm font-medium text-foreground">
                    Years to Sell
                  </Label>
                  <Select value={yearsBeforeSell} onValueChange={setYearsBeforeSell}>
                    <SelectTrigger id="rent-or-buy-years-to-sell" className="h-8 sm:h-10 text-sm flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 25, 30].map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year} {year === 1 ? "year" : "years"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="rent-or-buy-selling-cost" className="text-sm font-medium text-foreground flex items-center gap-1">
                    Selling Cost
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-3 w-3 sm:h-4 sm:w-4 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>Typical selling costs include agent commission (5-6%) and closing costs.</p>
                      </TooltipContent>
                    </Tooltip>
                  </Label>
                  <div className="flex gap-1 sm:gap-2 flex-1">
                    <PercentInput id="rent-or-buy-selling-cost"
                      value={sellingCost}
                      onChange={setSellingCost}
                      min={0}
                      max={15}
                      decimalPlaces={1}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="rent-or-buy-buying-cost" className="text-sm font-medium text-foreground flex items-center gap-1">
                    Buying Cost
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-3 w-3 sm:h-4 sm:w-4 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>Closing costs when you buy, usually 2% to 5% of the price.</p>
                      </TooltipContent>
                    </Tooltip>
                  </Label>
                  <div className="flex gap-1 sm:gap-2 flex-1">
                    <PercentInput id="rent-or-buy-buying-cost"
                      value={buyingCost}
                      onChange={setBuyingCost}
                      min={0}
                      max={10}
                      decimalPlaces={1}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="rent-or-buy-investment-return" className="text-sm font-medium text-foreground flex items-center gap-1">
                    Investment Return
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-3 w-3 sm:h-4 sm:w-4 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>What your down payment and closing costs could earn if you rented and invested them instead.</p>
                      </TooltipContent>
                    </Tooltip>
                  </Label>
                  <div className="flex gap-1 sm:gap-2 flex-1">
                    <PercentInput id="rent-or-buy-investment-return"
                      value={investmentReturn}
                      onChange={setInvestmentReturn}
                      min={0}
                      max={15}
                      decimalPlaces={1}
                    />
                  </div>
                </div>
              </div>

              {/* Separator */}
              <div className="border-t border-border" />

              {/* Loan Section */}
              <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="rent-or-buy-down-payment" className="text-sm font-medium text-foreground">
                    Down Payment
                  </Label>
                  <div className="flex gap-1 sm:gap-2 flex-1">
                    <PercentInput id="rent-or-buy-down-payment"
                      value={downPaymentPercent}
                      onChange={setDownPaymentPercent}
                      min={0}
                      max={100}
                      decimalPlaces={1}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="rent-or-buy-interest-rate" className="text-sm font-medium text-foreground">
                    Interest Rate
                  </Label>
                  <div className="flex gap-1 sm:gap-2 flex-1">
                    <PercentInput id="rent-or-buy-interest-rate"
                      value={interestRate}
                      onChange={setInterestRate}
                      min={0}
                      max={20}
                      decimalPlaces={3}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="rent-or-buy-loan-term" className="text-sm font-medium text-foreground">
                    Loan Term
                  </Label>
                  <Select value={loanTerm} onValueChange={setLoanTerm}>
                    <SelectTrigger id="rent-or-buy-loan-term" className="h-8 sm:h-10 text-sm flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 years</SelectItem>
                      <SelectItem value="20">20 years</SelectItem>
                      <SelectItem value="15">15 years</SelectItem>
                      <SelectItem value="10">10 years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {downPaymentPercent < 20 && (
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="rent-or-buy-pmi-rate" className="text-sm font-medium text-foreground flex items-center gap-1">
                      PMI Rate
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="h-3 w-3 sm:h-4 sm:w-4 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p>Private Mortgage Insurance is required when down payment is less than 20%.</p>
                        </TooltipContent>
                      </Tooltip>
                    </Label>
                    <div className="flex gap-1 sm:gap-2 flex-1">
                      <PercentInput id="rent-or-buy-pmi-rate"
                        value={annualPMIPercent}
                        onChange={setAnnualPMIPercent}
                        min={0}
                        max={3}
                        decimalPlaces={2}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-border">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Down Payment Amount</span>
                  <span className="font-semibold">{formatCurrency(homePrice * downPaymentPercent / 100)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ownership Costs & Tax Information */}
          <Card className="calculator-card">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <PiggyBank className="h-5 w-5 text-accent" />
                Ownership Costs & Taxes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Ownership Costs Section */}
              <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="rent-or-buy-property-tax" className="text-sm font-medium text-foreground">
                    Property Tax
                  </Label>
                  <div className="flex gap-1 sm:gap-2 flex-1">
                    <PercentInput id="rent-or-buy-property-tax"
                      value={annualPropertyTaxRate}
                      onChange={setAnnualPropertyTaxRate}
                      min={0}
                      max={5}
                      decimalPlaces={2}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="rent-or-buy-insurance" className="text-sm font-medium text-foreground">
                    Insurance
                  </Label>
                  <div className="flex gap-1 sm:gap-2 flex-1">
                    <PercentInput id="rent-or-buy-insurance"
                      value={annualInsuranceRate}
                      onChange={setAnnualInsuranceRate}
                      min={0}
                      max={3}
                      decimalPlaces={2}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="rent-or-buy-maintenance" className="text-sm font-medium text-foreground">
                    Maintenance
                  </Label>
                  <CurrencyInput id="rent-or-buy-maintenance" value={annualMaintenance} onChange={setAnnualMaintenance} />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="rent-or-buy-tax-rate" className="text-sm font-medium text-foreground flex items-center gap-1">
                    Tax rate (if itemizing)
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-3 w-3 sm:h-4 sm:w-4 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>Enter your marginal tax rate if you itemize deductions. Enter 0 if you take the standard deduction.</p>
                      </TooltipContent>
                    </Tooltip>
                  </Label>
                  <div className="flex gap-1 sm:gap-2 flex-1">
                    <PercentInput id="rent-or-buy-tax-rate"
                      value={incomeTaxRate}
                      onChange={setIncomeTaxRate}
                      min={0}
                      max={50}
                      decimalPlaces={0}
                    />
                  </div>
                </div>
              </div>

              <div className="p-3 bg-secondary/50 rounded-lg">
                <p className="text-xs text-muted-foreground">
                  <strong>Note:</strong> Most taxpayers use standard deductions. If you're not itemizing, enter 0% for tax rate.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Break-even over time */}
          <VizCard
            title="How long you stay decides it"
            description="Buying's advantage over renting, depending on when you sell. Buying has big up-front costs, so it usually starts behind and catches up."
            footnote="Each point reruns the whole comparison as if you sold in that year, with all your other inputs unchanged."
          >
            <StatRow
              className="mb-5"
              stats={[
                {
                  label: "Buying breaks even",
                  value: breakEvenYear !== null ? `After ${breakEvenYear.toFixed(1).replace(/\.0$/, "")} yrs` : byYear[0].advantage > 0 ? "Right away" : "Not within 30 yrs",
                },
                {
                  label: `If you sell in year ${yearsBeforeSell}`,
                  value: `${results.shouldBuy ? "Buying" : "Renting"} wins`,
                  hint: `by ${formatCurrency(results.costDifference)}`,
                  tone: results.shouldBuy ? "positive" : "negative",
                },
                {
                  label: "After 30 years",
                  value: formatCurrency(Math.abs(byYear[29].advantage)),
                  hint: byYear[29].advantage >= 0 ? "in buying's favor" : "in renting's favor",
                },
              ]}
            />
            <BreakEvenChart
              points={byYear.map((y) => ({ year: y.year, value: y.advantage }))}
              aheadLabel="Buying is ahead"
              behindLabel="Renting is ahead"
              breakEvenYear={breakEvenYear}
              markerYear={parseInt(yearsBeforeSell)}
              markerLabel="You sell"
              yearTitle={(y) => `If you sell after ${y} year${y === 1 ? "" : "s"}`}
            />
          </VizCard>

          {/* Where the money goes */}
          <VizCard
            title={`What each choice costs over ${yearsBeforeSell} years`}
            description="Money you pay out, minus money that comes back when you sell. Lower net cost wins."
          >
            <CompareTable
              columns={[{ label: "Rent" }, { label: "Buy" }]}
              recommended={results.shouldBuy ? 1 : 0}
              recommendedLabel="Costs less"
              groups={[
                {
                  title: "Money out",
                  rows: [
                    { label: "Rent", values: [results.totalRentPaid, null], note: `Rising ${annualRentIncrease}% a year` },
                    { label: "Mortgage, tax, insurance, upkeep", values: [null, results.totalOwnershipPayments], note: results.totalPMIPaid > 0 ? `Includes ${formatCurrency(results.totalPMIPaid)} of PMI` : undefined },
                    { label: "Down payment", values: [null, results.downPayment] },
                    { label: "Closing costs", values: [null, results.buyingClosingCosts] },
                    { label: "Investment return given up", values: [null, results.opportunityCost], note: `Down payment and closing costs at ${investmentReturn}% a year` },
                  ],
                },
                {
                  title: "Money back",
                  rows: [
                    ...(results.totalTaxSavings > 0
                      ? [{ label: "Tax savings on interest", values: [null, -results.totalTaxSavings] as (number | null)[] }]
                      : []),
                    {
                      label: "Cash from selling",
                      values: [null, -results.saleCashBack],
                      note: `${formatCurrency(results.futureHomeValue)} sale, minus ${sellingCost}% selling costs and the ${formatCurrency(results.loanBalance)} loan payoff`,
                    },
                  ],
                },
                {
                  rows: [{ label: "Net cost", values: [results.totalRentCost, results.totalBuyCost], better: "lower", emphasis: true }],
                },
              ]}
            />
          </VizCard>
        </div>

        {/* Right Column - Results */}
        <div className="space-y-6 lg:col-span-2">
          <div className="result-highlight">
            <StickyResult targetId="calc-result" label={"Better choice"} value={`${results.shouldBuy ? "Buy" : "Rent"} · saves ${formatCurrency(results.costDifference)}`} />
            <div id="calc-result" className="text-center space-y-3">
              <Scale className="h-10 w-10 mx-auto text-primary-foreground/80" aria-hidden="true" />
              <p className="text-primary-foreground/80 text-sm font-medium">
                If you sell in {yearsBeforeSell} years, it's better to
              </p>
              <p className="text-3xl md:text-4xl font-display font-bold">{results.shouldBuy ? "Buy" : "Rent"}</p>
              <p className="text-primary-foreground/80 text-sm">
                It costs {formatCurrency(results.costDifference)} less over {yearsBeforeSell} years
              </p>
            </div>
          </div>

          <VizCard title="Monthly cost, first year" description="What leaves your account each month at the start.">
            <div className="space-y-5">
              <StackedBar
                title="Rent"
                total={formatCurrency(monthlyRent)}
                max={Math.max(monthlyRent, results.monthlyOwnershipTotal)}
                segments={[{ label: "Rent", value: monthlyRent, color: SERIES.baseline }]}
              />
              <StackedBar
                title="Own"
                total={formatCurrency(results.monthlyOwnershipTotal)}
                max={Math.max(monthlyRent, results.monthlyOwnershipTotal)}
                legend
                segments={[
                  { label: "Principal & interest", value: results.monthlyPI, color: SERIES.principal, note: "Part of this builds equity" },
                  { label: "Property tax", value: results.monthlyPropertyTax, color: SERIES.tax },
                  { label: "Home insurance", value: results.monthlyInsurance, color: SERIES.insurance },
                  { label: "Maintenance", value: results.monthlyMaintenance, color: SERIES.maintenance },
                  { label: "PMI", value: results.monthlyPMI, color: SERIES.pmi },
                ]}
              />
            </div>
          </VizCard>
        </div>
      </div>
    </div>
  );

};

export default RentOrBuyCalculator;
