import { Link } from "react-router-dom";
import CalculatorPage from "@/components/CalculatorPage";
import UsdaFeeCalculator from "@/components/fees/UsdaFeeCalculator";
import { formatCurrency } from "@/lib/formatters";
import { usdaFees } from "@/lib/feeMath";
import { LIMITS_YEAR, USDA_ANNUAL_FEE_RATE, USDA_UPFRONT_FEE_RATE } from "@/lib/loanLimits";

const PRICE = 250_000;
const RATE = 6.5;
const ex = usdaFees({ price: PRICE, down: 0, ratePercent: RATE, financed: true });
const ex300 = usdaFees({ price: 300_000, down: 0, ratePercent: RATE, financed: true });

const faqs = [
  {
    q: "How do you calculate the USDA funding fee?",
    a: `Multiply the loan amount by ${USDA_UPFRONT_FEE_RATE}% for the upfront fee: ${formatCurrency(ex.upfront)} on a ${formatCurrency(PRICE)} loan. For the annual fee, multiply the balance by ${USDA_ANNUAL_FEE_RATE}% and divide by 12: about ${formatCurrency(ex.firstMonthly)} a month in the first year.`,
  },
  {
    q: "Is the USDA funding fee the same as the guarantee fee?",
    a: "Yes. USDA officially calls it the guarantee fee. People often say \"funding fee\" because the VA's similar charge has that name. It's USDA's version of mortgage insurance.",
  },
  {
    q: `What is the USDA guarantee fee in ${LIMITS_YEAR}?`,
    a: `${USDA_UPFRONT_FEE_RATE}% of the loan up front and ${USDA_ANNUAL_FEE_RATE}% a year, paid monthly. USDA has kept these rates since October 2016.`,
  },
  {
    q: "Can the USDA guarantee fee be financed?",
    a: "Yes. Most buyers add the upfront fee to the loan, and USDA allows the loan to exceed the appraised value to do it. The annual fee is always paid monthly with your mortgage payment.",
  },
  {
    q: "Does the USDA annual fee ever go away?",
    a: "No. It lasts for the life of the loan, though it gets smaller each year as your balance falls. The only way to stop paying it is to refinance into a different loan type or pay the loan off.",
  },
];

const UsdaFundingFee = () => (
  <CalculatorPage
    path="/usda-funding-fee-calculator/"
    title={`USDA Funding Fee Calculator ${LIMITS_YEAR}: Guarantee Fee & Annual Fee`}
    description={`Calculate the USDA funding fee (guarantee fee) for ${LIMITS_YEAR}: the ${USDA_UPFRONT_FEE_RATE}% upfront fee, the ${USDA_ANNUAL_FEE_RATE}% annual fee by month and year, and what both add to your payment.`}
    heading="USDA Funding Fee Calculator"
    intro={
      <p>
        Enter a home price to see the USDA guarantee fee, often called the funding fee: the {USDA_UPFRONT_FEE_RATE}%
        upfront fee, the {USDA_ANNUAL_FEE_RATE}% annual fee you pay each month, and what they add to your payment.
      </p>
    }
    calculator={<UsdaFeeCalculator />}
    faqs={faqs}
    featureList={[
      `Upfront guarantee fee (${USDA_UPFRONT_FEE_RATE}%)`,
      `Annual fee (${USDA_ANNUAL_FEE_RATE}%) by month and by year`,
      "Financed or paid at closing",
      "Total fees over the life of the loan",
    ]}
  >
    <h2>How the USDA guarantee fee works</h2>
    <p>
      USDA guaranteed loans don't have PMI. Instead they charge two fees, which USDA uses to cover losses when
      borrowers default:
    </p>
    <ul>
      <li>
        <strong>Upfront fee: {USDA_UPFRONT_FEE_RATE}% of the loan</strong>, charged once at closing. Most buyers add it
        to the loan.
      </li>
      <li>
        <strong>Annual fee: {USDA_ANNUAL_FEE_RATE}% of the balance a year</strong>, split into 12 monthly payments and
        recalculated each year as you pay the loan down.
      </li>
    </ul>

    <h2>How to calculate the USDA funding fee</h2>
    <p>
      On a {formatCurrency(PRICE)} home with no down payment:
    </p>
    <ul>
      <li>
        Upfront: {formatCurrency(PRICE)} × {USDA_UPFRONT_FEE_RATE}% = <strong>{formatCurrency(ex.upfront)}</strong>.
        Financed, the loan becomes {formatCurrency(ex.loan)}.
      </li>
      <li>
        Annual: {formatCurrency(PRICE)} × {USDA_ANNUAL_FEE_RATE}% ÷ 12 = <strong>{formatCurrency(ex.firstMonthly)} a
        month</strong> in the first year, falling to {formatCurrency(ex.byYear[9].monthly)} by year 10.
      </li>
      <li>
        Over 30 years, the two fees total about <strong>{formatCurrency(ex.totalFees)}</strong>.
      </li>
    </ul>
    <p>
      On a $300,000 home the upfront fee is {formatCurrency(ex300.upfront)} and the annual fee starts at{" "}
      {formatCurrency(ex300.firstMonthly)} a month.
    </p>

    <h2>USDA fees vs. FHA and conventional mortgage insurance</h2>
    <p>
      USDA's fees are the lowest of the low-down-payment loans. FHA charges 1.75% up front and usually 0.55% a year (see
      the <Link to="/fha-mip-calculator/">FHA MIP calculator</Link>). Conventional PMI has no upfront charge and ends
      once you reach 22% equity, but it can cost more each month with fair credit. The catch with USDA is that the
      annual fee never ends.
    </p>
    <p>
      To see the fee in your full monthly payment with taxes and insurance, and how much home you qualify for, use the{" "}
      <Link to="/usda-loan-calculator/">USDA loan calculator</Link>. For income limits and eligibility rules, read{" "}
      <Link to="/guides/usda-loan-requirements-and-limits/">USDA loan requirements and limits</Link>.
    </p>

    <h2>Sources</h2>
    <ul className="hub-note">
      <li>
        <a href="https://www.rd.usda.gov/programs-services/single-family-housing-programs/single-family-housing-guaranteed-loan-program" target="_blank" rel="noopener noreferrer">
          USDA Rural Development: Single Family Housing Guaranteed Loan Program
        </a>
      </li>
      <li>
        <a href="https://www.rd.usda.gov/resources/directives/handbooks" target="_blank" rel="noopener noreferrer">
          USDA HB-1-3555, chapter 16 (guarantee fees)
        </a>
      </li>
    </ul>
  </CalculatorPage>
);

export default UsdaFundingFee;
