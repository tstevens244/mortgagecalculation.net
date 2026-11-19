// Verifies the prerendered HTML in dist/ has correct, non-duplicated SEO tags.
// Run after scripts/prerender.cjs. Exits non-zero on any problem so a bad
// prerender never gets deployed.
const fs = require("fs");
const path = require("path");
const { routes, SITE } = require("./routes.cjs");

const dist = path.join(__dirname, "..", "dist");
const problems = [];
const decode = (text) =>
  text
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ");
const titlesSeen = new Map();
const sitemap = fs.existsSync(path.join(dist, "sitemap.xml")) ? fs.readFileSync(path.join(dist, "sitemap.xml"), "utf8") : "";

for (const { path: route, indexed } of routes) {
  const file = route === "/" ? path.join(dist, "index.html") : path.join(dist, route, "index.html");
  if (!fs.existsSync(file)) {
    problems.push(`${route}: missing ${path.relative(dist, file)}`);
    continue;
  }
  const html = fs.readFileSync(file, "utf8");
  const head = html.split("</head>")[0];
  const expected = route === "/" ? `${SITE}/` : `${SITE}${route}/`;

  const canonicals = [...head.matchAll(/<link[^>]*rel="canonical"[^>]*>/g)].map((m) => (m[0].match(/href="([^"]+)"/) || [])[1]);
  const titles = [...head.matchAll(/<title[^>]*>([^<]*)<\/title>/g)].map((m) => m[1]);
  const descriptions = head.match(/<meta[^>]*name="description"[^>]*>/g) || [];
  const robots = (head.match(/<meta[^>]*name="robots"[^>]*content="([^"]*)"/) || [])[1] || "";
  const jsonLd = html.match(/application\/ld\+json/g) || [];
  const h1s = html.match(/<h1[\s>]/g) || [];

  if (canonicals.length !== 1) problems.push(`${route}: ${canonicals.length} canonical tags (${canonicals.join(", ")})`);
  else if (canonicals[0] !== expected) problems.push(`${route}: canonical is ${canonicals[0]}, expected ${expected}`);
  if (titles.length !== 1) problems.push(`${route}: ${titles.length} <title> tags`);
  if (descriptions.length !== 1) problems.push(`${route}: ${descriptions.length} meta descriptions`);
  if (jsonLd.length === 0) problems.push(`${route}: no JSON-LD structured data`);
  if (h1s.length !== 1) problems.push(`${route}: ${h1s.length} <h1> elements`);
  if (/\b2025\b/.test(titles[0] || "")) problems.push(`${route}: title mentions 2025`);

  // Google requires FAQ structured data to match questions visible on the page.
  const body = decode(html.slice(html.indexOf("</head>")).replace(/<script[\s\S]*?<\/script>/g, "").replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ");
  for (const block of html.matchAll(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/g)) {
    let data;
    try {
      data = JSON.parse(block[1]);
    } catch {
      problems.push(`${route}: invalid JSON-LD`);
      continue;
    }
    if (data["@type"] !== "FAQPage") continue;
    for (const q of data.mainEntity || []) {
      const name = decode(q.name).replace(/\s+/g, " ");
      if (!body.includes(name)) problems.push(`${route}: FAQ schema question not visible on page: "${name}"`);
    }
  }

  if (titles[0]) {
    if (titlesSeen.has(titles[0])) problems.push(`${route}: same title as ${titlesSeen.get(titles[0])}`);
    titlesSeen.set(titles[0], route);
  }

  const noindex = /noindex/.test(robots);
  if (indexed === false && !noindex) problems.push(`${route}: should be noindex`);
  if (indexed !== false && noindex) problems.push(`${route}: is noindex but listed as indexed`);
  if (sitemap && indexed !== false && !sitemap.includes(`<loc>${expected}</loc>`)) problems.push(`${route}: missing from sitemap.xml`);
}

if (problems.length) {
  console.error("SEO check failed:\n  " + problems.join("\n  "));
  process.exit(1);
}
console.log(`SEO check passed for ${routes.length} routes.`);
