import { Link } from "react-router-dom";
import GuidePage from "@/components/GuidePage";
import { formatCurrency } from "@/lib/formatters";
import { monthlyPayment, monthsUntilBalance } from "@/lib/mortgageMath";

const PRICE = 400_000;
const LOAN = 380_000;
const RATE = 6.5;
const PMI_RATE = 0.5;
const payment = monthlyPayment(LOAN, RATE, 360);
const to80 = monthsUntilBalance(LOAN, RATE, 360, PRICE * 0.8);
const to78 = monthsUntilBalance(LOAN, RATE, 360, PRICE * 0.78);
const monthlyPmi = (LOAN * PMI_RATE) / 100 / 12;

/** Months to reach `target` paying `extra` more each month. */
const monthsWithExtra = (extra: number, target: number) => {
  const r = RATE / 100 / 12;
  let balance = LOAN;
  let m = 0;
  while (balance > target && m < 360) {
    balance -= payment + extra - balance * r;
    m++;
  }
  return m;
};
const extra200 = monthsWithExtra(200, PRICE * 0.8);

const ym = (months: number) => {
  const y = Math.floor(months / 12);
  const mo = months % 12;
  return `${y} year${y === 1 ? "" : "s"}${mo ? ` ${mo} month${mo === 1 ? "" : "s"}` : ""}`;
};

const faqs = [
  {
    q: "When does PMI go away automatically?",
    a: "On a conventional loan, the servicer must end PMI when your balance is scheduled to reach 78% of the home's original value, as long as you're current on payments. If that hasn't happened by the midpoint of the loan term, it must end then.",
  },
  {
    q: "Can I remove PMI if my home value has gone up?",
    a: "Often, yes, but it's up to your loan's investor. Fannie Mae and Freddie Mac loans generally allow it with a new appraisal once your loan-to-value is 75% or less after 2 years, or 80% or less after 5 years. Ask your servicer for their requirements.",
  },
  {
    q: "How do I remove FHA mortgage insurance?",
    a: "If you put at least 10% down, FHA annual MIP ends after 11 years. Otherwise it lasts the life of the loan, and the usual way out is refinancing into a conventional loan once you have about 20% equity.",
  },
  {
    q: "Is PMI tax deductible?",
    a: "Starting with tax year 2026, yes, if you itemize. The deduction expired after 2021 and was restored by the One Big Beautiful Bill Act in 2025. It phases out as adjusted gross income rises above about $100,000. Check current IRS instructions or a tax professional for your situation.",
  },
];

const RemovePmi = () => (
  <GuidePage
    slug="how-to-get-rid-of-pmi"
    metaTitle="How to Get Rid of PMI: When It Ends and How to Cancel It Sooner"
    description="PMI ends automatically at 78% loan-to-value. Learn how to request cancellation at 80%, use your home's appreciation, and what's different for FHA loans."
    faqs={faqs}
    lead={
      <p>
        Private mortgage insurance (PMI) on a conventional loan doesn't last forever. Federal law requires it to end
        automatically at <strong>78% loan-to-value</strong>, and you can ask to cancel it at <strong>80%</strong>.
        With extra payments or a rise in your home's value, you can get there years sooner.
      </p>
    }
  >
    <h2>When PMI ends under the Homeowners Protection Act</h2>
    <ul>
      <li>
        <strong>You can request cancellation</strong> once your balance reaches 80% of the home's original value
        (the lower of the purchase price or appraisal). Ask in writing. You need a good payment history, and the
        servicer may require an appraisal and confirmation that you have no second mortgage.
      </li>
      <li>
        <strong>It ends automatically</strong> when your balance is scheduled to reach 78% of the original value, if
        you're current on payments.
      </li>
      <li>
        <strong>It ends at the loan's midpoint</strong>, 15 years into a 30-year loan, no matter the balance, if
        you're current.
      </li>
    </ul>
    <p>
      The{" "}
      <a href="https://www.consumerfinance.gov/ask-cfpb/when-can-i-remove-private-mortgage-insurance-pmi-from-my-loan-en-202/" target="_blank" rel="noopener noreferrer">
        Consumer Financial Protection Bureau
      </a>{" "}
      explains these rights in more detail.
    </p>

    <h2>How long it takes</h2>
    <p>
      Take a {formatCurrency(PRICE)} home bought with 5% down: a {formatCurrency(LOAN)} loan at {RATE}%, with PMI of
      about {formatCurrency(monthlyPmi)} a month.
    </p>
    <div className="hub-table-wrap">
      <table>
        <caption className="sr-only">Time until PMI can end</caption>
        <thead>
          <tr>
            <th scope="col">Milestone</th>
            <th scope="col">Balance</th>
            <th scope="col">Reached after</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">You can request cancellation (80%)</th>
            <td data-label="Balance">{formatCurrency(PRICE * 0.8)}</td>
            <td data-label="Reached after">{ym(to80)}</td>
          </tr>
          <tr>
            <th scope="row">Ends automatically (78%)</th>
            <td data-label="Balance">{formatCurrency(PRICE * 0.78)}</td>
            <td data-label="Reached after">{ym(to78)}</td>
          </tr>
          <tr>
            <th scope="row">80%, paying $200 extra a month</th>
            <td data-label="Balance">{formatCurrency(PRICE * 0.8)}</td>
            <td data-label="Reached after">{ym(extra200)}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <p>
      Paying $200 extra a month lets you request cancellation {ym(to80 - extra200)} sooner, saving about{" "}
      {formatCurrency(monthlyPmi * (to78 - extra200))} in PMI compared with waiting for it to end on its own.
    </p>

    <h2>Four ways to get rid of PMI sooner</h2>
    <ol>
      <li>
        <strong>Pay extra principal.</strong> Every extra dollar moves you toward 80%. Try amounts in the{" "}
        <Link to="/extra-mortgage-payments-calculator/">extra payments calculator</Link>.
      </li>
      <li>
        <strong>Use your home's appreciation.</strong> If values have risen, a new appraisal may show you're at 75% to
        80% of the current value. Investor rules apply; see the FAQ below.
      </li>
      <li>
        <strong>Refinance.</strong> If your home is worth enough that the new loan is 80% or less of its value, the new
        loan has no PMI. Weigh closing costs against what you'd save.
      </li>
      <li>
        <strong>Avoid it at purchase.</strong> Put 20% down, or use a{" "}
        <Link to="/second-mortgage-calculator/">piggyback second mortgage</Link> to cover part of the down payment.
      </li>
    </ol>

    <h2>FHA, VA and USDA loans are different</h2>
    <p>
      The Homeowners Protection Act covers conventional PMI only. FHA loans have their own mortgage insurance (MIP),
      which lasts 11 years with at least 10% down and otherwise for the life of the loan. VA loans have no monthly
      mortgage insurance. USDA loans charge an annual fee for the life of the loan.
    </p>
  </GuidePage>
);

export default RemovePmi;
