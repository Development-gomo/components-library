import { getCaseStudies } from "@/lib/api";

export async function GET() {
  const data = await getCaseStudies();
  return Response.json(data);
}
