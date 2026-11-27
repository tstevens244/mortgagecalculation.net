import { useMemo } from "react";
import MarketRate from "@/components/calc/MarketRate";
import CurrencyInput from "@/components/CurrencyInput";
import PercentInput from "@/components/PercentInput";
import StickyResult from "@/components/StickyResult";
import { AnswerCard } from "@/components/PaymentAnswer";
import { InputCard, FieldGrid, Field, Choice, TermChoice, DownPaymentField, MoreOptions, summarize } from "@/components/calc/Form";
import { formatCurrency } from "@/lib/formatters";
import { vaFees, vaFeeRate, type VaPurpose } from "@/lib/feeMath";
import { useUrlParam } from "@/lib/urlState";
import { useLocalCosts } from "@/lib/useLocalCosts";
import { averageRate } from "@/lib/marketRates";
import { localPrice } from "@/lib/localCosts";
import { LocalPrice } from "@/components/calc/LocalValue";

const PURPOSES: { value: VaPurpose; label: string }[] = [
  { value: "purchase", label: "Purchase" },
  { value: "cashout", label: "Cash-out refi" },
  { value: "irrrl", label: "IRRRL" },
];

const pct = (r: number) => `${r.toFixed(2)}%`;

/** VA funding fee for a purchase, cash-out refinance or IRRRL, and what financing it costs. */
const VaFeeCalculator = () => {
  const [purpose, setPurpose] = useUrlParam<VaPurpose>("purpose", "purchase");
  const [amount, setAmount] = useUrlParam("amount", 350000);
  const [down, setDown] = useUrlParam("down", 0);
  const [firstUse, setFirstUse] = useUrlParam("first", true);
  const [exempt, setExempt] = useUrlParam("exempt", false);
  const [financed, setFinanced] = useUrlParam("financed", true);
  const [rate, setRate] = useUrlParam("rate", averageRate(30));
  const [term, setTerm] = useUrlParam("term", 30);
  const { costs: local } = useLocalCosts(
    (c) => {
      const p = localPrice(c, "typical");
      setDown(Math.round((down / amount) * p));
      setAmount(p);
    },
    { keys: ["amount", "down"] },
  );

  const purchase = purpose === "purchase";
  const v = useMemo(
    () => vaFees({ purpose, amount, down, firstUse, exempt, financed, ratePercent: rate, termYears: term }),
    [purpose, amount, down, firstUse, exempt, financed, rate, term],
  );

  // What a bigger down payment would save, for purchases below the 10% tier.
  const nextTier = purchase && !exempt && v.downPercent < 10 ? (v.downPercent < 5 ? 5 : 10) : null;
  const nextTierFee = nextTier ? ((amount * (1 - nextTier / 100)) * vaFeeRate("purchase", firstUse, nextTier, false)) / 100 : 0;

  const label = exempt ? "Your VA funding fee" : `Your VA funding fee (${pct(v.rate)})`;

  return (
    <div className="fade-in calc-layout">
      <InputCard id="va-fee-inputs" title="Your VA loan">
        <FieldGrid>
          <Field id="va-fee-purpose" label="Loan type" className="sm:col-span-full">
            <Choice id="va-fee-purpose" label="Loan type" value={purpose} onChange={setPurpose} options={PURPOSES} />
          </Field>
          <Field id="va-fee-amount" label={purchase ? "Home price" : "New loan amount"} hint={purchase ? <LocalPrice costs={local} value={amount} onUse={setAmount} /> : undefined}>
            <CurrencyInput id="va-fee-amount" value={amount} onChange={setAmount} allowDecimals={false} />
          </Field>
          {purchase && (
            <DownPaymentField
              id="va-fee-down"
              amount={down}
              percent={amount > 0 ? (down / amount) * 100 : 0}
              onAmount={setDown}
              onPercent={(p) => setDown(Math.round((amount * p) / 100))}
              info="5% down lowers the fee to 1.50%, and 10% down to 1.25%."
            />
          )}
          {purpose !== "irrrl" && (
            <Field id="va-fee-first" label="First time using a VA loan?" info="After your first VA loan, the fee is higher with less than 5% down and on cash-out refinances.">
              <Choice
                id="va-fee-first"
                label="First time using a VA loan?"
                value={firstUse ? "yes" : "no"}
                onChange={(x) => setFirstUse(x === "yes")}
                options={[
                  { value: "yes", label: "First use" },
                  { value: "no", label: "Used before" },
                ]}
              />
            </Field>
          )}
          <Field
            id="va-fee-exempt"
            label="Exempt from the fee?"
            info="You're exempt if you receive VA disability compensation (or are eligible for it), are an active-duty Purple Heart recipient, or are a surviving spouse receiving DIC."
          >
            <Choice
              id="va-fee-exempt"
              label="Exempt from the fee?"
              value={exempt ? "yes" : "no"}
              onChange={(x) => setExempt(x === "yes")}
              options={[
                { value: "no", label: "No" },
                { value: "yes", label: "Yes, exempt" },
              ]}
            />
          </Field>
        </FieldGrid>

        {!exempt && (
          <MoreOptions
            title="Financing the fee"
            summary={summarize(financed ? "Added to the loan" : "Paid at closing", `${rate}%`, `${term} years`)}
          >
            <FieldGrid>
              <Field id="va-fee-financed" label="Pay the fee">
                <Choice
                  id="va-fee-financed"
                  label="Pay the fee"
                  value={financed ? "loan" : "cash"}
                  onChange={(x) => setFinanced(x === "loan")}
                  options={[
                    { value: "loan", label: "In the loan" },
                    { value: "cash", label: "At closing" },
                  ]}
                />
              </Field>
              <Field id="va-fee-rate" label="Interest rate" hint={<MarketRate term={term} value={rate} onUse={setRate} />}>
                <PercentInput id="va-fee-rate" value={rate} onChange={setRate} min={0} max={20} decimalPlaces={3} />
              </Field>
              <Field id="va-fee-term" label="Loan term">
                <TermChoice id="va-fee-term" value={term} onChange={setTerm} terms={[30, 20, 15]} />
              </Field>
            </FieldGrid>
          </MoreOptions>
        )}
      </InputCard>

      <aside className="calc-results" aria-label="VA funding fee results">
        <StickyResult targetId="calc-result" label="VA funding fee" value={exempt ? "Exempt" : formatCurrency(v.fee)} />
        <AnswerCard
          label={label}
          total={v.fee}
          headline={exempt ? "$0" : undefined}
          context={
            exempt
              ? "No funding fee: your Certificate of Eligibility shows the exemption."
              : `${pct(v.rate)} of a ${formatCurrency(v.baseLoan)} loan, ${financed ? `added to the loan for ${formatCurrency(v.loan)}` : "paid at closing"}`
          }
          stats={[
            { label: "Fee rate", value: pct(v.rate), hint: exempt ? "exempt" : PURPOSES.find((p) => p.value === purpose)?.label },
            { label: "Loan with fee", value: formatCurrency(v.loan), hint: financed && !exempt ? "fee financed" : "fee not in the loan" },
            {
              label: "Added to payment",
              value: formatCurrency(v.financing.monthly),
              hint: financed && !exempt ? `at ${rate}% for ${term} years` : "not financed",
            },
            {
              label: "Cost with interest",
              value: formatCurrency(financed ? v.financing.total : v.fee),
              hint: financed && !exempt ? `over ${term} years` : "paid once",
            },
          ]}
        >
          {nextTier && (
            <p className="mt-4 text-sm text-primary-foreground/80">
              With {nextTier}% down the fee would be {formatCurrency(nextTierFee)}, saving {formatCurrency(v.fee - nextTierFee)}.
            </p>
          )}
        </AnswerCard>
      </aside>
    </div>
  );
};

export default VaFeeCalculator;
