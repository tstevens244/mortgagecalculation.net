import { Link } from "react-router-dom";
import { calculatorGroups } from "@/lib/calculators";

const siteLinks = [
  { to: "/mortgage-calculator-by-state/", label: "Mortgage Calculator by State" },
  { to: "/about/", label: "About" },
  { to: "/methodology/", label: "How We Calculate" },
  { to: "/mortgage-assistant/", label: "AI Assistant" },
  { to: "/privacy-policy/", label: "Privacy Policy" },
  { to: "/terms-of-use/", label: "Terms of Use" },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-border bg-card" role="contentinfo">
      <div className="container py-12">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_3fr]">
          <div>
            <Link to="/" className="flex items-center gap-2 text-lg font-display font-bold text-foreground">
              <img src="/logo-64.png" width={24} height={24} alt="" className="h-6 w-6" aria-hidden="true" />
              MortgageCalculation.net
            </Link>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              Free, independent mortgage calculators with current loan limits and the formulas shown.
            </p>
            <ul className="mt-5 space-y-2 text-sm" role="list">
              {siteLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-muted-foreground transition-colors hover:text-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <nav aria-label="All calculators" className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {calculatorGroups.map((group) => (
              <div key={group.id}>
                <h2 className="mb-3 font-sans text-sm font-semibold text-foreground">
                  <Link to={group.hubPath} className="hover:text-primary hover:underline">
                    {group.title}
                  </Link>
                </h2>
                <ul className="space-y-2 text-sm" role="list">
                  {group.calculators.map((calc) => (
                    <li key={calc.path}>
                      <Link to={calc.path} className="text-muted-foreground transition-colors hover:text-foreground">
                        {calc.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-10 border-t border-border pt-6 text-xs leading-relaxed text-muted-foreground">
          <p>
            Results are estimates for information only, not financial advice or a loan offer. Your lender's Loan
            Estimate has your actual rate, payment and costs.
          </p>
          <p className="mt-2">© {currentYear} MortgageCalculation.net. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
