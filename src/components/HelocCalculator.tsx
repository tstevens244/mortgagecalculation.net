import { useMemo } from "react";
import { AlertTriangle } from "lucide-react";
import CurrencyInput from "./CurrencyInput";
import PercentInput from "./PercentInput";
import StickyResult from "./StickyResult";
import { InputCard, FieldGrid, Field, MoreOptions, Choice, summarize } from "./calc/Form";
import { formatCurrency } from "@/lib/formatters";
import { useUrlParam } from "@/lib/urlState";
import { AnswerCard } from "./PaymentAnswer";

const monthlyPayment = (principal: number, annualRatePercent: number, months: number) => {
  if (principal <= 0 || months <= 0) return 0;
  const r = annualRatePercent / 100 / 12;
  if (r === 0) return principal / months;
  return (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
};

/**
 * HELOC calculator: how much can I borrow, and what will the payments be in the
 * draw period (interest-only) and the repayment period (principal + interest)?
 */
const HelocCalculator = () => {
  const [homeValue, setHomeValue] = useUrlParam("homeValue", 450000);
  const [mortgageBalance, setMortgageBalance] = useUrlParam("mortgageBalance", 250000);
  const [maxCltv, setMaxCltv] = useUrlParam("maxCltv", "85");
  const [amountToBorrow, setAmountToBorrow] = useUrlParam("amountToBorrow", 50000);
  const [rate, setRate] = useUrlParam("rate", 8);
  const [drawYears, setDrawYears] = useUrlParam("drawYears", "10");
  const [repayYears, setRepayYears] = useUrlParam("repayYears", "20");

  const c = useMemo(() => {
    const cltvLimit = Number(maxCltv) / 100;
    const maxLine = Math.max(0, homeValue * cltvLimit - mortgageBalance);
    const borrowed = Math.min(Math.max(0, amountToBorrow), maxLine);
    const drawMonths = Number(drawYears) * 12;
    const repayMonths = Number(repayYears) * 12;

    const drawPayment = (borrowed * rate) / 100 / 12;
    const repayPayment = monthlyPayment(borrowed, rate, repayMonths);
    const drawInterest = drawPayment * drawMonths;
    const repayInterest = repayPayment * repayMonths - borrowed;
    const stressRate = rate + 2;
    const stressRepayPayment = monthlyPayment(borrowed, stressRate, repayMonths);
    const combinedLtv = homeValue > 0 ? ((mortgageBalance + borrowed) / homeValue) * 100 : 0;
    const currentEquity = Math.max(0, homeValue - mortgageBalance);

    return {
      maxLine,
      borrowed,
      wasCapped: amountToBorrow > maxLine,
      drawPayment,
      repayPayment,
      paymentJump: repayPayment - drawPayment,
      totalInterest: drawInterest + repayInterest,
      stressRate,
      stressRepayPayment,
      combinedLtv,
      currentEquity,
      equityAfter: Math.max(0, currentEquity - borrowed),
    };
  }, [homeValue, mortgageBalance, maxCltv, amountToBorrow, rate, drawYears, repayYears]);


  return (
    <div className="fade-in calc-layout">
      <InputCard
        id="heloc-inputs"
        title="Your home and HELOC"
        description="HELOC rates are variable, usually prime plus a margin. The default rate is an example; enter the rate a lender quotes you."
      >
        <FieldGrid>
          <Field id="heloc-home-value" label="Home value">
            <CurrencyInput id="heloc-home-value" value={homeValue} onChange={setHomeValue} allowDecimals={false} />
          </Field>
          <Field id="heloc-mortgage-balance" label="Mortgage balance">
            <CurrencyInput id="heloc-mortgage-balance" value={mortgageBalance} onChange={setMortgageBalance} allowDecimals={false} />
          </Field>
          <Field id="heloc-amount" label="Amount you'll borrow">
            <CurrencyInput id="heloc-amount" value={amountToBorrow} onChange={setAmountToBorrow} allowDecimals={false} />
          </Field>
          <Field id="heloc-rate" label="HELOC interest rate">
            <PercentInput id="heloc-rate" value={rate} onChange={setRate} min={0} max={25} decimalPlaces={3} />
          </Field>
        </FieldGrid>
        <MoreOptions
          title="Borrowing limit & time periods"
          summary={summarize(`${maxCltv}% limit`, `${drawYears}-year draw`, `${repayYears}-year repayment`)}
        >
          <FieldGrid>
            <Field id="heloc-max-cltv" label="Lender's borrowing limit" info="The most your mortgage plus HELOC can add up to, as a % of the home's value. 85% is common." className="sm:col-span-2">
              <Choice id="heloc-max-cltv" label="Lender's borrowing limit" value={maxCltv} onChange={setMaxCltv} options={["80", "85", "90"].map((v) => ({ value: v, label: `${v}%` }))} />
            </Field>
            <Field id="heloc-draw-years" label="Draw period" info="Years you can borrow and pay interest only.">
              <Choice id="heloc-draw-years" label="Draw period" value={drawYears} onChange={setDrawYears} options={["5", "10", "15"].map((v) => ({ value: v, label: `${v} yr` }))} />
            </Field>
            <Field id="heloc-repay-years" label="Repayment period" info="Years to pay back principal and interest after the draw period.">
              <Choice id="heloc-repay-years" label="Repayment period" value={repayYears} onChange={setRepayYears} options={["10", "15", "20"].map((v) => ({ value: v, label: `${v} yr` }))} />
            </Field>
          </FieldGrid>
        </MoreOptions>
      </InputCard>

      <aside className="calc-results" aria-label="HELOC results">
        <StickyResult targetId="calc-result" label="Maximum credit line" value={formatCurrency(c.maxLine)} />
        <AnswerCard
          label="Your maximum credit line"
          total={c.maxLine}
          context={`${maxCltv}% of ${formatCurrency(homeValue)} minus your ${formatCurrency(mortgageBalance)} mortgage`}
          stats={[
            { label: `Draw period (${drawYears} yrs)`, value: `${formatCurrency(c.drawPayment)}/mo`, hint: `interest only on ${formatCurrency(c.borrowed)}` },
            { label: `Repayment (${repayYears} yrs)`, value: `${formatCurrency(c.repayPayment)}/mo`, hint: `+${formatCurrency(c.paymentJump)} a month` },
            { label: "Total interest", value: formatCurrency(c.totalInterest), hint: "over the full term" },
            { label: "Equity left", value: formatCurrency(c.equityAfter), hint: `${c.combinedLtv.toFixed(1)}% combined loan-to-value` },
          ]}
        >
          {c.wasCapped && (
            <p className="mb-2 flex gap-2" role="status">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              That's more than this limit allows, so the payments use {formatCurrency(c.borrowed)}.
            </p>
          )}
          <p>
            <strong className="text-primary-foreground">If rates rise 2 points</strong> to {c.stressRate.toFixed(2)}%, the repayment payment would be{" "}
            {formatCurrency(c.stressRepayPayment)}/mo. Make sure that still fits your budget.
          </p>
        </AnswerCard>
      </aside>
    </div>
  );
};

export default HelocCalculator;
