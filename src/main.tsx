import { createRoot } from "react-dom/client";
// Self-hosted heading font (Latin subset, the two weights in use). Body text
// uses the system font stack: loading Inter as well re-rendered the main text
// after the font arrived and pushed LCP from about 1.9 s to 4.5 s on mobile.
import "@fontsource/playfair-display/latin-600.css";
import "@fontsource/playfair-display/latin-700.css";
import App from "./App.tsx";
import { preloadPage } from "./routes";
import "./index.css";

// After a deploy, an open or cached page can ask for code files from the
// previous build, which no longer exist. Reload once to get the new build
// instead of showing a broken page (Vite fires this event for failed lazy loads).
window.addEventListener("vite:preloadError", (event) => {
  const key = "reloaded-after-deploy";
  try {
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
  } catch {
    // Storage unavailable: still reload once for this page view.
  }
  event.preventDefault();
  window.location.reload();
});

const container = document.getElementById("root")!;

// The prerendered HTML stays on screen until the app renders over it. Load the
// current page's code first, so the first render is the complete page and the
// screen never flashes empty while a lazy chunk downloads.
// (Hydrating instead would mismatch on the date-based loan start month and on
// Radix-generated ids, so the page is re-rendered rather than hydrated.)
preloadPage(window.location.pathname).then(() => {
  createRoot(container).render(<App />);
  // The page loaded fine, so allow one reload again after a future deploy.
  window.setTimeout(() => {
    try {
      sessionStorage.removeItem("reloaded-after-deploy");
    } catch {
      // ignore
    }
  }, 10_000);
});
