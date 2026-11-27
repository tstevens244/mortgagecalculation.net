import { FIGURES_REVIEWED } from "./loanLimits.ts";
import { MARKET_RATES } from "./marketRates.ts";
import { HOME_VALUES } from "./localCosts.ts";

/**
 * When the site's figures last changed: the latest of the manual review of loan
 * limits and fees (FIGURES_REVIEWED) and the automatic weekly refresh of average
 * rates and home values. Shown as "Figures updated" on every calculator, so the
 * date moves forward each week the refresh brings in new data.
 */
export const FIGURES_UPDATED = [FIGURES_REVIEWED, MARKET_RATES.asOf, HOME_VALUES.asOf].sort().at(-1)!;
