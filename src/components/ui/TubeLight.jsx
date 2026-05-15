'use client';

// Layout: tube_light_section (page builder block)
// ACF Fields: heading, sub_heading, description (wysiwyg),] custom_class, custom_id

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// ─── LampContainer ───────────────────────────────────────────────────────────
// Core visual effect — the glowing tube light.
// accent_color drives the lamp glow (defaults to cyan).
export function LampContainer({ children, className, accentColor = '#06b6d4' }) {
  return (
    <div
      className={cn(
        'relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden rounded-md bg-slate-950',
        className,
      )}
    >
      {/* Lamp ray layer */}
      <div className="relative isolate z-0 flex w-full flex-1 scale-y-125 items-center justify-center">

        {/* Left conic gradient ray */}
        <motion.div
          initial={{ opacity: 0.5, width: '15rem' }}
          whileInView={{ opacity: 1, width: '30rem' }}
          transition={{ delay: 0.3, duration: 0.8, ease: 'easeInOut' }}
          style={{
            backgroundImage: `conic-gradient(from 70deg at center top, ${accentColor}, transparent, transparent)`,
          }}
          className="absolute inset-auto right-1/2 h-56 w-[30rem] overflow-visible text-white"
        >
          <div className="absolute bottom-0 left-0 z-20 h-40 w-full bg-slate-950 [mask-image:linear-gradient(to_top,white,transparent)]" />
          <div className="absolute bottom-0 left-0 z-20 h-full w-40 bg-slate-950 [mask-image:linear-gradient(to_right,white,transparent)]" />
        </motion.div>

        {/* Right conic gradient ray */}
        <motion.div
          initial={{ opacity: 0.5, width: '15rem' }}
          whileInView={{ opacity: 1, width: '30rem' }}
          transition={{ delay: 0.3, duration: 0.8, ease: 'easeInOut' }}
          style={{
            backgroundImage: `conic-gradient(from 290deg at center top, transparent, transparent, ${accentColor})`,
          }}
          className="absolute inset-auto left-1/2 h-56 w-[30rem] text-white"
        >
          <div className="absolute bottom-0 right-0 z-20 h-full w-40 bg-slate-950 [mask-image:linear-gradient(to_left,white,transparent)]" />
          <div className="absolute bottom-0 right-0 z-20 h-40 w-full bg-slate-950 [mask-image:linear-gradient(to_top,white,transparent)]" />
        </motion.div>

        {/* Depth blur layers */}
        <div className="absolute top-1/2 h-48 w-full translate-y-12 scale-x-150 bg-slate-950 blur-2xl" />
        <div className="absolute top-1/2 z-50 h-48 w-full bg-transparent opacity-10 backdrop-blur-md" />

        {/* Central glow blob */}
        <div
          className="absolute inset-auto z-50 h-36 w-[28rem] -translate-y-1/2 rounded-full opacity-50 blur-3xl"
          style={{ backgroundColor: accentColor }}
        />

        {/* Bright core blur */}
        <motion.div
          initial={{ width: '8rem' }}
          whileInView={{ width: '16rem' }}
          transition={{ delay: 0.3, duration: 0.8, ease: 'easeInOut' }}
          className="absolute inset-auto z-30 h-36 w-64 -translate-y-24 rounded-full blur-2xl"
          style={{ backgroundColor: accentColor }}
        />

        {/* Thin tube line */}
        <motion.div
          initial={{ width: '15rem' }}
          whileInView={{ width: '30rem' }}
          transition={{ delay: 0.3, duration: 0.8, ease: 'easeInOut' }}
          className="absolute inset-auto z-50 h-0.5 w-[30rem] -translate-y-28"
          style={{ backgroundColor: accentColor }}
        />

        {/* Ceiling mask */}
        <div className="absolute inset-auto z-40 h-44 w-full -translate-y-[12.5rem] bg-slate-950" />
      </div>

      {/* Content slot */}
      <div className="relative z-50 flex -translate-y-80 flex-col items-center px-5">
        {children}
      </div>
    </div>
  );
}

// ─── TubeLightSection (default export — PageBuilder block) ───────────────────
// Receives data={block} from PageBuilder where block.acf_fc_layout === 'tube_light_section'.
//
// ACF fields:
//   heading         – text        Main headline inside the lamp
//   sub_heading     – text        Small label above headline
//   description     – wysiwyg    Body copy below headline
//   custom_class    – text
//   custom_id       – text
export default function TubeLightSection({ data }) {
  if (!data) return null;

  const {
    heading,
    sub_heading,
    description,
    accent_color,
    background_color,
    custom_class,
    custom_id,
  } = data;

  const bgStyle = background_color ? { backgroundColor: background_color } : {};

  return (
    <section
      id={custom_id || undefined}
      className={cn('w-full', custom_class)}
      style={bgStyle}
    >
      <LampContainer accentColor={accent_color || '#06b6d4'}>
        {/* Sub heading */}
        {sub_heading && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: 'easeInOut' }}
            className="mb-3 text-4xl font-bold uppercase tracking-[0.25em] text-cyan-400"
          >
            {sub_heading}
          </motion.p>
        )}

        {/* Main heading */}
        {heading && (
          <motion.h2
            initial={{ opacity: 0.5, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8, ease: 'easeInOut' }}
            className="bg-gradient-to-br from-slate-300 to-slate-500 bg-clip-text py-4 text-center text-5xl font-medium tracking-tight text-transparent md:text-6xl lg:text-7xl"
          >
            {heading}
          </motion.h2>
        )}

        {/* Description wysiwyg */}
        {description && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7, ease: 'easeInOut' }}
            className="prose prose-invert prose-sm mt-4 max-w-xl text-center text-slate-400"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        )}
      </LampContainer>
    </section>
  );
}
