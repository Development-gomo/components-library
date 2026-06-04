'use client';

// Client shell for tab_cpt_section — handles tab switching.
// Data is pre-fetched server-side and passed as props.

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const ease = [0.22, 1, 0.36, 1];
const CARDS_PER_TAB = 3;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getFeaturedImage(post) {
  return (
    post?.featured_image_url ||
    post?._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
    post?._embedded?.['wp:featuredmedia']?.[0]?.media_details?.sizes?.large?.source_url ||
    null
  );
}

function getCategory(post) {
  return post?._embedded?.['wp:term']?.[0]?.[0]?.name || null;
}

function stripHtml(html) {
  return html?.replace(/<[^>]*>/g, '').trim() || '';
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return '';
  }
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function ArrowRight() {
  return (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

function AvatarPlaceholder() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-white/10">
      <svg className="w-10 h-10 text-white/30" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
      </svg>
    </div>
  );
}

// ─── Cards ────────────────────────────────────────────────────────────────────

function CaseStudyCard({ item }) {
  const img      = getFeaturedImage(item);
  const title    = item?.title?.rendered || '';
  const category = getCategory(item);

  return (
    <Link
      href={`/case-study/${item.slug}`}
      className="group block rounded-2xl overflow-hidden bg-white/5 border border-white/10 hover:border-white/25 hover:-translate-y-1 transition-all duration-300"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-white/5">
        {img ? (
          <Image
            src={img}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width:768px) 100vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent" />
        )}
        {category && (
          <span className="absolute top-3 left-3 px-3 py-1 bg-black/60 backdrop-blur-sm text-white/80 text-[11px] font-medium rounded-full border border-white/10">
            {category}
          </span>
        )}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/50 to-transparent pointer-events-none" />
      </div>
      <div className="p-6">
        <h3
          className="text-white font-semibold text-base md:text-lg leading-snug mb-5 line-clamp-2"
          dangerouslySetInnerHTML={{ __html: title }}
        />
        <span className="inline-flex items-center gap-2 text-blue-400 text-sm font-medium group-hover:gap-3 transition-all duration-200">
          View Case Study <ArrowRight />
        </span>
      </div>
    </Link>
  );
}

function InsightCard({ item }) {
  const img     = getFeaturedImage(item);
  const title   = item?.title?.rendered || '';
  const date    = formatDate(item?.date);
  const excerpt = stripHtml(item?.excerpt?.rendered || '');

  return (
    <Link
      href={`/post/${item.slug}`}
      className="group block rounded-2xl overflow-hidden bg-white/5 border border-white/10 hover:border-white/25 hover:-translate-y-1 transition-all duration-300"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-white/5">
        {img ? (
          <Image
            src={img}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width:768px) 100vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent" />
        )}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/50 to-transparent pointer-events-none" />
      </div>
      <div className="p-6">
        {date && <p className="text-white/35 text-xs mb-2 font-medium tracking-wide">{date}</p>}
        <h3
          className="text-white font-semibold text-base md:text-lg leading-snug mb-3 line-clamp-2"
          dangerouslySetInnerHTML={{ __html: title }}
        />
        {excerpt && (
          <p className="text-white/45 text-sm leading-relaxed mb-4 line-clamp-2">{excerpt}</p>
        )}
        <span className="inline-flex items-center gap-2 text-blue-400 text-sm font-medium group-hover:gap-3 transition-all duration-200">
          Read More <ArrowRight />
        </span>
      </div>
    </Link>
  );
}

function TeamCard({ item }) {
  const name     = item?.title?.rendered || '';
  const position = stripHtml(item?.content?.rendered || item?.acf?.description || '');
  const imgUrl   =
    item?._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
    item?._embedded?.['wp:featuredmedia']?.[0]?.media_details?.sizes?.medium?.source_url ||
    null;

  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-8 flex flex-col items-center text-center">
      <div className="relative w-24 h-24 rounded-full overflow-hidden mb-5 ring-2 ring-white/10">
        {imgUrl ? (
          <Image src={imgUrl} alt={name} fill className="object-cover" sizes="96px" />
        ) : (
          <AvatarPlaceholder />
        )}
      </div>
      <h3 className="text-white font-semibold text-lg leading-tight">{name}</h3>
      {position && (
        <p className="text-white/45 text-sm mt-1.5 leading-relaxed line-clamp-2">{position}</p>
      )}
    </div>
  );
}

// ─── Cards Grid ───────────────────────────────────────────────────────────────

function CardsGrid({ items, postType, direction }) {
  const sliced = items.slice(0, CARDS_PER_TAB);

  const variants = {
    enter:  { opacity: 0, y: direction > 0 ? 20 : -20 },
    center: { opacity: 1, y: 0 },
    exit:   { opacity: 0, y: direction > 0 ? -20 : 20 },
  };

  if (!sliced.length) {
    return (
      <div className="flex items-center justify-center h-48 rounded-2xl border border-white/10 bg-white/5">
        <p className="text-white/30 text-sm">No items found.</p>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={postType}
        custom={direction}
        variants={variants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{ duration: 0.4, ease }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {sliced.map((item) => {
          if (postType === 'casestudy') return <CaseStudyCard key={item.id} item={item} />;
          if (postType === 'insight')   return <InsightCard   key={item.id} item={item} />;
          return <TeamCard key={item.id} item={item} />;
        })}
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────

function SectionHeader({ subHeading, heading, description, align = 'center' }) {
  if (!subHeading && !heading && !description) return null;
  return (
    <div className={cn('mb-14', align === 'center' ? 'text-center mx-auto max-w-3xl' : 'max-w-2xl')}>
      {subHeading && (
        <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.25em] uppercase text-neutral-400 mb-4">
          <span className="w-6 h-px bg-neutral-400 inline-block" />
          {subHeading}
        </span>
      )}
      {heading && (
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-[1.1]">
          {heading}
        </h2>
      )}
      {description && (
        <div
          className="mt-5 text-neutral-400 text-base md:text-lg leading-relaxed prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      )}
    </div>
  );
}

// ─── Tab Navigations ──────────────────────────────────────────────────────────

function PillTabs({ tabs, active, onSelect }) {
  return (
    <div className="flex gap-2 flex-wrap">
      {tabs.map((tab, i) => (
        <button
          key={i}
          onClick={() => onSelect(i)}
          className={cn(
            'cursor-pointer flex items-center gap-2.5 px-5 py-3 rounded-xl text-sm font-medium transition-all duration-300',
            active === i
              ? 'bg-white text-black shadow-lg shadow-white/10'
              : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10'
          )}
        >
          {tab.tab_label}
        </button>
      ))}
    </div>
  );
}

function SidebarTabs({ tabs, active, onSelect, side = 'left' }) {
  return (
    <div className="flex flex-col gap-1">
      {tabs.map((tab, i) => {
        const isActive = active === i;
        return (
          <button
            key={i}
            onClick={() => onSelect(i)}
            className={cn(
              'relative cursor-pointer flex items-center gap-3 px-4 py-4 rounded-xl text-left transition-all duration-300',
              isActive ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white hover:bg-white/5'
            )}
          >
            {isActive && (
              <motion.div
                layoutId={`cpt-indicator-${side}`}
                className={cn(
                  'absolute top-1/2 -translate-y-1/2 w-0.5 h-8 bg-blue-400 rounded-full',
                  side === 'left' ? 'left-0' : 'right-0'
                )}
                transition={{ duration: 0.3, ease }}
              />
            )}
            <span className="text-sm font-medium leading-tight">{tab.tab_label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export default function TabsCptClient({
  tabs,
  tabData,
  style,
  background_color,
  sub_heading,
  heading,
  description,
  custom_class,
  custom_id,
}) {
  const [active, setActive]     = useState(0);
  const [direction, setDirection] = useState(1);

  const go = (idx) => {
    if (idx === active) return;
    setDirection(idx > active ? 1 : -1);
    setActive(idx);
  };

  const currentTab      = tabs[active] || {};
  const currentPostType = currentTab.post_type || 'casestudy';
  const currentItems    = tabData[currentPostType] || [];

  const cards = (
    <CardsGrid items={currentItems} postType={currentPostType} direction={direction} />
  );

  const renderLayout = () => {
    switch (style) {
      case 'left':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-3">
              <SidebarTabs tabs={tabs} active={active} onSelect={go} side="left" />
            </div>
            <div className="lg:col-span-9">{cards}</div>
          </div>
        );

      case 'right':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-9 order-2 lg:order-1">{cards}</div>
            <div className="lg:col-span-3 order-1 lg:order-2">
              <SidebarTabs tabs={tabs} active={active} onSelect={go} side="right" />
            </div>
          </div>
        );

      case 'bottom':
        return (
          <div>
            <div className="mb-10">{cards}</div>
            <PillTabs tabs={tabs} active={active} onSelect={go} />
          </div>
        );

      default:
        return (
          <div>
            <div className="mb-10">
              <PillTabs tabs={tabs} active={active} onSelect={go} />
            </div>
            {cards}
          </div>
        );
    }
  };

  return (
    <section
      id={custom_id || undefined}
      className={cn('py-16 md:py-24 lg:py-32', custom_class)}
      style={background_color ? { backgroundColor: background_color } : { backgroundColor: '#0a0a0c' }}
    >
      <div className="mx-auto w-full max-w-[1440px] px-6 md:px-10 lg:px-16">
        <SectionHeader
          subHeading={sub_heading}
          heading={heading}
          description={description}
          align={['left', 'right'].includes(style) ? 'left' : 'center'}
        />
        {renderLayout()}
      </div>
    </section>
  );
}
