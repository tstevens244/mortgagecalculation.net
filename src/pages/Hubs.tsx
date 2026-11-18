import { ReactNode } from "react";
import { Link } from "react-router-dom";
import CategoryHub, { type HubContent } from "@/components/CategoryHub";
import { formatCurrency } from "@/lib/formatters";
import { monthlyPayment, monthsToPayoff, totalPaidOnBalance } from "@/lib/mortgageMath";
import {
  CONFORMING_LIMIT,
  CONFORMING_LIMIT_HIGH_COST,
  FHA_UPFRONT_MIP_RATE,
  LIMITS_YEAR,
  USDA_ANNUAL_FEE_RATE,
  USDA_UPFRONT_FEE_RATE,
  fhaAnnualMipRate,
  vaFundingFeeRate,
} from "@/lib/loanLimits";

interface HubTableProps {
  caption: string;
  columns: string[];
  rows: { key: string; head: ReactNode; cells: ReactNode[] }[];
}

/** Comparison table. Each row turns into a labeled card on phones (see .hub-table-wrap in index.css). */
const HubTable = ({ caption, columns, rows }: HubTableProps) => (
  <div className="hub-table-wrap">
    <table>
      <caption className="sr-only">{caption}</caption>
      <thead>
        <tr>
          {columns.map((c) => (
            <th key={c} scope="col">
              {c}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.key}>
            <th scope="row">{r.head}</th>
            {r.cells.map((cell, i) => (
              <td key={columns[i + 1]} data-label={columns[i + 1]}>
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const yearsAndMonths = (months: number) => {
  const y = Math.floor(months / 12);
  const m = months % 12;
  const parts = [y ? `${y} year${y === 1 ? "" : "s"}` : "", m ? `${m} month${m === 1 ? "" : "s"}` : ""];
  return parts.filter(Boolean).join(" ");
};

// ---------------------------------------------------------------------------
// Buying a home
// ---------------------------------------------------------------------------

const buying: HubContent = {
  title: "Home Buying Calculators: Payment, Affordability & Rent vs. Buy",
  description:
    "Free home buying calculators: how much house you can afford, your full monthly payment, the income you need to qualify, and whether buying beats renting.",
  intro: (
    <p>
      Buying a home comes down to three questions: how much can you afford, what will it cost each month, and is it
      better than renting? Each calculator below answers one of them.
    </p>
  ),
  useWhen: {
    "/": "You have a price in mind and want the full monthly payment, including taxes, insurance and PMI.",
    "/house-affordability/": "You're just starting and want a price range from your income, debts and savings.",
    "/mortgage-qualification-calculator/": "You've found a home and want to know the income a lender will expect.",
    "/rent-or-buy/": "You're not sure buying beats renting over the years you expect to stay.",
  },
  body: (
    <>
      <h2>Use them in this order</h2>
      <ol>
        <li>
          <strong>Set your budget.</strong> The <Link to="/house-affordability/">affordability calculator</Link> turns
          your income and debts into a maximum price, using the same debt-to-income limits lenders use.
        </li>
        <li>
          <strong>Check that buying makes sense.</strong> <Link to="/rent-or-buy/">Rent or buy</Link> compares the full
          cost of each, including closing costs, maintenance and the return your down payment could earn elsewhere.
        </li>
        <li>
          <strong>Pick a loan type.</strong> FHA, VA, USDA and conventional loans have different down payments and
          mortgage insurance. <Link to="/mortgage-loan-types/">Compare mortgage loan types</Link>.
        </li>
        <li>
          <strong>Price specific homes.</strong> The <Link to="/">mortgage calculator</Link> gives the monthly payment
          for a listing, with property tax, insurance, PMI and HOA. The{" "}
          <Link to="/mortgage-calculator-by-state/">state mortgage calculators</Link> fill in your state's and county's
          tax rate and average insurance.
        </li>
        <li>
          <strong>Confirm you qualify.</strong> The{" "}
          <Link to="/mortgage-qualification-calculator/">qualification calculator</Link> shows the income needed for
          that home.
        </li>
      </ol>

      <h2>What's in a monthly mortgage payment</h2>
      <p>Lenders call the full payment PITI, and they count all of it when deciding what you can borrow.</p>
      <ul>
        <li>
          <strong>Principal and interest:</strong> the loan payment itself, set by the loan amount, rate and term.
        </li>
        <li>
          <strong>Property tax:</strong> usually 0.3% to 2.5% of the home's value a year, depending on the state.
        </li>
        <li>
          <strong>Homeowners insurance:</strong> required by every lender.
        </li>
        <li>
          <strong>Mortgage insurance:</strong> PMI on conventional loans with less than 20% down, or MIP on FHA loans.
        </li>
        <li>
          <strong>HOA dues:</strong> if the home is in a homeowners association. Lenders count them too.
        </li>
      </ul>
    </>
  ),
  faqs: [
    {
      q: "How much house can I afford?",
      a: "A common guideline is to keep your housing payment at or below 28% of your gross monthly income and all your debt payments, including the mortgage, at or below 36%. Many lenders approve up to 43%, and some conventional and FHA loans go to 50% with strong credit or savings. The affordability calculator applies these limits to your numbers.",
    },
    {
      q: "How much do I need for a down payment?",
      a: "As little as 3% on some conventional loans, 3.5% on an FHA loan with a 580+ credit score, and 0% on VA and USDA loans. With a conventional loan and less than 20% down, you'll pay private mortgage insurance until you reach 20% equity.",
    },
    {
      q: "What credit score do I need to buy a house?",
      a: "Usually 620 for a conventional loan and 580 for an FHA loan with 3.5% down (500 to 579 needs 10% down). VA and USDA set no official minimum, but most lenders look for about 620 for VA and 640 for USDA. A higher score gets a lower rate.",
    },
    {
      q: "How much are closing costs?",
      a: "Buyers typically pay 2% to 5% of the purchase price in closing costs, on top of the down payment. They cover lender fees, appraisal, title insurance, recording fees and prepaid taxes and insurance. Your lender's Loan Estimate lists them.",
    },
  ],
};

// ---------------------------------------------------------------------------
// Loan types
// ---------------------------------------------------------------------------

const fhaMipLow = fhaAnnualMipRate(15, 78, 300_000);
const fhaMipHigh = fhaAnnualMipRate(30, 97, 800_000);
const vaFeeLow = vaFundingFeeRate(true, 10, false);
const vaFeeHigh = vaFundingFeeRate(false, 0, false);

const loanRows = [
  {
    name: "Conventional",
    to: "/conventional-mortgage-calculator/",
    down: "3%",
    credit: "620",
    insurance: "PMI under 20% down. Ends automatically at 78% loan-to-value; you can ask to drop it at 80%.",
    bestFor: "Good credit, with 3% to 20% down",
  },
  {
    name: "FHA",
    to: "/fha-loan-calculator/",
    down: "3.5% (10% with a 500–579 score)",
    credit: "580",
    insurance: `${FHA_UPFRONT_MIP_RATE}% upfront plus ${fhaMipLow}%–${fhaMipHigh}% a year. Lasts 11 years with 10%+ down, otherwise the life of the loan.`,
    bestFor: "Lower credit scores or a small down payment",
  },
  {
    name: "VA",
    to: "/va-loan-calculator/",
    down: "0%",
    credit: "No VA minimum; lenders often want 620",
    insurance: `None monthly. One-time funding fee of ${vaFeeLow}%–${vaFeeHigh}%, waived with a service-connected disability.`,
    bestFor: "Veterans, service members and eligible spouses",
  },
  {
    name: "USDA",
    to: "/usda-loan-calculator/",
    down: "0%",
    credit: "No USDA minimum; lenders often want 640",
    insurance: `${USDA_UPFRONT_FEE_RATE}% upfront plus ${USDA_ANNUAL_FEE_RATE}% a year.`,
    bestFor: "Moderate incomes in eligible rural and suburban areas",
  },
  {
    name: "Jumbo",
    to: "/jumbo-loan-calculator/",
    down: "Often 10%–20%",
    credit: "Often 700+",
    insurance: "Usually none; lenders ask for more down and cash reserves instead.",
    bestFor: `Loans above ${formatCurrency(CONFORMING_LIMIT)} (${formatCurrency(CONFORMING_LIMIT_HIGH_COST)} in high-cost areas)`,
  },
  {
    name: "Adjustable-rate (ARM)",
    to: "/adjustable-rate-mortgage-calculator/",
    down: "Same as the loan program",
    credit: "Same as the loan program",
    insurance: "Same as the loan program.",
    bestFor: "Selling or refinancing before the fixed period ends",
  },
];

const loanTypes: HubContent = {
  title: `Mortgage Loan Types Compared: FHA vs. VA vs. USDA vs. Conventional (${LIMITS_YEAR})`,
  description: `Compare FHA, VA, USDA, conventional, jumbo and adjustable-rate mortgages side by side: down payment, credit score and mortgage insurance, with a calculator for each using ${LIMITS_YEAR} limits.`,
  intro: (
    <p>
      Each loan program has its own down payment, credit requirements and mortgage insurance, so the same house can
      cost hundreds of dollars a month more or less. Compare them below, then run the numbers with each program's
      calculator.
    </p>
  ),
  useWhen: {
    "/conventional-mortgage-calculator/": "Your credit is 620+ and you want PMI that eventually goes away.",
    "/fha-loan-calculator/": "Your credit score is under about 680 or you have a small down payment.",
    "/va-loan-calculator/": "You're a veteran, service member or eligible surviving spouse.",
    "/usda-loan-calculator/": "You're buying outside a big city and your income is within USDA limits.",
    "/jumbo-loan-calculator/": `Your loan is over ${formatCurrency(CONFORMING_LIMIT)}, or ${formatCurrency(CONFORMING_LIMIT_HIGH_COST)} in a high-cost county.`,
    "/adjustable-rate-mortgage-calculator/": "You'll likely move or refinance within 5 to 10 years.",
  },
  body: (
    <>
      <h2>Mortgage loan types side by side</h2>
      <HubTable
        caption="Comparison of mortgage loan types"
        columns={["Loan", "Minimum down", "Typical credit score", "Mortgage insurance", "Best for"]}
        rows={loanRows.map((r) => ({
          key: r.name,
          head: <Link to={r.to}>{r.name}</Link>,
          cells: [r.down, r.credit, r.insurance, r.bestFor],
        }))}
      />
      <p className="hub-note">
        Figures are for {LIMITS_YEAR} one-unit homes. Lenders can set stricter credit and down payment rules than the
        program minimums.
      </p>

      <h2>How to choose</h2>
      <ul>
        <li>
          <strong>Eligible for VA?</strong> It's usually the cheapest option: no down payment and no monthly mortgage
          insurance.
        </li>
        <li>
          <strong>Credit score 700 or higher?</strong> Conventional is usually cheaper than FHA, because PMI is priced
          on your credit and ends at 78% loan-to-value.
        </li>
        <li>
          <strong>Credit score under about 680, or little saved?</strong> FHA often costs less, since its mortgage
          insurance doesn't rise as your score falls.
        </li>
        <li>
          <strong>Buying in a small town or rural area?</strong> Check USDA eligibility for a 0% down loan with low
          annual fees.
        </li>
        <li>
          <strong>Borrowing more than the conforming limit?</strong> You'll need a jumbo loan, or a larger down payment
          to stay under the limit.
        </li>
      </ul>
      <p>
        The surest way to decide is to run the same home price through two calculators and compare the monthly
        payment and total cost.
      </p>

      <h2>Fixed or adjustable rate?</h2>
      <p>
        Any of these programs can come with a fixed rate, which keeps the same principal and interest payment for the
        whole loan, or an adjustable rate, which is fixed for 5, 7 or 10 years and then changes with the market. An
        ARM usually starts lower, so it can save money if you'll sell or refinance before the fixed period ends. The{" "}
        <Link to="/adjustable-rate-mortgage-calculator/">ARM calculator</Link> shows your payment after the first
        adjustment and in the worst case.
      </p>
    </>
  ),
  faqs: [
    {
      q: "Which mortgage has the lowest down payment?",
      a: "VA and USDA loans require no down payment. Among other loans, some conventional programs allow 3% down and FHA allows 3.5% with a credit score of 580 or higher.",
    },
    {
      q: "Is an FHA or conventional loan cheaper?",
      a: "With a credit score around 700 or higher and at least 5% down, a conventional loan is usually cheaper, because PMI is priced on your credit and can be removed. With a lower score, FHA is often cheaper. FHA's annual mortgage insurance lasts the life of the loan if you put down less than 10%.",
    },
    {
      q: `What is the conforming loan limit for ${LIMITS_YEAR}?`,
      a: `${formatCurrency(CONFORMING_LIMIT)} for a one-unit home in most of the country, and up to ${formatCurrency(CONFORMING_LIMIT_HIGH_COST)} in high-cost areas. Loans above the limit for your county are jumbo loans.`,
    },
    {
      q: "Can I use a VA loan more than once?",
      a: `Yes. You can use your VA benefit again after selling or paying off the earlier loan, and sometimes while you still have it. The funding fee is higher on later use with less than 5% down: ${vaFeeHigh}% instead of ${vaFundingFeeRate(true, 0, false)}%.`,
    },
  ],
};

// ---------------------------------------------------------------------------
// Refinance & home equity
// ---------------------------------------------------------------------------

const equityRows = [
  {
    name: "Rate-and-term refinance",
    to: "/refinance-calculator/",
    how: "Replaces your loan with a new rate or term. No cash out.",
    first: "Replaced",
    rate: "Fixed or adjustable",
    best: "The new rate is clearly lower and you'll stay past the break-even point",
  },
  {
    name: "Cash-out refinance",
    to: "/cash-out-refinance-calculator/",
    how: "A new, larger loan pays off the old one; you get the difference in cash. Usually up to 80% of the home's value.",
    first: "Replaced",
    rate: "Usually fixed",
    best: "You need a lump sum and the new rate isn't higher than your current one",
  },
  {
    name: "HELOC",
    to: "/heloc-calculator/",
    how: "A credit line you draw from as needed. Usually up to 80%–85% of the value, minus your mortgage.",
    first: "Kept",
    rate: "Usually variable",
    best: "Costs spread over time, or keeping a low first-mortgage rate",
  },
  {
    name: "Second mortgage (piggyback)",
    to: "/second-mortgage-calculator/",
    how: "A second loan at purchase covers part of the down payment, such as 80-10-10.",
    first: "Kept",
    rate: "Fixed or variable",
    best: "Avoiding PMI when you have less than 20% down",
  },
];

const equity: HubContent = {
  title: "Refinance & Home Equity Calculators: Refinance, Cash-Out, HELOC",
  description:
    "Free refinance and home equity calculators: refinance savings and break-even, cash-out limits, HELOC payments, HELOC debt consolidation and piggyback second mortgages.",
  intro: (
    <p>
      Lower your rate, shorten your loan, or borrow against the equity you've built. Compare the options below, then
      check the numbers for your home.
    </p>
  ),
  useWhen: {
    "/refinance-calculator/": "Rates have dropped and you want your monthly savings and break-even point.",
    "/cash-out-refinance-calculator/": "You want a lump sum and to replace your current mortgage.",
    "/heloc-calculator/": "You want a credit line and to keep your current mortgage rate.",
    "/heloc-debt-consolidation-calculator/": "You're weighing a HELOC to pay off credit cards or other debts.",
    "/second-mortgage-calculator/": "You're buying with less than 20% down and want to compare a piggyback loan with PMI.",
  },
  body: (
    <>
      <h2>Your options compared</h2>
      <HubTable
        caption="Comparison of refinance and home equity options"
        columns={["Option", "How it works", "Your first mortgage", "Rate", "Best when"]}
        rows={equityRows.map((r) => ({
          key: r.name,
          head: <Link to={r.to}>{r.name}</Link>,
          cells: [r.how, r.first, r.rate, r.best],
        }))}
      />

      <h2>How much equity can you use?</h2>
      <p>
        Your equity is your home's value minus what you owe. Lenders let you borrow only part of it, set by a
        loan-to-value limit:
      </p>
      <p>
        <strong>Amount you can borrow = home value × limit − mortgage balance</strong>
      </p>
      <p>
        For a $450,000 home with a $250,000 mortgage, you have $200,000 in equity. A cash-out refinance at 80% gives up
        to $450,000 × 0.80 − $250,000 = <strong>$110,000</strong>, before closing costs. A HELOC at 85% gives up to{" "}
        <strong>$132,500</strong>.
      </p>

      <h2>When does refinancing pay off?</h2>
      <p>
        Divide your closing costs by your monthly savings to get the break-even point. With $6,000 in costs and a
        payment $200 lower, you break even after 30 months. If you'll keep the loan longer than that, the refinance
        saves money. Starting a new 30-year loan also stretches out your payoff, so compare total interest too. The{" "}
        <Link to="/refinance-calculator/">refinance calculator</Link> shows both.
      </p>
    </>
  ),
  faqs: [
    {
      q: "When is it worth refinancing?",
      a: "When you'll keep the new loan past the break-even point, which is your closing costs divided by your monthly savings. A lower rate usually pays off within 2 to 4 years. Compare total interest too, since restarting a 30-year term can cost more overall even with a lower payment.",
    },
    {
      q: "How much cash can I take out of my home?",
      a: "Most lenders let a cash-out refinance reach 80% of your home's value, minus your current balance and any closing costs rolled into the loan. VA cash-out loans can go higher for eligible borrowers.",
    },
    {
      q: "Is a HELOC or a cash-out refinance better?",
      a: "A HELOC is usually better if your current mortgage rate is lower than today's rates, since you keep it. A cash-out refinance can be better if today's rates are equal or lower, or if you want a single fixed-rate payment.",
    },
    {
      q: "Does refinancing restart my loan?",
      a: "Yes. A refinance is a new loan with a new term. To avoid adding years, choose a shorter term, such as refinancing 25 years remaining into a 20-year loan, or keep making your old payment amount.",
    },
  ],
};

// ---------------------------------------------------------------------------
// Pay off faster
// ---------------------------------------------------------------------------

// Same example as the extra and bi-weekly payment calculators' defaults:
// a $400,000 home with 20% down at 6.5% for 30 years.
const EX_LOAN = 320_000;
const EX_RATE = 6.5;
const exPayment = monthlyPayment(EX_LOAN, EX_RATE, 360);
const exInterest = totalPaidOnBalance(EX_LOAN, EX_RATE, exPayment) - EX_LOAN;

const extraRows = [100, 200, 500].map((extra) => {
  const months = monthsToPayoff(EX_LOAN, EX_RATE, exPayment + extra);
  return {
    label: `${formatCurrency(extra)} extra a month`,
    sooner: 360 - months,
    saved: exInterest - (totalPaidOnBalance(EX_LOAN, EX_RATE, exPayment + extra) - EX_LOAN),
  };
});

// Half the monthly payment every two weeks, as the bi-weekly calculator models it.
const biWeekly = (() => {
  const rate = EX_RATE / 100 / 26;
  let balance = EX_LOAN;
  let interest = 0;
  let payments = 0;
  while (balance > 0.01) {
    const i = balance * rate;
    interest += i;
    balance -= Math.min(exPayment / 2 - i, balance);
    payments++;
  }
  return { sooner: 360 - Math.round((payments / 26) * 12), saved: exInterest - interest };
})();

const payoffRows = [
  ...extraRows,
  { label: "Half payments every two weeks", sooner: biWeekly.sooner, saved: biWeekly.saved },
];

const payoff: HubContent = {
  title: "How to Pay Off Your Mortgage Early | Extra & Bi-Weekly Payment Calculators",
  description:
    "See how much interest you save and how much sooner you're debt-free by paying extra on your mortgage or switching to bi-weekly payments.",
  intro: (
    <p>
      Every extra dollar you pay toward principal saves the interest it would have cost for the rest of the loan.
      See how much sooner you could own your home, and what it saves.
    </p>
  ),
  useWhen: {
    "/extra-mortgage-payments-calculator/":
      "You want to add a set amount each month, a yearly lump sum, or a one-time payment.",
    "/bi-weekly-mortgage-payments-calculator/":
      "You're paid every two weeks and want to split your payment to match.",
  },
  body: (
    <>
      <h2>What paying early saves</h2>
      <p>
        Example: a {formatCurrency(EX_LOAN)} loan at {EX_RATE}% for 30 years. The principal and interest payment is{" "}
        {formatCurrency(exPayment)}, and total interest is {formatCurrency(exInterest)} if you pay as scheduled.
      </p>
      <HubTable
        caption="Interest saved by paying a mortgage early"
        columns={["Strategy", "Paid off sooner by", "Interest saved"]}
        rows={payoffRows.map((r) => ({
          key: r.label,
          head: r.label,
          cells: [yearsAndMonths(r.sooner), formatCurrency(r.saved)],
        }))}
      />

      <h2>Ways to pay off your mortgage faster</h2>
      <ul>
        <li>
          <strong>Add a set amount each month.</strong> The simplest option, and the one that saves the most per
          dollar because it starts early. Try the <Link to="/extra-mortgage-payments-calculator/">extra payments
          calculator</Link>.
        </li>
        <li>
          <strong>Pay every two weeks.</strong> Half a payment every two weeks adds up to 13 full payments a year
          instead of 12. Check that your servicer applies each payment when it arrives, and avoid third-party programs
          that charge a fee. Try the <Link to="/bi-weekly-mortgage-payments-calculator/">bi-weekly calculator</Link>.
        </li>
        <li>
          <strong>Put windfalls toward principal.</strong> A tax refund or bonus paid once a year has a similar effect.
        </li>
        <li>
          <strong>Refinance to a shorter term.</strong> A 15-year loan usually has a lower rate, but a higher required
          payment. The <Link to="/refinance-calculator/">refinance calculator</Link> compares them.
        </li>
      </ul>

      <h2>Should you pay off your mortgage early?</h2>
      <p>It's a guaranteed return equal to your mortgage rate, but first make sure you:</p>
      <ul>
        <li>have an emergency fund of a few months' expenses, since extra principal is hard to get back;</li>
        <li>get any employer retirement match, which is usually a better return;</li>
        <li>pay off higher-rate debt such as credit cards first;</li>
        <li>check your loan has no prepayment penalty. Most home loans made since 2014 don't.</li>
      </ul>
    </>
  ),
  faqs: [
    {
      q: "Does paying extra principal lower my monthly payment?",
      a: "No. Your required payment stays the same and the loan ends sooner. To lower the payment instead, ask your servicer about a recast, which re-figures the payment on the lower balance, usually for a small fee.",
    },
    {
      q: "How do I make sure extra payments go to principal?",
      a: "Mark the extra amount as additional principal when you pay, online or on the payment slip. Check your next statement to confirm the balance dropped by that amount.",
    },
    {
      q: "Are bi-weekly mortgage payments worth it?",
      a: "They work because they add one extra monthly payment a year. You get the same result by adding one-twelfth of your payment each month. Avoid services that charge a setup or per-payment fee for bi-weekly plans.",
    },
    {
      q: "Is it better to pay extra each month or one lump sum a year?",
      a: "It depends on timing. A lump sum paid at the start of the year saves a little more than the same amount spread over the months, and one paid at the end of the year saves a little less. The difference is small, so choose whichever you'll keep doing.",
    },
  ],
};

// ---------------------------------------------------------------------------
// Compare options
// ---------------------------------------------------------------------------

const compare: HubContent = {
  title: "Compare Mortgage Options: 15 vs. 30 Years, FHA vs. Conventional, Points & Offers",
  description:
    "Side-by-side mortgage comparison calculators: 15-year vs. 30-year, FHA vs. conventional, whether to pay points, and up to three loan offers by APR and total cost.",
  intro: (
    <p>
      Most mortgage decisions are a choice between two or three options. These calculators put them side by side and
      show which costs less for how long you'll keep the loan.
    </p>
  ),
  useWhen: {
    "/15-vs-30-year-mortgage-calculator/": "You're choosing a loan term and want to see the payment and interest trade-off.",
    "/fha-vs-conventional-calculator/": "You qualify for both and want to know which costs less with your credit and down payment.",
    "/mortgage-points-calculator/": "A lender offered a lower rate for points and you want the break-even point.",
    "/mortgage-comparison-calculator/": "You have Loan Estimates from several lenders and want to pick the cheapest.",
  },
  body: (
    <>
      <h2>The one number that changes every answer</h2>
      <p>
        How long you'll keep the loan decides most of these comparisons. Paying points, choosing a lower rate with
        higher fees, or picking conventional over FHA all cost more up front and pay off over time. If you're likely
        to sell or refinance within a few years, the option with lower up-front costs usually wins. Each calculator
        asks for this number, so try a few.
      </p>

      <h2>Where to get the numbers</h2>
      <ul>
        <li>
          <strong>Rates and fees:</strong> from each lender's Loan Estimate. The rate is on page 1; points and lender
          fees are in section A on page 2.
        </li>
        <li>
          <strong>PMI rate:</strong> ask the lender, or use 0.5% a year as a starting point and adjust for your credit.
        </li>
        <li>
          <strong>Loan amount:</strong> the home price minus your down payment. The{" "}
          <Link to="/house-affordability/">affordability calculator</Link> helps if you don't have a price yet.
        </li>
      </ul>
    </>
  ),
  faqs: [
    {
      q: "Should I choose the mortgage with the lowest rate or the lowest APR?",
      a: "Neither on its own. The lowest rate may come with high fees, and APR assumes you keep the loan for the full term. Compare total cost over the years you expect to keep the loan.",
    },
    {
      q: "How many mortgage offers should I get?",
      a: "At least three. Rates and fees for the same borrower can differ meaningfully between lenders, and multiple mortgage credit checks within a short window count as one inquiry.",
    },
    {
      q: "Is it better to pay points or take a higher rate with no fees?",
      a: "Points pay off only if you keep the loan past the break-even point, often 5 to 7 years. If you might move or refinance sooner, the no-fee option usually costs less.",
    },
  ],
};

export const BuyingHub = () => <CategoryHub groupId="buying" content={buying} />;
export const LoanTypesHub = () => <CategoryHub groupId="loan-types" content={loanTypes} />;
export const EquityHub = () => <CategoryHub groupId="equity" content={equity} />;
export const PayoffHub = () => <CategoryHub groupId="payoff" content={payoff} />;
export const CompareHub = () => <CategoryHub groupId="compare" content={compare} />;
