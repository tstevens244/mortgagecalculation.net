import { formatCurrency } from "@/lib/formatters";
import type { closingCosts } from "@/lib/closingCosts";

type Result = ReturnType<typeof closingCosts>;

interface ClosingCostTableProps {
  result: Result;
  down: number;
  /** Show each line, not just section subtotals. */
  detailed?: boolean;
}

/** Closing costs by Loan Estimate section, then down payment and cash to close. */
const ClosingCostTable = ({ result, down, detailed = true }: ClosingCostTableProps) => (
  <table className="w-full text-sm tabular-nums">
    <caption className="sr-only">Estimated closing costs and cash to close</caption>
    {result.sections.map((s) =>
      s.total > 0.5 ? (
        <tbody key={s.id} className="border-b border-border/60">
          <tr>
            <th scope="rowgroup" className="pt-3 pb-1 text-left font-semibold text-foreground">
              <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded bg-secondary text-[11px] font-bold text-muted-foreground" aria-hidden="true">
                {s.id}
              </span>
              {s.title}
            </th>
            <td className="pt-3 pb-1 text-right font-semibold text-foreground">{formatCurrency(s.total)}</td>
          </tr>
          {detailed &&
            s.lines.map((l) => (
              <tr key={l.label}>
                <th scope="row" className="py-1 pl-7 text-left font-normal text-muted-foreground">
                  {l.label}
                </th>
                <td className="py-1 text-right text-muted-foreground">{formatCurrency(l.amount)}</td>
              </tr>
            ))}
          <tr aria-hidden="true">
            <td colSpan={2} className="pb-2" />
          </tr>
        </tbody>
      ) : null,
    )}
    <tbody>
      <tr>
        <th scope="row" className="pt-3 text-left font-semibold text-foreground">
          Total closing costs
          <span className="block text-xs font-normal text-muted-foreground">{result.percentOfPrice.toFixed(1)}% of the price</span>
        </th>
        <td className="pt-3 text-right align-top font-semibold text-foreground">{formatCurrency(result.total)}</td>
      </tr>
      {result.credits > 0 && (
        <tr>
          <th scope="row" className="py-1 text-left font-normal text-muted-foreground">
            Seller and lender credits
          </th>
          <td className="py-1 text-right text-success">−{formatCurrency(result.credits)}</td>
        </tr>
      )}
      <tr>
        <th scope="row" className="py-1 text-left font-normal text-muted-foreground">
          Down payment
        </th>
        <td className="py-1 text-right text-muted-foreground">{formatCurrency(down)}</td>
      </tr>
      <tr className="border-t border-border">
        <th scope="row" className="pt-3 text-left text-base font-semibold text-foreground">
          Cash to close
        </th>
        <td className="pt-3 text-right text-base font-bold text-foreground">{formatCurrency(result.cashToClose)}</td>
      </tr>
    </tbody>
  </table>
);

export default ClosingCostTable;
