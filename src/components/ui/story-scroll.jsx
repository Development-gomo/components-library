'use client';

// Layout: scroller_section
// ACF Fields:
//   story_scroll_sections  (repeater)
//     section_label             (text)
//     background_color          (color_picker)
//     text_color                (color_picker)
//     heading                   (text)
//     body_text                 (wysiwyg)
//     columns                   (repeater — column_title (text), column_text (textarea))
//     columns_row_2             (repeater — column_title (text), column_text (textarea))

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

function cx(...parts) {
  return parts.filter(Boolean).join(' ');
}

// ─── FlowSection ────────────────────────────────────────────────────────────
// One pinned scroll card. Wraps children in the animated container.
export function FlowSection({ className, style = {}, children, 'aria-label': ariaLabel }) {
  return (
    <section
      data-flow-section
      aria-label={ariaLabel}
      className={cx('relative min-h-screen w-full overflow-hidden', className)}
    >
      <div
        data-flow-inner
        className={cx(
          'flow-art-container relative flex min-h-screen w-full flex-col justify-between gap-6 px-[4vw] pt-[clamp(2rem,8vw,4vw)] pb-[4vw]',
          'will-change-transform',
        )}
        style={{ transformOrigin: 'bottom left', ...style }}
      >
        {children}
      </div>
    </section>
  );
}

// ─── ColumnGrid ──────────────────────────────────────────────────────────────
// Renders one row of ACF repeater columns (columns / columns_row_2).
// ACF sub-fields: column_title (text), column_text (textarea)
function ColumnGrid({ columns, dividerColor }) {
  if (!columns || columns.length === 0) return null;
  return (
    <>
      <hr className="my-[2vw] border-none border-t" style={{ borderColor: dividerColor }} />
      <div className="flex flex-wrap gap-[3vw]">
        {columns.map((col, i) => (
          <div key={i} className="min-w-45 flex-1">
            <p className="mb-2 text-sm font-bold uppercase tracking-wider">{col.column_title}</p>
            <p className="text-[clamp(0.85rem,1.3vw,1.05rem)] leading-relaxed opacity-75">
              {col.column_text}
            </p>
          </div>
        ))}
      </div>
    </>
  );
}

// ─── StoryScrollSection ──────────────────────────────────────────────────────
// Renders one repeater row from the ACF `story_scroll_sections` repeater.
// Props mirror ACF field names exactly — spread a row object directly.
//
// ACF fields (layout: scroller_section > story_scroll_sections repeater):
//   section_label    – text
//   background_color – color_picker
//   text_color       – color_picker
//   heading          – text
//   body_text        – wysiwyg (returns HTML string)
//   columns          – repeater → column_title (text), column_text (textarea)
//   columns_row_2    – repeater → column_title (text), column_text (textarea)
export function StoryScrollSection({
  section_label,
  background_color = '#ffffff',
  text_color = '#000000',
  heading,
  body_text,
  columns = [],
  columns_row_2 = [],
}) {
  const isLight =
    text_color === '#ffffff' || text_color === '#fff' || text_color === 'rgba(255,255,255,1)';
  const dividerColor = isLight ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)';

  return (
    <FlowSection
      aria-label={section_label}
      style={{ backgroundColor: background_color, color: text_color }}
    >
      {/* ACF: section_label */}
      {section_label && (
        <p className="text-xs font-bold uppercase tracking-[0.2em]">{section_label}</p>
      )}

      <hr className="my-[2vw] border-none border-t" style={{ borderColor: dividerColor }} />

      {/* ACF: heading (text field — single line) */}
      {heading && (
        <div>
          <h2 className="text-[clamp(3.5rem,12vw,14rem)] font-bold leading-[0.85] uppercase tracking-tight">
            {heading}
          </h2>
        </div>
      )}

      <hr className="my-[2vw] border-none border-t" style={{ borderColor: dividerColor }} />

      {/* ACF: body_text (wysiwyg — renders HTML) */}
      {body_text && (
        <div
          className="max-w-[50ch] text-[clamp(1rem,2.5vw,2rem)] font-normal leading-relaxed [&_p]:mb-0"
          dangerouslySetInnerHTML={{ __html: body_text }}
        />
      )}

      {/* ACF: columns repeater (row 1) */}
      <ColumnGrid columns={columns} dividerColor={dividerColor} />

      {/* ACF: columns_row_2 repeater (row 2) */}
      <ColumnGrid columns={columns_row_2} dividerColor={dividerColor} />
    </FlowSection>
  );
}

// ─── StoryScroll (default export) ───────────────────────────────────────────
// Scroll container. Used in PageBuilder as:
//   <StoryScroll data={block} />
// where block.story_scroll_sections is the ACF repeater array.
export default function StoryScroll({ data, className, 'aria-label': ariaLabel = 'Story scroll' }) {
  const sections = data?.story_scroll_sections ?? [];
  const containerRef = useRef(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useGSAP(
    () => {
      if (!containerRef.current || reducedMotion) return;

      const allSections = Array.from(
        containerRef.current.querySelectorAll('[data-flow-section]'),
      );
      if (allSections.length === 0) return;

      const triggers = [];

      allSections.forEach((section, i) => {
        gsap.set(section, { zIndex: i + 1 });

        const inner = section.querySelector('.flow-art-container');
        if (!inner) return;

        if (i > 0) {
          gsap.set(inner, { rotation: 30, transformOrigin: 'bottom left' });
          const tween = gsap.to(inner, {
            rotation: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top bottom',
              end: 'top 25%',
              scrub: true,
            },
          });
          if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
        }

        if (i < allSections.length - 1) {
          triggers.push(
            ScrollTrigger.create({
              trigger: section,
              start: 'bottom bottom',
              end: 'bottom top',
              pin: true,
              pinSpacing: false,
            }),
          );
        }
      });

      ScrollTrigger.refresh();

      return () => {
        triggers.forEach((t) => t.kill());
      };
    },
    { scope: containerRef, dependencies: [sections.length, reducedMotion] },
  );

  if (!sections.length) return null;

  return (
    <main
      ref={containerRef}
      aria-label={ariaLabel}
      className={cx('w-full overflow-x-hidden', className)}
    >
      {sections.map((row, i) => (
        <StoryScrollSection key={i} {...row} />
      ))}
    </main>
  );
}
