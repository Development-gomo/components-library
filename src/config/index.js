// src/config/index.js
export const WP_BASE = process.env.WP_BASE || process.env.NEXT_PUBLIC_WP_BASE || "";

// WordPress REST namespace for the CF7 proxy endpoints.
// Override per-project via WP_CF7_NAMESPACE in .env.local
export const WP_CF7_NAMESPACE = process.env.WP_CF7_NAMESPACE || "complibrary/v1";
