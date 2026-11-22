import { Link } from "react-router-dom";
import GuidePage from "@/components/GuidePage";
import { formatCurrency } from "@/lib/formatters";
import { FHA_MIP_LARGE_LOAN_THRESHOLD, FHA_UPFRONT_MIP_RATE, fhaAnnualMipRate, fhaMipMonths } from "@/lib/loanLimits";
import { monthlyPayment } from "@/lib/mortgageMath";

// Worked example: a $350,000 home with the 3.5% minimum down.
const PRICE = 350_000;
const DOWN_PCT = 3.5;
const RATE = 6.25;
const base = PRICE * (1 - DOWN_PCT / 100);
const upfront = (base * FHA_UPFRONT_MIP_RATE) / 100;
const loan = base + upfront;
const ltv = 100 - DOWN_PCT;
const annualRate = fhaAnnualMipRate(30, ltv, base);
const monthlyMip = (base * annualRate) / 100 / 12;
const pi = monthlyPayment(loan, RATE, 360);

// Same home with 10% down.
const base10 = PRICE * 0.9;
const rate10 = fhaAnnualMipRate(30, 90, base10);
const monthly10 = (base10 * rate10) / 100 / 12;

const pct = (r: number) => `${r.toFixed(2)}%`;
const big = formatCurrency(FHA_MIP_LARGE_LOAN_THRESHOLD);

const calcLink = `/fha-loan-calculator/?homePrice=${PRICE}&downPayment=${Math.round(PRICE * DOWN_PCT) / 100}&downPaymentPercent=${DOWN_PCT}&interestRate=${RATE}&loanTerm=30`;

const faqs = [
  {
    q: "How is FHA mortgage insurance calculated?",
    a: `Two parts. The upfront premium is ${FHA_UPFRONT_MIP_RATE}% of the base loan, usually added to the loan. The annual premium is a percentage of the loan (0.55% for most 30-year loans with less than 5% down), divided into 12 monthly payments. On a $337,750 base loan that's $5,911 up front and about $155 a month.`,
  },
  {
    q: "When does FHA MIP go away?",
    a: "If you put at least 10% down, annual MIP ends after 11 years. With less than 10% down it lasts for the life of the loan. Most borrowers get rid of it by refinancing into a conventional loan once they have about 20% equity.",
  },
  {
    q: "Is FHA MIP more expensive than PMI?",
    a: "Often, for borrowers with good credit: FHA charges the 1.75% upfront premium and keeps annual MIP for the life of most loans, while conventional PMI ends at 78% loan-to-value. With lower credit scores, FHA can be cheaper because PMI pricing rises sharply.",
  },
  {
    q: "Can I get a refund of the upfront MIP?",
    a: "Partly, if you refinance into another FHA loan within 3 years. HUD credits a portion of the upfront premium toward the new loan's, shrinking each month. There's no refund if you refinance into a conventional loan or sell.",
  },
];

const FhaMip = () => (
  <GuidePage
    slug="fha-mortgage-insurance-mip"
    metaTitle="FHA MIP Explained: How It's Calculated and When It Ends"
    description={`FHA MIP explained: the ${FHA_UPFRONT_MIP_RATE}% upfront premium, annual rates from 0.15% to 0.75%, how to calculate your monthly MIP, and when it ends (11 years or the life of the loan).`}
    faqs={faqs}
    lead={
      <>
        <p>
          Every FHA loan has mortgage insurance, called <strong>MIP</strong>, in two parts: an{" "}
          <strong>upfront premium of {FHA_UPFRONT_MIP_RATE}%</strong> of the loan, usually added to the balance, and an{" "}
          <strong>annual premium</strong>, most often {pct(fhaAnnualMipRate(30, 96.5, 300_000))}, paid monthly.
        </p>
        <p>
          Unlike conventional PMI, annual MIP doesn't end when you reach 20% equity. It lasts{" "}
          <strong>11 years if you put at least 10% down</strong>, and <strong>the life of the loan</strong> otherwise.
        </p>
      </>
    }
  >
    <h2>FHA annual MIP rates</h2>
    <p>
      The annual rate depends on the loan term, your loan-to-value (LTV) and whether the base loan is above{" "}
      {big}:
    </p>
    <div className="hub-table-wrap">
      <table>
        <caption className="sr-only">FHA annual MIP rates</caption>
        <thead>
          <tr>
            <th scope="col">Loan</th>
            <th scope="col">Down payment</th>
            <th scope="col">Annual MIP</th>
            <th scope="col">How long</th>
          </tr>
        </thead>
        <tbody>
          {[
            { label: `Over 15 years, up to ${big}`, down: "Less than 5%", term: 30, ltv: 96.5, amt: 300_000 },
            { label: `Over 15 years, up to ${big}`, down: "5% to 9.99%", term: 30, ltv: 94, amt: 300_000 },
            { label: `Over 15 years, up to ${big}`, down: "10% or more", term: 30, ltv: 90, amt: 300_000 },
            { label: `Over 15 years, above ${big}`, down: "Less than 5%", term: 30, ltv: 96.5, amt: 900_000 },
            { label: `Over 15 years, above ${big}`, down: "5% or more", term: 30, ltv: 94, amt: 900_000 },
            { label: `15 years or less, up to ${big}`, down: "Less than 10%", term: 15, ltv: 95, amt: 300_000 },
            { label: `15 years or less, up to ${big}`, down: "10% or more", term: 15, ltv: 90, amt: 300_000 },
          ].map((r) => (
            <tr key={`${r.label}-${r.down}`}>
              <th scope="row">{r.label}</th>
              <td data-label="Down payment">{r.down}</td>
              <td data-label="Annual MIP">{pct(fhaAnnualMipRate(r.term, r.ltv, r.amt))}</td>
              <td data-label="How long">{fhaMipMonths(r.term, r.ltv) === r.term * 12 ? "Life of loan" : "11 years"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <p className="hub-note">
      Rates from HUD Mortgagee Letter 2023-05, in effect for loans closed since March 20, 2023. Loans of 15 years or
      less above {big} have their own tiers (0.15% to 0.65%).
    </p>

    <h2>How to calculate FHA mortgage insurance</h2>
    <p>
      Take a {formatCurrency(PRICE)} home with the minimum {DOWN_PCT}% down:
    </p>
    <ol>
      <li>
        <strong>Base loan:</strong> {formatCurrency(PRICE)} − {DOWN_PCT}% = {formatCurrency(base)}.
      </li>
      <li>
        <strong>Upfront MIP:</strong> {formatCurrency(base)} × {FHA_UPFRONT_MIP_RATE}% = {formatCurrency(upfront)}, usually
        added to the loan, making it {formatCurrency(loan)}.
      </li>
      <li>
        <strong>Annual MIP:</strong> {formatCurrency(base)} × {pct(annualRate)} ÷ 12 ={" "}
        <strong>{formatCurrency(monthlyMip)} a month</strong> in the first year. It's recalculated each year on the
        average balance, so it slowly shrinks.
      </li>
    </ol>
    <p>
      At {RATE}% for 30 years, principal and interest on {formatCurrency(loan)} is {formatCurrency(pi)}, so the payment
      before taxes and insurance is about {formatCurrency(pi + monthlyMip)}. With less than 10% down, that MIP lasts for
      the life of the loan. <Link to={calcLink}>See this example in the FHA calculator</Link>.
    </p>
    <p>
      Put 10% down instead and the annual rate drops to {pct(rate10)} ({formatCurrency(monthly10)} a month on a{" "}
      {formatCurrency(base10)} base loan), and it ends after 11 years.
    </p>

    <h2>FHA MIP vs. conventional PMI</h2>
    <div className="hub-table-wrap">
      <table>
        <caption className="sr-only">FHA MIP compared with conventional PMI</caption>
        <thead>
          <tr>
            <th scope="col"></th>
            <th scope="col">FHA MIP</th>
            <th scope="col">Conventional PMI</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">Upfront cost</th>
            <td data-label="FHA">{FHA_UPFRONT_MIP_RATE}% of the loan</td>
            <td data-label="Conventional">Usually none</td>
          </tr>
          <tr>
            <th scope="row">Annual cost</th>
            <td data-label="FHA">0.15%–0.75%, mostly 0.50%–0.55%</td>
            <td data-label="Conventional">About 0.3%–1.5%, depends on credit score</td>
          </tr>
          <tr>
            <th scope="row">When it ends</th>
            <td data-label="FHA">11 years (10%+ down) or never</td>
            <td data-label="Conventional">Automatically at 78% loan-to-value</td>
          </tr>
          <tr>
            <th scope="row">Credit score effect</th>
            <td data-label="FHA">Same price for everyone</td>
            <td data-label="Conventional">Rises sharply below ~700</td>
          </tr>
        </tbody>
      </table>
    </div>
    <p>
      That last row is why FHA often wins for buyers with lower scores, and conventional wins with strong credit.
      Compare both for your situation in the <Link to="/fha-vs-conventional-calculator/">FHA vs. conventional
      calculator</Link>.
    </p>

    <h2>How to get rid of FHA mortgage insurance</h2>
    <ul>
      <li>
        <strong>Wait it out</strong>, if you put 10% or more down: annual MIP ends after 11 years.
      </li>
      <li>
        <strong>Refinance into a conventional loan</strong> once you have about 20% equity, from paydown, appreciation
        or both. The new loan has no mortgage insurance at 80% LTV. Weigh the closing costs and the new rate; see{" "}
        <Link to="/guides/is-refinancing-worth-it/">is refinancing worth it?</Link>
      </li>
      <li>
        <strong>Pay extra principal</strong> to reach 20% equity sooner, with the{" "}
        <Link to="/extra-mortgage-payments-calculator/">extra payments calculator</Link>.
      </li>
    </ul>

    <h2>Sources</h2>
    <ul className="hub-note">
      <li>
        <a href="https://www.hud.gov/sites/dfiles/OCHCO/documents/2023-05hsgml.pdf" target="_blank" rel="noopener noreferrer">
          HUD Mortgagee Letter 2023-05: Reduction of FHA annual MIP rates
        </a>
      </li>
      <li>
        <a href="https://www.hud.gov/program_offices/housing/sfh/handbook_4000-1" target="_blank" rel="noopener noreferrer">
          HUD Single Family Housing Policy Handbook 4000.1
        </a>
      </li>
      <li>
        <a href="https://www.consumerfinance.gov/ask-cfpb/what-is-mortgage-insurance-and-how-does-it-work-en-1953/" target="_blank" rel="noopener noreferrer">
          CFPB: What is mortgage insurance and how does it work?
        </a>
      </li>
    </ul>
  </GuidePage>
);

export default FhaMip;
