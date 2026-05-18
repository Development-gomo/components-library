'use client';

// Layout: feature_grid
// ACF Fields:
//   background_color  (color_picker)
//   text_color        (color_picker)
//   accent_color      (color_picker)
//   section_title     (text)          — eyebrow label
//   heading           (text)
//   description       (wysiwyg)
//   grid_style        (select: grid | bento | list | split)
//   features          (repeater)
//     feature_title       (text)
//     feature_description (wysiwyg)
//     feature_icon        (image)
//     feature_tag         (text)      — optional pill label
//   custom_class      (text)
//   custom_id         (text)

import Image from 'next/image';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function resolveImage(img) {
  if (!img) return '';
  return img.url || img.sizes?.large || img.sizes?.medium || '';
}

function hexToRgb(hex = '') {
  const h = hex.replace('#', '');
  if (h.length !== 6) return '0,254,195';
  return `${parseInt(h.slice(0, 2), 16)},${parseInt(h.slice(2, 4), 16)},${parseInt(h.slice(4, 6), 16)}`;
}

// ─── Animation presets ────────────────────────────────────────────────────────

const up = (delay = 0) => ({
  initial:     { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport:    { once: true, amount: 0.15 },
  transition:  { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay },
});

const left = (delay = 0) => ({
  initial:     { opacity: 0, x: -40 },
  whileInView: { opacity: 1, x: 0 },
  viewport:    { once: true, amount: 0.2 },
  transition:  { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay },
});

const right = (delay = 0) => ({
  initial:     { opacity: 0, x: 40 },
  whileInView: { opacity: 1, x: 0 },
  viewport:    { once: true, amount: 0.2 },
  transition:  { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay },
});

// ─── Section header ───────────────────────────────────────────────────────────

function SectionHeader({ sectionTitle, heading, description, textColor, accentColor }) {
  if (!sectionTitle && !heading && !description) return null;
  return (
    <div className="text-center max-w-2xl mx-auto mb-16">
      {sectionTitle && (
        <motion.div {...up(0)} className="flex items-center justify-center gap-2 mb-4">
          <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentColor }} />
          <span className="text-xs font-bold tracking-[0.2em] uppercase" style={{ color: accentColor }}>
            {sectionTitle}
          </span>
          <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentColor }} />
        </motion.div>
      )}
      {heading && (
        <motion.h2
          {...up(0.06)}
          className="text-3xl md:text-[2.75rem] lg:text-[3.25rem] font-extrabold leading-[1.08] tracking-tight"
          style={{ color: textColor }}
        >
          {heading}
        </motion.h2>
      )}
      {heading && (
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-4 h-0.5 w-16 rounded-full origin-left"
          style={{ background: `linear-gradient(90deg, ${accentColor}, transparent)` }}
        />
      )}
      {description && (
        <motion.div
          {...up(0.14)}
          className="mt-5 text-base md:text-lg leading-relaxed"
          style={{ color: textColor, opacity: 0.55 }}
          dangerouslySetInnerHTML={{ __html: description }}
        />
      )}
    </div>
  );
}

// ─── Icon box shared ──────────────────────────────────────────────────────────

function IconBox({ src, accentColor, rgb, size = 'md' }) {
  const dim = size === 'lg' ? { width: '4rem', height: '4rem' } : { width: '3rem', height: '3rem' };
  const imgDim = size === 'lg' ? 'w-7 h-7' : 'w-5 h-5';
  return (
    <div
      className="rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
      style={{
        ...dim,
        background: `linear-gradient(135deg, ${accentColor} 0%, ${accentColor}70 100%)`,
        boxShadow: `0 8px 20px rgba(${rgb},0.3)`,
      }}
    >
      {src ? (
        <div className={cn('relative', imgDim)}>
          <Image src={src} alt="" fill className="object-contain brightness-0" />
        </div>
      ) : (
        <svg className={imgDim} viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      )}
    </div>
  );
}

// ─── Style 1: grid ────────────────────────────────────────────────────────────
// Responsive card grid — icon, tag pill, title, description

function GridStyle({ features, textColor, accentColor }) {
  const rgb = hexToRgb(accentColor);
  const cols =
    features.length <= 2 ? 'grid-cols-1 md:grid-cols-2' :
    features.length === 3 ? 'grid-cols-1 md:grid-cols-3' :
    features.length === 4 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' :
    'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';

  return (
    <div className={cn('grid gap-5', cols)}>
      {features.map((feat, i) => {
        const src = resolveImage(feat.feature_icon);
        return (
          <motion.div
            key={i}
            {...up(i * 0.08)}
            className="group relative rounded-2xl p-7 overflow-hidden transition-all duration-300 hover:-translate-y-2"
            style={{
              background: `linear-gradient(160deg, rgba(${rgb},0.08) 0%, rgba(${rgb},0.02) 100%)`,
              border: `1px solid rgba(${rgb},0.14)`,
            }}
          >
            {/* Top accent bar */}
            <div
              className="absolute top-0 left-6 right-6 h-[2px] rounded-b-full"
              style={{ background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)` }}
            />
            {/* Hover border glow */}
            <div
              className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
              style={{ boxShadow: `inset 0 0 0 1px rgba(${rgb},0.4), 0 16px 48px rgba(${rgb},0.1)` }}
            />

            <div className="relative z-10 flex flex-col gap-4">
              <div className="flex items-start justify-between">
                <IconBox src={src} accentColor={accentColor} rgb={rgb} />
                {feat.feature_tag && (
                  <span
                    className="text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={{ color: accentColor, backgroundColor: `rgba(${rgb},0.12)`, border: `1px solid rgba(${rgb},0.2)` }}
                  >
                    {feat.feature_tag}
                  </span>
                )}
              </div>

              <h3 className="text-base md:text-lg font-bold leading-snug" style={{ color: textColor }}>
                {feat.feature_title}
              </h3>

              {feat.feature_description && (
                <div
                  className="text-sm leading-relaxed"
                  style={{ color: textColor, opacity: 0.55 }}
                  dangerouslySetInnerHTML={{ __html: feat.feature_description }}
                />
              )}

              {/* Hover expand line */}
              <div className="h-px rounded-full overflow-hidden mt-1" style={{ backgroundColor: `rgba(${rgb},0.12)` }}>
                <div
                  className="h-full w-0 group-hover:w-full transition-all duration-500 ease-out rounded-full"
                  style={{ backgroundColor: accentColor }}
                />
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

// ─── Style 2: bento ───────────────────────────────────────────────────────────
// Bento box — first item spans 2 cols & is featured (large icon, bigger text)

function BentoStyle({ features, textColor, accentColor }) {
  const rgb = hexToRgb(accentColor);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 auto-rows-auto">
      {features.map((feat, i) => {
        const src      = resolveImage(feat.feature_icon);
        const featured = i === 0; // first card spans 2 cols
        return (
          <motion.div
            key={i}
            {...up(i * 0.08)}
            className={cn(
              'group relative rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-1',
              featured ? 'lg:col-span-2 p-9' : 'p-7'
            )}
            style={{
              background: featured
                ? `radial-gradient(ellipse at 20% 30%, rgba(${rgb},0.18) 0%, rgba(${rgb},0.04) 60%), linear-gradient(135deg, rgba(${rgb},0.08) 0%, rgba(${rgb},0.02) 100%)`
                : `linear-gradient(160deg, rgba(${rgb},0.07) 0%, rgba(${rgb},0.02) 100%)`,
              border: `1px solid rgba(${rgb},${featured ? '0.25' : '0.13'})`,
              boxShadow: featured ? `0 20px 60px rgba(${rgb},0.08)` : 'none',
            }}
          >
            {/* Dot grid pattern on featured */}
            {featured && (
              <div
                className="absolute inset-0 opacity-15 pointer-events-none"
                style={{
                  backgroundImage: `radial-gradient(circle, rgba(${rgb},0.7) 1px, transparent 1px)`,
                  backgroundSize: '24px 24px',
                }}
              />
            )}

            {/* Hover glow */}
            <div
              className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
              style={{ boxShadow: `inset 0 0 0 1px rgba(${rgb},0.35)` }}
            />

            {/* Ghost number */}
            <span
              className="absolute -bottom-4 -right-2 font-black leading-none select-none pointer-events-none"
              style={{ fontSize: featured ? '10rem' : '7rem', color: accentColor + '0e' }}
            >
              {String(i + 1).padStart(2, '0')}
            </span>

            <div className="relative z-10 flex flex-col gap-4 h-full">
              <div className="flex items-start justify-between">
                <IconBox src={src} accentColor={accentColor} rgb={rgb} size={featured ? 'lg' : 'md'} />
                {feat.feature_tag && (
                  <span
                    className="text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={{ color: accentColor, backgroundColor: `rgba(${rgb},0.12)`, border: `1px solid rgba(${rgb},0.2)` }}
                  >
                    {feat.feature_tag}
                  </span>
                )}
              </div>

              <h3
                className={cn('font-bold leading-snug', featured ? 'text-xl md:text-2xl' : 'text-base md:text-lg')}
                style={{ color: textColor }}
              >
                {feat.feature_title}
              </h3>

              {feat.feature_description && (
                <div
                  className={cn('leading-relaxed', featured ? 'text-base' : 'text-sm')}
                  style={{ color: textColor, opacity: 0.55 }}
                  dangerouslySetInnerHTML={{ __html: feat.feature_description }}
                />
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

// ─── Style 3: list ────────────────────────────────────────────────────────────
// Horizontal icon-list rows — two columns on desktop

function ListStyle({ features, textColor, accentColor }) {
  const rgb  = hexToRgb(accentColor);
  const half = Math.ceil(features.length / 2);
  const col1 = features.slice(0, half);
  const col2 = features.slice(half);

  const Row = ({ feat, i, delay }) => {
    const src = resolveImage(feat.feature_icon);
    return (
      <motion.div
        {...up(delay)}
        className="group flex items-start gap-5 py-5 border-b transition-all duration-300 hover:pl-1"
        style={{ borderColor: `rgba(${rgb},0.12)` }}
      >
        <IconBox src={src} accentColor={accentColor} rgb={rgb} />
        <div className="flex flex-col gap-1 flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-base font-bold leading-snug" style={{ color: textColor }}>
              {feat.feature_title}
            </h3>
            {feat.feature_tag && (
              <span
                className="text-xs font-semibold px-2 py-0.5 rounded-full"
                style={{ color: accentColor, backgroundColor: `rgba(${rgb},0.1)` }}
              >
                {feat.feature_tag}
              </span>
            )}
          </div>
          {feat.feature_description && (
            <div
              className="text-sm leading-relaxed"
              style={{ color: textColor, opacity: 0.52 }}
              dangerouslySetInnerHTML={{ __html: feat.feature_description }}
            />
          )}
        </div>
        {/* Arrow on hover */}
        <svg
          className="shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0"
          width="18" height="18" viewBox="0 0 18 18" fill="none"
        >
          <path d="M3 9h12M10 4l5 5-5 5" stroke={accentColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 lg:gap-x-20">
      <div>
        {col1.map((feat, i) => <Row key={i} feat={feat} i={i} delay={i * 0.07} />)}
      </div>
      <div>
        {col2.map((feat, i) => <Row key={i} feat={feat} i={i} delay={(i + half) * 0.07} />)}
      </div>
    </div>
  );
}

// ─── Style 4: split ───────────────────────────────────────────────────────────
// Left: 2×2 mini feature cards — Right: one large highlighted feature

function SplitStyle({ features, textColor, accentColor }) {
  const rgb = hexToRgb(accentColor);
  const [featured, ...rest] = features;
  const gridItems = rest.slice(0, 4);
  const featSrc   = resolveImage(featured?.feature_icon);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">

      {/* Left: 2×2 mini cards */}
      <motion.div {...left(0)} className="grid grid-cols-2 gap-4">
        {gridItems.map((feat, i) => {
          const src = resolveImage(feat.feature_icon);
          return (
            <motion.div
              key={i}
              {...up(i * 0.08)}
              className="group rounded-2xl p-5 flex flex-col gap-3 transition-all duration-300 hover:-translate-y-1"
              style={{
                background: `linear-gradient(135deg, rgba(${rgb},0.07) 0%, rgba(${rgb},0.02) 100%)`,
                border: `1px solid rgba(${rgb},0.14)`,
              }}
            >
              <IconBox src={src} accentColor={accentColor} rgb={rgb} />
              <h4 className="text-sm font-bold leading-snug" style={{ color: textColor }}>
                {feat.feature_title}
              </h4>
              {feat.feature_description && (
                <div
                  className="text-xs leading-relaxed"
                  style={{ color: textColor, opacity: 0.52 }}
                  dangerouslySetInnerHTML={{ __html: feat.feature_description }}
                />
              )}
            </motion.div>
          );
        })}
      </motion.div>

      {/* Right: featured card */}
      {featured && (
        <motion.div
          {...right(0.1)}
          className="relative rounded-3xl p-10 overflow-hidden flex flex-col gap-6"
          style={{
            background: `
              radial-gradient(ellipse at 25% 20%, rgba(${rgb},0.22) 0%, transparent 55%),
              linear-gradient(145deg, rgba(${rgb},0.10) 0%, rgba(${rgb},0.03) 100%)
            `,
            border: `1px solid rgba(${rgb},0.22)`,
            boxShadow: `0 24px 64px rgba(${rgb},0.1), inset 0 1px 0 rgba(${rgb},0.2)`,
          }}
        >
          {/* Dot grid */}
          <div
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(circle, rgba(${rgb},0.7) 1px, transparent 1px)`,
              backgroundSize: '24px 24px',
            }}
          />
          {/* Ghost number */}
          <span
            className="absolute -bottom-4 -right-2 text-[10rem] font-black leading-none select-none pointer-events-none"
            style={{ color: accentColor + '12' }}
          >
            01
          </span>

          <div className="relative z-10 flex flex-col gap-5">
            <IconBox src={featSrc} accentColor={accentColor} rgb={rgb} size="lg" />
            {featured.feature_tag && (
              <span
                className="inline-flex w-fit items-center gap-1.5 text-xs font-bold tracking-[0.15em] uppercase px-3 py-1.5 rounded-full"
                style={{ color: accentColor, backgroundColor: `rgba(${rgb},0.12)`, border: `1px solid rgba(${rgb},0.2)` }}
              >
                <span className="w-1 h-1 rounded-full" style={{ backgroundColor: accentColor }} />
                {featured.feature_tag}
              </span>
            )}
            <h3
              className="text-2xl md:text-3xl font-extrabold leading-tight tracking-tight"
              style={{ color: textColor }}
            >
              {featured.feature_title}
            </h3>
            {featured.feature_description && (
              <div
                className="text-base leading-relaxed"
                style={{ color: textColor, opacity: 0.6 }}
                dangerouslySetInnerHTML={{ __html: featured.feature_description }}
              />
            )}
            <div
              className="h-0.5 w-14 rounded-full"
              style={{ background: `linear-gradient(90deg, ${accentColor}, transparent)` }}
            />
          </div>
        </motion.div>
      )}
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function FeatureGrid({ data = {} }) {
  const {
    background_color = '',
    text_color        = '#1a1a1a',
    accent_color      = '#00fec3',
    section_title     = '',
    heading           = '',
    description       = '',
    grid_style        = 'grid',
    features          = [],
    custom_class      = '',
    custom_id         = '',
  } = data;

  if (!features?.length) return null;

  const accent = accent_color || '#00fec3';
  const rgb    = hexToRgb(accent);
  const props  = { features, textColor: text_color, accentColor: accent };

  const renderStyle = () => {
    switch (grid_style) {
      case 'bento':  return <BentoStyle {...props} />;
      case 'list':   return <ListStyle  {...props} />;
      case 'split':  return <SplitStyle {...props} />;
      default:       return <GridStyle  {...props} />;
    }
  };

  return (
    <section
      id={custom_id || undefined}
      className={cn('relative py-24 md:py-32 px-4 overflow-hidden', custom_class)}
      style={background_color ? { backgroundColor: background_color, color: text_color } : { color: text_color }}
    >
      {/* Ambient background glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[360px] rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at center, rgba(${rgb},0.06) 0%, transparent 70%)`,
          filter: 'blur(40px)',
        }}
      />

      <div className="web-width mx-auto relative z-10">
        <SectionHeader
          sectionTitle={section_title}
          heading={heading}
          description={description}
          textColor={text_color}
          accentColor={accent}
        />
        {renderStyle()}
      </div>
    </section>
  );
}
