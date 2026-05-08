// Layout: case_study_filter
// Fields: background_color, section_title, title, description, custom_class, custom_id

"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";

const ALL_LABEL = "All";

export default function CaseStudyFilter({ data }) {
  const [caseStudies, setCaseStudies] = useState([]);
  const [activeFilter, setActiveFilter] = useState(ALL_LABEL);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!data) return;
    fetch(`/api/case-studies`)
      .then((res) => res.json())
      .then((d) => setCaseStudies(Array.isArray(d) ? d : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [data]);

  if (!data) return null;

  const {
    background_color,
    section_title,
    title,
    description,
    custom_class,
    custom_id,
  } = data;

  const getCategory = (post) =>
    post?._embedded?.["wp:term"]?.[0]?.[0]?.name || null;

  const getFeaturedImage = (post) =>
    post?.featured_image_url ||
    post?._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
    null;

  // Derive unique filter tabs from all case studies
  const filters = useMemo(() => {
    const cats = caseStudies
      .map(getCategory)
      .filter(Boolean)
      .filter((c, i, arr) => arr.indexOf(c) === i);
    return [ALL_LABEL, ...cats];
  }, [caseStudies]);

  const filtered =
    activeFilter === ALL_LABEL
      ? caseStudies
      : caseStudies.filter((cs) => getCategory(cs) === activeFilter);

  return (
    <section
      id={custom_id || undefined}
      className={`w-full px-6 py-16 md:py-24${custom_class ? ` ${custom_class}` : ""}`}
      style={background_color ? { backgroundColor: background_color } : {}}
    >
      <div className="web-width mx-auto">
        {/* Header */}
        {(section_title || title || description) && (
          <div className="mb-10 md:mb-14">
            {section_title && (
              <p className="text-sm font-semibold tracking-wider uppercase text-(--color-accent) mb-3">
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

        {/* Filter tabs */}
        {!loading && filters.length > 1 && (
          <div className="flex flex-wrap gap-3 mb-10">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-5 py-2 rounded-full text-sm font-medium border transition-colors duration-200 ${
                  activeFilter === f
                    ? "bg-[#1E1E1E] text-white border-[#1E1E1E]"
                    : "bg-transparent text-[#1E1E1E] border-[#1E1E1E]/30 hover:border-[#1E1E1E]"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden bg-gray-100 animate-pulse">
                <div className="h-64 bg-gray-200" />
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((cs) => {
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
                      <div className="w-full h-full bg-linear-to-br from-gray-300 to-gray-400" />
                    )}
                    {category && (
                      <span className="absolute top-4 left-4 px-3 py-1 text-xs font-medium text-white bg-white/20 backdrop-blur-md rounded-full border border-white/30">
                        {category}
                      </span>
                    )}
                  </div>
                  <div className="p-6">
                    <h3
                      className="text-lg font-semibold text-[#1E1E1E] group-hover:text-(--color-accent) transition-colors line-clamp-2"
                      dangerouslySetInnerHTML={{ __html: csTitle }}
                    />
                    <span className="inline-flex items-center gap-1 mt-4 text-sm font-medium text-(--color-accent)">
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
        )}
      </div>
    </section>
  );
}
