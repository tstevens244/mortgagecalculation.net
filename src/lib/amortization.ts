// Summaries of a month-by-month amortization schedule, shared by the
// amortization chart and schedule. Pure functions, tested in scripts/test-math.ts.

export interface AmortizationRow {
  /** Payment number, starting at 1. */
  month: number;
  date: Date;
  payment: number;
  principal: number;
  interest: number;
  /** Balance after this payment. */
  balance: number;
}

export interface LoanYear {
  /** Loan year, starting at 1 (payments 1–12 are year 1). */
  year: number;
  /** Calendar year of the first payment in this loan year. */
  calendarYear: number;
  payments: number;
  principal: number;
  interest: number;
  /** Balance at the end of the year. */
  balance: number;
  /** Principal and interest paid from the start of the loan through this year. */
  cumPrincipal: number;
  cumInterest: number;
  /** Share of the original loan repaid by the end of the year, 0–1. */
  paidOff: number;
}

/** Groups a schedule into loan years (not calendar years, so year 1 is always 12 payments). */
export function byLoanYear(rows: AmortizationRow[]): LoanYear[] {
  const loan = rows.length ? rows[0].balance + rows[0].principal : 0;
  const years: LoanYear[] = [];
  let cumPrincipal = 0;
  let cumInterest = 0;
  rows.forEach((r, i) => {
    const index = Math.floor(i / 12);
    if (!years[index]) {
      years[index] = {
        year: index + 1,
        calendarYear: r.date.getFullYear(),
        payments: 0,
        principal: 0,
        interest: 0,
        balance: 0,
        cumPrincipal: 0,
        cumInterest: 0,
        paidOff: 0,
      };
    }
    const y = years[index];
    cumPrincipal += r.principal;
    cumInterest += r.interest;
    y.payments += r.payment;
    y.principal += r.principal;
    y.interest += r.interest;
    y.balance = r.balance;
    y.cumPrincipal = cumPrincipal;
    y.cumInterest = cumInterest;
    y.paidOff = loan > 0 ? 1 - r.balance / loan : 0;
  });
  return years;
}

export interface Milestones {
  loanAmount: number;
  totalInterest: number;
  totalPrincipal: number;
  /** First payment where more goes to principal than to interest (null if never). */
  crossoverMonth: number | null;
  /** First payment that brings the balance to half the loan or less. */
  halfwayMonth: number | null;
  /** Last payment. */
  payoffMonth: number;
}

export function milestones(rows: AmortizationRow[]): Milestones {
  const loanAmount = rows.length ? rows[0].balance + rows[0].principal : 0;
  let totalInterest = 0;
  let totalPrincipal = 0;
  let crossoverMonth: number | null = null;
  let halfwayMonth: number | null = null;
  for (const r of rows) {
    totalInterest += r.interest;
    totalPrincipal += r.principal;
    if (crossoverMonth === null && r.principal >= r.interest && r.principal > 0) crossoverMonth = r.month;
    if (halfwayMonth === null && r.balance <= loanAmount / 2) halfwayMonth = r.month;
  }
  return {
    loanAmount,
    totalInterest,
    totalPrincipal,
    crossoverMonth,
    halfwayMonth,
    payoffMonth: rows.length ? rows[rows.length - 1].month : 0,
  };
}

/** Loan year that contains a payment number. */
export const yearOfMonth = (month: number) => Math.ceil(month / 12);

/** "12 yr 3 mo", "8 mo", "5 yr". */
export function yearsMonths(months: number): string {
  const m = Math.max(0, Math.round(months));
  const y = Math.floor(m / 12);
  const r = m % 12;
  return [y ? `${y} yr` : "", r ? `${r} mo` : ""].filter(Boolean).join(" ") || "0 mo";
}

/** Year (fractional) where a yearly series first turns positive, interpolated between years. */
export function crossingYear(points: { year: number; value: number }[]): number | null {
  if (points.length && points[0].value > 0) return null; // ahead from the start: no break-even
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1];
    const b = points[i];
    if (a.value <= 0 && b.value > 0) {
      const t = b.value === a.value ? 0 : -a.value / (b.value - a.value);
      return a.year + t * (b.year - a.year);
    }
  }
  return null;
}
