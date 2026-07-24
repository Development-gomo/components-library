// Layout: case_study_grid_layout
// 3-item layout: 1 large featured card (left, ~60%) + 2 horizontal mini-cards stacked (right, ~40%)
// ACF Fields:
//   background_color  (color_picker)
//   section_title     (text)
//   title             (text)
//   description       (wysiwyg)
//   custom_class      (text)
//   custom_id         (text)

// Note: case studies themselves come from the WordPress REST API (getCaseStudies),
// not an ACF repeater on this block.

import Image from "next/image";
import Link from "next/link";
import { getCaseStudies } from "@/lib/api";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getFeaturedImage(post) {
  return (
    post?.featured_image_url ||
    post?._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
    post?._embedded?.["wp:featuredmedia"]?.[0]?.media_details?.sizes?.large?.source_url ||
    null
  );
}

function getCategory(post) {
  return post?._embedded?.["wp:term"]?.[0]?.[0]?.name || null;
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function CalendarIcon() {
  return (
    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="shrink-0">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

// ─── Category pill ────────────────────────────────────────────────────────────

function CategoryPill({ label, dark = false }) {
  if (!label) return null;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
        dark
          ? "bg-white/15 border-white/20 text-white backdrop-blur-sm"
          : "bg-white border-neutral-200 text-neutral-700"
      }`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
      {label}
    </span>
  );
}

// ─── Featured card (left, large) ─────────────────────────────────────────────

function FeaturedCard({ cs }) {
  const img      = getFeaturedImage(cs);
  const title    = cs.title?.rendered || "";
  const category = getCategory(cs);
  const date     = formatDate(cs.date);
  const href     = `/case-study/${cs.slug}`;

  return (
    <Link
      href={href}
      className="group relative flex flex-col justify-between rounded-2xl overflow-hidden h-full min-h-[420px] md:min-h-[460px]"
    >
      {/* Background image */}
      {img ? (
        <Image
          src={img}
          alt={title}
          fill
          priority
          className="object-cover group-hover:scale-105 transition-transform duration-700"
          sizes="(max-width:768px) 100vw, 60vw"
        />
      ) : (
        <div className="absolute inset-0 bg-neutral-800" />
      )}

      {/* Multi-direction overlay */}
      <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/20 to-black/30" />

      {/* Category pill — top left */}
      <div className="relative z-10 p-6">
        <CategoryPill label={category} dark />
      </div>

      {/* Bottom content */}
      <div className="relative z-10 p-6 flex items-end justify-between gap-4">
        {/* Title + CTA */}
        <div className="flex-1">
          <h3
            className="text-white text-xl md:text-2xl font-bold leading-snug mb-4 line-clamp-3"
            dangerouslySetInnerHTML={{ __html: title }}
          />
          <span className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#1a2b5e] text-white text-sm font-medium group-hover:bg-[#253f8a] transition-colors duration-200">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
            View case study
          </span>
        </div>

        {/* Date block — bottom right */}
        {date && (
          <div className="shrink-0 text-right text-white/80">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-white/50 mb-0.5">
              Published
            </p>
            <p className="text-sm font-semibold leading-tight">{date}</p>
          </div>
        )}
      </div>
    </Link>
  );
}

// ─── Mini card (right side, horizontal) ──────────────────────────────────────

function MiniCard({ cs }) {
  const img      = getFeaturedImage(cs);
  const title    = cs.title?.rendered || "";
  const category = getCategory(cs);
  const date     = formatDate(cs.date);
  const href     = `/case-study/${cs.slug}`;

  return (
    <Link
      href={href}
      className="group flex gap-4 bg-white rounded-2xl overflow-hidden border border-neutral-100 hover:shadow-md hover:border-neutral-200 transition-all duration-300 p-0"
    >
      {/* Thumbnail */}
      <div className="relative w-28 md:w-32 shrink-0 self-stretch min-h-[130px]">
        {img ? (
          <Image
            src={img}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="128px"
          />
        ) : (
          <div className="absolute inset-0 bg-neutral-100" />
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col justify-between py-4 pr-4 flex-1 min-w-0">
        <div>
          <CategoryPill label={category} />
          <h3
            className="mt-2 text-[#1a1a1a] text-sm md:text-base font-semibold leading-snug line-clamp-2 group-hover:text-(--color-accent) transition-colors"
            dangerouslySetInnerHTML={{ __html: title }}
          />
        </div>
        {date && (
          <div className="flex items-center gap-1.5 mt-3 text-neutral-400 text-xs">
            <CalendarIcon />
            <span>{date}</span>
          </div>
        )}
      </div>
    </Link>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default async function CaseStudyGridLayout({ data, caseStudiesData = null }) {
  if (!data) return null;

  const {
    background_color,
    section_title,
    title,
    description,
    custom_class,
    custom_id,
  } = data;

  const caseStudies = Array.isArray(caseStudiesData)
    ? caseStudiesData
    : await getCaseStudies();

  const items = caseStudies.slice(0, 4);
  if (!items.length) return null;

  const [featured, ...minis] = items;

  return (
    <section
      id={custom_id || undefined}
      className={`w-full px-6 py-16 md:py-24${custom_class ? ` ${custom_class}` : ""}`}
      style={background_color ? { backgroundColor: background_color } : {}}
    >
      <div className="web-width mx-auto">

        {/* Section header */}
        {(section_title || title || description) && (
          <div className="mb-10 md:mb-14">
            {section_title && (
              <p className="text-sm font-semibold tracking-wider uppercase text-(--color-accent) mb-3">
                {section_title}
              </p>
            )}
            {title && (
              <h2 className="text-3xl md:text-5xl font-bold text-[#1E1E1E] mb-4">
                {title}
              </h2>
            )}
            {description && (
              <div
                className="text-lg text-gray-600 max-w-3xl"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            )}
          </div>
        )}

        {/* Grid: featured left + mini-cards right */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">

          {/* Featured — spans 3 of 5 cols */}
          <div className="md:col-span-3">
            <FeaturedCard cs={featured} />
          </div>

          {/* Mini cards — spans 2 of 5 cols, stacked */}
          {minis.length > 0 && (
            <div className="md:col-span-2 flex flex-col gap-4">
              {minis.map((cs) => (
                <MiniCard key={cs.id} cs={cs} />
              ))}
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
