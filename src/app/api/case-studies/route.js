import { getCaseStudies } from "@/lib/api";

export const revalidate = 60;

export async function GET() {
  const data = await getCaseStudies();
  return Response.json(data);
}
