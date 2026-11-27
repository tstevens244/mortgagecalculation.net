import { useState } from "react";
import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";
import { HOME_VALUES, findStateByCode, formatValueMonth, localInsurance, localTax } from "@/lib/localCosts";
import { useLocalCosts } from "@/lib/useLocalCosts";
import { pmiRate } from "@/lib/pmi";
import { STATE_DATA_YEAR, INSURANCE_DATA_YEAR, statePath } from "@/lib/states";
import { formatCurrency } from "@/lib/formatters";
import { RegionSelect, INSURANCE_SOURCE, TAX_SOURCE } from "@/components/calc/LocalValue";
import { cn } from "@/lib/utils";

const W = 320;
const H = 72;
const PAD = 4;
const LINK = "underline decoration-dotted underline-offset-2 hover:text-foreground";
const PMI_DOWN = 10;
const PMI_CREDIT = 740;

const noop = () => {};

/** Typical home value, property tax, insurance and PMI for the visitor's state, styled like the weekly rates card. */
const LocalCostsCard = ({ className }: { className?: string }) => {
  const { costs, region } = useLocalCosts(noop, { keys: [], enabled: false });
  const v = costs.values;
  const h = v.history;
  const min = Math.min(...h);
  const max = Math.max(...h);
  const x = (i: number) => PAD + (i / (h.length - 1)) * (W - PAD * 2);
  const y = (val: number) => PAD + (1 - (val - min) / (max - min || 1)) * (H - PAD * 2);
  const [hover, setHover] = useState<number | null>(null);

  const yearChange = ((h[h.length - 1] - h[0]) / h[0]) * 100;
  const tax = localTax(costs, v.typical);
  const insurance = localInsurance(costs, v.typical) ?? costs.insurance;
  const pmiPct = pmiRate(100 - PMI_DOWN, PMI_CREDIT);
  const pmiMonthly = (v.typical * (1 - PMI_DOWN / 100) * pmiPct) / 100 / 12;
  const monthLabel = (i: number) => {
    const d = new Date(`${HOME_VALUES.asOf}T00:00:00Z`);
    d.setUTCMonth(d.getUTCMonth() - (h.length - 1 - i), 1);
    return d.toLocaleDateString("en-US", { month: "short", year: "numeric", timeZone: "UTC" });
  };
  const state = findStateByCode(costs.code);

  const tiles = [
    {
      label: "Typical home value",
      value: formatCurrency(v.typical),
      note: `${Math.abs(yearChange) < 0.05 ? "Flat" : `${yearChange > 0 ? "Up" : "Down"} ${Math.abs(yearChange).toFixed(1)}%`} from a year ago`,
      dot: true,
    },
    {
      label: "Property tax",
      value: tax !== null ? `${formatCurrency(tax)}/yr` : "Varies",
      note: costs.taxRate !== null ? `${costs.taxRate.toFixed(2)}% effective rate` : "Pick your state for its rate",
    },
    {
      label: "Home insurance",
      value: `${formatCurrency(insurance)}/yr`,
      note: costs.code ? "Average premium, at this value" : "U.S. average premium",
    },
    {
      label: `PMI, ${PMI_DOWN}% down`,
      value: `${formatCurrency(pmiMonthly)}/mo`,
      note: `${pmiPct.toFixed(2)}% a year at ${PMI_CREDIT}+ credit`,
    },
  ];

  return (
    <section aria-labelledby="local-costs-heading" className={cn("viz-card", className)}>
      <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
        <h2 id="local-costs-heading" className="font-display text-xl font-semibold text-foreground">
          Typical home costs in{" "}
          <span className="whitespace-nowrap">
            <MapPin className="inline h-4 w-4 align-[-2px] text-muted-foreground" aria-hidden="true" />
            <RegionSelect costs={costs} id="local-costs-state" className="text-xl" />
          </span>
        </h2>
        <p className="text-xs text-muted-foreground">
          {formatValueMonth(HOME_VALUES.asOf)} ·{" "}
          <a href={HOME_VALUES.sourceUrl} target="_blank" rel="noopener noreferrer" className={LINK}>
            Zillow
          </a>
          ,{" "}
          <a href={TAX_SOURCE.href} target="_blank" rel="noopener noreferrer" className={LINK}>
            Tax Foundation
          </a>
          ,{" "}
          <a href={INSURANCE_SOURCE.href} target="_blank" rel="noopener noreferrer" className={LINK}>
            NAIC
          </a>
        </p>
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-[auto_1fr] sm:items-center">
        <dl className="grid grid-cols-2 gap-3 sm:w-80">
          {tiles.map((t) => (
            <div key={t.label} className="rounded-xl border border-border bg-background/60 px-3 py-2.5">
              <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
                {t.dot && <span className="h-2 w-2 rounded-full" style={{ background: "hsl(var(--chart-primary))" }} aria-hidden="true" />}
                {t.label}
              </dt>
              <dd className="mt-1 font-display text-xl font-bold tabular-nums text-foreground sm:text-2xl">{t.value}</dd>
              <dd className="text-xs tabular-nums text-muted-foreground">{t.note}</dd>
            </div>
          ))}
        </dl>

        <figure className="min-w-0">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="h-20 w-full overflow-visible"
            preserveAspectRatio="none"
            role="img"
            aria-label={`Over the past year the typical home value in ${costs.name} moved from ${formatCurrency(h[0])} to ${formatCurrency(v.typical)}.`}
            onMouseLeave={() => setHover(null)}
            onMouseMove={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              const i = Math.round(((e.clientX - r.left) / r.width) * (h.length - 1));
              setHover(Math.max(0, Math.min(h.length - 1, i)));
            }}
          >
            <polyline
              fill="none"
              stroke="hsl(var(--chart-primary))"
              strokeWidth={2}
              vectorEffect="non-scaling-stroke"
              strokeLinejoin="round"
              points={h.map((d, i) => `${x(i)},${y(d)}`).join(" ")}
            />
            {hover !== null && (
              <line x1={x(hover)} x2={x(hover)} y1={0} y2={H} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" vectorEffect="non-scaling-stroke" />
            )}
          </svg>
          <figcaption className="mt-1 text-xs tabular-nums text-muted-foreground" aria-live="polite">
            {hover !== null ? (
              <span className="block text-center">
                {monthLabel(hover)}: {formatCurrency(h[hover])}
              </span>
            ) : (
              <>
                <span className="flex justify-between">
                  <span>{monthLabel(0)}</span>
                  <span>{formatValueMonth(HOME_VALUES.asOf)}</span>
                </span>
                <span className="mt-0.5 block text-center">
                  Price tiers: entry {formatCurrency(v.entry)}, upper {formatCurrency(v.upper)}
                </span>
              </>
            )}
          </figcaption>
        </figure>
      </div>
      <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
        {region.source === "ip" && costs.code ? "Based on your approximate location; change the state above. " : ""}
        Every calculator starts with these figures: entry-level prices for USDA, typical for most loans and upper-tier for
        jumbo. Tax rates are {STATE_DATA_YEAR} and insurance {INSURANCE_DATA_YEAR}; HOA dues depend on the property, so add
        yours.{" "}
        {state && (
          <Link to={statePath(state)} className="font-medium text-foreground underline underline-offset-2">
            {state.name} mortgage calculator, with county tax rates
          </Link>
        )}
      </p>
    </section>
  );
};

export default LocalCostsCard;
