import { WP_BASE } from "@/config";

// Generic fetch helper with ISR revalidation (60s by default).
export async function fetchWP(endpoint, { revalidate = 60 } = {}) {
  try {
    const url = `${WP_BASE}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;
    const res = await fetch(url, { next: { revalidate } });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

// ─── Generic helpers ────────────────────────────────────────────────────────

async function getSingleEntry(endpoint, slug) {
  if (!slug) return null;
  try {
    const entries = await fetchWP(`/wp/v2/${endpoint}?slug=${encodeURIComponent(slug)}&_embed`);
    if (!Array.isArray(entries) || entries.length === 0) return null;
    return entries.find((e) => e.slug === slug) || entries[0];
  } catch {
    return null;
  }
}

async function getEntryById(endpoint, id) {
  if (!id) return null;
  try {
    return await fetchWP(`/wp/v2/${endpoint}/${id}`);
  } catch {
    return null;
  }
}

// ─── Pages ──────────────────────────────────────────────────────────────────

export async function getPageBySlug(slug) {
  return getSingleEntry("pages", slug);
}

export async function getPageById(id) {
  return getEntryById("pages", id);
}

export async function getAllPages() {
  return fetchWP(`/wp/v2/pages?per_page=100`);
}

// ─── Posts ──────────────────────────────────────────────────────────────────

export async function getPostBySlug(slug) {
  return getSingleEntry("posts", slug);
}

export async function getAllPosts() {
  return fetchWP(`/wp/v2/posts?per_page=100&_embed`);
}

// ─── Case studies (custom post type) ───────────────────────────────────────

export async function getCaseStudyBySlug(slug) {
  return getSingleEntry("case-study", slug);
}

export async function getCaseStudies() {
  const data = await fetchWP(`/wp/v2/case-study?per_page=100&_embed`);
  return Array.isArray(data) ? data : [];
}

// ─── Media ────

export async function getMediaById(id) {
  if (!id) return null;
  return fetchWP(`/wp/v2/media/${id}`);
}

// ─── Menu (headless/v1 — the only custom namespace available) ───────────────

export async function getMenu(location = "primary") {
  try {
    const data = await fetchWP(`/headless/v1/menu/${location}`);
    return Array.isArray(data?.items) ? data.items : [];
  } catch {
    return [];
  }
}

// ─── Theme options (ACF Options page via wp/v2) ──────────────────────────────
// Reads from the ACF options page if registered, otherwise returns empty shell.

export async function getThemeOptions() {
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
}