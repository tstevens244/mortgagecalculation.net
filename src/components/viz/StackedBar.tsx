import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/formatters";
import { Swatch } from "./VizCard";
import { explain } from "./theme";

export interface Segment {
  label: string;
  value: number;
  color: string;
  /** Short explanation shown under the label in the legend and in the tooltip. */
  note?: ReactNode;
  /** What this color means, shown in the tooltip. Defaults to a standard explanation for common labels. */
  description?: string;
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

const fill = (s: Segment) =>
  s.muted ? `repeating-linear-gradient(135deg, ${s.color} 0 4px, color-mix(in srgb, ${s.color} 45%, transparent) 4px 8px)` : s.color;

/**
 * A single horizontal bar split into parts. Plain HTML (no chart library), so it
 * renders in the prerendered page, stays sharp, and reads well on a phone.
 * Hover, tap or tab to a part to see what it is, its amount and its share;
 * the matching legend row lights up too.
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
  const [active, setActive] = useState<number | null>(null);
  const parts = segments.filter((s) => s.value > 0);
  const sum = parts.reduce((t, s) => t + s.value, 0);
  const width = Math.max(max ?? sum, sum, ...markers.map((m) => m.value), 1);
  const height = size === "lg" ? "h-5" : size === "sm" ? "h-2.5" : "h-3.5";
  const share = (v: number) => (sum > 0 ? `${((v / sum) * 100).toFixed(0)}%` : "");

  // Left edge and center of each part, in % of the bar, for placing the tooltip.
  let run = 0;
  const spans = parts.map((s) => {
    const left = (run / width) * 100;
    run += s.value;
    return { left, center: left + (s.value / width) * 50 };
  });

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
  const tip = active !== null ? parts[active] : null;
  const tipCenter = active !== null ? spans[active].center : 0;

  return (
    <div className={className} onMouseLeave={() => setActive(null)}>
      {(title || total) && (
        <div className="mb-2 flex items-baseline justify-between gap-3 text-sm">
          <span className="font-medium text-foreground">{title}</span>
          {total && <span className="font-semibold tabular-nums text-foreground">{total}</span>}
        </div>
      )}
      <div className={cn("relative", markers.length > 0 && (twoRows ? "pb-10" : "pb-6"))}>
        <div className={cn("flex w-full gap-[2px] overflow-hidden rounded-full bg-secondary", height)} role="group" aria-label={label}>
          {parts.map((s, i) => (
            <button
              key={s.label}
              type="button"
              aria-label={`${s.label}: ${format(s.value)}${showShare ? `, ${share(s.value)}` : ""}`}
              className={cn(
                "h-full cursor-default transition-opacity first:rounded-l-full last:rounded-r-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
                active !== null && active !== i && "opacity-35",
              )}
              style={{ width: `${(s.value / width) * 100}%`, background: fill(s) }}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(null)}
              onClick={() => setActive((a) => (a === i ? null : i))}
            />
          ))}
        </div>

        {tip && (
          <div
            role="tooltip"
            className="pointer-events-none absolute bottom-full z-20 mb-2.5 w-max max-w-[15rem] rounded-xl border border-border bg-card/95 px-3 py-2.5 text-sm shadow-lg backdrop-blur animate-in fade-in-0 zoom-in-95"
            style={{
              left: `${tipCenter}%`,
              transform: `translateX(${tipCenter < 18 ? "-12%" : tipCenter > 82 ? "-88%" : "-50%"})`,
            }}
          >
            <span className="flex items-center gap-2 font-semibold text-foreground">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: fill(tip) }} aria-hidden="true" />
              {tip.label}
            </span>
            <span className="mt-1 flex items-baseline gap-2 tabular-nums">
              <span className="text-base font-semibold text-foreground">{format(tip.value)}</span>
              {showShare && <span className="text-xs text-muted-foreground">{share(tip.value)} of the total</span>}
            </span>
            {(tip.description ?? explain(tip.label)) && (
              <span className="mt-1 block text-xs leading-snug text-muted-foreground">{tip.description ?? explain(tip.label)}</span>
            )}
          </div>
        )}

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
          {parts.map((s, i) => (
            <li
              key={s.label}
              className={cn(
                "-mx-2 flex items-center justify-between gap-3 rounded-lg px-2 py-2 text-sm transition-colors",
                active === i && "bg-secondary/70",
              )}
              onMouseEnter={() => setActive(i)}
            >
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
                {showShare && sum > 0 && <span className="block text-xs text-muted-foreground">{share(s.value)}</span>}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default StackedBar;
