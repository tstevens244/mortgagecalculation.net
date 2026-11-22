import { useEffect, useState, type ReactNode } from "react";
import { Check, Link2 } from "lucide-react";
import { formatCurrency } from "@/lib/formatters";
import { copyText } from "@/lib/shareUrl";
import { cn } from "@/lib/utils";
import { AnimatedCurrency } from "./AnimatedNumber";

export interface AnswerPart {
  label: string;
  value: number;
}

export interface AnswerStat {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
}

// Light tints that read on the navy card, in the same order as the site's chart colors
// (principal & interest, tax, insurance, mortgage insurance, HOA).
const TINTS = ["hsl(0 0% 100%)", "hsl(199 90% 70%)", "hsl(152 60% 62%)", "hsl(350 85% 74%)", "hsl(262 80% 80%)"];

interface PaymentAnswerProps {
  /** Monthly total, the headline. */
  total: number;
  label?: string;
  /** One line under the number, e.g. "on a $240,000 loan at 6.5% for 30 years". */
  context?: ReactNode;
  /** What the total is made of, in display order. Zero parts are left out. */
  parts: AnswerPart[];
  /** Key totals shown beside the payment. */
  stats: AnswerStat[];
  /** Returns the link to this scenario, for the copy button. */
  shareUrl?: () => string;
}

/**
 * The calculator's answer in one block: the monthly payment (animated when it
 * changes), what it's made of, and the totals that matter over the loan.
 */
const PaymentAnswer = ({ total, label = "Your monthly payment", context, parts, stats, shareUrl }: PaymentAnswerProps) => {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const t = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(t);
  }, [copied]);

  const shown = parts.filter((p) => p.value > 0.5);
  const sum = shown.reduce((s, p) => s + p.value, 0) || 1;

  return (
    <section id="calc-result" className="result-highlight p-6 sm:p-8" aria-labelledby="calc-result-label">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:items-center">
        <div className="min-w-0">
          <div className="flex items-start justify-between gap-3">
            <p id="calc-result-label" className="text-sm font-medium uppercase tracking-wide text-primary-foreground/80">
              {label}
            </p>
            {shareUrl && (
              <button
                type="button"
                onClick={async () => setCopied(await copyText(shareUrl()))}
                className="-mt-1 inline-flex shrink-0 items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                aria-live="polite"
              >
                {copied ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : <Link2 className="h-3.5 w-3.5" aria-hidden="true" />}
                {copied ? "Link copied" : "Copy link"}
              </button>
            )}
          </div>

          <AnimatedCurrency value={total} className="mt-2 block font-display text-5xl font-bold tracking-tight sm:text-6xl" />
          {context && <p className="mt-2 text-sm text-primary-foreground/80">{context}</p>}

          {/* What the payment is made of */}
          <div className="mt-6 flex h-2.5 w-full gap-[3px] overflow-hidden rounded-full bg-white/10" role="img" aria-label={shown.map((p) => `${p.label} ${formatCurrency(p.value)}`).join(", ")}>
            {shown.map((p, i) => (
              <span
                key={p.label}
                className="h-full transition-[width] duration-500 ease-out first:rounded-l-full last:rounded-r-full motion-reduce:transition-none"
                style={{ width: `${(p.value / sum) * 100}%`, background: TINTS[i % TINTS.length] }}
              />
            ))}
          </div>
          <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-sm">
            {shown.map((p, i) => (
              <li key={p.label} className="inline-flex items-center gap-1.5 tabular-nums">
                <span className="h-2 w-2 rounded-full" style={{ background: TINTS[i % TINTS.length] }} aria-hidden="true" />
                <span className="text-primary-foreground/75">{p.label}</span>
                <span className="font-semibold">{formatCurrency(p.value)}</span>
              </li>
            ))}
          </ul>
        </div>

        <dl className="grid grid-cols-2 gap-3">
          {stats.map((s) => (
            <div key={s.label} className={cn("rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3")}>
              <dt className="text-xs font-medium text-primary-foreground/70">{s.label}</dt>
              <dd className="mt-1 text-lg font-semibold tabular-nums sm:text-xl">{s.value}</dd>
              {s.hint && <dd className="text-xs text-primary-foreground/70">{s.hint}</dd>}
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
};

export default PaymentAnswer;
