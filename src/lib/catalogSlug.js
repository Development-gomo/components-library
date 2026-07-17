// Plain helper (no "server-only" import) so both server pages and client
// components (e.g. the catalog sidebar) can build/match the same URLs.

export function groupSlug(title) {
  return String(title)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
