import { Calculator, Home } from "lucide-react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="border-b border-border bg-card sticky top-0 z-50">
      <div className="container py-4">
        <nav className="flex items-center justify-between" aria-label="Main navigation">
          <Link
            to="/"
            className="flex items-center gap-2 text-xl font-display font-bold text-foreground hover:text-primary transition-colors"
          >
            <Calculator className="h-6 w-6 text-accent" aria-hidden="true" />
            <span>MortgageCalc</span>
          </Link>

          <ul className="flex items-center gap-6" role="list">
            <li>
              <Link
                to="/"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
              >
                <Home className="h-4 w-4" aria-hidden="true" />
                <span className="hidden sm:inline">Calculator</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
