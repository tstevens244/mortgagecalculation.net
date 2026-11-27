import { useMemo } from "react";
import MarketRate from "@/components/calc/MarketRate";
import CurrencyInput from "@/components/CurrencyInput";
import PercentInput from "@/components/PercentInput";
import StickyResult from "@/components/StickyResult";
import { AnswerCard } from "@/components/PaymentAnswer";
import { InputCard, FieldGrid, Field, Choice, DownPaymentField } from "@/components/calc/Form";
import FeeSchedule from "./FeeSchedule";
import { formatCurrency } from "@/lib/formatters";
import { usdaFees } from "@/lib/feeMath";
import { useUrlParam } from "@/lib/urlState";
import { useLocalCosts } from "@/lib/useLocalCosts";
import { averageRate } from "@/lib/marketRates";
import { localPrice } from "@/lib/localCosts";
import { LocalPrice } from "@/components/calc/LocalValue";

/** USDA guarantee fee ("funding fee"): the 1% upfront fee, the 0.35% annual fee and what they add to the payment. */
const UsdaFeeCalculator = () => {
  const [price, setPrice] = useUrlParam("price", 250000);
  const [down, setDown] = useUrlParam("down", 0);
  const [rate, setRate] = useUrlParam("rate", averageRate(30));
  const [financed, setFinanced] = useUrlParam("financed", true);
  const { costs: local } = useLocalCosts(
    (c) => {
      const p = localPrice(c, "entry");
      setDown(Math.round((down / price) * p));
      setPrice(p);
    },
    { keys: ["price", "down"] },
  );

  const u = useMemo(() => usdaFees({ price, down, ratePercent: rate, financed }), [price, down, rate, financed]);
  const downPercent = price > 0 ? (down / price) * 100 : 0;

  return (
    <div className="fade-in calc-layout">
      <InputCard id="usda-fee-inputs" title="Your USDA loan" description="USDA loans are 30-year fixed, with no down payment required.">
        <FieldGrid>
          <Field id="usda-fee-price" label="Home price" hint={<LocalPrice costs={local} kind="entry" value={price} onUse={setPrice} />}>
            <CurrencyInput id="usda-fee-price" value={price} onChange={setPrice} allowDecimals={false} />
          </Field>
          <DownPaymentField
            id="usda-fee-down"
            amount={down}
            percent={downPercent}
            onAmount={setDown}
            onPercent={(p) => setDown(Math.round((price * p) / 100))}
            info="Optional. A down payment lowers the loan, and both fees with it."
          />
          <Field id="usda-fee-rate" label="Interest rate" hint={<MarketRate term={30} value={rate} onUse={setRate} />}>
            <PercentInput id="usda-fee-rate" value={rate} onChange={setRate} min={0} max={20} decimalPlaces={3} />
          </Field>
          <Field id="usda-fee-financed" label="Pay the upfront fee" info="Most buyers add it to the loan. Paying it at closing avoids interest on it.">
            <Choice
              id="usda-fee-financed"
              label="Pay the upfront fee"
              value={financed ? "loan" : "cash"}
              onChange={(v) => setFinanced(v === "loan")}
              options={[
                { value: "loan", label: "In the loan" },
                { value: "cash", label: "At closing" },
              ]}
            />
          </Field>
        </FieldGrid>
      </InputCard>

      <aside className="calc-results" aria-label="USDA guarantee fee results">
        <StickyResult targetId="calc-result" label="Upfront guarantee fee" value={formatCurrency(u.upfront)} />
        <AnswerCard
          label="Your USDA upfront guarantee fee"
          total={u.upfront}
          context={`${u.upfrontRate}% of a ${formatCurrency(u.baseLoan)} loan, ${financed ? `added to the loan for ${formatCurrency(u.loan)}` : "paid at closing"} · plus ${formatCurrency(u.firstMonthly)} a month in annual fees to start`}
          stats={[
            { label: "Annual fee, monthly", value: formatCurrency(u.firstMonthly), hint: `${u.annualRate}% a year, first year` },
            { label: "Principal & interest", value: formatCurrency(u.pi), hint: `on ${formatCurrency(u.loan)}` },
            { label: "Payment before tax & insurance", value: formatCurrency(u.pi + u.firstMonthly) },
            { label: "All fees, 30 years", value: formatCurrency(u.totalFees), hint: "upfront + annual fees" },
          ]}
        />
        <FeeSchedule
          title="Annual fee by year"
          byYear={u.byYear}
          note={`The ${u.annualRate}% fee is recalculated each year on what you still owe, so it shrinks as you pay the loan down. It lasts for the life of the loan.`}
        />
      </aside>
    </div>
  );
};

export default UsdaFeeCalculator;
