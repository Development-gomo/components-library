'use client';

// Layout: floating_gallery_hero
// ACF Fields:
//   background_color  (color_picker)
//   text_color        (color_picker)
//   hero_title        (text)
//   hero_description  (wysiwyg)
//   cta_text          (text)
//   cta_url           (url)
//   items             (repeater)
//     image                 (image)
//   custom_class      (text)
//   custom_id         (text)

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

/**
 * DEPTH MODEL
 *   depth 1.0 = near  → large  (8 vw), fully opaque,  outer edges
 *   depth 2.0 = mid   → medium (4 vw), slightly faded, mid ring
 *   depth 3.5 = far   → tiny   (2 vw), very ghosted,  center cluster
 *
 * Images CYCLE: all 24 slots are always filled, even with just 4-5 ACF images.
 *
 * Phases are spread evenly (0 → 1) per depth band so cards are
 * always distributed across the full viewport height, never clumped.
 */
const CARDS = [
  // ── NEAR (large, opaque, outer edges) ─────────────────────
  { x:  5,  depth: 1.0, phase: 0.00 },
  { x: 30,  depth: 1.1, phase: 0.08 },
  { x: 50,  depth: 1.2, phase: 0.04 },
  { x: 70,  depth: 1.1, phase: 0.10 },
  { x: 88,  depth: 1.0, phase: 0.05 },
  // ── MID (medium, slight fade) ─────────────────────────────
  { x: 15,  depth: 1.7, phase: 0.20 },
  { x: 35,  depth: 1.9, phase: 0.33 },
  { x: 58,  depth: 1.6, phase: 0.45 },
  { x: 78,  depth: 1.8, phase: 0.60 },
  { x: 92,  depth: 1.7, phase: 0.74 },
  { x:  8,  depth: 1.6, phase: 0.88 },
  // ── DEEP CENTER CLUSTER (tiny, ghosted) ───────────────────
  { x: 38,  depth: 2.8, phase: 0.16 },
  { x: 45,  depth: 3.2, phase: 0.25 },
  { x: 53,  depth: 3.5, phase: 0.38 },
  { x: 47,  depth: 3.0, phase: 0.50 },
  { x: 42,  depth: 3.3, phase: 0.63 },
  { x: 57,  depth: 2.9, phase: 0.75 },
  { x: 62,  depth: 3.4, phase: 0.12 },
  { x: 34,  depth: 2.7, phase: 0.87 },
  { x: 55,  depth: 3.5, phase: 0.55 },
  { x: 40,  depth: 3.1, phase: 0.92 },
  // ── SCATTERED EXTRAS ──────────────────────────────────────
  { x: 23,  depth: 1.5, phase: 0.68 },
  { x: 66,  depth: 1.4, phase: 0.80 },
  { x: 82,  depth: 1.6, phase: 0.42 },
];

// width (vw) = W_BASE / depth^1.4  — drops sharply with depth
const W_BASE = 10;
const getWidth = (depth) => (W_BASE / Math.pow(depth, 1.4)).toFixed(2);
// opacity = 1 - (depth-1)*0.28, min 0.15
const getOpacity = (depth) => Math.max(0.15, 1 - (depth - 1) * 0.28);

const DRIFT_SPEED       = 14;   // px/s — slow, cinematic
const PARALLAX_STRENGTH = 30;   // max px mouse-parallax shift
const LERP              = 0.05; // mouse smoothing

export default function FloatingGalleryHero({ data = {} }) {
  const {
    background_color = '#f0ece6',
    text_color        = '#1a1a1a',
    hero_title        = '',
    hero_description  = '',
    cta_text          = '',
    cta_url           = '#',
    items             = [],
    custom_class      = '',
    custom_id         = '',
  } = data;

  const sectionRef  = useRef(null);
  const cardRefs    = useRef([]);
  const yPos        = useRef([]);
  const targetMouse = useRef({ x: 0, y: 0 });
  const curMouse    = useRef({ x: 0, y: 0 });
  const lastTime    = useRef(null);
  const rafRef      = useRef(null);
  const initialized = useRef(false);

  // Always fill all CARDS slots by cycling source images
  const rawImages = items.map((it) => it.image).filter(Boolean);
  const totalCards = CARDS.length;
  // Build a display array the same length as CARDS, cycling images
  const displayImages = rawImages.length > 0
    ? CARDS.map((_, i) => rawImages[i % rawImages.length])
    : [];

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || displayImages.length === 0) return;

    // initialise y positions spread across full container height
    if (!initialized.current) {
      const h = section.offsetHeight;
      CARDS.forEach((card, i) => {
        yPos.current[i] = card.phase * h;
      });
      initialized.current = true;
    }

    const onMove = (e) => {
      const r = section.getBoundingClientRect();
      targetMouse.current = {
        x: (e.clientX - r.left) / r.width  - 0.5,
        y: (e.clientY - r.top)  / r.height - 0.5,
      };
    };
    const onLeave = () => { targetMouse.current = { x: 0, y: 0 }; };

    section.addEventListener('mousemove', onMove, { passive: true });
    section.addEventListener('mouseleave', onLeave);

    const tick = (ts) => {
      const dt = lastTime.current
        ? Math.min((ts - lastTime.current) / 1000, 0.05)
        : 0;
      lastTime.current = ts;

      curMouse.current.x += (targetMouse.current.x - curMouse.current.x) * LERP;
      curMouse.current.y += (targetMouse.current.y - curMouse.current.y) * LERP;
      const mx = curMouse.current.x;
      const my = curMouse.current.y;

      const containerH = section.offsetHeight;

      for (let i = 0; i < totalCards; i++) {
        const el = cardRefs.current[i];
        if (!el) continue;
        const card = CARDS[i];

        // drift upward
        yPos.current[i] -= DRIFT_SPEED * dt;

        // wrap: off the top → teleport below the bottom
        if (yPos.current[i] + el.offsetHeight < 0) {
          yPos.current[i] = containerH + 10;
        }

        // mouse parallax (deeper = more shift = enhances depth illusion)
        const px = -mx * card.depth * PARALLAX_STRENGTH;
        const py = -my * card.depth * PARALLAX_STRENGTH * 0.4;

        el.style.top       = `${yPos.current[i]}px`;
        el.style.transform = `translate(calc(-50% + ${px}px), ${py}px)`;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      section.removeEventListener('mousemove', onMove);
      section.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(rafRef.current);
      lastTime.current = null;
    };
  }, [displayImages.length]);

  return (
    <section
      ref={sectionRef}
      id={custom_id || undefined}
      className={`relative w-full overflow-hidden ${custom_class}`}
      style={{ backgroundColor: background_color, height: '100svh', color: text_color }}
    >
      {/* Floating image cards */}
      {displayImages.map((img, i) => {
        const card    = CARDS[i];
        const w       = getWidth(card.depth);
        const opacity = getOpacity(card.depth);

        return (
          <div
            key={i}
            ref={(el) => (cardRefs.current[i] = el)}
            className="absolute will-change-transform"
            style={{
              left:      `${card.x}%`,
              top:       `${card.phase * 100}%`,
              width:     `${w}vw`,
              opacity,
              zIndex:    Math.round((3.6 - card.depth) * 4),
              transform: `translate(-50%, 0)`,
            }}
          >
            <div className="overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
              <Image
                src={img.url || img.src || ''}
                alt={img.alt || ''}
                width={160}
                height={208}
                className="w-full h-auto block object-cover"
                sizes={`${w}vw`}
                priority={i < 5}
              />
            </div>
          </div>
        );
      })}

      {/* Soft radial fade — makes center text legible */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: `radial-gradient(ellipse 55% 45% at 50% 50%, ${background_color}bb 0%, transparent 65%)`,
        }}
      />

      {/* Hero content */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full text-center px-6 pointer-events-none">
        {hero_title && (
          <h1
            className="text-5xl md:text-6xl lg:text-[5.5rem] font-semibold leading-[1.05] tracking-tight max-w-3xl"
            style={{ color: text_color }}
          >
            {hero_title}
          </h1>
        )}
        {hero_description && (
          <div
            className="mt-5 text-base md:text-lg opacity-60 max-w-lg leading-relaxed"
            dangerouslySetInnerHTML={{ __html: hero_description }}
          />
        )}
        {cta_text && (
          <Link
            href={cta_url}
            className="pointer-events-auto mt-8 inline-flex items-center gap-2 px-8 py-3 rounded-full border border-current text-sm font-medium tracking-wide hover:opacity-50 transition-opacity duration-300"
            style={{ color: text_color }}
          >
            {cta_text}
          </Link>
        )}
      </div>
    </section>
  );
}
