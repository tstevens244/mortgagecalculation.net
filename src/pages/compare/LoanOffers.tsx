import { Link } from "react-router-dom";
import CalculatorPage from "@/components/CalculatorPage";
import LoanOffersCalculator from "@/components/compare/LoanOffersCalculator";
import { formatCurrency } from "@/lib/formatters";
import { compareOffers } from "@/lib/compareMath";

const offers = [
  { rate: 6.5, upfront: 4000 },
  { rate: 6.75, upfront: 0 },
  { rate: 6.25, upfront: 8000 },
];
const short = compareOffers(320_000, 360, 36, offers);
const long = compareOffers(320_000, 360, 84, offers);

const faqs = [
  {
    q: "What's the difference between the interest rate and APR?",
    a: "The interest rate sets your monthly payment. The APR also counts points and lender fees, spread over the full loan term, so it's higher when fees are higher. APR is useful for comparing offers, but it assumes you keep the loan for its whole term.",
  },
  {
    q: "Does getting several mortgage quotes hurt my credit?",
    a: "Not much. Credit scoring models count multiple mortgage credit checks within a short window, typically 14 to 45 days depending on the model, as a single inquiry. Get your quotes within a couple of weeks.",
  },
  {
    q: "Which numbers on the Loan Estimate should I compare?",
    a: "The interest rate and monthly payment on page 1, and section A, Origination Charges, on page 2. Third-party costs like title and appraisal vary less between lenders. Page 3 shows the APR.",
  },
  {
    q: "Can I negotiate lender fees?",
    a: "Often, yes. Show a lender a competing Loan Estimate and ask them to match the rate or reduce origination charges.",
  },
];

const LoanOffers = () => (
  <CalculatorPage
    path="/mortgage-comparison-calculator/"
    title="Mortgage Comparison Calculator: Compare Loan Offers by APR & Cost"
    description="Compare up to three mortgage offers side by side: monthly payment, APR, up-front fees and total cost over the years you'll keep the loan."
    heading="Compare Mortgage Offers"
    intro={
      <p>
        Enter the rate and fees from up to three Loan Estimates to see which one really costs least for how long
        you'll keep the loan.
      </p>
    }
    calculator={<LoanOffersCalculator />}
    faqs={faqs}
    featureList={["Up to 3 offers side by side", "APR from rate and fees", "Total cost over your time frame", "Lowest-cost offer highlighted"]}
  >
    <h2>Why the cheapest offer depends on time</h2>
    <p>Take three offers on a $320,000 30-year loan:</p>
    <div className="hub-table-wrap">
      <table>
        <caption className="sr-only">Three example loan offers</caption>
        <thead>
          <tr>
            <th scope="col">Offer</th>
            <th scope="col">Rate and fees</th>
            <th scope="col">APR</th>
            <th scope="col">Cost over 3 years</th>
            <th scope="col">Cost over 7 years</th>
          </tr>
        </thead>
        <tbody>
          {offers.map((o, i) => (
            <tr key={i}>
              <th scope="row">{["A", "B", "C"][i]}</th>
              <td data-label="Rate and fees">
                {o.rate}%, {formatCurrency(o.upfront)} fees
              </td>
              <td data-label="APR">{long[i].apr.toFixed(3)}%</td>
              <td data-label="Cost over 3 years">{formatCurrency(short[i].cost)}</td>
              <td data-label="Cost over 7 years">{formatCurrency(long[i].cost)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <p>
      Offer C has the lowest APR and costs least if you keep the loan 7 years. But if you sell or refinance after 3
      years, Offer B, with no fees, costs least, because you never pay off the extra fees through lower interest.
    </p>

    <h2>How to compare mortgage offers</h2>
    <ol>
      <li>
        <strong>Get Loan Estimates from at least three lenders</strong> on the same day if you can, for the same loan
        type, term and down payment.
      </li>
      <li>
        <strong>Compare the rate and Origination Charges</strong> (page 2, section A). These are what the lender
        controls.
      </li>
      <li>
        <strong>Pick a realistic time frame.</strong> Most people sell or refinance within 10 years, so cost over the
        full 30 years overstates the value of paying fees for a lower rate.
      </li>
      <li>
        <strong>Ask for a better deal.</strong> Lenders will often match a competing offer.
      </li>
    </ol>
    <p>
      To see whether paying for a lower rate makes sense on its own, try the{" "}
      <Link to="/mortgage-points-calculator/">mortgage points calculator</Link>.
    </p>
  </CalculatorPage>
);

export default LoanOffers;
