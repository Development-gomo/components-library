// Layout: case_study_listing
// Fields: background_color, section_title, title, description, custom_class, custom_id

import Image from "next/image";
import Link from "next/link";
import { getCaseStudies } from "@/lib/api";

export default async function CaseStudyListing({ data }) {
  if (!data) return null;

  const {
    background_color,
    section_title,
    title,
    description,
    custom_class,
    custom_id,
  } = data;

  const caseStudies = await getCaseStudies();
  if (!caseStudies.length) return null;

  const getFeaturedImage = (post) =>
    post?.featured_image_url ||
    post?._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
    null;

  const getCategory = (post) =>
    post?._embedded?.["wp:term"]?.[0]?.[0]?.name || null;

  return (
    <section
      id={custom_id || undefined}
      className={`w-full px-6 py-16 md:py-24${custom_class ? ` ${custom_class}` : ""}`}
      style={background_color ? { backgroundColor: background_color } : {}}
    >
      <div className="web-width mx-auto">
        {/* Header */}
        {(section_title || title || description) && (
          <div className="mb-12 md:mb-16">
            {section_title && (
              <p className="text-sm font-semibold tracking-wider uppercase text-[var(--color-accent)] mb-3">
                {section_title}
              </p>
            )}
            {title && (
              <h2 className="text-3xl md:text-5xl font-bold text-[#1E1E1E] mb-6">
                {title}
              </h2>
            )}
            {description && (
              <div
                className="text-lg text-gray-700 max-w-3xl"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            )}
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {caseStudies.map((cs) => {
            const img = getFeaturedImage(cs);
            const csTitle = cs.title?.rendered || "";
            const category = getCategory(cs);
            const href = `/case-study/${cs.slug}`;

            return (
              <Link
                key={cs.id}
                href={href}
                className="group block rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 bg-white"
              >
                <div className="relative h-64 bg-gray-200 overflow-hidden">
                  {img ? (
                    <Image
                      src={img}
                      alt={csTitle}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400" />
                  )}
                  {category && (
                    <span className="absolute top-4 left-4 px-3 py-1 text-xs font-medium text-white bg-white/20 backdrop-blur-md rounded-full border border-white/30">
                      {category}
                    </span>
                  )}
                </div>
                <div className="p-6">
                  <h3
                    className="text-lg font-semibold text-[#1E1E1E] group-hover:text-[var(--color-accent)] transition-colors line-clamp-2"
                    dangerouslySetInnerHTML={{ __html: csTitle }}
                  />
                  <span className="inline-flex items-center gap-1 mt-4 text-sm font-medium text-[var(--color-accent)]">
                    Read case study
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 17L17 7M7 7h10v10" />
                    </svg>
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
