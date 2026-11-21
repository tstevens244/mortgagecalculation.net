// One color and axis vocabulary for every chart and bar on the site, so the
// same thing (interest, principal, taxes…) is always the same color.

export const SERIES = {
  principal: "hsl(var(--chart-primary))", // navy
  interest: "hsl(var(--chart-secondary))", // amber
  balance: "hsl(var(--chart-tertiary))", // sky
  tax: "hsl(var(--chart-tertiary))", // sky
  insurance: "hsl(var(--chart-quaternary))", // green
  pmi: "hsl(350 65% 52%)", // rose
  hoa: "hsl(262 48% 56%)", // violet
  maintenance: "hsl(28 70% 48%)", // clay
  fees: "hsl(215 16% 47%)", // slate
  other: "hsl(215 20% 72%)", // light slate
  positive: "hsl(152 60% 36%)", // savings, "you're ahead"
  negative: "hsl(0 72% 45%)", // costs, "you're behind"
  baseline: "hsl(215 16% 58%)", // the option you're comparing against
  equity: "hsl(152 60% 36%)",
} as const;

/** $1.2M, $350k, $950, −$12k */
export function compactCurrency(value: number): string {
  const sign = value < 0 ? "−" : "";
  const v = Math.abs(value);
  if (v >= 1_000_000) return `${sign}$${(v / 1_000_000).toFixed(v >= 10_000_000 ? 0 : 1).replace(/\.0$/, "")}M`;
  if (v >= 10_000) return `${sign}$${Math.round(v / 1000)}k`;
  if (v >= 1000) return `${sign}$${(v / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  return `${sign}$${Math.round(v)}`;
}

export const pct = (part: number, whole: number, digits = 0) =>
  whole > 0 ? `${((part / whole) * 100).toFixed(digits)}%` : "0%";

// Shared recharts props. Quiet axes and a faint horizontal grid.
export const axisTick = { fill: "hsl(var(--muted-foreground))", fontSize: 11 };
export const xAxisProps = { tick: axisTick, tickLine: false, axisLine: false, tickMargin: 8 } as const;
export const yAxisProps = { tick: axisTick, tickLine: false, axisLine: false, width: 52, tickFormatter: compactCurrency } as const;
export const gridProps = { vertical: false, stroke: "hsl(var(--border))", strokeDasharray: "4 4" } as const;
export const cursorLine = { stroke: "hsl(var(--muted-foreground))", strokeWidth: 1, strokeDasharray: "3 3" };
