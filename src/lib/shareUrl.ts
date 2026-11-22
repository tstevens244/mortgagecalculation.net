// Calculator inputs in the page URL, so a scenario can be bookmarked or shared
// (e.g. /?price=450000&down=45000&rate=6.25&term=30). The canonical tag on every
// page points to the clean URL, so these links don't create duplicate pages for
// search engines.

/** Numeric query parameters present in the current URL. Missing or invalid ones are left out. */
export function readNumberParams<K extends string>(keys: readonly K[]): Partial<Record<K, number>> {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const out: Partial<Record<K, number>> = {};
  for (const k of keys) {
    const raw = params.get(k);
    if (raw === null || raw.trim() === "") continue;
    const n = Number(raw);
    if (Number.isFinite(n) && n >= 0) out[k] = n;
  }
  return out;
}

/** The current page's URL with these values as its query string. */
export function urlWith(values: Record<string, number>): string {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(values)) params.set(k, String(Math.round(v * 1000) / 1000));
  const { origin, pathname } = window.location;
  return `${origin}${pathname}?${params.toString()}`;
}

/** Replace the address bar URL without adding a history entry or reloading. */
export function replaceUrl(values: Record<string, number>) {
  const url = new URL(urlWith(values));
  window.history.replaceState(window.history.state, "", `${url.pathname}${url.search}${window.location.hash}`);
}

/** Copy text to the clipboard, falling back to a hidden textarea where the Clipboard API isn't available. */
export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const el = document.createElement("textarea");
      el.value = text;
      el.setAttribute("readonly", "");
      el.style.position = "fixed";
      el.style.opacity = "0";
      document.body.appendChild(el);
      el.select();
      const ok = document.execCommand("copy");
      el.remove();
      return ok;
    } catch {
      return false;
    }
  }
}
