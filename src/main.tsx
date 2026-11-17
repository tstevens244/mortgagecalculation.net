import { createRoot } from "react-dom/client";
// Self-hosted fonts (Latin subset, only the weights the site uses), so pages
// don't wait on a third-party font server.
import "@fontsource/inter/latin-400.css";
import "@fontsource/inter/latin-500.css";
import "@fontsource/inter/latin-600.css";
import "@fontsource/inter/latin-700.css";
import "@fontsource/playfair-display/latin-600.css";
import "@fontsource/playfair-display/latin-700.css";
import App from "./App.tsx";
import "./index.css";

const container = document.getElementById("root")!;

// The prerendered HTML is shown until the app loads, then replaced with a fresh
// client render. Hydrating instead would mismatch on date-based defaults (the
// loan start month) and Radix-generated ids, so it isn't used.
createRoot(container).render(<App />);
