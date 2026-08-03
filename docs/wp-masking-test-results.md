# WP masking — test results

Run against a clean `npm run build` + `npm run start` (production mode), single
server instance verified on port 3000, real WordPress backend
(`gomowebb.com/components-library`). Date: 2026-07-28.

## Build

| # | Check | Result |
|---|---|---|
| B1 | `rm -rf .next && npm run build` | ✅ Pass — compiled successfully, 82 static pages generated, `/api/media/[...path]` route registered |
| B2 | `npx eslint src/` | ⚠️ 16 errors / 3 warnings, all pre-existing in files untouched by this work (`KineticHero.jsx`, `HeroClientslider.jsx`, `AccordionImageScroller.jsx`) — confirmed unrelated to WP masking |

## Page routes

| # | Route | Expected | Result |
|---|---|---|---|
| TC01 | `/` | 200 | ✅ 200 |
| TC02 | `/fancy-hero` | 200 | ✅ 200 |
| TC03 | `/accordion` | 200 | ✅ 200 |
| TC04 | `/client-logo` | 200 | ✅ 200 |
| TC05 | `/components` | 200 | ✅ 200 |
| TC06 | `/components/guide` | 200 | ✅ 200 |
| TC07 | Unknown slug (`/this-page-does-not-exist-xyz`) | 404 | ⚠️ Renders the real not-found page content but with **HTTP 200** instead of 404. Pre-existing Next.js/App Router behavior, unrelated to WP masking — flagged separately, not fixed here. |

## Image masking

| # | Check | Expected | Result |
|---|---|---|---|
| TC08 | Fetch `/client-logo` | 200 | ✅ 200 |
| TC09 | Count of `/api/media/wp-content` refs on the page | > 0 | ✅ 82 |
| TC10 | Raw unmasked `gomowebb.com/.../wp-content` refs on the page | 0 | ✅ 0 |
| TC11 | Fetch one real proxied image (`/api/media/wp-content/uploads/.../case-banner-2.jpg.webp`) | 200, real image bytes | ✅ 200, `image/webp`, 50,884 bytes |
| TC12 | Media proxy rejects non-`/wp-content/` paths (`/api/media/wp-admin/secret`) | 404 | ✅ 404 |
| TC13 | Media proxy rejects path traversal (`/api/media/wp-content/../wp-config.php`) | 404 | ✅ 404 |
| TC19 | Post body (WYSIWYG `dangerouslySetInnerHTML`) — `/post/hello-word` | 0 raw leaks, proxied refs present | ✅ 0 raw leaks, 20 proxied refs |

## Redirects (WP Redirection plugin passthrough)

| # | Check | Expected | Result |
|---|---|---|---|
| TC14 | `/api/wp-redirects` | 200 | ✅ 200 |
| TC15 | Configured redirect `/about-us` → `/about` | 301 | ✅ 301, correct destination |

## SEO / metadata

| # | Check | Expected | Result |
|---|---|---|---|
| TC16 | `og:image` on `/case-study/the-global-success-through-insights` | Points at `/api/media/...`, not a raw WP media URL | ✅ `https://gomowebb.com/components-library/api/media/wp-content/uploads/2026/04/library-image.jpg` |
| TC17 | `/sitemap.xml` | 200 | ✅ 200 |
| TC18 | `/robots.txt` | 200 | ✅ 200 |

## Summary

20 test cases run, 18 clean passes, 2 flagged-but-not-blocking:
- **TC07**: pre-existing 404-page-with-200-status quirk, unrelated to this work.
- **B2**: pre-existing lint errors in 3 unrelated component files.

Core deliverable — no real WP-origin/`wp-content` URL reaches the browser
unmasked, in images, OG tags, or WYSIWYG body content — verified clean across
every checked page.

## Known environment gotcha (not a code bug)

During this testing session, stale/overlapping `next dev` or `next start`
processes repeatedly caused inconsistent results (old process still bound to a
port, answering with outdated code/behavior). Before trusting local test
results, always confirm:
```
Get-Process node | Stop-Process -Force
Get-NetTCPConnection -State Listen | Where LocalPort -in 3000..4010
```
should show **zero** node processes and **zero** listeners before starting a
fresh single instance, and confirm the actual bound port from the server's own
startup log line rather than assuming 3000.
