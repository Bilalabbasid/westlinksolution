import type { MouseEvent } from "react";

/**
 * Click handler for in-page hash links ("#industries", "/#faq").
 *
 * Next's router ignores a click when the URL would not change, so a second
 * click on "Explore industries" while the address bar already shows
 * /#industries did nothing. When the target exists on the current page we
 * scroll to it ourselves and update the hash; otherwise the link navigates
 * normally (for example from a blog post back to the home page section).
 */
export function handleHashClick(event: MouseEvent<HTMLAnchorElement>) {
  if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
  const href = event.currentTarget.getAttribute("href") ?? "";
  const hashIndex = href.indexOf("#");
  if (hashIndex === -1) return;
  const path = href.slice(0, hashIndex);
  const id = href.slice(hashIndex + 1);
  if (!id) return;
  if (path && path !== "/" && path !== window.location.pathname) return;
  if (path === "/" && window.location.pathname !== "/") return;
  const target = document.getElementById(id);
  if (!target) return;

  event.preventDefault();
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  if (window.location.hash !== `#${id}`) window.history.pushState(null, "", `#${id}`);
}
