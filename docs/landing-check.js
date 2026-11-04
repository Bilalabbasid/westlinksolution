const { chromium } = require("playwright");
const fs = require("fs");
const BASE = process.env.BASE || "http://localhost:3100";
const OUT = "C:/Users/bilal.abbasi/Desktop/westlink/docs/screenshots";
const pages = [
  "/insurance-leads",
  "/home-services-leads",
  "/debt-settlement-leads",
  "/legal-intake-leads",
  "/pay-per-call-leads",
  "/live-transfer-leads",
  "/insurance-leads/final-expense-leads",
  "/insurance-leads/auto-insurance-leads",
  "/insurance-leads/medicare-leads",
  "/insurance-leads/health-insurance-leads",
  "/insurance-leads/life-insurance-leads",
  "/insurance-leads/home-insurance-leads",
  "/home-services-leads/hvac-leads",
  "/home-services-leads/plumbing-leads",
  "/home-services-leads/roofing-leads",
  "/debt-settlement-leads/debt-settlement-live-transfers",
  "/debt-settlement-leads/student-loan-leads",
  "/legal-intake-leads/mva-leads",
  "/legal-intake-leads/ssdi-leads",
  "/legal-intake-leads/mass-tort-leads",
  "/blog",
  "/blog/exclusive-vs-shared-leads",
  "/blog/speed-to-lead-first-five-minutes",
  "/",
];
(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const b = await chromium.launch();
  let fails = 0;
  for (const width of [1366, 375]) {
    for (const path of pages) {
      const p = await b.newPage({ viewport: { width, height: 900 } });
      const errs = [];
      p.on("console", (m) => m.type() === "error" && errs.push(m.text().slice(0, 160)));
      p.on("pageerror", (e) => errs.push(String(e).slice(0, 160)));
      const r = await p.goto(BASE + path, { waitUntil: "networkidle" });
      await p.waitForTimeout(600);
      await p.evaluate(() => document.querySelectorAll(".reveal").forEach((e) => e.classList.add("is-visible")));
      const info = await p.evaluate(() => ({
        h1: document.querySelectorAll("h1").length,
        title: document.title,
        overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
        ld: [...document.querySelectorAll('script[type="application/ld+json"]')].flatMap((s) => {
          try { const j = JSON.parse(s.textContent); return (j["@graph"] || [j]).map((n) => n["@type"]); } catch { return ["INVALID"]; }
        }),
        canonical: document.querySelector('link[rel=canonical]')?.getAttribute("href"),
        desc: (document.querySelector('meta[name=description]')?.content || "").length,
      }));
      const ok = r.status() === 200 && info.h1 === 1 && !info.overflow && errs.length === 0 && !info.ld.includes("INVALID") && info.desc > 50 && info.desc <= 165;
      if (!ok) fails++;
      console.log(`${ok ? "PASS" : "FAIL"} ${width} ${path} status=${r.status()} h1=${info.h1} overflow=${info.overflow} desc=${info.desc} ld=[${info.ld.join(",")}] errs=${errs.length} ${errs[0] || ""}`);
      if (width === 1366 && (path === "/insurance-leads/medicare-leads" || path === "/legal-intake-leads/mva-leads")) {
        await p.screenshot({ path: `${OUT}/landing${path.replace(/\//g, "-")}.png`, fullPage: true });
      }
      await p.close();
    }
  }
  const p = await b.newPage();
  const r404 = await p.goto(BASE + "/not-a-real-page");
  console.log("unknown slug status:", r404.status());
  const sm = await (await p.goto(BASE + "/sitemap.xml")).text();
  console.log("sitemap urls:", (sm.match(/<loc>[^<]+<\/loc>/g) || []).length);
  await b.close();
  console.log(fails ? `${fails} FAILED` : "ALL PASS");
})();
