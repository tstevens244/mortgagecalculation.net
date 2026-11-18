import { Link } from "react-router-dom";
import CalculatorPage from "@/components/CalculatorPage";
import TermComparisonCalculator from "@/components/compare/TermComparisonCalculator";
import { formatCurrency } from "@/lib/formatters";
import { termComparison } from "@/lib/compareMath";

const ex = termComparison(320_000, 6.5, 5.75);

const faqs = [
  {
    q: "Is a 15-year mortgage worth it?",
    a: `If you can comfortably afford the higher payment, it saves a lot: on a $320,000 loan at 6.5% for 30 years vs. 5.75% for 15, the 15-year saves ${formatCurrency(ex.interestSaved)} in interest. It's not worth it if the higher payment would leave you without an emergency fund or keep you from retirement savings.`,
  },
  {
    q: "How much more is a 15-year mortgage payment?",
    a: `Usually 30% to 40% more. On a $320,000 loan it's ${formatCurrency(ex.fifteen.payment)} a month at 5.75% vs. ${formatCurrency(ex.thirty.payment)} for a 30-year at 6.5%, a difference of ${formatCurrency(ex.paymentDifference)}.`,
  },
  {
    q: "Why are 15-year mortgage rates lower?",
    a: "Lenders get their money back sooner, so there's less risk from rate changes and defaults over time. 15-year fixed rates typically run about 0.5 to 0.75 percentage points below 30-year rates.",
  },
  {
    q: "Can I pay off a 30-year mortgage in 15 years?",
    a: "Yes. Pay the 15-year payment amount on a 30-year loan and you'll finish in about 16 years, a bit longer than a true 15-year because the rate is higher. The upside is flexibility: you can drop back to the lower required payment if money gets tight.",
  },
];

const TermComparison = () => (
  <CalculatorPage
    path="/15-vs-30-year-mortgage-calculator/"
    title="15 vs. 30-Year Mortgage Calculator: Payment & Interest Compared"
    description="Compare a 15-year and 30-year mortgage side by side: monthly payment, total interest, equity over time, and paying a 30-year loan off in 15."
    heading="15-Year vs. 30-Year Mortgage Calculator"
    intro={
      <p>
        See what a 15-year loan costs each month, what it saves in interest, and how fast you build equity compared
        with a 30-year loan.
      </p>
    }
    calculator={<TermComparisonCalculator />}
    faqs={faqs}
    featureList={["Side-by-side monthly payment", "Total interest for each term", "Balance after 5 to 25 years", "Paying a 30-year loan like a 15-year"]}
  >
    <h2>15-year vs. 30-year at a glance</h2>
    <p>For a $320,000 loan at 6.5% for 30 years and 5.75% for 15 years:</p>
    <div className="hub-table-wrap">
      <table>
        <caption className="sr-only">15-year and 30-year mortgage compared</caption>
        <thead>
          <tr>
            <th scope="col"></th>
            <th scope="col">30-year</th>
            <th scope="col">15-year</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">Monthly payment</th>
            <td data-label="30-year">{formatCurrency(ex.thirty.payment)}</td>
            <td data-label="15-year">{formatCurrency(ex.fifteen.payment)}</td>
          </tr>
          <tr>
            <th scope="row">Total interest</th>
            <td data-label="30-year">{formatCurrency(ex.thirty.interest)}</td>
            <td data-label="15-year">{formatCurrency(ex.fifteen.interest)}</td>
          </tr>
          <tr>
            <th scope="row">Balance after 10 years</th>
            <td data-label="30-year">{formatCurrency(ex.balances[1].thirty)}</td>
            <td data-label="15-year">{formatCurrency(ex.balances[1].fifteen)}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <p>
      The 15-year loan costs {formatCurrency(ex.paymentDifference)} more a month and saves{" "}
      {formatCurrency(ex.interestSaved)} in interest. Two things drive that: the lower rate, and paying interest for
      half as long.
    </p>

    <h2>When a 15-year mortgage makes sense</h2>
    <ul>
      <li>The higher payment fits your budget with room to spare, after savings and retirement contributions.</li>
      <li>You want to own your home outright by a set date, such as retirement or a child's college years.</li>
      <li>You're refinancing and don't want to restart a 30-year clock.</li>
    </ul>

    <h2>When a 30-year mortgage makes sense</h2>
    <ul>
      <li>You need the lower payment to qualify for the home or to keep your budget comfortable.</li>
      <li>You'd rather invest the difference or build savings first.</li>
      <li>Your income varies, and a lower required payment is a safety net.</li>
    </ul>

    <h2>The middle path</h2>
    <p>
      Take a 30-year loan and pay extra when you can. You give up some of the 15-year's rate advantage but keep
      flexibility. The calculator's "30-year paid like a 15" box shows the trade-off, and the{" "}
      <Link to="/extra-mortgage-payments-calculator/">extra payments calculator</Link> lets you try any extra amount.
    </p>
  </CalculatorPage>
);

export default TermComparison;
