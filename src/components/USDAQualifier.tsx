import { useMemo, useState } from "react";
import { AlertTriangle, BadgeCheck } from "lucide-react";
import CurrencyInput from "@/components/CurrencyInput";
import PercentInput from "@/components/PercentInput";
import FormRow from "@/components/FormRow";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatCurrency } from "@/lib/formatters";
import { monthlyPayment, usdaMaxPrice } from "@/lib/mortgageMath";
import { USDA_ANNUAL_FEE_RATE, USDA_UPFRONT_FEE_RATE } from "@/lib/loanLimits";

// Approximate 2026 USDA guaranteed-loan income limits in standard-cost counties.
// Many counties are higher; the USDA lookup has the exact figure.
const INCOME_LIMIT = { small: 119_850, large: 158_250 };

/** How much house a USDA borrower qualifies for under the 29% / 41% debt-to-income guidelines. */
const USDAQualifier = () => {
  const [income, setIncome] = useState(72000);
  const [debts, setDebts] = useState(400);
  const [rate, setRate] = useState(6.5);
  const [taxRate, setTaxRate] = useState(1);
  const [insurance, setInsurance] = useState(1500);
  const [hoa, setHoa] = useState(0);
  const [household, setHousehold] = useState<"small" | "large">("small");

  const r = useMemo(() => {
    const q = usdaMaxPrice({
      monthlyIncome: income / 12,
      monthlyDebts: debts,
      annualRatePercent: rate,
      propertyTaxRatePercent: taxRate,
      annualInsurance: insurance,
      monthlyHoa: hoa,
      upfrontFeePercent: USDA_UPFRONT_FEE_RATE,
      annualFeePercent: USDA_ANNUAL_FEE_RATE,
    });
    const loan = q.price * (1 + USDA_UPFRONT_FEE_RATE / 100);
    return {
      ...q,
      loan,
      pi: monthlyPayment(loan, rate, 360),
      fee: (q.price * USDA_ANNUAL_FEE_RATE) / 100 / 12,
      tax: (q.price * taxRate) / 100 / 12,
    };
  }, [income, debts, rate, taxRate, insurance, hoa]);

  const overLimit = income > INCOME_LIMIT[household];

  return (
    <section id="usda-qualify" aria-labelledby="usda-qualify-heading" className="mt-12 scroll-mt-24">
      <h2 id="usda-qualify-heading" className="mb-2 text-2xl font-display font-semibold text-foreground">
        How much USDA loan do I qualify for?
      </h2>
      <p className="mb-6 max-w-3xl text-muted-foreground">
        USDA guidelines cap your housing payment at 29% of gross monthly income and all debts at 41%. Enter your
        household's numbers to see the home price that fits, with no down payment.
      </p>

      <div className="calc-layout">
        <div className="calculator-card grid items-start gap-4 sm:grid-cols-[repeat(auto-fill,minmax(14rem,1fr))] p-4 sm:p-6">
          <FormRow id="usdaq-income" label="Annual household income" hint="Before taxes. USDA counts income from everyone in the household.">
            <CurrencyInput id="usdaq-income" value={income} onChange={setIncome} allowDecimals={false} aria-describedby="usdaq-income-hint" />
          </FormRow>
          <FormRow id="usdaq-household" label="Household size">
            <Select value={household} onValueChange={(v) => setHousehold(v as "small" | "large")}>
              <SelectTrigger id="usdaq-household">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">1 to 4 people</SelectItem>
                <SelectItem value="large">5 to 8 people</SelectItem>
              </SelectContent>
            </Select>
          </FormRow>
          <FormRow id="usdaq-debts" label="Monthly debt payments" hint="Car, student loan and credit card minimums, child support.">
            <CurrencyInput id="usdaq-debts" value={debts} onChange={setDebts} allowDecimals={false} aria-describedby="usdaq-debts-hint" />
          </FormRow>
          <FormRow id="usdaq-rate" label="Interest rate">
            <PercentInput id="usdaq-rate" value={rate} onChange={setRate} min={0} max={20} decimalPlaces={3} />
          </FormRow>
          <FormRow id="usdaq-tax" label="Property tax rate (per year)">
            <PercentInput id="usdaq-tax" value={taxRate} onChange={setTaxRate} min={0} max={5} decimalPlaces={2} />
          </FormRow>
          <FormRow id="usdaq-ins" label="Home insurance (per year)">
            <CurrencyInput id="usdaq-ins" value={insurance} onChange={setInsurance} allowDecimals={false} />
          </FormRow>
          <FormRow id="usdaq-hoa" label="HOA dues (per month)">
            <CurrencyInput id="usdaq-hoa" value={hoa} onChange={setHoa} allowDecimals={false} />
          </FormRow>
        </div>

        <div className="calc-results">
          <div className="result-highlight">
            <p className="text-sm font-medium uppercase tracking-wide text-primary-foreground/80">You may qualify for a home up to</p>
            <p className="mt-2 text-4xl font-display font-bold lg:text-5xl">{formatCurrency(Math.floor(r.price / 1000) * 1000)}</p>
            <p className="mt-2 text-sm text-primary-foreground/80">
              Loan of {formatCurrency(r.loan)} including the {USDA_UPFRONT_FEE_RATE}% upfront fee, with a{" "}
              {formatCurrency(r.maxPayment)} monthly payment
            </p>
          </div>

          <div className="calculator-card space-y-2 p-4 text-sm sm:p-6">
            <h3 className="font-display text-lg font-semibold">Monthly payment</h3>
            {[
              ["Principal and interest", r.pi],
              [`Annual fee (${USDA_ANNUAL_FEE_RATE}%)`, r.fee],
              ["Property tax", r.tax],
              ["Home insurance", insurance / 12],
              ["HOA dues", hoa],
            ].map(([k, v]) => (
              <div key={k as string} className="flex justify-between gap-2 tabular-nums">
                <span className="text-muted-foreground">{k}</span>
                <span className="font-medium">{formatCurrency(v as number)}</span>
              </div>
            ))}
            <p className="border-t border-border pt-2 text-muted-foreground">
              Limited by the {r.limitedBy === "housing" ? "29% housing" : "41% total debt"} guideline.
              {r.limitedBy === "total" && " Paying down other debts would raise this."}
            </p>
          </div>

          {overLimit ? (
            <div className="flex gap-2 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm" role="status">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" aria-hidden="true" />
              <p>
                Your income is above the {formatCurrency(INCOME_LIMIT[household])} limit that applies in most counties
                for this household size. Some higher-cost counties allow more; check the{" "}
                <a
                  href="https://eligibility.sc.egov.usda.gov/eligibility/incomeEligibilityAction.do"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  USDA income lookup
                </a>
                .
              </p>
            </div>
          ) : (
            <div className="flex gap-2 rounded-lg border border-border bg-card p-3 text-sm">
              <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
              <p className="text-muted-foreground">
                Under the {formatCurrency(INCOME_LIMIT[household])} income limit that applies in most counties. Confirm
                your county's limit and the property's address on the{" "}
                <a
                  href="https://eligibility.sc.egov.usda.gov/eligibility/welcomeAction.do?pageAction=sfp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline"
                >
                  USDA eligibility site
                </a>
                .
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default USDAQualifier;
