import "server-only";
import { WP_BASE } from "@/config";

const SITE_URL = process.env.SITE_URL || "";

// The public-facing proxy segment. Deliberately NOT "wp-content" — that folder name
// is a dead giveaway that the backend is WordPress, even once the domain is hidden.
const PROXY_SEGMENT = "assets";
const PROXY_PREFIX = `/api/media/${PROXY_SEGMENT}`;

// WP_BASE is the REST API root (e.g. "https://realbackend.com/site-path/wp-json").
// The WP install root — where /wp-content actually lives — is that minus the
// trailing /wp-json segment. Handles both root installs and subdirectory installs.
function getWpRoot() {
  return WP_BASE.replace(/\/wp-json\/?$/, "");
}

// "/wp-content/uploads/x.jpg" -> "/api/media/assets/uploads/x.jpg"
function proxyMediaPath(wpContentRelPath) {
  return `${PROXY_PREFIX}${wpContentRelPath.slice("/wp-content".length)}`;
}

// Reverses proxyMediaPath for the route handler: "assets/uploads/x.jpg" -> "wp-content/uploads/x.jpg".
// Returns null if the path doesn't look like a proxied media path.
export function toRealMediaPath(routeRelPath) {
  if (!routeRelPath.startsWith(`${PROXY_SEGMENT}/`)) return null;
  return `wp-content/${routeRelPath.slice(`${PROXY_SEGMENT}/`.length)}`;
}

// Rewrites a single absolute WP URL to a same-origin equivalent:
// - media (/wp-content/...) -> proxied through /api/media/assets/...
// - anything else under the WP root (permalinks, REST _links, etc.) -> SITE_URL
// URLs that don't start with the WP root (external links, already-relative paths)
// are returned unchanged.
export function toProxiedMediaUrl(wpUrl, { absolute = false } = {}) {
  if (typeof wpUrl !== "string" || !wpUrl) return wpUrl;

  // Already proxied — e.g. fetchWP() already ran this through rewriteWpUrlsDeep,
  // and a caller (like seo.js) just needs to upgrade it to an absolute URL.
  if (wpUrl.startsWith(`${PROXY_PREFIX}/`)) {
    return absolute ? `${SITE_URL}${wpUrl}` : wpUrl;
  }

  const wpRoot = getWpRoot();
  if (!wpRoot || !wpUrl.startsWith(wpRoot)) return wpUrl;

  const relPath = wpUrl.slice(wpRoot.length);
  if (!relPath.startsWith("/wp-content/")) return wpUrl;

  const proxied = proxyMediaPath(relPath);
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
  if (!wpRoot || !value.includes(wpRoot)) return value;

  // Whole-string URL (the common case: media src, permalink, _links href, ...).
  if (value.startsWith(wpRoot)) {
    const relPath = value.slice(wpRoot.length);
    return relPath.startsWith("/wp-content/") ? proxyMediaPath(relPath) : toSiteUrl(value);
  }

  // WP root appears only as a substring — e.g. Yoast's `yoast_head` field, which
  // is a raw rendered <head> HTML blob with URLs embedded inside <meta> tags
  // rather than being a URL itself. Same rewrite, applied globally.
  return rewriteWpUrlsInHtml(value);
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
// where an editor may have pasted an <img>/<a> pointing at the WP domain directly;
// also WP's `yoast_head` field, whose HTML embeds a <script type="application/ld+json">
// block — URLs there have their slashes JSON-escaped as "\/" rather than "/", so both
// forms need to be replaced or the escaped copy slips through unmasked).
export function rewriteWpUrlsInHtml(html) {
  if (typeof html !== "string" || !html) return html;
  const wpRoot = getWpRoot();
  if (!wpRoot) return html;

  // Build a regex source that matches "/" as either a plain slash or its JSON-escaped
  // form "\/" (both are valid inside a "/"-containing string, but JSON.stringify — as
  // WP does when embedding LD+JSON into `yoast_head` — emits the escaped form).
  const flexibleSlash = (s) =>
    s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\//g, "\\\\?/");

  const rootPattern = flexibleSlash(wpRoot);
  const wpContentPattern = flexibleSlash(`${wpRoot}/wp-content/`);

  // Forward slashes don't need escaping in JSON string values, so a plain
  // (unescaped) replacement is valid whichever form was matched.
  return html
    .replaceAll(new RegExp(wpContentPattern, "g"), `${PROXY_PREFIX}/`)
    .replaceAll(new RegExp(rootPattern, "g"), SITE_URL);
}
