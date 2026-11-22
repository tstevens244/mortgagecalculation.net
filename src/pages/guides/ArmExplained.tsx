import { Link } from "react-router-dom";
import GuidePage from "@/components/GuidePage";
import { formatCurrency } from "@/lib/formatters";
import { armSchedule, balanceAfter, monthlyPayment } from "@/lib/mortgageMath";
import { loanOverHorizon } from "@/lib/compareMath";

// Worked example: a 5/6 SOFR ARM with Fannie Mae's standard 2/1/5 caps and 3.00% margin.
const LOAN = 320_000;
const START = 5.875;
const MARGIN = 3.0;
const INDEX = 4.0; // an example 30-day average SOFR, not a forecast
const FIXED = 6.5; // comparison 30-year fixed rate
const FIXED_MONTHS = 60;

/** Round to the nearest eighth of a point, as ARM notes do. */
const eighth = (r: number) => Math.round(r * 8) / 8;
const fullyIndexed = eighth(INDEX + MARGIN);
const firstRate = Math.min(fullyIndexed, START + 2, START + 5);
const startPayment = monthlyPayment(LOAN, START, 360);
const balance60 = balanceAfter(LOAN, START, startPayment, FIXED_MONTHS);
const firstPayment = monthlyPayment(balance60, firstRate, 300);

// Worst case: the rate rises as fast as the caps allow.
const worst = armSchedule({
  principal: LOAN,
  termMonths: 360,
  initialRatePercent: START,
  fixedMonths: FIXED_MONTHS,
  firstAdjustment: 2,
  subsequentAdjustment: 1,
  monthsBetweenAdjustments: 6,
  lifetimeCap: 5,
});
const worstFirst = worst[FIXED_MONTHS];
const worstPeak = worst.reduce((m, r) => (r.payment > m.payment ? r : m), worst[0]);
const pct = (r: number) => `${r.toFixed(3)}%`;

// ARM vs. fixed over the first five years.
const arm5 = loanOverHorizon(LOAN, START, 360, FIXED_MONTHS);
const fixed5 = loanOverHorizon(LOAN, FIXED, 360, FIXED_MONTHS);
const savings5 = fixed5.paid + fixed5.balance - (arm5.paid + arm5.balance);

const calcLink = `/adjustable-rate-mortgage-calculator/?homePrice=400000&downPayment=80000&downPaymentPercent=20&initialRate=${START}&yearsBeforeFirstAdjustment=5&monthsBetweenAdjustments=6&expectedFirstAdjustment=${(firstRate - START).toFixed(3)}&expectedSubsequentAdjustment=0&lifetimeCap=5`;

const faqs = [
  {
    q: "How do you calculate the fully indexed rate on an ARM?",
    a: "Add the margin in your loan note to the current index value, then round to the nearest 0.125%. For example, a 4.00% 30-day average SOFR plus a 3.00% margin gives a 7.00% fully indexed rate. Your actual new rate is the lower of that and what your rate caps allow.",
  },
  {
    q: "What does 2/1/5 mean on an ARM?",
    a: "Those are the caps. The rate can change by at most 2 percentage points at the first adjustment, 1 point at each adjustment after that, and 5 points above the starting rate over the life of the loan. 5/6 SOFR ARMs usually use 2/1/5; 7/6 and 10/6 ARMs usually use 5/1/5.",
  },
  {
    q: "What is the difference between a 5/1 and a 5/6 ARM?",
    a: "Both have a fixed rate for 5 years. A 5/1 then adjusts once a year; a 5/6 adjusts every 6 months. Most new conventional ARMs are 5/6, 7/6 or 10/6 and use the 30-day average SOFR as their index.",
  },
  {
    q: "Can an ARM rate go down?",
    a: "Yes. If the index falls, the rate can drop at an adjustment, usually by up to the same cap that limits increases. Many ARMs also have a floor, often the margin, below which the rate can't go.",
  },
  {
    q: "Is an ARM a good idea?",
    a: "It can be if you expect to sell or refinance before the fixed period ends, since the lower starting rate saves money up front. It's risky if you'd struggle with the worst-case payment, or might need to keep the loan long-term when rates are high.",
  },
];

const ArmExplained = () => (
  <GuidePage
    slug="how-adjustable-rate-mortgages-work"
    metaTitle="ARM Rates Explained: Index, Margin, Caps and Fully Indexed Rate"
    description="How adjustable-rate mortgages work: the fully indexed rate (index + margin), 2/1/5 and 5/1/5 caps, a worked 5/6 ARM example, and when an ARM beats a fixed rate."
    faqs={faqs}
    lead={
      <>
        <p>
          An adjustable-rate mortgage (ARM) has a fixed rate for the first few years, then a rate that resets on a
          schedule. At each reset, the new rate is <strong>the index plus your margin</strong> (the fully indexed rate),
          limited by your loan's <strong>rate caps</strong>.
        </p>
        <p>
          Here's how each piece works, with a worked example of a {formatCurrency(LOAN)} 5/6 ARM, its worst case, and
          how it compares with a 30-year fixed.
        </p>
      </>
    }
  >
    <h2>What the numbers in an ARM's name mean</h2>
    <p>
      The first number is how many years the starting rate is fixed. The second is how often it adjusts after that: a{" "}
      <strong>5/6 ARM</strong> is fixed for 5 years, then adjusts every 6 months. A <strong>5/1</strong> is fixed for 5
      years, then adjusts once a year. Most new conventional ARMs are 5/6, 7/6 or 10/6.
    </p>

    <h2>Index + margin = the fully indexed rate</h2>
    <ul>
      <li>
        <strong>The index</strong> is a market rate your loan follows. Most ARMs made today use the 30-day average of
        SOFR (the Secured Overnight Financing Rate), published daily by the{" "}
        <a href="https://www.newyorkfed.org/markets/reference-rates/sofr-averages-and-index" target="_blank" rel="noopener noreferrer">
          Federal Reserve Bank of New York
        </a>
        .
      </li>
      <li>
        <strong>The margin</strong> is a fixed number of percentage points the lender adds, set in your loan note and
        never changing. For conventional SOFR ARMs it's commonly about 3.00%.
      </li>
    </ul>
    <p>
      To calculate the <strong>fully indexed rate</strong>, add the two and round to the nearest 0.125%. With an index of{" "}
      {INDEX.toFixed(2)}% and a margin of {MARGIN.toFixed(2)}%: {INDEX.toFixed(2)}% + {MARGIN.toFixed(2)}% ={" "}
      <strong>{pct(fullyIndexed)}</strong>. That's the rate your loan moves toward at each adjustment, as far as the
      caps allow.
    </p>
    <p className="hub-note">
      The {INDEX.toFixed(2)}% index here is an example, not a forecast. Nobody knows what SOFR will be in five years;
      that uncertainty is the core risk of an ARM.
    </p>

    <h2>Rate caps: how far the rate can move</h2>
    <p>ARM caps are written as three numbers:</p>
    <div className="hub-table-wrap">
      <table>
        <caption className="sr-only">ARM rate caps</caption>
        <thead>
          <tr>
            <th scope="col">Cap</th>
            <th scope="col">What it limits</th>
            <th scope="col">5/6 ARM (2/1/5)</th>
            <th scope="col">7/6, 10/6 ARM (5/1/5)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">Initial adjustment</th>
            <td data-label="Limits">Change at the first reset</td>
            <td data-label="5/6">2 points</td>
            <td data-label="7/6, 10/6">5 points</td>
          </tr>
          <tr>
            <th scope="row">Periodic</th>
            <td data-label="Limits">Change at each later reset</td>
            <td data-label="5/6">1 point</td>
            <td data-label="7/6, 10/6">1 point</td>
          </tr>
          <tr>
            <th scope="row">Lifetime</th>
            <td data-label="Limits">Total rise over the starting rate</td>
            <td data-label="5/6">5 points</td>
            <td data-label="7/6, 10/6">5 points</td>
          </tr>
        </tbody>
      </table>
    </div>
    <p className="hub-note">
      These are the standard caps on Fannie Mae and Freddie Mac SOFR ARMs. Jumbo and portfolio ARMs can differ, so
      check the caps in your Loan Estimate.
    </p>

    <h2>Worked example: a {formatCurrency(LOAN)} 5/6 ARM</h2>
    <p>
      Say you take a {formatCurrency(LOAN)} 5/6 ARM at {pct(START)} with a {MARGIN.toFixed(2)}% margin and 2/1/5 caps.
    </p>
    <div className="hub-table-wrap">
      <table>
        <caption className="sr-only">5/6 ARM payments by scenario</caption>
        <thead>
          <tr>
            <th scope="col">When</th>
            <th scope="col">Rate</th>
            <th scope="col">Principal & interest</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">Years 1–5 (fixed)</th>
            <td data-label="Rate">{pct(START)}</td>
            <td data-label="Payment">{formatCurrency(startPayment)}</td>
          </tr>
          <tr>
            <th scope="row">Year 6, if SOFR is {INDEX.toFixed(2)}%</th>
            <td data-label="Rate">{pct(firstRate)}</td>
            <td data-label="Payment">{formatCurrency(firstPayment)}</td>
          </tr>
          <tr>
            <th scope="row">Year 6, worst case</th>
            <td data-label="Rate">{pct(worstFirst.rate)}</td>
            <td data-label="Payment">{formatCurrency(worstFirst.payment)}</td>
          </tr>
          <tr>
            <th scope="row">Worst case, at the lifetime cap</th>
            <td data-label="Rate">{pct(worstPeak.rate)}</td>
            <td data-label="Payment">{formatCurrency(worstPeak.payment)}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <p>
      After 5 years you'd owe {formatCurrency(balance60)}. If the index is {INDEX.toFixed(2)}%, the rate moves to the
      fully indexed {pct(firstRate)} (within the 2-point first cap), and the payment rises to{" "}
      {formatCurrency(firstPayment)}. In the worst case the rate climbs 2 points at the first reset and 1 point every 6
      months after, reaching the {pct(START + 5)} lifetime cap, where the payment is{" "}
      {formatCurrency(worstPeak.payment)}. That's{" "}
      {formatCurrency(worstPeak.payment - startPayment)} a month more than you started with.{" "}
      <Link to={calcLink}>Try this ARM in the calculator</Link>.
    </p>

    <h2>ARM vs. fixed: when an ARM is worth it</h2>
    <p>
      Against a {FIXED}% 30-year fixed, this ARM's {pct(START)} start costs{" "}
      {formatCurrency(fixed5.payment - startPayment)} less a month. Over the 5 fixed years, counting both lower payments
      and the faster paydown, you'd come out about <strong>{formatCurrency(savings5)} ahead</strong>.
    </p>
    <p>An ARM tends to make sense when:</p>
    <ul>
      <li>You're fairly sure you'll sell or refinance before the fixed period ends.</li>
      <li>The rate gap with a fixed loan is wide, typically half a point or more.</li>
      <li>You could still afford the worst-case payment if you end up keeping the loan.</li>
    </ul>
    <p>
      A fixed rate is safer if this is your long-term home or your budget has little room. And remember that
      refinancing out of an ARM later depends on rates and your finances at that time, which you can't guarantee today.
    </p>

    <h2>Questions to ask before you take an ARM</h2>
    <ol>
      <li>What's the index, and what's the margin?</li>
      <li>What are the initial, periodic and lifetime caps?</li>
      <li>Is there a floor, a rate the loan can never go below?</li>
      <li>What would the payment be at the lifetime cap?</li>
      <li>Is there a prepayment penalty if I refinance or sell early?</li>
    </ol>

    <h2>Sources</h2>
    <ul className="hub-note">
      <li>
        <a href="https://files.consumerfinance.gov/f/201401_cfpb_booklet_charm.pdf" target="_blank" rel="noopener noreferrer">
          CFPB: Consumer Handbook on Adjustable-Rate Mortgages (CHARM)
        </a>
      </li>
      <li>
        <a href="https://capitalmarkets.fanniemae.com/mortgage-backed-securities/single-family-mbs/key-dates-sofr-arm-products" target="_blank" rel="noopener noreferrer">
          Fannie Mae: SOFR ARM products (margins and caps)
        </a>
      </li>
      <li>
        <a href="https://www.newyorkfed.org/markets/reference-rates/sofr-averages-and-index" target="_blank" rel="noopener noreferrer">
          Federal Reserve Bank of New York: SOFR averages
        </a>
      </li>
    </ul>
  </GuidePage>
);

export default ArmExplained;
