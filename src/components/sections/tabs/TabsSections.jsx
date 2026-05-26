'use client';

// Layout: tab_section
// ACF Fields:
//   background_color  (color_picker)
//   sub_heading       (text)
//   heading           (text)
//   description       (wysiwyg)
//   custom_class      (text)
//   custom_id         (text)
//   tab_style         (select: top | left | right | bottom | horizontalslider | verticleslider)
//   tab               (repeater)
//     tab_label           (text)
//     tab_imageicon       (image)
//     testimonial_name    (wysiwyg)  ← tab content field
//     tab_media           (select: image | video)
//     tab_content_image   (image)
//     tab_content_video   (file)

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function resolveImage(img) {
  if (!img) return '';
  return img.url || img.sizes?.large || img.sizes?.medium_large || img.sizes?.medium || '';
}

function resolveVideo(file) {
  if (!file) return '';
  return file.url || '';
}

const AUTO_PLAY_MS = 5000;

const ease = [0.22, 1, 0.36, 1];

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

// ─── Media Panel ──────────────────────────────────────────────────────────────

function MediaPanel({ tab, direction = 0 }) {
  const src = tab?.tab_media === 'video'
    ? resolveVideo(tab?.tab_content_video)
    : resolveImage(tab?.tab_content_image);
  const icon = resolveImage(tab?.tab_imageicon);

  const variants = {
    enter: { opacity: 0, y: direction > 0 ? 40 : -40, scale: 0.97 },
    center: { opacity: 1, y: 0, scale: 1 },
    exit:   { opacity: 0, y: direction > 0 ? -40 : 40, scale: 0.97 },
  };

  return (
    <motion.div
      key={tab?.tab_label}
      custom={direction}
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.5, ease }}
      className="relative w-full h-full rounded-2xl overflow-hidden bg-white/5 border border-white/10 min-h-[320px]"
    >
      {tab?.tab_media === 'video' && src ? (
        <video
          src={src}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : src ? (
        <Image src={src} alt={tab?.tab_label || ''} fill className="object-cover" sizes="(max-width:768px) 100vw,60vw" />
      ) : icon ? (
        <Image src={icon} alt={tab?.tab_label || ''} fill className="object-contain p-12 opacity-40" sizes="60vw" />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white/10 text-7xl font-bold tracking-tighter select-none">
            {(tab?.tab_label || '?').charAt(0)}
          </span>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
    </motion.div>
  );
}

// ─── Arrow Buttons ────────────────────────────────────────────────────────────

function ArrowBtn({ onClick, dir = 'next' }) {
  return (
    <button
      onClick={onClick}
      className="w-10 h-10 rounded-full border border-white/15 bg-white/5 hover:bg-white/15 backdrop-blur-sm flex items-center justify-center text-white transition-all active:scale-90"
      aria-label={dir === 'next' ? 'Next tab' : 'Previous tab'}
    >
      {dir === 'prev' ? (
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>
      ) : (
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
      )}
    </button>
  );
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────

function ProgressBar({ active, paused, duration }) {
  if (!active) return null;
  return (
    <motion.div
      key={`pb-${active}-${paused}`}
      className="absolute bottom-0 left-0 h-[2px] bg-blue-400 origin-left"
      initial={{ scaleX: 0 }}
      animate={paused ? { scaleX: 0 } : { scaleX: 1 }}
      transition={{ duration: duration / 1000, ease: 'linear' }}
      style={{ width: '100%' }}
    />
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STYLE: top
// ═══════════════════════════════════════════════════════════════════════════════

function TopTabs({ tabs, active, setActive, direction }) {
  return (
    <div>
      {/* Tab bar */}
      <div className="flex gap-2 flex-wrap mb-10">
        {tabs.map((tab, i) => {
          const icon = resolveImage(tab.tab_imageicon);
          return (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={cn(
                'relative cursor-pointer flex items-center gap-2.5 px-5 py-3 rounded-xl text-sm font-medium transition-all duration-300',
                active === i
                  ? 'bg-white text-black shadow-lg shadow-white/10'
                  : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10'
              )}
            >
              {icon && (
                <span className="w-5 h-5 relative shrink-0">
                  <Image src={icon} alt="" fill className="object-contain" sizes="20px" />
                </span>
              )}
              <span className="text-xs font-semibold opacity-40 mr-1 tabular-nums">
                {String(i + 1).padStart(2, '0')}.
              </span>
              {tab.tab_label}
            </button>
          );
        })}
      </div>
      {/* Content panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4, ease }}
            className="prose prose-invert prose-sm md:prose-base max-w-none text-neutral-300 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: tabs[active]?.testimonial_name || '' }}
          />
        </AnimatePresence>
        <div className="relative aspect-[16/10]">
          <AnimatePresence mode="wait" custom={direction}>
            <MediaPanel key={active} tab={tabs[active]} direction={direction} />
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STYLE: bottom
// ═══════════════════════════════════════════════════════════════════════════════

function BottomTabs({ tabs, active, setActive, direction }) {
  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mb-10">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={active}
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.4, ease }}
            className="prose prose-invert prose-sm md:prose-base max-w-none text-neutral-300"
            dangerouslySetInnerHTML={{ __html: tabs[active]?.testimonial_name || '' }}
          />
        </AnimatePresence>
        <div className="relative aspect-[16/10]">
          <AnimatePresence mode="wait" custom={direction}>
            <MediaPanel key={active} tab={tabs[active]} direction={direction} />
          </AnimatePresence>
        </div>
      </div>
      <div className="flex gap-2 flex-wrap">
        {tabs.map((tab, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={cn(
              'flex cursor-pointer items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all duration-300',
              active === i
                ? 'bg-white text-black shadow-lg'
                : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10'
            )}
          >
            <span className="text-xs font-semibold opacity-40 tabular-nums">{String(i + 1).padStart(2, '0')}.</span>
            {tab.tab_label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STYLE: left
// ═══════════════════════════════════════════════════════════════════════════════

function LeftTabs({ tabs, active, setActive, direction }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
      {/* Tab list */}
      <div className="lg:col-span-3 flex flex-col gap-1">
        {tabs.map((tab, i) => {
          const icon = resolveImage(tab.tab_imageicon);
          return (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={cn(
                'relative cursor-pointer flex items-center gap-3 px-4 py-4 rounded-xl text-left transition-all duration-300 group',
                active === i
                  ? 'bg-white/10 text-white'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              )}
            >
              {active === i && (
                <motion.div layoutId="left-indicator" className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-8 bg-blue-400 rounded-full" transition={{ duration: 0.3, ease }} />
              )}
              {icon ? (
                <span className="w-8 h-8 relative shrink-0 rounded-lg overflow-hidden bg-white/10">
                  <Image src={icon} alt="" fill className="object-contain p-1" sizes="32px" />
                </span>
              ) : (
                <span className={cn('w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 transition-all', active === i ? 'bg-white text-black' : 'bg-white/10 text-white/60')}>
                  {String(i + 1).padStart(2, '0')}
                </span>
              )}
              <span className="text-sm font-medium leading-tight">{tab.tab_label}</span>
            </button>
          );
        })}
      </div>
      {/* Content + media */}
      <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={active}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.4, ease }}
            className="prose prose-invert prose-sm md:prose-base max-w-none text-neutral-300"
            dangerouslySetInnerHTML={{ __html: tabs[active]?.testimonial_name || '' }}
          />
        </AnimatePresence>
        <div className="relative aspect-square md:aspect-[4/3]">
          <AnimatePresence mode="wait" custom={direction}>
            <MediaPanel key={active} tab={tabs[active]} direction={direction} />
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STYLE: right
// ═══════════════════════════════════════════════════════════════════════════════

function RightTabs({ tabs, active, setActive, direction }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
      {/* Content + media */}
      <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-8 items-start order-2 lg:order-1">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={active}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4, ease }}
            className="prose prose-invert prose-sm md:prose-base max-w-none text-neutral-300"
            dangerouslySetInnerHTML={{ __html: tabs[active]?.testimonial_name || '' }}
          />
        </AnimatePresence>
        <div className="relative aspect-square md:aspect-[4/3]">
          <AnimatePresence mode="wait" custom={direction}>
            <MediaPanel key={active} tab={tabs[active]} direction={direction} />
          </AnimatePresence>
        </div>
      </div>
      {/* Tab list */}
      <div className="lg:col-span-3 flex flex-col gap-1 order-1 lg:order-2">
        {tabs.map((tab, i) => {
          const icon = resolveImage(tab.tab_imageicon);
          return (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={cn(
                'relative cursor-pointer flex items-center gap-3 px-4 py-4 rounded-xl text-left transition-all duration-300',
                active === i
                  ? 'bg-white/10 text-white'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              )}
            >
              {active === i && (
                <motion.div layoutId="right-indicator" className="absolute right-0 top-1/2 -translate-y-1/2 w-0.5 h-8 bg-blue-400 rounded-full" transition={{ duration: 0.3, ease }} />
              )}
              {icon ? (
                <span className="w-8 h-8 relative shrink-0 rounded-lg overflow-hidden bg-white/10">
                  <Image src={icon} alt="" fill className="object-contain p-1" sizes="32px" />
                </span>
              ) : (
                <span className={cn('w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 transition-all', active === i ? 'bg-white text-black' : 'bg-white/10 text-white/60')}>
                  {String(i + 1).padStart(2, '0')}
                </span>
              )}
              <span className="text-sm font-medium leading-tight">{tab.tab_label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STYLE: horizontalslider
// ═══════════════════════════════════════════════════════════════════════════════

function HorizontalSlider({ tabs, active, setActive, paused, setPaused, direction, onPrev, onNext }) {
  const sliderVariants = {
    enter: (d) => ({ x: d > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit:  (d) => ({ x: d > 0 ? '-100%' : '100%', opacity: 0 }),
  };

  return (
    <div>
      {/* Number pills */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-none">
        {tabs.map((tab, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={cn(
              'relative cursor-pointer shrink-0 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap overflow-hidden',
              active === i
                ? 'bg-white text-black'
                : 'bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10'
            )}
          >
            {active === i && (
              <ProgressBar active duration={AUTO_PLAY_MS} paused={paused} />
            )}
            <span className="text-xs opacity-50 mr-1.5 tabular-nums">{String(i + 1).padStart(2, '0')}.</span>
            {tab.tab_label}
          </button>
        ))}
      </div>

      {/* Slide */}
      <div
        className="relative rounded-2xl overflow-hidden"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 min-h-[420px]">
          {/* Content */}
          <div className="p-8 md:p-12 flex flex-col justify-center bg-white/5 border border-white/10 border-r-0 rounded-l-2xl">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={active}
                custom={direction}
                variants={sliderVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5, ease }}
                className="prose prose-invert max-w-none text-neutral-300"
                dangerouslySetInnerHTML={{ __html: tabs[active]?.testimonial_name || '' }}
              />
            </AnimatePresence>
          </div>
          {/* Media */}
          <div className="relative aspect-[4/3] lg:aspect-auto">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={`media-${active}`}
                custom={direction}
                variants={sliderVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.55, ease }}
                className="absolute inset-0 rounded-r-2xl overflow-hidden"
              >
                <MediaPanel tab={tabs[active]} direction={direction} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Prev / Next */}
        <div className="absolute bottom-6 right-6 flex gap-2 z-20">
          <ArrowBtn onClick={onPrev} dir="prev" />
          <ArrowBtn onClick={onNext} dir="next" />
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STYLE: verticleslider  (vertical tabs + animated image gallery)
// ═══════════════════════════════════════════════════════════════════════════════

function VerticalSlider({ tabs, active, setActive, paused, setPaused, direction, onPrev, onNext }) {
  const tab = tabs[active] || {};
  const mediaSrc = tab.tab_media === 'video'
    ? resolveVideo(tab.tab_content_video)
    : resolveImage(tab.tab_content_image);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">

      {/* ── Left: tab labels only ───────────────────────────────────────────── */}
      <div className="lg:col-span-4 order-2 lg:order-1">
        <div className="flex flex-col pl-5">
          {tabs.map((t, i) => {
            const isActive = active === i;
            return (
              <div key={i} className="relative border-t border-white/10 first:border-0">
                {/* Progress track */}
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-white/10 -translate-x-5">
                  <motion.div
                    key={`vp-${i}-${paused}`}
                    className="absolute top-0 left-0 w-full bg-blue-400"
                    initial={{ height: '0%' }}
                    animate={isActive && !paused ? { height: '100%' } : { height: '0%' }}
                    transition={
                      isActive && !paused
                        ? { duration: AUTO_PLAY_MS / 1000, ease: 'linear' }
                        : { duration: 0.15 }
                    }
                  />
                </div>

                <button
                  onClick={() => setActive(i)}
                  className={cn(
                    'w-full cursor-pointer flex items-center gap-4 py-5 md:py-6 text-left transition-colors duration-300',
                    isActive ? 'text-white' : 'text-white/35 hover:text-white/70'
                  )}
                >
                  <span className="text-[10px] font-semibold tabular-nums shrink-0 opacity-40">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="text-xl md:text-2xl lg:text-3xl font-normal tracking-tight leading-tight">
                    {t.tab_label}
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Right: content + media stacked ──────────────────────────────────── */}
      <div
        className="lg:col-span-8 order-1 lg:order-2"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active}
            initial={{ opacity: 0, y: direction > 0 ? 24 : -24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: direction > 0 ? -24 : 24 }}
            transition={{ duration: 0.4, ease }}
            className="flex flex-col gap-6"
          >
            {/* Content */}
            {tab.testimonial_name && (
              <div
                className="prose prose-invert md:prose-lg max-w-none text-white/70 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: tab.testimonial_name }}
              />
            )}

            {/* Media */}
            <div className="relative rounded-2xl overflow-hidden bg-white/5 border border-white/10" style={{ aspectRatio: '16/9' }}>
              {tab.tab_media === 'video' && mediaSrc ? (
                <video src={mediaSrc} autoPlay muted loop playsInline className="w-full h-full object-cover" />
              ) : mediaSrc ? (
                <Image
                  src={mediaSrc}
                  alt={tab.tab_label || ''}
                  fill
                  className="object-cover"
                  sizes="(max-width:1024px) 100vw, 60vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-white/10 text-8xl font-bold select-none">
                    {String(active + 1).padStart(2, '0')}
                  </span>
                </div>
              )}
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-black/40 via-transparent to-transparent" />

              {/* Dot loader */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                {tabs.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActive(i)}
                    className="relative h-1 rounded-full overflow-hidden bg-white/25 transition-all duration-300"
                    style={{ width: active === i ? 28 : 8 }}
                    aria-label={`Tab ${i + 1}`}
                  >
                    {active === i && (
                      <motion.div
                        key={`dot-${i}-${paused}`}
                        className="absolute inset-y-0 left-0 bg-white rounded-full"
                        initial={{ width: '0%' }}
                        animate={paused ? { width: '0%' } : { width: '100%' }}
                        transition={{ duration: AUTO_PLAY_MS / 1000, ease: 'linear' }}
                      />
                    )}
                  </button>
                ))}
              </div>

              {/* Arrow controls */}
              <div className="absolute bottom-4 right-4 flex gap-2 z-20">
                <ArrowBtn onClick={onPrev} dir="prev" />
                <ArrowBtn onClick={onNext} dir="next" />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Main Export
// ═══════════════════════════════════════════════════════════════════════════════

export default function TabsSection({ data }) {
  const {
    background_color,
    sub_heading,
    heading,
    description,
    custom_class,
    custom_id,
    tab_style,
    tab: rawTabs,
  } = data || {};

  // ACF repeaters can return null/false for empty — normalise to array
  const tabs = Array.isArray(rawTabs) ? rawTabs : [];
  const style = (tab_style || 'top').trim().toLowerCase();

  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);

  const count = tabs.length;

  const go = useCallback((idx) => {
    if (idx === active) return;
    setDirection(idx > active ? 1 : -1);
    setActive(idx);
  }, [active]);

  const next = useCallback(() => {
    setDirection(1);
    setActive((p) => (p + 1) % count);
  }, [count]);

  const prev = useCallback(() => {
    setDirection(-1);
    setActive((p) => (p - 1 + count) % count);
  }, [count]);

  // Auto-advance for slider styles
  useEffect(() => {
    if (paused || !['horizontalslider', 'verticleslider'].includes(style)) return;
    const id = setInterval(next, AUTO_PLAY_MS);
    return () => clearInterval(id);
  }, [active, paused, style, next]);

  if (!tabs.length) return null;

  const bg = background_color || '';

  const sharedProps = {
    tabs,
    active,
    setActive: go,
    direction,
    paused,
    setPaused,
    onNext: next,
    onPrev: prev,
  };

  const renderContent = () => {
    switch (style) {
      case 'verticleslider':   return <VerticalSlider {...sharedProps} />;
      case 'horizontalslider': return <HorizontalSlider {...sharedProps} />;
      case 'left':             return <LeftTabs {...sharedProps} />;
      case 'right':            return <RightTabs {...sharedProps} />;
      case 'bottom':           return <BottomTabs {...sharedProps} />;
      default:                 return <TopTabs {...sharedProps} />;
    }
  };

  return (
    <section
      id={custom_id || undefined}
      className={cn('py-16 md:py-24 lg:py-32', custom_class)}
      style={bg ? { backgroundColor: bg } : { backgroundColor: '#0a0a0c' }}
    >
      <div className="mx-auto w-full max-w-[1440px] px-6 md:px-10 lg:px-16">
        <SectionHeader
          subHeading={sub_heading}
          heading={heading}
          description={description}
          align={style === 'verticleslider' ? 'left' : 'center'}
        />
        {renderContent()}
      </div>
    </section>
  );
}
