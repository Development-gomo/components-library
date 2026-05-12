// Layout: case_study_slider_full_width
// Fields: background_color, section_title, title, description, custom_class, custom_id

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { fetchCaseStudiesClient } from "@/lib/clientApi";

export default function CaseStudySliderFullWidth({ data, initialCaseStudies = null }) {
  const hasInitialCaseStudies = Array.isArray(initialCaseStudies);
  const [caseStudies, setCaseStudies] = useState(() =>
    hasInitialCaseStudies ? initialCaseStudies : []
  );

  useEffect(() => {
    if (!data || hasInitialCaseStudies) return;
    fetchCaseStudiesClient().then(setCaseStudies);
  }, [data, hasInitialCaseStudies]);

  if (!data || !caseStudies.length) return null;

  const {
    background_color,
    section_title,
    title,
    description,
    custom_class,
    custom_id,
  } = data;

  const getFeaturedImage = (post) =>
    post?.featured_image_url ||
    post?._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
    null;

  const getCategory = (post) =>
    post?._embedded?.["wp:term"]?.[0]?.[0]?.name || null;

  return (
    <section
      id={custom_id || undefined}
      className={`w-full overflow-hidden py-16 md:py-24${custom_class ? ` ${custom_class}` : ""}`}
      style={background_color ? { backgroundColor: background_color } : {}}
    >
      {/* Header — constrained width */}
      {(section_title || title || description) && (
        <div className="web-width mx-auto px-6 mb-12 md:mb-16">
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

      {/* Full-width Swiper — each slide is a large hero-style card */}
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        spaceBetween={0}
        slidesPerView={1}
        loop={caseStudies.length > 1}
        className="w-full"
      >
        {caseStudies.map((cs) => {
          const img = getFeaturedImage(cs);
          const csTitle = cs.title?.rendered || "";
          const category = getCategory(cs);
          const href = `/case-study/${cs.slug}`;

          return (
            <SwiperSlide key={cs.id}>
              <Link href={href} className="group block relative w-full h-125 md:h-150">
                {/* Background image */}
                {img ? (
                  <Image
                    src={img}
                    alt={csTitle}
                    fill
                    sizes="100vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    priority
                  />
                ) : (
                  <div className="w-full h-full bg-linear-to-br from-gray-700 to-gray-900" />
                )}

                {/* Dark overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 web-width mx-auto">
                  {category && (
                    <span className="inline-block px-4 py-1.5 mb-4 text-xs font-medium text-white bg-white/15 backdrop-blur-md rounded-full border border-white/20">
                      {category}
                    </span>
                  )}
                  <h3
                    className="text-2xl md:text-4xl font-bold text-white max-w-3xl line-clamp-2 mb-4"
                    dangerouslySetInnerHTML={{ __html: csTitle }}
                  />
                  <span className="inline-flex items-center gap-2 text-sm font-medium text-white/80 group-hover:text-white transition-colors">
                    Read case study
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 17L17 7M7 7h10v10" />
                    </svg>
                  </span>
                </div>
              </Link>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </section>
  );
}
