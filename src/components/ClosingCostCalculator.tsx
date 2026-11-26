import { useMemo } from "react";
import CurrencyInput from "@/components/CurrencyInput";
import PercentInput from "@/components/PercentInput";
import StickyResult from "@/components/StickyResult";
import { AnswerCard } from "@/components/PaymentAnswer";
import VizCard from "@/components/viz/VizCard";
import MarketRate from "@/components/calc/MarketRate";
import ClosingCostTable from "@/components/calc/ClosingCostTable";
import { InputCard, FieldGrid, Field, MoreOptions, DownPaymentField, summarize } from "@/components/calc/Form";
import { formatCurrency } from "@/lib/formatters";
import { averageRate } from "@/lib/marketRates";
import { CLOSING_DEFAULTS, closingCosts, defaultTitleAndSettlement } from "@/lib/closingCosts";
import { useUrlParam } from "@/lib/urlState";

// -1 means "estimate it for me" for inputs whose typical value depends on the price.
const AUTO = -1;
const TAX_RATE = 1.1; // % of price a year, near the U.S. average effective rate
const INSURANCE_RATE = 0.5; // % of price a year

/** Closing costs and cash to close, laid out like the Loan Estimate. */
const ClosingCostCalculator = () => {
  const [price, setPrice] = useUrlParam("price", 400000);
  const [down, setDown] = useUrlParam("down", 40000);
  const [rate, setRate] = useUrlParam("rate", averageRate(30));
  const [tax, setTax] = useUrlParam("tax", AUTO);
  const [ins, setIns] = useUrlParam("ins", AUTO);
  const [orig, setOrig] = useUrlParam("orig", CLOSING_DEFAULTS.originationPercent);
  const [points, setPoints] = useUrlParam("points", CLOSING_DEFAULTS.points);
  const [services, setServices] = useUrlParam("services", CLOSING_DEFAULTS.requiredServices);
  const [title, setTitle] = useUrlParam("title", AUTO);
  const [recording, setRecording] = useUrlParam("recording", CLOSING_DEFAULTS.recording);
  const [transfer, setTransfer] = useUrlParam("transfer", CLOSING_DEFAULTS.transferTaxPercent);
  const [days, setDays] = useUrlParam("days", CLOSING_DEFAULTS.prepaidInterestDays);
  const [escTax, setEscTax] = useUrlParam("escTax", CLOSING_DEFAULTS.escrowTaxMonths);
  const [escIns, setEscIns] = useUrlParam("escIns", CLOSING_DEFAULTS.escrowInsuranceMonths);
  const [credits, setCredits] = useUrlParam("credits", CLOSING_DEFAULTS.credits);

  const loan = Math.max(0, price - down);
  const annualTax = tax === AUTO ? Math.round((price * TAX_RATE) / 100) : tax;
  const annualInsurance = ins === AUTO ? Math.round((price * INSURANCE_RATE) / 100) : ins;
  const titleAmount = title === AUTO ? defaultTitleAndSettlement(loan) : title;

  const r = useMemo(
    () =>
      closingCosts({
        price,
        down,
        ratePercent: rate,
        annualTax,
        annualInsurance,
        originationPercent: orig,
        points,
        requiredServices: services,
        titleAndSettlement: titleAmount,
        recording,
        transferTaxPercent: transfer,
        prepaidInterestDays: days,
        escrowTaxMonths: escTax,
        escrowInsuranceMonths: escIns,
        credits,
      }),
    [price, down, rate, annualTax, annualInsurance, orig, points, services, titleAmount, recording, transfer, days, escTax, escIns, credits],
  );

  return (
    <div className="fade-in calc-layout">
      <InputCard id="closing-inputs" title="Your purchase" description="Start with these. Every fee below has a typical estimate you can change to match your Loan Estimate.">
        <FieldGrid>
          <Field id="cc-price" label="Home price">
            <CurrencyInput id="cc-price" value={price} onChange={setPrice} allowDecimals={false} />
          </Field>
          <DownPaymentField
            id="cc-down"
            amount={down}
            percent={price > 0 ? (down / price) * 100 : 0}
            onAmount={setDown}
            onPercent={(p) => setDown(Math.round((price * p) / 100))}
          />
          <Field id="cc-rate" label="Interest rate" hint={<MarketRate term={30} value={rate} onUse={setRate} />} info="Used for the prepaid interest you pay at closing.">
            <PercentInput id="cc-rate" value={rate} onChange={setRate} min={0} max={20} decimalPlaces={3} />
          </Field>
          <Field id="cc-credits" label="Seller or lender credits" info="Money the seller agrees to put toward your costs, or a lender credit in exchange for a higher rate.">
            <CurrencyInput id="cc-credits" value={credits} onChange={setCredits} allowDecimals={false} />
          </Field>
        </FieldGrid>

        <MoreOptions
          title="Lender fees and points"
          summary={summarize(`${orig}% origination`, points > 0 ? `${points} point${points === 1 ? "" : "s"}` : "no points", `${formatCurrency(services)} appraisal & reports`)}
        >
          <FieldGrid>
            <Field id="cc-orig" label="Origination fee" unit="% of loan" info="The lender's own charge for making the loan. Often 0.5% to 1%, sometimes a flat fee instead.">
              <PercentInput id="cc-orig" value={orig} onChange={setOrig} min={0} max={5} decimalPlaces={3} />
            </Field>
            <Field id="cc-points" label="Discount points" info="Each point costs 1% of the loan and lowers your rate. See the mortgage points calculator to check if they pay off.">
              <PercentInput id="cc-points" value={points} onChange={setPoints} min={0} max={4} decimalPlaces={3} suffix="pts" />
            </Field>
            <Field id="cc-services" label="Appraisal, credit report and other required services" info="Section B of the Loan Estimate: services the lender picks, such as the appraisal, credit report, flood certification and tax service.">
              <CurrencyInput id="cc-services" value={services} onChange={setServices} allowDecimals={false} />
            </Field>
          </FieldGrid>
        </MoreOptions>

        <MoreOptions
          title="Title, recording and taxes"
          summary={summarize(`${formatCurrency(titleAmount)} title & settlement`, `${formatCurrency(recording)} recording`, transfer > 0 ? `${transfer}% transfer tax` : "no transfer tax")}
        >
          <FieldGrid>
            <Field
              id="cc-title"
              label="Lender's title insurance and settlement"
              tag={title === AUTO ? "Auto" : undefined}
              info="Section C: title search, the lender's title policy and the settlement or escrow agent's fee. You can shop for these. Estimated at 0.5% of the loan plus $800."
            >
              <CurrencyInput id="cc-title" value={titleAmount} onChange={setTitle} allowDecimals={false} />
            </Field>
            <Field id="cc-recording" label="Recording fees" info="What the county charges to record the deed and mortgage.">
              <CurrencyInput id="cc-recording" value={recording} onChange={setRecording} allowDecimals={false} />
            </Field>
            <Field
              id="cc-transfer"
              label="Transfer or mortgage tax you pay"
              unit="% of price"
              hint="0% in many states; 1% or more in some. Who pays it depends on the state and the contract."
            >
              <PercentInput id="cc-transfer" value={transfer} onChange={setTransfer} min={0} max={5} decimalPlaces={3} aria-describedby="cc-transfer-hint" />
            </Field>
          </FieldGrid>
        </MoreOptions>

        <MoreOptions
          title="Prepaids and escrow"
          summary={summarize(`${formatCurrency(annualTax)}/yr tax`, `${formatCurrency(annualInsurance)}/yr insurance`, `${days} days interest`)}
        >
          <FieldGrid>
            <Field id="cc-tax" label="Property tax" unit="per year" tag={tax === AUTO ? "Auto" : undefined}>
              <CurrencyInput id="cc-tax" value={annualTax} onChange={setTax} allowDecimals={false} />
            </Field>
            <Field id="cc-ins" label="Homeowners insurance" unit="per year" tag={ins === AUTO ? "Auto" : undefined} info="You usually pay the first year's premium at closing.">
              <CurrencyInput id="cc-ins" value={annualInsurance} onChange={setIns} allowDecimals={false} />
            </Field>
            <Field id="cc-days" label="Days of prepaid interest" info="Interest from your closing day to the end of that month. Closing late in the month means fewer days.">
              <PercentInput id="cc-days" value={days} onChange={(v) => setDays(Math.round(v))} min={0} max={31} decimalPlaces={0} suffix="days" />
            </Field>
            <Field id="cc-esc-tax" label="Months of tax in escrow" info="Lenders usually collect 2 to 6 months up front to start your escrow account.">
              <PercentInput id="cc-esc-tax" value={escTax} onChange={(v) => setEscTax(Math.round(v))} min={0} max={12} decimalPlaces={0} suffix="mo" />
            </Field>
            <Field id="cc-esc-ins" label="Months of insurance in escrow">
              <PercentInput id="cc-esc-ins" value={escIns} onChange={(v) => setEscIns(Math.round(v))} min={0} max={12} decimalPlaces={0} suffix="mo" />
            </Field>
          </FieldGrid>
        </MoreOptions>
      </InputCard>

      <aside className="calc-results" aria-label="Closing cost results">
        <StickyResult targetId="calc-result" label="Cash to close" value={formatCurrency(r.cashToClose)} />
        <AnswerCard
          label="Your estimated cash to close"
          total={r.cashToClose}
          context={`${formatCurrency(down)} down + ${formatCurrency(r.total)} in closing costs${r.credits > 0 ? ` − ${formatCurrency(r.credits)} in credits` : ""}, on a ${formatCurrency(loan)} loan`}
          parts={[
            { label: "Down payment", value: down },
            { label: "Lender & third-party fees", value: r.fees },
            { label: "Prepaids & escrow", value: r.prepaidsAndEscrow },
          ]}
          stats={[
            { label: "Closing costs", value: formatCurrency(r.total), hint: `${r.percentOfPrice.toFixed(1)}% of the price` },
            { label: "Fees only", value: formatCurrency(r.fees), hint: "sections A–E" },
            { label: "Prepaids & escrow", value: formatCurrency(r.prepaidsAndEscrow), hint: "sections F–G, your own money" },
            { label: "Loan amount", value: formatCurrency(loan) },
          ]}
        />
        <VizCard
          id="closing-breakdown"
          title="Your closing costs, line by line"
          description="In the same sections as page 2 of the Loan Estimate, so you can check it against your lender's."
          footnote="Estimates. Owner's title insurance, HOA transfer fees, home inspection and the cost of moving aren't included."
        >
          <ClosingCostTable result={r} down={down} />
        </VizCard>
      </aside>
    </div>
  );
};

export default ClosingCostCalculator;
