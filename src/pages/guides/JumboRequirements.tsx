import { Link } from "react-router-dom";
import GuidePage from "@/components/GuidePage";
import { formatCurrency } from "@/lib/formatters";
import { maxAffordablePrice } from "@/lib/mortgageMath";
import { CONFORMING_LIMIT, CONFORMING_LIMIT_HIGH_COST, LIMITS_YEAR } from "@/lib/loanLimits";

const RATE = 6.75;
const TAX = 1.1;
const INSURANCE = 0.35;

/** Price that fits a 28% housing ratio with 20% down (no PMI). */
const priceFor = (income: number) =>
  maxAffordablePrice({
    maxPayment: (income / 12) * 0.28,
    annualRatePercent: RATE,
    months: 360,
    downPaymentPercent: 20,
    propertyTaxRatePercent: TAX,
    insuranceRatePercent: INSURANCE,
    pmiRatePercent: 0,
    monthlyHoa: 0,
  });
const INCOMES = [200_000, 250_000, 300_000, 400_000, 500_000];

// Smallest price that makes a 20%-down loan a jumbo loan in most counties.
const JUMBO_PRICE_20 = CONFORMING_LIMIT / 0.8;
const EXAMPLE_PRICE = 1_100_000;
const exampleLoan = EXAMPLE_PRICE * 0.8;

const calcLink = `/jumbo-loan-calculator/?homePrice=${EXAMPLE_PRICE}&downPayment=${EXAMPLE_PRICE * 0.2}&downPaymentPercent=20&interestRate=${RATE}&loanTerm=30`;

const faqs = [
  {
    q: `What is a jumbo loan in ${LIMITS_YEAR}?`,
    a: `A mortgage larger than the conforming loan limit: ${formatCurrency(CONFORMING_LIMIT)} for a one-unit home in most of the U.S. in ${LIMITS_YEAR}, and up to ${formatCurrency(CONFORMING_LIMIT_HIGH_COST)} in high-cost areas. Loans above the limit for your county can't be sold to Fannie Mae or Freddie Mac, so lenders set their own, usually stricter, rules.`,
  },
  {
    q: "How much do you need to put down on a jumbo loan?",
    a: "Usually 10% to 20%. Some lenders go as low as 5% to 10% for strong borrowers, often with PMI or a higher rate. Twenty percent down avoids PMI and gets the widest choice of lenders.",
  },
  {
    q: "Are jumbo loan rates higher?",
    a: "Not necessarily. Jumbo rates are set by each lender and are sometimes at or even below conforming rates for well-qualified borrowers. They vary more between lenders, so compare several quotes.",
  },
  {
    q: "How can I avoid a jumbo loan?",
    a: "Put more down so the loan stays under your county's limit, use an 80/10/10 piggyback so the first mortgage stays conforming, or check whether your county has a higher limit than the baseline.",
  },
];

const JumboRequirements = () => (
  <GuidePage
    slug="jumbo-loan-requirements"
    metaTitle={`Jumbo Loan Requirements ${LIMITS_YEAR}: Limits, Down Payment, Max Loan`}
    description={`What counts as a jumbo loan in ${LIMITS_YEAR} (over ${formatCurrency(CONFORMING_LIMIT)} in most counties), typical credit, down payment and reserve requirements, and how much house you can afford by income.`}
    faqs={faqs}
    lead={
      <>
        <p>
          A jumbo loan is any mortgage above the <strong>conforming loan limit</strong>: {formatCurrency(CONFORMING_LIMIT)}{" "}
          for a one-unit home in most counties in {LIMITS_YEAR}, and up to {formatCurrency(CONFORMING_LIMIT_HIGH_COST)}{" "}
          in high-cost areas. Lenders typically want a <strong>700+ credit score</strong>,{" "}
          <strong>10% to 20% down</strong>, a debt-to-income ratio of <strong>43% or less</strong>, and{" "}
          <strong>6 to 12 months of payments in reserve</strong>.
        </p>
      </>
    }
  >
    <h2>When does a mortgage become a jumbo loan?</h2>
    <p>
      The line is the conforming loan limit set each year by the{" "}
      <a href="https://www.fhfa.gov/data/conforming-loan-limit" target="_blank" rel="noopener noreferrer">
        Federal Housing Finance Agency
      </a>
      . It applies to the <strong>loan amount</strong>, not the price. With 20% down, a home becomes jumbo territory
      above about {formatCurrency(Math.ceil(JUMBO_PRICE_20 / 1000) * 1000)} in most counties.
    </p>
    <p>
      For example, a {formatCurrency(EXAMPLE_PRICE)} home with 20% down needs a {formatCurrency(exampleLoan)} loan:{" "}
      {formatCurrency(exampleLoan - CONFORMING_LIMIT)} over the baseline limit, so it's a jumbo loan unless the county
      has a higher limit. <Link to={calcLink}>See the payment in the jumbo calculator</Link>.
    </p>

    <h2>Typical jumbo loan requirements</h2>
    <div className="hub-table-wrap">
      <table>
        <caption className="sr-only">Jumbo vs. conforming loan requirements</caption>
        <thead>
          <tr>
            <th scope="col"></th>
            <th scope="col">Jumbo (typical)</th>
            <th scope="col">Conforming</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">Credit score</th>
            <td data-label="Jumbo">700–720+</td>
            <td data-label="Conforming">620+</td>
          </tr>
          <tr>
            <th scope="row">Down payment</th>
            <td data-label="Jumbo">10%–20%</td>
            <td data-label="Conforming">3%–5%</td>
          </tr>
          <tr>
            <th scope="row">Debt-to-income</th>
            <td data-label="Jumbo">Up to ~43%</td>
            <td data-label="Conforming">Up to 50% with strong factors</td>
          </tr>
          <tr>
            <th scope="row">Cash reserves</th>
            <td data-label="Jumbo">6–12 months of payments</td>
            <td data-label="Conforming">Often none for a primary home</td>
          </tr>
          <tr>
            <th scope="row">Appraisal</th>
            <td data-label="Jumbo">Full appraisal; sometimes two for large loans</td>
            <td data-label="Conforming">Sometimes waived</td>
          </tr>
        </tbody>
      </table>
    </div>
    <p className="hub-note">
      Jumbo rules vary by lender because each sets its own. Treat these as typical ranges and ask lenders for theirs.
    </p>

    <h2>How much can I borrow with a jumbo loan?</h2>
    <p>
      Like any mortgage, it comes down to income. Here's the price that keeps the full payment within 28% of gross
      income, with 20% down, a {RATE}% rate, {TAX}% property tax and {INSURANCE}% insurance:
    </p>
    <div className="hub-table-wrap">
      <table>
        <caption className="sr-only">Home price by income with 20% down</caption>
        <thead>
          <tr>
            <th scope="col">Household income</th>
            <th scope="col">Home price</th>
            <th scope="col">Loan</th>
            <th scope="col">Jumbo?</th>
          </tr>
        </thead>
        <tbody>
          {INCOMES.map((inc) => {
            const price = Math.floor(priceFor(inc) / 5000) * 5000;
            const loan = price * 0.8;
            return (
              <tr key={inc}>
                <th scope="row">{formatCurrency(inc)}</th>
                <td data-label="Home price">{formatCurrency(price)}</td>
                <td data-label="Loan">{formatCurrency(loan)}</td>
                <td data-label="Jumbo?">{loan > CONFORMING_LIMIT ? "Yes, in most counties" : "No"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
    <p className="hub-note">
      Other debts and the lender's total DTI limit can lower these. Run your numbers in the{" "}
      <Link to="/house-affordability/">affordability calculator</Link>.
    </p>

    <h2>Jumbo loan rates</h2>
    <p>
      There's no standard jumbo rate. Because lenders keep many jumbo loans on their own books, they price them to win
      customers they want, and well-qualified borrowers sometimes get jumbo rates at or below conforming rates. Rates
      spread more widely between lenders, so getting three or more quotes matters more than usual. The{" "}
      <Link to="/mortgage-comparison-calculator/">loan comparison calculator</Link> lines up offers by total cost.
    </p>

    <h2>Ways to avoid a jumbo loan</h2>
    <ul>
      <li>
        <strong>Put more down</strong> so the loan stays at or under {formatCurrency(CONFORMING_LIMIT)}.
      </li>
      <li>
        <strong>Use a piggyback loan.</strong> An 80/10/10 keeps the first mortgage conforming and covers the rest with a
        second loan. See <Link to="/guides/piggyback-loan-vs-pmi/">piggyback loan vs. PMI</Link> and the{" "}
        <Link to="/second-mortgage-calculator/">piggyback calculator</Link>.
      </li>
      <li>
        <strong>Check your county's limit.</strong> High-cost counties allow conforming loans up to{" "}
        {formatCurrency(CONFORMING_LIMIT_HIGH_COST)}, sometimes called "high-balance" loans.
      </li>
    </ul>

    <h2>Sources</h2>
    <ul className="hub-note">
      <li>
        <a href="https://www.fhfa.gov/data/conforming-loan-limit" target="_blank" rel="noopener noreferrer">
          FHFA: Conforming loan limit values
        </a>
      </li>
      <li>
        <a href="https://www.consumerfinance.gov/owning-a-home/loan-options/conventional-loans/" target="_blank" rel="noopener noreferrer">
          CFPB: Conventional and jumbo loans
        </a>
      </li>
    </ul>
  </GuidePage>
);

export default JumboRequirements;
