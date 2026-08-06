import { fetchWP } from "@/lib/api";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const perPage = searchParams.get("per_page") || "3";
  const offset = searchParams.get("offset") || "0";
  const categories = searchParams.get("categories");

  let endpoint = `/wp/v2/posts?per_page=${encodeURIComponent(perPage)}&offset=${encodeURIComponent(offset)}&_embed`;
  if (categories) {
    endpoint += `&categories=${encodeURIComponent(categories)}`;
  }

  const data = await fetchWP(endpoint);
  return Response.json(Array.isArray(data) ? data : []);
}
