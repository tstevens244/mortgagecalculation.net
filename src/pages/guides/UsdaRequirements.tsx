import { Link } from "react-router-dom";
import GuidePage from "@/components/GuidePage";
import { formatCurrency } from "@/lib/formatters";
import { monthlyPayment, usdaMaxPrice } from "@/lib/mortgageMath";
import { LIMITS_YEAR, USDA_ANNUAL_FEE_RATE, USDA_UPFRONT_FEE_RATE } from "@/lib/loanLimits";

// Standard guaranteed-loan income limits (most counties), USDA Procedure Notice 657, July 2026.
const LIMIT_SMALL = 119_850;
const LIMIT_LARGE = 158_250;

const RATE = 6.5;
const TAX = 1;
const INSURANCE = 1500;

/** Price a household qualifies for at this income, with $400 of other monthly debts. */
const priceAt = (income: number) =>
  usdaMaxPrice({
    monthlyIncome: income / 12,
    monthlyDebts: 400,
    annualRatePercent: RATE,
    propertyTaxRatePercent: TAX,
    annualInsurance: INSURANCE,
    monthlyHoa: 0,
    upfrontFeePercent: USDA_UPFRONT_FEE_RATE,
    annualFeePercent: USDA_ANNUAL_FEE_RATE,
  });
const INCOMES = [50_000, 65_000, 80_000, 100_000, 119_850];

// Fee example on a $250,000 home with no down payment.
const PRICE = 250_000;
const upfront = (PRICE * USDA_UPFRONT_FEE_RATE) / 100;
const loan = PRICE + upfront;
const annualFeeMonthly = (PRICE * USDA_ANNUAL_FEE_RATE) / 100 / 12;
const pi = monthlyPayment(loan, RATE, 360);

const calcLink = `/usda-loan-calculator/?homePrice=${PRICE}&downPayment=0&downPaymentPercent=0&interestRate=${RATE}&loanTerm=30`;

const faqs = [
  {
    q: "Is there a maximum loan amount for a USDA loan?",
    a: "Not for USDA guaranteed loans, the kind most lenders offer. Your income and debt-to-income ratios set how much you can borrow. USDA direct loans, made by USDA itself to lower-income buyers, do have area loan limits.",
  },
  {
    q: "What are the USDA income limits for 2026?",
    a: `In most counties the guaranteed-loan limit is ${formatCurrency(LIMIT_SMALL)} for households of 1 to 4 people and ${formatCurrency(LIMIT_LARGE)} for 5 to 8 people. Higher-cost counties allow more. The limit counts income from every adult in the household, not just the borrowers.`,
  },
  {
    q: "How much is the USDA guarantee fee?",
    a: `${USDA_UPFRONT_FEE_RATE}% of the loan up front, which most buyers add to the loan, plus an annual fee of ${USDA_ANNUAL_FEE_RATE}% of the average balance, paid monthly for the life of the loan.`,
  },
  {
    q: "What credit score do I need for a USDA loan?",
    a: "USDA doesn't set a minimum, but most lenders want about 640 or higher for automatic approval through USDA's underwriting system. Lower scores may still qualify with manual underwriting and a strong payment history.",
  },
  {
    q: "Can I use a USDA loan in the suburbs?",
    a: "Often, yes. Eligible areas include many small towns and outer suburbs, not just farmland. Check a specific address on USDA's property eligibility map.",
  },
];

const UsdaRequirements = () => (
  <GuidePage
    slug="usda-loan-requirements-and-limits"
    metaTitle={`USDA Loan Limits and Requirements ${LIMITS_YEAR}: How Much You Can Borrow`}
    description={`USDA loan requirements for ${LIMITS_YEAR}: income limits of ${formatCurrency(LIMIT_SMALL)} in most counties, no loan maximum, a 1% upfront and 0.35% annual fee, and how much you can borrow by income.`}
    faqs={faqs}
    lead={
      <>
        <p>
          A USDA loan lets you buy a home in an eligible area with <strong>no down payment</strong>. There's no maximum
          loan amount for guaranteed USDA loans. Instead, <strong>your household income has to be under the area
          limit</strong> ({formatCurrency(LIMIT_SMALL)} in most counties for 1 to 4 people), and your payment has to fit
          within <strong>29% of your income</strong>.
        </p>
        <p>
          Here's what that means in dollars, what the fees cost, and how to check whether you and the property qualify.
        </p>
      </>
    }
  >
    <h2>USDA loan requirements at a glance</h2>
    <div className="hub-table-wrap">
      <table>
        <caption className="sr-only">USDA guaranteed loan requirements</caption>
        <thead>
          <tr>
            <th scope="col">Requirement</th>
            <th scope="col">USDA guaranteed loan</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">Down payment</th>
            <td data-label="USDA">None required</td>
          </tr>
          <tr>
            <th scope="row">Income limit (most counties)</th>
            <td data-label="USDA">
              {formatCurrency(LIMIT_SMALL)} for 1–4 people, {formatCurrency(LIMIT_LARGE)} for 5–8
            </td>
          </tr>
          <tr>
            <th scope="row">Maximum loan</th>
            <td data-label="USDA">None; set by your income and debts</td>
          </tr>
          <tr>
            <th scope="row">Debt-to-income</th>
            <td data-label="USDA">29% for housing, 41% for all debts (higher with strong compensating factors)</td>
          </tr>
          <tr>
            <th scope="row">Fees</th>
            <td data-label="USDA">
              {USDA_UPFRONT_FEE_RATE}% upfront guarantee fee + {USDA_ANNUAL_FEE_RATE}% a year
            </td>
          </tr>
          <tr>
            <th scope="row">Property</th>
            <td data-label="USDA">Primary residence in a USDA-eligible area</td>
          </tr>
          <tr>
            <th scope="row">Credit score</th>
            <td data-label="USDA">No USDA minimum; most lenders want about 640</td>
          </tr>
        </tbody>
      </table>
    </div>

    <h2>Is there a USDA loan limit?</h2>
    <p>
      Not for guaranteed loans, which are the USDA loans banks and mortgage lenders make. The cap is on your{" "}
      <strong>income</strong>, not the loan. USDA sets the limit at 115% of the area's median income, and it counts
      income from everyone in the household who's 18 or older, even people who won't be on the loan.
    </p>
    <p>
      In most counties the {LIMITS_YEAR} limits are {formatCurrency(LIMIT_SMALL)} for households of 1 to 4 people and{" "}
      {formatCurrency(LIMIT_LARGE)} for 5 to 8. Higher-cost areas allow more, and lenders subtract some
      amounts first, such as $480 for each child under 18 and qualifying child care costs, before comparing your
      income to the limit. Look up your county on{" "}
      <a href="https://eligibility.sc.egov.usda.gov/eligibility/welcomeAction.do" target="_blank" rel="noopener noreferrer">
        USDA's eligibility site
      </a>
      .
    </p>
    <p>
      USDA <em>direct</em> loans, which USDA makes itself to low- and very-low-income buyers, are different: they
      have lower income limits and a maximum loan amount for each area.
    </p>

    <h2>How much USDA loan can I qualify for?</h2>
    <p>
      Lenders cap your full payment (principal, interest, the annual fee, property tax and insurance) at 29% of your
      gross monthly income, and all your debts at 41%. Here's the home price that fits at different incomes, assuming
      a {RATE}% rate, {TAX}% property tax, {formatCurrency(INSURANCE)} a year of insurance and $400 a month of other
      debts:
    </p>
    <div className="hub-table-wrap">
      <table>
        <caption className="sr-only">USDA home price by household income</caption>
        <thead>
          <tr>
            <th scope="col">Household income</th>
            <th scope="col">Max payment</th>
            <th scope="col">Home price</th>
          </tr>
        </thead>
        <tbody>
          {INCOMES.map((income) => {
            const r = priceAt(income);
            return (
              <tr key={income}>
                <th scope="row">{formatCurrency(income)}</th>
                <td data-label="Max payment">{formatCurrency(r.maxPayment)}/mo</td>
                <td data-label="Home price">{formatCurrency(Math.floor(r.price / 1000) * 1000)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
    <p className="hub-note">
      Once your other debts are more than 12% of your gross income (the gap between 41% and 29%), the total-debt limit
      takes over and the price drops: every $100 of monthly debt then costs about{" "}
      {formatCurrency(Math.round(100 / (monthlyPayment(1 + USDA_UPFRONT_FEE_RATE / 100, RATE, 360) + (USDA_ANNUAL_FEE_RATE + TAX) / 100 / 12) / 100) * 100)}{" "}
      of home price at these rates. Enter your own numbers in the qualifier on the{" "}
      <Link to="/usda-loan-calculator/">USDA loan calculator</Link>.
    </p>

    <h2>How to calculate the USDA guarantee fee</h2>
    <p>
      USDA charges two fees instead of mortgage insurance. People often call them the "USDA funding fee," but the
      official name is the guarantee fee:
    </p>
    <ul>
      <li>
        <strong>Upfront fee: {USDA_UPFRONT_FEE_RATE}% of the loan.</strong> On a {formatCurrency(PRICE)} home that's{" "}
        {formatCurrency(upfront)}. Most buyers add it to the loan, making it {formatCurrency(loan)}.
      </li>
      <li>
        <strong>Annual fee: {USDA_ANNUAL_FEE_RATE}% of the average balance</strong>, paid monthly. In the first year
        that's about {formatCurrency(annualFeeMonthly)} a month, and it shrinks as you pay the loan down.
      </li>
    </ul>
    <p>
      At {RATE}% for 30 years, principal and interest on that {formatCurrency(loan)} loan is {formatCurrency(pi)} a
      month, so the payment before taxes and insurance is about {formatCurrency(pi + annualFeeMonthly)}.{" "}
      <Link to={calcLink}>See this example in the USDA calculator</Link>, or work out the fees for your own loan with
      the <Link to="/usda-funding-fee-calculator/">USDA funding fee calculator</Link>.
    </p>
    <p>
      Compared with FHA, the USDA annual fee is lower (FHA's is usually 0.55%) and the upfront fee is smaller (FHA's is
      1.75%). Unlike conventional PMI, though, the USDA fee lasts for the life of the loan.
    </p>

    <h2>Which homes qualify</h2>
    <ul>
      <li>
        <strong>Location:</strong> the property must be in a USDA-eligible area. That includes many small towns and
        outer suburbs. Check the exact address on the{" "}
        <a href="https://eligibility.sc.egov.usda.gov/eligibility/welcomeAction.do?pageAction=sfp" target="_blank" rel="noopener noreferrer">
          property eligibility map
        </a>
        , because boundaries can split neighborhoods.
      </li>
      <li>
        <strong>Use:</strong> it has to be your primary residence. No vacation homes or rentals.
      </li>
      <li>
        <strong>Condition:</strong> it must be safe and sound. Most single-family homes, condos in approved projects and
        some manufactured homes qualify.
      </li>
    </ul>

    <h2>USDA vs. FHA vs. conventional</h2>
    <p>
      If you qualify for USDA, it's usually the cheapest low-down-payment option: no down payment and lower fees than
      FHA. Its limits are the location and income caps. If you earn too much or the home isn't in an eligible area, an
      FHA loan (3.5% down) or a conventional loan (3% to 5% down) is the usual alternative. Compare them in the{" "}
      <Link to="/fha-vs-conventional-calculator/">FHA vs. conventional calculator</Link>.
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
          USDA HB-1-3555, the guaranteed loan program handbook
        </a>
      </li>
      <li>
        <a href="https://eligibility.sc.egov.usda.gov/eligibility/welcomeAction.do" target="_blank" rel="noopener noreferrer">
          USDA income and property eligibility site
        </a>
      </li>
    </ul>
  </GuidePage>
);

export default UsdaRequirements;
