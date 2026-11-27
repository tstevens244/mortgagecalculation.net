import { Link } from "react-router-dom";
import InfoPage from "@/components/InfoPage";
import { CONTACT_EMAIL, REVIEWER, SITE_NAME } from "@/lib/site";
import { FIGURES_UPDATED } from "@/lib/figuresDate";

const About = () => (
  <InfoPage
    path="/about/"
    title="About MortgageCalculation.net | Free, Independent Mortgage Calculators"
    description="MortgageCalculation.net offers free, independent mortgage calculators. We don't sell loans or your data. Learn how the calculators are built and kept up to date."
    heading={`About ${SITE_NAME}`}
    updated={FIGURES_UPDATED}
    breadcrumbName="About"
  >
    <p>
      {SITE_NAME} is a free set of mortgage calculators for home buyers and homeowners in the United States. It
      covers monthly payments, FHA, VA, USDA, conventional and jumbo loans, refinancing, home equity and
      affordability.
    </p>

    <h2>What makes these calculators different</h2>
    <ul>
      <li>
        <strong>Independent.</strong> We are not a lender or broker. We don't ask for your contact details, and the
        calculators don't change their answers to steer you toward a product.
      </li>
      <li>
        <strong>Private.</strong> The calculators run in your browser. The numbers you enter are not sent to us. See
        our <Link to="/privacy-policy/">privacy policy</Link>.
      </li>
      <li>
        <strong>Current.</strong> Loan limits and program fees come from FHFA, HUD, the VA and USDA, and are reviewed
        every year. Each calculator shows when its figures were last checked.
      </li>
      <li>
        <strong>Transparent.</strong> Our <Link to="/methodology/">methodology page</Link> lists every formula,
        assumption and source.
      </li>
    </ul>

    {REVIEWER && (
      <>
        <h2 id="expert-review">Expert review</h2>
        <p>
          The calculators and guides are reviewed by {REVIEWER.name}, {REVIEWER.credentials}.
        </p>
        {REVIEWER.bio && <p>{REVIEWER.bio}</p>}
        {REVIEWER.sameAs && REVIEWER.sameAs.length > 0 && (
          <ul>
            {REVIEWER.sameAs.map((u) => (
              <li key={u}>
                <a href={u} target="_blank" rel="noopener noreferrer">
                  {new URL(u).hostname.replace(/^www\./, "")}
                </a>
              </li>
            ))}
          </ul>
        )}
      </>
    )}

    <h2>How to use the results</h2>
    <p>
      The calculators give estimates for planning. They don't replace a Loan Estimate from a lender, which is the
      official statement of your rate, payment and closing costs. Compare offers from more than one lender before
      you decide.
    </p>

    <h2>Contact</h2>
    {CONTACT_EMAIL ? (
      <p>
        Questions, or found something that looks wrong? Email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        We correct errors as soon as we confirm them.
      </p>
    ) : (
      <p>
        Found something that looks wrong? We correct errors as soon as we confirm them. Our sources are listed on the{" "}
        <Link to="/methodology/">methodology page</Link>.
      </p>
    )}
  </InfoPage>
);

export default About;
