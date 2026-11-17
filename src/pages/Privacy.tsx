import { Link } from "react-router-dom";
import InfoPage from "@/components/InfoPage";
import { CONTACT_EMAIL, SITE_NAME } from "@/lib/site";

const UPDATED = "2026-11-17";

const Privacy = () => (
  <InfoPage
    path="/privacy-policy/"
    title="Privacy Policy | MortgageCalculation.net"
    description="How MortgageCalculation.net handles your information: calculators run in your browser, there are no ads or analytics, and AI assistant messages are processed to generate replies."
    heading="Privacy policy"
    updated={UPDATED}
    breadcrumbName="Privacy Policy"
  >
    <p>
      This policy explains what information {SITE_NAME} handles and why. In short: the calculators run in your
      browser, we don't run ads or analytics, and we don't sell or share personal information.
    </p>

    <h2>Calculators</h2>
    <p>
      Everything you type into a calculator stays in your browser. The numbers are not sent to us or stored on our
      servers.
    </p>

    <h2>AI mortgage assistant</h2>
    <p>
      If you use the <Link to="/mortgage-assistant/">AI mortgage assistant</Link>, the messages you type are sent to
      our server and passed to a third-party AI model provider to generate a reply. Don't enter personal details such
      as your name, Social Security number or account numbers in the chat.
    </p>

    <h2>Information collected automatically</h2>
    <ul>
      <li>
        <strong>Hosting.</strong> The site is hosted on GitHub Pages. Like any web host, GitHub receives your IP address
        and browser details when you load a page, and may keep them in server logs for security. See GitHub's privacy
        statement for details.
      </li>
      <li>
        <strong>No cookies for tracking.</strong> We don't use advertising or analytics cookies.
      </li>
    </ul>

    <h2>Sharing</h2>
    <p>
      We don't sell, rent or share personal information, except with the service providers named above to run the
      site, or when the law requires it.
    </p>

    <h2>Children</h2>
    <p>The site is intended for adults and is not directed at children under 13.</p>

    <h2>Changes</h2>
    <p>We'll update this page if our practices change, and show the date of the latest change at the top.</p>

    {CONTACT_EMAIL && (
      <>
        <h2>Contact</h2>
        <p>
          Questions about this policy: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
      </>
    )}
  </InfoPage>
);

export default Privacy;
