import { useMemo, useState } from "react";
import { TrendingUp, AlertTriangle } from "lucide-react";
import CurrencyInput from "./CurrencyInput";
import PercentInput from "./PercentInput";
import StickyResult from "./StickyResult";
import { InputCard, FieldGrid, Field, MoreOptions, Choice, summarize } from "./calc/Form";
import { formatCurrency } from "@/lib/formatters";

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
  const [homeValue, setHomeValue] = useState(450000);
  const [mortgageBalance, setMortgageBalance] = useState(250000);
  const [maxCltv, setMaxCltv] = useState("85");
  const [amountToBorrow, setAmountToBorrow] = useState(50000);
  const [rate, setRate] = useState(8);
  const [drawYears, setDrawYears] = useState("10");
  const [repayYears, setRepayYears] = useState("20");

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
        <div id="calc-result" className="result-highlight">
          <p className="text-primary-foreground/80 text-sm font-medium uppercase tracking-wide">Maximum credit line</p>
          <p className="text-4xl lg:text-5xl font-display font-bold mt-2 number-pop">{formatCurrency(c.maxLine)}</p>
          <p className="text-primary-foreground/80 text-sm mt-2">
            {maxCltv}% of {formatCurrency(homeValue)} minus your {formatCurrency(mortgageBalance)} mortgage
          </p>
        </div>

        {c.wasCapped && (
          <div className="flex gap-2 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm" role="status">
            <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0 text-destructive" aria-hidden="true" />
            <p>
              That's more than this limit allows, so the payments below use {formatCurrency(c.borrowed)}.
            </p>
          </div>
        )}

        <div className="calculator-card p-4 sm:p-6 space-y-3">
          <h2 className="font-display font-semibold text-lg">Payments on {formatCurrency(c.borrowed)}</h2>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Draw period ({drawYears} yrs, interest only)</span>
            <span className="font-semibold">{formatCurrency(c.drawPayment)}/mo</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Repayment period ({repayYears} yrs)</span>
            <span className="font-semibold">{formatCurrency(c.repayPayment)}/mo</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3" aria-hidden="true" />
              Payment increase at repayment
            </span>
            <span className="font-semibold">+{formatCurrency(c.paymentJump)}/mo</span>
          </div>
          <hr className="border-border" />
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total interest (full term)</span>
            <span className="font-medium">{formatCurrency(c.totalInterest)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Combined loan-to-value</span>
            <span className="font-medium">{c.combinedLtv.toFixed(1)}%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Equity left after borrowing</span>
            <span className="font-medium">{formatCurrency(c.equityAfter)}</span>
          </div>
        </div>

        <div className="calculator-card p-4 text-sm">
          <h2 className="font-semibold mb-1">If rates rise 2 points</h2>
          <p className="text-muted-foreground">
            At {c.stressRate.toFixed(2)}%, the repayment-period payment would be{" "}
            <strong className="text-foreground">{formatCurrency(c.stressRepayPayment)}/mo</strong>. Make sure that
            still fits your budget.
          </p>
        </div>
      </aside>
    </div>
  );
};

export default HelocCalculator;
