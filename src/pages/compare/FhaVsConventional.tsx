import { Link } from "react-router-dom";
import CalculatorPage from "@/components/CalculatorPage";
import FhaVsConventionalCalculator from "@/components/compare/FhaVsConventionalCalculator";
import { formatCurrency } from "@/lib/formatters";
import { fhaVsConventional } from "@/lib/compareMath";
import { CONFORMING_LIMIT, FHA_LIMIT_CEILING, FHA_LIMIT_FLOOR, FHA_UPFRONT_MIP_RATE, LIMITS_YEAR } from "@/lib/loanLimits";

const base = { price: 400_000, downPercent: 5, termYears: 30, fhaRate: 6.5, convRate: 6.5, horizonYears: 7 };
const goodCredit = fhaVsConventional({ ...base, pmiRate: 0.3 });
const fairCredit = fhaVsConventional({ ...base, pmiRate: 1.0 });

const faqs = [
  {
    q: "Is FHA or conventional cheaper?",
    a: "It depends mostly on your credit score and how long you keep the loan. FHA mortgage insurance costs the same at any score, while conventional PMI gets cheaper as your score rises. With good credit, conventional usually wins; with fair credit, FHA often does for the first several years.",
  },
  {
    q: "Can I switch from FHA to conventional later?",
    a: "Yes, by refinancing into a conventional loan once you have about 20% equity, which also ends FHA mortgage insurance. That's the usual way to drop MIP on an FHA loan with less than 10% down. Weigh the closing costs and the rate you'd get at the time.",
  },
  {
    q: "What credit score do I need for FHA vs. conventional?",
    a: "FHA allows scores down to 580 with 3.5% down, or 500 with 10% down, though many lenders set 600 to 640 minimums. Conventional loans usually need at least 620.",
  },
  {
    q: "Does FHA mortgage insurance ever go away?",
    a: "With at least 10% down, annual MIP ends after 11 years. With less than 10% down, it lasts for the life of the loan unless you refinance or sell. The 1.75% upfront MIP is paid once, usually added to the loan.",
  },
];

const FhaVsConventional = () => (
  <CalculatorPage
    path="/fha-vs-conventional-calculator/"
    title="FHA vs. Conventional Loan Calculator: Which Costs Less?"
    description="Compare an FHA and a conventional loan for the same home: monthly payment, mortgage insurance, when it ends, and total cost over the years you keep the loan."
    heading="FHA vs. Conventional Loan Calculator"
    intro={
      <p>
        Run the same home through both loans and see which costs less for your down payment, credit and how long
        you'll keep the loan.
      </p>
    }
    calculator={<FhaVsConventionalCalculator />}
    faqs={faqs}
    featureList={[
      "FHA upfront and annual MIP with current rules",
      "Conventional PMI until 78% loan-to-value",
      "Monthly payment for each loan",
      "Total cost over the years you keep the loan",
    ]}
  >
    <h2>FHA vs. conventional loans compared</h2>
    <div className="hub-table-wrap">
      <table>
        <caption className="sr-only">FHA and conventional loan rules</caption>
        <thead>
          <tr>
            <th scope="col"></th>
            <th scope="col">FHA</th>
            <th scope="col">Conventional</th>
          </tr>
        </thead>
        <tbody>
          {[
            ["Minimum down payment", "3.5% (10% with a 500–579 score)", "3%"],
            ["Typical minimum credit score", "580", "620"],
            ["Upfront mortgage insurance", `${FHA_UPFRONT_MIP_RATE}% of the loan, usually financed`, "None"],
            ["Annual mortgage insurance", "0.15%–0.75%, same at any credit score", "Often 0.3%–1.5%, lower with better credit"],
            ["When it ends", "11 years with 10%+ down; otherwise the life of the loan", "Automatically at 78% loan-to-value"],
            [
              `${LIMITS_YEAR} loan limit (one unit)`,
              `${formatCurrency(FHA_LIMIT_FLOOR)} to ${formatCurrency(FHA_LIMIT_CEILING)} by county`,
              `${formatCurrency(CONFORMING_LIMIT)} in most counties`,
            ],
          ].map(([label, fha, conv]) => (
            <tr key={label}>
              <th scope="row">{label}</th>
              <td data-label="FHA">{fha}</td>
              <td data-label="Conventional">{conv}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <h2>Which one costs less?</h2>
    <p>
      Take a $400,000 home with 5% down at 6.5% for both loans, kept for 7 years. The only thing that changes below is
      the conventional PMI rate, which depends mostly on credit score:
    </p>
    <ul>
      <li>
        <strong>Strong credit (PMI 0.3%):</strong> conventional costs {formatCurrency(goodCredit.fha.cost - goodCredit.conv.cost)}{" "}
        less, at {formatCurrency(goodCredit.conv.payment)} a month vs. {formatCurrency(goodCredit.fha.payment)} for FHA.
      </li>
      <li>
        <strong>Fair credit (PMI 1.0%):</strong> FHA costs {formatCurrency(fairCredit.conv.cost - fairCredit.fha.cost)} less,
        at {formatCurrency(fairCredit.fha.payment)} a month vs. {formatCurrency(fairCredit.conv.payment)}.
      </li>
    </ul>
    <p>
      Time matters too. Conventional PMI on that loan ends after about {Math.round(goodCredit.conv.pmiMonths / 12)}{" "}
      years, while FHA MIP with 5% down never ends, so the longer you keep the loan the better conventional looks.
      FHA rates are also often a bit lower; enter real quotes for both to get the true answer.
    </p>

    <h2>Other differences</h2>
    <ul>
      <li>
        <strong>Property condition:</strong> FHA appraisals check that the home meets HUD's minimum property
        standards, which can be a problem for fixer-uppers.
      </li>
      <li>
        <strong>Debt-to-income:</strong> FHA often allows higher debt-to-income ratios than conventional loans.
      </li>
      <li>
        <strong>Gift funds:</strong> both allow down payment gifts from family, with documentation.
      </li>
    </ul>
    <p>
      For full payment detail, including taxes and insurance, use the <Link to="/fha-loan-calculator/">FHA loan
      calculator</Link> or the <Link to="/conventional-mortgage-calculator/">conventional mortgage calculator</Link>.
    </p>
  </CalculatorPage>
);

export default FhaVsConventional;
