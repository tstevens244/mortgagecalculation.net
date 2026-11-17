import { useMemo, useState } from "react";
import { Home, Percent, Calendar, Wallet, TrendingUp, AlertTriangle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CurrencyInput from "./CurrencyInput";
import PercentInput from "./PercentInput";
import StickyResult from "./StickyResult";
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

  // Label above the field on phones, beside it from the small breakpoint up.
  const rowClass = "flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-3";
  const labelClass = "text-sm text-muted-foreground flex items-center gap-1 sm:w-[190px] sm:shrink-0";

  return (
    <div className="fade-in grid gap-6 lg:grid-cols-[1fr_380px]">
      <section className="calculator-card p-4 sm:p-6" aria-labelledby="heloc-inputs-heading">
        <h2 id="heloc-inputs-heading" className="text-base sm:text-xl font-display font-semibold mb-4 flex items-center gap-2">
          <Home className="h-4 w-4 sm:h-5 sm:w-5 text-accent" aria-hidden="true" />
          Your home and HELOC
        </h2>

        <div className="space-y-3">
          <div className={rowClass}>
            <Label htmlFor="heloc-home-value" className={labelClass}>Home value</Label>
            <CurrencyInput id="heloc-home-value" value={homeValue} onChange={setHomeValue} allowDecimals={false} />
          </div>

          <div className={rowClass}>
            <Label htmlFor="heloc-mortgage-balance" className={labelClass}>Mortgage balance</Label>
            <CurrencyInput id="heloc-mortgage-balance" value={mortgageBalance} onChange={setMortgageBalance} allowDecimals={false} />
          </div>

          <div className={rowClass}>
            <Label htmlFor="heloc-max-cltv" className={labelClass}>Lender's borrowing limit</Label>
            <Select value={maxCltv} onValueChange={setMaxCltv}>
              <SelectTrigger id="heloc-max-cltv" className="w-full sm:flex-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="80">80% of value</SelectItem>
                <SelectItem value="85">85% of value</SelectItem>
                <SelectItem value="90">90% of value</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className={rowClass}>
            <Label htmlFor="heloc-amount" className={labelClass}>
              <Wallet className="h-3 w-3 sm:h-4 sm:w-4" aria-hidden="true" />
              Amount you'll borrow
            </Label>
            <CurrencyInput id="heloc-amount" value={amountToBorrow} onChange={setAmountToBorrow} allowDecimals={false} />
          </div>

          <div className={rowClass}>
            <Label htmlFor="heloc-rate" className={labelClass}>
              <Percent className="h-3 w-3 sm:h-4 sm:w-4" aria-hidden="true" />
              HELOC interest rate
            </Label>
            <div className="flex flex-1 items-center gap-2">
              <PercentInput id="heloc-rate" value={rate} onChange={setRate} min={0} max={25} decimalPlaces={3} />
              <span className="text-muted-foreground text-sm">%</span>
            </div>
          </div>

          <div className={rowClass}>
            <Label htmlFor="heloc-draw-years" className={labelClass}>
              <Calendar className="h-3 w-3 sm:h-4 sm:w-4" aria-hidden="true" />
              Draw period
            </Label>
            <Select value={drawYears} onValueChange={setDrawYears}>
              <SelectTrigger id="heloc-draw-years" className="w-full sm:flex-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 years</SelectItem>
                <SelectItem value="10">10 years</SelectItem>
                <SelectItem value="15">15 years</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className={rowClass}>
            <Label htmlFor="heloc-repay-years" className={labelClass}>
              <Calendar className="h-3 w-3 sm:h-4 sm:w-4" aria-hidden="true" />
              Repayment period
            </Label>
            <Select value={repayYears} onValueChange={setRepayYears}>
              <SelectTrigger id="heloc-repay-years" className="w-full sm:flex-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 years</SelectItem>
                <SelectItem value="15">15 years</SelectItem>
                <SelectItem value="20">20 years</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <p className="mt-4 text-xs text-muted-foreground">
          HELOC rates are variable, usually the prime rate plus a margin. The default rate is an example; enter the
          rate a lender quotes you.
        </p>
      </section>

      <aside className="space-y-4" aria-label="HELOC results">
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
