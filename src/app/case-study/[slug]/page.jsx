import Header from "@/components/major/Header";
import Footer from "@/components/major/Footer";
import { resolveParams } from "@/lib/params";
import { getCaseStudyBySlug, getCaseStudies } from "@/lib/api";
import { buildMetadataFromYoast } from "@/lib/seo";
import { notFound } from "next/navigation";

export const revalidate = 60;

export async function generateStaticParams() {
  const cases = await getCaseStudies();
  return (Array.isArray(cases) ? cases : []).map((c) => ({ slug: c.slug }));
}

export default async function CaseStudySinglePage({ params }) {
  const { slug } = resolveParams(await params);
  if (!slug) notFound();

  const caseStudy = await getCaseStudyBySlug(slug);
  if (!caseStudy) notFound();

  const title = caseStudy?.title?.rendered || "";
  const content = caseStudy?.content?.rendered || "";
  const featuredImg = caseStudy?._embedded?.["wp:featuredmedia"]?.[0]?.source_url;

  return (
    <>
      <Header />
      <main className="web-width px-6 py-24 mx-auto">
        {featuredImg && (
          <img src={featuredImg} alt={title} className="w-full max-h-125 object-cover rounded-lg mb-10" />
        )}
        <h1 className="section-heading mb-8" dangerouslySetInnerHTML={{ __html: title }} />
        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: content }} />
      </main>
      <Footer />
    </>
  );
}

export async function generateMetadata({ params }) {
  const { slug } = resolveParams(await params);
  const caseStudy = await getCaseStudyBySlug(slug);
  return buildMetadataFromYoast(caseStudy, { fallbackTitle: slug });
}
