import { useMemo, useState } from "react";
import { Coins } from "lucide-react";
import CurrencyInput from "@/components/CurrencyInput";
import PercentInput from "@/components/PercentInput";
import FormRow from "@/components/FormRow";
import StickyResult from "@/components/StickyResult";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatCurrency } from "@/lib/formatters";
import { pointsAnalysis } from "@/lib/compareMath";

const yearsMonths = (months: number) => {
  const y = Math.floor(months / 12);
  const m = months % 12;
  return [y ? `${y} yr` : "", m ? `${m} mo` : ""].filter(Boolean).join(" ") || "0 mo";
};

/** Is paying discount points worth it? Cost, monthly savings, break-even and net savings over the years you keep the loan. */
const PointsCalculator = () => {
  const [loan, setLoan] = useState(320000);
  const [rate, setRate] = useState(6.75);
  const [points, setPoints] = useState(1);
  const [perPoint, setPerPoint] = useState(0.25);
  const [term, setTerm] = useState("30");
  const [years, setYears] = useState("7");

  const p = useMemo(
    () =>
      pointsAnalysis({
        loan,
        baseRate: rate,
        points,
        reductionPerPoint: perPoint,
        termMonths: Number(term) * 12,
        horizonMonths: Number(years) * 12,
      }),
    [loan, rate, points, perPoint, term, years],
  );

  const worth = p.netSavings > 0;
  const breakEven = Number.isFinite(p.breakEvenMonths) ? yearsMonths(p.breakEvenMonths) : "Never";

  return (
    <div className="fade-in grid gap-6 lg:grid-cols-[1fr_400px]">
      <section className="calculator-card p-4 sm:p-6" aria-labelledby="pts-inputs">
        <h2 id="pts-inputs" className="mb-4 flex items-center gap-2 text-base font-display font-semibold sm:text-xl">
          <Coins className="h-4 w-4 text-accent sm:h-5 sm:w-5" aria-hidden="true" />
          Your loan and points
        </h2>
        <div className="space-y-3">
          <FormRow id="pts-loan" label="Loan amount">
            <CurrencyInput id="pts-loan" value={loan} onChange={setLoan} allowDecimals={false} />
          </FormRow>
          <FormRow id="pts-rate" label="Rate without points">
            <PercentInput id="pts-rate" value={rate} onChange={setRate} min={0} max={20} decimalPlaces={3} />
          </FormRow>
          <FormRow id="pts-points" label="Points you'd buy" hint={`1 point = 1% of the loan, here ${formatCurrency(loan / 100)}.`}>
            <PercentInput
              id="pts-points"
              value={points}
              onChange={setPoints}
              min={0}
              max={4}
              decimalPlaces={3}
              suffix="pts"
              aria-describedby="pts-points-hint"
            />
          </FormRow>
          <FormRow id="pts-per" label="Rate cut per point" hint="Often about 0.25%. Your lender's rate sheet has the exact figure.">
            <PercentInput id="pts-per" value={perPoint} onChange={setPerPoint} min={0} max={1} decimalPlaces={3} aria-describedby="pts-per-hint" />
          </FormRow>
          <FormRow id="pts-term" label="Loan term">
            <Select value={term} onValueChange={setTerm}>
              <SelectTrigger id="pts-term">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 years</SelectItem>
                <SelectItem value="20">20 years</SelectItem>
                <SelectItem value="15">15 years</SelectItem>
              </SelectContent>
            </Select>
          </FormRow>
          <FormRow id="pts-years" label="Years you'll keep the loan" hint="Until you expect to sell or refinance.">
            <Select value={years} onValueChange={setYears}>
              <SelectTrigger id="pts-years" aria-describedby="pts-years-hint">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["2", "3", "5", "7", "10", "15", "20", "30"].map((y) => (
                  <SelectItem key={y} value={y}>
                    {y} years
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormRow>
        </div>

        <dl className="mt-6 grid gap-3 text-sm tabular-nums sm:grid-cols-2">
          {[
            ["Cost of points", formatCurrency(p.cost)],
            ["New rate", `${p.newRate.toFixed(3)}%`],
            ["Payment without points", formatCurrency(p.without.payment)],
            ["Payment with points", formatCurrency(p.withPts.payment)],
            ["Monthly savings", formatCurrency(p.monthlySavings)],
            ["Break-even", breakEven],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between gap-2 rounded-xl border border-border bg-background/60 px-3 py-2.5">
              <dt className="text-muted-foreground">{k}</dt>
              <dd className="font-semibold text-foreground">{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      <aside className="space-y-4" aria-label="Points results">
        <StickyResult
          targetId="calc-result"
          label={worth ? "Points save you" : "Points cost you"}
          value={formatCurrency(Math.abs(p.netSavings))}
        />
        <div id="calc-result" className="result-highlight">
          <p className="text-sm font-medium uppercase tracking-wide text-primary-foreground/80">
            {worth ? "Points save you" : "Points cost you"} over {years} years
          </p>
          <p className="mt-2 text-4xl font-display font-bold lg:text-5xl">{formatCurrency(Math.abs(p.netSavings))}</p>
          <p className="mt-2 text-sm text-primary-foreground/80">
            {worth
              ? `Worth it if you keep the loan at least ${breakEven}.`
              : `You'd need to keep the loan ${breakEven === "Never" ? "longer than the term" : `at least ${breakEven}`} to come out ahead.`}
          </p>
        </div>

        <div className="calculator-card space-y-2 p-4 text-sm sm:p-6">
          <h2 className="text-lg font-display font-semibold">How it's figured</h2>
          <p className="text-muted-foreground">
            Break-even is the cost of the points divided by the monthly savings. Net savings also counts the faster
            paydown from the lower rate: payments made plus balance left, with and without points, minus their cost.
          </p>
          <p className="text-muted-foreground">
            Money spent on points could instead go toward your down payment or closing costs, so compare those too.
          </p>
        </div>
      </aside>
    </div>
  );
};

export default PointsCalculator;
