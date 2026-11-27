// Calculator inputs that live in the page URL, so any scenario can be bookmarked
// or shared. Drop-in replacements for useState:
//
//   const [price, setPrice] = useUrlParam("price", 400000);
//   const [inputs, setInputs] = useUrlState({ homePrice: 300000, loanTerm: 30 });
//
// A shared link opens with its values. Once someone changes an input the address
// bar follows (replaceState, no history entries); an untouched page keeps its
// clean URL. Canonical tags point to the clean URL, so search engines don't see
// these as separate pages.
import { useCallback, useEffect, useRef, useState, type Dispatch, type SetStateAction } from "react";

type Value = number | string | boolean;

// Every mounted calculator input, by its URL key.
const registry = new Map<string, string>();
let touched = false;
let timer: number | undefined;

const encode = (v: Value) => (typeof v === "boolean" ? (v ? "1" : "0") : typeof v === "number" ? String(Math.round(v * 1000) / 1000) : v);

function decode<T extends Value>(raw: string | null, fallback: T): T {
  if (raw === null || raw.trim() === "") return fallback;
  if (typeof fallback === "number") {
    const n = Number(raw);
    return (Number.isFinite(n) ? n : fallback) as T;
  }
  if (typeof fallback === "boolean") return (raw === "1" || raw === "true") as T;
  return raw as T;
}

const params = () => (typeof window === "undefined" ? new URLSearchParams() : new URLSearchParams(window.location.search));

/** The current page's URL carrying every registered input. */
export function shareLink(): string {
  const p = new URLSearchParams();
  registry.forEach((v, k) => p.set(k, v));
  const { origin, pathname } = window.location;
  return `${origin}${pathname}${registry.size ? `?${p.toString()}` : ""}`;
}

export const hasShareableState = () => registry.size > 0;

function scheduleWrite() {
  if (!touched || typeof window === "undefined") return;
  window.clearTimeout(timer);
  timer = window.setTimeout(() => {
    // Keep any other parameters (campaign tags and the like) that were already there.
    const p = params();
    registry.forEach((v, k) => p.set(k, v));
    const search = p.toString();
    window.history.replaceState(window.history.state, "", `${window.location.pathname}${search ? `?${search}` : ""}${window.location.hash}`);
  }, 400);
}

let quiet = false;

function markTouched() {
  if (!quiet) touched = true;
}

/**
 * Run setters without counting as an edit, for values filled in automatically
 * (such as local home prices). The URL stays clean until the visitor changes something.
 */
export function quietly(fn: () => void) {
  quiet = true;
  try {
    fn();
  } finally {
    quiet = false;
  }
}

/** Whether the visitor has changed any input on this page yet. */
export const isTouched = () => touched;

/** A single input stored in the URL under `key`. */
export function useUrlParam(key: string, initial: number): [number, Dispatch<SetStateAction<number>>];
export function useUrlParam(key: string, initial: boolean): [boolean, Dispatch<SetStateAction<boolean>>];
export function useUrlParam<T extends string = string>(key: string, initial: NoInfer<T>): [T, Dispatch<SetStateAction<T>>];
export function useUrlParam<T extends Value>(key: string, initial: T): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => decode(params().get(key), initial));
  useEffect(() => {
    registry.set(key, encode(value));
    scheduleWrite();
  }, [key, value]);
  useEffect(() => () => void registry.delete(key), [key]);
  const set = useCallback<Dispatch<SetStateAction<T>>>((next) => {
    markTouched();
    setValue(next);
  }, []);
  return [value, set];
}

/** An object of inputs, each stored in the URL under its own field name. */
export function useUrlState<T extends { [K in keyof T]: Value }>(initial: T, options: { exclude?: (keyof T)[] } = {}): [T, Dispatch<SetStateAction<T>>] {
  const exclude = useRef(new Set(options.exclude ?? []));
  const [state, setState] = useState<T>(() => {
    const p = params();
    const out = { ...initial };
    for (const k of Object.keys(initial) as (keyof T & string)[]) {
      if (!exclude.current.has(k)) out[k] = decode(p.get(k), initial[k]);
    }
    return out;
  });
  useEffect(() => {
    for (const [k, v] of Object.entries(state) as [keyof T & string, Value][]) if (!exclude.current.has(k)) registry.set(k, encode(v));
    scheduleWrite();
  }, [state]);
  useEffect(
    () => () => {
      for (const k of Object.keys(initial)) registry.delete(k);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  const set = useCallback<Dispatch<SetStateAction<T>>>((next) => {
    markTouched();
    setState(next);
  }, []);
  return [state, set];
}

/** Forget the "touched" flag when leaving a page, so the next page starts with a clean URL. */
export function resetUrlState() {
  touched = false;
  window.clearTimeout(timer);
}
