import { Link, useLocation } from "react-router-dom";
import { BookOpen } from "lucide-react";
import { guidePath, guides } from "@/lib/guides";

/**
 * "Guides for this calculator": the articles that feature the current
 * calculator, so calculators and guides link to each other both ways.
 */
const RelatedGuides = ({ className = "mt-10" }: { className?: string }) => {
  const { pathname } = useLocation();
  const path = pathname.endsWith("/") ? pathname : `${pathname}/`;
  const picks = guides.filter((g) => g.calculators.includes(path)).slice(0, 4);
  if (!picks.length) return null;

  return (
    <nav aria-labelledby="related-guides-heading" className={className} data-no-toc>
      <h2 id="related-guides-heading" className="mb-4 text-xl font-display font-semibold text-foreground">
        Guides for this calculator
      </h2>
      <ul className="grid gap-3 sm:grid-cols-2" role="list">
        {picks.map((g) => (
          <li key={g.slug}>
            <Link
              to={guidePath(g)}
              className="group flex h-full gap-3 rounded-2xl border border-border bg-card p-4 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/15 text-accent-strong">
                <BookOpen className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-foreground group-hover:text-primary">{g.title}</span>
                <span className="mt-1 block text-xs leading-snug text-muted-foreground">{g.summary}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default RelatedGuides;
