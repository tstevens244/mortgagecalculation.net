import { useMemo, useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatCurrency } from "@/lib/formatters";
import { byLoanYear, milestones, yearOfMonth, type AmortizationRow } from "@/lib/amortization";
import { cn } from "@/lib/utils";
import VizCard, { Swatch, ViewToggle } from "@/components/viz/VizCard";
import { SERIES } from "@/components/viz/theme";

const formatMonth = (date: Date) => date.toLocaleDateString("en-US", { month: "short", year: "numeric" });

/** Thin bar under the balance: how much of the loan is repaid. */
const PaidOffBar = ({ share }: { share: number }) => (
  <span className="mt-1 block h-1 w-full overflow-hidden rounded-full bg-secondary" aria-hidden="true">
    <span className="block h-full rounded-full" style={{ width: `${Math.min(100, share * 100)}%`, background: SERIES.principal }} />
  </span>
);

const Badge = ({ children }: { children: string }) => (
  <span className="mt-1 block w-fit whitespace-nowrap rounded-full sm:ml-1.5 sm:mt-0 sm:inline-block bg-accent/15 px-1.5 py-0.5 align-middle text-[10px] font-semibold text-accent-strong">
    {children}
  </span>
);

/** Year-by-year summary (default) or month-by-month detail, with a CSV download. */
const AmortizationSchedule = ({ data }: { data: AmortizationRow[] }) => {
  const [view, setView] = useState<"year" | "month">("year");
  const [year, setYear] = useState(1);

  const { years, m } = useMemo(() => ({ years: byLoanYear(data), m: milestones(data) }), [data]);
  const crossoverYear = m.crossoverMonth ? yearOfMonth(m.crossoverMonth) : null;
  const halfwayYear = m.halfwayMonth ? yearOfMonth(m.halfwayMonth) : null;
  const shownYear = Math.min(year, years.length || 1);
  const monthRows = data.slice((shownYear - 1) * 12, shownYear * 12);

  const downloadCsv = () => {
    const lines = [
      "Payment,Date,Payment amount,Principal,Interest,Balance",
      ...data.map((e) =>
        [e.month, `"${formatMonth(e.date)}"`, e.payment.toFixed(2), e.principal.toFixed(2), e.interest.toFixed(2), e.balance.toFixed(2)].join(","),
      ),
    ];
    const url = URL.createObjectURL(new Blob([lines.join("\n")], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "amortization-schedule.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const badgesFor = (y: number) => (
    <>
      {y === crossoverYear && <Badge>Principal &gt; interest</Badge>}
      {y === halfwayYear && <Badge>Half paid</Badge>}
    </>
  );

  const th = "px-1 py-2.5 sm:px-3 text-right text-xs font-semibold tracking-normal text-muted-foreground sm:uppercase sm:tracking-wide";

  return (
    <VizCard
      id="schedule"
      title="Amortization schedule"
      description={
        <>
          {formatCurrency(m.totalPrincipal)} principal + {formatCurrency(m.totalInterest)} interest over {data.length} payments.
          The bar under each balance shows how much of the loan is repaid.
        </>
      }
      actions={
        <>
          <ViewToggle
            label="Schedule view"
            value={view}
            onChange={setView}
            options={[
              { value: "year", label: "By year" },
              { value: "month", label: "By month" },
            ]}
          />
          {view === "month" && (
            <Select value={String(shownYear)} onValueChange={(v) => setYear(Number(v))}>
              <SelectTrigger className="h-9 w-[150px]" aria-label="Year to show">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {years.map((y) => (
                  <SelectItem key={y.year} value={String(y.year)}>
                    Year {y.year} ({y.calendarYear})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <Button variant="outline" size="sm" onClick={downloadCsv} className="h-9 gap-1.5">
            <Download className="h-4 w-4" aria-hidden="true" />
            CSV
          </Button>
        </>
      }
    >
      <div className="-mx-4 max-h-[560px] overflow-auto border-t border-border sm:-mx-6">
        <table className="w-full border-collapse text-[12.5px] tabular-nums sm:text-sm">
          <caption className="sr-only">
            {view === "year" ? "Principal, interest and balance for each year of the loan" : `Payments in year ${shownYear}`}
          </caption>
          <thead className="sticky top-0 z-10 bg-card shadow-[0_1px_0_hsl(var(--border))]">
            <tr>
              <th scope="col" className={cn(th, "pl-2.5 text-left sm:pl-6")}>{view === "year" ? "Year" : "Month"}</th>
              <th scope="col" className={cn(th, "hidden sm:table-cell")}>{view === "year" ? "Paid" : "Payment"}</th>
              <th scope="col" className={th}>
                <span className="inline-flex items-center gap-1.5">
                  <span className="hidden sm:inline-flex"><Swatch color={SERIES.principal} /></span>
                  Principal
                </span>
              </th>
              <th scope="col" className={th}>
                <span className="inline-flex items-center gap-1.5">
                  <span className="hidden sm:inline-flex"><Swatch color={SERIES.interest} /></span>
                  Interest
                </span>
              </th>
              <th scope="col" className={cn(th, "pr-2.5 sm:pr-6")}>Balance</th>
            </tr>
          </thead>
          <tbody>
            {view === "year"
              ? years.map((y) => (
                  <tr key={y.year} className={cn("border-b border-border/60 hover:bg-secondary/40", y.year === crossoverYear && "bg-accent/[0.06]")}>
                    <th scope="row" className="py-2.5 pl-2.5 pr-1 text-left sm:pr-3 font-medium sm:pl-6">
                      {y.year} <span className="hidden text-xs font-normal text-muted-foreground sm:inline">{y.calendarYear}</span>
                      {badgesFor(y.year)}
                    </th>
                    <td className="hidden px-1 py-2.5 sm:px-3 text-right sm:table-cell">{formatCurrency(y.payments)}</td>
                    <td className="px-1 py-2.5 sm:px-3 text-right">{formatCurrency(y.principal)}</td>
                    <td className="px-1 py-2.5 sm:px-3 text-right">{formatCurrency(y.interest)}</td>
                    <td className="py-2.5 pl-1 pr-2.5 text-right sm:pl-3 font-semibold sm:pr-6">
                      {formatCurrency(y.balance)}
                      <PaidOffBar share={y.paidOff} />
                    </td>
                  </tr>
                ))
              : monthRows.map((e) => (
                  <tr key={e.month} className={cn("border-b border-border/60 hover:bg-secondary/40", e.month === m.crossoverMonth && "bg-accent/[0.06]")}>
                    <th scope="row" className="py-2.5 pl-2.5 pr-1 text-left sm:pr-3 font-medium sm:pl-6">
                      {formatMonth(e.date)}
                      {e.month === m.crossoverMonth && <Badge>Principal &gt; interest</Badge>}
                      {e.month === m.halfwayMonth && <Badge>Half paid</Badge>}
                    </th>
                    <td className="hidden px-1 py-2.5 sm:px-3 text-right sm:table-cell">{formatCurrency(e.payment)}</td>
                    <td className="px-1 py-2.5 sm:px-3 text-right">{formatCurrency(e.principal)}</td>
                    <td className="px-1 py-2.5 sm:px-3 text-right">{formatCurrency(e.interest)}</td>
                    <td className="py-2.5 pl-1 pr-2.5 text-right sm:pl-3 font-semibold sm:pr-6">
                      {formatCurrency(e.balance)}
                      <PaidOffBar share={m.loanAmount > 0 ? 1 - e.balance / m.loanAmount : 0} />
                    </td>
                  </tr>
                ))}
          </tbody>
          {view === "year" && (
            <tfoot className="sticky bottom-0 bg-card shadow-[0_-1px_0_hsl(var(--border))]">
              <tr className="font-semibold">
                <th scope="row" className="py-3 pl-2.5 pr-1 text-left sm:pr-3 sm:pl-6">Total</th>
                <td className="hidden px-1 py-3 sm:px-3 text-right sm:table-cell">{formatCurrency(m.totalPrincipal + m.totalInterest)}</td>
                <td className="px-1 py-3 sm:px-3 text-right">{formatCurrency(m.totalPrincipal)}</td>
                <td className="px-1 py-3 sm:px-3 text-right">{formatCurrency(m.totalInterest)}</td>
                <td className="py-3 pl-1 pr-2.5 text-right sm:pl-3 sm:pr-6">{formatCurrency(years[years.length - 1]?.balance ?? 0)}</td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </VizCard>
  );
};

export default AmortizationSchedule;
