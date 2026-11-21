import { useId, useState, type ReactNode } from "react";
import { ChevronDown, Info } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CurrencyInput from "@/components/CurrencyInput";
import PercentInput from "@/components/PercentInput";
import { cn } from "@/lib/utils";

/*
 * Building blocks for calculator inputs, so every calculator reads the same way:
 * the few numbers that matter most up top, everything else folded away with a
 * one-line summary of what's assumed.
 */

/** The white card that holds a calculator's inputs. */
export const InputCard = ({
  title,
  description,
  children,
  className,
  id,
}: {
  title: string;
  description?: ReactNode;
  children: ReactNode;
  className?: string;
  id?: string;
}) => {
  const auto = useId();
  const headingId = `${id ?? auto}-heading`;
  return (
    <section id={id} className={cn("calculator-card p-4 sm:p-6", className)} aria-labelledby={headingId}>
      <h2 id={headingId} className="font-display text-lg font-semibold text-foreground sm:text-xl">
        {title}
      </h2>
      {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      <div className="mt-5">{children}</div>
    </section>
  );
};

/** Two columns of fields from the small breakpoint up. */
export const FieldGrid = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div className={cn("grid items-start gap-x-4 gap-y-4 sm:grid-cols-2", className)}>{children}</div>
);

/** Small "i" button that explains a field. Opens on hover, focus or tap. */
export const InfoTip = ({ children, label }: { children: ReactNode; label: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <span className="relative inline-flex" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        type="button"
        aria-label={`About ${label}`}
        aria-expanded={open}
        className="inline-flex h-5 w-5 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={(e) => {
          e.preventDefault();
          setOpen((o) => !o);
        }}
      >
        <Info className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
      {open && (
        <span
          role="tooltip"
          className="absolute bottom-full left-1/2 z-30 mb-2 block w-64 -translate-x-1/2 rounded-xl border border-border bg-card/95 px-3 py-2.5 text-xs font-normal leading-snug text-muted-foreground shadow-lg backdrop-blur animate-in fade-in-0 zoom-in-95"
        >
          {children}
        </span>
      )}
    </span>
  );
};

interface FieldProps {
  id: string;
  label: string;
  /** Unit or period shown after the label, e.g. "per year". */
  unit?: string;
  /** Explanation behind an info button. */
  info?: ReactNode;
  /** Short help under the field (also read by screen readers via `${id}-hint`). */
  hint?: ReactNode;
  /** Small tag after the label, e.g. "Auto". */
  tag?: ReactNode;
  className?: string;
  children: ReactNode;
}

/** A label above its input, with optional unit, info button and hint. */
export const Field = ({ id, label, unit, info, hint, tag, className, children }: FieldProps) => (
  <div className={cn("flex min-w-0 flex-col gap-1.5", className)}>
    <div className="flex min-h-5 items-center gap-1.5">
      <Label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
        {unit && <span className="font-normal text-muted-foreground"> ({unit})</span>}
      </Label>
      {info && <InfoTip label={label}>{info}</InfoTip>}
      {tag && <span className="rounded-full bg-accent/15 px-1.5 py-0.5 text-[10px] font-semibold text-accent-strong">{tag}</span>}
    </div>
    {children}
    {hint && (
      <span id={`${id}-hint`} className="text-xs text-muted-foreground">
        {hint}
      </span>
    )}
  </div>
);

/** One-tap choices (loan term, years, presets). A radio group under the hood. */
export function Choice<T extends string | number>({
  id,
  value,
  onChange,
  options,
  label,
  className,
}: {
  id?: string;
  value: T;
  onChange: (v: NoInfer<T>) => void;
  options: { value: NoInfer<T>; label: string }[];
  label: string;
  className?: string;
}) {
  return (
    <div id={id} role="radiogroup" aria-label={label} className={cn("flex w-full gap-1 rounded-lg bg-secondary p-1", className)}>
      {options.map((o) => {
        const on = o.value === value;
        return (
          <button
            key={String(o.value)}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onChange(o.value)}
            className={cn(
              "h-8 min-w-0 flex-1 whitespace-nowrap rounded-md px-1 text-[13px] font-medium transition-colors sm:px-2 sm:text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              on ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

/** Standard loan terms as one-tap choices. */
export const TermChoice = ({
  id,
  value,
  onChange,
  terms = [30, 20, 15, 10],
}: {
  id?: string;
  value: number;
  onChange: (years: number) => void;
  terms?: number[];
}) => <Choice id={id} label="Loan term" value={value} onChange={onChange} options={terms.map((t) => ({ value: t, label: `${t} yr` }))} />;

/**
 * Secondary inputs folded under a button that summarizes what they're set to,
 * e.g. "Taxes, insurance & fees · $300 tax · $100 insurance · no HOA".
 */
export const MoreOptions = ({
  title,
  summary,
  children,
  defaultOpen = false,
}: {
  title: string;
  /** Plain-text summary of the current values, shown while closed. */
  summary?: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
}) => {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();
  return (
    <div className="mt-5 border-t border-border pt-4">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
        className="group flex w-full items-center justify-between gap-3 rounded-lg text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <span className="min-w-0">
          <span className="block text-sm font-semibold text-foreground">{title}</span>
          {summary && !open && <span className="mt-0.5 block truncate text-xs text-muted-foreground">{summary}</span>}
        </span>
        <span className="flex shrink-0 items-center gap-1 text-sm font-medium text-primary">
          {open ? "Hide" : "Edit"}
          <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} aria-hidden="true" />
        </span>
      </button>
      <div id={id} hidden={!open} className="pt-4">
        {children}
      </div>
    </div>
  );
};

/** Joins summary parts with a middle dot, skipping empty ones. */
export const summarize = (...parts: (string | false | null | undefined)[]) => parts.filter(Boolean).join(" · ");

const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/** Month and year of the first payment, as "YYYY-MM". */
export const StartDateField = ({ value, onChange, id = "start-month" }: { value: string; onChange: (v: string) => void; id?: string }) => {
  const [year, month] = value.split("-");
  const thisYear = new Date().getFullYear();
  return (
    <Field id={id} label="First payment" hint="Sets the dates in the schedule.">
      <div className="flex gap-2">
        <Select value={month} onValueChange={(m) => onChange(`${year}-${m}`)}>
          <SelectTrigger id={id} aria-label="First payment month" aria-describedby={`${id}-hint`} className="flex-1">
            <SelectValue placeholder="Month" />
          </SelectTrigger>
          <SelectContent>
            {MONTH_NAMES.map((m, i) => (
              <SelectItem key={m} value={String(i + 1).padStart(2, "0")}>
                {m}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={year} onValueChange={(y) => onChange(`${y}-${month}`)}>
          <SelectTrigger aria-label="First payment year" className="w-24">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 30 }, (_, i) => String(thisYear + i)).map((y) => (
              <SelectItem key={y} value={y}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </Field>
  );
};

/** Down payment in dollars and percent, kept in sync by the caller. */
export const DownPaymentField = ({
  amount,
  percent,
  onAmount,
  onPercent,
  info,
  hint,
  id = "down-payment",
}: {
  amount: number;
  percent: number;
  onAmount: (v: number) => void;
  onPercent: (v: number) => void;
  info?: ReactNode;
  hint?: ReactNode;
  id?: string;
}) => (
  <Field id={id} label="Down payment" info={info} hint={hint}>
    <div className="flex gap-2">
      <CurrencyInput id={id} value={amount} onChange={onAmount} aria-describedby={hint ? `${id}-hint` : undefined} />
      <PercentInput
        value={percent}
        onChange={onPercent}
        className="w-[4.75rem] shrink-0 px-2"
        decimalPlaces={1}
        min={0}
        max={100}
        aria-label="Down payment percentage"
      />
    </div>
  </Field>
);
