// Layout: case_study_bento_grid
// Bento grid: 3 cols × 3 rows, first 7 case studies fill fixed positions.
// Slot 0 → featured white card | Slots 1,4,5,6 → text cards | Slots 2,3 → tall image cards

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

function getClientLogo(post) {
  return (
    post?.acf?.client_logo?.url ||
    post?.acf?.logo?.url ||
    null
  );
}

// ─── Bento slot config ────────────────────────────────────────────────────────
// Each slot defines its explicit CSS grid placement and visual card type.
//
//  col1          col2          col3
//  [0 featured]  [1 text ]     [2 image  ↕ rows 1-2]
//  [3 image ↕]   [4 text ]
//  [  rows 2-3]  [5 text ]     [6 text  ]

const SLOTS = [
  { gridColumn: "1",     gridRow: "1",     type: "featured" },
  { gridColumn: "2",     gridRow: "1",     type: "text"     },
  { gridColumn: "3",     gridRow: "1 / 3", type: "image"    },
  { gridColumn: "1",     gridRow: "2 / 4", type: "image"    },
  { gridColumn: "2",     gridRow: "2",     type: "text"     },
  { gridColumn: "2",     gridRow: "3",     type: "text"     },
  { gridColumn: "3",     gridRow: "3",     type: "text"     },
];

// ─── Card components ──────────────────────────────────────────────────────────

function FeaturedCard({ cs }) {
  const img    = getFeaturedImage(cs);
  const logo   = getClientLogo(cs);
  const title  = cs.title?.rendered || "";
  const href   = `/case-study/${cs.slug}`;

  return (
    <Link
      href={href}
      className="group flex flex-col justify-between p-6 bg-white rounded-2xl overflow-hidden h-full hover:shadow-xl transition-shadow duration-300"
    >
      {/* Logo + title */}
      <div className="flex-1">
        {logo ? (
          <div className="relative h-7 w-28 mb-5">
            <Image src={logo} alt={title} fill className="object-contain object-left" sizes="112px" />
          </div>
        ) : (
          <span className="inline-block text-[10px] font-bold tracking-widest uppercase text-neutral-400 mb-5">
            Case Study
          </span>
        )}
        <h3
          className="text-[#1a1a1a] text-base md:text-lg font-semibold leading-snug line-clamp-3"
          dangerouslySetInnerHTML={{ __html: title }}
        />
      </div>

      {/* CTA + thumbnail */}
      <div className="flex items-end justify-between mt-6 gap-3">
        <span className="inline-flex items-center gap-2 text-sm font-medium text-[#1a1a1a] border border-[#1a1a1a]/20 rounded-full px-4 py-2 group-hover:bg-[#1a1a1a] group-hover:text-white group-hover:border-[#1a1a1a] transition-all duration-200 shrink-0">
          Read case
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M7 17L17 7M7 7h10v10" />
          </svg>
        </span>
        {img && (
          <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0">
            <Image src={img} alt={title} fill className="object-cover" sizes="56px" />
          </div>
        )}
      </div>
    </Link>
  );
}

function TextCard({ cs }) {
  const logo  = getClientLogo(cs);
  const title = cs.title?.rendered || "";
  const href  = `/case-study/${cs.slug}`;

  return (
    <Link
      href={href}
      className="group flex flex-col justify-between p-6 bg-white rounded-2xl h-full hover:shadow-lg transition-shadow duration-300"
    >
      <h3
        className="text-[#1a1a1a] text-sm md:text-base font-semibold leading-snug line-clamp-3"
        dangerouslySetInnerHTML={{ __html: title }}
      />
      <div className="flex items-end justify-between mt-4">
        {logo ? (
          <div className="relative h-6 w-24">
            <Image src={logo} alt={title} fill className="object-contain object-left" sizes="96px" />
          </div>
        ) : (
          <span />
        )}
        <span className="inline-flex items-center gap-1 text-xs font-medium text-[#1a1a1a]/50 group-hover:text-(--color-accent) transition-colors shrink-0">
          Read more
          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M7 17L17 7M7 7h10v10" />
          </svg>
        </span>
      </div>
    </Link>
  );
}

function ImageCard({ cs }) {
  const img   = getFeaturedImage(cs);
  const logo  = getClientLogo(cs);
  const title = cs.title?.rendered || "";
  const href  = `/case-study/${cs.slug}`;

  return (
    <Link href={href} className="group relative block rounded-2xl overflow-hidden h-full min-h-[200px]">
      {/* Background image */}
      {img ? (
        <Image
          src={img}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
          sizes="(max-width:768px) 100vw, 33vw"
        />
      ) : (
        <div className="absolute inset-0 bg-neutral-800" />
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-black/10" />

      {/* Content pinned to bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
        {logo && (
          <div className="relative h-5 w-20 mb-3">
            <Image src={logo} alt={title} fill className="object-contain object-left brightness-0 invert opacity-90" sizes="80px" />
          </div>
        )}
        <h3
          className="text-white text-sm md:text-base font-semibold leading-snug line-clamp-2"
          dangerouslySetInnerHTML={{ __html: title }}
        />
      </div>
    </Link>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default async function CaseStudyBentoGrid({ data, caseStudiesData = null }) {
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

  // Fill only available slots — up to 7
  const items = caseStudies.slice(0, SLOTS.length);
  if (!items.length) return null;

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

        {/* Bento grid — desktop: explicit placement | mobile: stacked */}
        <div
          className="hidden md:grid gap-3"
          style={{
            gridTemplateColumns: "repeat(3, 1fr)",
            gridTemplateRows:    "repeat(3, minmax(180px, auto))",
          }}
        >
          {items.map((cs, i) => {
            const slot = SLOTS[i];
            return (
              <div
                key={cs.id}
                style={{ gridColumn: slot.gridColumn, gridRow: slot.gridRow }}
              >
                {slot.type === "featured" && <FeaturedCard cs={cs} />}
                {slot.type === "text"     && <TextCard     cs={cs} />}
                {slot.type === "image"    && <ImageCard    cs={cs} />}
              </div>
            );
          })}
        </div>

        {/* Mobile: simple 1-col stack */}
        <div className="flex flex-col gap-4 md:hidden">
          {items.map((cs, i) => {
            const slot = SLOTS[i];
            return (
              <div key={cs.id} className="min-h-[200px]">
                {slot.type === "featured" && <FeaturedCard cs={cs} />}
                {slot.type === "text"     && <TextCard     cs={cs} />}
                {slot.type === "image"    && <ImageCard    cs={cs} />}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
