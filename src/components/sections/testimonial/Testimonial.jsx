'use client';

// Layout: testimonial_section
// ACF Fields:
//   background_color   (color_picker)
//   sub_heading        (text)
//   heading            (text)
//   description        (wysiwyg)
//   custom_class       (text)
//   custom_id          (text)
//   testimonial_style  (select: hslider | gridslider | cardslider | basic | gridview)
//   testimonial        (repeater)
//     testimonial_content     (textarea)
//     testimonial_image       (image → array)
//     testimonial_name        (text)
//     testimonial_designation (text)

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { HiArrowLeft, HiArrowRight } from 'react-icons/hi2';
import { cn } from '@/lib/utils';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function resolveImage(acfImage) {
  if (!acfImage) return '';
  return acfImage.url || acfImage.sizes?.large || acfImage.sizes?.medium || '';
}

function SectionHeader({ subHeading, heading, description }) {
  if (!subHeading && !heading && !description) return null;
  return (
    <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-12">
      {subHeading && (
        <span className="inline-block border border-neutral-300 py-1 px-4 rounded-full text-xs font-semibold tracking-widest uppercase text-neutral-600 mb-4">
          {subHeading}
        </span>
      )}
      {heading && (
        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-neutral-900">
          {heading}
        </h2>
      )}
      {description && (
        <div
          className="mt-4 text-neutral-500 text-lg leading-relaxed"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      )}
    </div>
  );
}

function PersonAvatar({ image, name, size = 40 }) {
  const src = resolveImage(image);
  const initial = (name || '?')[0].toUpperCase();
  if (!src) {
    return (
      <div
        className="rounded-full bg-neutral-200 flex items-center justify-center text-neutral-500 font-bold text-sm shrink-0"
        style={{ width: size, height: size }}
      >
        {initial}
      </div>
    );
  }
  return (
    <Image
      src={src}
      alt={name || 'Testimonial author'}
      width={size}
      height={size}
      className="rounded-full object-cover shrink-0"
      style={{ width: size, height: size }}
    />
  );
}

// ─── Style 1: hslider ─────────────────────────────────────────────────────────
// Portrait image centre, thumbnails left, animated quote right

function HSlider({ items }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState('right');

  const goTo = (i) => {
    setDirection(i > currentIndex ? 'right' : 'left');
    setCurrentIndex(i);
  };
  const goNext = () => goTo((currentIndex + 1) % items.length);
  const goPrev = () => goTo((currentIndex - 1 + items.length) % items.length);

  const active = items[currentIndex];

  const thumbnails = items
    .map((item, i) => ({ item, i }))
    .filter(({ i }) => i !== currentIndex)
    .slice(0, 3);

  const imageVariants = {
    enter: (d) => ({ y: d === 'right' ? '100%' : '-100%', opacity: 0 }),
    center: { y: 0, opacity: 1 },
    exit: (d) => ({ y: d === 'right' ? '-100%' : '100%', opacity: 0 }),
  };

  const textVariants = {
    enter: (d) => ({ x: d === 'right' ? 50 : -50, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d) => ({ x: d === 'right' ? -50 : 50, opacity: 0 }),
  };

  return (
    <div className="relative w-full min-h-140 md:min-h-150 overflow-hidden bg-white border border-neutral-100 p-8 md:p-12 rounded-2xl shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 h-full">

        {/* Left col: counter + thumbnails */}
        <div className="md:col-span-3 flex flex-col justify-between order-2 md:order-1">
          <div className="flex flex-row md:flex-col justify-between md:justify-start gap-4">
            <span className="text-sm text-neutral-400 font-mono tabular-nums">
              {String(currentIndex + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
            </span>
            <p
              className="text-xs font-semibold tracking-widest uppercase text-neutral-400 hidden md:block"
              style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
            >
              Reviews
            </p>
          </div>
          <div className="flex gap-2 mt-8 md:mt-0 flex-wrap">
            {thumbnails.map(({ item, i }) => {
              const src = resolveImage(item.testimonial_image);
              return (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className="overflow-hidden rounded-lg w-16 h-20 md:w-20 md:h-24 opacity-50 hover:opacity-100 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 block"
                  aria-label={`View review from ${item.testimonial_name}`}
                >
                  {src ? (
                    <Image
                      src={src}
                      alt={item.testimonial_name || ''}
                      width={80}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-neutral-100 flex items-center justify-center text-neutral-400 text-xl font-bold">
                      {(item.testimonial_name || '?')[0]}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Centre col: main image */}
        <div className="md:col-span-4 relative h-72 md:min-h-125 order-1 md:order-2 rounded-xl overflow-hidden">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={imageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
              className="absolute inset-0"
            >
              {resolveImage(active.testimonial_image) ? (
                <Image
                  src={resolveImage(active.testimonial_image)}
                  alt={active.testimonial_name || ''}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-neutral-100 flex items-center justify-center text-neutral-300 text-7xl font-bold">
                  {(active.testimonial_name || '?')[0]}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right col: quote + nav */}
        <div className="md:col-span-5 flex flex-col justify-between md:pl-8 order-3">
          <div className="relative overflow-hidden pt-4 md:pt-16 min-h-[200px]">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={textVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
              >
                {active.testimonial_designation && (
                  <p className="text-sm text-neutral-400 font-medium">
                    {active.testimonial_designation}
                  </p>
                )}
                <h3 className="text-xl font-semibold mt-1 text-neutral-900">
                  {active.testimonial_name}
                </h3>
                <blockquote className="mt-6 text-2xl md:text-3xl font-medium leading-snug text-neutral-800">
                  &ldquo;{active.testimonial_content}&rdquo;
                </blockquote>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="flex items-center gap-3 mt-8 md:mt-0">
            <button
              onClick={goPrev}
              aria-label="Previous testimonial"
              className="w-12 h-12 rounded-full border border-neutral-200 flex items-center justify-center hover:bg-neutral-50 transition-colors"
            >
              <HiArrowLeft className="w-5 h-5" />
            </button>
            <button
              onClick={goNext}
              aria-label="Next testimonial"
              className="w-12 h-12 rounded-full bg-neutral-900 text-white flex items-center justify-center hover:bg-neutral-700 transition-colors"
            >
              <HiArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

// ─── Style 2: gridslider ──────────────────────────────────────────────────────
// 3-column auto-scrolling vertical marquee

function MarqueeCard({ item }) {
  return (
    <li className="p-8 rounded-3xl border border-neutral-200 shadow-md shadow-black/5 max-w-xs w-full bg-white list-none">
      <blockquote>
        <p className="text-neutral-600 leading-relaxed text-sm">
          &ldquo;{item.testimonial_content}&rdquo;
        </p>
        <footer className="flex items-center gap-3 mt-6">
          <PersonAvatar image={item.testimonial_image} name={item.testimonial_name} />
          <div className="flex flex-col">
            <cite className="font-semibold not-italic text-neutral-900 text-sm leading-5">
              {item.testimonial_name}
            </cite>
            {item.testimonial_designation && (
              <span className="text-xs text-neutral-500 leading-5 mt-0.5">
                {item.testimonial_designation}
              </span>
            )}
          </div>
        </footer>
      </blockquote>
    </li>
  );
}

function MarqueeColumn({ items, duration = 15, className }) {
  const looped = items.length < 2 ? [...items, ...items, ...items] : [...items, ...items];
  return (
    <div className={cn('overflow-hidden', className)}>
      <motion.ul
        animate={{ translateY: '-50%' }}
        transition={{ duration, repeat: Infinity, ease: 'linear', repeatType: 'loop' }}
        className="flex flex-col gap-6 pb-6 m-0 p-0"
      >
        {looped.map((item, i) => (
          <MarqueeCard key={i} item={item} />
        ))}
      </motion.ul>
    </div>
  );
}

function GridSlider({ items }) {
  const third = Math.ceil(items.length / 3);
  const col1 = items.slice(0, third);
  const col2 = items.slice(third, third * 2);
  const col3 = items.slice(third * 2);
  return (
    <div
      className="flex justify-center gap-6 mt-4 max-h-185 overflow-hidden"
      style={{ maskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)' }}
    >
      <MarqueeColumn items={col1} duration={15} />
      {col2.length > 0 && <MarqueeColumn items={col2} duration={19} className="hidden md:block" />}
      {col3.length > 0 && <MarqueeColumn items={col3} duration={17} className="hidden lg:block" />}
    </div>
  );
}

// ─── Style 3: cardslider ──────────────────────────────────────────────────────
// Single large card carousel with dot + arrow nav

function CardSlider({ items }) {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);

  const goTo = (i) => {
    setDir(i > index ? 1 : -1);
    setIndex(i);
  };
  const goNext = () => goTo((index + 1) % items.length);
  const goPrev = () => goTo((index - 1 + items.length) % items.length);

  const active = items[index];

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      <div className="overflow-hidden rounded-2xl">
        <AnimatePresence initial={false} custom={dir} mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, x: dir * 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir * -60 }}
            transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
            className="bg-white border border-neutral-200 rounded-2xl p-10 md:p-14 shadow-sm"
          >
            <svg className="w-10 h-10 text-neutral-200 mb-6" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true">
              <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
            </svg>
            <blockquote>
              <p className="text-xl md:text-2xl text-neutral-800 font-medium leading-relaxed mb-8">
                {active.testimonial_content}
              </p>
              <footer className="flex items-center gap-4">
                <PersonAvatar image={active.testimonial_image} name={active.testimonial_name} size={52} />
                <div>
                  <cite className="block font-bold not-italic text-neutral-900 text-lg leading-5">
                    {active.testimonial_name}
                  </cite>
                  {active.testimonial_designation && (
                    <span className="text-neutral-500 text-sm mt-1 block">
                      {active.testimonial_designation}
                    </span>
                  )}
                </div>
              </footer>
            </blockquote>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between mt-6 px-1">
        <div className="flex gap-2 items-center">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={cn(
                'h-2 rounded-full transition-all duration-300',
                i === index ? 'w-6 bg-neutral-900' : 'w-2 bg-neutral-300 hover:bg-neutral-400'
              )}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <button
            onClick={goPrev}
            aria-label="Previous testimonial"
            className="w-10 h-10 rounded-full border border-neutral-200 flex items-center justify-center hover:bg-neutral-50 transition-colors"
          >
            <HiArrowLeft className="w-4 h-4" />
          </button>
          <button
            onClick={goNext}
            aria-label="Next testimonial"
            className="w-10 h-10 rounded-full bg-neutral-900 text-white flex items-center justify-center hover:bg-neutral-700 transition-colors"
          >
            <HiArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Style 4: basic ───────────────────────────────────────────────────────────
// Minimal click-through with progress bar

function BasicSlider({ items }) {
  const [index, setIndex] = useState(0);
  const active = items[index];

  const goNext = () => setIndex((i) => (i + 1) % items.length);
  const goPrev = () => setIndex((i) => (i - 1 + items.length) % items.length);

  return (
    <div className="relative w-full max-w-xl mx-auto py-10 px-8">
      <div className="flex items-baseline gap-1 mb-6 font-mono text-xs text-neutral-400">
        <motion.span
          key={index}
          initial={{ y: 8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-2xl font-light text-neutral-700"
        >
          {String(index + 1).padStart(2, '0')}
        </motion.span>
        <span>/</span>
        <span>{String(items.length).padStart(2, '0')}</span>
      </div>

      <AnimatePresence mode="wait">
        <motion.blockquote
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="text-xl md:text-2xl font-light leading-relaxed tracking-tight text-neutral-800"
        >
          &ldquo;{active.testimonial_content}&rdquo;
        </motion.blockquote>
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.div
          key={`author-${index}`}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 12 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="flex items-center gap-4 mt-10"
        >
          <PersonAvatar image={active.testimonial_image} name={active.testimonial_name} size={48} />
          <div className="relative pl-4 border-l-2 border-neutral-900">
            <span className="block text-sm font-semibold text-neutral-900 tracking-wide">
              {active.testimonial_name}
            </span>
            {active.testimonial_designation && (
              <span className="block text-xs text-neutral-400 mt-0.5 uppercase tracking-widest font-mono">
                {active.testimonial_designation}
              </span>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="mt-10 h-px bg-neutral-200 relative overflow-hidden rounded-full">
        <motion.div
          className="absolute inset-y-0 left-0 bg-neutral-900"
          animate={{ width: `${((index + 1) / items.length) * 100}%` }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>

      <div className="flex gap-2 mt-6">
        <button
          onClick={goPrev}
          aria-label="Previous testimonial"
          className="w-10 h-10 rounded-full border border-neutral-200 flex items-center justify-center hover:bg-neutral-100 transition-colors"
        >
          <HiArrowLeft className="w-4 h-4" />
        </button>
        <button
          onClick={goNext}
          aria-label="Next testimonial"
          className="w-10 h-10 rounded-full bg-neutral-900 text-white flex items-center justify-center hover:bg-neutral-700 transition-colors"
        >
          <HiArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ─── Style 5: gridview ────────────────────────────────────────────────────────
// Static responsive card grid with scroll-in animation

function GridView({ items }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item, i) => (
        <motion.article
          key={i}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: i * 0.07 }}
          className="bg-white border border-neutral-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow"
        >
          <blockquote>
            <svg className="w-8 h-8 text-neutral-200 mb-4" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true">
              <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
            </svg>
            <p className="text-neutral-600 leading-relaxed">
              {item.testimonial_content}
            </p>
            <footer className="flex items-center gap-3 mt-6 pt-6 border-t border-neutral-100">
              <PersonAvatar image={item.testimonial_image} name={item.testimonial_name} size={44} />
              <div>
                <cite className="block font-semibold not-italic text-neutral-900 leading-5">
                  {item.testimonial_name}
                </cite>
                {item.testimonial_designation && (
                  <span className="text-sm text-neutral-500 leading-5 mt-0.5 block">
                    {item.testimonial_designation}
                  </span>
                )}
              </div>
            </footer>
          </blockquote>
        </motion.article>
      ))}
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function TestimonialSection({ data }) {
  if (!data) return null;

  const {
    background_color,
    sub_heading,
    heading,
    description,
    custom_class,
    custom_id,
    testimonial = [],
    testimonial_style = 'gridslider',
  } = data;

  if (!testimonial?.length) return null;

  const renderStyle = () => {
    switch (testimonial_style) {
      case 'hslider':    return <HSlider items={testimonial} />;
      case 'gridslider': return <GridSlider items={testimonial} />;
      case 'cardslider': return <CardSlider items={testimonial} />;
      case 'basic':      return <BasicSlider items={testimonial} />;
      case 'gridview':   return <GridView items={testimonial} />;
      default:           return <GridSlider items={testimonial} />;
    }
  };

  return (
    <section
      id={custom_id || undefined}
      className={cn('py-16 px-4', custom_class)}
      style={background_color ? { backgroundColor: background_color } : undefined}
    >
      <div className="container mx-auto">
        <SectionHeader
          subHeading={sub_heading}
          heading={heading}
          description={description}
        />
        {renderStyle()}
      </div>
    </section>
  );
}
