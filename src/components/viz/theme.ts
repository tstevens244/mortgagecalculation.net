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

// What each color means, shown when someone hovers or taps it. Keyed by the
// label used in the charts (case-insensitive).
const MEANINGS: Record<string, string> = {
  principal: "Pays down what you owe. Each dollar becomes equity in the home.",
  "principal & interest": "Your loan payment. Part repays the balance, part is the lender's interest.",
  "principal and interest": "Your loan payment. Part repays the balance, part is the lender's interest.",
  interest: "What the lender charges to borrow. It doesn't reduce your balance.",
  "property tax": "Paid to your county or city, usually collected monthly through escrow.",
  "home insurance": "Homeowners coverage your lender requires, usually paid through escrow.",
  pmi: "Private mortgage insurance. Protects the lender when you put down less than 20%, and ends once you reach about 22% equity.",
  mip: "FHA mortgage insurance. Protects the lender; how long it lasts depends on your down payment.",
  "guarantee fee": "USDA's annual fee for guaranteeing the loan, paid monthly.",
  "hoa dues": "Homeowners association fees for shared upkeep and amenities.",
  maintenance: "Repairs and upkeep. Plan on about 1% of the home's value a year.",
  rent: "What you'd pay your landlord each month.",
  "balance owed": "What you still owe the lender at the end of each year.",
  "principal paid so far": "Total principal repaid since the loan started: the equity you've built from payments.",
  "interest paid so far": "Total interest paid to the lender since the loan started.",
  "current mortgage": "What you owe now. The new loan pays this off first.",
  "cash out": "Money you receive from the new loan, on top of paying off the old one.",
  "fees added to the loan": "Closing costs rolled into the new balance instead of paid in cash.",
  "equity you keep": "The part of your home's value you still own outright after the refinance.",
  "housing payment": "Your full monthly housing cost: loan payment, taxes, insurance and any PMI or HOA.",
  "other debt payments": "Car, student loan and credit card minimums, and other monthly debts lenders count.",
  "left for everything else": "Income left after housing and debts, before taxes.",
  "first mortgage": "The main loan's monthly principal and interest.",
  "second mortgage": "The piggyback loan's monthly payment, usually at a higher rate.",
  "tax, insurance, hoa": "Property tax, homeowners insurance and HOA dues. The same for both options.",
  balance: "The amount you owe today.",
  "balance you owe": "The amount you owe today, repaid either way.",
  "closing costs": "Fees to set up the new loan, paid up front.",
};

export const explain = (label: string): string | undefined => MEANINGS[label.toLowerCase()];
