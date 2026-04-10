// src/lib/seo.js

const SITE_URL = process.env.SITE_URL || "";
const WP_BASE = process.env.NEXT_PUBLIC_WP_BASE || "";

// Strip the WP origin from a URL and return just the path,
// so canonical/og_url point to the real site domain.
function toSiteUrl(wpUrl) {
  if (!wpUrl) return undefined;
  try {
    const wpOrigin = new URL(WP_BASE).origin;
    return wpUrl.replace(wpOrigin, SITE_URL);
  } catch {
    return wpUrl;
  }
}

function stripHtml(raw) {
  if (!raw) return "";
  return raw.replace(/<[^>]*>?/gm, "").replace(/\s+/g, " ").trim();
}

function mapOgImages(images = []) {
  if (!Array.isArray(images)) return undefined;
  const mapped = images
    .map((img) => {
      if (!img?.url) return null;
      return { url: img.url, width: img.width, height: img.height, type: img.type, alt: img.alt };
    })
    .filter(Boolean);
  return mapped.length > 0 ? mapped : undefined;
}

export function buildMetadataFromYoast(entry, options = {}) {
  const { fallbackTitle = "", fallbackDescription = "" } = options;

  if (!entry) {
    return { title: fallbackTitle, description: fallbackDescription };
  }

  const yoast = entry.yoast_head_json;
  const renderedTitle = stripHtml(entry?.title?.rendered);
  const renderedExcerpt = stripHtml(entry?.excerpt?.rendered);

  const title = yoast?.title || renderedTitle || fallbackTitle;
  const description = yoast?.description || yoast?.og_description || renderedExcerpt || fallbackDescription;

  // JSON-LD schema from Yoast
  const schema = yoast?.schema;
  const jsonLd = schema ? JSON.stringify(schema) : null;

  const canonical = toSiteUrl(yoast?.canonical);
  const ogUrl = toSiteUrl(yoast?.og_url);

  const metadata = {
    title,
    description,
    alternates: canonical ? { canonical } : undefined,
    openGraph: {
      title: yoast?.og_title || title,
      description: yoast?.og_description || description,
      url: ogUrl,
      siteName: yoast?.og_site_name,
      type: yoast?.og_type || "website",
      locale: yoast?.og_locale || "en_US",
      images: mapOgImages(yoast?.og_image),
    },
    twitter: {
      card: yoast?.twitter_card || "summary_large_image",
      title: yoast?.twitter_title || yoast?.og_title || title,
      description: yoast?.twitter_description || yoast?.og_description || description,
      images: yoast?.twitter_image ? [yoast.twitter_image] : undefined,
    },
    robots: yoast?.robots
      ? {
          index: yoast.robots.index !== "noindex",
          follow: yoast.robots.follow !== "nofollow",
          googleBot: {
            index: yoast.robots.index !== "noindex",
            follow: yoast.robots.follow !== "nofollow",
            "max-snippet": -1,
            "max-image-preview": "large",
            "max-video-preview": -1,
          },
        }
      : undefined,
    // Inject JSON-LD schema as other metadata
    other: jsonLd ? { "script:ld+json": jsonLd } : undefined,
  };

  // Fallback OG image from featured media
  if (!metadata.openGraph.images) {
    const featuredMedia =
      entry?._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
      entry?.featured_image_url;
    if (featuredMedia) {
      metadata.openGraph.images = [{ url: featuredMedia }];
    }
  }

  return metadata;
}
