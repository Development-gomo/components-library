import "server-only";
import { WP_BASE } from "@/config";

// Same-origin media proxy: the browser only ever sees /api/media/<path>, never the
// real WP origin. Deliberately restricted to /wp-content/ — this is a media proxy,
// not a general WP reverse proxy, so wp-admin/wp-login/etc. are never forwardable.
function getWpRoot() {
  return WP_BASE.replace(/\/wp-json\/?$/, "");
}

export async function GET(request, { params }) {
  const { path: segments } = await params;
  const relPath = (segments || []).join("/");

  if (!relPath.startsWith("wp-content/") || relPath.includes("..")) {
    return new Response("Not found", { status: 404 });
  }

  const wpRoot = getWpRoot();
  if (!wpRoot) return new Response("Not configured", { status: 404 });

  const upstreamUrl = `${wpRoot}/${relPath}`;

  let upstream;
  try {
    upstream = await fetch(upstreamUrl, { next: { revalidate: 86400 } });
  } catch {
    return new Response("Upstream fetch failed", { status: 502 });
  }

  if (!upstream.ok || !upstream.body) {
    return new Response("Not found", { status: upstream.status || 404 });
  }

  const headers = new Headers();
  const contentType = upstream.headers.get("content-type");
  if (contentType) headers.set("Content-Type", contentType);
  const contentLength = upstream.headers.get("content-length");
  if (contentLength) headers.set("Content-Length", contentLength);
  headers.set("Cache-Control", "public, max-age=31536000, immutable");

  return new Response(upstream.body, { status: 200, headers });
}
