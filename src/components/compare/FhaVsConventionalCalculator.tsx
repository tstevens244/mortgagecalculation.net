import { useMemo } from "react";
import MarketRate from "@/components/calc/MarketRate";
import { averageRate } from "@/lib/marketRates";
import { CREDIT_TIERS, pmiRate as estimatePmiRate, tierLabel } from "@/lib/pmi";
import { AlertTriangle, ArrowLeftRight } from "lucide-react";
import CurrencyInput from "@/components/CurrencyInput";
import PercentInput from "@/components/PercentInput";
import FormRow from "@/components/FormRow";
import StickyResult from "@/components/StickyResult";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatCurrency } from "@/lib/formatters";
import { fhaVsConventional } from "@/lib/compareMath";
import { CONFORMING_LIMIT, FHA_LIMIT_CEILING, FHA_LIMIT_FLOOR, FHA_UPFRONT_MIP_RATE } from "@/lib/loanLimits";
import { useUrlParam } from "@/lib/urlState";
import { AnswerCard } from "@/components/PaymentAnswer";
import { useLocalCosts } from "@/lib/useLocalCosts";
import { localPrice } from "@/lib/localCosts";
import { LocalPrice } from "@/components/calc/LocalValue";

const yearsMonths = (months: number) => {
  const y = Math.floor(months / 12);
  const m = months % 12;
  return [y ? `${y} yr` : "", m ? `${m} mo` : ""].filter(Boolean).join(" ");
};

/** Same home, FHA loan vs. conventional loan: monthly payment, mortgage insurance and cost over the years you keep it. */
const FhaVsConventionalCalculator = () => {
  const [price, setPrice] = useUrlParam("price", 400000);
  const [down, setDown] = useUrlParam("down", 5);
  const [term, setTerm] = useUrlParam("term", "30");
  const [fhaRate, setFhaRate] = useUrlParam("fhaRate", averageRate(30));
  const [convRate, setConvRate] = useUrlParam("convRate", averageRate(30));
  const [credit, setCredit] = useUrlParam("credit", 740);
  const [pmiRate, setPmiRate] = useUrlParam("pmiRate", estimatePmiRate(100 - 5, 740));
  const [years, setYears] = useUrlParam("years", "7");
  const { costs: local } = useLocalCosts((c) => setPrice(localPrice(c, "fha")), { keys: ["price"] });

  const r = useMemo(
    () =>
      fhaVsConventional({
        price,
        downPercent: down,
        termYears: Number(term),
        fhaRate,
        convRate,
        pmiRate,
        horizonYears: Number(years),
      }),
    [price, down, term, fhaRate, convRate, pmiRate, years],
  );

  const fhaAllowed = down >= 3.5;
  const convAllowed = down >= 3;
  const cheaper = r.fha.cost < r.conv.cost ? "FHA" : "Conventional";
  const savings = Math.abs(r.fha.cost - r.conv.cost);
  const horizonLabel = r.horizonMonths >= Number(term) * 12 ? "the full loan" : `${years} years`;

  const warnings: string[] = [];
  if (!fhaAllowed) warnings.push("FHA loans need at least 3.5% down (10% with a credit score of 500–579).");
  if (!convAllowed) warnings.push("Conventional loans need at least 3% down.");
  if (r.base > CONFORMING_LIMIT) warnings.push(`A conventional loan over ${formatCurrency(CONFORMING_LIMIT)} is a jumbo loan in most counties, with stricter rules.`);
  if (r.base > FHA_LIMIT_CEILING) warnings.push(`FHA can't lend more than ${formatCurrency(FHA_LIMIT_CEILING)}, even in the most expensive counties.`);
  else if (r.base > FHA_LIMIT_FLOOR)
    warnings.push(`FHA limits above ${formatCurrency(FHA_LIMIT_FLOOR)} depend on your county. Check yours before comparing.`);

  const cols = [
    {
      name: "FHA",
      d: r.fha,
      upfront: r.fha.upfrontMip,
      miName: "MIP",
      miEnds: r.fha.mipMonths >= Number(term) * 12 ? "Life of the loan" : `After ${yearsMonths(r.fha.mipMonths)}`,
    },
    {
      name: "Conventional",
      d: r.conv,
      upfront: 0,
      miName: "PMI",
      miEnds: down >= 20 ? "No PMI" : `After ${yearsMonths(r.conv.pmiMonths)}`,
    },
  ];

  return (
    <div className="fade-in calc-layout">
      <section className="calculator-card p-4 sm:p-6" aria-labelledby="fvc-inputs">
        <h2 id="fvc-inputs" className="mb-4 flex items-center gap-2 text-base font-display font-semibold sm:text-xl">
          <ArrowLeftRight className="h-4 w-4 text-accent sm:h-5 sm:w-5" aria-hidden="true" />
          Your home and loans
        </h2>
        <div className="grid items-start gap-4 sm:grid-cols-[repeat(auto-fill,minmax(14rem,1fr))]">
          <FormRow id="fvc-price" label="Home price" hint={<LocalPrice costs={local} kind="fha" value={price} onUse={setPrice} />}>
            <CurrencyInput id="fvc-price" value={price} onChange={setPrice} allowDecimals={false} />
          </FormRow>
          <FormRow id="fvc-down" label="Down payment" hint={`${formatCurrency((price * down) / 100)} down; loan ${formatCurrency(r.base)}`}>
            <PercentInput id="fvc-down" value={down} onChange={setDown} min={0} max={50} decimalPlaces={1} aria-describedby="fvc-down-hint" />
          </FormRow>
          <FormRow id="fvc-term" label="Loan term">
            <Select value={term} onValueChange={setTerm}>
              <SelectTrigger id="fvc-term">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 years</SelectItem>
                <SelectItem value="15">15 years</SelectItem>
              </SelectContent>
            </Select>
          </FormRow>
          <FormRow id="fvc-fha-rate" label="FHA rate" hint="FHA rates are often a little lower than conventional for the same borrower.">
            <PercentInput id="fvc-fha-rate" value={fhaRate} onChange={setFhaRate} min={0} max={20} decimalPlaces={3} aria-describedby="fvc-fha-rate-hint" />
          </FormRow>
          <FormRow id="fvc-conv-rate" label="Conventional rate" hint={<MarketRate term={Number(term)} value={convRate} onUse={setConvRate} />}>
            <PercentInput id="fvc-conv-rate" value={convRate} onChange={setConvRate} min={0} max={20} decimalPlaces={3} />
          </FormRow>
          <FormRow id="fvc-credit" label="Credit score" hint="Sets a typical PMI rate for your score and down payment.">
            <Select
              value={String(credit)}
              onValueChange={(v) => {
                setCredit(Number(v));
                setPmiRate(estimatePmiRate(100 - down, Number(v)));
              }}
            >
              <SelectTrigger id="fvc-credit" aria-describedby="fvc-credit-hint">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CREDIT_TIERS.map((t) => (
                  <SelectItem key={t.min} value={String(t.min)}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormRow>
          <FormRow
            id="fvc-pmi"
            label="Conventional PMI rate (per year)"
            hint={`Typical for ${tierLabel(credit)} credit with ${down}% down is ${estimatePmiRate(100 - down, credit).toFixed(2)}%. Ask your lender for a quote.`}
          >
            <PercentInput id="fvc-pmi" value={pmiRate} onChange={setPmiRate} min={0} max={3} decimalPlaces={2} aria-describedby="fvc-pmi-hint" />
          </FormRow>
          <FormRow id="fvc-years" label="Years you'll keep the loan" hint="Until you expect to sell or refinance.">
            <Select value={years} onValueChange={setYears}>
              <SelectTrigger id="fvc-years" aria-describedby="fvc-years-hint">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["3", "5", "7", "10", "15", "20", "30"].map((y) => (
                  <SelectItem key={y} value={y}>
                    {y} years
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormRow>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-sm tabular-nums">
            <caption className="sr-only">FHA and conventional loan details</caption>
            <thead>
              <tr className="border-b border-border">
                <th scope="col" className="py-2 text-left font-medium text-muted-foreground"></th>
                {cols.map((c) => (
                  <th key={c.name} scope="col" className="py-2 text-right font-semibold text-foreground">
                    {c.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["Loan amount", ...cols.map((c) => formatCurrency(c.d.loan))],
                ["Upfront mortgage insurance", ...cols.map((c) => (c.upfront ? `${formatCurrency(c.upfront)} (financed)` : "None"))],
                ["Principal and interest", ...cols.map((c) => formatCurrency(c.d.pi))],
                ["Monthly mortgage insurance", ...cols.map((c) => formatCurrency(c.d.monthlyMi))],
                ["Mortgage insurance ends", ...cols.map((c) => c.miEnds)],
                [`Mortgage insurance paid, ${horizonLabel}`, ...cols.map((c) => formatCurrency(c.d.miPaid + c.upfront))],
                [`Cost of borrowing, ${horizonLabel}`, ...cols.map((c) => formatCurrency(c.d.cost))],
              ].map(([label, a, b]) => (
                <tr key={label} className="border-b border-border last:border-0">
                  <th scope="row" className="py-2 pr-3 text-left font-normal text-muted-foreground">{label}</th>
                  <td className="py-2 text-right font-medium">{a}</td>
                  <td className="py-2 text-right font-medium">{b}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-2 text-xs text-muted-foreground">
            Cost of borrowing = interest and mortgage insurance paid, plus the financed {FHA_UPFRONT_MIP_RATE}% upfront MIP
            still owed. Property tax and insurance are the same for both and left out.
          </p>
        </div>
      </section>

      <aside className="calc-results" aria-label="Comparison results">
        <StickyResult targetId="calc-result" label={`${cheaper} saves`} value={formatCurrency(savings)} />
        <AnswerCard
          label={`${cheaper} costs less over ${horizonLabel}`}
          total={savings}
          context="counting payments, mortgage insurance and the balance still owed"
          stats={[
            { label: "FHA monthly", value: formatCurrency(r.fha.payment), hint: "incl. MIP" },
            { label: "Conventional monthly", value: formatCurrency(r.conv.payment), hint: r.conv.monthlyMi > 0 ? "incl. PMI" : "no PMI" },
            { label: "FHA mortgage insurance", value: formatCurrency(r.fha.upfrontMip + r.fha.miPaid), hint: "upfront + annual" },
            { label: "Conventional PMI", value: formatCurrency(r.conv.miPaid), hint: r.conv.pmiMonths > 0 ? `ends after ~${Math.ceil(r.conv.pmiMonths / 12)} yrs` : "none" },
          ]}
        />

        {warnings.length > 0 && (
          <div className="space-y-2 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm" role="status">
            {warnings.map((w) => (
              <p key={w} className="flex gap-2">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" aria-hidden="true" />
                {w}
              </p>
            ))}
          </div>
        )}

        <div className="calculator-card space-y-2 p-4 text-sm sm:p-6">
          <h2 className="text-lg font-display font-semibold">Why the answer changes</h2>
          <ul className="list-disc space-y-1.5 pl-5 text-muted-foreground">
            <li>
              FHA mortgage insurance doesn't depend on your credit score. Conventional PMI does, so a low score makes
              conventional more expensive.
            </li>
            <li>
              With less than 10% down, FHA mortgage insurance lasts the life of the loan. Conventional PMI ends at 78%
              loan-to-value, so the longer you keep the loan, the more conventional pulls ahead.
            </li>
            <li>Refinancing or selling early limits how much either one costs.</li>
          </ul>
        </div>
      </aside>
    </div>
  );
};

export default FhaVsConventionalCalculator;
