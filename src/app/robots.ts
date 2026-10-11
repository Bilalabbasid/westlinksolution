import type { MetadataRoute } from "next";
import { getSiteUrl, isIndexingAllowed } from "@/config/site";

/**
 * Preview and non-production deployments are never indexable. Production
 * indexing requires ALLOW_INDEXING=true at build time.
 */
export default function robots(): MetadataRoute.Robots {
  const base = getSiteUrl();
  if (!isIndexingAllowed()) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/"] }],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
