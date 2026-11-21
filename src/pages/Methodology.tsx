import { Link } from "react-router-dom";
import InfoPage from "@/components/InfoPage";
import { formatCurrency } from "@/lib/formatters";
import {
  CONFORMING_LIMIT,
  CONFORMING_LIMIT_HIGH_COST,
  FHA_LIMIT_CEILING,
  FHA_LIMIT_FLOOR,
  FHA_MIP_LARGE_LOAN_THRESHOLD,
  FHA_UPFRONT_MIP_RATE,
  FIGURES_REVIEWED,
  LIMITS_YEAR,
  USDA_ANNUAL_FEE_RATE,
  USDA_UPFRONT_FEE_RATE,
} from "@/lib/loanLimits";

const Methodology = () => (
  <InfoPage
    path="/methodology/"
    title="How Our Mortgage Calculators Work | Formulas & Sources"
    description="The formulas, assumptions and official sources behind every MortgageCalculation.net calculator, including 2026 loan limits, FHA MIP, VA funding fee and USDA fees."
    heading="How our calculators work"
    updated={FIGURES_REVIEWED}
    breadcrumbName="Methodology"
  >
    <p>
      Every calculator on this site runs in your browser using standard mortgage math. Nothing you type is sent to
      us. This page explains the formulas, the program rules we apply and where those rules come from, so you can
      check any result yourself.
    </p>

    <h2>The monthly payment formula</h2>
    <p>Principal and interest on a fixed-rate loan use the standard amortization formula:</p>
    <p>
      <strong>M = P × r(1 + r)<sup>n</sup> ÷ [(1 + r)<sup>n</sup> − 1]</strong>
    </p>
    <p>
      where <em>P</em> is the loan amount, <em>r</em> is the annual rate divided by 12, and <em>n</em> is the number of
      monthly payments. The amortization schedule applies each payment to interest on the current balance first and
      the rest to principal.
    </p>
    <p>
      The total monthly payment adds one-twelfth of annual property tax and homeowners insurance, monthly HOA dues,
      and mortgage insurance where it applies. That total is often called PITI (principal, interest, taxes and
      insurance).
    </p>

    <h2>{LIMITS_YEAR} loan limits</h2>
    <ul>
      <li>
        <strong>Conforming limit:</strong> {formatCurrency(CONFORMING_LIMIT)} for a one-unit home in most counties, up
        to {formatCurrency(CONFORMING_LIMIT_HIGH_COST)} in high-cost areas. Loans above the limit for your county are
        jumbo loans. Source: Federal Housing Finance Agency (FHFA).
      </li>
      <li>
        <strong>FHA limits:</strong> from {formatCurrency(FHA_LIMIT_FLOOR)} (floor) to{" "}
        {formatCurrency(FHA_LIMIT_CEILING)} (ceiling) for a one-unit home, depending on the county. Source: U.S.
        Department of Housing and Urban Development (HUD).
      </li>
      <li>
        <strong>VA loans:</strong> borrowers with full entitlement have no VA loan limit, though lenders set their own
        maximums.
      </li>
    </ul>

    <h2>Mortgage insurance and program fees</h2>
    <h3>Conventional PMI</h3>
    <p>
      With less than 20% down, the{" "}
      <Link to="/">mortgage calculator</Link> estimates private mortgage insurance at 0.5% of the loan amount per year.
      Real PMI rates depend mainly on credit score and down payment and usually fall between about 0.3% and 1.5%.
      You can enter your own figure. Lenders must cancel PMI automatically when the balance reaches 78% of the
      original home value.
    </p>
    <h3>FHA mortgage insurance (MIP)</h3>
    <ul>
      <li>Upfront MIP: {FHA_UPFRONT_MIP_RATE}% of the base loan amount, added to the loan.</li>
      <li>
        Annual MIP for terms over 15 years: 0.50% with 5% or more down, 0.55% with less (0.70% and 0.75% for base
        loans above {formatCurrency(FHA_MIP_LARGE_LOAN_THRESHOLD)}).
      </li>
      <li>Annual MIP for terms of 15 years or less: 0.15% with 10% or more down, 0.40% with less (higher for large loans).</li>
      <li>Annual MIP lasts 11 years with 10% or more down, and the life of the loan with less.</li>
    </ul>
    <p>Source: HUD Mortgagee Letter 2023-05.</p>

    <h3>VA funding fee</h3>
    <p>For purchase loans, by down payment:</p>
    <ul>
      <li>Less than 5% down: 2.15% for first use, 3.3% for later use.</li>
      <li>5% to 9.99% down: 1.5%.</li>
      <li>10% or more down: 1.25%.</li>
    </ul>
    <p>
      Veterans receiving compensation for a service-connected disability, and some surviving spouses and Purple Heart
      recipients, are exempt. Since 2020 the same rates apply to Reserves and National Guard members. Source: U.S.
      Department of Veterans Affairs.
    </p>

    <h3>USDA guarantee fees</h3>
    <p>
      {USDA_UPFRONT_FEE_RATE}% upfront, usually financed, and {USDA_ANNUAL_FEE_RATE}% of the balance per year, paid
      monthly. Source: USDA Rural Development.
    </p>

    <h2>How each calculator decides</h2>
    <ul>
      <li>
        <strong><Link to="/house-affordability/">Affordability</Link>:</strong> finds the highest home price whose
        payment fits both debt-to-income limits you choose (28% of gross income for housing and 36% for all debts by
        default).
      </li>
      <li>
        <strong><Link to="/mortgage-qualification-calculator/">Qualification</Link>:</strong> works the other way,
        from a home price to the income needed under the same limits.
      </li>
      <li>
        <strong><Link to="/refinance-calculator/">Refinance</Link>:</strong> compares interest on the current and new
        loans over the years you expect to keep the home, subtracts closing costs and any lost mortgage-interest
        deduction, and reports the break-even month: the first month when the interest saved (after any lost
        deduction) has covered the closing costs. That counts the effect of restarting the term, which a simple
        "closing costs divided by monthly savings" estimate misses.
      </li>
      <li>
        <strong><Link to="/cash-out-refinance-calculator/">Cash-out refinance</Link>:</strong> caps the new loan at 80%
        of the home's value, the usual limit for conventional cash-out loans.
      </li>
      <li>
        <strong><Link to="/heloc-calculator/">HELOC</Link>:</strong> estimates the credit line as the combined
        loan-to-value limit you choose (85% by default) minus your mortgage balance, then shows interest-only payments
        during the draw period and amortizing payments during repayment.
      </li>
      <li>
        <strong><Link to="/adjustable-rate-mortgage-calculator/">ARM</Link>:</strong> uses the initial rate for the
        fixed period, then applies the rate changes you expect, within the lifetime cap, recalculating the
        payment at each change. It also shows the worst case: the rate jumping to the cap at the first adjustment.
      </li>
      <li>
        <strong><Link to="/bi-weekly-mortgage-payments-calculator/">Bi-weekly</Link>:</strong> pays half the monthly
        payment every two weeks (26 half-payments, or 13 full payments, a year).
      </li>
      <li>
        <strong><Link to="/rent-or-buy/">Rent or buy</Link>:</strong> compares the net cost of owning (down
        payment, closing costs, mortgage payments, PMI, taxes, insurance and maintenance, plus the investment return
        the down payment and closing costs could have earned, less tax savings and the cash you'd get back from the sale after selling costs and the loan payoff) against
        rent that rises each year. The break-even chart reruns that comparison for every year you might sell.
      </li>
    </ul>

    <h2>Tax deductions</h2>
    <p>
      Mortgage interest only lowers your taxes if you itemize deductions, and most homeowners take the standard
      deduction instead. Calculators that include a tax rate default it to 0%. Enter your marginal rate only if you
      itemize. HELOC interest used to pay off other debts is never deductible.
    </p>

    <h2>What the calculators don't do</h2>
    <ul>
      <li>They don't check your credit, verify income or offer a loan. A lender's Loan Estimate is the official figure.</li>
      <li>Interest rates default to an example rate. Enter a rate you've been quoted for an accurate result.</li>
      <li>Taxes and insurance are estimates. Both vary widely by location and property.</li>
      <li>County-specific FHA and conforming limits can be lower or higher than the national figures above.</li>
    </ul>

    <h2>Keeping figures current</h2>
    <p>
      Loan limits and fee schedules live in one file in our code, so every calculator and guide updates together. We
      review them each year when FHFA and HUD publish new limits (usually late November) and whenever an agency
      changes a fee. The figures on this site were last reviewed on the date shown at the top of this page.
    </p>
    <p>
      Found an error? See the <Link to="/about/">About page</Link> for how to reach us.
    </p>
  </InfoPage>
);

export default Methodology;
