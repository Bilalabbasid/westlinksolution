import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { blogSlugs } from "@/content/blog-slugs";
import { landingPages } from "@/content/landing";
import { products } from "@/content/products";

/**
 * Real 404s for unknown URLs.
 *
 * With Cache Components, the first request for an unknown slug under a dynamic
 * route ("/[slug]", "/[slug]/[product]", "/blog/[slug]") starts streaming the
 * static shell before the page calls notFound(), so the status is already 200.
 * Next only injects a noindex tag in that case, which search engines report as
 * a soft 404. The Next.js docs recommend a request-time check in Proxy, which
 * runs before rendering. Unknown paths are rewritten to a path no route
 * matches, so Next serves the not-found page with a true 404 status.
 */

const STATIC_TOP_LEVEL = new Set(["", "blog", "terms", "privacy", "california-privacy", "opengraph-image", "apple-icon", "icon", "manifest.webmanifest", "_not-found"]);
const LANDING = new Set(landingPages.map((p) => p.slug));
const PRODUCTS = new Set(products.map((p) => `${p.parent}/${p.slug}`));
const BLOG = new Set<string>(blogSlugs);
const NOT_FOUND_PATH = "/__not-found/__/__";

function isKnown(pathname: string): boolean {
  const segments = pathname.replace(/^\/+|\/+$/g, "").split("/").filter(Boolean);
  if (segments.length === 0) return true;
  const [first, second] = segments;
  if (segments.length === 1) return STATIC_TOP_LEVEL.has(first) || LANDING.has(first);
  if (segments.length === 2) {
    if (first === "blog") return BLOG.has(second);
    if (LANDING.has(first)) return PRODUCTS.has(`${first}/${second}`);
    // Generated metadata routes such as /opengraph-image/<hash> or /icon/<id>.
    return first === "opengraph-image" || first === "apple-icon" || first === "icon";
  }
  return false;
}

export function proxy(request: NextRequest) {
  if (isKnown(request.nextUrl.pathname)) return NextResponse.next();
  return NextResponse.rewrite(new URL(NOT_FOUND_PATH, request.url), { status: 404 });
}

export const config = {
  // Pages only: skip API routes, Next internals, and any path with a file extension.
  matcher: ["/((?!api/|_next/|.*\\..*).*)"],
};
