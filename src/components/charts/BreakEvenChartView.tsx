import { useMemo } from "react";
import { Area, AreaChart, CartesianGrid, ReferenceDot, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatCurrency } from "@/lib/formatters";
import { Legend, TooltipCard } from "@/components/viz/VizCard";
import { SERIES, cursorLine, gridProps, xAxisProps, yAxisProps } from "@/components/viz/theme";

export interface BreakEvenProps {
  /** One point per year: the running advantage of the option (positive = it's ahead). */
  points: { year: number; value: number }[];
  /** "Buying is ahead" / "Refinancing is ahead". */
  aheadLabel: string;
  /** "Renting is ahead" / "Refinancing hasn't paid off yet". */
  behindLabel: string;
  /** Year where the line crosses zero, if it does (can be fractional). */
  breakEvenYear: number | null;
  /** A year to mark, e.g. when you plan to sell. */
  markerYear?: number;
  markerLabel?: string;
  /** Tooltip title for a year. */
  yearTitle?: (year: number) => string;
}

/**
 * Running advantage over time: green above zero (ahead), red below (behind),
 * with the break-even point marked. One chart answers "how long until this pays off?".
 */
const BreakEvenChartView = ({
  points,
  aheadLabel,
  behindLabel,
  breakEvenYear,
  markerYear,
  markerLabel,
  yearTitle = (y) => (y === 0 ? "Today" : `After ${y} year${y === 1 ? "" : "s"}`),
}: BreakEvenProps) => {
  // Where zero sits in the gradient (0 = top of the plot, 1 = bottom), so the fill flips color at zero.
  const zero = useMemo(() => {
    const vals = points.map((p) => p.value);
    const max = Math.max(...vals, 0);
    const min = Math.min(...vals, 0);
    return max === min ? 0.5 : max / (max - min);
  }, [points]);

  const last = points[points.length - 1];
  const summary =
    breakEvenYear !== null
      ? `Breaks even after about ${breakEvenYear.toFixed(1)} years; ${last.value >= 0 ? "ahead" : "behind"} by ${formatCurrency(Math.abs(last.value))} after ${last.year} years.`
      : `${last.value >= 0 ? "Ahead" : "Behind"} the whole time; ${formatCurrency(Math.abs(last.value))} after ${last.year} years.`;

  return (
    <div>
      <Legend
        className="mb-3"
        items={[
          { label: aheadLabel, color: SERIES.positive, shape: "area" },
          { label: behindLabel, color: SERIES.negative, shape: "area" },
        ]}
      />
      <div className="h-[240px] sm:h-[300px]" role="img" aria-label={summary}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={points} margin={{ top: 16, right: 12, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="be-stroke" x1="0" y1="0" x2="0" y2="1">
                <stop offset={zero} stopColor={SERIES.positive} />
                <stop offset={zero} stopColor={SERIES.negative} />
              </linearGradient>
              <linearGradient id="be-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset={0} stopColor={SERIES.positive} stopOpacity={0.28} />
                <stop offset={zero} stopColor={SERIES.positive} stopOpacity={0.04} />
                <stop offset={zero} stopColor={SERIES.negative} stopOpacity={0.04} />
                <stop offset={1} stopColor={SERIES.negative} stopOpacity={0.24} />
              </linearGradient>
            </defs>
            <CartesianGrid {...gridProps} />
            <XAxis dataKey="year" type="number" domain={["dataMin", "dataMax"]} {...xAxisProps} tickFormatter={(y) => (y === 0 ? "Now" : `Yr ${y}`)} />
            <YAxis {...yAxisProps} />
            <ReferenceLine y={0} stroke="hsl(var(--foreground))" strokeOpacity={0.5} />
            {markerYear !== undefined && (
              <ReferenceLine
                x={markerYear}
                stroke="hsl(var(--muted-foreground))"
                strokeDasharray="3 3"
                label={{ value: markerLabel, position: "insideTopLeft", fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
              />
            )}
            <Tooltip
              cursor={cursorLine}
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const p = payload[0].payload as { year: number; value: number };
                const ahead = p.value >= 0;
                return (
                  <TooltipCard
                    title={yearTitle(p.year)}
                    rows={[
                      {
                        label: ahead ? aheadLabel : behindLabel,
                        value: formatCurrency(Math.abs(p.value)),
                        color: ahead ? SERIES.positive : SERIES.negative,
                        shape: "area",
                        strong: true,
                      },
                    ]}
                  />
                );
              }}
            />
            <Area isAnimationActive={false} type="monotone" dataKey="value" stroke="url(#be-stroke)" strokeWidth={2.5} fill="url(#be-fill)" baseValue={0} />
            {breakEvenYear !== null && (
              <ReferenceDot
                x={breakEvenYear}
                y={0}
                r={5}
                fill="hsl(var(--card))"
                stroke="hsl(var(--foreground))"
                strokeWidth={2}
                label={{ value: `Break-even · yr ${breakEvenYear.toFixed(1).replace(/\.0$/, "")}`, position: "top", fill: "hsl(var(--foreground))", fontSize: 11, fontWeight: 600 }}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BreakEvenChartView;
