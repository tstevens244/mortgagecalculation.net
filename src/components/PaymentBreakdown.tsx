import { formatCurrency } from "@/lib/formatters";
import VizCard from "@/components/viz/VizCard";
import StackedBar from "@/components/viz/StackedBar";
import { SERIES, pct } from "@/components/viz/theme";

interface PaymentBreakdownProps {
  /** Principal in the first payment. */
  principal: number;
  /** Interest in the first payment. */
  interest: number;
  tax: number;
  insurance: number;
  pmi: number;
  hoa: number;
  /** Name for the mortgage insurance line, e.g. "MIP" for FHA. */
  pmiLabel?: string;
  /** When mortgage insurance ends, e.g. "Ends in about 9 years". */
  pmiNote?: string;
}

/**
 * Where each monthly payment goes. One bar split into the loan (principal and
 * interest) and the housing costs that ride along with it (tax, insurance,
 * mortgage insurance, HOA), with every amount listed underneath.
 */
const PaymentBreakdown = ({ principal, interest, tax, insurance, pmi, hoa, pmiLabel = "PMI", pmiNote }: PaymentBreakdownProps) => {
  const total = principal + interest + tax + insurance + pmi + hoa;
  const loan = principal + interest;
  const costs = total - loan;

  return (
    <VizCard
      id="payment-breakdown"
      title="Where your monthly payment goes"
      description={
        <>
          {formatCurrency(total)} a month: {pct(loan, total)} repays the loan, {pct(costs, total)} covers taxes,
          insurance and fees.
        </>
      }
      footnote="Principal and interest are for your first payment. Each month a little more goes to principal and a little less to interest; the total stays the same."
    >
      <StackedBar
        size="lg"
        legend
        segments={[
          { label: "Principal", value: principal, color: SERIES.principal, note: "Pays down what you owe and builds equity" },
          { label: "Interest", value: interest, color: SERIES.interest, note: "The lender's charge for the loan" },
          { label: "Property tax", value: tax, color: SERIES.tax },
          { label: "Home insurance", value: insurance, color: SERIES.insurance },
          { label: pmiLabel, value: pmi, color: SERIES.pmi, note: pmiNote },
          { label: "HOA dues", value: hoa, color: SERIES.hoa },
        ]}
      />
      <div className="mt-2 flex items-center justify-between border-t border-border pt-3 text-sm">
        <span className="font-semibold text-foreground">Total monthly payment</span>
        <span className="text-lg font-semibold tabular-nums text-foreground">{formatCurrency(total)}</span>
      </div>
    </VizCard>
  );
};

export default PaymentBreakdown;
