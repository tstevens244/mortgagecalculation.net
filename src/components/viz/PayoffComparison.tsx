import { useState } from "react";
import { formatCurrency } from "@/lib/formatters";
import { yearsMonths } from "@/lib/amortization";
import { cn } from "@/lib/utils";
import VizCard, { StatRow, ViewToggle } from "./VizCard";
import { BalanceComparisonChart } from "./LazyCharts";
import type { YearPoint } from "@/components/charts/BalanceComparisonChartView";

interface PayoffComparisonProps {
  loanAmount: number;
  standard: YearPoint[];
  plan: YearPoint[];
  standardLabel: string;
  planLabel: string;
  standardMonths: number;
  planMonths: number;
  /** Extra money you put in over the life of the loan. */
  extraPaid?: number;
  extraPaidLabel?: string;
}

/**
 * Regular schedule vs. paying faster: a chart of both balances and a year-by-year
 * table with how far ahead you are and how much interest you've saved so far.
 */
const PayoffComparison = ({
  loanAmount,
  standard,
  plan,
  standardLabel,
  planLabel,
  standardMonths,
  planMonths,
  extraPaid,
  extraPaidLabel = "Extra you pay in",
}: PayoffComparisonProps) => {
  const [view, setView] = useState<"chart" | "table">("chart");
  const lastStd = standard[standard.length - 1];
  const lastPlan = plan[plan.length - 1];
  const interestSaved = (lastStd?.interest ?? 0) - (lastPlan?.interest ?? 0);
  const monthsSaved = standardMonths - planMonths;

  const stats = [
    { label: "Interest saved", value: formatCurrency(interestSaved), tone: "positive" as const },
    { label: "Paid off sooner by", value: yearsMonths(monthsSaved) },
    { label: "Paid off in", value: yearsMonths(planMonths), hint: `instead of ${yearsMonths(standardMonths)}` },
    ...(extraPaid !== undefined
      ? [{ label: extraPaidLabel, value: formatCurrency(extraPaid), hint: extraPaid > 0 ? `$${(interestSaved / extraPaid).toFixed(2)} of interest saved per $1` : undefined }]
      : []),
  ];

  const rows = Array.from({ length: Math.max(standard.length, plan.length) }, (_, i) => {
    const s = standard[Math.min(i, standard.length - 1)];
    const p = plan[Math.min(i, plan.length - 1)];
    const sb = i < standard.length ? s.balance : 0;
    const pb = i < plan.length ? p.balance : 0;
    return { year: i + 1, standard: sb, plan: pb, ahead: sb - pb, saved: s.interest - p.interest, planDone: i >= plan.length - 1 && pb === 0 };
  });

  const th = "px-1 py-2.5 sm:px-3 text-right text-xs font-semibold tracking-normal text-muted-foreground sm:uppercase sm:tracking-wide";

  return (
    <VizCard
      id="payoff-comparison"
      title="Your payoff, side by side"
      description={`The dashed line is the regular schedule. The green area is ${planLabel.toLowerCase()}; the gap between them is how far ahead you are.`}
      actions={
        <ViewToggle
          label="Show as"
          value={view}
          onChange={setView}
          options={[
            { value: "chart", label: "Chart" },
            { value: "table", label: "By year" },
          ]}
        />
      }
    >
      <StatRow stats={stats} className="mb-5" />
      {view === "chart" ? (
        <BalanceComparisonChart
          loanAmount={loanAmount}
          standard={standard}
          plan={plan}
          standardLabel={standardLabel}
          planLabel={planLabel}
          standardMonths={standardMonths}
          planMonths={planMonths}
        />
      ) : (
        <div className="-mx-4 max-h-[420px] overflow-auto border-t border-border sm:-mx-6">
          <table className="w-full border-collapse text-[12.5px] tabular-nums sm:text-sm">
            <caption className="sr-only">Balance each year on both schedules, how far ahead you are, and interest saved so far</caption>
            <thead className="sticky top-0 z-10 bg-card shadow-[0_1px_0_hsl(var(--border))]">
              <tr>
                <th scope="col" className={cn(th, "pl-2.5 text-left sm:pl-6")}>Year</th>
                <th scope="col" className={th}>{standardLabel}</th>
                <th scope="col" className={th}>{planLabel}</th>
                <th scope="col" className={cn(th, "hidden sm:table-cell")}>Ahead by</th>
                <th scope="col" className={cn(th, "pr-2.5 sm:pr-6")}>Interest saved</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.year} className="border-b border-border/60 hover:bg-secondary/40">
                  <th scope="row" className="py-2.5 pl-2.5 pr-1 text-left sm:pr-3 font-medium sm:pl-6">{r.year}</th>
                  <td className="px-1 py-2.5 sm:px-3 text-right text-muted-foreground">{formatCurrency(r.standard)}</td>
                  <td className="px-1 py-2.5 sm:px-3 text-right font-medium">
                    {r.plan === 0 ? <span className="font-semibold text-success">Paid off</span> : formatCurrency(r.plan)}
                  </td>
                  <td className="hidden px-1 py-2.5 sm:px-3 text-right sm:table-cell">{formatCurrency(r.ahead)}</td>
                  <td className="py-2.5 pl-1 pr-2.5 text-right sm:pl-3 font-semibold text-success sm:pr-6">{formatCurrency(r.saved)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </VizCard>
  );
};

export default PayoffComparison;
