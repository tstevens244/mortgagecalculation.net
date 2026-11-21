import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { explain } from "./theme";

interface VizCardProps {
  id?: string;
  title: string;
  /** One sentence on what the chart answers. */
  description?: ReactNode;
  /** Controls shown at the top right (view toggles, downloads). */
  actions?: ReactNode;
  /** Small print under the chart: what's included, assumptions. */
  footnote?: ReactNode;
  className?: string;
  children: ReactNode;
}

/** The card every chart, bar and comparison table sits in. */
const VizCard = ({ id, title, description, actions, footnote, className, children }: VizCardProps) => {
  const headingId = id ? `${id}-heading` : undefined;
  return (
    <section id={id} className={cn("viz-card", className)} aria-labelledby={headingId}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h3 id={headingId} className="font-display text-lg font-semibold text-foreground">
            {title}
          </h3>
          {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
        </div>
        {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
      </div>
      <div className="mt-5">{children}</div>
      {footnote && <p className="mt-4 text-xs leading-relaxed text-muted-foreground">{footnote}</p>}
    </section>
  );
};

export default VizCard;

/** Segmented control for switching chart views. */
export function ViewToggle<T extends string>({
  value,
  onChange,
  options,
  label,
}: {
  value: T;
  onChange: (v: NoInfer<T>) => void;
  options: { value: NoInfer<T>; label: string }[];
  label: string;
}) {
  return (
    <div className="inline-flex rounded-lg bg-secondary p-1" role="group" aria-label={label}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          aria-pressed={value === o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
            value === o.value ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export interface Stat {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  tone?: "default" | "positive" | "negative";
}

/** A row of key numbers that explain the chart ("Principal overtakes interest: year 18"). */
export const StatRow = ({ stats, className }: { stats: Stat[]; className?: string }) => (
  <dl className={cn("grid grid-cols-2 gap-2 sm:grid-cols-[repeat(auto-fit,minmax(9.5rem,1fr))] sm:gap-3", className)}>
    {stats.map((s) => (
      <div key={s.label} className="rounded-xl border border-border bg-background/60 px-3 py-2.5">
        <dt className="text-xs font-medium text-muted-foreground">{s.label}</dt>
        <dd
          className={cn(
            "mt-0.5 text-base font-semibold tabular-nums text-foreground sm:text-lg",
            s.tone === "positive" && "text-success",
            s.tone === "negative" && "text-destructive",
          )}
        >
          {s.value}
        </dd>
        {s.hint && <dd className="text-xs text-muted-foreground">{s.hint}</dd>}
      </div>
    ))}
  </dl>
);

export interface LegendItem {
  label: string;
  color: string;
  /** How the series is drawn, so the swatch matches. */
  shape?: "dot" | "line" | "dashed" | "area";
  /** What the color means, shown on hover or tap. Defaults to a standard explanation for common labels. */
  description?: string;
}

/** One legend entry. Hover, tap or tab to it to see what the color means. */
const LegendEntry = ({ item }: { item: LegendItem }) => {
  const [open, setOpen] = useState(false);
  const meaning = item.description ?? explain(item.label);
  const content = (
    <>
      <Swatch color={item.color} shape={item.shape} />
      {item.label}
    </>
  );
  if (!meaning) return <li className="inline-flex items-center gap-2">{content}</li>;
  return (
    <li className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        type="button"
        className="inline-flex items-center gap-2 rounded-md underline decoration-dotted decoration-muted-foreground/60 underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-expanded={open}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={() => setOpen((o) => !o)}
      >
        {content}
      </button>
      {open && (
        <span
          role="tooltip"
          className="absolute left-0 top-full z-30 mt-2 block w-60 rounded-xl border border-border bg-card/95 px-3 py-2.5 text-xs leading-snug text-muted-foreground shadow-lg backdrop-blur animate-in fade-in-0 zoom-in-95"
        >
          <span className="mb-1 flex items-center gap-2 text-sm font-semibold text-foreground">
            <Swatch color={item.color} shape={item.shape} />
            {item.label}
          </span>
          {meaning}
        </span>
      )}
    </li>
  );
};

/** HTML legend (readable text, wraps on phones), used above recharts charts. */
export const Legend = ({ items, className }: { items: LegendItem[]; className?: string }) => (
  <ul className={cn("flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-foreground sm:text-sm", className)}>
    {items.map((i) => (
      <LegendEntry key={i.label} item={i} />
    ))}
  </ul>
);

export const Swatch = ({ color, shape = "dot" }: { color: string; shape?: LegendItem["shape"] }) => {
  if (shape === "line" || shape === "dashed")
    return (
      <svg width="18" height="8" aria-hidden="true" className="shrink-0">
        <line x1="1" y1="4" x2="17" y2="4" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeDasharray={shape === "dashed" ? "4 3" : undefined} />
      </svg>
    );
  if (shape === "area")
    return <span className="h-3 w-4 shrink-0 rounded-sm border-t-2" style={{ borderColor: color, background: `color-mix(in srgb, ${color} 22%, transparent)` }} aria-hidden="true" />;
  return <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: color }} aria-hidden="true" />;
};

/** The card shown when hovering or tapping a chart. */
export const TooltipCard = ({
  title,
  rows,
  footer,
}: {
  title: ReactNode;
  rows: { label: string; value: string; color?: string; shape?: LegendItem["shape"]; strong?: boolean }[];
  footer?: ReactNode;
}) => (
  <div className="min-w-[200px] rounded-xl border border-border bg-card/95 p-3 text-sm shadow-lg backdrop-blur">
    <p className="mb-2 font-semibold text-foreground">{title}</p>
    <div className="space-y-1">
      {rows.map((r) => (
        <div key={r.label} className="flex items-center justify-between gap-4 tabular-nums">
          <span className="inline-flex items-center gap-2 text-muted-foreground">
            {r.color && <Swatch color={r.color} shape={r.shape} />}
            {r.label}
          </span>
          <span className={cn("text-foreground", r.strong ? "font-semibold" : "font-medium")}>{r.value}</span>
        </div>
      ))}
    </div>
    {footer && <div className="mt-2 border-t border-border pt-2 text-xs text-muted-foreground">{footer}</div>}
  </div>
);
