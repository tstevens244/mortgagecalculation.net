// Site-wide settings used by the About, Privacy and Terms pages.

export const SITE_NAME = "MortgageCalculation.net";
export const SITE_URL = "https://mortgagecalculation.net";

/**
 * Public contact address. Leave empty until you have one: pages that mention
 * contacting us show the address only when this is set. Search engines and
 * visitors trust finance sites more when there is a real way to reach them.
 */
export const CONTACT_EMAIL = "";

/**
 * Optional expert reviewer shown on calculator pages, e.g.
 * { name: "Jane Doe", credentials: "Licensed loan officer, NMLS #123456" }.
 * Only fill this in with a real person who has actually reviewed the calculators.
 */
export const REVIEWER: { name: string; credentials: string } | null = null;

export function formatLongDate(isoDate: string): string {
  const [y, m, d] = isoDate.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}
