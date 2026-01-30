import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const container = document.getElementById("root")!;

// IMPORTANT: Do not hydrate react-snap output.
// react-snap writes static HTML generated from a previous client render.
// Hydration can fail (React 18 errors) because IDs/markup are not guaranteed
// to match on the next render (e.g., Radix/React useId).
createRoot(container).render(<App />);
