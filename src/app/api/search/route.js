import { searchWP } from "@/lib/api";

export const revalidate = 0;

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");
  const data = await searchWP(q);
  return Response.json(data);
}
