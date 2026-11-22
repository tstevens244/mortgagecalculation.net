import { Link } from "react-router-dom";
import GuidePage from "@/components/GuidePage";
import { formatCurrency } from "@/lib/formatters";
import { monthsUntilBalance } from "@/lib/mortgageMath";
import { loanOverHorizon } from "@/lib/compareMath";
import { yearsMonths } from "@/lib/amortization";
import { CONFORMING_LIMIT } from "@/lib/loanLimits";

// Worked example: a $500,000 home with 10% down.
const PRICE = 500_000;
const DOWN = 50_000;
const RATE = 6.5; // first mortgage, both options
const SECOND_RATE = 8.5;
const SECOND_TERM = 20;
const YEARS = 10;

const singleLoan = PRICE - DOWN;
const firstLoan = PRICE * 0.8;
const secondLoan = PRICE - DOWN - firstLoan;
const pmiMonths = monthsUntilBalance(singleLoan, RATE, 360, PRICE * 0.78);

// PMI rates by credit tier (annual % of the loan, 90% loan-to-value). Typical ranges, not quotes.
const TIERS = [
  { label: "Excellent credit (760+)", rate: 0.3 },
  { label: "Good credit (~720)", rate: 0.55 },
  { label: "Fair credit (~660)", rate: 0.9 },
];

/** Cost of borrowing over `months`: payments made + balance still owed − cash borrowed (+ PMI). */
const compare = (pmiRate: number, months: number) => {
  const pmiMonthly = (singleLoan * pmiRate) / 100 / 12;
  const a = loanOverHorizon(singleLoan, RATE, 360, months);
  const single = a.paid + a.balance - singleLoan + pmiMonthly * Math.min(pmiMonths, months);
  const f = loanOverHorizon(firstLoan, RATE, 360, months);
  const s = loanOverHorizon(secondLoan, SECOND_RATE, SECOND_TERM * 12, months);
  const piggy = f.paid + f.balance - firstLoan + (s.paid + s.balance - secondLoan);
  return { pmiMonthly, single, piggy, singlePayment: a.payment + pmiMonthly, piggyPayment: f.payment + s.payment };
};
const rows = TIERS.map((t) => ({ ...t, ...compare(t.rate, YEARS * 12) }));
const best = rows[0];
const gapExcellent = best.single - best.piggy;

const calcLink = `/second-mortgage-calculator/?homeValue=${PRICE}&downPayment=${DOWN}&downPaymentPercent=10&annualPMI=0.55&pmiInterestRate=${RATE}&firstMortInterestRate=${RATE}&secondMortInterestRate=${SECOND_RATE}&secondMortLoanTerm=${SECOND_TERM}&pmiDiscountPoints=0&firstMortDiscountPoints=0&secondMortDiscountPoints=0`;

const winner = (single: number, piggy: number) => (single < piggy ? "One loan + PMI" : "Piggyback");

const faqs = [
  {
    q: "Is a piggyback loan better than paying PMI?",
    a: "Often, on interest alone, if the second loan's rate is within about 2 points of the first mortgage. The deciding factors are your PMI rate (set mostly by credit score), the second loan's rate, and its extra closing costs. With excellent credit and cheap PMI, the closing costs of a second loan can make one loan with PMI the better deal.",
  },
  {
    q: "What is an 80/10/10 loan?",
    a: "A first mortgage for 80% of the price, a second mortgage for 10%, and a 10% down payment. Because the first mortgage is 80% of the value, it has no PMI. An 80/15/5 works the same way with 5% down.",
  },
  {
    q: "How much does PMI cost?",
    a: "Usually about 0.3% to 1.5% of the loan a year, depending mainly on your credit score and down payment. With a 760 score and 10% down it's often near the low end; with a 660 score and 5% down it can be several times higher.",
  },
  {
    q: "Can I refinance away the second mortgage later?",
    a: "Yes. Many borrowers pay off the second loan early or roll both loans into one when they refinance. A HELOC used as the second loan can be paid down and closed whenever you like, but its rate is usually variable.",
  },
];

const PiggybackVsPmi = () => (
  <GuidePage
    slug="piggyback-loan-vs-pmi"
    metaTitle="Piggyback Loan vs. PMI: Is an 80/10/10 Mortgage Worth It?"
    description="Piggyback loan vs. PMI compared on a $500,000 home at three credit tiers: monthly payments, 10-year cost, and when an 80/10/10 or 80/15/5 beats paying mortgage insurance."
    faqs={faqs}
    lead={
      <>
        <p>
          With less than 20% down, you can take one loan and pay <strong>private mortgage insurance (PMI)</strong>, or
          split the loan into an 80% first mortgage plus a smaller second mortgage, a <strong>piggyback loan</strong>{" "}
          (80/10/10 or 80/15/5), which avoids PMI.
        </p>
        <p>
          Which is cheaper comes down to three numbers: <strong>your PMI rate</strong> (set mostly by your credit
          score), <strong>the second loan's rate</strong>, and <strong>the second loan's closing costs</strong>. Here's
          the math on a {formatCurrency(PRICE)} home.
        </p>
      </>
    }
  >
    <h2>How each option works</h2>
    <ul>
      <li>
        <strong>One loan with PMI:</strong> you borrow {formatCurrency(singleLoan)} at {RATE}% and pay PMI each month.
        PMI ends automatically when your balance reaches 78% of the original value, about {yearsMonths(pmiMonths)} in
        on this loan.
      </li>
      <li>
        <strong>80/10/10 piggyback:</strong> a {formatCurrency(firstLoan)} first mortgage at {RATE}% plus a{" "}
        {formatCurrency(secondLoan)} second loan, here at {SECOND_RATE}% over {SECOND_TERM} years. No PMI, but the
        second loan has a higher rate and its own closing costs.
      </li>
    </ul>

    <h2>The numbers on a {formatCurrency(PRICE)} home with 10% down</h2>
    <p>
      Monthly principal, interest and PMI, and total interest plus PMI over {YEARS} years, at three typical PMI rates:
    </p>
    <div className="hub-table-wrap">
      <table>
        <caption className="sr-only">One loan with PMI vs. a piggyback loan by credit tier</caption>
        <thead>
          <tr>
            <th scope="col">Credit (PMI rate)</th>
            <th scope="col">Monthly: loan + PMI</th>
            <th scope="col">Monthly: piggyback</th>
            <th scope="col">{YEARS}-year cost: loan + PMI</th>
            <th scope="col">{YEARS}-year cost: piggyback</th>
            <th scope="col">Cheaper</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.label}>
              <th scope="row">
                {r.label}, {r.rate.toFixed(2)}%
              </th>
              <td data-label="Monthly: loan + PMI">{formatCurrency(r.singlePayment)}</td>
              <td data-label="Monthly: piggyback">{formatCurrency(r.piggyPayment)}</td>
              <td data-label={`${YEARS}-yr: loan + PMI`}>{formatCurrency(r.single)}</td>
              <td data-label={`${YEARS}-yr: piggyback`}>{formatCurrency(r.piggy)}</td>
              <td data-label="Cheaper">
                {winner(r.single, r.piggy)} by {formatCurrency(Math.abs(r.single - r.piggy))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <p className="hub-note">
      Interest and PMI only. PMI rates are typical ranges for 10% down, not quotes. <Link to={calcLink}>Run this
      scenario with your own rates and closing costs</Link>.
    </p>
    <p>
      <strong>What this shows:</strong> with a second-loan rate {SECOND_RATE - RATE} points above the first mortgage,
      the piggyback costs less in interest at every credit tier, and the gap grows quickly as credit (and PMI) gets
      worse. But at excellent credit the {YEARS}-year advantage is only about {formatCurrency(gapExcellent)}, which the
      second loan's closing costs, typically $1,000 to $3,000, can largely erase. So:
    </p>
    <ul>
      <li>
        <strong>Fair or good credit:</strong> a piggyback usually saves real money.
      </li>
      <li>
        <strong>Excellent credit:</strong> it's close. Compare the full Loan Estimates, including closing costs.
      </li>
      <li>
        <strong>Excellent credit and a second-loan rate 2.5+ points above the first:</strong> one loan with PMI
        usually wins, even before closing costs.
      </li>
    </ul>

    <h2>When a piggyback loan makes sense</h2>
    <ul>
      <li>
        <strong>Your credit score is under about 740</strong>, where PMI pricing rises steeply.
      </li>
      <li>
        <strong>It keeps you under the conforming limit.</strong> In most counties a loan above{" "}
        {formatCurrency(CONFORMING_LIMIT)} is a jumbo loan with stricter rules. An 80/10/10 can keep the first mortgage
        conforming. See <Link to="/guides/jumbo-loan-requirements/">jumbo loan requirements</Link>.
      </li>
      <li>
        <strong>You'll pay the second loan off early</strong>, for example with a bonus or the sale of another home.
      </li>
    </ul>

    <h2>When one loan with PMI is the better deal</h2>
    <ul>
      <li>Your credit is excellent, so PMI is priced near the bottom of the range.</li>
      <li>The second loan has high closing costs, a variable rate you don't want, or a rate well above the first.</li>
      <li>
        You expect your home's value to rise, which can let you{" "}
        <Link to="/guides/how-to-get-rid-of-pmi/">cancel PMI early</Link>.
      </li>
      <li>You want one simple loan and one payment.</li>
    </ul>

    <h2>What to ask lenders</h2>
    <ol>
      <li>Your exact PMI quote at your credit score (monthly and single-premium options).</li>
      <li>Whether the second loan is a fixed-rate loan or a variable-rate HELOC, and its term.</li>
      <li>Closing costs for each loan, side by side on Loan Estimates.</li>
      <li>Whether the second loan has a prepayment penalty.</li>
    </ol>

    <h2>Sources</h2>
    <ul className="hub-note">
      <li>
        <a href="https://www.consumerfinance.gov/ask-cfpb/what-is-private-mortgage-insurance-en-122/" target="_blank" rel="noopener noreferrer">
          CFPB: What is private mortgage insurance?
        </a>
      </li>
      <li>
        <a href="https://www.consumerfinance.gov/ask-cfpb/when-can-i-remove-private-mortgage-insurance-pmi-from-my-loan-en-202/" target="_blank" rel="noopener noreferrer">
          CFPB: When can I remove PMI from my loan?
        </a>
      </li>
      <li>
        <a href="https://www.fhfa.gov/data/conforming-loan-limit" target="_blank" rel="noopener noreferrer">
          FHFA: Conforming loan limits
        </a>
      </li>
    </ul>
  </GuidePage>
);

export default PiggybackVsPmi;
