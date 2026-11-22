import { useMemo } from "react";
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
import { InputCard, FieldGrid, Field, TermChoice, MoreOptions, Choice, summarize } from "./calc/Form";
import { useUrlParam } from "@/lib/urlState";
import { AnswerCard } from "./PaymentAnswer";

const RentOrBuyCalculator = () => {
  // Rent Info
  const [monthlyRent, setMonthlyRent] = useUrlParam("monthlyRent", 2000);
  const [annualRentIncrease, setAnnualRentIncrease] = useUrlParam("annualRentIncrease", 3);

  // Property Info
  const [homePrice, setHomePrice] = useUrlParam("homePrice", 400000);
  const [annualAppreciation, setAnnualAppreciation] = useUrlParam("annualAppreciation", 3);
  const [yearsBeforeSell, setYearsBeforeSell] = useUrlParam("yearsBeforeSell", "7");
  const [sellingCost, setSellingCost] = useUrlParam("sellingCost", 6);
  const [buyingCost, setBuyingCost] = useUrlParam("buyingCost", 3);
  const [investmentReturn, setInvestmentReturn] = useUrlParam("investmentReturn", 4);

  // Loan Information
  const [downPaymentPercent, setDownPaymentPercent] = useUrlParam("downPaymentPercent", 20);
  const [interestRate, setInterestRate] = useUrlParam("interestRate", 6.5);
  const [loanTerm, setLoanTerm] = useUrlParam("loanTerm", "30");
  const [annualPMIPercent, setAnnualPMIPercent] = useUrlParam("annualPMIPercent", 0.5);

  // Ownership Costs
  const [annualPropertyTaxRate, setAnnualPropertyTaxRate] = useUrlParam("annualPropertyTaxRate", 1.25);
  const [annualInsuranceRate, setAnnualInsuranceRate] = useUrlParam("annualInsuranceRate", 0.5);
  const [annualMaintenance, setAnnualMaintenance] = useUrlParam("annualMaintenance", 2000);

  // Tax Info
  const [incomeTaxRate, setIncomeTaxRate] = useUrlParam("incomeTaxRate", 0);

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
      <div className="calc-layout">
        {/* Left Column - Inputs */}
        <div className="contents">
          <InputCard id="rent-or-buy-inputs" title="Renting vs. buying" description="The five numbers that matter most. Growth rates and costs are filled in with typical values below.">
            <FieldGrid>
              <Field id="rent-or-buy-monthly-rent" label="Monthly rent">
                <CurrencyInput id="rent-or-buy-monthly-rent" value={monthlyRent} onChange={setMonthlyRent} />
              </Field>
              <Field id="rent-or-buy-home-price" label="Home price">
                <CurrencyInput id="rent-or-buy-home-price" value={homePrice} onChange={setHomePrice} />
              </Field>
                <Field id="rent-or-buy-down-payment" label="Down payment" unit="% of price">
                  <PercentInput id="rent-or-buy-down-payment" value={downPaymentPercent} onChange={setDownPaymentPercent} min={0} max={100} decimalPlaces={1} />
                </Field>
                <Field id="rent-or-buy-interest-rate" label="Interest rate">
                  <PercentInput id="rent-or-buy-interest-rate" value={interestRate} onChange={setInterestRate} min={0} max={20} decimalPlaces={3} />
                </Field>
              <Field id="rent-or-buy-years-to-sell" label="Years you'd stay" info="How long until you'd sell. This matters most: buying's up-front costs take years to earn back." className="sm:col-span-2">
                <Choice
                  id="rent-or-buy-years-to-sell"
                  label="Years you'd stay"
                  value={yearsBeforeSell}
                  onChange={setYearsBeforeSell}
                  options={["3", "5", "7", "10", "15", "20", "30"].map((y) => ({ value: y, label: `${y} yr` }))}
                />
              </Field>
            </FieldGrid>

            <MoreOptions
              title="Rent, prices & investing"
              summary={summarize(`rent +${annualRentIncrease}%/yr`, `home value ${annualAppreciation >= 0 ? "+" : ""}${annualAppreciation}%/yr`, `investments ${investmentReturn}%/yr`)}
            >
              <FieldGrid>
                <Field id="rent-or-buy-rent-increase" label="Rent increase" unit="per year" info="Average yearly rent increase. About 3% to 4% is typical.">
                  <PercentInput id="rent-or-buy-rent-increase" value={annualRentIncrease} onChange={setAnnualRentIncrease} min={0} max={20} decimalPlaces={1} />
                </Field>
                <Field id="rent-or-buy-appreciation" label="Home value growth" unit="per year" info="Expected yearly change in the home's value. Long-run U.S. average is about 3% to 4%.">
                  <PercentInput id="rent-or-buy-appreciation" value={annualAppreciation} onChange={setAnnualAppreciation} min={-10} max={20} decimalPlaces={1} allowNegative />
                </Field>
                <Field id="rent-or-buy-investment-return" label="Investment return" unit="per year" info="What your down payment and closing costs could earn if you rented and invested them instead.">
                  <PercentInput id="rent-or-buy-investment-return" value={investmentReturn} onChange={setInvestmentReturn} min={0} max={15} decimalPlaces={1} />
                </Field>
              </FieldGrid>
            </MoreOptions>

            <MoreOptions
              title="Loan, buying & selling costs"
              summary={summarize(`${loanTerm}-year loan`, `${buyingCost}% to buy`, `${sellingCost}% to sell`, downPaymentPercent < 20 ? `PMI ${annualPMIPercent}%` : "no PMI")}
            >
              <FieldGrid>
                <Field id="rent-or-buy-loan-term" label="Loan term">
                  <TermChoice id="rent-or-buy-loan-term" value={Number(loanTerm)} onChange={(y) => setLoanTerm(String(y))} />
                </Field>
                <Field id="rent-or-buy-buying-cost" label="Closing costs to buy" unit="% of price" info="Usually 2% to 5% of the price.">
                  <PercentInput id="rent-or-buy-buying-cost" value={buyingCost} onChange={setBuyingCost} min={0} max={10} decimalPlaces={1} />
                </Field>
                <Field id="rent-or-buy-selling-cost" label="Costs to sell" unit="% of sale price" info="Agent commission and closing costs, often 6% to 8% of the sale price.">
                  <PercentInput id="rent-or-buy-selling-cost" value={sellingCost} onChange={setSellingCost} min={0} max={15} decimalPlaces={1} />
                </Field>
                <Field id="rent-or-buy-pmi-rate" label="PMI" unit="% of loan per year" info="Charged only when you put down less than 20%, until you reach 20% equity.">
                  <PercentInput id="rent-or-buy-pmi-rate" value={annualPMIPercent} onChange={setAnnualPMIPercent} min={0} max={3} decimalPlaces={2} />
                </Field>
              </FieldGrid>
            </MoreOptions>

            <MoreOptions
              title="Ownership costs & taxes"
              summary={summarize(
                `${annualPropertyTaxRate}% tax`,
                `${annualInsuranceRate}% insurance`,
                `${formatCurrency(annualMaintenance)}/yr upkeep`,
                incomeTaxRate > 0 ? `itemizing at ${incomeTaxRate}%` : "not itemizing",
              )}
            >
              <FieldGrid>
                <Field id="rent-or-buy-property-tax" label="Property tax" unit="% of price per year">
                  <PercentInput id="rent-or-buy-property-tax" value={annualPropertyTaxRate} onChange={setAnnualPropertyTaxRate} min={0} max={5} decimalPlaces={2} />
                </Field>
                <Field id="rent-or-buy-insurance" label="Home insurance" unit="% of price per year">
                  <PercentInput id="rent-or-buy-insurance" value={annualInsuranceRate} onChange={setAnnualInsuranceRate} min={0} max={3} decimalPlaces={2} />
                </Field>
                <Field id="rent-or-buy-maintenance" label="Maintenance" unit="per year" info="Repairs and upkeep. About 1% of the home's value a year is a common rule.">
                  <CurrencyInput id="rent-or-buy-maintenance" value={annualMaintenance} onChange={setAnnualMaintenance} />
                </Field>
                <Field id="rent-or-buy-tax-rate" label="Tax rate if itemizing" info="Only if you itemize deductions. Most people take the standard deduction: leave it at 0.">
                  <PercentInput id="rent-or-buy-tax-rate" value={incomeTaxRate} onChange={setIncomeTaxRate} min={0} max={50} decimalPlaces={0} />
                </Field>
              </FieldGrid>
            </MoreOptions>
          </InputCard>
          <div className="order-2 space-y-6">

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
        </div>

        {/* Right Column - Results */}
        <div className="calc-results order-1">
          <StickyResult targetId="calc-result" label={"Better choice"} value={`${results.shouldBuy ? "Buy" : "Rent"} · saves ${formatCurrency(results.costDifference)}`} />
          <AnswerCard
            label={`If you sell in ${yearsBeforeSell} years, it's better to`}
            headline={results.shouldBuy ? "Buy" : "Rent"}
            context={`${results.shouldBuy ? "Buying" : "Renting"} costs ${formatCurrency(results.costDifference)} less over ${yearsBeforeSell} years`}
            stats={[
              {
                label: "Buying breaks even",
                value: breakEvenYear !== null ? `After ${breakEvenYear.toFixed(1).replace(/\.0$/, "")} yrs` : byYear[0].advantage > 0 ? "Right away" : "Not in 30 yrs",
              },
              { label: "First-year monthly cost", value: `${formatCurrency(results.monthlyOwnershipTotal)} own`, hint: `vs. ${formatCurrency(monthlyRent)} rent` },
              { label: "Net cost of buying", value: formatCurrency(results.totalBuyCost), hint: `over ${yearsBeforeSell} years` },
              { label: "Net cost of renting", value: formatCurrency(results.totalRentCost), hint: `over ${yearsBeforeSell} years` },
            ]}
          />

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
