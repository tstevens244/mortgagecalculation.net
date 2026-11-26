import { TrendingDown, TrendingUp } from "lucide-react";
import { MARKET_RATES, averageRate, formatSurveyDate } from "@/lib/marketRates";
import { cn } from "@/lib/utils";

interface MarketRateProps {
  /** Loan term in years; picks the 15- or 30-year average (20 and 25 are in between). */
  term: number;
  /** Current rate in the field, to show whether the average is already in use. */
  value: number;
  onUse: (rate: number) => void;
  /** Loan type the average is for, when it isn't a standard conventional loan. */
  note?: string;
}

/**
 * "Use today's average" for an interest rate field: Freddie Mac's weekly national
 * average for the term, one tap to fill it in.
 */
const MarketRate = ({ term, value, onUse, note }: MarketRateProps) => {
  const rate = averageRate(term);
  const inUse = Math.abs(value - rate) < 0.0005;
  const change = term <= 15 ? MARKET_RATES.rate15 - MARKET_RATES.prev15 : MARKET_RATES.rate30 - MARKET_RATES.prev30;
  const Arrow = change > 0 ? TrendingUp : TrendingDown;
  const label = term <= 15 ? "15-yr" : term >= 30 ? "30-yr" : `${term}-yr est.`;

  return (
    <span className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
      <button
        type="button"
        onClick={() => onUse(rate)}
        disabled={inUse}
        className={cn(
          "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          inUse
            ? "cursor-default border-transparent bg-accent/15 text-accent-strong"
            : "border-border bg-background text-foreground hover:border-primary/40 hover:bg-secondary",
        )}
        aria-label={inUse ? `Using the national ${label} average, ${rate}%` : `Use the national ${label} average, ${rate}%`}
      >
        {inUse ? "Using" : "Use"} avg. {rate.toFixed(2)}%
        {Math.abs(change) >= 0.01 && <Arrow className="h-3 w-3 text-muted-foreground" aria-hidden="true" />}
      </button>
      <span>
        {label} average, week of {formatSurveyDate(MARKET_RATES.asOf)} (
        <a href={MARKET_RATES.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline decoration-dotted underline-offset-2 hover:text-foreground">
          Freddie Mac
        </a>
        ){note ? `. ${note}` : ""}
      </span>
    </span>
  );
};

export default MarketRate;
