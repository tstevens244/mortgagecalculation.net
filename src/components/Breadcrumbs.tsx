import { Fragment } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { findCalculator, findHub } from "@/lib/calculators";

interface Step {
  label: string;
  to?: string;
}

/**
 * Home › Hub › Calculator above a calculator's heading, or Home › Hub on a hub
 * page. Pages outside the calculator groups pass their own `trail`. Matches the
 * BreadcrumbList schema on those pages.
 */
const Breadcrumbs = ({ trail: given }: { trail?: Step[] } = {}) => {
  const { pathname } = useLocation();
  const found = findCalculator(pathname);
  const hub = findHub(pathname);

  let trail: Step[];
  if (given) {
    trail = given;
  } else if (found && found.calculator.path !== "/") {
    trail = [{ label: found.group.hubName, to: found.group.hubPath }, { label: found.calculator.shortName }];
  } else if (hub) {
    trail = [{ label: hub.hubName }];
  } else {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className="mb-3">
      <ol className="flex flex-wrap items-center justify-center gap-1 text-sm text-muted-foreground">
        <li>
          <Link to="/" className="hover:text-foreground hover:underline">
            Home
          </Link>
        </li>
        {trail.map((step) => (
          <Fragment key={step.label}>
            <li aria-hidden="true">
              <ChevronRight className="h-3.5 w-3.5" />
            </li>
            {step.to ? (
              <li>
                <Link to={step.to} className="hover:text-foreground hover:underline">
                  {step.label}
                </Link>
              </li>
            ) : (
              <li aria-current="page" className="font-medium text-foreground">
                {step.label}
              </li>
            )}
          </Fragment>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
