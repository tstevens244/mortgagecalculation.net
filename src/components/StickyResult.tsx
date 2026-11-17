import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

interface StickyResultProps {
  /** id of the full result card this bar summarizes. */
  targetId: string;
  label: string;
  value: string;
}

/**
 * On phones and tablets the calculator form comes before the results, so the
 * answer starts below the first screen. This bar pins the headline result to
 * the bottom of the screen until the full result card scrolls into view, and
 * jumps to it when tapped. Hidden on large screens, where results sit beside
 * the form.
 */
const StickyResult = ({ targetId, label, value }: StickyResultProps) => {
  const [resultBelowFold, setResultBelowFold] = useState(true);

  useEffect(() => {
    const target = document.getElementById(targetId);
    if (!target) return;
    const update = () => setResultBelowFold(target.getBoundingClientRect().top > window.innerHeight - 64);
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [targetId]);

  if (!resultBelowFold) return null;

  return (
    <button
      type="button"
      onClick={() => document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth", block: "start" })}
      className="lg:hidden fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-3 border-t border-primary/20 bg-primary px-4 py-3 text-left text-primary-foreground shadow-[0_-4px_12px_rgba(0,0,0,0.12)]"
    >
      <span className="min-w-0">
        <span className="block text-xs font-medium uppercase tracking-wide text-primary-foreground/80">{label}</span>
        <span className="block text-xl font-bold leading-tight">{value}</span>
      </span>
      <span className="flex shrink-0 items-center gap-1 text-sm font-medium">
        See breakdown
        <ChevronDown className="h-4 w-4" aria-hidden="true" />
      </span>
    </button>
  );
};

export default StickyResult;
