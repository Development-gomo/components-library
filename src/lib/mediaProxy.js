import "server-only";
import { WP_BASE } from "@/config";

const SITE_URL = process.env.SITE_URL || "";

// WP_BASE is the REST API root (e.g. "https://realbackend.com/site-path/wp-json").
// The WP install root — where /wp-content actually lives — is that minus the
// trailing /wp-json segment. Handles both root installs and subdirectory installs.
function getWpRoot() {
  return WP_BASE.replace(/\/wp-json\/?$/, "");
}

// Rewrites a single absolute WP URL to a same-origin equivalent:
// - media (/wp-content/...) -> proxied through /api/media/...
// - anything else under the WP root (permalinks, REST _links, etc.) -> SITE_URL
// URLs that don't start with the WP root (external links, already-relative paths)
// are returned unchanged.
export function toProxiedMediaUrl(wpUrl, { absolute = false } = {}) {
  if (typeof wpUrl !== "string" || !wpUrl) return wpUrl;

  // Already proxied — e.g. fetchWP() already ran this through rewriteWpUrlsDeep,
  // and a caller (like seo.js) just needs to upgrade it to an absolute URL.
  if (wpUrl.startsWith("/api/media/")) {
    return absolute ? `${SITE_URL}${wpUrl}` : wpUrl;
  }

  const wpRoot = getWpRoot();
  if (!wpRoot || !wpUrl.startsWith(wpRoot)) return wpUrl;

  const relPath = wpUrl.slice(wpRoot.length);
  const proxied = `/api/media${relPath}`;
  return absolute ? `${SITE_URL}${proxied}` : proxied;
}

export function toSiteUrl(wpUrl) {
  if (typeof wpUrl !== "string" || !wpUrl) return undefined;
  const wpRoot = getWpRoot();
  if (!wpRoot || !wpUrl.startsWith(wpRoot)) return wpUrl;
  return `${SITE_URL}${wpUrl.slice(wpRoot.length)}`;
}

function rewriteWpUrlString(value) {
  const wpRoot = getWpRoot();
  if (!wpRoot || !value.startsWith(wpRoot)) return value;
  const relPath = value.slice(wpRoot.length);
  return relPath.startsWith("/wp-content/") ? `/api/media${relPath}` : toSiteUrl(value);
}

// Recursively walks a parsed WP REST JSON response (objects/arrays/strings only —
// these payloads have no circular refs) and rewrites every WP-origin string found,
// including ones hidden inside WP's `_links` HAL metadata that most masking
// attempts miss. This is the single choke point used by fetchWP() so every
// consumer downstream gets masked URLs automatically, with zero per-component work.
export function rewriteWpUrlsDeep(value) {
  if (typeof value === "string") return rewriteWpUrlString(value);
  if (Array.isArray(value)) return value.map(rewriteWpUrlsDeep);
  if (value && typeof value === "object") {
    const out = {};
    for (const [key, val] of Object.entries(value)) {
      out[key] = rewriteWpUrlsDeep(val);
    }
    return out;
  }
  return value;
}

// Rewrites WP-origin URLs embedded inside a raw HTML string (WYSIWYG body content,
// where an editor may have pasted an <img>/<a> pointing at the WP domain directly).
export function rewriteWpUrlsInHtml(html) {
  if (typeof html !== "string" || !html) return html;
  const wpRoot = getWpRoot();
  if (!wpRoot) return html;

  const escaped = wpRoot.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return html
    .replaceAll(new RegExp(`${escaped}/wp-content/`, "g"), "/api/media/wp-content/")
    .replaceAll(new RegExp(escaped, "g"), SITE_URL);
}
