import Image from "next/image";
import Link from "next/link";
import Header from "@/components/major/Header";
import Footer from "@/components/major/Footer";
import { resolveParams } from "@/lib/params";
import { getCaseStudyBySlug, getCaseStudies } from "@/lib/api";
import { buildMetadataFromYoast } from "@/lib/seo";
import { notFound } from "next/navigation";
import CaseStudyLoadMore from "@/components/sections/case-study/CaseStudyLoadMore";

export const revalidate = 60;

export async function generateStaticParams() {
  const cases = await getCaseStudies();
  return (Array.isArray(cases) ? cases : []).map((c) => ({ slug: c.slug }));
}

function formatDate(dateStr) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatTime(dateStr) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function CaseStudySinglePage({ params }) {
  const { slug } = resolveParams(await params);
  if (!slug) notFound();

  const caseStudy = await getCaseStudyBySlug(slug);
  if (!caseStudy) notFound();

  const title = caseStudy?.title?.rendered || "";
  const content = caseStudy?.content?.rendered || "";
  const featuredImg = caseStudy?._embedded?.["wp:featuredmedia"]?.[0]?.source_url;
  const category = caseStudy?._embedded?.["wp:term"]?.[0]?.[0]?.name || null;
  const formattedDate = formatDate(caseStudy?.date);
  const formattedTime = formatTime(caseStudy?.date);

  return (
    <>
      <Header />
      <main>
        {/* ── Hero ──────────────────────────────────────────────────── */}
        <section className="relative w-full overflow-hidden bg-[var(--color-dark)] min-h-[75vh] flex flex-col justify-end">
          {featuredImg && (
            <Image
              src={featuredImg}
              alt={title.replace(/<[^>]*>/g, "")}
              fill
              sizes="100vw"
              className="object-cover opacity-40"
              priority
            />
          )}
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-dark)] via-[var(--color-dark)]/50 to-transparent" />

          {/* Back link */}
          <div className="absolute top-8 left-0 right-0 z-10 web-width mx-auto px-6">
            <Link
              href="/case-study"
              className="inline-flex items-center gap-2 text-white/60 hover:text-[var(--color-accent)] transition-colors duration-200 text-sm font-medium tracking-wide cursor-pointer"
            >
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 12H5M12 5l-7 7 7 7" />
              </svg>
              All Case Studies
            </Link>
          </div>

          {/* Title block */}
          <div className="relative z-10 web-width mx-auto px-6 pb-14 pt-32">
            {category && (
              <span className="inline-block text-[var(--color-accent)] text-xs font-semibold tracking-widest uppercase mb-5 border border-[var(--color-accent)]/40 px-3 py-1 rounded-full">
                {category}
              </span>
            )}
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white leading-[1.1] max-w-4xl mb-6"
              dangerouslySetInnerHTML={{ __html: title }}
            />

            {/* Date + time meta */}
            {(formattedDate || formattedTime) && (
              <div className="flex flex-wrap items-center gap-4 text-white/50 text-sm">
                {formattedDate && (
                  <span className="inline-flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {formattedDate}
                  </span>
                )}
                {formattedDate && formattedTime && (
                  <span className="w-px h-3.5 bg-white/20" />
                )}
                {formattedTime && (
                  <span className="inline-flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {formattedTime}
                  </span>
                )}
              </div>
            )}
          </div>
        </section>

        {/* ── Article ───────────────────────────────────────────────── */}
        <article className="web-width mx-auto px-6 py-16 md:py-24">
          <div className="flex items-center gap-4 mb-14">
            <div className="w-12 h-[3px] bg-[var(--color-accent)] rounded-full shrink-0" />
            <div className="h-px flex-1 bg-gray-100" />
          </div>

          <div className="cs-prose" dangerouslySetInnerHTML={{ __html: content }} />

          <div className="flex items-center gap-4 mt-16">
            <div className="h-px flex-1 bg-gray-100" />
            <div className="w-12 h-[3px] bg-[var(--color-accent)] rounded-full shrink-0" />
          </div>
        </article>

        {/* ── Back CTA ──────────────────────────────────────────────── */}
        <div className="web-width mx-auto px-6 pb-16">
          <Link
            href="/case-study"
            className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-dark)] hover:text-[var(--color-accent)] transition-colors duration-200 cursor-pointer"
          >
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            Back to Case Studies
          </Link>
        </div>

        {/* ── More Case Studies ─────────────────────────────────────── */}
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
