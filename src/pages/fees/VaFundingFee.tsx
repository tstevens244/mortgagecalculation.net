import { Link } from "react-router-dom";
import CalculatorPage from "@/components/CalculatorPage";
import VaFeeCalculator from "@/components/fees/VaFeeCalculator";
import { formatCurrency } from "@/lib/formatters";
import { vaFees, vaFeeRate } from "@/lib/feeMath";
import { LIMITS_YEAR } from "@/lib/loanLimits";

const pct = (r: number) => `${r.toFixed(2)}%`;
const PRICE = 350_000;
const RATE = 6.25;
const ex = vaFees({ purpose: "purchase", amount: PRICE, down: 0, firstUse: true, exempt: false, financed: true, ratePercent: RATE, termYears: 30 });
const ex5 = vaFees({ purpose: "purchase", amount: PRICE, down: PRICE * 0.05, firstUse: true, exempt: false, financed: true, ratePercent: RATE, termYears: 30 });

const TIERS = [
  { label: "Less than 5%", down: 0 },
  { label: "5% to 9.99%", down: 5 },
  { label: "10% or more", down: 10 },
];

const faqs = [
  {
    q: "How do you calculate the VA funding fee?",
    a: `Multiply the loan amount by the rate for your loan type, down payment and prior use. A first-time buyer with no down payment on a ${formatCurrency(PRICE)} home pays ${pct(ex.rate)}: ${formatCurrency(ex.fee)}.`,
  },
  {
    q: `What is the VA funding fee for ${LIMITS_YEAR}?`,
    a: `For purchases: ${pct(vaFeeRate("purchase", true, 0, false))} the first time with less than 5% down (${pct(vaFeeRate("purchase", false, 0, false))} after), 1.50% with 5% down and 1.25% with 10% down. Cash-out refinances are 2.15% the first time and 3.30% after. IRRRLs are 0.50%.`,
  },
  {
    q: "Is the VA funding fee charged on the loan amount or the home price?",
    a: "On the loan amount. With a down payment the loan is smaller, so you pay a lower rate on a smaller amount.",
  },
  {
    q: "Who doesn't have to pay the VA funding fee?",
    a: "Veterans receiving or eligible for VA disability compensation, active-duty service members with a Purple Heart, and surviving spouses receiving Dependency and Indemnity Compensation. Your Certificate of Eligibility shows whether you're exempt.",
  },
  {
    q: "Should I finance the VA funding fee or pay it at closing?",
    a: "Paying it at closing is cheaper because you don't pay interest on it. Financing it keeps cash in your pocket. You can also ask the seller to pay it as part of their concessions.",
  },
];

const VaFundingFee = () => (
  <CalculatorPage
    path="/va-funding-fee-calculator/"
    title={`VA Funding Fee Calculator ${LIMITS_YEAR}: Purchase, Cash-Out & IRRRL`}
    description={`Calculate your ${LIMITS_YEAR} VA funding fee for a purchase, cash-out refinance or IRRRL: the rate for your down payment and prior use, exemptions, and what financing the fee costs.`}
    heading="VA Funding Fee Calculator"
    intro={
      <p>
        Find your VA funding fee for a home purchase, cash-out refinance or IRRRL, see how a down payment lowers it, and
        what it costs to add it to the loan.
      </p>
    }
    calculator={<VaFeeCalculator />}
    faqs={faqs}
    featureList={[
      "Purchase, cash-out refinance and IRRRL rates",
      "First use and subsequent use",
      "Down payment tiers (5% and 10%)",
      "Disability and other exemptions",
      "Monthly cost of financing the fee",
    ]}
  >
    <h2>{LIMITS_YEAR} VA funding fee chart</h2>
    <div className="hub-table-wrap">
      <table>
        <caption className="sr-only">VA funding fee for purchase loans</caption>
        <thead>
          <tr>
            <th scope="col">Purchase, down payment</th>
            <th scope="col">First use</th>
            <th scope="col">Used before</th>
          </tr>
        </thead>
        <tbody>
          {TIERS.map((t) => (
            <tr key={t.label}>
              <th scope="row">{t.label}</th>
              <td data-label="First use">{pct(vaFeeRate("purchase", true, t.down, false))}</td>
              <td data-label="Used before">{pct(vaFeeRate("purchase", false, t.down, false))}</td>
            </tr>
          ))}
          <tr>
            <th scope="row">Cash-out refinance</th>
            <td data-label="First use">{pct(vaFeeRate("cashout", true, 0, false))}</td>
            <td data-label="Used before">{pct(vaFeeRate("cashout", false, 0, false))}</td>
          </tr>
          <tr>
            <th scope="row">IRRRL (streamline refinance)</th>
            <td data-label="First use">{pct(vaFeeRate("irrrl", true, 0, false))}</td>
            <td data-label="Used before">{pct(vaFeeRate("irrrl", false, 0, false))}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <p className="hub-note">
      The same rates apply to regular military, Reserves and National Guard. Source: VA's{" "}
      <a href="https://www.va.gov/housing-assistance/home-loans/funding-fee-and-closing-costs/" target="_blank" rel="noopener noreferrer">
        funding fee and closing costs
      </a>{" "}
      page.
    </p>

    <h2>Example: the funding fee on a {formatCurrency(PRICE)} home</h2>
    <ul>
      <li>
        <strong>No down payment, first use:</strong> {formatCurrency(PRICE)} × {pct(ex.rate)} ={" "}
        <strong>{formatCurrency(ex.fee)}</strong>. Financed at {RATE}%, it adds {formatCurrency(ex.financing.monthly)}{" "}
        a month, or {formatCurrency(ex.financing.total)} over 30 years.
      </li>
      <li>
        <strong>5% down:</strong> the loan is {formatCurrency(ex5.baseLoan)} and the rate drops to {pct(ex5.rate)}, so
        the fee is <strong>{formatCurrency(ex5.fee)}</strong>, {formatCurrency(ex.fee - ex5.fee)} less.
      </li>
    </ul>

    <h2>Ways to pay less</h2>
    <ul>
      <li>Put 5% or 10% down to reach a lower tier.</li>
      <li>Pay the fee at closing instead of adding it to the loan.</li>
      <li>Ask the seller to cover it; VA allows seller concessions of up to 4% of the price.</li>
      <li>
        If a disability claim is pending, ask about a refund: an award with an effective date before closing usually
        qualifies.
      </li>
    </ul>
    <p>
      For exemptions and refunds in more detail, read the <Link to="/guides/va-funding-fee/">VA funding fee guide</Link>.
      To see your whole monthly payment with taxes and insurance, use the{" "}
      <Link to="/va-loan-calculator/">VA loan calculator</Link>.
    </p>

    <h2>Sources</h2>
    <ul className="hub-note">
      <li>
        <a href="https://www.va.gov/housing-assistance/home-loans/funding-fee-and-closing-costs/" target="_blank" rel="noopener noreferrer">
          VA: Funding fee and closing costs
        </a>
      </li>
      <li>
        <a href="https://www.benefits.va.gov/WARMS/pam26_7.asp" target="_blank" rel="noopener noreferrer">
          VA Lenders Handbook (M26-7)
        </a>
      </li>
    </ul>
  </CalculatorPage>
);

export default VaFundingFee;
