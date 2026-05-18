'use client';

// Layout: process_steps
// ACF Fields:
//   background_color  (color_picker)
//   text_color        (color_picker)
//   accent_color      (color_picker)
//   section_title     (text)
//   heading           (text)
//   description       (wysiwyg)
//   process_style     (select: horizontal | vertical | alternating | cards)
//   steps             (repeater)
//     step_title       (text)
//     step_description (wysiwyg)
//     step_icon        (image)
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
  return `${parseInt(h.slice(0,2),16)},${parseInt(h.slice(2,4),16)},${parseInt(h.slice(4,6),16)}`;
}

// ─── Animation presets ────────────────────────────────────────────────────────

const up = (delay = 0) => ({
  initial:     { opacity: 0, y: 36 },
  whileInView: { opacity: 1, y: 0 },
  viewport:    { once: true, amount: 0.15 },
  transition:  { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay },
});

const left = (delay = 0) => ({
  initial:     { opacity: 0, x: -48 },
  whileInView: { opacity: 1, x: 0 },
  viewport:    { once: true, amount: 0.2 },
  transition:  { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay },
});

const right = (delay = 0) => ({
  initial:     { opacity: 0, x: 48 },
  whileInView: { opacity: 1, x: 0 },
  viewport:    { once: true, amount: 0.2 },
  transition:  { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay },
});

// ─── Section header ───────────────────────────────────────────────────────────

function SectionHeader({ sectionTitle, heading, description, textColor, accentColor }) {
  if (!sectionTitle && !heading && !description) return null;
  const rgb = hexToRgb(accentColor);
  return (
    <div className="text-center max-w-2xl mx-auto mb-20">
      {sectionTitle && (
        <motion.div {...up(0)} className="flex items-center justify-center gap-2 mb-5">
          <span
            className="inline-block w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: accentColor }}
          />
          <span
            className="text-xs font-bold tracking-[0.2em] uppercase"
            style={{ color: accentColor }}
          >
            {sectionTitle}
          </span>
          <span
            className="inline-block w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: accentColor }}
          />
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
      {/* Decorative accent line under heading */}
      {heading && (
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-5 h-0.5 w-16 rounded-full origin-left"
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

// ─── Style 1: horizontal ──────────────────────────────────────────────────────
// Simple numbered row — circle badge + dashed connector + title/description

function HorizontalSteps({ steps, textColor, accentColor }) {
  const rgb = hexToRgb(accentColor);
  return (
    <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-0">
      {steps.map((step, i) => {
        const src    = resolveImage(step.step_icon);
        const isLast = i === steps.length - 1;
        return (
          <motion.div key={i} {...up(i * 0.1)} className="flex flex-col items-center text-center flex-1 relative px-4">

            {/* Connector line (between steps) */}
            {!isLast && (
              <div
                className="hidden lg:block absolute top-7 left-1/2 w-full h-px"
                style={{ borderTop: `1px dashed rgba(${rgb},0.35)` }}
              />
            )}

            {/* Number circle */}
            <div
              className="relative z-10 w-14 h-14 rounded-full flex items-center justify-center text-base font-extrabold mb-5 shrink-0"
              style={{
                background: `linear-gradient(135deg, ${accentColor} 0%, ${accentColor}80 100%)`,
                color: '#000',
                boxShadow: `0 4px 16px rgba(${rgb},0.3)`,
              }}
            >
              {src ? (
                <div className="relative w-6 h-6">
                  <Image src={src} alt="" fill className="object-contain brightness-0" />
                </div>
              ) : String(i + 1).padStart(2, '0')}
            </div>

            <h3
              className="text-base md:text-lg font-bold mb-2 leading-snug"
              style={{ color: textColor }}
            >
              {step.step_title}
            </h3>

            {step.step_description && (
              <div
                className="text-sm leading-relaxed"
                style={{ color: textColor, opacity: 0.55 }}
                dangerouslySetInnerHTML={{ __html: step.step_description }}
              />
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

// ─── Style 2: vertical ────────────────────────────────────────────────────────
// Timeline — glow dot + gradient spine + rich content cards

function VerticalSteps({ steps, textColor, accentColor }) {
  const rgb = hexToRgb(accentColor);
  return (
    <div className="max-w-2xl mx-auto">
      {steps.map((step, i) => {
        const src    = resolveImage(step.step_icon);
        const isLast = i === steps.length - 1;
        return (
          <motion.div key={i} {...left(i * 0.1)} className="relative flex gap-5 md:gap-8">

            {/* Timeline column */}
            <div className="flex flex-col items-center shrink-0">
              {/* Dot with rings */}
              <div className="relative flex items-center justify-center mt-1">
                <div
                  className="absolute w-16 h-16 rounded-full animate-ping opacity-10"
                  style={{ backgroundColor: accentColor }}
                />
                <div
                  className="absolute w-12 h-12 rounded-full opacity-15"
                  style={{ backgroundColor: accentColor }}
                />
                <div
                  className="relative w-11 h-11 rounded-full flex items-center justify-center text-sm font-extrabold z-10"
                  style={{
                    background: `linear-gradient(135deg, ${accentColor}, ${accentColor}99)`,
                    color: '#000',
                    boxShadow: `0 0 0 3px rgba(${rgb},0.2), 0 4px 18px rgba(${rgb},0.4)`,
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </div>
              </div>

              {/* Spine */}
              {!isLast && (
                <div
                  className="w-px flex-1 my-2"
                  style={{
                    background: `linear-gradient(to bottom, rgba(${rgb},0.5) 0%, rgba(${rgb},0.05) 100%)`,
                  }}
                />
              )}
            </div>

            {/* Card */}
            <div className={cn('flex-1 pb-10', isLast && 'pb-0')}>
              <motion.div
                className="group rounded-2xl p-6 md:p-8 relative overflow-hidden transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: `linear-gradient(135deg, rgba(${rgb},0.06) 0%, rgba(${rgb},0.01) 100%)`,
                  border: `1px solid rgba(${rgb},0.14)`,
                }}
              >
                {/* Ghost number */}
                <span
                  className="absolute -top-5 right-3 text-[6.5rem] font-black leading-none select-none pointer-events-none"
                  style={{ color: accentColor + '0d' }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>

                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-3">
                    {src && (
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `rgba(${rgb},0.15)` }}
                      >
                        <div className="relative w-5 h-5">
                          <Image src={src} alt="" fill className="object-contain" />
                        </div>
                      </div>
                    )}
                    <h3 className="text-xl font-bold leading-tight" style={{ color: textColor }}>
                      {step.step_title}
                    </h3>
                  </div>

                  {step.step_description && (
                    <div
                      className="text-sm md:text-base leading-relaxed mt-2"
                      style={{ color: textColor, opacity: 0.55 }}
                      dangerouslySetInnerHTML={{ __html: step.step_description }}
                    />
                  )}

                  {/* Accent stripe */}
                  <div
                    className="mt-5 h-0.5 w-0 group-hover:w-10 transition-all duration-500 rounded-full"
                    style={{ backgroundColor: accentColor }}
                  />
                </div>
              </motion.div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

// ─── Style 3: alternating ─────────────────────────────────────────────────────
// Zigzag — rich gradient visual panel left/right, text opposite

function AlternatingSteps({ steps, textColor, accentColor }) {
  const rgb = hexToRgb(accentColor);
  return (
    <div className="max-w-5xl mx-auto space-y-12 md:space-y-16">
      {steps.map((step, i) => {
        const isEven = i % 2 === 0;
        const src    = resolveImage(step.step_icon);
        return (
          <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">

            {/* Visual panel */}
            <motion.div
              {...(isEven ? left(0) : right(0))}
              className={cn(
                'relative rounded-3xl overflow-hidden aspect-[4/3] flex items-center justify-center',
                !isEven && 'md:order-2'
              )}
              style={{
                background: `
                  radial-gradient(ellipse at 30% 30%, rgba(${rgb},0.25) 0%, transparent 60%),
                  linear-gradient(135deg, rgba(${rgb},0.10) 0%, rgba(${rgb},0.03) 100%)
                `,
                border: `1px solid rgba(${rgb},0.2)`,
                boxShadow: `0 20px 60px rgba(${rgb},0.1), inset 0 1px 0 rgba(${rgb},0.2)`,
              }}
            >
              {/* Dot grid pattern */}
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `radial-gradient(circle, rgba(${rgb},0.6) 1px, transparent 1px)`,
                  backgroundSize: '24px 24px',
                }}
              />

              {/* Step badge top-left */}
              <div
                className="absolute top-5 left-5 z-10 px-3 py-1 rounded-full text-xs font-extrabold"
                style={{
                  background: `linear-gradient(135deg, ${accentColor}, ${accentColor}88)`,
                  color: '#000',
                  boxShadow: `0 4px 14px rgba(${rgb},0.4)`,
                }}
              >
                Step {String(i + 1).padStart(2, '0')}
              </div>

              {/* Ghost number */}
              <span
                className="absolute -bottom-4 -right-2 text-[9rem] font-black leading-none select-none pointer-events-none"
                style={{ color: accentColor + '18' }}
              >
                {String(i + 1).padStart(2, '0')}
              </span>

              {/* Icon / number center */}
              <div className="relative z-10">
                {src ? (
                  <div className="relative w-24 h-24 md:w-32 md:h-32 drop-shadow-xl">
                    <Image src={src} alt="" fill className="object-contain" />
                  </div>
                ) : (
                  <span
                    className="text-[7rem] md:text-[9rem] font-black leading-none select-none"
                    style={{
                      background: `linear-gradient(135deg, ${accentColor} 0%, ${accentColor}40 100%)`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                )}
              </div>
            </motion.div>

            {/* Text block */}
            <motion.div
              {...(isEven ? right(0.1) : left(0.1))}
              className={cn('flex flex-col gap-4', !isEven && 'md:order-1')}
            >
              {/* Step label */}
              <div
                className="inline-flex w-fit items-center gap-1.5 text-xs font-bold tracking-[0.18em] uppercase px-3 py-1.5 rounded-full"
                style={{ color: accentColor, backgroundColor: `rgba(${rgb},0.12)`, border: `1px solid rgba(${rgb},0.2)` }}
              >
                <span
                  className="w-1 h-1 rounded-full"
                  style={{ backgroundColor: accentColor }}
                />
                Step {String(i + 1).padStart(2, '0')}
              </div>

              <h3
                className="text-2xl md:text-[1.85rem] font-extrabold leading-tight tracking-tight"
                style={{ color: textColor }}
              >
                {step.step_title}
              </h3>

              {step.step_description && (
                <div
                  className="text-base leading-relaxed"
                  style={{ color: textColor, opacity: 0.6 }}
                  dangerouslySetInnerHTML={{ __html: step.step_description }}
                />
              )}

              <div
                className="mt-1 h-0.5 w-14 rounded-full"
                style={{ background: `linear-gradient(90deg, ${accentColor}, transparent)` }}
              />
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Style 4: cards ───────────────────────────────────────────────────────────
// Premium grid cards — glow icon box, animated bottom bar, hover lift + glow

function CardSteps({ steps, textColor, accentColor }) {
  const rgb = hexToRgb(accentColor);
  const gridClass =
    steps.length <= 2 ? 'grid-cols-1 md:grid-cols-2' :
    steps.length === 3 ? 'grid-cols-1 md:grid-cols-3' :
    'grid-cols-1 md:grid-cols-2 xl:grid-cols-4';

  return (
    <div className={cn('grid gap-5', gridClass)}>
      {steps.map((step, i) => {
        const src = resolveImage(step.step_icon);
        return (
          <motion.div
            key={i}
            {...up(i * 0.09)}
            className="group relative rounded-2xl p-7 overflow-hidden transition-all duration-400 hover:-translate-y-2"
            style={{
              background: `linear-gradient(160deg, rgba(${rgb},0.08) 0%, rgba(${rgb},0.02) 100%)`,
              border: `1px solid rgba(${rgb},0.15)`,
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
              style={{
                boxShadow: `inset 0 0 0 1px rgba(${rgb},0.45), 0 16px 48px rgba(${rgb},0.12)`,
              }}
            />

            {/* Ghost number */}
            <span
              className="absolute -bottom-5 -right-2 text-[8rem] font-black leading-none select-none pointer-events-none"
              style={{ color: accentColor + '10' }}
            >
              {String(i + 1).padStart(2, '0')}
            </span>

            <div className="relative z-10 flex flex-col h-full">
              {/* Icon box */}
              <div className="mb-6">
                <div
                  className="w-13 h-13 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
                  style={{
                    background: `linear-gradient(135deg, ${accentColor} 0%, ${accentColor}70 100%)`,
                    boxShadow: `0 8px 24px rgba(${rgb},0.35)`,
                    width: '3.25rem',
                    height: '3.25rem',
                  }}
                >
                  {src ? (
                    <div className="relative w-6 h-6">
                      <Image src={src} alt="" fill className="object-contain brightness-0" />
                    </div>
                  ) : (
                    <span className="text-sm font-extrabold text-black leading-none">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  )}
                </div>
              </div>

              <h3
                className="text-base md:text-lg font-bold mb-3 leading-snug"
                style={{ color: textColor }}
              >
                {step.step_title}
              </h3>

              {step.step_description && (
                <div
                  className="text-sm leading-relaxed flex-1"
                  style={{ color: textColor, opacity: 0.55 }}
                  dangerouslySetInnerHTML={{ __html: step.step_description }}
                />
              )}

              {/* Expanding bottom bar on hover */}
              <div
                className="mt-6 h-px rounded-full overflow-hidden"
                style={{ backgroundColor: `rgba(${rgb},0.15)` }}
              >
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

// ─── Main export ──────────────────────────────────────────────────────────────

export default function ProcessSteps({ data = {} }) {
  const {
    background_color = '',
    text_color        = '#1a1a1a',
    accent_color      = '#00fec3',
    section_title     = '',
    heading           = '',
    description       = '',
    process_style     = 'cards',
    steps             = [],
    custom_class      = '',
    custom_id         = '',
  } = data;

  if (!steps?.length) return null;

  const accent = accent_color || '#00fec3';
  const rgb    = hexToRgb(accent);
  const props  = { steps, textColor: text_color, accentColor: accent, bgColor: background_color };

  const renderStyle = () => {
    switch (process_style) {
      case 'horizontal':  return <HorizontalSteps  {...props} />;
      case 'vertical':    return <VerticalSteps     {...props} />;
      case 'alternating': return <AlternatingSteps  {...props} />;
      case 'cards':       return <CardSteps         {...props} />;
      default:            return <CardSteps         {...props} />;
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
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full pointer-events-none"
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
