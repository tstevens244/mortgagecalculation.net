import { useState } from "react";
import { MARKET_RATES, formatSurveyDate } from "@/lib/marketRates";
import { cn } from "@/lib/utils";

const W = 320;
const H = 72;
const PAD = 4;

const SERIES = [
  { key: "r30", label: "30-year fixed", rate: MARKET_RATES.rate30, prev: MARKET_RATES.prev30, color: "hsl(var(--chart-primary))" },
  { key: "r15", label: "15-year fixed", rate: MARKET_RATES.rate15, prev: MARKET_RATES.prev15, color: "hsl(var(--chart-tertiary))" },
] as const;

/** This week's national average rates from Freddie Mac, with a 52-week trend. */
const RatesThisWeek = ({ className }: { className?: string }) => {
  const h = MARKET_RATES.history;
  const all = h.flatMap((d) => [d.r30, d.r15]);
  const min = Math.min(...all);
  const max = Math.max(...all);
  const x = (i: number) => PAD + (i / (h.length - 1)) * (W - PAD * 2);
  const y = (v: number) => PAD + (1 - (v - min) / (max - min || 1)) * (H - PAD * 2);
  const [hover, setHover] = useState<number | null>(null);
  const point = hover !== null ? h[hover] : null;
  const yearAgo = h[0];

  return (
    <section aria-labelledby="rates-heading" className={cn("viz-card", className)}>
      <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
        <h2 id="rates-heading" className="font-display text-xl font-semibold text-foreground">
          Average mortgage rates this week
        </h2>
        <p className="text-xs text-muted-foreground">
          Week of {formatSurveyDate(MARKET_RATES.asOf)} ·{" "}
          <a href={MARKET_RATES.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline decoration-dotted underline-offset-2 hover:text-foreground">
            Freddie Mac PMMS
          </a>
        </p>
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-[auto_1fr] sm:items-center">
        <dl className="grid grid-cols-2 gap-3 sm:w-72">
          {SERIES.map((s) => {
            const change = s.rate - s.prev;
            return (
              <div key={s.key} className="rounded-xl border border-border bg-background/60 px-3 py-2.5">
                <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="h-2 w-2 rounded-full" style={{ background: s.color }} aria-hidden="true" />
                  {s.label}
                </dt>
                <dd className="mt-1 font-display text-2xl font-bold tabular-nums text-foreground">{s.rate.toFixed(2)}%</dd>
                <dd className="text-xs tabular-nums text-muted-foreground">
                  {Math.abs(change) < 0.005 ? "Unchanged" : `${change > 0 ? "Up" : "Down"} ${Math.abs(change).toFixed(2)}`} from last week
                </dd>
              </div>
            );
          })}
        </dl>

        <figure className="min-w-0">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="h-20 w-full overflow-visible"
            preserveAspectRatio="none"
            role="img"
            aria-label={`Over the past year the 30-year average moved from ${yearAgo.r30}% to ${MARKET_RATES.rate30}%, and the 15-year from ${yearAgo.r15}% to ${MARKET_RATES.rate15}%.`}
            onMouseLeave={() => setHover(null)}
            onMouseMove={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              const i = Math.round(((e.clientX - r.left) / r.width) * (h.length - 1));
              setHover(Math.max(0, Math.min(h.length - 1, i)));
            }}
          >
            {SERIES.map((s) => (
              <polyline
                key={s.key}
                fill="none"
                stroke={s.color}
                strokeWidth={2}
                vectorEffect="non-scaling-stroke"
                strokeLinejoin="round"
                points={h.map((d, i) => `${x(i)},${y(d[s.key])}`).join(" ")}
              />
            ))}
            {hover !== null && (
              <line x1={x(hover)} x2={x(hover)} y1={0} y2={H} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" vectorEffect="non-scaling-stroke" />
            )}
          </svg>
          <figcaption className="mt-1 text-xs tabular-nums text-muted-foreground" aria-live="polite">
            {point ? (
              <span className="block text-center">
                Week of {formatSurveyDate(point.date)}: 30-yr {point.r30.toFixed(2)}%, 15-yr {point.r15.toFixed(2)}%
              </span>
            ) : (
              <>
                <span className="flex justify-between">
                  <span>{formatSurveyDate(yearAgo.date)}</span>
                  <span>This week</span>
                </span>
                <span className="mt-0.5 block text-center">
                  52-week range {min.toFixed(2)}%–{max.toFixed(2)}%
                </span>
              </>
            )}
          </figcaption>
        </figure>
      </div>
      <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
        National averages for borrowers with strong credit and 20% down. Your rate depends on your credit, down payment,
        loan type and points. Tap "Use avg." under any rate field to plug in this week's figure.
      </p>
    </section>
  );
};

export default RatesThisWeek;
