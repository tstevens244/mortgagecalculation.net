import { useEffect, useRef, useState } from "react";
import { formatCurrency } from "@/lib/formatters";

const DURATION = 450;
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/**
 * A number that glides to its new value when it changes, instead of jumping.
 * The first render shows the final value (so the prerendered page and the
 * first paint are exact), and people who prefer reduced motion get no animation.
 */
export function useAnimatedNumber(target: number): number {
  const [shown, setShown] = useState(target);
  const from = useRef(target);
  const frame = useRef<number>();

  useEffect(() => {
    if (!Number.isFinite(target) || prefersReducedMotion()) {
      from.current = target;
      setShown(target);
      return;
    }
    const start = performance.now();
    const origin = from.current;
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / DURATION);
      const value = origin + (target - origin) * easeOutCubic(t);
      from.current = value;
      setShown(value);
      if (t < 1) frame.current = requestAnimationFrame(step);
    };
    cancelAnimationFrame(frame.current ?? 0);
    frame.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame.current ?? 0);
  }, [target]);

  return shown;
}

/** Whole-dollar amount that animates between values. Screen readers get the final value only. */
export const AnimatedCurrency = ({ value, className }: { value: number; className?: string }) => {
  const shown = useAnimatedNumber(value);
  return (
    <span className={className}>
      <span aria-hidden="true">{formatCurrency(shown)}</span>
      <span className="sr-only">{formatCurrency(value)}</span>
    </span>
  );
};

export default AnimatedCurrency;
