import Header from "@/components/major/Header";
import Footer from "@/components/major/Footer";
import { resolveParams } from "@/lib/params";
import { getCaseStudyBySlug, getCaseStudies } from "@/lib/api";
import { buildMetadataFromYoast } from "@/lib/seo";
import { notFound } from "next/navigation";
import PageBuilderCasestudy from "@/components/major/PageBuilderCasestudy";
import CaseStudyLoadMore from "@/components/sections/case-study/CaseStudyLoadMore";

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

  const sections = caseStudy?.acf?.case_study_builder;

  return (
    <>
      <Header />
      <main>
        <PageBuilderCasestudy sections={sections} />
        <CaseStudyLoadMore data={{ section_title: "More Work", title: "Explore More Case Studies" }} />
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
