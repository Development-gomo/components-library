// Layout: team_section
// Fields: background_color, section_title, title, description,
//         display_type (grid | slider), grid_type (checkbox: default | left),
//         custom_class, custom_id
// Team CPT: title.rendered (name), content.rendered (position — editor), featured image (photo)

import Image from "next/image";
import { getTeamMembers } from "@/lib/api";
import TeamSlider from "./TeamSlider";

// ─── Helper: extract member fields ──────────────────────────────────────────
function parseMember(m) {
  const featuredMedia = m._embedded?.["wp:featuredmedia"]?.[0];
  return {
    id: m.id,
    name: m.title?.rendered || "",
    position: m.content?.rendered || m.acf?.description || "",
    imgUrl:
      featuredMedia?.source_url ||
      featuredMedia?.media_details?.sizes?.large?.source_url ||
      featuredMedia?.media_details?.sizes?.medium_large?.source_url ||
      null,
    imgAlt: featuredMedia?.alt_text || m.title?.rendered || "",
    social: {
      linkedin:  m.acf?.linkedin  || "https://linkedin.com",
      twitter:   m.acf?.twitter   || "https://x.com",
      instagram: m.acf?.instagram || "https://instagram.com",
      facebook:  m.acf?.facebook  || "https://facebook.com",
    },
  };
}

// ─── Placeholder avatar ──────────────────────────────────────────────────────
function AvatarPlaceholder() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
      <svg className="w-14 h-14 text-gray-400" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
      </svg>
    </div>
  );
}

// ─── Social icons row ────────────────────────────────────────────────────────
function SocialIcons({ social }) {
  const links = [
    {
      key: "linkedin", href: social?.linkedin,
      icon: <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z" />,
    },
    {
      key: "twitter", href: social?.twitter,
      icon: <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />,
    },
    {
      key: "instagram", href: social?.instagram,
      icon: <><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></>,
    },
    {
      key: "facebook", href: social?.facebook,
      icon: <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />,
    },
  ].filter((l) => l.href);

  if (!links.length) return null;

  return (
    <div className="flex items-center gap-2 mt-3">
      {links.map(({ key, href, icon }) => (
        <a
          key={key}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-7 h-7 rounded-full bg-white/20 hover:bg-[var(--color-accent)] hover:text-black text-white transition-colors duration-200"
          aria-label={key}
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            {icon}
          </svg>
        </a>
      ))}
    </div>
  );
}

// ─── Card: Grid Default — portrait with persistent bottom gradient + hover reveal ──
function DefaultGridCard({ member }) {
  return (
    <div className="group relative overflow-hidden rounded-3xl bg-gray-200 aspect-square cursor-pointer">
      {member.imgUrl ? (
        <Image
          src={member.imgUrl}
          alt={member.imgAlt}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover object-top transition-transform duration-700 group-hover:scale-110"
        />
      ) : (
        <AvatarPlaceholder />
      )}

      {/* Always-on bottom gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

      {/* Name — always visible at bottom */}
      <div className="absolute bottom-0 left-0 right-0 px-5 pb-5">
        {/* Position — hidden below, slides up on hover */}
        {member.position && (
          <div
            className="text-xs text-white/80 mb-2 leading-relaxed [&_p]:m-0 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
            dangerouslySetInnerHTML={{ __html: member.position }}
          />
        )}
        {member.name && (
          <p className="text-base font-semibold text-white leading-snug">{member.name}</p>
        )}
        {/* Social icons — fade in on hover */}
        <div className="opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 delay-75">
          <SocialIcons social={member.social} />
        </div>
        {/* Accent underline that expands on hover */}
        <div className="mt-2 h-0.5 w-8 bg-[var(--color-accent)] group-hover:w-full transition-all duration-500" />
      </div>
    </div>
  );
}

// ─── Card: Grid Left — clean card with image + info below ──────────────────
function LeftGridCard({ member }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl aspect-[3/4] cursor-pointer bg-gray-200">

      {/* Photo — zooms on hover */}
      {member.imgUrl ? (
        <Image
          src={member.imgUrl}
          alt={member.imgAlt}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover object-top transition-transform duration-700 group-hover:scale-110"
        />
      ) : (
        <AvatarPlaceholder />
      )}

      {/* Gradient overlay — rises from bottom on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-dark)] via-[var(--color-dark)]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

      {/* Name & role — slide up on hover */}
      <div className="absolute bottom-0 left-0 right-0 px-5 py-5 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400 ease-out">
        {/* Accent line */}
        <div className="w-8 h-0.5 bg-[var(--color-accent)] mb-3" />
        {member.name && (
          <p className="text-base font-semibold text-white leading-snug">{member.name}</p>
        )}
        {member.position && (
          <div
            className="text-xs text-white/70 mt-1 leading-relaxed [&_p]:m-0"
            dangerouslySetInnerHTML={{ __html: member.position }}
          />
        )}
        {/* Social icons */}
        <SocialIcons social={member.social} />
      </div>

    </div>
  );
}

// ─── Section header ──────────────────────────────────────────────────────────
function SectionHeader({ section_title, title, description, centered = false }) {
  if (!section_title && !title && !description) return null;
  return (
    <div className={centered ? "text-center mb-12 md:mb-16 max-w-2xl mx-auto" : ""}>
      {section_title && (
        <p className="text-sm font-semibold tracking-widest uppercase text-[var(--color-accent)] mb-3">
          {section_title}
        </p>
      )}
      {title && (
        <h2 className="text-4xl md:text-6xl font-bold text-[var(--color-dark)] mb-6 leading-tight" style={{ fontFamily: "Georgia, serif" }}>
          {title}
        </h2>
      )}
      {description && (
        <div
          className="text-sm md:text-base text-gray-500 leading-relaxed [&_p]:m-0"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      )}
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────
export default async function TeamSection({ data }) {
  if (!data) return null;

  const {
    background_color,
    section_title,
    title,
    description,
    display_type = "grid",
    grid_type,
    custom_class,
    custom_id,
  } = data;

  const raw = await getTeamMembers();
  if (raw.length === 0) return null;

  const members = raw.map(parseMember);

  // grid_type is ACF checkbox → array ['left'] or ['default']
  const isLeftRight = Array.isArray(grid_type)
    ? grid_type.includes("left")
    : grid_type === "left";

  return (
    <section
      id={custom_id || undefined}
      className={`w-full px-6 py-16 md:py-24${custom_class ? ` ${custom_class}` : ""}`}
      style={background_color ? { backgroundColor: background_color } : {}}
    >
      <div className="web-width mx-auto">

        {/* ── SLIDER ──────────────────────────────────────────────────────── */}
        {display_type === "slider" && (
          <>
            <SectionHeader section_title={section_title} title={title} description={description} centered />
            <TeamSlider members={members} />
          </>
        )}

        {/* ── GRID / LEFT-RIGHT — 50/50 split ─────────────────────────────── */}
        {display_type === "grid" && isLeftRight && (
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
            {/* Left 50% — sticky header */}
            <div className="w-full lg:w-[40%] lg:sticky lg:top-24">
              <SectionHeader section_title={section_title} title={title} description={description} />
            </div>
            {/* Right 50% — 2-col grid */}
            <div className="w-full lg:w-[60%] grid grid-cols-2 md:grid-cols-3 gap-6">
              {members.map((m) => (
                <LeftGridCard key={m.id} member={m} />
              ))}
            </div>
          </div>
        )}

        {/* ── GRID / DEFAULT — centered heading + 4-col grid ──────────────── */}
        {display_type === "grid" && !isLeftRight && (
          <>
            <SectionHeader section_title={section_title} title={title} description={description} centered />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {members.map((m) => (
                <DefaultGridCard key={m.id} member={m} />
              ))}
            </div>
          </>
        )}

      </div>
    </section>
  );
}

