// Generates public/og-image.png (1200x630), the image shown when a page is
// shared on social media. Run manually after changing the design:
//   node scripts/make-og-image.cjs
const path = require("path");
const fs = require("fs");
const puppeteer = require("puppeteer-core");

const chrome =
  process.env.PUPPETEER_EXECUTABLE_PATH ||
  ["/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", "/usr/bin/google-chrome", "/usr/bin/chromium"].find((p) => fs.existsSync(p));

const html = `<!doctype html><html><head><style>
  body { margin:0; width:1200px; height:630px; display:flex; flex-direction:column; justify-content:center;
         padding:0 96px; box-sizing:border-box; background:#1e3a5f; color:#fff;
         font-family: Georgia, 'Times New Roman', serif; }
  .tag { font: 600 26px/1 -apple-system, 'Helvetica Neue', Arial, sans-serif; letter-spacing:.08em;
         text-transform:uppercase; color:#f5b942; margin-bottom:28px; }
  h1 { font-size:76px; line-height:1.05; margin:0 0 28px; font-weight:700; }
  p { font: 400 32px/1.4 -apple-system, 'Helvetica Neue', Arial, sans-serif; color:#d6e2f0; margin:0; max-width:900px; }
  .bar { position:absolute; left:0; bottom:0; height:14px; width:100%; background:#f5b942; }
</style></head><body>
  <div class="tag">MortgageCalculation.net</div>
  <h1>Free mortgage calculators</h1>
  <p>Payments, FHA, VA, USDA, refinance, HELOC and affordability, with ${new Date().getFullYear()} loan limits.</p>
  <div class="bar"></div>
</body></html>`;

(async () => {
  const browser = await puppeteer.launch({ executablePath: chrome, headless: true, args: ["--no-sandbox"] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 630 });
  await page.setContent(html);
  const out = path.join(__dirname, "..", "public", "og-image.png");
  await page.screenshot({ path: out });
  await browser.close();
  console.log("wrote", out);
})();
