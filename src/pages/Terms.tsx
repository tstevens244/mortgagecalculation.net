import { Link } from "react-router-dom";
import InfoPage from "@/components/InfoPage";
import { SITE_NAME } from "@/lib/site";

const UPDATED = "2026-11-17";

const Terms = () => (
  <InfoPage
    path="/terms-of-use/"
    title="Terms of Use | MortgageCalculation.net"
    description="Terms for using MortgageCalculation.net calculators: results are estimates for information only and are not financial advice or a loan offer."
    heading="Terms of use"
    updated={UPDATED}
    breadcrumbName="Terms of Use"
  >
    <p>By using {SITE_NAME}, you agree to these terms.</p>

    <h2>Estimates only</h2>
    <p>
      The calculators, guides and AI assistant provide general information and estimates. They are not financial,
      legal or tax advice, and not an offer or approval for a loan. Your actual rate, payment, fees and eligibility
      are set by your lender. Confirm figures with a lender's Loan Estimate and, where appropriate, a qualified
      professional before making decisions.
    </p>

    <h2>Accuracy</h2>
    <p>
      We work to keep formulas and program figures accurate and current (see our{" "}
      <Link to="/methodology/">methodology</Link>), but we can't guarantee that every result is complete, correct or
      suited to your situation. Loan programs and limits change, and county-specific rules can differ from the
      national figures we use.
    </p>

    <h2>AI assistant</h2>
    <p>
      Answers from the AI assistant are generated automatically and can be wrong. Don't rely on them without checking.
    </p>

    <h2>No liability</h2>
    <p>
      The site is provided "as is", without warranties of any kind. To the extent the law allows, {SITE_NAME} is not
      liable for any loss arising from use of the site or reliance on its results.
    </p>

    <h2>Use of the site</h2>
    <p>
      You may use the calculators for personal and professional purposes. Don't attempt to disrupt the site or misuse
      the AI assistant.
    </p>

    <h2>Changes</h2>
    <p>We may update these terms. The date at the top shows the latest version.</p>
  </InfoPage>
);

export default Terms;
