import { useCallback, useEffect, useState } from "react";

/*
 * Saved scenarios for side-by-side comparison. Kept in this browser only
 * (localStorage), so there's no account and nothing leaves the device. Storage can
 * be unavailable (private mode, blocked site data), so every access is guarded and
 * the feature simply holds scenarios in memory for the visit.
 */

export interface SavedScenario {
  id: string;
  savedAt: number;
  /** Inputs, as URL parameters, to reopen it. */
  params: Record<string, number>;
  /** Headline numbers for the comparison table. */
  summary: {
    price: number;
    down: number;
    rate: number;
    term: number;
    monthly: number;
    loan: number;
    totalInterest: number;
    cashToClose: number;
    payoff: string;
  };
}

export const MAX_SCENARIOS = 3;
const KEY = "mc:scenarios:v1";

function read(): SavedScenario[] {
  try {
    const raw = window.localStorage.getItem(KEY);
    const list = raw ? (JSON.parse(raw) as SavedScenario[]) : [];
    return Array.isArray(list) ? list.slice(0, MAX_SCENARIOS) : [];
  } catch {
    return [];
  }
}

function write(list: SavedScenario[]) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    // Storage unavailable: the list still works for this visit.
  }
}

/** Saved scenarios, synced across tabs. The newest replaces the oldest beyond MAX_SCENARIOS. */
export function useSavedScenarios() {
  const [list, setList] = useState<SavedScenario[]>([]);

  useEffect(() => {
    setList(read());
    const onStorage = (e: StorageEvent) => e.key === KEY && setList(read());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const update = useCallback((fn: (prev: SavedScenario[]) => SavedScenario[]) => {
    setList((prev) => {
      const next = fn(prev).slice(0, MAX_SCENARIOS);
      write(next);
      return next;
    });
  }, []);

  const save = useCallback(
    (s: Omit<SavedScenario, "id" | "savedAt">) =>
      update((prev) => {
        const key = JSON.stringify(s.params);
        if (prev.some((p) => JSON.stringify(p.params) === key)) return prev;
        return [{ ...s, id: Math.random().toString(36).slice(2, 10), savedAt: Date.now() }, ...prev];
      }),
    [update],
  );
  const remove = useCallback((id: string) => update((prev) => prev.filter((p) => p.id !== id)), [update]);
  const clear = useCallback(() => update(() => []), [update]);

  return { list, save, remove, clear };
}
