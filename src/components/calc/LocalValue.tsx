import { ChevronDown, MapPin } from "lucide-react";
import { states } from "@/lib/states";
import { HOME_VALUES, formatValueMonth, localPrice, priceLabel, type LocalCosts, type PriceKind } from "@/lib/localCosts";
import { setRegion } from "@/lib/region";
import { formatCurrency } from "@/lib/formatters";
import { cn } from "@/lib/utils";

const SOURCE_LINK = "underline decoration-dotted underline-offset-2 hover:text-foreground";

/** Inline state picker: "Texas ▾". Picking one refills the local figures. */
export const RegionSelect = ({ costs, className, id }: { costs: LocalCosts; className?: string; id?: string }) => (
  // The visible label sizes to the state's name; the native select sits invisibly on
  // top, so it keeps the platform picker (a wheel on phones) and keyboard support.
  <span
    className={cn(
      "relative inline-flex items-center gap-0.5 rounded-md font-medium text-foreground underline decoration-dotted underline-offset-2 focus-within:ring-2 focus-within:ring-ring hover:text-primary",
      className,
    )}
  >
    <span aria-hidden="true">{costs.code ? costs.name : "the U.S."}</span>
    <ChevronDown className="h-3.5 w-3.5 shrink-0 opacity-70" aria-hidden="true" />
    <select
      id={id}
      value={costs.code ?? ""}
      onChange={(e) => setRegion(e.target.value || null)}
      aria-label="State for local home prices, taxes and insurance"
      className="absolute inset-0 h-full w-full cursor-pointer appearance-none opacity-0 [&>option]:bg-background [&>option]:text-foreground"
    >
      <option value="">U.S. (pick a state)</option>
      {states.map((s) => (
        <option key={s.code} value={s.code}>
          {s.name}
        </option>
      ))}
    </select>
  </span>
);

const Chip = ({ inUse, onClick, children, label }: { inUse: boolean; onClick: () => void; children: React.ReactNode; label: string }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={inUse}
    aria-label={label}
    className={cn(
      "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium tabular-nums transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      inUse
        ? "cursor-default border-transparent bg-accent/15 text-accent-strong"
        : "border-border bg-background text-foreground hover:border-primary/40 hover:bg-secondary",
    )}
  >
    {children}
  </button>
);

interface LocalPriceProps {
  costs: LocalCosts;
  kind?: PriceKind;
  /** Down payment %, for the jumbo price (the loan must stay above the conforming limit). */
  downPercent?: number;
  value: number;
  onUse: (price: number) => void;
  /** "home value" for refinance and equity calculators. */
  noun?: string;
}

/**
 * "Use avg." for a home price field, in the same style as the interest rate chip:
 * the local Zillow value for the visitor's state, with a picker to change the state.
 */
export const LocalPrice = ({ costs, kind = "typical", downPercent = 20, value, onUse }: LocalPriceProps) => {
  const price = localPrice(costs, kind, downPercent);
  const inUse = Math.abs(value - price) < 0.5;
  return (
    <span className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
      <Chip inUse={inUse} onClick={() => onUse(price)} label={`${inUse ? "Using" : "Use"} ${priceLabel(costs, kind, downPercent).toLowerCase()} for ${costs.name}, ${formatCurrency(price)}`}>
        {inUse ? "Using" : "Use"} avg. {formatCurrency(price)}
      </Chip>
      <span>
        {priceLabel(costs, kind, downPercent)} in{" "}
        <MapPin className="inline h-3 w-3 align-[-2px]" aria-hidden="true" />
        <RegionSelect costs={costs} />, {formatValueMonth(HOME_VALUES.asOf)} (
        <a href={HOME_VALUES.sourceUrl} target="_blank" rel="noopener noreferrer" className={SOURCE_LINK}>
          Zillow
        </a>
        )
      </span>
    </span>
  );
};

interface LocalFigureProps {
  costs: LocalCosts;
  /** The local figure, or null when there isn't one (no state picked). */
  figure: number | null;
  value: number;
  onUse: (v: number) => void;
  format?: (v: number) => string;
  /** e.g. "1.40% effective rate" */
  detail: string;
  source: { label: string; href: string };
}

/** "Use TX avg." for a tax or insurance field. Hidden until a state is known. */
export const LocalFigure = ({ costs, figure, value, onUse, format = formatCurrency, detail, source }: LocalFigureProps) => {
  if (figure === null || !costs.code) return null;
  const inUse = Math.abs(value - figure) < 0.005;
  return (
    <span className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
      <Chip inUse={inUse} onClick={() => onUse(figure)} label={`${inUse ? "Using" : "Use"} the ${costs.name} average, ${format(figure)}`}>
        {inUse ? "Using" : "Use"} {costs.short} avg. {format(figure)}
      </Chip>
      <span>
        {costs.name} {detail} (
        <a href={source.href} target="_blank" rel="noopener noreferrer" className={SOURCE_LINK}>
          {source.label}
        </a>
        )
      </span>
    </span>
  );
};

export const TAX_SOURCE = { label: "Tax Foundation", href: "https://taxfoundation.org/data/all/state/property-taxes-by-state-county/" };
export const INSURANCE_SOURCE = { label: "NAIC", href: "https://content.naic.org/cis_consumer_information.htm" };

/** Standard hint text for the two figures. */
export const taxDetail = (c: LocalCosts) => `average, ${c.taxRate?.toFixed(2)}% of value a year`;
export const insuranceDetail = (c: LocalCosts) => `average premium, scaled to this price`;
