import { useMemo, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download } from "lucide-react";
import { formatCurrency } from "@/lib/formatters";
import { cn } from "@/lib/utils";

interface AmortizationEntry {
  month: number;
  date: Date;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

interface AmortizationScheduleProps {
  data: AmortizationEntry[];
}

interface YearRow {
  year: number;
  label: string;
  payments: number;
  principal: number;
  interest: number;
  balance: number;
}

const formatMonth = (date: Date) => date.toLocaleDateString("en-US", { month: "short", year: "numeric" });

/** Year-by-year summary (default) or month-by-month detail, with a CSV download. */
const AmortizationSchedule = ({ data }: AmortizationScheduleProps) => {
  const [view, setView] = useState<"year" | "month">("year");
  const [year, setYear] = useState(1);

  const years = useMemo<YearRow[]>(() => {
    const rows: YearRow[] = [];
    data.forEach((entry, i) => {
      const y = Math.floor(i / 12) + 1;
      if (!rows[y - 1]) {
        rows[y - 1] = { year: y, label: String(entry.date.getFullYear()), payments: 0, principal: 0, interest: 0, balance: 0 };
      }
      const row = rows[y - 1];
      row.payments += entry.payment;
      row.principal += entry.principal;
      row.interest += entry.interest;
      row.balance = entry.balance;
    });
    return rows;
  }, [data]);

  const totals = useMemo(
    () => data.reduce((t, e) => ({ principal: t.principal + e.principal, interest: t.interest + e.interest }), { principal: 0, interest: 0 }),
    [data],
  );

  const monthRows = data.slice((year - 1) * 12, year * 12);

  const downloadCsv = () => {
    const lines = [
      "Payment,Date,Payment amount,Principal,Interest,Balance",
      ...data.map((e) =>
        [e.month, formatMonth(e.date), e.payment.toFixed(2), e.principal.toFixed(2), e.interest.toFixed(2), e.balance.toFixed(2)].join(","),
      ),
    ];
    const url = URL.createObjectURL(new Blob([lines.join("\n")], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "amortization-schedule.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleClass = (active: boolean) =>
    cn(
      "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
      active ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
    );

  return (
    <section className="table-container" aria-labelledby="schedule-heading">
      <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 id="schedule-heading" className="text-lg font-semibold">
            Amortization schedule
          </h3>
          <p className="text-sm text-muted-foreground">
            {formatCurrency(totals.principal)} principal + {formatCurrency(totals.interest)} interest over {years.length} years
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-lg bg-secondary p-1" role="group" aria-label="Schedule view">
            <button type="button" className={toggleClass(view === "year")} aria-pressed={view === "year"} onClick={() => setView("year")}>
              By year
            </button>
            <button type="button" className={toggleClass(view === "month")} aria-pressed={view === "month"} onClick={() => setView("month")}>
              By month
            </button>
          </div>
          {view === "month" && (
            <Select value={String(year)} onValueChange={(v) => setYear(Number(v))}>
              <SelectTrigger className="h-9 w-[150px]" aria-label="Year to show">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {years.map((y) => (
                  <SelectItem key={y.year} value={String(y.year)}>
                    Year {y.year} ({y.label})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <Button variant="outline" size="sm" onClick={downloadCsv} className="h-9 gap-1.5">
            <Download className="h-4 w-4" aria-hidden="true" />
            CSV
          </Button>
        </div>
      </div>

      <div className="max-h-[520px] overflow-auto">
        <Table className="tabular-nums">
          <TableHeader className="sticky top-0 z-10 bg-card shadow-[0_1px_0_hsl(var(--border))]">
            <TableRow>
              <TableHead className="w-24">{view === "year" ? "Year" : "Month"}</TableHead>
              <TableHead className="text-right">{view === "year" ? "Paid" : "Payment"}</TableHead>
              <TableHead className="text-right">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[hsl(var(--chart-primary))]" aria-hidden="true" />
                  Principal
                </span>
              </TableHead>
              <TableHead className="text-right">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[hsl(var(--chart-secondary))]" aria-hidden="true" />
                  Interest
                </span>
              </TableHead>
              <TableHead className="text-right">Balance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {view === "year"
              ? years.map((y) => (
                  <TableRow key={y.year}>
                    <TableCell className="font-medium">
                      {y.year} <span className="text-xs text-muted-foreground">({y.label})</span>
                    </TableCell>
                    <TableCell className="text-right">{formatCurrency(y.payments)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(y.principal)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(y.interest)}</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(y.balance)}</TableCell>
                  </TableRow>
                ))
              : monthRows.map((e) => (
                  <TableRow key={e.month}>
                    <TableCell className="font-medium">{formatMonth(e.date)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(e.payment)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(e.principal)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(e.interest)}</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(e.balance)}</TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
};

export default AmortizationSchedule;
