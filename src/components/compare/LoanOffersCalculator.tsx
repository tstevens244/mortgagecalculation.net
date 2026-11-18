import { useMemo, useState } from "react";
import { ListChecks, Trophy } from "lucide-react";
import CurrencyInput from "@/components/CurrencyInput";
import PercentInput from "@/components/PercentInput";
import FormRow from "@/components/FormRow";
import StickyResult from "@/components/StickyResult";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatCurrency } from "@/lib/formatters";
import { compareOffers, type Offer } from "@/lib/compareMath";
import { cn } from "@/lib/utils";

const NAMES = ["Offer A", "Offer B", "Offer C"];

/** Compare up to three loan offers by monthly payment, APR and total cost over the years you'll keep the loan. */
const LoanOffersCalculator = () => {
  const [loan, setLoan] = useState(320000);
  const [term, setTerm] = useState("30");
  const [years, setYears] = useState("7");
  const [offers, setOffers] = useState<Offer[]>([
    { rate: 6.5, upfront: 4000 },
    { rate: 6.75, upfront: 0 },
    { rate: 6.25, upfront: 8000 },
  ]);

  const update = (i: number, field: keyof Offer, value: number) =>
    setOffers((prev) => prev.map((o, j) => (j === i ? { ...o, [field]: value } : o)));

  const results = useMemo(
    () => compareOffers(loan, Number(term) * 12, Number(years) * 12, offers),
    [loan, term, years, offers],
  );
  const order = results.map((r, i) => ({ ...r, i })).sort((a, b) => a.cost - b.cost);
  const best = order[0];
  const runnerUp = order[1];

  return (
    <div className="fade-in grid gap-6 lg:grid-cols-[1fr_400px]">
      <section className="calculator-card p-4 sm:p-6" aria-labelledby="offers-inputs">
        <h2 id="offers-inputs" className="mb-4 flex items-center gap-2 text-base font-display font-semibold sm:text-xl">
          <ListChecks className="h-4 w-4 text-accent sm:h-5 sm:w-5" aria-hidden="true" />
          Your loan
        </h2>
        <div className="space-y-3">
          <FormRow id="offers-loan" label="Loan amount">
            <CurrencyInput id="offers-loan" value={loan} onChange={setLoan} allowDecimals={false} />
          </FormRow>
          <FormRow id="offers-term" label="Loan term">
            <Select value={term} onValueChange={setTerm}>
              <SelectTrigger id="offers-term">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 years</SelectItem>
                <SelectItem value="20">20 years</SelectItem>
                <SelectItem value="15">15 years</SelectItem>
              </SelectContent>
            </Select>
          </FormRow>
          <FormRow id="offers-years" label="Years you'll keep the loan" hint="Until you expect to sell or refinance.">
            <Select value={years} onValueChange={setYears}>
              <SelectTrigger id="offers-years" aria-describedby="offers-years-hint">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["2", "3", "5", "7", "10", "15", "20", "30"].map((y) => (
                  <SelectItem key={y} value={y}>
                    {y} years
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormRow>
        </div>

        <h2 className="mb-3 mt-6 text-base font-display font-semibold sm:text-lg">Offers</h2>
        <p className="mb-3 text-xs text-muted-foreground">
          From page 2 of each Loan Estimate: the interest rate and section A, "Origination Charges" (points plus lender
          fees). Leave out third-party costs like title and appraisal, which are about the same for every lender.
        </p>
        <div className="grid gap-3 md:grid-cols-3">
          {offers.map((o, i) => (
            <fieldset
              key={NAMES[i]}
              className={cn(
                "space-y-3 rounded-2xl border p-3",
                best.i === i ? "border-primary/50 bg-primary/5" : "border-border bg-background/60",
              )}
            >
              <legend className="px-1 text-sm font-semibold text-foreground">{NAMES[i]}</legend>
              <div className="space-y-1.5">
                <Label htmlFor={`offer-${i}-rate`} className="text-xs text-muted-foreground">
                  Interest rate
                </Label>
                <PercentInput id={`offer-${i}-rate`} value={o.rate} onChange={(v) => update(i, "rate", v)} min={0} max={20} decimalPlaces={3} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor={`offer-${i}-fees`} className="text-xs text-muted-foreground">
                  Points and lender fees
                </Label>
                <CurrencyInput id={`offer-${i}-fees`} value={o.upfront} onChange={(v) => update(i, "upfront", v)} allowDecimals={false} />
              </div>
            </fieldset>
          ))}
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-sm tabular-nums">
            <caption className="sr-only">Loan offers compared</caption>
            <thead>
              <tr className="border-b border-border">
                <th scope="col" className="py-2 text-left font-medium text-muted-foreground"></th>
                {NAMES.map((n, i) => (
                  <th key={n} scope="col" className={cn("py-2 text-right font-semibold", best.i === i ? "text-primary" : "text-foreground")}>
                    {n}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["Monthly payment", results.map((r) => formatCurrency(r.payment))],
                ["APR", results.map((r) => (Number.isFinite(r.apr) ? `${r.apr.toFixed(3)}%` : "—"))],
                ["Up-front cost", results.map((r) => formatCurrency(r.upfront))],
                [`Total cost, ${years} years`, results.map((r) => formatCurrency(r.cost))],
              ].map(([label, vals]) => (
                <tr key={label as string} className="border-b border-border last:border-0">
                  <th scope="row" className="py-2 pr-3 text-left font-normal text-muted-foreground">{label}</th>
                  {(vals as string[]).map((v, i) => (
                    <td key={i} className={cn("py-2 text-right font-medium", best.i === i && "text-primary")}>
                      {v}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-2 text-xs text-muted-foreground">
            Total cost = up-front cost plus interest paid over the years you keep the loan.
          </p>
        </div>
      </section>

      <aside className="space-y-4" aria-label="Best offer">
        <StickyResult targetId="calc-result" label={`${NAMES[best.i]} costs least`} value={formatCurrency(best.cost)} />
        <div id="calc-result" className="result-highlight">
          <p className="flex items-center gap-1.5 text-sm font-medium uppercase tracking-wide text-primary-foreground/80">
            <Trophy className="h-4 w-4" aria-hidden="true" />
            Lowest cost over {years} years
          </p>
          <p className="mt-2 text-4xl font-display font-bold lg:text-5xl">{NAMES[best.i]}</p>
          <p className="mt-2 text-sm text-primary-foreground/80">
            {formatCurrency(best.cost)} in fees and interest,{" "}
            {formatCurrency(runnerUp.cost - best.cost)} less than {NAMES[runnerUp.i]}
          </p>
        </div>

        <div className="calculator-card space-y-2 p-4 text-sm sm:p-6">
          <h2 className="text-lg font-display font-semibold">APR vs. total cost</h2>
          <p className="text-muted-foreground">
            APR spreads the up-front fees over the full loan term. If you'll sell or refinance sooner, an offer with
            low fees can cost less even with a higher APR. That's why the winner here is picked by total cost over the
            years you set.
          </p>
          <p className="text-muted-foreground">Try a shorter or longer time frame to see whether the winner changes.</p>
        </div>
      </aside>
    </div>
  );
};

export default LoanOffersCalculator;
