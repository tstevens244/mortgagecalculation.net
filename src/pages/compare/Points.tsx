import { Link } from "react-router-dom";
import CalculatorPage from "@/components/CalculatorPage";
import PointsCalculator from "@/components/compare/PointsCalculator";
import { formatCurrency } from "@/lib/formatters";
import { pointsAnalysis } from "@/lib/compareMath";

const ex = (horizonMonths: number) =>
  pointsAnalysis({ loan: 320_000, baseRate: 6.75, points: 1, reductionPerPoint: 0.25, termMonths: 360, horizonMonths });
const seven = ex(84);
const three = ex(36);

const faqs = [
  {
    q: "How much does one mortgage point cost?",
    a: "One point costs 1% of the loan amount: $3,200 on a $320,000 loan. Lenders often let you buy fractions of a point.",
  },
  {
    q: "How much does a point lower the rate?",
    a: "It varies by lender and by day, but one point often lowers the rate by about 0.25 percentage points. The lender's Loan Estimate or rate sheet shows the exact trade-off.",
  },
  {
    q: "When are mortgage points worth it?",
    a: "When you'll keep the loan past the break-even point: the cost of the points divided by the monthly savings. That's often 5 to 7 years. If you may sell or refinance sooner, points usually lose money.",
  },
  {
    q: "Are mortgage points tax deductible?",
    a: "If you itemize, points paid to buy your main home can usually be deducted in the year you pay them. Points on a refinance are generally deducted over the life of the loan. See IRS Publication 936 or a tax professional for your situation.",
  },
];

const Points = () => (
  <CalculatorPage
    path="/mortgage-points-calculator/"
    title="Mortgage Points Calculator: Is Buying Down Your Rate Worth It?"
    description="Find out if mortgage discount points pay off: cost, new rate, monthly savings, break-even point and net savings over the years you keep the loan."
    heading="Mortgage Points Calculator"
    intro={
      <p>
        Paying points up front lowers your rate. See how long it takes to earn the cost back, and whether you'll keep
        the loan long enough for it to pay off.
      </p>
    }
    calculator={<PointsCalculator />}
    faqs={faqs}
    featureList={["Cost of points", "Monthly savings", "Break-even point", "Net savings over the years you keep the loan"]}
  >
    <h2>What are mortgage points?</h2>
    <p>
      Discount points are prepaid interest. Each point costs 1% of the loan amount and lowers the interest rate,
      often by about 0.25 percentage points. They appear on page 2 of your Loan Estimate, under Origination Charges.
    </p>

    <h2>How the break-even point works</h2>
    <p>
      On a $320,000 30-year loan at 6.75%, one point costs {formatCurrency(seven.cost)} and drops the rate to{" "}
      {seven.newRate.toFixed(2)}%. The payment falls by {formatCurrency(seven.monthlySavings)} a month, so it takes{" "}
      {seven.breakEvenMonths} months, about {Math.round(seven.breakEvenMonths / 12)} years, to earn the cost back.
    </p>
    <ul>
      <li>
        Keep the loan 7 years and the point saves you <strong>{formatCurrency(seven.netSavings)}</strong>, counting
        the faster paydown from the lower rate.
      </li>
      <li>
        Sell or refinance after 3 years and it costs you <strong>{formatCurrency(-three.netSavings)}</strong>.
      </li>
    </ul>

    <h2>When points make sense</h2>
    <ul>
      <li>You expect to keep the loan well past the break-even point.</li>
      <li>You have cash left after the down payment, closing costs and an emergency fund.</li>
      <li>Rates aren't likely to drop enough for you to refinance soon.</li>
    </ul>
    <p>
      If you're short on cash, the reverse can help: a <strong>lender credit</strong> gives you money toward closing
      costs in exchange for a higher rate. To compare full offers with different rates and fees, use the{" "}
      <Link to="/mortgage-comparison-calculator/">loan offer comparison calculator</Link>.
    </p>
  </CalculatorPage>
);

export default Points;
