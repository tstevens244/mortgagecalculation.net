// Rent vs. buy over a holding period. Moved out of RentOrBuyCalculator so the
// calculator can run it for every possible holding period (for the chart) and
// so it can be tested. Tested in scripts/test-math.ts.

export interface RentVsBuyInputs {
  monthlyRent: number;
  /** % a year. */
  annualRentIncrease: number;
  homePrice: number;
  /** % a year. */
  annualAppreciation: number;
  /** Years until you sell. */
  years: number;
  /** % of the sale price. */
  sellingCost: number;
  /** % of the purchase price. */
  buyingCost: number;
  /** % a year the down payment and closing costs would earn if you rented. */
  investmentReturn: number;
  downPaymentPercent: number;
  interestRate: number;
  termYears: number;
  /** % of the loan a year. */
  annualPMIPercent: number;
  /** % of the price a year. */
  annualPropertyTaxRate: number;
  /** % of the price a year. */
  annualInsuranceRate: number;
  annualMaintenance: number;
  /** Marginal rate if itemizing, else 0. */
  incomeTaxRate: number;
}

export function rentVsBuy(i: RentVsBuyInputs) {
  const years = i.years;
  const monthlyRate = i.interestRate / 100 / 12;
  const totalPayments = i.termYears * 12;
  const downPayment = i.homePrice * (i.downPaymentPercent / 100);
  const loanAmount = i.homePrice - downPayment;

  const monthlyPI =
    monthlyRate > 0
      ? (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) / (Math.pow(1 + monthlyRate, totalPayments) - 1)
      : loanAmount / totalPayments;

  const monthlyPropertyTax = (i.homePrice * i.annualPropertyTaxRate) / 100 / 12;
  const monthlyInsurance = (i.homePrice * i.annualInsuranceRate) / 100 / 12;
  const monthlyMaintenance = i.annualMaintenance / 12;

  // PMI only if the down payment is under 20%, until the loan reaches 80% of the home's value.
  const hasPMI = i.downPaymentPercent < 20;
  const monthlyPMI = hasPMI ? (loanAmount * i.annualPMIPercent) / 100 / 12 : 0;
  const monthlyOwnershipTotal = monthlyPI + monthlyPropertyTax + monthlyInsurance + monthlyMaintenance + monthlyPMI;

  // Renting
  let totalRentPaid = 0;
  let currentRent = i.monthlyRent;
  for (let year = 1; year <= years; year++) {
    totalRentPaid += currentRent * 12;
    currentRent *= 1 + i.annualRentIncrease / 100;
  }
  const avgMonthlyRent = years > 0 ? totalRentPaid / (years * 12) : 0;

  // Owning
  let totalOwnershipPayments = 0;
  let totalInterestPaid = 0;
  let remainingBalance = loanAmount;
  let totalPMIPaid = 0;
  for (let month = 1; month <= years * 12; month++) {
    // After the loan is paid off there's no more principal or interest.
    const loanActive = month <= totalPayments && remainingBalance > 0.005;
    const interestPayment = loanActive ? remainingBalance * monthlyRate : 0;
    const principalPayment = loanActive ? Math.min(monthlyPI - interestPayment, remainingBalance) : 0;
    totalInterestPaid += interestPayment;
    remainingBalance -= principalPayment;

    const currentHomeValue = i.homePrice * Math.pow(1 + i.annualAppreciation / 100, month / 12);
    const pmiDue = hasPMI && (remainingBalance / currentHomeValue) * 100 > 80;
    if (pmiDue) totalPMIPaid += monthlyPMI;
    totalOwnershipPayments +=
      (loanActive ? monthlyPI : 0) + monthlyPropertyTax + monthlyInsurance + monthlyMaintenance + (pmiDue ? monthlyPMI : 0);
  }

  const totalTaxesAndInsurance = ((i.homePrice * i.annualPropertyTaxRate) / 100 + (i.homePrice * i.annualInsuranceRate) / 100) * years;
  const totalMaintenance = i.annualMaintenance * years;

  // Mortgage interest deduction, only if itemizing.
  const avgAnnualTaxDeduction = years > 0 ? totalInterestPaid / years : 0;
  const totalTaxDeduction = totalInterestPaid;
  const avgAnnualTaxSavings = avgAnnualTaxDeduction * (i.incomeTaxRate / 100);
  const totalTaxSavings = totalTaxDeduction * (i.incomeTaxRate / 100);

  // Selling
  const futureHomeValue = i.homePrice * Math.pow(1 + i.annualAppreciation / 100, years);
  const sellingCosts = futureHomeValue * (i.sellingCost / 100);
  const proceedsMinusCosts = futureHomeValue - sellingCosts;
  const loanBalance = remainingBalance;
  /** Cash you walk away with after selling and paying off the loan (includes your down payment back). */
  const saleCashBack = proceedsMinusCosts - loanBalance;
  /** Gain on top of the down payment. */
  const equityAppreciation = saleCashBack - downPayment;

  // Buying also costs closing costs up front, and the return that money
  // (plus the down payment) would have earned invested while renting.
  const buyingClosingCosts = i.homePrice * (i.buyingCost / 100);
  const opportunityCost = (downPayment + buyingClosingCosts) * (Math.pow(1 + i.investmentReturn / 100, years) - 1);
  // Everything paid out, minus everything that comes back. The down payment is
  // paid once and returned inside the sale proceeds. (An earlier version also
  // subtracted only the gain, which counted the down payment as a cost twice.)
  const totalBuyCost =
    downPayment + buyingClosingCosts + opportunityCost + totalOwnershipPayments - totalTaxSavings - saleCashBack;
  const totalRentCost = totalRentPaid;
  const netBenefitOfBuying = totalRentCost - totalBuyCost;

  return {
    totalRentPaid,
    avgMonthlyRent,
    totalOwnershipPayments,
    monthlyOwnershipTotal,
    totalTaxesAndInsurance,
    totalPMIPaid,
    totalMaintenance,
    avgAnnualTaxDeduction,
    totalTaxDeduction,
    avgAnnualTaxSavings,
    totalTaxSavings,
    buyingClosingCosts,
    opportunityCost,
    totalRentCost,
    totalBuyCost,
    costDifference: Math.abs(totalRentCost - totalBuyCost),
    isRentCheaper: totalRentCost < totalBuyCost,
    futureHomeValue,
    sellingCosts,
    proceedsMinusCosts,
    loanBalance,
    saleCashBack,
    equityAppreciation,
    shouldBuy: totalBuyCost < totalRentCost,
    netBenefitOfBuying,
    downPayment,
    loanAmount,
    monthlyPI,
    monthlyPropertyTax,
    monthlyInsurance,
    monthlyMaintenance,
    monthlyPMI,
  };
}

/** Buying's advantage over renting (positive = buying wins) for each holding period from 1 to maxYears. */
export function rentVsBuyByYear(i: Omit<RentVsBuyInputs, "years">, maxYears: number) {
  return Array.from({ length: maxYears }, (_, k) => {
    const r = rentVsBuy({ ...i, years: k + 1 });
    return { year: k + 1, advantage: r.netBenefitOfBuying, rent: r.totalRentCost, buy: r.totalBuyCost };
  });
}
