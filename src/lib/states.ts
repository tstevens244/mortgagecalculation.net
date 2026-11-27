// State housing cost figures for the state mortgage calculator pages.
//
// Sources (update together once a year):
// - medianValue, medianTax: U.S. Census Bureau, American Community Survey 2024 1-year estimates,
//   tables B25077 (median value, owner-occupied homes) and B25103 (median real estate taxes paid).
// - taxRate: Tax Foundation, "Property Taxes by State and County, 2026" (effective rate for 2024:
//   aggregate real estate taxes ÷ aggregate home value, ACS tables B25082 and B25090).
// - insurance: NAIC, Dwelling Fire, Homeowners Owner-Occupied, and Homeowners Tenant and
//   Condominium/Cooperative Unit Owners Insurance: Data for 2023, Table 4, average HO-3 premium.
// - County figures in src/data/states/*.json: Tax Foundation county table (ACS 2020–2024 5-year):
//   [name, median home value, median property taxes paid, effective rate %].

import { monthlyPayment } from "./mortgageMath.ts";

export interface StateInfo {
  name: string;
  code: string;
  slug: string;
  /** Median value of owner-occupied homes ($). */
  medianValue: number;
  /** Median real estate taxes paid ($ a year). */
  medianTax: number;
  /** Effective property tax rate (% of home value a year). */
  taxRate: number;
  /** Average HO-3 homeowners insurance premium ($ a year). */
  insurance: number;
}

export type CountyRow = [name: string, medianValue: number, medianTax: number, ratePercent: number];

export const STATE_DATA_YEAR = 2024;
export const INSURANCE_DATA_YEAR = 2023;
/** Countrywide average HO-3 premium, same NAIC table. */
export const NATIONAL_INSURANCE = 1737;

export const states: StateInfo[] = [
  { name: "Alabama", code: "AL", slug: "alabama", medianValue: 233300, medianTax: 890, taxRate: 0.37, insurance: 1906 },
  { name: "Alaska", code: "AK", slug: "alaska", medianValue: 376500, medianTax: 3976, taxRate: 0.94, insurance: 1216 },
  { name: "Arizona", code: "AZ", slug: "arizona", medianValue: 426000, medianTax: 1828, taxRate: 0.48, insurance: 1194 },
  { name: "Arkansas", code: "AR", slug: "arkansas", medianValue: 215600, medianTax: 1113, taxRate: 0.56, insurance: 1870 },
  { name: "California", code: "CA", slug: "california", medianValue: 759500, medianTax: 5369, taxRate: 0.7, insurance: 1655 },
  { name: "Colorado", code: "CO", slug: "colorado", medianValue: 574600, medianTax: 2828, taxRate: 0.5, insurance: 2492 },
  { name: "Connecticut", code: "CT", slug: "connecticut", medianValue: 396900, medianTax: 6573, taxRate: 1.54, insurance: 2036 },
  { name: "Delaware", code: "DE", slug: "delaware", medianValue: 371600, medianTax: 1750, taxRate: 0.54, insurance: 1196 },
  { name: "District of Columbia", code: "DC", slug: "district-of-columbia", medianValue: 733400, medianTax: 4594, taxRate: 0.6, insurance: 1545 },
  { name: "Florida", code: "FL", slug: "florida", medianValue: 396900, medianTax: 2993, taxRate: 0.78, insurance: 2779 },
  { name: "Georgia", code: "GA", slug: "georgia", medianValue: 343300, medianTax: 2554, taxRate: 0.79, insurance: 1828 },
  { name: "Hawaii", code: "HI", slug: "hawaii", medianValue: 875900, medianTax: 2385, taxRate: 0.29, insurance: 1549 },
  { name: "Idaho", code: "ID", slug: "idaho", medianValue: 446400, medianTax: 1912, taxRate: 0.5, insurance: 1135 },
  { name: "Illinois", code: "IL", slug: "illinois", medianValue: 280700, medianTax: 5399, taxRate: 1.88, insurance: 1480 },
  { name: "Indiana", code: "IN", slug: "indiana", medianValue: 243500, medianTax: 1798, taxRate: 0.76, insurance: 1259 },
  { name: "Iowa", code: "IA", slug: "iowa", medianValue: 227300, medianTax: 2937, taxRate: 1.33, insurance: 1342 },
  { name: "Kansas", code: "KS", slug: "kansas", medianValue: 238700, medianTax: 2983, taxRate: 1.21, insurance: 1733 },
  { name: "Kentucky", code: "KY", slug: "kentucky", medianValue: 226000, medianTax: 1611, taxRate: 0.74, insurance: 1525 },
  { name: "Louisiana", code: "LA", slug: "louisiana", medianValue: 223200, medianTax: 1187, taxRate: 0.55, insurance: 3027 },
  { name: "Maine", code: "ME", slug: "maine", medianValue: 341900, medianTax: 3103, taxRate: 0.98, insurance: 1150 },
  { name: "Maryland", code: "MD", slug: "maryland", medianValue: 436300, medianTax: 4144, taxRate: 0.92, insurance: 1578 },
  { name: "Massachusetts", code: "MA", slug: "massachusetts", medianValue: 607400, medianTax: 6080, taxRate: 1.0, insurance: 2134 },
  { name: "Michigan", code: "MI", slug: "michigan", medianValue: 254200, medianTax: 2988, taxRate: 1.19, insurance: 1110 },
  { name: "Minnesota", code: "MN", slug: "minnesota", medianValue: 344600, medianTax: 3501, taxRate: 1.0, insurance: 1988 },
  { name: "Mississippi", code: "MS", slug: "mississippi", medianValue: 186500, medianTax: 1221, taxRate: 0.58, insurance: 2029 },
  { name: "Missouri", code: "MO", slug: "missouri", medianValue: 254400, medianTax: 2021, taxRate: 0.89, insurance: 1589 },
  { name: "Montana", code: "MT", slug: "montana", medianValue: 425400, medianTax: 2939, taxRate: 0.61, insurance: 1768 },
  { name: "Nebraska", code: "NE", slug: "nebraska", medianValue: 263100, medianTax: 3739, taxRate: 1.44, insurance: 2142 },
  { name: "Nevada", code: "NV", slug: "nevada", medianValue: 455500, medianTax: 2143, taxRate: 0.5, insurance: 1013 },
  { name: "New Hampshire", code: "NH", slug: "new-hampshire", medianValue: 458800, medianTax: 6707, taxRate: 1.5, insurance: 1300 },
  { name: "New Jersey", code: "NJ", slug: "new-jersey", medianValue: 496000, medianTax: 9358, taxRate: 1.88, insurance: 1551 },
  { name: "New Mexico", code: "NM", slug: "new-mexico", medianValue: 279900, medianTax: 1776, taxRate: 0.63, insurance: 1490 },
  { name: "New York", code: "NY", slug: "new-york", medianValue: 449800, medianTax: 6542, taxRate: 1.3, insurance: 1801 },
  { name: "North Carolina", code: "NC", slug: "north-carolina", medianValue: 333000, medianTax: 2044, taxRate: 0.66, insurance: 1852 },
  { name: "North Dakota", code: "ND", slug: "north-dakota", medianValue: 266100, medianTax: 2550, taxRate: 0.92, insurance: 1414 },
  { name: "Ohio", code: "OH", slug: "ohio", medianValue: 239800, medianTax: 2937, taxRate: 1.36, insurance: 1116 },
  { name: "Oklahoma", code: "OK", slug: "oklahoma", medianValue: 222100, medianTax: 1672, taxRate: 0.79, insurance: 2486 },
  { name: "Oregon", code: "OR", slug: "oregon", medianValue: 497500, medianTax: 3895, taxRate: 0.81, insurance: 1003 },
  { name: "Pennsylvania", code: "PA", slug: "pennsylvania", medianValue: 277600, medianTax: 3214, taxRate: 1.26, insurance: 1217 },
  { name: "Rhode Island", code: "RI", slug: "rhode-island", medianValue: 455700, medianTax: 4886, taxRate: 1.12, insurance: 2396 },
  { name: "South Carolina", code: "SC", slug: "south-carolina", medianValue: 299500, medianTax: 1337, taxRate: 0.49, insurance: 1753 },
  { name: "South Dakota", code: "SD", slug: "south-dakota", medianValue: 289600, medianTax: 2940, taxRate: 1.0, insurance: 1614 },
  { name: "Tennessee", code: "TN", slug: "tennessee", medianValue: 332600, medianTax: 1488, taxRate: 0.52, insurance: 1649 },
  { name: "Texas", code: "TX", slug: "texas", medianValue: 313200, medianTax: 4108, taxRate: 1.4, insurance: 2864 },
  { name: "Utah", code: "UT", slug: "utah", medianValue: 545200, medianTax: 2648, taxRate: 0.48, insurance: 1107 },
  { name: "Vermont", code: "VT", slug: "vermont", medianValue: 352800, medianTax: 5026, taxRate: 1.51, insurance: 1215 },
  { name: "Virginia", code: "VA", slug: "virginia", medianValue: 403500, medianTax: 2872, taxRate: 0.78, insurance: 1537 },
  { name: "Washington", code: "WA", slug: "washington", medianValue: 602200, medianTax: 4729, taxRate: 0.75, insurance: 1232 },
  { name: "West Virginia", code: "WV", slug: "west-virginia", medianValue: 170800, medianTax: 881, taxRate: 0.51, insurance: 1179 },
  { name: "Wisconsin", code: "WI", slug: "wisconsin", medianValue: 294700, medianTax: 3680, taxRate: 1.32, insurance: 923 },
  { name: "Wyoming", code: "WY", slug: "wyoming", medianValue: 339500, medianTax: 1947, taxRate: 0.53, insurance: 1853 },
];

export const statePath = (s: Pick<StateInfo, "slug">) => `/${s.slug}-mortgage-calculator/`;

export function findState(slug: string): StateInfo | undefined {
  return states.find((s) => s.slug === slug);
}

export const STATES_INDEX_PATH = "/mortgage-calculator-by-state/";
export const STATES_INDEX_NAME = "Mortgage Calculator by State";

export const EXAMPLE_RATE = 6.5;
export const PMI_RATE = 0.5;

/** Alaska and Hawaii have a higher baseline conforming limit. */
export const HIGH_BASELINE = new Set(["AK", "HI"]);

/** Monthly payment on the state's median-value home, as the calculator would show it. */
export function examplePayment(state: StateInfo, downPercent: number) {
  const price = state.medianValue;
  const loan = price * (1 - downPercent / 100);
  const pi = monthlyPayment(loan, EXAMPLE_RATE, 360);
  const tax = (price * state.taxRate) / 100 / 12;
  const insurance = state.insurance / 12;
  const pmi = downPercent < 20 ? (loan * PMI_RATE) / 100 / 12 : 0;
  return { price, loan, pi, tax, insurance, pmi, total: pi + tax + insurance + pmi };
}

