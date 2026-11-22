import { Link } from "react-router-dom";
import GuidePage from "@/components/GuidePage";
import { formatCurrency } from "@/lib/formatters";

// Worked example.
const VALUE = 450_000;
const OWED = 250_000;
const CLOSING_PCT = 3; // typical closing costs, % of the new loan

/** Most cash out at a maximum loan-to-value, before and after closing costs. */
const cashAt = (ltv: number) => {
  const maxLoan = (VALUE * ltv) / 100;
  const gross = Math.max(0, maxLoan - OWED);
  const closing = (maxLoan * CLOSING_PCT) / 100;
  return { maxLoan, gross, net: Math.max(0, gross - closing), closing };
};
const conv = cashAt(80);
const va = cashAt(90);
const equityPct = ((VALUE - OWED) / VALUE) * 100;

const calcLink = `/cash-out-refinance-calculator/?homeValue=${VALUE}&currentMortgageBalance=${OWED}&desiredCashOut=${conv.gross}&refinanceFees=${Math.round(conv.closing)}`;

const faqs = [
  {
    q: "How much equity do I need to refinance?",
    a: "For a regular rate-and-term refinance, as little as 3% to 5% on a conventional loan (though under 20% means PMI) and about 2.25% on an FHA loan. FHA Streamline and VA IRRRL refinances usually need no appraisal, so no minimum equity. For a cash-out refinance you generally must keep at least 20% equity after the new loan.",
  },
  {
    q: "How much cash can I get from a cash-out refinance?",
    a: "Usually up to 80% of your home's value minus what you owe, minus closing costs. On a $450,000 home with $250,000 owed, that's $110,000 before closing costs. VA cash-out loans can go higher, often to 90% of the value.",
  },
  {
    q: "Can I do a cash-out refinance with bad credit?",
    a: "It's harder. Conventional cash-out loans generally need a 620 score at minimum, and many lenders want 680 or more to reach the full 80% loan-to-value. FHA cash-out allows lower scores but adds mortgage insurance.",
  },
  {
    q: "How long do I have to own my home before a cash-out refinance?",
    a: "Usually 6 to 12 months, depending on the loan type and lender. FHA requires you to have lived in the home for the 12 months before the cash-out refinance.",
  },
  {
    q: "Is a cash-out refinance or a HELOC better?",
    a: "A cash-out refinance replaces your whole mortgage, so it makes most sense when the new rate is close to or below your current one. If your current rate is low, a HELOC or home equity loan lets you borrow against equity without giving that rate up.",
  },
];

const RefinanceEquity = () => (
  <GuidePage
    slug="how-much-equity-to-refinance"
    metaTitle="How Much Equity Do You Need to Refinance? Cash-Out Limits"
    description="How much equity you need to refinance by loan type, the 80% cash-out limit, and how to calculate how much cash you can take out, with a worked example."
    faqs={faqs}
    lead={
      <>
        <p>
          For a regular refinance that just lowers your rate or changes your term, you may need{" "}
          <strong>very little equity</strong>: 3% to 5% on many conventional loans, and none at all for an FHA
          Streamline or VA IRRRL. For a <strong>cash-out refinance</strong>, most lenders require you to keep{" "}
          <strong>at least 20% equity</strong> after the new loan.
        </p>
        <p>Here are the limits by loan type and how to work out how much cash you can actually take.</p>
      </>
    }
  >
    <h2>Equity requirements by refinance type</h2>
    <p>
      Lenders talk in terms of loan-to-value (LTV): the new loan as a percentage of the home's appraised value. Your
      equity is whatever's left.
    </p>
    <div className="hub-table-wrap">
      <table>
        <caption className="sr-only">Maximum loan-to-value and minimum equity by refinance type</caption>
        <thead>
          <tr>
            <th scope="col">Refinance type</th>
            <th scope="col">Max loan-to-value</th>
            <th scope="col">Equity you need</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">Conventional rate-and-term</th>
            <td data-label="Max LTV">95%–97%</td>
            <td data-label="Equity">3%–5% (20% to avoid PMI)</td>
          </tr>
          <tr>
            <th scope="row">Conventional cash-out</th>
            <td data-label="Max LTV">80%</td>
            <td data-label="Equity">20% left after the loan</td>
          </tr>
          <tr>
            <th scope="row">FHA rate-and-term</th>
            <td data-label="Max LTV">97.75%</td>
            <td data-label="Equity">2.25%</td>
          </tr>
          <tr>
            <th scope="row">FHA Streamline</th>
            <td data-label="Max LTV">No appraisal needed</td>
            <td data-label="Equity">None</td>
          </tr>
          <tr>
            <th scope="row">FHA cash-out</th>
            <td data-label="Max LTV">80%</td>
            <td data-label="Equity">20% left after the loan</td>
          </tr>
          <tr>
            <th scope="row">VA IRRRL (streamline)</th>
            <td data-label="Max LTV">Usually no appraisal</td>
            <td data-label="Equity">None</td>
          </tr>
          <tr>
            <th scope="row">VA cash-out</th>
            <td data-label="Max LTV">Up to 100% (many lenders cap at 90%)</td>
            <td data-label="Equity">0%–10%</td>
          </tr>
          <tr>
            <th scope="row">Jumbo cash-out</th>
            <td data-label="Max LTV">Often 70%–80%</td>
            <td data-label="Equity">20%–30%</td>
          </tr>
        </tbody>
      </table>
    </div>
    <p className="hub-note">
      These are program maximums for a one-unit primary residence. Lenders can be stricter, especially with lower
      credit scores, and limits are lower for second homes and investment properties.
    </p>

    <h2>How to calculate how much cash you can take out</h2>
    <p>
      <strong>Home value × max LTV − what you owe − closing costs = cash in hand.</strong>
    </p>
    <p>
      Say your home is worth {formatCurrency(VALUE)} and you owe {formatCurrency(OWED)}, so you have{" "}
      {equityPct.toFixed(0)}% equity:
    </p>
    <div className="hub-table-wrap">
      <table>
        <caption className="sr-only">Cash-out example</caption>
        <thead>
          <tr>
            <th scope="col">Step</th>
            <th scope="col">Conventional (80%)</th>
            <th scope="col">VA (90%)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">Largest new loan</th>
            <td data-label="Conventional">{formatCurrency(conv.maxLoan)}</td>
            <td data-label="VA">{formatCurrency(va.maxLoan)}</td>
          </tr>
          <tr>
            <th scope="row">Minus what you owe</th>
            <td data-label="Conventional">−{formatCurrency(OWED)}</td>
            <td data-label="VA">−{formatCurrency(OWED)}</td>
          </tr>
          <tr>
            <th scope="row">Cash out, before costs</th>
            <td data-label="Conventional">{formatCurrency(conv.gross)}</td>
            <td data-label="VA">{formatCurrency(va.gross)}</td>
          </tr>
          <tr>
            <th scope="row">Minus closing costs (~{CLOSING_PCT}%)</th>
            <td data-label="Conventional">−{formatCurrency(conv.closing)}</td>
            <td data-label="VA">−{formatCurrency(va.closing)}</td>
          </tr>
          <tr>
            <th scope="row">Cash in hand</th>
            <td data-label="Conventional">{formatCurrency(conv.net)}</td>
            <td data-label="VA">{formatCurrency(va.net)}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <p className="hub-note">
      VA cash-out loans also charge a funding fee unless you're exempt; see the{" "}
      <Link to="/guides/va-funding-fee/">VA funding fee guide</Link>. <Link to={calcLink}>Try the conventional
      example in the cash-out calculator</Link>.
    </p>

    <h2>Other things lenders check</h2>
    <ul>
      <li>
        <strong>Appraisal:</strong> the LTV uses the appraised value, not your estimate or an online value. If it comes
        in low, your cash-out shrinks.
      </li>
      <li>
        <strong>Credit score:</strong> conventional cash-out loans generally need at least 620, and many lenders want
        680 or more for the full 80%.
      </li>
      <li>
        <strong>Debt-to-income:</strong> the new, larger payment must fit your DTI limits. See the{" "}
        <Link to="/guides/debt-to-income-ratio-for-mortgage/">DTI guide</Link>.
      </li>
      <li>
        <strong>How long you've owned the home:</strong> usually 6 to 12 months. FHA requires 12 months of living in the
        home before a cash-out refinance.
      </li>
    </ul>

    <h2>Is a cash-out refinance the right tool?</h2>
    <p>
      A cash-out refinance replaces your entire mortgage, so the new rate applies to everything you owe, not just the
      cash you take. If your current rate is well below today's rates, borrowing $50,000 this way can cost far more
      than the same $50,000 from a <Link to="/heloc-calculator/">HELOC</Link> or home equity loan, which leaves your
      first mortgage alone. If you just want a lower rate or payment, compare a regular refinance with the{" "}
      <Link to="/refinance-calculator/">refinance calculator</Link> and see{" "}
      <Link to="/guides/is-refinancing-worth-it/">whether refinancing is worth it</Link>.
    </p>

    <h2>Sources</h2>
    <ul className="hub-note">
      <li>
        <a href="https://singlefamily.fanniemae.com/media/20786/display" target="_blank" rel="noopener noreferrer">
          Fannie Mae Eligibility Matrix (maximum LTV by transaction type)
        </a>
      </li>
      <li>
        <a href="https://www.hud.gov/program_offices/housing/sfh/handbook_4000-1" target="_blank" rel="noopener noreferrer">
          HUD Single Family Housing Policy Handbook 4000.1 (FHA refinance rules)
        </a>
      </li>
      <li>
        <a href="https://www.benefits.va.gov/WARMS/pam26_7.asp" target="_blank" rel="noopener noreferrer">
          VA Lenders Handbook (M26-7), refinancing chapters
        </a>
      </li>
      <li>
        <a href="https://www.consumerfinance.gov/ask-cfpb/what-is-a-cash-out-refinance-en-1802/" target="_blank" rel="noopener noreferrer">
          CFPB: What is a cash-out refinance?
        </a>
      </li>
    </ul>
  </GuidePage>
);

export default RefinanceEquity;
