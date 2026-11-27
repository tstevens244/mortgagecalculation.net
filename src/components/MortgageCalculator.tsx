import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PaymentBreakdown from "./PaymentBreakdown";
import AmortizationSchedule from "./AmortizationSchedule";
import AmortizationChart from "./AmortizationChart";
import CurrencyInput from "./CurrencyInput";
import PercentInput from "./PercentInput";
import StickyResult from "./StickyResult";
import PaymentAnswer from "./PaymentAnswer";
import MarketRate from "./calc/MarketRate";
import LoanTypeSwitch from "./calc/LoanTypeSwitch";
import SavedScenarios from "./calc/SavedScenarios";
import ClosingCostTable from "./calc/ClosingCostTable";
import VizCard from "./viz/VizCard";
import { InputCard, FieldGrid, Field, TermChoice, MoreOptions, summarize } from "./calc/Form";
import { formatCurrency } from "@/lib/formatters";
import { monthlyPayment, monthsUntilBalance } from "@/lib/mortgageMath";
import { averageRate } from "@/lib/marketRates";
import { CREDIT_TIERS, creditTier, pmiRate, tierLabel } from "@/lib/pmi";
import { quickClosingCosts } from "@/lib/closingCosts";
import { readNumberParams, replaceUrl, urlWith } from "@/lib/shareUrl";
import { localInsurance, localPrice, localTax, type LocalCosts } from "@/lib/localCosts";
import { useLocalCosts } from "@/lib/useLocalCosts";
import { LocalFigure, LocalPrice, INSURANCE_SOURCE, TAX_SOURCE, insuranceDetail, taxDetail } from "./calc/LocalValue";

const URL_KEYS = ["price", "down", "rate", "term", "tax", "ins", "pmi", "hoa", "credit", "extra"] as const;
type Params = Partial<Record<(typeof URL_KEYS)[number], number>>;

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const TERMS = [10, 15, 20, 30];
const DEFAULT_CREDIT = 740;

interface MortgageInputs {
  homePrice: number;
  downPayment: number;
  downPaymentPercent: number;
  loanTerm: number;
  interestRate: number;
  propertyTax: number;
  homeInsurance: number;
  pmi: number;
  hoaFees: number;
  startDate: string;
  /** Property tax as % of price a year. While set, the tax follows the home price; typing a tax amount clears it. */
  taxRate: number | null;
  /** Credit score tier (its lower bound), which sets the PMI estimate. */
  credit: number;
  /** Extra principal paid every month. */
  extraMonthly: number;
}

export interface TaxArea {
  /** Shown in the picker, e.g. "Travis County". */
  label: string;
  /** Effective property tax rate, % of home value a year. */
  rate: number;
}

interface MortgageCalculatorProps {
  /** Starting values, e.g. a state's median home value, tax rate and insurance. */
  initial?: { homePrice: number; propertyTaxRate: number; homeInsurance: number };
  /** Areas (such as counties) the visitor can pick to set the property tax rate. The first is the default. */
  taxAreas?: TaxArea[];
  /** Label for the area picker, e.g. "County". */
  taxAreaLabel?: string;
}

/** Annual PMI estimate for a conventional loan from the loan-to-value and credit tier. */
const estimatePmi = (price: number, down: number, credit: number) => {
  const loan = Math.max(0, price - down);
  return price > 0 ? (loan * pmiRate((loan / price) * 100, credit)) / 100 : 0;
};

/** The inputs as URL parameters (shared links and saved scenarios). */
const toScenario = (inputs: MortgageInputs): Record<string, number> => ({
  price: inputs.homePrice,
  down: Math.round(inputs.downPayment),
  rate: inputs.interestRate,
  term: inputs.loanTerm,
  tax: inputs.propertyTax,
  ins: inputs.homeInsurance,
  pmi: Math.round(inputs.pmi),
  hoa: inputs.hoaFees,
  credit: inputs.credit,
  ...(inputs.extraMonthly > 0 ? { extra: inputs.extraMonthly } : {}),
});

const fmtMonth = (d: Date) => d.toLocaleDateString("en-US", { month: "short", year: "numeric" });

const MortgageCalculator = ({ initial, taxAreas, taxAreaLabel = "Area" }: MortgageCalculatorProps = {}) => {
  const startPrice = initial?.homePrice ?? 300000;
  const [areaIndex, setAreaIndex] = useState(0);

  /** Inputs from URL-style parameters (a shared link or a saved scenario), with defaults for anything missing. */
  const fromParams = (u: Params, startDate = new Date().toISOString().slice(0, 7)): MortgageInputs => {
    const homePrice = u.price && u.price > 0 ? u.price : startPrice;
    const downPayment = Math.min(u.down ?? homePrice * 0.2, homePrice);
    const downPaymentPercent = homePrice > 0 ? (downPayment / homePrice) * 100 : 20;
    const taxRate = u.tax !== undefined ? null : initial ? initial.propertyTaxRate : null;
    const loanTerm = u.term && TERMS.includes(u.term) ? u.term : 30;
    const credit = creditTier(u.credit ?? DEFAULT_CREDIT);
    return {
      homePrice,
      downPayment,
      downPaymentPercent,
      loanTerm,
      interestRate: u.rate !== undefined && u.rate <= 30 ? u.rate : averageRate(loanTerm),
      propertyTax: u.tax ?? (taxRate !== null ? Math.round((homePrice * taxRate) / 100) : 3600),
      taxRate,
      homeInsurance: u.ins ?? initial?.homeInsurance ?? 1200,
      pmi: u.pmi ?? estimatePmi(homePrice, downPayment, credit),
      hoaFees: u.hoa ?? 0,
      startDate,
      credit,
      extraMonthly: u.extra ?? 0,
    };
  };

  // A shared link (?price=…&down=…&rate=…) opens with that scenario.
  const [inputs, setInputs] = useState<MortgageInputs>(() => fromParams(readNumberParams(URL_KEYS)));

  // Keep the address bar in step with the inputs once someone changes them, so
  // the page can be bookmarked or shared. An untouched page keeps its clean URL.
  const touched = useRef(false);
  const scenario = toScenario(inputs);
  const scenarioKey = JSON.stringify(scenario);
  // Local figures filled in automatically don't count as a change: the URL stays clean.
  const autoKey = useRef<string | null>(null);
  const edited = useRef(false);
  useEffect(() => {
    if (!touched.current) {
      touched.current = true;
      return;
    }
    if (scenarioKey === autoKey.current) return;
    const t = window.setTimeout(() => replaceUrl(JSON.parse(scenarioKey)), 400);
    return () => window.clearTimeout(t);
  }, [scenarioKey]);

  /** Local home price, tax rate and insurance for the visitor's state. Not on state pages, which have their own. */
  const applyLocal = (c: LocalCosts, byUser: boolean) => {
    const homePrice = localPrice(c, "typical");
    const downPayment = (inputs.downPaymentPercent / 100) * homePrice;
    const taxRate = c.taxRate ?? inputs.taxRate;
    const next: MortgageInputs = {
      ...inputs,
      homePrice,
      downPayment,
      taxRate,
      propertyTax: taxRate !== null ? Math.round((homePrice * taxRate) / 100) : inputs.propertyTax,
      homeInsurance: localInsurance(c, homePrice) ?? inputs.homeInsurance,
      pmi: estimatePmi(homePrice, downPayment, inputs.credit),
    };
    autoKey.current = byUser ? null : JSON.stringify(toScenario(next));
    setInputs(next);
  };
  const { costs } = useLocalCosts(applyLocal, { keys: [...URL_KEYS], enabled: !initial, untouched: () => !edited.current });
  const local = !initial && costs.code !== null;

  const updateInput = (field: keyof MortgageInputs, value: number | string) => {
    edited.current = true;
    setInputs((prev) => {
      const updated = { ...prev, [field]: value };

      if (field === "propertyTax") {
        updated.taxRate = null;
      }
      if (field === "taxRate") {
        updated.propertyTax = Math.round((prev.homePrice * Number(value)) / 100);
      }
      if (field === "homePrice" && prev.taxRate !== null) {
        updated.propertyTax = Math.round((Number(value) * prev.taxRate) / 100);
      }

      if (field === "downPayment") {
        updated.downPaymentPercent = (Number(value) / prev.homePrice) * 100;
      } else if (field === "downPaymentPercent") {
        updated.downPayment = (Number(value) / 100) * prev.homePrice;
      } else if (field === "homePrice") {
        updated.downPayment = (prev.downPaymentPercent / 100) * Number(value);
      }

      // Re-estimate PMI from the loan-to-value and credit score when any of them
      // changes. A PMI amount the user typed is kept until then.
      if (field === "homePrice" || field === "downPayment" || field === "downPaymentPercent" || field === "credit") {
        updated.pmi = estimatePmi(updated.homePrice, updated.downPayment, updated.credit);
      }

      return updated;
    });
  };

  const { calculations, amortizationData } = useMemo(() => {
    const loanAmount = Math.max(0, inputs.homePrice - inputs.downPayment);
    const monthlyRate = inputs.interestRate / 100 / 12;
    const numPayments = inputs.loanTerm * 12;
    const monthlyPI = monthlyPayment(loanAmount, inputs.interestRate, numPayments);

    const monthlyTax = inputs.propertyTax / 12;
    const monthlyInsurance = inputs.homeInsurance / 12;
    const monthlyPMI = inputs.pmi / 12;
    const monthlyHOA = inputs.hoaFees;
    const totalMonthly = monthlyPI + monthlyTax + monthlyInsurance + monthlyPMI + monthlyHOA;

    // Month-by-month schedule, with any extra principal paid each month.
    const extra = Math.max(0, inputs.extraMonthly);
    const schedule = [];
    const startDate = new Date(inputs.startDate + "-01");
    let balance = loanAmount;
    let totalInterest = 0;
    for (let i = 1; i <= numPayments && balance > 0.005; i++) {
      const interest = balance * monthlyRate;
      const principal = Math.min(monthlyPI - interest + extra, balance);
      balance = Math.max(0, balance - principal);
      totalInterest += interest;
      const date = new Date(startDate);
      date.setMonth(date.getMonth() + i);
      schedule.push({ month: i, date, payment: interest + principal, principal, interest, balance });
    }
    const scheduledInterest = monthlyPI * numPayments - loanAmount;
    const interestSaved = extra > 0 ? Math.max(0, scheduledInterest - totalInterest) : 0;
    const monthsSaved = numPayments - schedule.length;

    // PMI ends automatically when the balance is scheduled to reach 78% of the
    // original value (Homeowners Protection Act). It's based on the original
    // schedule, so extra payments don't move this date, though you can ask to
    // cancel at 80% once your actual balance gets there.
    const pmiMonths = monthlyPMI > 0 ? monthsUntilBalance(loanAmount, inputs.interestRate, numPayments, inputs.homePrice * 0.78) : 0;
    const months = schedule.length;
    const totalPayment =
      loanAmount + totalInterest + (monthlyTax + monthlyInsurance + monthlyHOA) * months + monthlyPMI * Math.min(pmiMonths, months);

    return {
      calculations: {
        loanAmount,
        monthlyPI,
        monthlyTax,
        monthlyInsurance,
        monthlyPMI,
        monthlyHOA,
        totalMonthly,
        totalInterest,
        interestSaved,
        monthsSaved,
        totalPayment,
        pmiMonths,
        numPayments,
      },
      amortizationData: schedule,
    };
  }, [inputs]);

  const closing = useMemo(
    () => quickClosingCosts(inputs.homePrice, inputs.downPayment, inputs.interestRate, inputs.propertyTax, inputs.homeInsurance),
    [inputs.homePrice, inputs.downPayment, inputs.interestRate, inputs.propertyTax, inputs.homeInsurance],
  );

  const payoff = amortizationData.length ? fmtMonth(amortizationData[amortizationData.length - 1].date) : "—";
  const yearsSaved = calculations.monthsSaved >= 12 ? `${Math.floor(calculations.monthsSaved / 12)} yr${calculations.monthsSaved % 12 ? ` ${calculations.monthsSaved % 12} mo` : ""}` : `${calculations.monthsSaved} mo`;
  const pmiApplies = inputs.downPaymentPercent < 20;
  const closingLink = `/closing-cost-calculator/?price=${inputs.homePrice}&down=${Math.round(inputs.downPayment)}&rate=${inputs.interestRate}&tax=${inputs.propertyTax}&ins=${inputs.homeInsurance}`;

  const openScenario = (params: Record<string, number>) => {
    setInputs(fromParams(params, inputs.startDate));
    setAreaIndex(0);
    document.getElementById("loan-details")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="fade-in">
      <div className="calc-layout">
        {/* Input Section */}
        <div>
          <InputCard id="loan-details" title="Your loan" description="Start with these four. Taxes, insurance and fees are filled in for you below.">
            <FieldGrid>
              <Field id="home-price" label="Home price" hint={initial ? undefined : <LocalPrice costs={costs} value={inputs.homePrice} onUse={(v) => updateInput("homePrice", v)} />}>
                <CurrencyInput id="home-price" value={inputs.homePrice} onChange={(value) => updateInput("homePrice", value)} aria-describedby={initial ? undefined : "home-price-hint"} />
              </Field>

              <Field id="down-payment" label="Down payment" info="Putting down 20% or more avoids PMI. The percent and dollar amount stay in sync.">
                <div className="flex gap-2">
                  <CurrencyInput id="down-payment" value={inputs.downPayment} onChange={(value) => updateInput("downPayment", value)} />
                  <PercentInput
                    value={inputs.downPaymentPercent}
                    onChange={(value) => updateInput("downPaymentPercent", value)}
                    className="w-[4.75rem] shrink-0 px-2"
                    decimalPlaces={1}
                    min={0}
                    max={100}
                    aria-label="Down payment percentage"
                  />
                </div>
              </Field>

              <Field
                id="interest-rate"
                label="Interest rate"
                info="Your quoted rate, not the APR. Rates change daily; check a few lenders."
                hint={<MarketRate term={inputs.loanTerm} value={inputs.interestRate} onUse={(r) => updateInput("interestRate", r)} />}
              >
                <PercentInput id="interest-rate" value={inputs.interestRate} onChange={(value) => updateInput("interestRate", value)} decimalPlaces={3} min={0} max={30} />
              </Field>

              <Field id="loan-term" label="Loan term">
                <TermChoice id="loan-term" value={inputs.loanTerm} onChange={(years) => updateInput("loanTerm", years)} />
              </Field>
            </FieldGrid>

            <MoreOptions
              title="Taxes, insurance & fees"
              summary={summarize(
                `${formatCurrency(inputs.propertyTax)}/yr tax`,
                `${formatCurrency(inputs.homeInsurance)}/yr insurance`,
                inputs.pmi > 0 ? `${formatCurrency(inputs.pmi)}/yr PMI` : "no PMI",
                inputs.hoaFees > 0 ? `${formatCurrency(inputs.hoaFees)}/mo HOA` : "no HOA",
              )}
            >
              <FieldGrid>
                {taxAreas && taxAreas.length > 1 && (
                  <Field id="tax-area" label={taxAreaLabel} hint="Sets the property tax rate." className="sm:col-span-2">
                    <Select
                      value={String(areaIndex)}
                      onValueChange={(v) => {
                        const i = Number(v);
                        setAreaIndex(i);
                        const rate = taxAreas[i].rate;
                        setInputs((prev) => ({ ...prev, taxRate: rate, propertyTax: Math.round((prev.homePrice * rate) / 100) }));
                      }}
                    >
                      <SelectTrigger id="tax-area" aria-describedby="tax-area-hint">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="max-h-80">
                        {taxAreas.map((a, i) => (
                          <SelectItem key={a.label} value={String(i)}>
                            {a.label} ({a.rate.toFixed(2)}%)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                )}

                <Field
                  id="property-tax"
                  label="Property tax"
                  unit="per year"
                  hint={
                    local && costs.taxRate !== null && inputs.taxRate !== costs.taxRate ? (
                      <LocalFigure costs={costs} figure={localTax(costs, inputs.homePrice)} value={inputs.propertyTax} onUse={() => updateInput("taxRate", costs.taxRate!)} detail={taxDetail(costs)} source={TAX_SOURCE} />
                    ) : inputs.taxRate !== null ? (
                      `${inputs.taxRate.toFixed(2)}% of the home price${local ? `, the ${costs.name} average` : ""}`
                    ) : undefined
                  }
                >
                  <CurrencyInput
                    id="property-tax"
                    value={inputs.propertyTax}
                    onChange={(value) => updateInput("propertyTax", value)}
                    aria-describedby={inputs.taxRate !== null ? "property-tax-hint" : undefined}
                  />
                </Field>

                <Field
                  id="home-insurance"
                  label="Home insurance"
                  unit="per year"
                  hint={local ? <LocalFigure costs={costs} figure={localInsurance(costs, inputs.homePrice)} value={inputs.homeInsurance} onUse={(v) => updateInput("homeInsurance", v)} detail={insuranceDetail(costs)} source={INSURANCE_SOURCE} /> : undefined}
                >
                  <CurrencyInput id="home-insurance" value={inputs.homeInsurance} onChange={(value) => updateInput("homeInsurance", value)} />
                </Field>

                {pmiApplies && (
                  <Field
                    id="credit-score"
                    label="Credit score"
                    info="PMI is priced mostly on your credit score and down payment. This sets a typical PMI rate; your lender's quote may differ."
                  >
                    <Select value={String(inputs.credit)} onValueChange={(v) => updateInput("credit", Number(v))}>
                      <SelectTrigger id="credit-score">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CREDIT_TIERS.map((t) => (
                          <SelectItem key={t.min} value={String(t.min)}>
                            {t.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                )}

                <Field
                  id="pmi"
                  label="PMI"
                  unit="per year"
                  tag={pmiApplies ? "Auto" : undefined}
                  hint={
                    pmiApplies && calculations.loanAmount > 0
                      ? `${((inputs.pmi / calculations.loanAmount) * 100).toFixed(2)}% of the loan, typical for ${tierLabel(inputs.credit)} credit`
                      : undefined
                  }
                  info="Estimated from your down payment and credit score when you put down less than 20%. It ends once the balance reaches 78% of the price."
                >
                  <CurrencyInput
                    id="pmi"
                    value={Math.round(inputs.pmi)}
                    onChange={(value) => updateInput("pmi", value)}
                    aria-describedby={pmiApplies ? "pmi-hint" : undefined}
                  />
                </Field>

                <Field id="hoa-fees" label="HOA dues" unit="per month">
                  <CurrencyInput id="hoa-fees" value={inputs.hoaFees} onChange={(value) => updateInput("hoaFees", value)} />
                </Field>

                <Field id="start-month" label="First payment" hint="Sets the dates in the schedule.">
                  <div className="flex gap-2">
                    <Select
                      value={inputs.startDate.split("-")[1]}
                      onValueChange={(month) => updateInput("startDate", `${inputs.startDate.split("-")[0]}-${month}`)}
                    >
                      <SelectTrigger id="start-month" aria-label="Loan start month" className="flex-1">
                        <SelectValue placeholder="Month" />
                      </SelectTrigger>
                      <SelectContent>
                        {MONTHS.map((m, i) => (
                          <SelectItem key={m} value={String(i + 1).padStart(2, "0")}>
                            {m}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select
                      value={inputs.startDate.split("-")[0]}
                      onValueChange={(year) => updateInput("startDate", `${year}-${inputs.startDate.split("-")[1]}`)}
                    >
                      <SelectTrigger aria-label="Loan start year" className="w-24">
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
                </Field>
              </FieldGrid>
            </MoreOptions>

            <MoreOptions
              title="Pay extra"
              summary={inputs.extraMonthly > 0 ? `${formatCurrency(inputs.extraMonthly)} a month toward principal` : "No extra payments"}
            >
              <FieldGrid>
                <Field
                  id="extra-monthly"
                  label="Extra each month"
                  hint={
                    inputs.extraMonthly > 0
                      ? `Saves ${formatCurrency(calculations.interestSaved)} in interest and pays the loan off ${yearsSaved} sooner.`
                      : "Even $100 a month can take years off the loan."
                  }
                >
                  <CurrencyInput id="extra-monthly" value={inputs.extraMonthly} onChange={(value) => updateInput("extraMonthly", value)} aria-describedby="extra-monthly-hint" />
                </Field>
              </FieldGrid>
              <p className="mt-3 text-xs text-muted-foreground">
                For lump sums, yearly extras or bi-weekly payments, use the{" "}
                <Link to="/extra-mortgage-payments-calculator/" className="text-primary hover:underline">
                  extra payments calculator
                </Link>
                .
              </p>
            </MoreOptions>
          </InputCard>
        </div>

        {/* Results Section */}
        <aside className="calc-results" aria-label="Calculation Results">
          <StickyResult targetId="calc-result" label={"Monthly payment"} value={formatCurrency(calculations.totalMonthly)} />
          <PaymentAnswer
            total={calculations.totalMonthly}
            context={`on a ${formatCurrency(calculations.loanAmount)} loan at ${inputs.interestRate}% for ${inputs.loanTerm} years${inputs.extraMonthly > 0 ? `, plus ${formatCurrency(inputs.extraMonthly)} extra` : ""}`}
            parts={[
              { label: "Principal & interest", value: calculations.monthlyPI },
              { label: "Tax", value: calculations.monthlyTax },
              { label: "Insurance", value: calculations.monthlyInsurance },
              { label: "PMI", value: calculations.monthlyPMI },
              { label: "HOA", value: calculations.monthlyHOA },
            ]}
            stats={[
              { label: "Cash to close", value: formatCurrency(closing.cashToClose), hint: `${formatCurrency(inputs.downPayment)} down + ~${formatCurrency(closing.total)} costs` },
              {
                label: "Total interest",
                value: formatCurrency(calculations.totalInterest),
                hint: inputs.extraMonthly > 0 ? `${formatCurrency(calculations.interestSaved)} less with extra` : `over ${inputs.loanTerm} years`,
              },
              {
                label: "Paid off",
                value: payoff,
                hint: inputs.extraMonthly > 0 ? `${yearsSaved} early` : calculations.pmiMonths > 0 ? `PMI ends after ~${Math.ceil(calculations.pmiMonths / 12)} yrs` : "No PMI",
              },
              { label: "Loan amount", value: formatCurrency(calculations.loanAmount), hint: `${(100 - inputs.downPaymentPercent).toFixed(0)}% of the price` },
            ]}
            shareUrl={() => urlWith(scenario)}
          />
          <LoanTypeSwitch current="conventional" price={inputs.homePrice} down={inputs.downPayment} rate={inputs.interestRate} term={inputs.loanTerm} />
        </aside>
      </div>

      <SavedScenarios
        current={{
          params: scenario,
          summary: {
            price: inputs.homePrice,
            down: inputs.downPayment,
            rate: inputs.interestRate,
            term: inputs.loanTerm,
            monthly: calculations.totalMonthly,
            loan: calculations.loanAmount,
            totalInterest: calculations.totalInterest,
            cashToClose: closing.cashToClose,
            payoff,
          },
        }}
        onOpen={openScenario}
      />

      {/* Charts and Schedule */}
      <div className="mt-8">
        <Tabs defaultValue="breakdown" className="w-full">
          <TabsList className="mb-6 w-full flex justify-start overflow-x-auto">
            <TabsTrigger value="breakdown" className="flex-shrink-0 text-xs sm:text-sm px-2 sm:px-3">
              <span className="hidden sm:inline">Payment Breakdown</span>
              <span className="sm:hidden">Breakdown</span>
            </TabsTrigger>
            <TabsTrigger value="closing" className="flex-shrink-0 text-xs sm:text-sm px-2 sm:px-3">
              Cash to Close
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
              principal={calculations.monthlyPI - calculations.loanAmount * (inputs.interestRate / 100 / 12)}
              interest={calculations.loanAmount * (inputs.interestRate / 100 / 12)}
              tax={calculations.monthlyTax}
              insurance={calculations.monthlyInsurance}
              pmi={calculations.monthlyPMI}
              hoa={calculations.monthlyHOA}
              pmiNote={calculations.pmiMonths > 0 ? `Ends after about ${Math.ceil(calculations.pmiMonths / 12)} years` : undefined}
            />
          </TabsContent>

          <TabsContent value="closing">
            <VizCard
              id="cash-to-close"
              title="What you'll need at closing"
              description="Your down payment plus typical closing costs, laid out like the Loan Estimate your lender sends."
              footnote="Estimates with typical fees and no transfer tax or seller credits. Your Loan Estimate has the real figures."
              actions={
                <Link to={closingLink} className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
                  Customize every fee
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              }
            >
              <ClosingCostTable result={closing} down={inputs.downPayment} detailed={false} />
            </VizCard>
          </TabsContent>

          <TabsContent value="chart">
            <AmortizationChart data={amortizationData} />
          </TabsContent>

          <TabsContent value="schedule">
            <AmortizationSchedule data={amortizationData} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MortgageCalculator;
