// Prerenders every route in scripts/routes.cjs to static HTML in dist/.
//
// Replaces react-snap, which saved pages before react-helmet-async had written
// each page's <head> tags (Helmet waits for requestAnimationFrame). That left
// many pages with the homepage's title and canonical. This script waits until
// the page's own canonical, title and structured data are in place, and fails
// the build if they never appear.
const fs = require("fs");
const http = require("http");
const path = require("path");
const puppeteer = require("puppeteer-core");
const { routes, SITE } = require("./routes.cjs");

const DIST = path.join(__dirname, "..", "dist");
const SHELL = fs.readFileSync(path.join(DIST, "index.html"), "utf8");
const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".svg": "image/svg+xml",
  ".xml": "application/xml",
  ".txt": "text/plain",
  ".woff2": "font/woff2",
};

function findChrome() {
  if (process.env.PUPPETEER_EXECUTABLE_PATH) return process.env.PUPPETEER_EXECUTABLE_PATH;
  const candidates = [
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/usr/bin/google-chrome",
    "/usr/bin/google-chrome-stable",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
  ];
  const found = candidates.find((p) => fs.existsSync(p));
  if (!found) throw new Error("Chrome not found. Set PUPPETEER_EXECUTABLE_PATH.");
  return found;
}

// Serves dist/ like GitHub Pages, but always answers page routes with the
// original SPA shell so each route renders from a clean client-side start.
function startServer() {
  const server = http.createServer((req, res) => {
    const urlPath = decodeURIComponent(new URL(req.url, "http://x").pathname);
    const file = path.join(DIST, urlPath);
    if (path.extname(urlPath) && file.startsWith(DIST) && fs.existsSync(file) && fs.statSync(file).isFile()) {
      res.writeHead(200, { "Content-Type": TYPES[path.extname(file)] || "application/octet-stream" });
      fs.createReadStream(file).pipe(res);
      return;
    }
    res.writeHead(200, { "Content-Type": TYPES[".html"] });
    res.end(SHELL);
  });
  return new Promise((resolve) => server.listen(0, "127.0.0.1", () => resolve(server)));
}

async function main() {
  const server = await startServer();
  const base = `http://127.0.0.1:${server.address().port}`;
  const browser = await puppeteer.launch({
    executablePath: findChrome(),
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const failures = [];

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 900 });
    // Third-party requests (fonts, the chatbot backend) aren't needed for the snapshot.
    await page.setRequestInterception(true);
    page.on("request", (r) => (r.url().startsWith(base) ? r.continue() : r.abort()));
    page.on("pageerror", (err) => failures.push(`${page.url()}: ${err.message}`));

    for (const { path: route } of routes) {
      const urlPath = route === "/" ? "/" : `${route}/`;
      const expected = `${SITE}${urlPath}`;
      await page.goto(base + urlPath, { waitUntil: "networkidle0" });
      try {
        await page.waitForFunction(
          (canonical) => {
            const link = document.querySelector('link[rel="canonical"]');
            return (
              link &&
              link.getAttribute("href") === canonical &&
              document.querySelectorAll('link[rel="canonical"]').length === 1 &&
              document.querySelector("h1") &&
              document.querySelector('script[type="application/ld+json"]')
            );
          },
          { timeout: 20000 },
          expected,
        );
      } catch {
        failures.push(`${route}: page never rendered its own canonical (${expected}), <h1> and JSON-LD`);
        continue;
      }

      // Vite adds <link rel="modulepreload"> tags as lazy chunks load. Keep the
      // route's own code, but drop the chart chunks so the saved page doesn't
      // download recharts before it's needed.
      const html = await page.evaluate(() => {
        document
          .querySelectorAll('link[rel="modulepreload"]')
          .forEach((l) => {
            if (/(PaymentPie|AmortizationChartView|generateCategoricalChart|PieChart|BarChart|AreaChart|LineChart|ComposedChart)-/.test(l.getAttribute("href") || "")) l.remove();
          });
        return "<!doctype html>\n" + document.documentElement.outerHTML;
      });
      const outDir = route === "/" ? DIST : path.join(DIST, route);
      fs.mkdirSync(outDir, { recursive: true });
      fs.writeFileSync(path.join(outDir, "index.html"), html);
      console.log(`prerendered ${urlPath}`);
    }
  } finally {
    await browser.close();
    server.close();
  }

  if (failures.length) {
    console.error("Prerender failed:\n  " + failures.join("\n  "));
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Prerender failed:", err);
  process.exit(1);
});
