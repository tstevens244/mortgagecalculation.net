import { HOME_VALUES, formatValueMonth } from "@/lib/localCosts";
import { INSURANCE_DATA_YEAR, STATE_DATA_YEAR } from "@/lib/states";
import { INSURANCE_SOURCE, TAX_SOURCE } from "@/components/calc/LocalValue";
import { FIGURES_UPDATED } from "@/lib/figuresDate";
import { Link } from "react-router-dom";
import { MARKET_RATES, formatSurveyDate } from "@/lib/marketRates";
import { CREDIT_TIERS, pmiRate } from "@/lib/pmi";
import InfoPage from "@/components/InfoPage";
import { formatCurrency } from "@/lib/formatters";
import {
  CONFORMING_LIMIT,
  CONFORMING_LIMIT_HIGH_COST,
  FHA_LIMIT_CEILING,
  FHA_LIMIT_FLOOR,
  FHA_MIP_LARGE_LOAN_THRESHOLD,
  FHA_UPFRONT_MIP_RATE,
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
    updated={FIGURES_UPDATED}
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
      With less than 20% down, the <Link to="/">mortgage calculator</Link> estimates private mortgage insurance from
      your down payment and credit score range, using typical borrower-paid monthly rates for a 30-year fixed loan
      with standard coverage:
    </p>
    <div className="hub-table-wrap">
      <table>
        <caption className="sr-only">Typical annual PMI rates by credit score and down payment</caption>
        <thead>
          <tr>
            <th scope="col">Credit score</th>
            <th scope="col">15%+ down</th>
            <th scope="col">10%–14.99%</th>
            <th scope="col">5%–9.99%</th>
            <th scope="col">3%–4.99%</th>
          </tr>
        </thead>
        <tbody>
          {CREDIT_TIERS.map((t) => (
            <tr key={t.min}>
              <th scope="row">{t.label}</th>
              {[85, 90, 95, 97].map((ltv) => (
                <td key={ltv} data-label={`${100 - ltv}% down`}>
                  {pmiRate(ltv, t.min).toFixed(2)}%
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <p>
      These come from the published rate cards of the large mortgage insurers and are estimates: actual quotes vary by
      insurer, loan size and debt-to-income ratio. You can enter your own figure. Lenders must cancel PMI automatically
      when the balance is scheduled to reach 78% of the original home value.
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

    <h2>Today's average rates</h2>
    <p>
      "Use avg." under each interest rate fills in the national average from{" "}
      <a href={MARKET_RATES.sourceUrl} target="_blank" rel="noopener noreferrer">
        Freddie Mac's Primary Mortgage Market Survey
      </a>
      , which reports 30-year and 15-year fixed rates every week for borrowers with strong credit and 20% down. For 20-
      and 25-year terms we interpolate between the two. The latest survey we use is from the week of{" "}
      {formatSurveyDate(MARKET_RATES.asOf)}: {MARKET_RATES.rate30.toFixed(2)}% for 30 years and{" "}
      {MARKET_RATES.rate15.toFixed(2)}% for 15. The site rebuilds automatically each week after Freddie Mac publishes.
    </p>

    <h2>Local home prices, taxes and insurance</h2>
    <p>
      Each calculator starts with figures for your state, found from your approximate location (you can pick another
      state under the home price field or on the home page):
    </p>
    <ul>
      <li>
        <strong>Home price:</strong> the{" "}
        <a href={HOME_VALUES.sourceUrl} target="_blank" rel="noopener noreferrer">
          Zillow Home Value Index
        </a>{" "}
        for the state, {formatValueMonth(HOME_VALUES.asOf)}. Most calculators use the typical home value (the middle
        third of homes). USDA uses the entry-level value (the bottom third), since USDA loans are for modest homes in
        rural areas. FHA uses the typical value, capped so the loan fits under the FHA limit most counties use. Jumbo
        uses the upper-tier value (the top third), raised where needed so the loan is at least 15% above the
        conforming limit, since a smaller loan wouldn't be a jumbo loan. Refinance and equity calculators use the
        typical value as your home's value, and loan comparisons use 80% of it as the loan amount.
      </li>
      <li>
        <strong>Property tax:</strong> the state's effective rate (taxes paid as a share of home value) from the{" "}
        <a href={TAX_SOURCE.href} target="_blank" rel="noopener noreferrer">
          Tax Foundation
        </a>
        , based on Census data for {STATE_DATA_YEAR}.
      </li>
      <li>
        <strong>Home insurance:</strong> the state's average HO-3 premium from the{" "}
        <a href={INSURANCE_SOURCE.href} target="_blank" rel="noopener noreferrer">
          NAIC
        </a>{" "}
        ({INSURANCE_DATA_YEAR} data), divided by the state's median home value to get a rate, so a pricier home gets a
        higher premium.
      </li>
      <li>
        <strong>PMI</strong> isn't regional: it comes from your down payment and credit score (see above).{" "}
        <strong>HOA dues</strong> depend on the property, so they start at $0.
      </li>
    </ul>
    <p>
      A link with its own numbers always opens with those numbers. Home values refresh weekly along with rates
      (Zillow publishes monthly); tax rates and insurance premiums are updated once a year.
    </p>

    <h2>Closing costs</h2>
    <p>
      The <Link to="/closing-cost-calculator/">closing cost calculator</Link> and the mortgage calculator's cash to close
      tab follow the sections of the CFPB's Loan Estimate. Unless you change them, they assume a 0.75% origination fee,
      $800 for the appraisal and other required services, lender's title and settlement of 0.5% of the loan plus $800,
      $250 of recording fees, no transfer tax, 15 days of prepaid interest, the first year of homeowners insurance, and
      escrow deposits of 3 months of property tax and 2 months of insurance.
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
      <li>
        Interest rates default to this week's national average where one applies. Your rate depends on your credit,
        down payment, loan type and points, so enter a rate you've been quoted for an accurate result.
      </li>
      <li>Taxes and insurance are estimates. Both vary widely by location and property.</li>
      <li>County-specific FHA and conforming limits can be lower or higher than the national figures above.</li>
    </ul>

    <h2>Keeping figures current</h2>
    <p>
      Loan limits and fee schedules live in one file in our code, so every calculator and guide updates together. We
      review them each year when FHFA and HUD publish new limits (usually late November) and whenever an agency
      changes a fee. Average rates and home values refresh automatically every week, and the date at the top of this
      page (and under each calculator) moves forward when they do.
    </p>
    <p>
      Found an error? See the <Link to="/about/">About page</Link> for how to reach us.
    </p>
  </InfoPage>
);

export default Methodology;
