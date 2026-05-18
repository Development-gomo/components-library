'use client';

// Layout:  accordion_image_scroller
// Fields:
//   section_title     – text  (small label above heading)
//   heading           – text
//   description       – wysiwyg
//   background_color  – color_picker  (outer section bg)
//   box_color         – color_picker  (inner box bg, default #111111)
//   custom_class      – text
//   custom_id         – text
//   auto_delay        – number  (seconds between auto-advance, default 5)
//   items             – repeater
//       title         – text
//       description   – wysiwyg
//       image         – image (url, alt, width, height)

import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

const DEFAULT_DELAY = 5; // seconds

export default function AccordionImageScroller({ data }) {
  if (!data) return null;

  const {
    section_title,
    heading,
    description,
    background_color,
    box_color,
    custom_class,
    custom_id,
    auto_delay,
    items = [],
  } = data;

  const delay = (Number(auto_delay) || DEFAULT_DELAY) * 1000; // ms

  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef(null);
  const animFrameRef = useRef(null);
  const startTimeRef = useRef(null);

  const advance = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % items.length);
  }, [items.length]);

  const startTimer = useCallback(() => {
    clearTimeout(timerRef.current);
    cancelAnimationFrame(animFrameRef.current);

    setProgress(0);
    startTimeRef.current = performance.now();

    const tick = (now) => {
      const elapsed = now - startTimeRef.current;
      const pct = Math.min((elapsed / delay) * 100, 100);
      setProgress(pct);
      if (pct < 100) {
        animFrameRef.current = requestAnimationFrame(tick);
      }
    };
    animFrameRef.current = requestAnimationFrame(tick);
    timerRef.current = setTimeout(advance, delay);
  }, [delay, advance]);

  useEffect(() => {
    if (items.length <= 1) return;
    startTimer();
    return () => {
      clearTimeout(timerRef.current);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [activeIndex, startTimer, items.length]);

  const handleClick = (index) => {
    if (index === activeIndex) return;
    setActiveIndex(index);
  };

  const activeItem = items[activeIndex] || {};
  const imgUrl =
    activeItem.image?.url ||
    activeItem.image?.sizes?.large ||
    null;

  const hasHeader = section_title || heading || description;

  return (
    <section
      id={custom_id || undefined}
      className={`accordion-image-scroller w-full py-16 md:py-24${custom_class ? ` ${custom_class}` : ''}`}
      style={background_color ? { backgroundColor: background_color } : {}}
    >
      <div className="web-width mx-auto px-6">

        {/* ── Section header ── */}
        {hasHeader && (
          <div className="mb-10 text-center">
            {section_title && (
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] opacity-60">
                {section_title}
              </p>
            )}
            {heading && (
              <h2 className="text-3xl font-bold leading-tight md:text-4xl lg:text-5xl">
                {heading}
              </h2>
            )}
            {description && (
              <div
                className="prose prose-sm mt-4 mx-auto max-w-prose opacity-75"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            )}
          </div>
        )}

        {/* ── Inner box ── */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{ backgroundColor: box_color || '#111111' }}
        >
          <div className="flex flex-col md:flex-row min-h-[560px]">

            {/* ── Left: accordion list ── */}
            <div className="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-12 py-10 md:py-14">
              <ul className="flex flex-col">
                {items.map((item, i) => {
                  const isActive = i === activeIndex;
                  return (
                    <li key={i}>
                      <button
                        onClick={() => handleClick(i)}
                        className="w-full text-left py-3 focus-visible:outline-none group cursor-pointer"
                        aria-expanded={isActive}
                      >
                        {/* Progress line — always visible, fills on active */}
                        <div className="mb-6 h-[1px] w-full bg-white/10 overflow-hidden rounded-full">
                          {isActive && (
                            <motion.div
                              className="h-full rounded-full"
                              style={{
                                width: `${progress}%`,
                                backgroundColor: 'var(--color-accent)',
                              }}
                            />
                          )}
                        </div>

                        {/* Title */}
                        <span
                          className={`block text-xs font-bold uppercase tracking-[0.2em] transition-opacity duration-300 text-white ${
                            isActive ? 'opacity-100' : 'opacity-40 group-hover:opacity-70'
                          }`}
                        >
                          {item.title}
                        </span>
                      </button>

                      {/* Expandable description */}
                      <AnimatePresence initial={false}>
                        {isActive && item.description && (
                          <motion.div
                            key="desc"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                            className="overflow-hidden"
                          >
                            <div
                              className="prose prose-sm prose-invert pb-5 max-w-prose text-[#e5e5e5]"
                              dangerouslySetInnerHTML={{ __html: item.description }}
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* ── Right: image ── */}
            <div className="w-full md:w-1/2 relative min-h-[380px] md:min-h-full">
              {items.map((item, i) => {
                const url = item.image?.url || item.image?.sizes?.large;
                if (!url) return null;
                const isActive = i === activeIndex;
                return (
                  <div
                    key={i}
                    className="absolute inset-[10px] rounded-[10px] overflow-hidden transition-opacity duration-500"
                    style={{ opacity: isActive ? 1 : 0 }}
                  >
                    <Image
                      src={url}
                      alt={item.image?.alt || item.title || ''}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                      priority
                    />
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
