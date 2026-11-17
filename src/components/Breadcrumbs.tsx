import { Link, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { findCalculator } from "@/lib/calculators";

/** Home › Group › Calculator, shown above a calculator's heading. Matches the BreadcrumbList schema. */
const Breadcrumbs = () => {
  const { pathname } = useLocation();
  const found = findCalculator(pathname);
  if (!found || found.calculator.path === "/") return null;

  return (
    <nav aria-label="Breadcrumb" className="mb-3">
      <ol className="flex flex-wrap items-center justify-center gap-1 text-sm text-muted-foreground">
        <li>
          <Link to="/" className="hover:text-foreground hover:underline">
            Home
          </Link>
        </li>
        <li aria-hidden="true">
          <ChevronRight className="h-3.5 w-3.5" />
        </li>
        <li>
          <Link to="/#calculators" className="hover:text-foreground hover:underline">
            {found.group.title}
          </Link>
        </li>
        <li aria-hidden="true">
          <ChevronRight className="h-3.5 w-3.5" />
        </li>
        <li aria-current="page" className="font-medium text-foreground">
          {found.calculator.shortName}
        </li>
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
