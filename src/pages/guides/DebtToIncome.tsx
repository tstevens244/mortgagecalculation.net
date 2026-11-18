import { Link } from "react-router-dom";
import GuidePage from "@/components/GuidePage";
import { formatCurrency } from "@/lib/formatters";

const INCOME = 8_000;
const HOUSING = 2_200;
const debts = [
  { name: "Car loan", amount: 400 },
  { name: "Student loan", amount: 250 },
  { name: "Credit card minimums", amount: 75 },
];
const otherDebt = debts.reduce((t, d) => t + d.amount, 0);
const front = (HOUSING / INCOME) * 100;
const back = ((HOUSING + otherDebt) / INCOME) * 100;

const limits = [
  { loan: "Conventional", housing: "No set limit", total: "36% to 45%, up to 50% with automated approval" },
  { loan: "FHA", housing: "31%", total: "43%, higher with compensating factors or automated approval" },
  { loan: "VA", housing: "No set limit", total: "41% guideline, plus a residual income test" },
  { loan: "USDA", housing: "29%", total: "41%, higher with automated approval" },
];

const faqs = [
  {
    q: "What is a good debt-to-income ratio for a mortgage?",
    a: "36% or less for all debts, with no more than 28% going to housing, is considered comfortable. Many lenders approve up to 43% to 50% depending on the loan type, credit score and savings.",
  },
  {
    q: "Is DTI based on gross or net income?",
    a: "Gross monthly income: your pay before taxes and deductions. Lenders use documented, steady income, such as salary, consistent overtime or bonuses, self-employment income averaged over two years, and some benefits.",
  },
  {
    q: "Do utilities and phone bills count in DTI?",
    a: "No. DTI counts debt payments that show on your credit report or in court orders: the new mortgage payment (with taxes, insurance, PMI and HOA), car and student loans, credit card minimums, personal loans, and child support or alimony.",
  },
  {
    q: "How are student loans in deferment counted?",
    a: "Lenders still count a payment. Depending on the loan type, they use the payment on your credit report or a set share of the balance, typically 0.5% to 1% a month.",
  },
];

const DebtToIncome = () => (
  <GuidePage
    slug="debt-to-income-ratio-for-mortgage"
    metaTitle="Debt-to-Income Ratio for a Mortgage: How to Calculate It and DTI Limits"
    description="How lenders calculate your debt-to-income ratio, the DTI limits for conventional, FHA, VA and USDA loans, and how to lower yours to qualify."
    faqs={faqs}
    lead={
      <p>
        Your debt-to-income ratio (DTI) is the share of your gross monthly income that goes to debt payments. It's
        one of the main numbers lenders use to decide how much you can borrow. Most want it at or below{" "}
        <strong>43% to 50%</strong>, depending on the loan.
      </p>
    }
  >
    <h2>How to calculate your DTI</h2>
    <p>Lenders look at two ratios:</p>
    <ul>
      <li>
        <strong>Housing ratio (front-end):</strong> your new monthly housing payment, including principal, interest,
        property tax, insurance, PMI and HOA dues, divided by gross monthly income.
      </li>
      <li>
        <strong>Total DTI (back-end):</strong> the housing payment plus all other monthly debt payments, divided by
        gross monthly income. This is the one that usually decides approval.
      </li>
    </ul>

    <h2>An example</h2>
    <p>
      Say you earn {formatCurrency(INCOME * 12)} a year ({formatCurrency(INCOME)} a month) and the home you want has a{" "}
      {formatCurrency(HOUSING)} monthly payment. Your other debts:
    </p>
    <div className="hub-table-wrap">
      <table>
        <caption className="sr-only">Example debts and ratios</caption>
        <thead>
          <tr>
            <th scope="col">Item</th>
            <th scope="col">Monthly</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">New housing payment</th>
            <td data-label="Monthly">{formatCurrency(HOUSING)}</td>
          </tr>
          {debts.map((d) => (
            <tr key={d.name}>
              <th scope="row">{d.name}</th>
              <td data-label="Monthly">{formatCurrency(d.amount)}</td>
            </tr>
          ))}
          <tr>
            <th scope="row">Total debt payments</th>
            <td data-label="Monthly">
              <strong>{formatCurrency(HOUSING + otherDebt)}</strong>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <p>
      Housing ratio: {formatCurrency(HOUSING)} ÷ {formatCurrency(INCOME)} = <strong>{front.toFixed(1)}%</strong>. Total
      DTI: {formatCurrency(HOUSING + otherDebt)} ÷ {formatCurrency(INCOME)} = <strong>{back.toFixed(1)}%</strong>. That's
      within the usual limits for FHA, VA and USDA loans and for most conventional loans.
    </p>

    <h2>DTI limits by loan type</h2>
    <div className="hub-table-wrap">
      <table>
        <caption className="sr-only">Debt-to-income limits by loan type</caption>
        <thead>
          <tr>
            <th scope="col">Loan</th>
            <th scope="col">Housing ratio</th>
            <th scope="col">Total DTI</th>
          </tr>
        </thead>
        <tbody>
          {limits.map((l) => (
            <tr key={l.loan}>
              <th scope="row">{l.loan}</th>
              <td data-label="Housing ratio">{l.housing}</td>
              <td data-label="Total DTI">{l.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <p className="hub-note">
      Program guidelines; individual lenders can set lower limits. Higher ratios usually need strong credit, cash
      reserves or other compensating factors.
    </p>

    <h2>How to lower your DTI</h2>
    <ul>
      <li>
        <strong>Pay off small debts.</strong> Clearing a car loan or credit card removes its whole payment from the
        calculation.
      </li>
      <li>
        <strong>Don't take on new debt</strong> before closing, including financing furniture or a car.
      </li>
      <li>
        <strong>Lower the housing payment:</strong> a less expensive home, a larger down payment, or a lower rate.
      </li>
      <li>
        <strong>Add a co-borrower</strong> whose income counts toward the loan.
      </li>
    </ul>
    <p>
      To see the income you need for a specific home, use the{" "}
      <Link to="/mortgage-qualification-calculator/">mortgage qualification calculator</Link>. To go the other way,
      from your income to a price, try the <Link to="/house-affordability/">affordability calculator</Link> or our
      guide to <Link to="/guides/how-much-house-can-i-afford-by-salary/">what you can afford by salary</Link>.
    </p>
  </GuidePage>
);

export default DebtToIncome;
