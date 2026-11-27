import { useEffect, useMemo, useRef, useState } from "react";
import { localCosts, type LocalCosts } from "./localCosts.ts";
import { useRegion } from "./region.ts";
import { isTouched, quietly } from "./urlState.ts";

interface Options {
  /** URL keys of the inputs `apply` fills. A link that sets any of them is left as it is. */
  keys: string[];
  /** False to never fill automatically (e.g. a state page with its own figures). */
  enabled?: boolean;
  /** Whether the visitor hasn't edited anything yet. Defaults to the URL-state "touched" flag. */
  untouched?: () => boolean;
}

/**
 * Local costs for the visitor's state, and a one-time fill of a calculator's
 * starting values with them.
 *
 * `apply` runs:
 * - once, automatically, when the state is known, if the page wasn't opened from a
 *   link with its own values and nothing has been edited. It runs "quietly", so the
 *   URL stays clean.
 * - every time the visitor picks a state by hand, even after editing.
 */
export function useLocalCosts(apply: (costs: LocalCosts, byUser: boolean) => void, { keys, enabled = true, untouched = () => !isTouched() }: Options) {
  const region = useRegion();
  const costs = useMemo(() => localCosts(region.code), [region.code]);
  const [hadParams] = useState(() => {
    if (typeof window === "undefined") return false;
    const p = new URLSearchParams(window.location.search);
    return keys.some((k) => p.has(k));
  });

  const applyRef = useRef(apply);
  applyRef.current = apply;
  const untouchedRef = useRef(untouched);
  untouchedRef.current = untouched;
  const seen = useRef(-1);
  const autoDone = useRef(false);

  useEffect(() => {
    if (!enabled || !region.ready || seen.current === region.version) return;
    const first = seen.current === -1;
    seen.current = region.version;
    if (region.byUser && !first) {
      applyRef.current(costs, true);
      return;
    }
    if (autoDone.current) return;
    autoDone.current = true;
    if (region.code === null || hadParams || !untouchedRef.current()) return;
    quietly(() => applyRef.current(costs, false));
  }, [enabled, region.ready, region.version, region.byUser, region.code, costs, hadParams]);

  return { costs, region };
}
