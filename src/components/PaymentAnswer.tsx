import { useEffect, useState, type ReactNode } from "react";
import { Check, Link2 } from "lucide-react";
import { formatCurrency } from "@/lib/formatters";
import { copyText } from "@/lib/shareUrl";
import { hasShareableState, shareLink } from "@/lib/urlState";
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

interface AnswerCardProps {
  /** Small caps label over the headline, e.g. "Your monthly payment". */
  label: ReactNode;
  /** The headline number; animates when it changes. */
  total?: number;
  /** Format for the headline number (whole dollars by default). */
  format?: (n: number) => string;
  /** A headline that isn't a number (e.g. "Buy"). Used instead of `total`. */
  headline?: ReactNode;
  /** One line under the headline, e.g. "on a $240,000 loan at 6.5% for 30 years". */
  context?: ReactNode;
  /** What the headline is made of, in display order. Zero parts are left out. */
  parts?: AnswerPart[];
  /** Two to four key numbers shown beside the headline. */
  stats: AnswerStat[];
  /** Link to this scenario for the copy button. Defaults to the page's URL inputs, when it has any. */
  shareUrl?: () => string;
  /** Hide the copy-link button. */
  share?: boolean;
  /** Extra content under the card's main row (a caveat, a warning). */
  children?: ReactNode;
  /** Element id; the jump-to-result bar targets "calc-result". Use another id for a second card on the page. */
  id?: string;
}

/**
 * Every calculator's answer in one block, the same way on every page: the
 * headline (animated when it changes), what it's made of, the totals that
 * matter, and a link to share the scenario.
 */
export const AnswerCard = ({
  label,
  total,
  format = formatCurrency,
  headline,
  context,
  parts = [],
  stats,
  shareUrl,
  share = true,
  children,
  id = "calc-result",
}: AnswerCardProps) => {
  const [copied, setCopied] = useState(false);
  const [canShare, setCanShare] = useState(false);
  // Checked after the calculator has registered its inputs (a child's effects run before its parent's).
  useEffect(() => {
    const t = window.setTimeout(() => setCanShare(share && (Boolean(shareUrl) || hasShareableState())), 0);
    return () => window.clearTimeout(t);
  }, [share, shareUrl]);
  useEffect(() => {
    if (!copied) return;
    const t = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(t);
  }, [copied]);

  const shown = parts.filter((p) => p.value > 0.5);
  const sum = shown.reduce((s, p) => s + p.value, 0) || 1;

  return (
    <section id={id} className="result-highlight p-6 sm:p-8" aria-labelledby={`${id}-label`}>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:items-center">
        <div className="min-w-0">
          <div className="flex items-start justify-between gap-3">
            <p id={`${id}-label`} className="text-sm font-medium uppercase tracking-wide text-primary-foreground/80">
              {label}
            </p>
            {canShare && (
              <button
                type="button"
                onClick={async () => setCopied(await copyText((shareUrl ?? shareLink)()))}
                className="-mt-1 inline-flex shrink-0 items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                aria-live="polite"
              >
                {copied ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : <Link2 className="h-3.5 w-3.5" aria-hidden="true" />}
                {copied ? "Link copied" : "Copy link"}
              </button>
            )}
          </div>

          {headline !== undefined ? (
            <p className="mt-2 font-display text-5xl font-bold tracking-tight sm:text-6xl">{headline}</p>
          ) : (
            <AnimatedCurrency value={total ?? 0} format={format} className="mt-2 block font-display text-5xl font-bold tracking-tight sm:text-6xl" />
          )}
          {context && <p className="mt-2 text-sm text-primary-foreground/80">{context}</p>}

          {shown.length > 0 && (
            <>
              <div
                className="mt-6 flex h-2.5 w-full gap-[3px] overflow-hidden rounded-full bg-white/10"
                role="img"
                aria-label={shown.map((p) => `${p.label} ${formatCurrency(p.value)}`).join(", ")}
              >
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
            </>
          )}
        </div>

        <dl className="grid grid-cols-2 gap-3">
          {stats.map((s) => (
            <div key={s.label} className={cn("rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3", stats.length === 3 && s === stats[2] && "col-span-2")}>
              <dt className="text-xs font-medium text-primary-foreground/70">{s.label}</dt>
              <dd className="mt-1 text-lg font-semibold tabular-nums sm:text-xl">{s.value}</dd>
              {s.hint && <dd className="text-xs text-primary-foreground/70">{s.hint}</dd>}
            </div>
          ))}
        </dl>
      </div>
      {children && <div className="mt-6 border-t border-white/10 pt-4 text-sm text-primary-foreground/80">{children}</div>}
    </section>
  );
};

/** The mortgage calculator's answer: a monthly payment. */
const PaymentAnswer = (props: Omit<AnswerCardProps, "label"> & { label?: ReactNode }) => (
  <AnswerCard label={props.label ?? "Your monthly payment"} {...props} />
);

export default PaymentAnswer;
