import { formatCurrency } from "@/lib/formatters";

interface FeeScheduleProps {
  title: string;
  /** Monthly fee in each loan year, first year first. */
  byYear: { year: number; monthly: number }[];
  note?: string;
}

/** Monthly annual fee at a few points in the loan, so you can see it shrink with the balance. */
const FeeSchedule = ({ title, byYear, note }: FeeScheduleProps) => {
  const last = byYear.length;
  const shown = [...new Set([1, 2, 3, 5, 10, 15, 20, 25, 30, last])].filter((y) => y >= 1 && y <= last).sort((a, b) => a - b);
  if (!last) return null;
  return (
    <section className="calculator-card p-4 sm:p-6" aria-labelledby="fee-schedule">
      <h2 id="fee-schedule" className="font-display text-lg font-semibold text-foreground">
        {title}
      </h2>
      {note && <p className="mt-1 text-sm text-muted-foreground">{note}</p>}
      <table className="mt-4 w-full text-sm tabular-nums">
        <thead>
          <tr className="border-b border-border text-left text-muted-foreground">
            <th scope="col" className="py-2 font-medium">
              Loan year
            </th>
            <th scope="col" className="py-2 text-right font-medium">
              Monthly
            </th>
            <th scope="col" className="py-2 text-right font-medium">
              That year
            </th>
          </tr>
        </thead>
        <tbody>
          {shown.map((y) => {
            const m = byYear[y - 1].monthly;
            return (
              <tr key={y} className="border-b border-border/60 last:border-0">
                <th scope="row" className="py-2 text-left font-medium text-foreground">
                  Year {y}
                  {y === last && last > 1 ? " (last)" : ""}
                </th>
                <td className="py-2 text-right text-foreground">{formatCurrency(m)}</td>
                <td className="py-2 text-right text-muted-foreground">{formatCurrency(m * 12)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
};

export default FeeSchedule;
