import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { CONFORMING_LIMIT } from "@/lib/loanLimits";
import { cn } from "@/lib/utils";

export type LoanType = "conventional" | "fha" | "va" | "usda" | "jumbo";

interface LoanTypeSwitchProps {
  current: LoanType;
  price: number;
  down: number;
  rate: number;
  term: number;
  className?: string;
}

const round = (n: number) => Math.round(n * 1000) / 1000;

/** Each loan calculator's own URL parameters for the same home. */
function href(type: LoanType, price: number, down: number, rate: number, term: number) {
  const pct = price > 0 ? (down / price) * 100 : 0;
  const program = (path: string) =>
    `${path}?homePrice=${round(price)}&downPayment=${Math.round(down)}&downPaymentPercent=${round(pct)}&interestRate=${round(rate)}&loanTerm=${term}`;
  switch (type) {
    case "conventional":
      return `/conventional-mortgage-calculator/?price=${round(price)}&down=${Math.round(down)}&rate=${round(rate)}&term=${term}`;
    case "fha":
      return program("/fha-loan-calculator/");
    case "va":
      return program("/va-loan-calculator/");
    case "usda":
      return program("/usda-loan-calculator/");
    case "jumbo":
      return program("/jumbo-loan-calculator/");
  }
}

const LABELS: Record<LoanType, { name: string; note: string }> = {
  conventional: { name: "Conventional", note: "PMI ends at 22% equity" },
  fha: { name: "FHA", note: "3.5% down, MIP" },
  va: { name: "VA", note: "0% down, no PMI" },
  usda: { name: "USDA", note: "0% down, rural areas" },
  jumbo: { name: "Jumbo", note: `Loans over ${Math.round(CONFORMING_LIMIT / 1000)}k` },
};

/**
 * "Run this home as another loan type": the same price, down payment, rate and
 * term, opened in each loan program's calculator.
 */
const LoanTypeSwitch = ({ current, price, down, rate, term, className }: LoanTypeSwitchProps) => {
  const loan = price - down;
  const types: LoanType[] = (["conventional", "fha", "va", "usda", "jumbo"] as const).filter(
    (t) => t !== current && (t !== "jumbo" || loan > CONFORMING_LIMIT),
  );
  return (
    <nav aria-labelledby="loan-switch-heading" className={cn("calculator-card p-4 sm:p-5", className)}>
      <h2 id="loan-switch-heading" className="text-sm font-semibold text-foreground">
        Same home, another loan type
      </h2>
      <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4" role="list">
        {types.map((t) => (
          <li key={t}>
            <Link
              to={href(t, price, down, rate, term)}
              className="group flex h-full flex-col rounded-xl border border-border bg-background/60 px-3 py-2 transition-colors hover:border-primary/40 hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span className="flex items-center gap-1 text-sm font-semibold text-foreground">
                {LABELS[t].name}
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </span>
              <span className="text-xs text-muted-foreground">{LABELS[t].note}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default LoanTypeSwitch;
