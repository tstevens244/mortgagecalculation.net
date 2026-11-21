import { useMemo, useState } from "react";
import { CalendarRange } from "lucide-react";
import CurrencyInput from "@/components/CurrencyInput";
import PercentInput from "@/components/PercentInput";
import FormRow from "@/components/FormRow";
import StickyResult from "@/components/StickyResult";
import { formatCurrency } from "@/lib/formatters";
import { termComparison } from "@/lib/compareMath";
import { monthsToPayoff, totalPaidOnBalance } from "@/lib/mortgageMath";

const yearsMonths = (months: number) => {
  const y = Math.floor(months / 12);
  const m = months % 12;
  return [y ? `${y} yr` : "", m ? `${m} mo` : ""].filter(Boolean).join(" ") || "0 mo";
};

/** 15-year vs. 30-year fixed: payment, interest, equity, and paying a 30-year loan like a 15. */
const TermComparisonCalculator = () => {
  const [loan, setLoan] = useState(320000);
  const [rate30, setRate30] = useState(6.5);
  const [rate15, setRate15] = useState(5.75);

  const c = useMemo(() => {
    const t = termComparison(loan, rate30, rate15);
    // Paying the 30-year loan with the 15-year payment.
    const fastMonths = monthsToPayoff(loan, rate30, t.fifteen.payment);
    const fastInterest = totalPaidOnBalance(loan, rate30, t.fifteen.payment) - loan;
    return { ...t, fastMonths, fastInterest };
  }, [loan, rate30, rate15]);

  const columns = [
    { label: "30-year fixed", rate: rate30, h: c.thirty },
    { label: "15-year fixed", rate: rate15, h: c.fifteen },
  ];

  return (
    <div className="fade-in calc-layout">
      <section className="calculator-card p-4 sm:p-6" aria-labelledby="term-inputs">
        <h2 id="term-inputs" className="mb-4 flex items-center gap-2 text-base font-display font-semibold sm:text-xl">
          <CalendarRange className="h-4 w-4 text-accent sm:h-5 sm:w-5" aria-hidden="true" />
          Your loan
        </h2>
        <div className="grid items-start gap-4 sm:grid-cols-[repeat(auto-fill,minmax(14rem,1fr))]">
          <FormRow id="term-loan" label="Loan amount">
            <CurrencyInput id="term-loan" value={loan} onChange={setLoan} allowDecimals={false} />
          </FormRow>
          <FormRow id="term-rate30" label="30-year rate">
            <PercentInput id="term-rate30" value={rate30} onChange={setRate30} min={0} max={20} decimalPlaces={3} />
          </FormRow>
          <FormRow id="term-rate15" label="15-year rate" hint="15-year rates usually run about 0.5 to 0.75 points lower.">
            <PercentInput id="term-rate15" value={rate15} onChange={setRate15} min={0} max={20} decimalPlaces={3} aria-describedby="term-rate15-hint" />
          </FormRow>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {columns.map(({ label, rate, h }) => (
            <div key={label} className="rounded-2xl border border-border bg-background/60 p-4">
              <p className="text-sm font-semibold text-foreground">
                {label} <span className="font-normal text-muted-foreground">at {rate.toFixed(3)}%</span>
              </p>
              <p className="mt-2 text-3xl font-semibold tabular-nums text-foreground">{formatCurrency(h.payment)}</p>
              <p className="text-xs text-muted-foreground">principal and interest a month</p>
              <dl className="mt-3 space-y-1.5 text-sm tabular-nums">
                <div className="flex justify-between gap-2">
                  <dt className="text-muted-foreground">Total interest</dt>
                  <dd className="font-medium">{formatCurrency(h.interest)}</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-muted-foreground">Total paid</dt>
                  <dd className="font-medium">{formatCurrency(h.paid)}</dd>
                </div>
              </dl>
            </div>
          ))}
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-sm tabular-nums">
            <caption className="mb-2 text-left text-sm font-semibold text-foreground">Balance left after…</caption>
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th scope="col" className="py-2 text-left font-medium">Year</th>
                <th scope="col" className="py-2 text-right font-medium">30-year</th>
                <th scope="col" className="py-2 text-right font-medium">15-year</th>
              </tr>
            </thead>
            <tbody>
              {c.balances.map((b) => (
                <tr key={b.year} className="border-b border-border last:border-0">
                  <th scope="row" className="py-2 text-left font-medium">{b.year}</th>
                  <td className="py-2 text-right">{formatCurrency(b.thirty)}</td>
                  <td className="py-2 text-right">{b.fifteen > 0 ? formatCurrency(b.fifteen) : "Paid off"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <aside className="calc-results" aria-label="Comparison results">
        <StickyResult targetId="calc-result" label="15-year saves in interest" value={formatCurrency(c.interestSaved)} />
        <div id="calc-result" className="result-highlight">
          <p className="text-sm font-medium uppercase tracking-wide text-primary-foreground/80">15-year saves in interest</p>
          <p className="mt-2 text-4xl font-display font-bold lg:text-5xl">{formatCurrency(c.interestSaved)}</p>
          <p className="mt-2 text-sm text-primary-foreground/80">
            for {formatCurrency(c.paymentDifference)} more a month, and you own the home 15 years sooner
          </p>
        </div>

        <div className="calculator-card space-y-2 p-4 text-sm sm:p-6">
          <h2 className="text-lg font-display font-semibold">Or: a 30-year paid like a 15</h2>
          <p className="text-muted-foreground">
            Take the 30-year loan but pay {formatCurrency(c.fifteen.payment)} a month, the 15-year payment. You keep
            the lower required payment as a safety net.
          </p>
          <dl className="space-y-1.5 tabular-nums">
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Paid off in</dt>
              <dd className="font-medium">{yearsMonths(c.fastMonths)}</dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Total interest</dt>
              <dd className="font-medium">{formatCurrency(c.fastInterest)}</dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Costs more than a true 15-year</dt>
              <dd className="font-medium">{formatCurrency(Math.max(0, c.fastInterest - c.fifteen.interest))}</dd>
            </div>
          </dl>
        </div>
        <p className="text-xs text-muted-foreground">
          Principal and interest only. Property tax and insurance are the same for both terms, and PMI, if you pay
          it, is usually a little lower on a 15-year loan.
        </p>
      </aside>
    </div>
  );
};

export default TermComparisonCalculator;
