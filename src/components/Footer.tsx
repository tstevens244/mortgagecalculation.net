import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const calculatorLinks = [
    { to: "/", label: "Mortgage Calculator" },
    { to: "/conventional-mortgage-calculator/", label: "Conventional" },
    { to: "/fha-loan-calculator/", label: "FHA Loan" },
    { to: "/usda-loan-calculator/", label: "USDA Loan" },
    { to: "/va-loan-calculator/", label: "VA Loan" },
    { to: "/jumbo-loan-calculator/", label: "Jumbo Loan" },
    { to: "/adjustable-rate-mortgage-calculator/", label: "ARM" },
    { to: "/refinance-calculator/", label: "Refinance" },
    { to: "/cash-out-refinance-calculator/", label: "Cash-Out Refi" },
    { to: "/heloc-calculator/", label: "HELOC" },
    { to: "/second-mortgage-calculator/", label: "Second Mortgage" },
    { to: "/house-affordability/", label: "Affordability" },
    { to: "/mortgage-qualification-calculator/", label: "Qualification" },
    { to: "/rent-or-buy/", label: "Rent vs Buy" },
    { to: "/extra-mortgage-payments-calculator/", label: "Extra Payments" },
    { to: "/bi-weekly-mortgage-payments-calculator/", label: "Bi-Weekly" },
    { to: "/mortgage-assistant/", label: "AI Assistant" },
  ];

  return (
    <footer className="border-t border-border bg-card mt-12" role="contentinfo">
      <div className="container py-8">
        {/* Quick Links - Full Width at Top */}
        <nav aria-label="Quick links" className="mb-8">
          <h3 className="font-semibold mb-4">Quick Links</h3>
          <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-4 gap-y-2 text-sm" role="list">
            {calculatorLinks.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="text-muted-foreground hover:text-foreground transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="border-t border-border pt-8">
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <Link to="/" className="flex items-center gap-2 text-lg font-display font-bold">
                <img src="/favicon.png" alt="" className="h-5 w-5" aria-hidden="true" />
                Mortgage Calculation
              </Link>
              <p className="mt-2 text-sm text-muted-foreground">
                Free online mortgage calculator to help you estimate your monthly payments and plan your home purchase.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Disclaimer</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                This calculator provides estimates for informational purposes only. Actual payments may vary based on
                lender terms, fees, and other factors. Always consult with a qualified financial advisor before making
                decisions.
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-6 text-center text-sm text-muted-foreground">
          <p>© {currentYear} Mortgage Calculation. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
