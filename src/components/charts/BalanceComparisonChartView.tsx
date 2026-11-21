import { useMemo } from "react";
import { Area, CartesianGrid, ComposedChart, Line, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatCurrency } from "@/lib/formatters";
import { Legend, TooltipCard } from "@/components/viz/VizCard";
import { SERIES, cursorLine, gridProps, xAxisProps, yAxisProps } from "@/components/viz/theme";

export interface YearPoint {
  /** Loan year (1 = end of the first year). */
  year: number;
  balance: number;
  /** Interest paid from the start through this year. */
  interest: number;
}

export interface BalanceComparisonProps {
  loanAmount: number;
  standard: YearPoint[];
  plan: YearPoint[];
  standardLabel: string;
  planLabel: string;
  /** Payoff time in months, for the payoff markers. */
  standardMonths: number;
  planMonths: number;
}

/**
 * Two payoff paths for the same loan: the regular schedule (dashed) and your
 * plan (green). The gap between them is how far ahead you are; the tooltip also
 * shows interest saved so far.
 */
const BalanceComparisonChartView = ({ loanAmount, standard, plan, standardLabel, planLabel, standardMonths, planMonths }: BalanceComparisonProps) => {
  const points = useMemo(() => {
    const n = Math.max(standard.length, plan.length);
    const rows = [{ year: 0, standard: loanAmount, plan: loanAmount, standardInterest: 0, planInterest: 0 }];
    for (let i = 0; i < n; i++) {
      const s = standard[Math.min(i, standard.length - 1)];
      const p = plan[Math.min(i, plan.length - 1)];
      rows.push({
        year: i + 1,
        standard: i < standard.length ? s.balance : 0,
        plan: i < plan.length ? p.balance : 0,
        standardInterest: s?.interest ?? 0,
        planInterest: p?.interest ?? 0,
      });
    }
    return rows;
  }, [loanAmount, standard, plan]);

  const planYears = planMonths / 12;
  const standardYears = standardMonths / 12;

  return (
    <div>
      <Legend
        className="mb-3"
        items={[
          { label: standardLabel, color: SERIES.baseline, shape: "dashed" },
          { label: planLabel, color: SERIES.positive, shape: "area" },
        ]}
      />
      <div
        className="h-[260px] sm:h-[320px]"
        role="img"
        aria-label={`${planLabel} pays the loan off in ${planYears.toFixed(1)} years instead of ${standardYears.toFixed(1)}.`}
      >
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={points} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="plan-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={SERIES.positive} stopOpacity={0.28} />
                <stop offset="100%" stopColor={SERIES.positive} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid {...gridProps} />
            <XAxis dataKey="year" type="number" domain={[0, "dataMax"]} {...xAxisProps} tickFormatter={(y) => (y === 0 ? "Start" : `Yr ${y}`)} />
            <YAxis {...yAxisProps} />
            <Tooltip
              cursor={cursorLine}
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const p = payload[0].payload as (typeof points)[number];
                const ahead = p.standard - p.plan;
                const saved = p.standardInterest - p.planInterest;
                return (
                  <TooltipCard
                    title={p.year === 0 ? "Start of the loan" : `End of year ${p.year}`}
                    rows={[
                      { label: standardLabel, value: formatCurrency(p.standard), color: SERIES.baseline, shape: "dashed" },
                      { label: planLabel, value: formatCurrency(p.plan), color: SERIES.positive, shape: "area" },
                      { label: "Ahead by", value: formatCurrency(ahead), strong: true },
                    ]}
                    footer={p.year > 0 ? `Interest saved so far: ${formatCurrency(saved)}` : undefined}
                  />
                );
              }}
            />
            <ReferenceLine
              x={planYears}
              stroke={SERIES.positive}
              strokeDasharray="3 3"
              label={{ value: `Paid off · yr ${planYears.toFixed(1).replace(/\.0$/, "")}`, position: "insideTopRight", fill: SERIES.positive, fontSize: 11, fontWeight: 600 }}
            />
            <Area isAnimationActive={false} type="monotone" dataKey="plan" stroke={SERIES.positive} strokeWidth={2.5} fill="url(#plan-fill)" />
            <Line isAnimationActive={false} type="monotone" dataKey="standard" stroke={SERIES.baseline} strokeWidth={2} strokeDasharray="6 4" dot={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BalanceComparisonChartView;
