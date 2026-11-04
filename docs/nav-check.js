const { chromium } = require("playwright");
const BASE = process.env.BASE || "http://localhost:3100";
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1366, height: 900 } });
  const errs = [];
  p.on("console", (m) => m.type() === "error" && errs.push(m.text().slice(0, 200)));
  p.on("pageerror", (e) => errs.push(String(e).slice(0, 200)));
  let fails = 0;
  const check = (ok, label) => { if (!ok) fails++; console.log((ok ? "PASS " : "FAIL ") + label); };

  // 1. Explore industries from the top of the page
  await p.goto(BASE + "/", { waitUntil: "networkidle" });
  await p.getByRole("link", { name: "Explore industries" }).click();
  await p.waitForTimeout(1200);
  let top = await p.evaluate(() => document.getElementById("industries").getBoundingClientRect().top);
  check(top >= 0 && top < 200, `explore industries scrolls (top=${Math.round(top)}) hash=${await p.evaluate(() => location.hash)}`);

  // 2. Scroll back to top with the hash still set, click again
  await p.evaluate(() => window.scrollTo(0, 0));
  await p.waitForTimeout(300);
  await p.getByRole("link", { name: "Explore industries" }).click();
  await p.waitForTimeout(1200);
  top = await p.evaluate(() => document.getElementById("industries").getBoundingClientRect().top);
  check(top >= 0 && top < 200, `second click with same hash still scrolls (top=${Math.round(top)})`);

  // 3. Header nav "FAQ" then "Industries" while hash already set
  await p.evaluate(() => window.scrollTo(0, 0));
  await p.locator('nav[aria-label="Primary"]').getByRole("link", { name: "Industries" }).click();
  await p.waitForTimeout(1200);
  top = await p.evaluate(() => document.getElementById("industries").getBoundingClientRect().top);
  check(top >= 0 && top < 200, `header Industries link scrolls (top=${Math.round(top)})`);

  // 4. Home Services tab, then HVAC tile navigates to the product page
  await p.getByRole("tab", { name: /Home Services/ }).click();
  await p.waitForTimeout(600);
  const hvac = p.getByRole("link", { name: /HVAC: see campaign details/ });
  check((await hvac.count()) === 1, "HVAC tile is a link");
  await hvac.click();
  await p.waitForURL("**/home-services-leads/hvac-leads", { timeout: 10000 }).catch(() => {});
  check(p.url().endsWith("/home-services-leads/hvac-leads"), `HVAC tile opens product page (${p.url()})`);
  await p.waitForSelector("h1", { timeout: 10000 }); await p.waitForTimeout(500);
  const visibleH1 = await p.evaluate(() => [...document.querySelectorAll("h1")].filter((h) => h.offsetParent !== null).length);
  check(visibleH1 === 1, `product page has one visible h1 (${visibleH1}; hidden ones belong to the previous route kept by Next for back navigation)`);

  // 5. From the product page, header "Industries" navigates home and lands on the section
  await p.locator('nav[aria-label="Primary"]').getByRole("link", { name: "Industries" }).click();
  await p.waitForURL("**/#industries", { timeout: 10000 }).catch(() => {});
  await p.waitForTimeout(1200);
  top = await p.evaluate(() => (document.getElementById("industries") || { getBoundingClientRect: () => ({ top: 9999 }) }).getBoundingClientRect().top);
  check(top >= -50 && top < 400, `cross-page Industries link lands on section (top=${Math.round(top)})`);

  // 6. Insurance tab shows life and home tiles as links
  await p.getByRole("tab", { name: /Insurance/ }).first().click();
  await p.waitForTimeout(600);
  check((await p.getByRole("link", { name: /Life Insurance: see campaign details/ }).count()) === 1, "Life Insurance tile links");
  check((await p.getByRole("link", { name: /Home Insurance: see campaign details/ }).count()) === 1, "Home Insurance tile links");

  check(errs.length === 0, `no console errors ${errs[0] || ""}`);
  await b.close();
  console.log(fails ? `${fails} FAILED` : "ALL PASS");
})();
