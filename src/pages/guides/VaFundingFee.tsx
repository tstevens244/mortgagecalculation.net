import { Link } from "react-router-dom";
import GuidePage from "@/components/GuidePage";
import { formatCurrency } from "@/lib/formatters";
import { monthlyPayment } from "@/lib/mortgageMath";
import { LIMITS_YEAR, vaFundingFeeRate } from "@/lib/loanLimits";

// Worked example: a $350,000 home.
const PRICE = 350_000;
const RATE = 6.25;
const firstUse = vaFundingFeeRate(true, 0, false);
const fee0 = (PRICE * firstUse) / 100;
const loan0 = PRICE + fee0;
const feeCostMonthly = monthlyPayment(loan0, RATE, 360) - monthlyPayment(PRICE, RATE, 360);
const totalFeeCost = feeCostMonthly * 360;
const down5Loan = PRICE * 0.95;
const fee5 = (down5Loan * vaFundingFeeRate(true, 5, false)) / 100;

const pct = (r: number) => `${r.toFixed(2)}%`;

const calcLink = `/va-loan-calculator/?homePrice=${PRICE}&downPayment=0&downPaymentPercent=0&interestRate=${RATE}&loanTerm=30&firstTimeUse=1&hasDisability=0&financeFundingFee=1`;

const faqs = [
  {
    q: `How much is the VA funding fee in ${LIMITS_YEAR}?`,
    a: `For a purchase with less than 5% down, ${pct(firstUse)} of the loan the first time you use the benefit and ${pct(vaFundingFeeRate(false, 0, false))} after that. It drops to 1.50% with 5% down and 1.25% with 10% down. Streamline refinances (IRRRLs) are 0.50%.`,
  },
  {
    q: "Who is exempt from the VA funding fee?",
    a: "Veterans who receive VA compensation for a service-connected disability (or would, if they weren't receiving retirement or active-duty pay), those rated eligible for compensation in a pre-discharge exam, active-duty service members who have received the Purple Heart, and surviving spouses who receive Dependency and Indemnity Compensation.",
  },
  {
    q: "Can I roll the VA funding fee into my loan?",
    a: "Yes. Most borrowers add it to the loan instead of paying it at closing. You then pay interest on it over the life of the loan, so paying it in cash is cheaper if you can.",
  },
  {
    q: "Can I get the VA funding fee refunded?",
    a: "If you're later awarded disability compensation with an effective date before your loan closed, you can usually get a refund. Contact your VA regional loan center with your award letter.",
  },
  {
    q: "Does a VA loan have mortgage insurance?",
    a: "No. The funding fee replaces mortgage insurance. There's no monthly PMI or MIP on a VA loan, no matter how little you put down.",
  },
];

const VaFundingFee = () => (
  <GuidePage
    slug="va-funding-fee"
    metaTitle={`VA Funding Fee ${LIMITS_YEAR}: Rates, Exemptions and How to Calculate It`}
    description={`The VA funding fee in ${LIMITS_YEAR}: ${pct(firstUse)} for first-time use with less than 5% down, lower with a down payment, who's exempt, and what it costs when you finance it.`}
    faqs={faqs}
    lead={
      <>
        <p>
          The VA funding fee is a one-time charge on most VA loans, paid instead of monthly mortgage insurance. For a
          home purchase it's <strong>{pct(firstUse)} of the loan</strong> the first time you use your benefit with less
          than 5% down, and less with a down payment. Veterans receiving disability compensation and some others{" "}
          <strong>don't pay it at all</strong>.
        </p>
      </>
    }
  >
    <h2>VA funding fee rates</h2>
    <div className="hub-table-wrap">
      <table>
        <caption className="sr-only">VA funding fee for purchase loans</caption>
        <thead>
          <tr>
            <th scope="col">Down payment</th>
            <th scope="col">First use</th>
            <th scope="col">Used before</th>
          </tr>
        </thead>
        <tbody>
          {[
            { label: "Less than 5%", down: 0 },
            { label: "5% to 9.99%", down: 5 },
            { label: "10% or more", down: 10 },
          ].map((r) => (
            <tr key={r.label}>
              <th scope="row">{r.label}</th>
              <td data-label="First use">{pct(vaFundingFeeRate(true, r.down, false))}</td>
              <td data-label="Used before">{pct(vaFundingFeeRate(false, r.down, false))}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <p>Other VA loans:</p>
    <div className="hub-table-wrap">
      <table>
        <caption className="sr-only">VA funding fee for other loan types</caption>
        <thead>
          <tr>
            <th scope="col">Loan type</th>
            <th scope="col">Funding fee</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">Cash-out refinance</th>
            <td data-label="Fee">2.15% first use, 3.30% after</td>
          </tr>
          <tr>
            <th scope="row">Interest Rate Reduction Refinance (IRRRL)</th>
            <td data-label="Fee">0.50%</td>
          </tr>
          <tr>
            <th scope="row">Loan assumption</th>
            <td data-label="Fee">0.50%</td>
          </tr>
          <tr>
            <th scope="row">Manufactured home (not on a permanent foundation)</th>
            <td data-label="Fee">1.00%</td>
          </tr>
        </tbody>
      </table>
    </div>
    <p className="hub-note">
      Rates for loans closed on or after April 7, 2023, the same for regular military, Reserves and National Guard.
      Source: VA's{" "}
      <a href="https://www.va.gov/housing-assistance/home-loans/funding-fee-and-closing-costs/" target="_blank" rel="noopener noreferrer">
        funding fee and closing costs
      </a>{" "}
      page.
    </p>

    <h2>How to calculate the VA funding fee</h2>
    <p>
      Multiply the loan amount by the rate for your situation, or let the{" "}
      <Link to="/va-funding-fee-calculator/">VA funding fee calculator</Link> do it, including cash-out and IRRRL loans.
    </p>
    <ul>
      <li>
        <strong>{formatCurrency(PRICE)} home, no down payment, first use:</strong> {formatCurrency(PRICE)} ×{" "}
        {pct(firstUse)} = <strong>{formatCurrency(fee0)}</strong>. Financed, the loan becomes {formatCurrency(loan0)}.
      </li>
      <li>
        <strong>Same home, 5% down:</strong> the loan is {formatCurrency(down5Loan)}, and the fee drops to 1.50%:{" "}
        <strong>{formatCurrency(fee5)}</strong>, {formatCurrency(fee0 - fee5)} less.
      </li>
    </ul>
    <p>
      Financing the {formatCurrency(fee0)} fee at {RATE}% adds about {formatCurrency(feeCostMonthly)} to the monthly
      payment, or {formatCurrency(totalFeeCost)} over 30 years with interest.{" "}
      <Link to={calcLink}>See this example in the VA loan calculator</Link>.
    </p>

    <h2>Who doesn't pay the funding fee</h2>
    <p>You're exempt if any of these apply:</p>
    <ul>
      <li>You receive VA compensation for a service-connected disability.</li>
      <li>
        You're eligible for that compensation but receive retirement or active-duty pay instead, or you were rated
        eligible in a pre-discharge exam or review.
      </li>
      <li>You're an active-duty service member who has received the Purple Heart (show proof before closing).</li>
      <li>You're a surviving spouse receiving Dependency and Indemnity Compensation (DIC).</li>
    </ul>
    <p>
      Your Certificate of Eligibility shows whether you're exempt. If you're awarded disability compensation after
      closing with an effective date before it, you can usually get the fee refunded.
    </p>

    <h2>Is the funding fee worth it?</h2>
    <p>
      For most borrowers, yes. Even with the fee, a VA loan usually costs less than the alternatives: no down payment,
      no monthly mortgage insurance, and rates that are often lower than FHA or conventional. An FHA loan, by
      comparison, charges a 1.75% upfront premium <em>and</em> annual mortgage insurance, usually for the life of the
      loan; see <Link to="/guides/fha-mortgage-insurance-mip/">FHA MIP explained</Link>.
    </p>
    <p>Ways to pay less:</p>
    <ul>
      <li>Put 5% or 10% down to drop to the lower tiers.</li>
      <li>Pay the fee at closing instead of financing it, to avoid interest on it.</li>
      <li>Ask the seller to pay it as part of seller concessions (VA allows up to 4% of the price).</li>
    </ul>

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
  </GuidePage>
);

export default VaFundingFee;
