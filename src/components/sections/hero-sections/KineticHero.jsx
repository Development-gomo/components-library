'use client';

// Layout:  kinetic_hero
// Fields:
//   hero_title        – text
//   hero_description  – wysiwyg
//   cta_text          – text
//   cta_url           – text
//   overlay_opacity   – number  (0–100, default 50)
//   base_speed        – text    (px/s, default 60)
//   columns           – repeater
//       images        – repeater → image (url, alt)
//   custom_class      – text
//   custom_id         – text

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const DEFAULT_SPEED = 60;   // px per second base upward movement
const SCROLL_BOOST  = 4;    // multiplier added on wheel/scroll
const DECAY         = 0.92; // how fast scroll boost fades per frame

export default function KineticHero({ data }) {
  if (!data) return null;

  const {
    hero_title,
    hero_description,
    cta_text,
    cta_url,
    overlay_opacity = 50,
    base_speed,
    columns = [],
    custom_class,
    custom_id,
  } = data;

  const speed    = Number(base_speed) || DEFAULT_SPEED;
  const colRefs  = useRef([]);   // ref per column wrapper
  const yPos     = useRef([]);   // current y for each column
  const heights  = useRef([]);   // half-height (single set) per column
  const boost    = useRef(0);    // extra velocity from scroll
  const rafId    = useRef(null);
  const lastTime = useRef(null);

  useEffect(() => {
    if (!columns.length) return;

    // Initialise y positions (stagger columns slightly for visual rhythm)
    yPos.current   = columns.map((_, i) => i % 2 === 1 ? -120 : 0);
    heights.current = columns.map((_, i) => {
      const el = colRefs.current[i];
      return el ? el.scrollHeight / 2 : 0;
    });

    // Wheel / scroll boost
    const onWheel = (e) => {
      boost.current += Math.abs(e.deltaY) * 0.08;
    };
    window.addEventListener('wheel', onWheel, { passive: true });

    // rAF loop
    const tick = (now) => {
      const dt = lastTime.current ? Math.min((now - lastTime.current) / 1000, 0.05) : 0.016;
      lastTime.current = now;

      const v = speed + boost.current;
      boost.current = boost.current > 0.1 ? boost.current * DECAY : 0;

      columns.forEach((_, i) => {
        const el = colRefs.current[i];
        if (!el) return;

        // Odd columns go slightly slower for depth
        const colSpeed = i % 2 === 1 ? v * 0.75 : v;
        yPos.current[i] -= colSpeed * dt;

        const h = heights.current[i] || el.scrollHeight / 2;
        if (yPos.current[i] <= -h) {
          yPos.current[i] += h;
        }

        el.style.transform = `translateY(${yPos.current[i]}px)`;
      });

      rafId.current = requestAnimationFrame(tick);
    };

    rafId.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId.current);
      window.removeEventListener('wheel', onWheel);
    };
  }, [columns.length, speed]);

  const overlayStyle = {
    backgroundColor: `rgba(0,0,0,${Number(overlay_opacity) / 100})`,
  };

  return (
    <section
      id={custom_id || undefined}
      className={`kinetic-hero relative w-full overflow-hidden bg-black${custom_class ? ` ${custom_class}` : ''}`}
      style={{ minHeight: '100svh' }}
    >
      {/* ── Image columns ── */}
      <div className="absolute inset-0 flex gap-3 p-3">
        {columns.map((col, i) => {
          const images = col.images || [];
          if (!images.length) return null;

          // Duplicate for seamless infinite loop
          const doubled = [...images, ...images, ...images];

          return (
            <div
              key={i}
              className="relative flex-1 overflow-hidden"
            >
              <div
                ref={(el) => (colRefs.current[i] = el)}
                className="flex flex-col gap-3"
                style={{ willChange: 'transform' }}
              >
                {doubled.map((img, j) => {
                  const src = img?.image?.url || img?.image?.sizes?.large || img?.url;
                  if (!src) return null;
                  return (
                    <div
                      key={j}
                      className="relative w-full overflow-hidden rounded-xl"
                      style={{ aspectRatio: '3/4', flexShrink: 0 }}
                    >
                      <Image
                        src={src}
                        alt={img?.image?.alt || img?.alt || ''}
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="object-cover"
                        priority={j < 4}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Dark overlay ── */}
      <div className="absolute inset-0 pointer-events-none" style={overlayStyle} />

      {/* ── Text content ── */}
      <div className="relative z-10 flex min-h-[100svh] flex-col items-center justify-center px-6 text-center text-white">
        {hero_title && (
          <h1 className="max-w-4xl text-5xl font-bold leading-tight md:text-6xl lg:text-7xl">
            {hero_title}
          </h1>
        )}

        {hero_description && (
          <div
            className="prose prose-invert mt-6 max-w-xl opacity-80"
            dangerouslySetInnerHTML={{ __html: hero_description }}
          />
        )}

        {cta_text && cta_url && (
          <Link
            href={cta_url}
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3 text-sm font-bold uppercase tracking-widest text-black transition-opacity hover:opacity-80"
          >
            {cta_text}
          </Link>
        )}
      </div>
    </section>
  );
}
