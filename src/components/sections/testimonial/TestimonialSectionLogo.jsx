'use client';

// Layout: testimonial_section_with_logo
// ACF Fields:
//   background_color       (color_picker)
//   sub_heading            (text)
//   heading                (text)
//   description            (wysiwyg)
//   custom_class           (text)
//   custom_id              (text)
//   testimonial            (repeater)
//     testimonial_content     (textarea)
//     testimonial_image       (image → array)
//     testimonial_name        (text)
//     testimonial_designation (text)
//     client_logo             (image → array)

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

function resolveImage(acfImage) {
  if (!acfImage) return '';
  return acfImage.url || acfImage.sizes?.large || acfImage.sizes?.medium || '';
}

export default function TestimonialSectionLogo({ data }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  if (!data) return null;

  const {
    background_color,
    sub_heading,
    heading,
    description,
    custom_class,
    custom_id,
    testimonial = [],
  } = data;

  if (!testimonial?.length) return null;

  const active = testimonial[activeIndex];

  const goTo = (i) => {
    setDirection(i > activeIndex ? 1 : -1);
    setActiveIndex(i);
  };

  const bgStyle = background_color
    ? { backgroundColor: background_color }
    : { backgroundColor: '#0f0e17' };

  return (
    <section
      id={custom_id || undefined}
      className={cn('py-16 px-4 md:py-24', custom_class)}
      style={bgStyle}
    >
      <div className="container mx-auto max-w-6xl">

        {/* Section header */}
        {(heading || description) && (
          <div className="mb-10">
            {heading && (
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">{heading}</h2>
            )}
            {description && (
              <div
                className="text-white/60 text-base leading-relaxed"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            )}
          </div>
        )}

        {/* Quote marks */}
        <svg
          className="w-10 h-10 text-white/20 mb-6"
          fill="currentColor"
          viewBox="0 0 32 32"
          aria-hidden="true"
        >
          <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
        </svg>

        {/* Sub heading */}
        {sub_heading && (
          <p className="text-white/50 text-sm font-medium tracking-wide mb-4">
            {sub_heading}
          </p>
        )}

        {/* Testimonial quote */}
        <div className="min-h-[160px] md:min-h-[180px] mb-10">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.blockquote
              key={activeIndex}
              custom={direction}
              initial={{ opacity: 0, y: direction * 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: direction * -16 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="text-2xl md:text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight"
            >
              {active.testimonial_content}
            </motion.blockquote>
          </AnimatePresence>
        </div>

        {/* Bottom row: person info + logo nav */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 pt-6 border-t border-white/10">

          {/* Person info */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`person-${activeIndex}`}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-4"
            >
              {/* Avatar */}
              <div className="shrink-0">
                {resolveImage(active.testimonial_image) ? (
                  <Image
                    src={resolveImage(active.testimonial_image)}
                    alt={active.testimonial_name || ''}
                    width={44}
                    height={44}
                    className="w-11 h-11 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center text-white font-bold text-base">
                    {(active.testimonial_name || '?')[0].toUpperCase()}
                  </div>
                )}
              </div>

              {/* Name + designation */}
              <div>
                <cite className="block not-italic font-semibold text-white text-sm leading-5">
                  {active.testimonial_name}
                </cite>
                {active.testimonial_designation && (
                  <span className="block text-white/50 text-xs mt-0.5">
                    {active.testimonial_designation}
                  </span>
                )}
              </div>

              {/* Learn more */}
              <a
                href="#"
                className="ml-4 text-sm text-white/60 hover:text-white transition-colors flex items-center gap-1 whitespace-nowrap"
              >
                Learn more
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </motion.div>
          </AnimatePresence>

          {/* Client logo navigation */}
          <div className="flex items-center gap-3 flex-wrap">
            {testimonial.map((item, i) => {
              const logoSrc = resolveImage(item.client_logo);
              const isActive = i === activeIndex;
              return (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  aria-label={`View testimonial from ${item.testimonial_name}`}
                  className={cn(
                    'h-10 px-4 rounded-lg border transition-all duration-300 flex items-center justify-center',
                    isActive
                      ? 'border-white/30 bg-white/10'
                      : 'border-white/10 bg-transparent hover:border-white/20 hover:bg-white/5'
                  )}
                >
                  {logoSrc ? (
                    <Image
                      src={logoSrc}
                      alt={item.testimonial_name || `Client ${i + 1}`}
                      width={80}
                      height={28}
                      className={cn(
                        'h-5 w-auto object-contain transition-opacity duration-300',
                        isActive ? 'opacity-100' : 'opacity-40'
                      )}
                    />
                  ) : (
                    <span
                      className={cn(
                        'text-xs font-semibold transition-colors duration-300',
                        isActive ? 'text-white' : 'text-white/40'
                      )}
                    >
                      {item.testimonial_name}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
