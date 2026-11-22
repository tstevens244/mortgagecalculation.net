import { Link } from "react-router-dom";
import GuidePage from "@/components/GuidePage";
import { formatCurrency } from "@/lib/formatters";
import { balanceAfter, monthlyPayment } from "@/lib/mortgageMath";
import { yearsMonths } from "@/lib/amortization";

// Worked example, matching the refinance calculator link below: a $320,000
// loan taken 3 years ago at 7.25%, refinanced into a new 30-year loan at 6.25%.
const ORIGINAL = 320_000;
const OLD_RATE = 7.25;
const PAID = 36;
const NEW_RATE = 6.25;
const ORIGINATION_PCT = 1;
const OTHER_COSTS = 3_000;

const oldPayment = monthlyPayment(ORIGINAL, OLD_RATE, 360);
const balance = balanceAfter(ORIGINAL, OLD_RATE, oldPayment, PAID);
const newPayment = monthlyPayment(balance, NEW_RATE, 360);
const closing = (balance * ORIGINATION_PCT) / 100 + OTHER_COSTS;
const monthlySavings = oldPayment - newPayment;
const simpleBreakEven = Math.ceil(closing / monthlySavings);

/** Month-by-month: interest saved minus closing costs. */
const netAfter = (() => {
  const out: number[] = [];
  let ob = balance;
  let nb = balance;
  let saved = 0;
  for (let m = 1; m <= 360; m++) {
    if (m <= 360 - PAID && ob > 0) {
      const i = (ob * OLD_RATE) / 1200;
      ob = Math.max(0, ob - (oldPayment - i));
      saved += i;
    }
    const j = (nb * NEW_RATE) / 1200;
    nb = Math.max(0, nb - (newPayment - j));
    saved -= j;
    out.push(saved - closing);
  }
  return out;
})();
const trueBreakEven = netAfter.findIndex((v) => v > 0) + 1;
const HORIZONS = [3, 5, 7, 10];

// What restarting the clock costs: total interest from here to payoff.
const interestOld = (() => {
  let b = balance;
  let t = 0;
  for (let m = 0; m < 360 - PAID && b > 0; m++) {
    const i = (b * OLD_RATE) / 1200;
    t += i;
    b -= oldPayment - i;
  }
  return t;
})();
const interestNew = newPayment * 360 - balance;
// The same new rate, but paid off on the original schedule (27 years left).
const sameEndPayment = monthlyPayment(balance, NEW_RATE, 360 - PAID);
const interestSameEnd = sameEndPayment * (360 - PAID) - balance;

const calcLink = `/refinance-calculator/?originalHomePrice=400000&originalDownPayment=80000&originalLoanTerm=30&originalInterestRate=${OLD_RATE}&monthsAlreadyPaid=${PAID}&newLoanTerm=30&newInterestRate=${NEW_RATE}&yearsBeforeSell=7&discountPoints=0&originationFees=${ORIGINATION_PCT}&otherClosingCosts=${OTHER_COSTS}`;

const faqs = [
  {
    q: "How do you calculate the break-even point on a refinance?",
    a: "The quick version: divide your closing costs by your monthly payment savings. A more accurate version counts how much interest you actually save each month, because restarting a 30-year term lowers the payment partly by stretching it out. The refinance calculator shows both the payment change and the interest-based break-even.",
  },
  {
    q: "Is it worth refinancing for 1% lower?",
    a: "Often, but not always. The old rule of thumb was to wait for a 1 to 2 point drop. What matters is whether you'll keep the loan past the break-even point. A 0.75-point drop can pay off on a large loan you'll keep for years, while a 1-point drop may not on a small loan you'll sell soon.",
  },
  {
    q: "Does refinancing restart my loan?",
    a: "If you take a new 30-year loan, yes: your payoff date moves out by however many years you've already paid. You can avoid that by choosing a shorter term or by continuing to pay the old payment amount on the new loan.",
  },
  {
    q: "What does it cost to refinance?",
    a: "Usually 2% to 5% of the loan: lender fees, appraisal, title insurance and recording, plus any discount points. A no-closing-cost refinance rolls these into a higher rate or the loan balance instead of eliminating them.",
  },
];

const RefinanceWorthIt = () => (
  <GuidePage
    slug="is-refinancing-worth-it"
    metaTitle="Is Refinancing Worth It? How to Find Your Break-Even Point"
    description="When refinancing your mortgage is worth it: closing costs, the break-even point (simple and interest-based), the cost of restarting your term, and a worked example."
    faqs={faqs}
    lead={
      <>
        <p>
          Refinancing is worth it when you'll <strong>keep the new loan past the break-even point</strong>: the month
          when what you've saved finally covers the closing costs, which usually run <strong>2% to 5%</strong> of the
          loan. Before that, you're behind; after it, you're ahead.
        </p>
        <p>
          Here's how to find that point, and the one thing that often makes refinancing look better than it is.
        </p>
      </>
    }
  >
    <h2>A worked example</h2>
    <p>
      Three years ago you took a {formatCurrency(ORIGINAL)} 30-year loan at {OLD_RATE}%. You now owe{" "}
      {formatCurrency(balance)}. A lender offers a new 30-year loan at {NEW_RATE}%, with closing costs of{" "}
      {formatCurrency(closing)} ({ORIGINATION_PCT}% origination plus {formatCurrency(OTHER_COSTS)} of other fees).
    </p>
    <div className="hub-table-wrap">
      <table>
        <caption className="sr-only">Current loan vs. refinance</caption>
        <thead>
          <tr>
            <th scope="col"></th>
            <th scope="col">Keep current loan</th>
            <th scope="col">Refinance</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">Rate</th>
            <td data-label="Current">{OLD_RATE}%</td>
            <td data-label="Refinance">{NEW_RATE}%</td>
          </tr>
          <tr>
            <th scope="row">Principal & interest</th>
            <td data-label="Current">{formatCurrency(oldPayment)}</td>
            <td data-label="Refinance">{formatCurrency(newPayment)}</td>
          </tr>
          <tr>
            <th scope="row">Years left</th>
            <td data-label="Current">{30 - PAID / 12}</td>
            <td data-label="Refinance">30</td>
          </tr>
          <tr>
            <th scope="row">Closing costs</th>
            <td data-label="Current">—</td>
            <td data-label="Refinance">{formatCurrency(closing)}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <h2>Two ways to find the break-even point</h2>
    <p>
      <strong>The quick way:</strong> closing costs ÷ monthly savings. {formatCurrency(closing)} ÷{" "}
      {formatCurrency(monthlySavings)} = <strong>{simpleBreakEven} months</strong> ({yearsMonths(simpleBreakEven)}).
    </p>
    <p>
      <strong>The more accurate way:</strong> count the <em>interest</em> you save. Part of the lower payment comes
      from stretching what you owe over 30 years again, not from the lower rate, so it isn't really savings. Counting
      interest saved instead, this refinance breaks even after <strong>{yearsMonths(trueBreakEven)}</strong>.
    </p>
    <p>Here's where you stand, interest saved minus closing costs, depending on how long you keep the new loan:</p>
    <div className="hub-table-wrap">
      <table>
        <caption className="sr-only">Net result of refinancing by years kept</caption>
        <thead>
          <tr>
            <th scope="col">Keep the new loan</th>
            <th scope="col">Net result</th>
          </tr>
        </thead>
        <tbody>
          {HORIZONS.map((y) => {
            const v = netAfter[y * 12 - 1];
            return (
              <tr key={y}>
                <th scope="row">{y} years</th>
                <td data-label="Net result">{v >= 0 ? `Ahead ${formatCurrency(v)}` : `Behind ${formatCurrency(-v)}`}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
    <p>
      <Link to={calcLink}>Open this example in the refinance calculator</Link> to change the rate, costs or how long you
      expect to stay.
    </p>

    <h2>The catch: restarting the clock</h2>
    <p>
      The new loan runs 30 years from today, three years longer than the {30 - PAID / 12} left on the old one. Total
      interest from here to payoff:
    </p>
    <ul>
      <li>
        Keep the old loan: <strong>{formatCurrency(interestOld)}</strong>
      </li>
      <li>
        New 30-year loan: <strong>{formatCurrency(interestNew)}</strong>
      </li>
      <li>
        New loan paid off on the original date ({formatCurrency(sameEndPayment)} a month):{" "}
        <strong>{formatCurrency(interestSameEnd)}</strong>
      </li>
    </ul>
    <p>
      The lower rate saves money either way, but those three extra years cost{" "}
      {formatCurrency(interestNew - interestSameEnd)} in interest. With a smaller rate drop, the extra years can wipe
      out the savings entirely. To keep the savings without stretching the loan:
    </p>
    <ul>
      <li>Choose a shorter term (20 or 15 years) if the payment fits.</li>
      <li>
        Keep paying your old payment amount on the new loan. The extra goes to principal; see the{" "}
        <Link to="/extra-mortgage-payments-calculator/">extra payments calculator</Link>.
      </li>
    </ul>

    <h2>When refinancing is usually worth it</h2>
    <ul>
      <li>You'll stay in the home well past the break-even point.</li>
      <li>The rate drop is meaningful for your loan size (larger loans need smaller drops).</li>
      <li>
        You can drop mortgage insurance: FHA MIP or PMI ends if the new loan is 80% or less of the home's value. See{" "}
        <Link to="/guides/fha-mortgage-insurance-mip/">FHA MIP</Link>.
      </li>
      <li>You want to move from an adjustable rate to a fixed one before it resets.</li>
    </ul>

    <h2>When it usually isn't</h2>
    <ul>
      <li>You expect to move or sell before breaking even.</li>
      <li>Closing costs are high relative to the savings, or you'd pay points you won't recoup.</li>
      <li>You'd add years to the loan and not pay extra to make up for it.</li>
    </ul>
    <p>
      Need cash, not a lower rate? Compare a{" "}
      <Link to="/cash-out-refinance-calculator/">cash-out refinance</Link> with a{" "}
      <Link to="/heloc-calculator/">HELOC</Link>, and see{" "}
      <Link to="/guides/how-much-equity-to-refinance/">how much equity you need</Link>.
    </p>

    <h2>Sources</h2>
    <ul className="hub-note">
      <li>
        <a href="https://www.consumerfinance.gov/ask-cfpb/what-is-a-refinance-en-1795/" target="_blank" rel="noopener noreferrer">
          CFPB: Refinancing your mortgage
        </a>
      </li>
      <li>
        <a href="https://www.consumerfinance.gov/owning-a-home/loan-estimate/" target="_blank" rel="noopener noreferrer">
          CFPB: How to read your Loan Estimate
        </a>
      </li>
    </ul>
  </GuidePage>
);

export default RefinanceWorthIt;
