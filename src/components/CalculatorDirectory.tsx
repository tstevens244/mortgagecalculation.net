import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { calculatorGroups } from "@/lib/calculators";

/** Every calculator, grouped by goal, as cards. Used on the homepage. */
const CalculatorDirectory = () => (
  <section id="calculators" aria-labelledby="calculators-heading" className="mt-16 scroll-mt-24">
    <div className="mb-8 text-center">
      <h2 id="calculators-heading" className="text-2xl sm:text-3xl font-display font-semibold text-foreground">
        Find the right calculator
      </h2>
      <p className="mt-2 text-muted-foreground">Pick what you're trying to do. Every calculator is free and runs in your browser.</p>
    </div>

    {/* One group per row until each group is wide enough for two columns of links. */}
    <div className="grid gap-6 lg:grid-cols-2">
      {calculatorGroups.map((group) => (
        <div key={group.id} className="calculator-card p-5 sm:p-6">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-display font-semibold text-foreground">
                <Link to={group.hubPath} className="hover:text-primary">
                  {group.title}
                </Link>
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">{group.description}</p>
            </div>
            <Link
              to={group.hubPath}
              className="flex shrink-0 items-center gap-1 pt-1 text-sm font-semibold text-primary hover:underline"
              aria-label={`See all calculators in ${group.title}`}
            >
              See all
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
          {/* Two columns of links only when each link gets at least 15rem. */}
          <ul className="grid gap-2 sm:grid-cols-[repeat(auto-fill,minmax(15rem,1fr))]" role="list">
            {group.calculators.map((calc) => (
              <li key={calc.path}>
                <Link
                  to={calc.path}
                  className="group flex h-full gap-3 rounded-xl border border-border bg-background/60 p-3 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:bg-card hover:shadow-md"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <calc.icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-foreground">
                      {calc.name}
                      <ArrowRight className="ml-1 inline h-3.5 w-3.5 align-[-2px] opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
                    </span>
                    <span className="mt-0.5 block text-xs leading-snug text-muted-foreground">{calc.description}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  </section>
);

export default CalculatorDirectory;
