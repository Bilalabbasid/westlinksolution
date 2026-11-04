import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/config/site";
import { getPosts } from "@/content/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const now = new Date();
  const posts = getPosts();
  const latestPost = posts[0] ? new Date(`${posts[0].updatedAt}T00:00:00Z`) : now;
  return [
    { url: `${base}/`, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${base}/blog`, lastModified: latestPost, changeFrequency: "weekly", priority: 0.7 },
    ...posts.map((p) => ({
      url: `${base}/blog/${p.slug}`,
      lastModified: new Date(`${p.updatedAt}T00:00:00Z`),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    { url: `${base}/terms`, lastModified: now, changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${base}/privacy`, lastModified: now, changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${base}/california-privacy`, lastModified: now, changeFrequency: "yearly" as const, priority: 0.3 },
  ];
}
