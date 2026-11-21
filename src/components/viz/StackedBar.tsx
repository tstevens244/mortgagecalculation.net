import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/formatters";
import { Swatch } from "./VizCard";

export interface Segment {
  label: string;
  value: number;
  color: string;
  /** Short explanation shown under the label in the legend. */
  note?: ReactNode;
  /** Draw hatched, for money that isn't spent (equity, cash left over). */
  muted?: boolean;
}

export interface Marker {
  value: number;
  label: string;
}

interface StackedBarProps {
  segments: Segment[];
  /** Full width of the bar. Defaults to the sum of the segments; pass a shared max to compare bars. */
  max?: number;
  /** Lines across the bar, like a lender limit. */
  markers?: Marker[];
  /** Label shown above the bar (for side-by-side bars). */
  title?: ReactNode;
  /** Value shown at the right of the title. */
  total?: ReactNode;
  /** List each segment with its amount and share under the bar. */
  legend?: boolean;
  /** Format for legend amounts. */
  format?: (v: number) => string;
  /** Show each segment's share of the total in the legend. */
  showShare?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
  /** Accessible summary; defaults to the segments listed. */
  ariaLabel?: string;
}

/**
 * A single horizontal bar split into parts. Plain HTML (no chart library), so it
 * renders in the prerendered page, stays sharp, and reads well on a phone.
 */
const StackedBar = ({
  segments,
  max,
  markers = [],
  title,
  total,
  legend = false,
  format = formatCurrency,
  showShare = true,
  size = "md",
  className,
  ariaLabel,
}: StackedBarProps) => {
  const parts = segments.filter((s) => s.value > 0);
  const sum = parts.reduce((t, s) => t + s.value, 0);
  const width = Math.max(max ?? sum, sum, ...markers.map((m) => m.value), 1);
  const height = size === "lg" ? "h-5" : size === "sm" ? "h-2.5" : "h-3.5";
  // Markers close together put their labels on a second line so they don't overlap.
  const sorted = [...markers].sort((a, b) => a.value - b.value);
  const rowOf = new Map<string, number>();
  sorted.forEach((m, i) => {
    const prev = sorted[i - 1];
    const close = prev && ((m.value - prev.value) / width) * 100 < 14;
    rowOf.set(m.label, close ? 1 - (rowOf.get(prev.label) ?? 0) : 0);
  });
  const twoRows = [...rowOf.values()].some((r) => r === 1);
  const label = ariaLabel ?? parts.map((p) => `${p.label} ${format(p.value)}`).join(", ");

  return (
    <div className={className}>
      {(title || total) && (
        <div className="mb-2 flex items-baseline justify-between gap-3 text-sm">
          <span className="font-medium text-foreground">{title}</span>
          {total && <span className="font-semibold tabular-nums text-foreground">{total}</span>}
        </div>
      )}
      <div className={cn("relative", markers.length > 0 && (twoRows ? "pb-10" : "pb-6"))}>
        <div className={cn("flex w-full gap-[2px] overflow-hidden rounded-full bg-secondary", height)} role="img" aria-label={label}>
          {parts.map((s) => (
            <div
              key={s.label}
              className="h-full first:rounded-l-full last:rounded-r-full"
              style={{
                width: `${(s.value / width) * 100}%`,
                background: s.muted
                  ? `repeating-linear-gradient(135deg, ${s.color} 0 4px, color-mix(in srgb, ${s.color} 45%, transparent) 4px 8px)`
                  : s.color,
              }}
              title={`${s.label}: ${format(s.value)}`}
            />
          ))}
        </div>
        {markers.map((m) => {
          const left = (m.value / width) * 100;
          const barPx = size === "lg" ? 20 : size === "sm" ? 10 : 14;
          return (
            <div
              key={m.label}
              className="pointer-events-none absolute top-[-3px] flex flex-col items-start"
              style={{ left: `${left}%` }}
              aria-hidden="true"
            >
              <div className="-ml-px border-l-2 border-dashed border-foreground/70" style={{ height: barPx + 6 + (rowOf.get(m.label) ? 16 : 0) }} />
              <span
                className={cn(
                  "mt-1 whitespace-nowrap text-[11px] font-medium text-foreground",
                  left > 75 ? "-translate-x-full" : left > 20 ? "-translate-x-1/2" : "",
                )}
              >
                {m.label}
              </span>
            </div>
          );
        })}
      </div>
      {legend && (
        <ul className="mt-4 divide-y divide-border/70">
          {parts.map((s) => (
            <li key={s.label} className="flex items-center justify-between gap-3 py-2 text-sm">
              <span className="flex min-w-0 items-start gap-2.5">
                <span className="mt-1.5">
                  <Swatch color={s.color} />
                </span>
                <span className="min-w-0">
                  <span className="block font-medium text-foreground">{s.label}</span>
                  {s.note && <span className="block text-xs text-muted-foreground">{s.note}</span>}
                </span>
              </span>
              <span className="shrink-0 text-right tabular-nums">
                <span className="block font-semibold text-foreground">{format(s.value)}</span>
                {showShare && sum > 0 && (
                  <span className="block text-xs text-muted-foreground">{((s.value / sum) * 100).toFixed(0)}%</span>
                )}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default StackedBar;
