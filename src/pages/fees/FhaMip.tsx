import { Link } from "react-router-dom";
import CalculatorPage from "@/components/CalculatorPage";
import FhaMipCalculator from "@/components/fees/FhaMipCalculator";
import { formatCurrency } from "@/lib/formatters";
import { fhaMip } from "@/lib/feeMath";
import { FHA_MIP_LARGE_LOAN_THRESHOLD, FHA_UPFRONT_MIP_RATE, LIMITS_YEAR, fhaAnnualMipRate } from "@/lib/loanLimits";

const PRICE = 350_000;
const RATE = 6.5;
const ex = fhaMip({ price: PRICE, down: PRICE * 0.035, ratePercent: RATE, termYears: 30 });
const ex10 = fhaMip({ price: PRICE, down: PRICE * 0.1, ratePercent: RATE, termYears: 30 });
const small = 400_000;
const large = 800_000;

const faqs = [
  {
    q: "How do you calculate FHA MIP?",
    a: `Upfront MIP is ${FHA_UPFRONT_MIP_RATE}% of the base loan. Monthly MIP is the annual rate times the loan balance, divided by 12. On a ${formatCurrency(ex.baseLoan)} loan, that's ${formatCurrency(ex.upfront)} up front and ${formatCurrency(ex.monthly)} a month at ${ex.annualRate}%.`,
  },
  {
    q: `What is the FHA MIP rate for ${LIMITS_YEAR}?`,
    a: `For most 30-year loans it's 0.55% a year with less than 5% down and 0.50% with 5% or more. Loans over ${formatCurrency(FHA_MIP_LARGE_LOAN_THRESHOLD)} pay 0.70% to 0.75%. 15-year loans pay 0.15% to 0.65%. Upfront MIP is ${FHA_UPFRONT_MIP_RATE}% on every loan.`,
  },
  {
    q: "How long do you pay MIP on an FHA loan?",
    a: "With at least 10% down, 11 years. With less than 10% down, for the life of the loan. To drop it sooner you'd refinance into a conventional loan once you have about 20% equity.",
  },
  {
    q: "Is FHA upfront MIP refundable?",
    a: "Partly, if you refinance into another FHA loan within 3 years. The refund shrinks each month and is credited toward the new loan's upfront MIP. It isn't refunded if you refinance into a conventional loan or sell.",
  },
];

const FhaMip = () => (
  <CalculatorPage
    path="/fha-mip-calculator/"
    title={`FHA MIP Calculator ${LIMITS_YEAR}: Upfront & Monthly Mortgage Insurance`}
    description={`Calculate FHA mortgage insurance for ${LIMITS_YEAR}: ${FHA_UPFRONT_MIP_RATE}% upfront MIP, your monthly MIP and annual rate, how many years you'll pay it, and the total cost.`}
    heading="FHA MIP Calculator"
    intro={
      <p>
        See what FHA mortgage insurance costs on your loan: the {FHA_UPFRONT_MIP_RATE}% upfront premium, your monthly
        MIP, how long it lasts, and the total.
      </p>
    }
    calculator={<FhaMipCalculator />}
    faqs={faqs}
    featureList={[
      `Upfront MIP (${FHA_UPFRONT_MIP_RATE}%)`,
      "Annual MIP rate by term, down payment and loan size",
      "Monthly MIP by year",
      "11 years or life of the loan",
      "Total MIP cost",
    ]}
  >
    <h2>FHA annual MIP rates</h2>
    <div className="hub-table-wrap">
      <table>
        <caption className="sr-only">FHA annual MIP rates by term, down payment and loan amount</caption>
        <thead>
          <tr>
            <th scope="col">Term and down payment</th>
            <th scope="col">Loan up to {formatCurrency(FHA_MIP_LARGE_LOAN_THRESHOLD)}</th>
            <th scope="col">Larger loans</th>
            <th scope="col">How long</th>
          </tr>
        </thead>
        <tbody>
          {[
            { label: "Over 15 years, under 5% down", term: 30, ltv: 96.5, years: "Life of loan" },
            { label: "Over 15 years, 5% to 9.99% down", term: 30, ltv: 95, years: "Life of loan" },
            { label: "Over 15 years, 10%+ down", term: 30, ltv: 90, years: "11 years" },
            { label: "15 years or less, under 10% down", term: 15, ltv: 95, years: "Life of loan" },
            { label: "15 years or less, 10%+ down", term: 15, ltv: 90, years: "11 years" },
          ].map((r) => (
            <tr key={r.label}>
              <th scope="row">{r.label}</th>
              <td data-label="Standard">{fhaAnnualMipRate(r.term, r.ltv, small)}%</td>
              <td data-label="Larger loans">{fhaAnnualMipRate(r.term, r.ltv, large)}%</td>
              <td data-label="How long">{r.years}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <p className="hub-note">
      Rates for loans endorsed since March 20, 2023 (HUD Mortgagee Letter 2023-05). 15-year loans over{" "}
      {formatCurrency(FHA_MIP_LARGE_LOAN_THRESHOLD)} with 22% or more down pay {fhaAnnualMipRate(15, 78, large)}%.
    </p>

    <h2>Example: MIP on a {formatCurrency(PRICE)} home</h2>
    <ul>
      <li>
        <strong>3.5% down:</strong> the base loan is {formatCurrency(ex.baseLoan)}. Upfront MIP is{" "}
        {formatCurrency(ex.upfront)}, added to the loan. Annual MIP at {ex.annualRate}% is{" "}
        <strong>{formatCurrency(ex.monthly)} a month</strong>, for the life of the loan: about{" "}
        {formatCurrency(ex.totalMip)} in all over 30 years.
      </li>
      <li>
        <strong>10% down:</strong> {formatCurrency(ex10.monthly)} a month at {ex10.annualRate}%, ending after 11 years,
        for a total of about {formatCurrency(ex10.totalMip)}.
      </li>
    </ul>
    <p>
      Most FHA borrowers with less than 10% down don't pay MIP for 30 years in practice: they refinance into a
      conventional loan once they reach about 20% equity. Compare the two loans in the{" "}
      <Link to="/fha-vs-conventional-calculator/">FHA vs. conventional calculator</Link>.
    </p>

    <h2>More on FHA loans</h2>
    <p>
      For how MIP compares with PMI and ways to get rid of it, read{" "}
      <Link to="/guides/fha-mortgage-insurance-mip/">FHA mortgage insurance (MIP) explained</Link>. To see MIP in your
      full monthly payment with taxes and insurance, use the <Link to="/fha-loan-calculator/">FHA loan calculator</Link>.
    </p>

    <h2>Sources</h2>
    <ul className="hub-note">
      <li>
        <a href="https://www.hud.gov/sites/dfiles/OCHCO/documents/2023-05hsgml.pdf" target="_blank" rel="noopener noreferrer">
          HUD Mortgagee Letter 2023-05: Reduction of FHA annual MIP rates
        </a>
      </li>
      <li>
        <a href="https://www.hud.gov/program_offices/housing/sfh/handbook_4000-1" target="_blank" rel="noopener noreferrer">
          HUD Single Family Housing Policy Handbook 4000.1
        </a>
      </li>
    </ul>
  </CalculatorPage>
);

export default FhaMip;
