import { Link, useLocation } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { allCalculators, findCalculator } from "@/lib/calculators";
import RelatedGuides from "./RelatedGuides";

// Often-useful next steps, shown after the page's own group runs out.
const FALLBACK = ["/house-affordability/", "/", "/refinance-calculator/", "/extra-mortgage-payments-calculator/"];

/** "Related calculators": others in the same group, then common next steps. */
const RelatedCalculators = () => {
  const { pathname } = useLocation();
  const found = findCalculator(pathname);
  if (!found) return null;

  const current = found.calculator.path;
  const picks = [
    ...found.group.calculators.filter((c) => c.path !== current),
    ...FALLBACK.map((p) => allCalculators.find((c) => c.path === p)!).filter((c) => c && c.path !== current),
  ].filter((c, i, arr) => arr.findIndex((x) => x.path === c.path) === i).slice(0, 4);

  return (
    <nav id="related-calculators" aria-labelledby="related-heading" className="mt-12">
      <h2 id="related-heading" className="mb-4 text-xl font-display font-semibold text-foreground">
        Related calculators
      </h2>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4" role="list">
        {picks.map((calc) => (
          <li key={calc.path}>
            <Link
              to={calc.path}
              className="group flex h-full flex-col rounded-2xl border border-border bg-card p-4 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
            >
              <span className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <calc.icon className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="flex items-center gap-1 text-sm font-semibold text-foreground">
                {calc.name}
                <ArrowRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
              </span>
              <span className="mt-1 text-xs leading-snug text-muted-foreground">{calc.description}</span>
            </Link>
          </li>
        ))}
      </ul>
      <RelatedGuides />
    </nav>
  );
};

export default RelatedCalculators;
