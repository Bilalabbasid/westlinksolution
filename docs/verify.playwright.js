/* Playwright verification of the Westlink site. Runs against the local dev
   server only. Produces screenshots and a JSON report in ./out. */
const { chromium } = require("playwright");
const fs = require("node:fs");
const path = require("node:path");

const BASE = process.env.BASE || "http://localhost:3100";
const OUT = path.join(__dirname, "out");
fs.mkdirSync(OUT, { recursive: true });
const report = [];
const log = (name, pass, detail = "") => {
  report.push({ name, pass, detail });
  console.log(`${pass ? "PASS" : "FAIL"} ${name}${detail ? " — " + detail : ""}`);
};

(async () => {
  const browser = await chromium.launch();
  const consoleErrors = [];

  // ---------- Desktop ----------
  const desktop = await browser.newContext({ viewport: { width: 1366, height: 900 } });
  const page = await desktop.newPage();
  page.on("console", (m) => m.type() === "error" && consoleErrors.push(m.text()));
  page.on("pageerror", (e) => consoleErrors.push(String(e)));
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  // Wait for hydration: the first reveal only becomes visible once React runs.
  await page.locator(".reveal.is-visible").first().waitFor({ timeout: 15000 });

  // Reveal everything for the full-page capture.
  await page.evaluate(() => document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-visible")));
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(OUT, "desktop-full.png"), fullPage: true });

  // Headings / structure
  const h1s = await page.locator("h1").count();
  log("exactly one h1 on home", h1s === 1, `count=${h1s}`);
  const title = await page.title();
  log("home title set", title.includes("Westlink Solutions"), title);
  const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
  log("canonical present", Boolean(canonical), canonical || "");
  const robotsMeta = await page.locator('meta[name="robots"]').getAttribute("content");
  log("preview is noindex", (robotsMeta || "").includes("noindex"), robotsMeta || "");
  const og = await page.locator('meta[property="og:image"]').getAttribute("content");
  log("og:image present", Boolean(og), og || "");
  const ld = await page.locator('script[type="application/ld+json"]').textContent();
  log("organization JSON-LD present", ld.includes('"Organization"') && ld.includes("TOPDEVELOPER INC"));

  // No reference branding / destinations
  const html = await page.content();
  const leaks = ["adzino", "512-385-4031", "info@adzino", "script.google.com", "submit_form.php", "Adam Palmer", "Trevor Zambrio", "Brian Urich", "Noah Reid", "Sarah Johnson", "BlueCross", "Globe Life"].filter((s) => html.toLowerCase().includes(s.toLowerCase()));
  log("no reference branding or destinations in HTML", leaks.length === 0, leaks.join(", "));
  log("operator disclosure in footer", html.includes("Westlink Solutions is operated by TOPDEVELOPER INC."));
  log("no testimonials/partners sections while empty", !html.includes('id="testimonials"') && !html.includes('id="partners"'));
  const scripts = await page.evaluate(() => [...document.scripts].map((s) => s.src).filter((s) => s && !s.includes("localhost")));
  log("no third-party scripts loaded", scripts.length === 0, scripts.join(", "));

  // Navigation and footer links resolve
  const links = await page.evaluate(() => [...document.querySelectorAll("header a, footer a")].map((a) => a.getAttribute("href")));
  const broken = [];
  for (const href of new Set(links)) {
    if (!href || href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("http")) continue;
    const [p, hash] = href.split("#");
    const url = BASE + (p || "/");
    const r = await page.request.get(url);
    if (r.status() !== 200) broken.push(`${href}:${r.status()}`);
    if (hash) {
      const exists = await page.evaluate((id) => Boolean(document.getElementById(id)), hash);
      if (!exists && (p === "" || p === "/")) broken.push(`${href}:missing-anchor`);
    }
  }
  log("all header/footer links resolve", broken.length === 0, broken.join(", "));

  // Industry tabs: click + keyboard
  const tabs = page.getByRole("tab");
  log("four industry tabs", (await tabs.count()) === 4);
  await tabs.nth(1).click();
  log("home services tab selected on click", (await tabs.nth(1).getAttribute("aria-selected")) === "true");
  const panelVisible = await page.getByRole("tabpanel").filter({ hasText: "HVAC" }).isVisible();
  log("home services panel shows HVAC", panelVisible);
  await tabs.nth(1).focus();
  await page.keyboard.press("ArrowRight");
  log("arrow key moves to financial services", (await tabs.nth(2).getAttribute("aria-selected")) === "true");
  await page.keyboard.press("End");
  log("End key moves to legal", (await tabs.nth(3).getAttribute("aria-selected")) === "true");
  const legalPanel = await page.getByRole("tabpanel").filter({ hasText: "SSDI" }).isVisible();
  log("legal panel lists SSDI", legalPanel);
  await page.screenshot({ path: path.join(OUT, "industries-legal.png"), clip: { x: 0, y: (await page.locator("#industries").boundingBox()).y, width: 1366, height: 900 } }).catch(() => {});

  // Hero secondary CTA scrolls to industries
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.getByRole("link", { name: "Explore industries" }).click();
  let indTop = 9999;
  for (let i = 0; i < 16; i++) {
    await page.waitForTimeout(250);
    indTop = await page.locator("#industries").evaluate((el) => el.getBoundingClientRect().top);
    if (indTop < 200) break;
  }
  log("secondary CTA scrolls to industries", indTop < 200, `top=${Math.round(indTop)}`);

  // Onboarding modal: open, focus, trap, escape, restore
  const heroCta = page.locator("section").first().getByRole("button", { name: "Become a Partner" });
  await heroCta.focus();
  await heroCta.press("Enter");
  const dialog = page.getByRole("dialog");
  await dialog.waitFor();
  log("modal opens from hero CTA", await dialog.isVisible());
  const focusedInModal = await page.evaluate(() => Boolean(document.activeElement?.closest("[role=dialog]")));
  log("focus moves into modal", focusedInModal);
  // Tab around many times; focus must stay inside
  for (let i = 0; i < 40; i++) await page.keyboard.press("Tab");
  log("focus trapped after 40 tabs", await page.evaluate(() => Boolean(document.activeElement?.closest("[role=dialog]"))));
  for (let i = 0; i < 5; i++) await page.keyboard.press("Shift+Tab");
  log("focus trapped on shift+tab", await page.evaluate(() => Boolean(document.activeElement?.closest("[role=dialog]"))));
  const progress = await dialog.getByText("Step 1 of 2").first().isVisible().catch(() => false);
  log("progress indicator shows step 1 of 2", progress);

  // Step 1 validation
  await dialog.getByRole("button", { name: /Next: address/ }).click();
  await page.waitForTimeout(100);
  const errCount = await dialog.locator('[role="alert"]').count();
  log("step 1 validation shows errors", errCount > 0, `alerts=${errCount}`);
  log("focus moved to first invalid field", await page.evaluate(() => document.activeElement?.id === "company"), await page.evaluate(() => document.activeElement?.id));
  await page.screenshot({ path: path.join(OUT, "modal-step1-errors.png") });

  await dialog.locator("#company").fill("Westlink QA Co");
  await dialog.locator("#firstName").fill("Taylor");
  await dialog.locator("#lastName").fill("Tester");
  await dialog.locator("#email").fill("not-an-email");
  await dialog.locator("#phone").fill("12");
  await dialog.getByRole("button", { name: /Next: address/ }).click();
  const emailErr = await dialog.locator("#email-error").textContent().catch(() => "");
  const phoneErr = await dialog.locator("#phone-error").textContent().catch(() => "");
  log("email + phone field errors shown", Boolean(emailErr) && Boolean(phoneErr), `${emailErr} | ${phoneErr}`);
  await dialog.locator("#email").fill("taylor@example.com");
  await dialog.locator("#phone").fill("415 555 0188");
  await dialog.getByRole("button", { name: /Next: address/ }).click();
  const termsErr = await dialog.locator("#agreeTerms-error").textContent().catch(() => "");
  log("terms consent required separately", Boolean(termsErr), termsErr);
  await dialog.locator("#agreeTerms").check();
  const marketingChecked = await dialog.locator("#marketingOptIn").isChecked();
  log("marketing opt-in is unchecked by default and separate", marketingChecked === false);
  await dialog.getByRole("button", { name: /Next: address/ }).click();
  await dialog.locator("#street").waitFor();
  log("advanced to step 2", await dialog.locator("#street").isVisible());
  log("progress indicator shows step 2", await dialog.getByText("Step 2 of 2").first().isVisible().catch(() => false));

  // Previous preserves values
  await dialog.getByRole("button", { name: "Previous" }).click();
  log("previous returns to step 1 with values preserved", (await dialog.locator("#company").inputValue()) === "Westlink QA Co" && (await dialog.locator("#agreeTerms").isChecked()));
  await dialog.getByRole("button", { name: /Next: address/ }).click();
  await dialog.locator("#street").waitFor();

  // Step 2 validation then submit
  await dialog.getByRole("button", { name: /Submit application/ }).click();
  const step2Alerts = await dialog.locator('[role="alert"]').count();
  log("step 2 validation shows errors", step2Alerts > 0, `alerts=${step2Alerts}`);
  await page.screenshot({ path: path.join(OUT, "modal-step2-errors.png") });
  await dialog.locator("#street").fill("500 Verification Blvd");
  await dialog.locator("#city").fill("Austin");
  await dialog.locator("#state").fill("TX");
  await dialog.locator("#country").selectOption("US");
  await dialog.locator("#postalCode").fill("78701");
  await dialog.locator('label[for="vertical-medicare"]').click();
  await dialog.locator('label[for="vertical-roofing"]').click();
  await dialog.locator('label[for="vertical-aca"]').click();
  await dialog.locator("#billingContactEmail").fill("bad-email");
  await dialog.getByRole("button", { name: /Submit application/ }).click();
  const billingErr = await dialog.locator("#billingContactEmail-error").textContent().catch(() => "");
  log("billing email validated when present", Boolean(billingErr), billingErr);
  await dialog.locator("#billingContactEmail").fill("");
  await page.screenshot({ path: path.join(OUT, "modal-step2-filled.png") });

  // Escape closes and restores focus (before submitting)
  await page.keyboard.press("Escape");
  await page.waitForTimeout(200);
  log("escape closes modal", (await page.getByRole("dialog").count()) === 0);
  log("focus restored to opener", await page.evaluate(() => document.activeElement?.textContent?.includes("Become a Partner")), await page.evaluate(() => document.activeElement?.tagName + ":" + document.activeElement?.textContent?.slice(0, 30)));

  // Reopen, fill quickly and submit via UI (wait >2.5s for timing check)
  await heroCta.click();
  await dialog.waitFor();
  await dialog.locator("#company").fill("Westlink QA Co (UI)");
  await dialog.locator("#firstName").fill("Taylor");
  await dialog.locator("#lastName").fill("Tester");
  await dialog.locator("#email").fill("taylor.ui@example.com");
  await dialog.locator("#phone-country").selectOption("GB");
  await dialog.locator("#phone").fill("020 7946 0958");
  await dialog.locator("#agreeTerms").check();
  await dialog.locator("#marketingOptIn").check();
  await dialog.getByRole("button", { name: /Next: address/ }).click();
  await dialog.locator("#street").waitFor();
  await dialog.locator("#street").fill("10 Example Street");
  await dialog.locator("#city").fill("London");
  await dialog.locator("#state").fill("Greater London");
  await dialog.locator("#country").selectOption("GB");
  await dialog.locator("#postalCode").fill("SW1A 1AA");
  await dialog.locator('label[for="vertical-debt-settlement"]').click();
  await dialog.locator('label[for="vertical-seo"]').click();
  await page.waitForTimeout(2800);
  const submitBtn = dialog.getByRole("button", { name: /Submit application/ });
  const [resp] = await Promise.all([
    page.waitForResponse((r) => r.url().includes("/api/onboarding")),
    submitBtn.click(),
  ]);
  const json = await resp.json();
  log("UI onboarding submission accepted by backend", resp.status() === 200 && json.ok === true, `id=${json.id}`);
  await dialog.getByText("Application received").waitFor();
  log("success state shown after backend confirmation", true);
  const successText = await dialog.textContent();
  log("no confirmation-email promise when none sent", !successText.includes("confirmation email is on its way"));
  log("response-time wording shown", successText.includes("typically follows up"));
  await page.screenshot({ path: path.join(OUT, "modal-success.png") });
  await dialog.getByRole("button", { name: "Done" }).click();

  // Contact form via UI: validation + submission
  await page.locator("#contact").scrollIntoViewIfNeeded();
  const form = page.locator("#contact form");
  await form.getByRole("button", { name: /Send message/ }).click();
  log("contact validation shows errors", (await form.locator('[role="alert"]').count()) > 0);
  log("contact phone is a tel input", (await form.locator("#phone").getAttribute("type")) === "tel");
  await form.locator("#name").fill("Taylor Tester");
  await form.locator("#email").fill("taylor.contact@example.com");
  await form.locator("#phone").fill("+44 20 7946 0958");
  await form.locator("#message").fill("UI verification message from the Westlink build. Please ignore this test.");
  await page.waitForTimeout(2800);
  const [cresp] = await Promise.all([
    page.waitForResponse((r) => r.url().includes("/api/contact")),
    form.getByRole("button", { name: /Send message/ }).click(),
  ]);
  const cjson = await cresp.json();
  log("UI contact submission accepted by backend", cresp.status() === 200 && cjson.ok === true, `id=${cjson.id}`);
  await page.locator("#contact").getByText("Message sent").waitFor();
  await page.screenshot({ path: path.join(OUT, "contact-success.png") });

  // Legal pages
  for (const p of ["/terms", "/privacy", "/california-privacy"]) {
    await page.goto(BASE + p, { waitUntil: "networkidle" });
    const c = await page.locator("h1").count();
    const t = await page.title();
    const body = await page.content();
    log(`${p}: one h1, unique title, operator named`, c === 1 && t.includes("|") && body.includes("TOPDEVELOPER INC"), t);
  }
  await page.goto(BASE + "/terms", { waitUntil: "networkidle" });
  await page.screenshot({ path: path.join(OUT, "terms.png"), fullPage: false });

  // ---------- Mobile ----------
  const mobile = await browser.newContext({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  const mp = await mobile.newPage();
  mp.on("console", (m) => m.type() === "error" && consoleErrors.push("[mobile] " + m.text()));
  await mp.goto(BASE + "/", { waitUntil: "networkidle" });
  await mp.locator(".reveal.is-visible").first().waitFor({ timeout: 15000 });
  const overflow = await mp.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  log("no horizontal overflow at 375px", overflow <= 0, `overflow=${overflow}px`);
  const clipped = await mp.evaluate(() => {
    const w = document.documentElement.clientWidth;
    const inScroller = (el) => {
      for (let n = el.parentElement; n; n = n.parentElement) {
        const o = getComputedStyle(n).overflowX;
        if (o === "auto" || o === "scroll") return true;
      }
      return false;
    };
    return [...document.querySelectorAll("h1, h2, h3, p, button, a")].filter((el) => {
      const r = el.getBoundingClientRect();
      return r.width > 0 && r.right > w + 1 && !inScroller(el);
    }).map((el) => el.tagName + ":" + (el.textContent || "").trim().slice(0, 30));
  });
  log("no element extends past the 375px viewport", clipped.length === 0, clipped.slice(0, 4).join(" | "));
  await mp.evaluate(() => document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-visible")));
  await mp.waitForTimeout(300);
  await mp.screenshot({ path: path.join(OUT, "mobile-full.png"), fullPage: true });
  const menuBtn = mp.getByRole("button", { name: "Open menu" });
  log("mobile menu button present", await menuBtn.isVisible());
  await menuBtn.click();
  log("mobile menu expands", (await mp.getByRole("button", { name: "Close menu" }).getAttribute("aria-expanded")) === "true");
  const mobileNavLinks = await mp.getByRole("navigation", { name: "Mobile" }).getByRole("link").count();
  log("mobile menu lists nav links", mobileNavLinks >= 4, `links=${mobileNavLinks}`);
  await mp.screenshot({ path: path.join(OUT, "mobile-menu.png") });
  await mp.keyboard.press("Escape");
  log("escape closes mobile menu", (await mp.getByRole("button", { name: "Open menu" }).getAttribute("aria-expanded")) === "false");
  await menuBtn.click();
  await mp.getByRole("navigation", { name: "Mobile" }).getByRole("button", { name: "Become a Partner" }).click();
  await mp.getByRole("dialog").waitFor();
  log("mobile menu CTA opens modal", await mp.getByRole("dialog").isVisible());
  await mp.screenshot({ path: path.join(OUT, "mobile-modal.png") });
  await mp.keyboard.press("Escape");

  // 320px smallest phones
  await mp.setViewportSize({ width: 320, height: 640 });
  await mp.goto(BASE + "/", { waitUntil: "networkidle" });
  const overflow320 = await mp.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  log("no horizontal overflow at 320px", overflow320 <= 0, `overflow=${overflow320}px`);

  // Reduced motion: reveals visible without animation
  const rm = await browser.newContext({ viewport: { width: 1366, height: 900 }, reducedMotion: "reduce" });
  const rp = await rm.newPage();
  await rp.goto(BASE + "/", { waitUntil: "networkidle" });
  const hiddenReveals = await rp.evaluate(() => [...document.querySelectorAll(".reveal")].filter((el) => getComputedStyle(el).opacity !== "1").length);
  log("reduced motion: all content visible", hiddenReveals === 0, `hidden=${hiddenReveals}`);

  // 1920 desktop
  const wide = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const wp = await wide.newPage();
  await wp.goto(BASE + "/", { waitUntil: "networkidle" });
  await wp.locator(".reveal.is-visible").first().waitFor({ timeout: 15000 });
  await wp.evaluate(() => document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-visible")));
  await wp.waitForTimeout(300);
  await wp.screenshot({ path: path.join(OUT, "desktop-1920.png") });

  log("no console errors across runs", consoleErrors.length === 0, consoleErrors.slice(0, 5).join(" | "));

  fs.writeFileSync(path.join(OUT, "report.json"), JSON.stringify(report, null, 2));
  await browser.close();
  const failed = report.filter((r) => !r.pass).length;
  console.log(`\n${report.length - failed}/${report.length} checks passed`);
  process.exit(failed ? 1 : 0);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
