// src/config/index.js
// Deliberately not NEXT_PUBLIC_ — nothing client-side needs the WP origin. All WP
// data fetching is server-only (see src/lib/api.js), and media/content URLs are
// masked through /api/media/... before reaching the browser. See docs/wp-masking.md.
export const WP_BASE = process.env.WP_BASE || "";

// WordPress REST namespace for the CF7 proxy endpoints.
// Override per-project via WP_CF7_NAMESPACE in .env.local
export const WP_CF7_NAMESPACE = process.env.WP_CF7_NAMESPACE || "complibrary/v1";
