import { useMemo } from "react";
import MarketRate from "@/components/calc/MarketRate";
import CurrencyInput from "@/components/CurrencyInput";
import PercentInput from "@/components/PercentInput";
import StickyResult from "@/components/StickyResult";
import { AnswerCard } from "@/components/PaymentAnswer";
import { InputCard, FieldGrid, Field, TermChoice, DownPaymentField } from "@/components/calc/Form";
import FeeSchedule from "./FeeSchedule";
import { formatCurrency } from "@/lib/formatters";
import { fhaMip } from "@/lib/feeMath";
import { useUrlParam } from "@/lib/urlState";
import { useLocalCosts } from "@/lib/useLocalCosts";
import { averageRate } from "@/lib/marketRates";
import { localPrice } from "@/lib/localCosts";
import { LocalPrice } from "@/components/calc/LocalValue";

/** FHA mortgage insurance: upfront MIP, the monthly premium, how long it lasts and what it costs in total. */
const FhaMipCalculator = () => {
  const [price, setPrice] = useUrlParam("price", 350000);
  const [down, setDown] = useUrlParam("down", 12250);
  const [rate, setRate] = useUrlParam("rate", averageRate(30));
  const [term, setTerm] = useUrlParam("term", 30);
  const { costs: local } = useLocalCosts(
    (c) => {
      const p = localPrice(c, "fha");
      setDown(Math.round((down / price) * p));
      setPrice(p);
    },
    { keys: ["price", "down"] },
  );

  const m = useMemo(() => fhaMip({ price, down, ratePercent: rate, termYears: term }), [price, down, rate, term]);
  const downPercent = price > 0 ? (down / price) * 100 : 0;
  // The same home with 10% down, where annual MIP ends after 11 years.
  const ten = useMemo(() => fhaMip({ price, down: price * 0.1, ratePercent: rate, termYears: term }), [price, rate, term]);
  const duration = m.lifeOfLoan ? "life of the loan" : `${m.mipMonths / 12} years`;

  return (
    <div className="fade-in calc-layout">
      <InputCard id="fha-mip-inputs" title="Your FHA loan">
        <FieldGrid>
          <Field id="fha-mip-price" label="Home price" hint={<LocalPrice costs={local} kind="fha" value={price} onUse={setPrice} />}>
            <CurrencyInput id="fha-mip-price" value={price} onChange={setPrice} allowDecimals={false} />
          </Field>
          <DownPaymentField
            id="fha-mip-down"
            amount={down}
            percent={downPercent}
            onAmount={setDown}
            onPercent={(p) => setDown(Math.round((price * p) / 100))}
            info="FHA's minimum is 3.5%. With 10% or more down, annual MIP ends after 11 years instead of lasting for the life of the loan."
            hint={downPercent < 3.5 ? "FHA requires at least 3.5% down." : undefined}
          />
          <Field id="fha-mip-rate" label="Interest rate" hint={<MarketRate term={term} value={rate} onUse={setRate} />}>
            <PercentInput id="fha-mip-rate" value={rate} onChange={setRate} min={0} max={20} decimalPlaces={3} />
          </Field>
          <Field id="fha-mip-term" label="Loan term" info="15-year FHA loans have lower annual MIP rates.">
            <TermChoice id="fha-mip-term" value={term} onChange={setTerm} terms={[30, 20, 15]} />
          </Field>
        </FieldGrid>
      </InputCard>

      <aside className="calc-results" aria-label="FHA MIP results">
        <StickyResult targetId="calc-result" label="Monthly MIP" value={formatCurrency(m.monthly)} />
        <AnswerCard
          label="Your monthly FHA MIP"
          total={m.monthly}
          context={`${m.annualRate}% a year on a ${formatCurrency(m.baseLoan)} loan (${m.ltv.toFixed(1)}% LTV), for the ${duration}`}
          stats={[
            { label: "Upfront MIP", value: formatCurrency(m.upfront), hint: `${m.upfrontRate}%, added to the loan` },
            { label: "Annual MIP rate", value: `${m.annualRate}%`, hint: duration },
            { label: "Principal & interest", value: formatCurrency(m.pi), hint: `on ${formatCurrency(m.loan)}` },
            { label: "Total MIP", value: formatCurrency(m.totalMip), hint: "upfront + annual" },
          ]}
        >
          {m.lifeOfLoan && downPercent < 10 && (
            <p className="mt-4 text-sm text-primary-foreground/80">
              With 10% down ({formatCurrency(price * 0.1)}), MIP would end after 11 years and total{" "}
              {formatCurrency(ten.totalMip)}, {formatCurrency(m.totalMip - ten.totalMip)} less.
            </p>
          )}
        </AnswerCard>
        <FeeSchedule
          title="Monthly MIP by year"
          byYear={m.byYear}
          note="Annual MIP is recalculated each year on your balance, so it shrinks slowly as you pay the loan down."
        />
      </aside>
    </div>
  );
};

export default FhaMipCalculator;
