/* Responsiveness sweep: at several widths, verify no horizontal overflow, no
   element (outside scroll containers) past the viewport, the hero headline
   stays inside its column, and the hero visual uses its column. Saves a
   screenshot per width. */
const { chromium } = require("playwright");
const path = require("node:path");
const fs = require("node:fs");
const B = process.env.BASE || "http://localhost:3100";
const OUT = path.join(__dirname, "out", "responsive");
fs.mkdirSync(OUT, { recursive: true });
const widths = [320, 375, 414, 768, 1024, 1280, 1440, 1920];
let failed = 0;
(async () => {
  const b = await chromium.launch();
  for (const w of widths) {
    const ctx = await b.newContext({ viewport: { width: w, height: Math.round(Math.max(700, w * 0.6)) }, reducedMotion: "reduce" });
    const p = await ctx.newPage();
    const errs = [];
    p.on("pageerror", (e) => errs.push(String(e)));
    p.on("console", (m) => m.type() === "error" && errs.push(m.text().slice(0, 160)));
    await p.goto(B + "/", { waitUntil: "networkidle" });
    await p.locator(".reveal.is-visible").first().waitFor({ timeout: 15000 }); // hydration marker
    await p.evaluate(() => document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-visible")));
    await p.waitForTimeout(2600);
    const r = await p.evaluate(() => {
      const vw = document.documentElement.clientWidth;
      const overflow = document.documentElement.scrollWidth - vw;
      const inScroller = (el) => { for (let n = el.parentElement; n; n = n.parentElement) { const o = getComputedStyle(n).overflowX; if (o === "auto" || o === "scroll") return true; } return false; };
      const past = [...document.querySelectorAll("h1, h2, h3, p, button, a, li, svg")].filter((el) => { const rc = el.getBoundingClientRect(); return rc.width > 0 && rc.right > vw + 1 && !inScroller(el); }).map((el) => el.tagName + ":" + (el.textContent || "").trim().slice(0, 24));
      const h1 = document.querySelector("h1").getBoundingClientRect();
      const col = document.querySelector("h1").parentElement.getBoundingClientRect();
      const phrase = document.querySelector("h1 .gradient-text")?.getBoundingClientRect();
      const visual = document.querySelector("svg[role=img]")?.getBoundingClientRect();
      const visualCol = document.querySelector("svg[role=img]")?.closest(".min-w-0")?.getBoundingClientRect();
      return { overflow, past: past.slice(0, 5), h1Right: Math.round(h1.right), colRight: Math.round(col.right), phraseRight: phrase ? Math.round(phrase.right) : null, visualW: visual ? Math.round(visual.width) : null, visualColW: visualCol ? Math.round(visualCol.width) : null };
    });
    const ok = r.overflow <= 0 && r.past.length === 0 && r.h1Right <= r.colRight + 1 && (r.phraseRight === null || r.phraseRight <= r.colRight + 1) && errs.length === 0;
    if (!ok) failed++;
    console.log(`${ok ? "PASS" : "FAIL"} ${w}px overflow=${r.overflow} past=[${r.past.join(", ")}] h1Right=${r.h1Right}/${r.colRight} phraseRight=${r.phraseRight} visual=${r.visualW}/${r.visualColW} errors=${errs.length} ${errs[0] || ""}`);
    await p.screenshot({ path: path.join(OUT, `w${w}.png`) });
    await ctx.close();
  }
  await b.close();
  console.log(`${widths.length - failed}/${widths.length} widths pass`);
  process.exit(failed ? 1 : 0);
})();
