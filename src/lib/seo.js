// src/lib/seo.js
import "server-only";
import { toProxiedMediaUrl } from "@/lib/mediaProxy";

// Note: `entry` here has already been through fetchWP()'s rewriteWpUrlsDeep, so
// canonical/og_url/_embedded media URLs are already masked (relative /api/media/...
// or SITE_URL-based) by the time they reach this file. The helpers below are kept
// as a defensive second pass in case this is ever called with unprocessed data.

function stripHtml(raw) {
  if (!raw) return "";
  return raw.replace(/<[^>]*>?/gm, "").replace(/\s+/g, " ").trim();
}

function mapOgImages(images = []) {
  if (!Array.isArray(images)) return undefined;
  const mapped = images
    .map((img) => {
      if (!img?.url) return null;
      return { url: toProxiedMediaUrl(img.url, { absolute: true }), width: img.width, height: img.height, type: img.type, alt: img.alt };
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

  const canonical = yoast?.canonical;
  const ogUrl = yoast?.og_url;

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
      images: yoast?.twitter_image ? [toProxiedMediaUrl(yoast.twitter_image, { absolute: true })] : undefined,
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
      metadata.openGraph.images = [{ url: toProxiedMediaUrl(featuredMedia, { absolute: true }) }];
    }
  }

  return metadata;
}
