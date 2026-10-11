const { chromium } = require("playwright");
const path = require("node:path");
const B = "http://localhost:3100";
(async () => {
  const b = await chromium.launch();
  const settle = async (p) => {
    await p.locator(".reveal.is-visible").first().waitFor();
    await p.evaluate(() => document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-visible")));
    await p.waitForTimeout(1400);
    // Wait for a frame where the rotating headline phrase is fully visible.
    for (let i = 0; i < 40; i++) {
      const ok = await p.evaluate(() => { const el = document.querySelector("h1 .gradient-text"); return !el || getComputedStyle(el).opacity === "1"; });
      if (ok) break;
      await p.waitForTimeout(100);
    }
  };
  const d = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  const errors = [];
  d.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  await d.goto(B + "/", { waitUntil: "networkidle" }); await settle(d);
  await d.screenshot({ path: path.join(__dirname, "out", "after-hero.png") });
  await d.screenshot({ path: path.join(__dirname, "out", "after-desktop-full.png"), fullPage: true });
  await d.goto(B + "/terms", { waitUntil: "networkidle" }); await d.waitForTimeout(800);
  await d.screenshot({ path: path.join(__dirname, "out", "after-terms.png") });
  const m = await (await b.newContext({ viewport: { width: 375, height: 812 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true })).newPage();
  await m.goto(B + "/", { waitUntil: "networkidle" }); await settle(m);
  await m.screenshot({ path: path.join(__dirname, "out", "after-mobile-hero.png") });
  await m.screenshot({ path: path.join(__dirname, "out", "after-mobile-full.png"), fullPage: true });
  await m.getByRole("button", { name: "Open menu" }).click(); await m.waitForTimeout(300);
  await m.screenshot({ path: path.join(__dirname, "out", "after-mobile-menu.png") });
  await m.keyboard.press("Escape");
  await m.goto(B + "/privacy", { waitUntil: "networkidle" }); await m.waitForTimeout(800);
  await m.screenshot({ path: path.join(__dirname, "out", "after-mobile-privacy.png") });
  await b.close();
  console.log("after shots ok; console errors:", errors.length, errors.slice(0,3).join(" | "));
})();
