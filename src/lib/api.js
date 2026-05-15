import "server-only";
import { cache } from "react";
import { WP_BASE } from "@/config";

const DEFAULT_REVALIDATE = 0;

export async function fetchWP(endpoint, options = {}) {
  try {
    if (!WP_BASE) return null;
    const url = `${WP_BASE}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;
    const { revalidate = DEFAULT_REVALIDATE, tags } = options;
    const fetchOptions =
      revalidate === 0
        ? { cache: "no-store" }
        : {
            next: {
              revalidate,
              ...(tags ? { tags } : {}),
            },
          };
    const res = await fetch(url, fetchOptions);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

// ─── Generic helpers ────────────────────────────────────────────────────────

const getSingleEntry = cache(async function getSingleEntry(endpoint, slug) {
  if (!slug) return null;
  try {
    const entries = await fetchWP(`/wp/v2/${endpoint}?slug=${encodeURIComponent(slug)}&_embed`, {
      tags: [endpoint, `${endpoint}:${slug}`],
    });
    if (!Array.isArray(entries) || entries.length === 0) return null;
    return entries.find((e) => e.slug === slug) || entries[0];
  } catch {
    return null;
  }
});

const getEntryById = cache(async function getEntryById(endpoint, id) {
  if (!id) return null;
  try {
    return await fetchWP(`/wp/v2/${endpoint}/${id}`, {
      tags: [endpoint, `${endpoint}:${id}`],
    });
  } catch {
    return null;
  }
});

// ─── Pages ──────────────────────────────────────────────────────────────────

export async function getPageBySlug(slug) {
  return getSingleEntry("pages", slug);
}

export async function getPageById(id) {
  return getEntryById("pages", id);
}

export const getAllPages = cache(async function getAllPages() {
  return fetchWP(`/wp/v2/pages?per_page=100`, { tags: ["pages"] });
});

// ─── Posts ──────────────────────────────────────────────────────────────────

export async function getPostBySlug(slug) {
  return getSingleEntry("posts", slug);
}

export const getAllPosts = cache(async function getAllPosts() {
  return fetchWP(`/wp/v2/posts?per_page=100&_embed`, { tags: ["posts"] });
});

// ─── Case studies (custom post type) ───────────────────────────────────────

export const getCaseStudyBySlug = cache(async function getCaseStudyBySlug(slug) {
  if (!slug) return null;
  try {
    const entries = await fetchWP(
      `/wp/v2/case-study?slug=${encodeURIComponent(slug)}&_embed&acf_format=standard`,
      { tags: ["case-study", `case-study:${slug}`] }
    );
    if (!Array.isArray(entries) || entries.length === 0) return null;
    return entries.find((e) => e.slug === slug) || entries[0];
  } catch {
    return null;
  }
});

// Server-side: used in async server components
export const getCaseStudies = cache(async function getCaseStudies() {
  const data = await fetchWP(`/wp/v2/case-study?per_page=100&_embed`, {
    tags: ["case-study"],
  });
  return Array.isArray(data) ? data : [];
});

// ─── Media ────

export const getMediaById = cache(async function getMediaById(id) {
  if (!id) return null;
  return fetchWP(`/wp/v2/media/${id}`, { tags: ["media", `media:${id}`] });
});

// ─── Menu (headless/v1 — the only custom namespace available) ───────────────

export const getMenu = cache(async function getMenu(location = "primary") {
  try {
    const data = await fetchWP(`/headless/v1/menu/${location}`, {
      tags: ["menus", `menu:${location}`],
    });
    return Array.isArray(data?.items) ? data.items : [];
  } catch {
    return [];
  }
});

// ─── Team members (custom post type) ────────────────────────────────────────

export const getTeamMembers = cache(async function getTeamMembers() {
  const data = await fetchWP(`/wp/v2/team?per_page=100&_embed`, {
    tags: ["team"],
  });
  return Array.isArray(data) ? data : [];
});

// ─── Search ──────────────────────────────────────────────────────────────────

export async function searchWP(query, perPage = 12) {
  if (!query || query.trim().length < 2) return [];
  const data = await fetchWP(
    `/wp/v2/search?search=${encodeURIComponent(query.trim())}&per_page=${perPage}&type=post&subtype=any`,
    { revalidate: 0 }
  );
  return Array.isArray(data) ? data : [];
}

// ─── Theme options (ACF Options page via wp/v2) ──────────────────────────────
// Reads from the ACF options page if registered, otherwise returns empty shell.

export const getThemeOptions = cache(async function getThemeOptions() {
  const endpoints = [
    `/headless/v1/theme-options`,
    `/wp/v2/acf/options`,
    `/acf/v3/options/options`,
  ];

  for (const endpoint of endpoints) {
    try {
      const data = await fetchWP(endpoint);
      if (data && !data.code) return data;
    } catch {}
  }

  return {};
});
