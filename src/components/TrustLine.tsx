import { Link } from "react-router-dom";
import { CalendarCheck, BookOpen, UserCheck } from "lucide-react";
import { FIGURES_UPDATED } from "@/lib/figuresDate";
import { REVIEWER, formatLongDate } from "@/lib/site";

/**
 * Shown under each calculator's heading: when the figures (rates, home values,
 * loan limits) last changed, who reviewed the page (if anyone has), and a link to the methodology.
 */
const TrustLine = () => (
  <p className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
    <span className="inline-flex items-center gap-1">
      <CalendarCheck className="h-4 w-4" aria-hidden="true" />
      Figures updated <time dateTime={FIGURES_UPDATED}>{formatLongDate(FIGURES_UPDATED)}</time>
    </span>
    {REVIEWER && (
      <span className="inline-flex items-center gap-1">
        <UserCheck className="h-4 w-4" aria-hidden="true" />
        Reviewed by{" "}
        <Link to="/about/#expert-review" className="hover:underline">
          {REVIEWER.name}
        </Link>
        , {REVIEWER.credentials}
      </span>
    )}
    <Link to="/methodology/" className="inline-flex items-center gap-1 text-primary hover:underline">
      <BookOpen className="h-4 w-4" aria-hidden="true" />
      How we calculate
    </Link>
  </p>
);

export default TrustLine;
