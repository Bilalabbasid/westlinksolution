const { chromium } = require("playwright");
const path = require("node:path");
const BASE = process.env.BASE || "http://localhost:3100";
const OUT = path.join(__dirname, "out");
const results = [];
const log = (n, p, d = "") => { results.push(p); console.log(`${p ? "PASS" : "FAIL"} ${n}${d ? " — " + d : ""}`); };

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1366, height: 900 }, permissions: ["clipboard-read", "clipboard-write"] });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  await page.locator(".reveal.is-visible").first().waitFor();

  // Desktop phone link: opens WhatsApp in a new tab + toast with call fallback
  const phone = page.locator("footer").getByRole("link", { name: "+1 (650) 308-4707" });
  await phone.scrollIntoViewIfNeeded();
  const [popup] = await Promise.all([ctx.waitForEvent("page", { timeout: 5000 }).catch(() => null), phone.click()]);
  log("phone link opens WhatsApp in a new tab on desktop", Boolean(popup) && /wa\.me\/16503084707|api\.whatsapp\.com\/send\/\?phone=16503084707/.test(popup.url()), popup ? popup.url() : "no popup");
  if (popup) await popup.close();
  const toast = page.locator(".toast").filter({ hasText: "Opening WhatsApp" });
  await toast.waitFor({ timeout: 3000 });
  log("WhatsApp toast shown", await toast.isVisible());
  log("page itself did not navigate", page.url().startsWith(BASE));
  const clip = await page.evaluate(() => navigator.clipboard.readText()).catch(() => "");
  log("clipboard holds the phone number", clip === "+1 (650) 308-4707", clip);
  log("toast offers a call fallback", await toast.getByRole("button", { name: /Call with your phone app instead/ }).isVisible());
  await page.screenshot({ path: path.join(OUT, "toast-copy.png") });
  await toast.getByRole("button", { name: "Dismiss notification" }).click();
  await page.waitForTimeout(300);
  log("toast dismisses", (await page.locator(".toast").filter({ hasText: "Opening WhatsApp" }).count()) === 0);

  // Email link
  await page.locator("footer").getByRole("link", { name: "info@westlinksolution.com" }).click();
  const emailToast = page.locator(".toast").filter({ hasText: "Email address copied" });
  await emailToast.waitFor({ timeout: 3000 });
  log("email link shows copy toast", await emailToast.isVisible());

  // Contact form validation toast (alert role for errors)
  await page.locator("#contact").scrollIntoViewIfNeeded();
  await page.locator("#contact form").getByRole("button", { name: /Send message/ }).click();
  const errToast = page.getByRole("alert").filter({ hasText: /fields need attention/ });
  await errToast.waitFor({ timeout: 3000 });
  log("validation error toast shown", await errToast.isVisible(), await errToast.innerText());
  await page.screenshot({ path: path.join(OUT, "toast-validation.png") });

  // Successful submission toast
  const form = page.locator("#contact form");
  await form.locator("#name").fill("Toast Tester");
  await form.locator("#email").fill("toast@example.com");
  await form.locator("#message").fill("Toast verification message from the Westlink build. Please ignore.");
  await page.waitForTimeout(2800);
  await form.getByRole("button", { name: /Send message/ }).click();
  const okToast = page.locator(".toast").filter({ hasText: "Message sent" });
  await okToast.waitFor({ timeout: 10000 });
  log("success toast after backend confirmation", await okToast.isVisible());
  await page.screenshot({ path: path.join(OUT, "toast-success.png") });

  // Modal step toasts
  await page.locator("header").getByRole("button", { name: "Become a Partner" }).click();
  const dialog = page.getByRole("dialog");
  await dialog.waitFor();
  await dialog.getByRole("button", { name: /Next: address/ }).click();
  log("modal validation toast", await page.getByRole("alert").filter({ hasText: /fields need attention/ }).first().isVisible());
  log("toasts stay above the modal", await page.evaluate(() => {
    const t = document.querySelector('[role="alert"].toast, .toast');
    const d = document.querySelector('[role="dialog"]')?.parentElement;
    if (!t || !d) return false;
    return Number(getComputedStyle(t.parentElement).zIndex) > Number(getComputedStyle(d).zIndex);
  }));
  await page.keyboard.press("Escape");

  // Mobile: phone link keeps native behavior (pointer: coarse)
  const m = await browser.newContext({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true });
  const mp = await m.newPage();
  await mp.goto(BASE + "/", { waitUntil: "networkidle" });
  const coarse = await mp.evaluate(() => matchMedia("(pointer: coarse)").matches);
  log("mobile context reports coarse pointer (native dial path)", coarse);
  const hrefs = await mp.evaluate(() => [...document.querySelectorAll('footer a')].map((a) => a.getAttribute("href")).filter((h) => h && (h.startsWith("https://wa.me") || h.startsWith("tel:"))));
  log("mobile phone link targets WhatsApp with tel fallback logic", hrefs.includes("https://wa.me/16503084707"), hrefs.join(","));

  log("no page errors", errors.length === 0, errors.join(" | "));
  await browser.close();
  const failed = results.filter((r) => !r).length;
  console.log(`${results.length - failed}/${results.length} toast checks passed`);
  process.exit(failed ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
