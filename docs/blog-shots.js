const { chromium } = require("playwright");
const fs = require("fs");
(async () => {
  const out = "C:/Users/bilal.abbasi/Desktop/westlink/docs/screenshots";
  fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch();
  const shots = [
    ["blog-index-desktop", 1366, "/blog"],
    ["blog-post-desktop", 1366, "/blog/pay-per-call-vs-live-transfers-vs-web-leads"],
    ["blog-post-mobile", 375, "/blog/pay-per-call-vs-live-transfers-vs-web-leads"],
  ];
  const errors = [];
  for (const [name, w, path] of shots) {
    const p = await b.newPage({ viewport: { width: w, height: 900 } });
    p.on("console", (m) => { if (m.type() === "error") errors.push(name + ": " + m.text()); });
    await p.goto((process.env.BASE || "http://localhost:3100") + path, { waitUntil: "networkidle" });
    await p.waitForSelector(".reveal.is-visible, #post-body", { timeout: 10000 }).catch(() => {});
    await p.evaluate(() => document.querySelectorAll(".reveal").forEach((e) => e.classList.add("is-visible")));
    await p.waitForTimeout(800);
    const overflow = await p.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    const tw = await p.evaluate(() => { const t = document.querySelector(".table-wrap"); return t ? [t.scrollWidth, t.clientWidth] : null; });
    await p.screenshot({ path: `${out}/${name}.png`, fullPage: true });
    console.log(name, "pageOverflow:", overflow, "table:", tw);
    await p.close();
  }
  const p = await b.newPage();
  const r = await p.goto("" + (process.env.BASE || "http://localhost:3100") + "/blog/does-not-exist");
  console.log("missing slug status:", r.status());
  const sm = await (await p.goto("" + (process.env.BASE || "http://localhost:3100") + "/sitemap.xml")).text();
  console.log("sitemap blog urls:", (sm.match(/\/blog[^<]*/g) || []));
  console.log("console errors:", errors.length ? errors : "none");
  await b.close();
})();
