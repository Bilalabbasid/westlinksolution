const { chromium } = require("playwright");
const BASE = process.env.BASE || "http://localhost:3100";
const OUT = "C:/Users/bilal.abbasi/Desktop/westlink/docs/screenshots";
const posts = [
  "/blog/how-to-vet-a-lead-generation-company",
  "/blog/how-much-can-you-pay-per-lead",
  "/blog/tcpa-consent-for-lead-buyers-2026",
];
(async () => {
  const b = await chromium.launch();
  let fails = 0;
  const check = (ok, label) => { if (!ok) fails++; console.log((ok ? "PASS " : "FAIL ") + label); };
  // Collect every internal link from the new posts and confirm each resolves.
  const links = new Set();
  for (const width of [1366, 375]) {
    for (const path of posts) {
      const p = await b.newPage({ viewport: { width, height: 900 } });
      const errs = [];
      p.on("console", (m) => m.type() === "error" && errs.push(m.text().slice(0, 160)));
      p.on("pageerror", (e) => errs.push(String(e).slice(0, 160)));
      const r = await p.goto(BASE + path, { waitUntil: "networkidle" });
      await p.waitForTimeout(500);
      const info = await p.evaluate(() => ({
        h1: document.querySelectorAll("h1").length,
        h2: document.querySelectorAll("#post-body h2").length,
        words: document.querySelector("#post-body").innerText.split(/\s+/).length,
        overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
        desc: (document.querySelector("meta[name=description]")?.content || "").length,
        ctas: document.querySelectorAll("#post-body aside button").length,
        links: [...document.querySelectorAll("#post-body a[href^='/']")].map((a) => a.getAttribute("href")),
        underlinedButtons: [...document.querySelectorAll("#post-body aside a")].filter((a) => getComputedStyle(a).textDecorationLine.includes("underline")).length,
      }));
      info.links.forEach((l) => links.add(l.split("#")[0] || "/"));
      check(
        r.status() === 200 && info.h1 === 1 && !info.overflow && errs.length === 0 && info.desc > 50 && info.desc <= 165 && info.ctas === 1 && info.underlinedButtons === 0,
        `${width} ${path} words=${info.words} h2=${info.h2} desc=${info.desc} ctas=${info.ctas} overflow=${info.overflow} errs=${errs.length} ${errs[0] || ""}`,
      );
      if (width === 1366) {
        // The in-article CTA opens the application modal.
        await p.locator("#post-body aside").getByRole("button", { name: /Become a Partner/ }).click();
        const dialog = p.getByRole("dialog");
        await dialog.waitFor({ timeout: 5000 }).catch(() => {});
        check(await dialog.isVisible(), `${path} in-article CTA opens the application`);
        await p.keyboard.press("Escape");
        if (path.endsWith("pay-per-lead")) await p.screenshot({ path: `${OUT}/blog-cta-desktop.png`, fullPage: true });
      }
      await p.close();
    }
  }
  const p = await b.newPage();
  for (const l of links) {
    const r = await p.goto(BASE + l);
    check(r.status() === 200, `internal link ${l} -> ${r.status()}`);
  }
  const idx = await p.goto(BASE + "/blog", { waitUntil: "networkidle" });
  const cards = await p.evaluate(() => [...document.querySelectorAll("a[href^='/blog/']")].length);
  check(idx.status() === 200 && cards >= 6, `blog index lists ${cards} posts`);
  const sm = await (await p.goto(BASE + "/sitemap.xml")).text();
  check(posts.every((x) => sm.includes(x)), `sitemap includes new posts (${(sm.match(/<loc>/g) || []).length} urls)`);
  await b.close();
  console.log(fails ? `${fails} FAILED` : "ALL PASS");
})();
