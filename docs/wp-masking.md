# Hiding the WordPress backend origin

This project is headless WordPress + Next.js. Without extra work, the real WP
domain leaks into the deployed frontend — in image URLs, OG/Twitter meta tags,
WYSIWYG body content, and even WordPress's `_links` REST metadata if raw API
responses ever reach a Client Component. This pattern masks all of that behind
your own domain, automatically, with no per-component work.

## How it works

Every WP REST call goes through one function: `fetchWP()` in `src/lib/api.js`.
Before returning, it runs the parsed JSON through `rewriteWpUrlsDeep()`
(`src/lib/mediaProxy.js`), which recursively rewrites every WP-origin string it
finds:
- media URLs (`/wp-content/...`) → `/api/media/...` (served by
  `src/app/api/media/[...path]/route.js`, which fetches the real file server-side
  and streams it back — the WP origin never touches the browser)
- everything else under the WP root (permalinks, `_links` hrefs, etc.) →
  the equivalent `SITE_URL` path

Because this happens once, centrally, every component and every future ACF field
gets masked URLs automatically — nothing to remember when adding new fields or
new project clones.

Two things need handling outside that central function:
- **WYSIWYG body content** (`dangerouslySetInnerHTML` from a `post.content.rendered`-
  style field) can have WP URLs embedded *inside* a string rather than as the whole
  string, so it needs a separate substring-replace pass: `rewriteWpUrlsInHtml()`.
- **OG/Twitter meta tags** need *absolute* URLs per spec, so `src/lib/seo.js` calls
  `toProxiedMediaUrl(url, { absolute: true })` instead of the default relative form.

## Setting this up in a new project clone

Just set two env vars — no code changes needed:

```
WP_BASE=https://your-wp-origin.example/wp-json     # NOT NEXT_PUBLIC_ — server-only
SITE_URL=https://your-public-domain.example
```

`WP_BASE` must **not** be prefixed `NEXT_PUBLIC_`. Nothing client-side needs it —
all WP fetching happens server-side (`import "server-only"` in `src/lib/api.js`) —
and giving it the public prefix is exactly what causes it to get bundled into
client JS in the first place.

Also set `metadataBase` (already wired in `src/app/layout.js` from `SITE_URL`) so
relative proxied image URLs resolve to absolute ones in metadata automatically.

## Verifying it worked

- `npm run build`, then view-source on a few pages and grep for your real WP
  hostname — it should not appear anywhere, including inside `<script>` RSC
  payload tags.
- Check `<meta property="og:image">` and `<link rel="canonical">` point at your
  own domain.
- Hit `/api/media/wp-content/uploads/<a real file>` directly and confirm it
  streams the image.

## What this does *not* do

This masks the WP origin from anything the **browser** receives. The WP domain
itself still exists and is discoverable through channels outside this codebase —
DNS records, SSL certificate transparency logs (crt.sh), WHOIS, or just guessing a
common subdomain like `wp.`/`cms.`/`admin.`. For genuine network-level hardening on
top of this, consider:
- Putting the WP origin behind a provider (e.g. Cloudflare) with an origin lock
  that only accepts requests from your Next.js server's outbound IPs.
- A shared-secret header that WP only accepts from the Next.js server, rejecting
  all other requests.

Those are infra/DNS changes outside this repo, done once per hosting setup.
