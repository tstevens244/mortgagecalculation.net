import { useCallback, useSyncExternalStore } from "react";
import { states } from "./states.ts";

/*
 * The visitor's state, for local home prices, taxes and insurance.
 *
 * Detected once from the IP address (approximate, state level) with GeoJS, a free
 * lookup service, then remembered in this browser for a week. A state picked by
 * hand is remembered until changed. Nothing is sent to our servers. The lookup is
 * skipped when the browser sends Global Privacy Control, and the calculators fall
 * back to national figures whenever the state is unknown or outside the U.S.
 */

const KEY = "mc:region:v1";
const LOOKUP_URL = "https://get.geojs.io/v1/ip/geo.json";
const IP_MAX_AGE = 7 * 86_400_000;

export type RegionSource = "ip" | "manual";

export interface RegionState {
  /** Two-letter state code, or null when unknown / U.S. average. */
  code: string | null;
  source: RegionSource | null;
  /** True once detection has finished (found or not). */
  ready: boolean;
  /** Bumped on every change; `byUser` says whether the visitor just picked it. */
  version: number;
  byUser: boolean;
}

const SERVER: RegionState = { code: null, source: null, ready: false, version: 0, byUser: false };
let current: RegionState = SERVER;
let started = false;
const listeners = new Set<() => void>();

function set(next: Partial<RegionState>) {
  current = { ...current, ...next, version: current.version + 1 };
  listeners.forEach((l) => l());
}

function read(): { code: string | null; source: RegionSource; at: number } | null {
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function write(code: string | null, source: RegionSource) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify({ code, source, at: Date.now() }));
  } catch {
    // Storage unavailable: the region still applies for this page view.
  }
}

const codeForName = (name: string | undefined) => states.find((s) => s.name.toLowerCase() === name?.trim().toLowerCase())?.code ?? null;

async function detect() {
  const saved = read();
  if (saved && (saved.source === "manual" || Date.now() - saved.at < IP_MAX_AGE)) {
    set({ code: saved.code, source: saved.source, ready: true, byUser: false });
    return;
  }
  const nav = navigator as Navigator & { globalPrivacyControl?: boolean };
  if (nav.globalPrivacyControl || nav.webdriver) {
    set({ ready: true, byUser: false });
    return;
  }
  try {
    const res = await fetch(LOOKUP_URL, { signal: AbortSignal.timeout(4000), credentials: "omit", referrerPolicy: "no-referrer" });
    const geo = (await res.json()) as { country_code?: string; region?: string };
    const code = geo.country_code === "US" ? codeForName(geo.region) : null;
    write(code, "ip");
    set({ code, source: "ip", ready: true, byUser: false });
  } catch {
    set({ ready: true, byUser: false });
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (!started && typeof window !== "undefined") {
    started = true;
    void detect();
  }
  return () => listeners.delete(listener);
}

/** Pick a state by hand (null for U.S. averages). */
export function setRegion(code: string | null) {
  write(code, "manual");
  set({ code, source: "manual", ready: true, byUser: true });
}

/** The visitor's state, detected on first use. Always null during the prerender. */
export function useRegion(): RegionState & { setRegion: (code: string | null) => void } {
  const state = useSyncExternalStore(
    subscribe,
    () => current,
    () => SERVER,
  );
  return { ...state, setRegion: useCallback(setRegion, []) };
}
