import { getCaseStudies } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = await getCaseStudies();
  return Response.json(data);
}
