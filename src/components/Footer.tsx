import { Calculator } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card mt-12">
      <div className="container py-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <Link to="/" className="flex items-center gap-2 text-lg font-display font-bold">
              <Calculator className="h-5 w-5 text-accent" aria-hidden="true" />
              Mortgage Calculation
            </Link>
            <p className="mt-2 text-sm text-muted-foreground">
              Free online mortgage calculator to help you estimate your monthly payments and plan your home purchase.
            </p>
          </div>

          <nav aria-label="Quick links">
            <h3 className="font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm" role="list">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  Mortgage Calculator
                </Link>
              </li>
            </ul>
          </nav>

          <div>
            <h3 className="font-semibold mb-3">Disclaimer</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              This calculator provides estimates for informational purposes only. Actual payments may vary based on
              lender terms, fees, and other factors. Always consult with a qualified financial advisor before making
              decisions.
            </p>
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
