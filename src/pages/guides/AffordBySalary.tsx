import { Link } from "react-router-dom";
import GuidePage from "@/components/GuidePage";
import { formatCurrency } from "@/lib/formatters";
import { maxAffordablePrice } from "@/lib/mortgageMath";

const RATE = 6.5;
const DOWN = 10;
const TAX = 1.0;
const INSURANCE = 0.5;
const PMI = 0.5;

const price = (salary: number, ratio: number, otherDebt = 0) =>
  maxAffordablePrice({
    maxPayment: (salary / 12) * (ratio / 100) - otherDebt,
    annualRatePercent: RATE,
    months: 360,
    downPaymentPercent: DOWN,
    propertyTaxRatePercent: TAX,
    insuranceRatePercent: INSURANCE,
    pmiRatePercent: PMI,
    monthlyHoa: 0,
  });

const salaries = [40_000, 50_000, 60_000, 75_000, 90_000, 100_000, 125_000, 150_000, 200_000, 250_000];
const rows = salaries.map((s) => ({ salary: s, comfortable: price(s, 28), stretch: price(s, 36), payment: (s / 12) * 0.28 }));
const at100 = rows.find((r) => r.salary === 100_000)!;
const at100WithDebt = price(100_000, 36, 600);

const faqs = [
  {
    q: "How much house can I afford with a $100,000 salary?",
    a: `About ${formatCurrency(Math.round(at100.comfortable / 1000) * 1000)} if you keep the full housing payment at 28% of gross income (${formatCurrency(at100.payment)} a month), with 10% down at ${RATE}%. Up to about ${formatCurrency(Math.round(at100.stretch / 1000) * 1000)} if you have no other debts and stretch to 36%.`,
  },
  {
    q: "What is the 28/36 rule?",
    a: "A guideline that your housing payment (principal, interest, taxes, insurance, PMI and HOA) should be no more than 28% of your gross monthly income, and all your debt payments together no more than 36%. Many lenders approve higher ratios, but 28/36 leaves room for savings and surprises.",
  },
  {
    q: "Should I use gross or take-home pay?",
    a: "Lenders use gross income, before taxes. For your own budget, check the payment against take-home pay too: a payment that's 28% of gross is often 35% to 40% of take-home.",
  },
];

const AffordBySalary = () => (
  <GuidePage
    slug="how-much-house-can-i-afford-by-salary"
    metaTitle="How Much House Can I Afford on My Salary? (Table by Income)"
    description="Home prices you can afford at salaries from $40,000 to $250,000 under the 28/36 rule, with 10% down at 6.5%, and how debts change the answer."
    faqs={faqs}
    lead={
      <p>
        A common rule of thumb is that your full housing payment should be no more than <strong>28% of your gross
        income</strong>. At a {RATE}% rate with {DOWN}% down, that works out to a home price of about{" "}
        <strong>3.2 times your salary</strong>. The table below shows what that means at each income.
      </p>
    }
  >
    <h2>Home price you can afford by salary</h2>
    <div className="hub-table-wrap">
      <table>
        <caption className="sr-only">Affordable home price by salary</caption>
        <thead>
          <tr>
            <th scope="col">Salary</th>
            <th scope="col">Monthly payment at 28%</th>
            <th scope="col">Comfortable price (28%)</th>
            <th scope="col">Stretch price (36%)</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.salary}>
              <th scope="row">{formatCurrency(r.salary)}</th>
              <td data-label="Payment at 28%">{formatCurrency(r.payment)}</td>
              <td data-label="Comfortable price">{formatCurrency(Math.round(r.comfortable / 1000) * 1000)}</td>
              <td data-label="Stretch price">{formatCurrency(Math.round(r.stretch / 1000) * 1000)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <p className="hub-note">
      Assumes {DOWN}% down, a {RATE}% 30-year fixed rate, property tax of {TAX}% and insurance of {INSURANCE}% of the
      price a year, PMI of {PMI}% of the loan, no HOA dues and no other debts. The stretch column uses 36% of income,
      the most many guidelines allow for all debts combined.
    </p>

    <h2>How debts change the answer</h2>
    <p>
      The 36% limit covers all your monthly debt payments, not just housing. Car loans, student loans and credit card
      minimums come out of the same budget. On a $100,000 salary with $600 a month of other debts, the 36% limit
      leaves room for a home of about {formatCurrency(Math.round(at100WithDebt / 1000) * 1000)}, down from{" "}
      {formatCurrency(Math.round(at100.stretch / 1000) * 1000)} with no debts. Read more in our guide to{" "}
      <Link to="/guides/debt-to-income-ratio-for-mortgage/">debt-to-income ratios</Link>.
    </p>

    <h2>What else moves your budget</h2>
    <ul>
      <li>
        <strong>Interest rate:</strong> each 1 point higher cuts the price you can afford by about 7% to 8%.
      </li>
      <li>
        <strong>Property taxes:</strong> they range from under 0.5% to almost 2% of value by state. See the{" "}
        <Link to="/mortgage-calculator-by-state/">mortgage calculator by state</Link>.
      </li>
      <li>
        <strong>Down payment:</strong> 20% down avoids PMI and lowers the loan, so your budget buys more house.
      </li>
      <li>
        <strong>HOA dues:</strong> every $100 a month of dues lowers the price you can afford by about $14,000 at these
        rates.
      </li>
    </ul>

    <h2>Lender limits vs. a comfortable budget</h2>
    <p>
      Lenders may approve you for more than these numbers: up to 43% to 50% of income for all debts on many loans.
      Being approved isn't the same as being comfortable. Before you commit, check the payment against your take-home
      pay and leave room for savings, repairs and retirement. To run your own numbers, including your debts and down
      payment, use the <Link to="/house-affordability/">affordability calculator</Link>.
    </p>
  </GuidePage>
);

export default AffordBySalary;
