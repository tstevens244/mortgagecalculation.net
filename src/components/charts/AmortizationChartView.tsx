import { useMemo, useState } from "react";
import {
  Area,
  ComposedChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCurrency } from "@/lib/formatters";
import { byLoanYear, milestones, yearOfMonth, type AmortizationRow } from "@/lib/amortization";
import VizCard, { Legend, StatRow, TooltipCard, ViewToggle } from "@/components/viz/VizCard";
import { SERIES, cursorLine, gridProps, pct, xAxisProps, yAxisProps } from "@/components/viz/theme";

type View = "balance" | "split";

const monthYear = (d: Date) => d.toLocaleDateString("en-US", { month: "short", year: "numeric" });

/**
 * How the loan pays down. "Balance" shows what you owe next to what you've paid
 * in principal and in interest so far; "Yearly split" shows each year's payments
 * divided between principal and interest, so you can see the shift toward principal.
 */
const AmortizationChartView = ({ data }: { data: AmortizationRow[] }) => {
  const [view, setView] = useState<View>("balance");

  const { years, m, points } = useMemo(() => {
    const years = byLoanYear(data);
    const m = milestones(data);
    // Start at year 0 so the balance line begins at the full loan amount.
    const points = [
      { year: 0, balance: m.loanAmount, cumPrincipal: 0, cumInterest: 0, calendarYear: data[0]?.date.getFullYear() },
      ...years.map((y) => ({ year: y.year, balance: y.balance, cumPrincipal: y.cumPrincipal, cumInterest: y.cumInterest, calendarYear: y.calendarYear })),
    ];
    return { years, m, points };
  }, [data]);

  if (!data.length) return null;

  const crossoverYear = m.crossoverMonth ? yearOfMonth(m.crossoverMonth) : null;
  const halfwayYear = m.halfwayMonth ? yearOfMonth(m.halfwayMonth) : null;
  const rowFor = (month: number | null) => (month ? data[month - 1] : undefined);
  const payoffDate = rowFor(m.payoffMonth)?.date;

  const stats = [
    { label: "Total interest", value: formatCurrency(m.totalInterest), hint: `${pct(m.totalInterest, m.loanAmount)} of the amount borrowed` },
    {
      label: "Principal passes interest",
      value: crossoverYear ? `Year ${crossoverYear}` : "From the start",
      hint: crossoverYear ? monthYear(rowFor(m.crossoverMonth)!.date) : undefined,
    },
    { label: "Half paid off", value: halfwayYear ? `Year ${halfwayYear}` : "—", hint: halfwayYear ? monthYear(rowFor(m.halfwayMonth)!.date) : undefined },
    { label: "Paid off", value: payoffDate ? monthYear(payoffDate) : "—", hint: `${data.length} payments` },
  ];

  const summary =
    `Loan of ${formatCurrency(m.loanAmount)} paid off by ${payoffDate ? monthYear(payoffDate) : "the end of the term"}, ` +
    `with ${formatCurrency(m.totalInterest)} in interest.` +
    (crossoverYear ? ` More of each payment goes to principal than interest starting in year ${crossoverYear}.` : "");

  return (
    <VizCard
      id="amortization-chart"
      title="How your loan pays down"
      description={
        view === "balance"
          ? "What you still owe, and what you've paid in principal and interest so far, year by year."
          : "Each year's payments split into principal and interest. Early payments are mostly interest."
      }
      actions={
        <ViewToggle
          label="Chart view"
          value={view}
          onChange={setView}
          options={[
            { value: "balance", label: "Balance" },
            { value: "split", label: "Yearly split" },
          ]}
        />
      }
      footnote="Principal and interest only. Property tax, insurance, PMI and HOA dues don't change what you owe, so they're left out here."
    >
      <StatRow stats={stats} className="mb-5" />

      {view === "balance" ? (
        <Legend
          className="mb-3"
          items={[
            { label: "Balance owed", color: SERIES.balance, shape: "area" },
            { label: "Principal paid so far", color: SERIES.principal, shape: "line" },
            { label: "Interest paid so far", color: SERIES.interest, shape: "line" },
          ]}
        />
      ) : (
        <Legend
          className="mb-3"
          items={[
            { label: "Principal", color: SERIES.principal },
            { label: "Interest", color: SERIES.interest },
          ]}
        />
      )}

      <div className="h-[260px] sm:h-[340px]" role="img" aria-label={summary}>
        <ResponsiveContainer width="100%" height="100%">
          {view === "balance" ? (
            <ComposedChart data={points} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="amort-balance" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={SERIES.balance} stopOpacity={0.32} />
                  <stop offset="100%" stopColor={SERIES.balance} stopOpacity={0.02} />
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
                  return (
                    <TooltipCard
                      title={p.year === 0 ? "At closing" : `End of year ${p.year} · ${p.calendarYear}`}
                      rows={[
                        { label: "Balance owed", value: formatCurrency(p.balance), color: SERIES.balance, shape: "area", strong: true },
                        { label: "Principal paid", value: formatCurrency(p.cumPrincipal), color: SERIES.principal, shape: "line" },
                        { label: "Interest paid", value: formatCurrency(p.cumInterest), color: SERIES.interest, shape: "line" },
                      ]}
                      footer={p.year > 0 ? `${pct(p.cumPrincipal, m.loanAmount)} of the loan repaid` : undefined}
                    />
                  );
                }}
              />
              {halfwayYear && (
                <ReferenceLine
                  x={halfwayYear}
                  stroke="hsl(var(--muted-foreground))"
                  strokeDasharray="3 3"
                  label={{ value: "Half paid", position: "insideTopRight", fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                />
              )}
              <Area isAnimationActive={false} type="monotone" dataKey="balance" stroke={SERIES.balance} strokeWidth={2.5} fill="url(#amort-balance)" />
              <Line isAnimationActive={false} type="monotone" dataKey="cumPrincipal" stroke={SERIES.principal} strokeWidth={2.5} dot={false} />
              <Line isAnimationActive={false} type="monotone" dataKey="cumInterest" stroke={SERIES.interest} strokeWidth={2.5} dot={false} />
            </ComposedChart>
          ) : (
            <BarChart data={years} margin={{ top: 8, right: 8, left: 0, bottom: 0 }} barCategoryGap="18%">
              <CartesianGrid {...gridProps} />
              <XAxis dataKey="year" {...xAxisProps} tickFormatter={(y) => `Yr ${y}`} interval="preserveStartEnd" minTickGap={16} />
              <YAxis {...yAxisProps} />
              <Tooltip
                cursor={{ fill: "hsl(var(--secondary))" }}
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const y = payload[0].payload as (typeof years)[number];
                  return (
                    <TooltipCard
                      title={`Year ${y.year} · ${y.calendarYear}`}
                      rows={[
                        { label: "Principal", value: formatCurrency(y.principal), color: SERIES.principal },
                        { label: "Interest", value: formatCurrency(y.interest), color: SERIES.interest },
                        { label: "Paid this year", value: formatCurrency(y.principal + y.interest), strong: true },
                      ]}
                      footer={`${pct(y.principal, y.principal + y.interest)} went to principal`}
                    />
                  );
                }}
              />
              {crossoverYear && (
                <ReferenceLine
                  x={crossoverYear}
                  stroke="hsl(var(--foreground))"
                  strokeDasharray="3 3"
                  label={{ value: "Principal > interest", position: "insideTopLeft", fill: "hsl(var(--foreground))", fontSize: 11 }}
                />
              )}
              <Bar isAnimationActive={false} dataKey="principal" stackId="p" fill={SERIES.principal} />
              <Bar isAnimationActive={false} dataKey="interest" stackId="p" fill={SERIES.interest} radius={[3, 3, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </VizCard>
  );
};

export default AmortizationChartView;
