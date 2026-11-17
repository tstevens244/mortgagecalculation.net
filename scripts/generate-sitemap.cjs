// Writes dist/sitemap.xml from scripts/routes.cjs. Each URL's <lastmod> is the
// most recent git commit date of the files that make up that page, so Google
// sees real change dates instead of one hardcoded date.
// In CI this needs full git history (actions/checkout with fetch-depth: 0).
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const { routes, SITE } = require("./routes.cjs");

const root = path.join(__dirname, "..");

function lastCommitDate(files) {
  const existing = files.filter((f) => fs.existsSync(path.join(root, f)));
  if (existing.length === 0) return null;
  try {
    const out = execFileSync("git", ["log", "-1", "--format=%cs", "--", ...existing], { cwd: root, encoding: "utf8" }).trim();
    return out || null;
  } catch {
    return null;
  }
}

const today = new Date().toISOString().slice(0, 10);
const urls = routes
  .filter((r) => r.indexed !== false)
  .map((r) => {
    const loc = r.path === "/" ? `${SITE}/` : `${SITE}${r.path}/`;
    // Files not committed yet (a new page in this build) get today's date.
    const lastmod = lastCommitDate(r.sources) || today;
    return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`;
  });

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`;
fs.writeFileSync(path.join(root, "dist", "sitemap.xml"), xml);
console.log(`sitemap.xml written with ${urls.length} URLs`);
