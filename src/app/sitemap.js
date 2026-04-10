// src/app/sitemap.js

import { fetchWP } from "@/lib/api";

export const revalidate = 60;

const SITE_URL = process.env.SITE_URL || "";

const CONTENT_TYPES = [
  { endpoint: "/wp/v2/pages",  path: (s) => `/${s}`,       priority: 0.8, changeFrequency: "monthly", skip: new Set(["frontpage"]) },
  { endpoint: "/wp/v2/posts",  path: (s) => `/post/${s}`,  priority: 0.6, changeFrequency: "weekly"  },
];

export default async function sitemap() {
  const entries = [
    {
      url: `${SITE_URL}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
  ];

  for (const type of CONTENT_TYPES) {
    const items = await fetchWP(`${type.endpoint}?per_page=100`);
    for (const item of Array.isArray(items) ? items : []) {
      if (type.skip?.has(item.slug)) continue;
      entries.push({
        url: `${SITE_URL}${type.path(item.slug)}`,
        lastModified: new Date(item.modified || item.date),
        changeFrequency: type.changeFrequency,
        priority: type.priority,
      });
    }
  }

  return entries;
}
