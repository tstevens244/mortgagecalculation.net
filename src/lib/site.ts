// Site-wide settings used by the About, Privacy and Terms pages.

export const SITE_NAME = "MortgageCalculation.net";
export const SITE_URL = "https://mortgagecalculation.net";

/**
 * Public contact address. Leave empty until you have one: pages that mention
 * contacting us show the address only when this is set. Search engines and
 * visitors trust finance sites more when there is a real way to reach them.
 */
export const CONTACT_EMAIL = "tstevens244@gmail.com";

export interface Reviewer {
  name: string;
  /** e.g. "Licensed loan officer, NMLS #123456". */
  credentials: string;
  /** Job title for structured data, e.g. "Mortgage Loan Officer". */
  jobTitle?: string;
  /** Two or three sentences shown on the About page. */
  bio?: string;
  /** Public profiles that confirm who they are: NMLS Consumer Access, LinkedIn, a company bio. */
  sameAs?: string[];
}

/**
 * Optional expert reviewer, shown under every calculator and guide heading, on the
 * About page, and in the pages' structured data (schema.org reviewedBy). Only fill
 * this in with a real, licensed person who has actually reviewed the calculators:
 *
 *   export const REVIEWER: Reviewer | null = {
 *     name: "Jane Doe",
 *     credentials: "Licensed loan officer, NMLS #123456",
 *     jobTitle: "Mortgage Loan Officer",
 *     bio: "Jane has originated FHA, VA and conventional loans since 2012…",
 *     sameAs: ["https://www.nmlsconsumeraccess.org/EntityDetails.aspx/INDIVIDUAL/123456"],
 *   };
 */
export const REVIEWER: Reviewer | null = null;

/** schema.org WebPage for a calculator or guide: when it was last reviewed and, if set, by whom. */
export function webPageSchema(url: string, name: string, lastReviewed: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": url,
    url,
    name,
    lastReviewed,
    ...(REVIEWER
      ? {
          reviewedBy: {
            "@type": "Person",
            name: REVIEWER.name,
            ...(REVIEWER.jobTitle ? { jobTitle: REVIEWER.jobTitle } : {}),
            description: REVIEWER.credentials,
            url: `${SITE_URL}/about/#expert-review`,
            ...(REVIEWER.sameAs?.length ? { sameAs: REVIEWER.sameAs } : {}),
          },
        }
      : {}),
    publisher: { "@type": "Organization", name: SITE_NAME, url: `${SITE_URL}/` },
  };
}

export function formatLongDate(isoDate: string): string {
  const [y, m, d] = isoDate.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}
