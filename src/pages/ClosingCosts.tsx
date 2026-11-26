import { Link } from "react-router-dom";
import CalculatorPage from "@/components/CalculatorPage";
import ClosingCostCalculator from "@/components/ClosingCostCalculator";
import { formatCurrency } from "@/lib/formatters";
import { quickClosingCosts } from "@/lib/closingCosts";
import { averageRate } from "@/lib/marketRates";
import { LIMITS_YEAR } from "@/lib/loanLimits";

// Worked example: $400,000 home, 10% down, typical fees.
const PRICE = 400_000;
const DOWN = 40_000;
const ex = quickClosingCosts(PRICE, DOWN, averageRate(30), PRICE * 0.011, PRICE * 0.005);

const faqs = [
  {
    q: "How much are closing costs?",
    a: `Usually 2% to 5% of the loan amount for buyers, not counting the down payment. On a ${formatCurrency(PRICE)} home with 10% down, typical fees plus prepaids and escrow come to about ${formatCurrency(ex.total)}, so you'd need around ${formatCurrency(ex.cashToClose)} in total at closing.`,
  },
  {
    q: "What is cash to close?",
    a: "The total you bring to closing: your down payment plus closing costs, minus any deposits already paid and any seller or lender credits. It's on page 1 of your Loan Estimate and the Closing Disclosure.",
  },
  {
    q: "Can closing costs be rolled into the mortgage?",
    a: "Not on most purchase loans, because the loan amount is based on the price. You can lower what you pay with seller concessions or a lender credit (a higher rate in exchange for money toward costs). On a refinance, closing costs can usually be added to the new loan.",
  },
  {
    q: "Who pays closing costs, the buyer or the seller?",
    a: "Both have their own. Buyers pay the loan costs, prepaids and escrow; sellers usually pay the real estate commissions and often the owner's title policy. Transfer taxes are split differently by state. Sellers can also agree to pay some of the buyer's costs, up to limits set by the loan type.",
  },
  {
    q: "How can I lower my closing costs?",
    a: "Compare Loan Estimates from at least three lenders, shop for the services in section C (title and settlement), ask the seller for concessions, consider a lender credit, and close near the end of the month to reduce prepaid interest.",
  },
];

const ClosingCosts = () => (
  <CalculatorPage
    path="/closing-cost-calculator/"
    title={`Closing Cost Calculator ${LIMITS_YEAR}: Estimate Your Cash to Close`}
    description="Estimate closing costs and cash to close for a home purchase, line by line like the Loan Estimate: lender fees, title, taxes, prepaids and escrow, with seller credits."
    heading="Closing Cost Calculator"
    intro={
      <p>
        See what you'll need at closing: your down payment plus lender fees, title, government fees, prepaids and
        escrow, laid out the way your Loan Estimate shows them.
      </p>
    }
    calculator={<ClosingCostCalculator />}
    faqs={faqs}
    featureList={[
      "Cash to close: down payment plus closing costs minus credits",
      "Fees by Loan Estimate section (A through G)",
      "Origination fee and discount points",
      "Prepaid interest, insurance and escrow deposits",
      "Seller and lender credits",
    ]}
  >
    <h2>What closing costs include</h2>
    <p>
      Every lender has to give you a Loan Estimate within three business days of your application. Page 2 lists closing
      costs in lettered sections, and this calculator uses the same ones so you can compare line by line:
    </p>
    <div className="hub-table-wrap">
      <table>
        <caption className="sr-only">Closing cost sections on the Loan Estimate</caption>
        <thead>
          <tr>
            <th scope="col">Section</th>
            <th scope="col">What's in it</th>
            <th scope="col">Typical cost</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">A. Origination charges</th>
            <td data-label="What">Lender's application, underwriting or origination fee, and any discount points</td>
            <td data-label="Typical">0.5%–1% of the loan, plus points</td>
          </tr>
          <tr>
            <th scope="row">B. Services you cannot shop for</th>
            <td data-label="What">Appraisal, credit report, flood certification, tax service</td>
            <td data-label="Typical">$600–$1,000</td>
          </tr>
          <tr>
            <th scope="row">C. Services you can shop for</th>
            <td data-label="What">Title search, lender's title insurance, settlement or escrow agent, survey, pest inspection</td>
            <td data-label="Typical">$1,500–$4,000, varies by state</td>
          </tr>
          <tr>
            <th scope="row">E. Taxes and government fees</th>
            <td data-label="What">Recording fees and any transfer or mortgage taxes the buyer pays</td>
            <td data-label="Typical">$100–$500, plus transfer tax where it applies</td>
          </tr>
          <tr>
            <th scope="row">F. Prepaids</th>
            <td data-label="What">First year of homeowners insurance, interest until the end of the month</td>
            <td data-label="Typical">Insurance premium + up to a month of interest</td>
          </tr>
          <tr>
            <th scope="row">G. Initial escrow payment</th>
            <td data-label="What">A few months of property tax and insurance to start your escrow account</td>
            <td data-label="Typical">2–6 months of tax, 2–3 of insurance</td>
          </tr>
        </tbody>
      </table>
    </div>
    <p className="hub-note">
      Sections F and G aren't fees: they're your own tax and insurance bills paid ahead. That's why "fees only" is
      smaller than total closing costs.
    </p>

    <h2>Example: closing costs on a {formatCurrency(PRICE)} home</h2>
    <p>
      With {formatCurrency(DOWN)} (10%) down, a {formatCurrency(ex.loan)} loan and typical fees, the estimate comes to:
    </p>
    <ul>
      <li>
        Lender and third-party fees (A–E): <strong>{formatCurrency(ex.fees)}</strong>
      </li>
      <li>
        Prepaids and escrow (F–G): <strong>{formatCurrency(ex.prepaidsAndEscrow)}</strong>
      </li>
      <li>
        Total closing costs: <strong>{formatCurrency(ex.total)}</strong>, {ex.percentOfPrice.toFixed(1)}% of the price
      </li>
      <li>
        Cash to close with the down payment: <strong>{formatCurrency(ex.cashToClose)}</strong>
      </li>
    </ul>
    <p>
      Your monthly payment on the same home is in the <Link to="/">mortgage calculator</Link>, which also has a cash to
      close tab.
    </p>

    <h2>How much the seller can pay</h2>
    <p>
      Sellers can pay some of your closing costs (seller concessions or credits), up to a limit set by the loan type,
      as a share of the price:
    </p>
    <ul>
      <li>
        <strong>Conventional:</strong> 3% with less than 10% down, 6% with 10% to 25% down, 9% with more than 25% down
        (primary home).
      </li>
      <li>
        <strong>FHA:</strong> 6%. See the <Link to="/fha-loan-calculator/">FHA loan calculator</Link>.
      </li>
      <li>
        <strong>VA:</strong> 4% in concessions, not counting normal closing costs, which the seller can also pay. See the{" "}
        <Link to="/va-funding-fee-calculator/">VA funding fee calculator</Link>.
      </li>
      <li>
        <strong>USDA:</strong> 6%.
      </li>
    </ul>

    <h2>Ways to lower closing costs</h2>
    <ul>
      <li>
        <strong>Compare Loan Estimates</strong> from at least three lenders. Section A varies the most; use the{" "}
        <Link to="/mortgage-comparison-calculator/">loan offer comparison calculator</Link>.
      </li>
      <li>
        <strong>Shop section C.</strong> You can choose your own title and settlement company.
      </li>
      <li>
        <strong>Take a lender credit</strong> in exchange for a slightly higher rate, the opposite of buying{" "}
        <Link to="/mortgage-points-calculator/">mortgage points</Link>.
      </li>
      <li>
        <strong>Close late in the month</strong> to cut prepaid interest.
      </li>
      <li>
        <strong>Look for down payment and closing cost assistance</strong> from your state housing finance agency.
      </li>
    </ul>

    <h2>Sources</h2>
    <ul className="hub-note">
      <li>
        <a href="https://www.consumerfinance.gov/owning-a-home/loan-estimate/" target="_blank" rel="noopener noreferrer">
          CFPB: Loan Estimate explainer
        </a>
      </li>
      <li>
        <a href="https://www.consumerfinance.gov/ask-cfpb/what-are-closing-costs-en-1845/" target="_blank" rel="noopener noreferrer">
          CFPB: What are closing costs?
        </a>
      </li>
      <li>
        <a href="https://selling-guide.fanniemae.com/sel/b3-4.1-02/interested-party-contributions-ipcs" target="_blank" rel="noopener noreferrer">
          Fannie Mae Selling Guide: Interested party contributions
        </a>
      </li>
    </ul>
  </CalculatorPage>
);

export default ClosingCosts;
