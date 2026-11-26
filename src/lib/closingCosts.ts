/*
 * Closing costs laid out the way the Loan Estimate shows them (CFPB form, page 2),
 * so the numbers line up with what lenders send:
 *   A. Origination charges            E. Taxes and other government fees
 *   B. Services you cannot shop for   F. Prepaids
 *   C. Services you can shop for      G. Initial escrow payment at closing
 */

export interface ClosingCostInput {
  price: number;
  down: number;
  ratePercent: number;
  /** Property tax and homeowners insurance, per year. */
  annualTax: number;
  annualInsurance: number;
  /** Lender's origination fee, % of the loan. */
  originationPercent: number;
  /** Discount points, % of the loan (1 point = 1%). */
  points: number;
  /** Appraisal, credit report, flood certification, tax service. */
  requiredServices: number;
  /** Lender's title insurance, settlement or closing fee, title search. */
  titleAndSettlement: number;
  /** County recording fees. */
  recording: number;
  /** Transfer or mortgage taxes the buyer pays, % of the price. */
  transferTaxPercent: number;
  /** Days of interest from closing to the end of the month. */
  prepaidInterestDays: number;
  /** Months of each held in the escrow account at closing. */
  escrowTaxMonths: number;
  escrowInsuranceMonths: number;
  /** Seller or lender credits toward closing costs. */
  credits: number;
}

export interface ClosingLine {
  label: string;
  amount: number;
}

export interface ClosingSection {
  id: "A" | "B" | "C" | "E" | "F" | "G";
  title: string;
  lines: ClosingLine[];
  total: number;
}

/** Typical lender's title + settlement cost for a loan size: about 0.5% of the loan plus $800. */
export const defaultTitleAndSettlement = (loan: number) => Math.round((loan * 0.005 + 800) / 50) * 50;

export const CLOSING_DEFAULTS = {
  originationPercent: 0.75,
  points: 0,
  requiredServices: 800,
  recording: 250,
  transferTaxPercent: 0,
  prepaidInterestDays: 15,
  escrowTaxMonths: 3,
  escrowInsuranceMonths: 2,
  credits: 0,
} as const;

export function closingCosts(input: ClosingCostInput) {
  const loan = Math.max(0, input.price - input.down);
  const section = (id: ClosingSection["id"], title: string, lines: ClosingLine[]): ClosingSection => ({
    id,
    title,
    lines,
    total: lines.reduce((s, l) => s + l.amount, 0),
  });

  const sections = [
    section("A", "Origination charges", [
      { label: `Origination fee (${input.originationPercent}% of the loan)`, amount: (loan * input.originationPercent) / 100 },
      { label: `Discount points (${input.points})`, amount: (loan * input.points) / 100 },
    ]),
    section("B", "Services you cannot shop for", [{ label: "Appraisal, credit report and other required services", amount: input.requiredServices }]),
    section("C", "Services you can shop for", [{ label: "Lender's title insurance and settlement", amount: input.titleAndSettlement }]),
    section("E", "Taxes and other government fees", [
      { label: "Recording fees", amount: input.recording },
      { label: `Transfer taxes (${input.transferTaxPercent}% of the price)`, amount: (input.price * input.transferTaxPercent) / 100 },
    ]),
    section("F", "Prepaids", [
      { label: "Homeowners insurance, first 12 months", amount: input.annualInsurance },
      { label: `Prepaid interest (${input.prepaidInterestDays} days)`, amount: ((loan * input.ratePercent) / 100 / 365) * input.prepaidInterestDays },
    ]),
    section("G", "Initial escrow payment", [
      { label: `Property tax (${input.escrowTaxMonths} months)`, amount: (input.annualTax / 12) * input.escrowTaxMonths },
      { label: `Homeowners insurance (${input.escrowInsuranceMonths} months)`, amount: (input.annualInsurance / 12) * input.escrowInsuranceMonths },
    ]),
  ].map((s) => ({ ...s, lines: s.lines.filter((l) => l.amount > 0.5) }));

  const byId = Object.fromEntries(sections.map((s) => [s.id, s.total])) as Record<ClosingSection["id"], number>;
  const loanCosts = byId.A + byId.B + byId.C;
  const otherCosts = byId.E + byId.F + byId.G;
  const total = loanCosts + otherCosts;
  const credits = Math.min(input.credits, total);
  const cashToClose = input.down + total - credits;

  return {
    loan,
    sections,
    loanCosts,
    otherCosts,
    /** Closing costs before credits. */
    total,
    credits,
    /** Fees only (A–E): what most people mean by "closing costs", without prepaids and escrow. */
    fees: loanCosts + byId.E,
    prepaidsAndEscrow: byId.F + byId.G,
    cashToClose,
    percentOfPrice: input.price > 0 ? (total / input.price) * 100 : 0,
  };
}

/** Closing costs with typical defaults, from just the loan basics. */
export function quickClosingCosts(price: number, down: number, ratePercent: number, annualTax: number, annualInsurance: number) {
  return closingCosts({
    price,
    down,
    ratePercent,
    annualTax,
    annualInsurance,
    ...CLOSING_DEFAULTS,
    titleAndSettlement: defaultTitleAndSettlement(Math.max(0, price - down)),
  });
}
