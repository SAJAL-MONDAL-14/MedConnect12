#!/usr/bin/env node
/**
 * Mobile regression audit.
 *
 * For every registered route, at each configured viewport width:
 *   - Loads the page against a running dev server (default http://localhost:8080).
 *   - Fails if <html>/<body> scrollWidth exceeds viewport width (horizontal page overflow).
 *   - Collects any *descendant* element whose right edge extends past the viewport,
 *     excluding ancestors that opt into horizontal scroll (overflow-x auto/scroll).
 *   - Writes a per-route Markdown report + PNG screenshots to ./mobile-audit/.
 *
 * Usage:
 *   BASE_URL=http://localhost:8080 node scripts/mobile-audit.mjs
 *   node scripts/mobile-audit.mjs --update-snapshots   # refresh visual baseline
 *   node scripts/mobile-audit.mjs --widths=360,375,640,768
 *
 * CI: see .github/workflows/mobile-regression.yml
 */
import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";

const BASE_URL = process.env.BASE_URL || "http://localhost:8080";
const OUT_DIR  = process.env.OUT_DIR  || "mobile-audit";
const args = new Set(process.argv.slice(2));
const widthsArg = process.argv.find((a) => a.startsWith("--widths="));
const WIDTHS = widthsArg
  ? widthsArg.split("=")[1].split(",").map(Number)
  : [360, 375, 640, 768];
const UPDATE_SNAPSHOTS = args.has("--update-snapshots");

const ROUTES = [
  "/", "/search", "/login", "/profile", "/labs", "/sos",
  "/clinics", "/booking", "/booking-success",
  "/admin/login", "/admin/dashboard", "/admin/hospitals",
  "/clinic/apply", "/clinic/login", "/clinic/dashboard",
  "/staff/login",
  "/staff/dashboard/admin", "/staff/dashboard/opd",
  "/staff/dashboard/ward",  "/staff/dashboard/billing",
  "/hospital-doctor/login", "/hospital-doctor/dashboard",
  "/hospital-doctor/complete-profile", "/hospital-doctor/onboarding",
  "/doctors", "/doctors/d1",
  "/hospital/h1",
  "/hospital/register", "/hospital/register/success",
];

const slug = (r, w) =>
  `${r.replace(/^\//, "").replace(/[/:]/g, "_") || "home"}@${w}`;

// Runs in the browser: finds overflowing descendants, skipping intentional
// horizontal scrollers (overflow-x auto/scroll on ancestors).
const OVERFLOW_PROBE = `(() => {
  const vw = document.documentElement.clientWidth;
  const pageOverflow = Math.max(
    document.documentElement.scrollWidth,
    document.body.scrollWidth,
  ) - vw;
  const hits = [];
  const isScroller = (el) => {
    const s = getComputedStyle(el);
    return s.overflowX === "auto" || s.overflowX === "scroll";
  };
  const insideScroller = (el) => {
    for (let p = el.parentElement; p; p = p.parentElement) {
      if (isScroller(p)) return true;
    }
    return false;
  };
  const all = document.body.querySelectorAll("*");
  for (const el of all) {
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    const overflow = r.right - vw;
    if (overflow <= 1) continue;
    if (insideScroller(el)) continue;
    const cs = getComputedStyle(el);
    hits.push({
      tag: el.tagName.toLowerCase(),
      id: el.id || null,
      cls: (el.getAttribute("class") || "").slice(0, 140),
      right: Math.round(r.right),
      overflow: Math.round(overflow),
      rules: {
        width: cs.width, minWidth: cs.minWidth, maxWidth: cs.maxWidth,
        display: cs.display, position: cs.position,
        whiteSpace: cs.whiteSpace, overflowX: cs.overflowX,
      },
    });
    if (hits.length >= 25) break;
  }
  return { vw, pageOverflow, hits };
})()`;

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });
  const browser = await chromium.launch();
  const results = [];
  let failed = 0;

  for (const width of WIDTHS) {
    const context = await browser.newContext({
      viewport: { width, height: 900 },
      deviceScaleFactor: 2,
    });
    for (const route of ROUTES) {
      const page = await context.newPage();
      const url = BASE_URL + route;
      let probe = { vw: width, pageOverflow: 0, hits: [] };
      let error = null;
      try {
        await page.goto(url, { waitUntil: "networkidle", timeout: 20_000 });
        await page.waitForTimeout(300);
        probe = await page.evaluate(OVERFLOW_PROBE);
      } catch (e) { error = String(e.message || e); }

      const shotDir = path.join(OUT_DIR, "screenshots", String(width));
      await fs.mkdir(shotDir, { recursive: true });
      const shot = path.join(shotDir, `${slug(route, width)}.png`);
      try { await page.screenshot({ path: shot }); } catch {}

      const pageFail = probe.pageOverflow > 1;
      if (pageFail) failed++;
      results.push({ width, route, ...probe, error, pageFail, shot });
      await page.close();
    }
    await context.close();
  }
  await browser.close();

  // Write markdown report
  const lines = [
    `# Mobile audit — ${new Date().toISOString()}`,
    ``,
    `Base URL: \`${BASE_URL}\``,
    `Widths tested: ${WIDTHS.join(", ")}px`,
    `Routes tested: ${ROUTES.length}`,
    `Page-overflow failures: **${failed}**`,
    ``,
    `A failure means the whole page scrolls sideways (bad).`,
    `"Tight layouts" are descendants that overflow but sit inside no scroller — they may or may not be a bug (e.g. absolute-positioned decorative blobs clipped by an ancestor).`,
    ``,
  ];
  for (const width of WIDTHS) {
    lines.push(`## Viewport ${width}px`, ``);
    const rows = results.filter((r) => r.width === width);
    for (const r of rows) {
      const status = r.error ? "⚠️ error"
        : r.pageFail ? `❌ page overflow +${r.pageOverflow}px`
        : r.hits.length ? `⚠️ ${r.hits.length} tight element(s)`
        : "✅ clean";
      lines.push(`### \`${r.route}\` — ${status}`);
      if (r.error) lines.push(`> ${r.error}`);
      if (r.hits.length) {
        lines.push(``, `| tag | class (truncated) | right | +overflow | width | min-width | white-space |`);
        lines.push(`| --- | --- | --- | --- | --- | --- | --- |`);
        for (const h of r.hits.slice(0, 8)) {
          lines.push(`| \`${h.tag}\` | \`${h.cls || "—"}\` | ${h.right} | ${h.overflow} | ${h.rules.width} | ${h.rules.minWidth} | ${h.rules.whiteSpace} |`);
        }
      }
      lines.push(``);
    }
  }
  const report = path.join(OUT_DIR, "REPORT.md");
  await fs.writeFile(report, lines.join("\n"));

  // JSON for machine-readable diffing
  await fs.writeFile(path.join(OUT_DIR, "report.json"), JSON.stringify(results, null, 2));

  // Visual-regression: compare screenshot hashes vs baseline
  const baseline = path.join(OUT_DIR, "baseline.json");
  const crypto = await import("node:crypto");
  const hashes = {};
  for (const r of results) {
    try {
      const buf = await fs.readFile(r.shot);
      hashes[`${r.width}:${r.route}`] = crypto.createHash("sha256").update(buf).digest("hex");
    } catch {}
  }
  if (UPDATE_SNAPSHOTS) {
    await fs.writeFile(baseline, JSON.stringify(hashes, null, 2));
    console.log(`Baseline updated: ${baseline}`);
  } else {
    let visualDrift = 0;
    try {
      const prev = JSON.parse(await fs.readFile(baseline, "utf8"));
      for (const k of Object.keys(hashes)) {
        if (prev[k] && prev[k] !== hashes[k]) visualDrift++;
      }
      console.log(`Visual drift vs baseline: ${visualDrift} route(s).`);
    } catch { /* no baseline yet */ }
  }

  console.log(`Report: ${report}`);
  console.log(`Screenshots: ${OUT_DIR}/screenshots/<width>/`);
  if (failed > 0) {
    console.error(`FAIL: ${failed} route(s) have horizontal page overflow.`);
    process.exit(1);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });