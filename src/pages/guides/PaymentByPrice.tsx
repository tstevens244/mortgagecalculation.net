import { Link } from "react-router-dom";
import GuidePage from "@/components/GuidePage";
import { formatCurrency } from "@/lib/formatters";
import { monthlyPayment } from "@/lib/mortgageMath";

const RATE = 6.5;
const TAX = 1.0;
const INSURANCE = 0.5;

const cost = (price: number, rate = RATE, downPercent = 20) => {
  const loan = price * (1 - downPercent / 100);
  const pi = monthlyPayment(loan, rate, 360);
  const extras = (price * (TAX + INSURANCE)) / 100 / 12;
  return { loan, pi, total: pi + extras };
};

const prices = [200_000, 250_000, 300_000, 350_000, 400_000, 450_000, 500_000, 600_000, 700_000, 800_000, 1_000_000];
const rates = [5.5, 6, 6.5, 7, 7.5, 8];
const three = cost(300_000);
const perPoint = cost(300_000, 7.5).pi - cost(300_000, 6.5).pi;
const per100k = cost(400_000).total - cost(300_000).total;

const faqs = [
  {
    q: "What is the monthly payment on a $300,000 house?",
    a: `With 20% down at ${RATE}% for 30 years, principal and interest are ${formatCurrency(three.pi)} a month. With property tax and insurance at typical rates it's about ${formatCurrency(three.total)}.`,
  },
  {
    q: "How much does each extra $100,000 add to the payment?",
    a: `About ${formatCurrency(per100k)} a month with 20% down at ${RATE}%, including property tax and insurance.`,
  },
  {
    q: "How much does a 1% higher rate add to the payment?",
    a: `On a $300,000 home with 20% down, going from ${RATE}% to ${RATE + 1}% adds ${formatCurrency(perPoint)} a month.`,
  },
];

const PaymentByPrice = () => (
  <GuidePage
    slug="mortgage-payment-by-home-price"
    metaTitle="Mortgage Payment on a $300K House (and $200K to $1M) | Payment Table"
    description="Monthly mortgage payments for homes from $200,000 to $1 million, with and without taxes and insurance, and how the payment changes with the interest rate."
    faqs={faqs}
    lead={
      <p>
        On a $300,000 home with 20% down at {RATE}%, principal and interest come to{" "}
        <strong>{formatCurrency(three.pi)} a month</strong>, or about{" "}
        <strong>{formatCurrency(three.total)}</strong> with property tax and insurance. Here's the payment at other
        prices and rates.
      </p>
    }
  >
    <h2>Monthly payment by home price</h2>
    <div className="hub-table-wrap">
      <table>
        <caption className="sr-only">Monthly mortgage payment by home price</caption>
        <thead>
          <tr>
            <th scope="col">Home price</th>
            <th scope="col">Loan (20% down)</th>
            <th scope="col">Principal and interest</th>
            <th scope="col">With tax and insurance</th>
          </tr>
        </thead>
        <tbody>
          {prices.map((p) => {
            const c = cost(p);
            return (
              <tr key={p}>
                <th scope="row">{formatCurrency(p)}</th>
                <td data-label="Loan">{formatCurrency(c.loan)}</td>
                <td data-label="Principal and interest">{formatCurrency(c.pi)}</td>
                <td data-label="With tax and insurance">{formatCurrency(c.total)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
    <p className="hub-note">
      30-year fixed at {RATE}%. Property tax {TAX}% and homeowners insurance {INSURANCE}% of the price a year; both vary
      a lot by location. No PMI (20% down) or HOA dues.
    </p>

    <h2>How the rate changes the payment</h2>
    <p>Principal and interest on a $300,000 home with 20% down ($240,000 loan):</p>
    <div className="hub-table-wrap">
      <table>
        <caption className="sr-only">Payment on a $240,000 loan by interest rate</caption>
        <thead>
          <tr>
            <th scope="col">Rate</th>
            <th scope="col">30-year payment</th>
            <th scope="col">Total interest</th>
          </tr>
        </thead>
        <tbody>
          {rates.map((r) => {
            const pi = cost(300_000, r).pi;
            return (
              <tr key={r}>
                <th scope="row">{r.toFixed(1)}%</th>
                <td data-label="30-year payment">{formatCurrency(pi)}</td>
                <td data-label="Total interest">{formatCurrency(pi * 360 - 240_000)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
    <p>
      Each percentage point adds about {formatCurrency(perPoint)} a month on this loan. That's why shopping for a lower
      rate, or <Link to="/mortgage-points-calculator/">paying points</Link> if you'll keep the loan long enough, can
      matter as much as the price.
    </p>

    <h2>Get the payment for your home</h2>
    <p>
      Taxes and insurance differ widely by state and county. The{" "}
      <Link to="/mortgage-calculator-by-state/">state mortgage calculators</Link> fill in your area's rates, and the{" "}
      <Link to="/">mortgage calculator</Link> handles any price, down payment, PMI and HOA dues.
    </p>
  </GuidePage>
);

export default PaymentByPrice;
