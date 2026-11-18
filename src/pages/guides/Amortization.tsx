import { Link } from "react-router-dom";
import GuidePage from "@/components/GuidePage";
import { formatCurrency } from "@/lib/formatters";
import { monthlyPayment } from "@/lib/mortgageMath";

const LOAN = 320_000;
const RATE = 6.5;
const payment = monthlyPayment(LOAN, RATE, 360);

// Walk the schedule once and record what the article needs.
const schedule = (() => {
  const r = RATE / 100 / 12;
  let balance = LOAN;
  let crossover = 0;
  let halfway = 0;
  const years: { year: number; interest: number; principal: number; balance: number }[] = [];
  let yi = 0;
  let yp = 0;
  for (let m = 1; m <= 360; m++) {
    const interest = balance * r;
    const principal = Math.min(payment - interest, balance);
    balance -= principal;
    yi += interest;
    yp += principal;
    if (!crossover && principal > interest) crossover = m;
    if (!halfway && balance <= LOAN / 2) halfway = m;
    if (m % 12 === 0) {
      years.push({ year: m / 12, interest: yi, principal: yp, balance: Math.max(0, balance) });
      yi = 0;
      yp = 0;
    }
  }
  return { crossover, halfway, years };
})();

const firstInterest = (LOAN * RATE) / 100 / 12;
const firstPrincipal = payment - firstInterest;
const totalInterest = payment * 360 - LOAN;
const shown = [1, 5, 10, 15, 20, 25, 30].map((y) => schedule.years[y - 1]);
const ym = (months: number) => `${Math.floor(months / 12)} years ${months % 12} months`;

const faqs = [
  {
    q: "Why is so much of my mortgage payment interest?",
    a: "Interest is charged on the balance you still owe, and the balance is largest at the start. As you pay it down, the interest part shrinks and more of the same payment goes to principal.",
  },
  {
    q: "When do I start paying more principal than interest?",
    a: `On a 30-year loan at ${RATE}%, after about ${Math.round(schedule.crossover / 12)} years. The higher the rate, the later it happens; on a 15-year loan it's much sooner.`,
  },
  {
    q: "Does paying extra shorten my amortization?",
    a: "Yes. Extra principal lowers the balance immediately, so every later payment carries less interest and the loan ends early. Your required payment stays the same unless you ask the servicer to recast the loan.",
  },
];

const Amortization = () => (
  <GuidePage
    slug="how-mortgage-amortization-works"
    metaTitle="How Mortgage Amortization Works (With an Example Schedule)"
    description="Why early mortgage payments are mostly interest, when principal overtakes interest, and how fast a 30-year loan builds equity, with a year-by-year example."
    faqs={faqs}
    lead={
      <p>
        Amortization is how a fixed payment pays off a loan over time. The payment stays the same, but the split
        changes: at first it's mostly interest, and by the end it's almost all principal. On a{" "}
        {formatCurrency(LOAN)} loan at {RATE}%, the first payment of {formatCurrency(payment)} includes just{" "}
        <strong>{formatCurrency(firstPrincipal)}</strong> of principal.
      </p>
    }
  >
    <h2>How each payment is split</h2>
    <p>Each month, the lender:</p>
    <ol>
      <li>
        charges interest on the balance: {formatCurrency(LOAN)} × {RATE}% ÷ 12 ={" "}
        <strong>{formatCurrency(firstInterest)}</strong> in the first month;
      </li>
      <li>
        applies the rest of the payment to principal: {formatCurrency(payment)} − {formatCurrency(firstInterest)} ={" "}
        <strong>{formatCurrency(firstPrincipal)}</strong>;
      </li>
      <li>lowers the balance by that amount, so next month's interest is a little smaller.</li>
    </ol>
    <p>
      The payment itself comes from the standard formula: loan × r × (1 + r)<sup>n</sup> ÷ ((1 + r)<sup>n</sup> − 1),
      where r is the monthly rate and n the number of payments. See{" "}
      <Link to="/methodology/">how we calculate</Link> for every formula the site uses.
    </p>

    <h2>A 30-year loan, year by year</h2>
    <div className="hub-table-wrap">
      <table>
        <caption className="sr-only">Amortization of a $320,000 loan at 6.5%</caption>
        <thead>
          <tr>
            <th scope="col">Year</th>
            <th scope="col">Interest paid</th>
            <th scope="col">Principal paid</th>
            <th scope="col">Balance at year end</th>
          </tr>
        </thead>
        <tbody>
          {shown.map((y) => (
            <tr key={y.year}>
              <th scope="row">{y.year}</th>
              <td data-label="Interest paid">{formatCurrency(y.interest)}</td>
              <td data-label="Principal paid">{formatCurrency(y.principal)}</td>
              <td data-label="Balance">{formatCurrency(y.balance)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <ul>
      <li>
        Principal overtakes interest after <strong>{ym(schedule.crossover)}</strong>.
      </li>
      <li>
        You've paid off half the loan after <strong>{ym(schedule.halfway)}</strong>.
      </li>
      <li>
        Total interest over 30 years: <strong>{formatCurrency(totalInterest)}</strong>, more than the amount borrowed.
      </li>
    </ul>

    <h2>What this means for you</h2>
    <ul>
      <li>
        <strong>Equity builds slowly at first.</strong> If you sell in the first few years, most of what you paid went
        to interest. Price appreciation and your down payment are most of your early equity.
      </li>
      <li>
        <strong>Extra payments early do the most good.</strong> Each extra dollar of principal saves interest for the
        rest of the loan. Try it in the <Link to="/extra-mortgage-payments-calculator/">extra payments calculator</Link>.
      </li>
      <li>
        <strong>A shorter term flips the split.</strong> A 15-year loan puts more toward principal from the first
        payment. Compare them with the <Link to="/15-vs-30-year-mortgage-calculator/">15 vs. 30-year calculator</Link>.
      </li>
      <li>
        <strong>Refinancing restarts the schedule.</strong> A new 30-year loan begins again with mostly-interest
        payments, even if the rate is lower.
      </li>
    </ul>
    <p>
      For a month-by-month schedule of your own loan, with a CSV download, use the{" "}
      <Link to="/">mortgage calculator</Link>.
    </p>
  </GuidePage>
);

export default Amortization;
