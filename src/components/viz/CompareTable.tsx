import type { ReactNode } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/formatters";

export interface CompareRow {
  label: ReactNode;
  /** One value per column; null shows a dash. */
  values: (number | null)[];
  /** How to show the numbers. Defaults to whole dollars. */
  format?: (v: number) => string;
  /** Override the shown text per column (e.g. "$1,200 + $310"). */
  display?: (ReactNode | undefined)[];
  /** Mark the best value in this row. */
  better?: "lower" | "higher";
  /** Totals and bottom lines. */
  emphasis?: boolean;
  /** Muted explanation under the label. */
  note?: ReactNode;
}

export interface CompareGroup {
  title?: string;
  rows: CompareRow[];
}

interface CompareTableProps {
  columns: { label: string; sublabel?: string }[];
  groups: CompareGroup[];
  /** Column to highlight as the better option overall. */
  recommended?: number | null;
  recommendedLabel?: string;
  caption?: string;
  className?: string;
}

const bestIndex = (row: CompareRow) => {
  if (!row.better) return -1;
  const nums = row.values.map((v) => (v === null || !Number.isFinite(v) ? null : v));
  const valid = nums.filter((v): v is number => v !== null);
  if (valid.length < 2) return -1;
  const target = row.better === "lower" ? Math.min(...valid) : Math.max(...valid);
  // No winner when the values are the same (to the dollar).
  if (valid.every((v) => Math.round(v) === Math.round(target))) return -1;
  return nums.findIndex((v) => v === target);
};

/**
 * Side-by-side comparison of two or three options. The recommended column is
 * tinted, and in rows where lower (or higher) is better the winning value gets a
 * check, so you can scan which option wins each line.
 */
const CompareTable = ({ columns, groups, recommended = null, recommendedLabel = "Better", caption, className }: CompareTableProps) => (
  <div className={cn("overflow-x-auto", className)}>
    <table className="w-full border-collapse text-sm tabular-nums">
      {caption && <caption className="sr-only">{caption}</caption>}
      <thead>
        <tr>
          <th scope="col" className="w-[40%] pb-3 text-left align-bottom">
            <span className="sr-only">Item</span>
          </th>
          {columns.map((c, i) => (
            <th
              key={c.label}
              scope="col"
              className={cn(
                "rounded-t-xl px-2 pb-3 pt-3 text-right align-bottom font-semibold text-foreground sm:px-3",
                i === recommended && "bg-primary/[0.06]",
              )}
            >
              {i === recommended && (
                <span className="mb-1 inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-[11px] font-semibold text-success">
                  <Check className="h-3 w-3" aria-hidden="true" />
                  {recommendedLabel}
                </span>
              )}
              <span className="block">{c.label}</span>
              {c.sublabel && <span className="block text-xs font-normal text-muted-foreground">{c.sublabel}</span>}
            </th>
          ))}
        </tr>
      </thead>
      {groups.map((g, gi) => (
        <tbody key={gi}>
          {g.title && (
            <tr>
              <th
                scope="colgroup"
                colSpan={columns.length + 1}
                className="border-t border-border pb-1 pt-4 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"
              >
                {g.title}
              </th>
            </tr>
          )}
          {g.rows.map((r, ri) => {
            const best = bestIndex(r);
            const fmt = r.format ?? formatCurrency;
            return (
              <tr key={ri} className={cn("border-t border-border/60", r.emphasis && "border-t-border")}>
                <th scope="row" className={cn("py-2.5 pr-2 text-left align-top font-normal", r.emphasis ? "font-semibold text-foreground" : "text-muted-foreground")}>
                  {r.label}
                  {r.note && <span className="block text-xs font-normal text-muted-foreground">{r.note}</span>}
                </th>
                {r.values.map((v, ci) => (
                  <td
                    key={ci}
                    className={cn(
                      "px-2 py-2.5 text-right align-top sm:px-3",
                      ci === recommended && "bg-primary/[0.06]",
                      r.emphasis ? "font-semibold text-foreground" : "font-medium text-foreground",
                    )}
                  >
                    <span className="inline-flex items-center justify-end gap-1">
                      {ci === best && <Check className="h-3.5 w-3.5 shrink-0 text-success" aria-label="Better" />}
                      {r.display?.[ci] ?? (v === null || !Number.isFinite(v) ? "—" : fmt(v))}
                    </span>
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      ))}
      {recommended !== null && (
        <tfoot>
          <tr>
            <td />
            {columns.map((c, i) => (
              <td key={c.label} className={cn("h-3 rounded-b-xl", i === recommended && "bg-primary/[0.06]")} />
            ))}
          </tr>
        </tfoot>
      )}
    </table>
  </div>
);

export default CompareTable;
