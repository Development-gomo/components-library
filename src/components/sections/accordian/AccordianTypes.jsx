'use client';

// Layout: accordion_section
// Fields: background_color, sub_heading, heading, description (wysiwyg), custom_class, custom_id,
//         accordion_style (left | right | elegant | simple),
//         accordion repeater: question (text), answer (wysiwyg)

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Animation config ────────────────────────────────────────────────────────
const answerVariants = {
  hidden: { height: 0, opacity: 0 },
  visible: { height: 'auto', opacity: 1, transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] } },
  exit:    { height: 0, opacity: 0,    transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] } },
};

// ─── Shared: section header block ────────────────────────────────────────────
function SectionHeader({ sub_heading, heading, description, align = 'left' }) {
  const alignClass = align === 'center' ? 'text-center' : 'text-left';
  return (
    <div className={alignClass}>
      {sub_heading && (
        <p className="mb-6 text-xs font-bold uppercase tracking-[0.2em] opacity-60">
          {sub_heading}
        </p>
      )}
      {heading && (
        <h2 className="text-3xl font-bold leading-tight md:text-4xl lg:text-5xl">
          {heading}
        </h2>
      )}
      {description && (
        <div
          className="prose prose-sm mt-4 max-w-prose opacity-75"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      )}
    </div>
  );
}

// ─── Style: LEFT — heading left col, accordion right col ─────────────────────
function AccordionLeft({ items, sub_heading, heading, description }) {
  return (
    <div className="flex flex-col gap-10 md:flex-row md:gap-16">
      {/* Sticky heading column */}
      <div className="md:w-2/5">
        <div className="md:sticky md:top-24">
          <SectionHeader
            sub_heading={sub_heading}
            heading={heading}
            description={description}
          />
        </div>
      </div>
      {/* Accordion column */}
      <div className="md:w-3/5">
        <AccordionList items={items} variant="left" />
      </div>
    </div>
  );
}

// ─── Style: RIGHT — accordion left col, heading right col ────────────────────
function AccordionRight({ items, sub_heading, heading, description }) {
  return (
    <div className="flex flex-col gap-10 md:flex-row md:gap-16">
      {/* Accordion column */}
      <div className="md:w-3/5">
        <AccordionList items={items} variant="right" />
      </div>
      {/* Sticky heading column */}
      <div className="md:w-2/5">
        <div className="md:sticky md:top-24">
          <SectionHeader
            sub_heading={sub_heading}
            heading={heading}
            description={description}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Style: ELEGANT — centered header, numbered items, full-width ─────────────
function AccordionElegant({ items, sub_heading, heading, description }) {
  const [openIndex, setOpenIndex] = useState(null);
  const toggle = (i) => setOpenIndex(openIndex === i ? null : i);

  return (
    <div>
      {/* Centered header */}
      <div className="mx-auto mb-14 max-w-2xl text-center">
        <SectionHeader
          sub_heading={sub_heading}
          heading={heading}
          description={description}
          align="center"
        />
      </div>

      {/* Accordion items with large numbers */}
      <div className="divide-y divide-current/10 border-t border-current/10">
        {items.map((item, i) => {
          const isOpen = openIndex === i;
          return (
            <div key={i}>
              <button
                onClick={() => toggle(i)}
                className="group flex w-full items-start gap-6 py-7 text-left"
                aria-expanded={isOpen}
              >
                {/* Number */}
                <span className="mt-0.5 shrink-0 text-xs font-bold tracking-widest opacity-40">
                  {String(i + 1).padStart(2, '0')}
                </span>
                {/* Question */}
                <span className="flex-1 text-lg font-semibold leading-snug md:text-xl">
                  {item.question}
                </span>
                {/* Icon */}
                <span className="mt-1 shrink-0 text-xl transition-transform duration-300 ease-in-out"
                  style={{ transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)' }}>
                  +
                </span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="answer"
                    variants={answerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="overflow-hidden"
                  >
                    <div
                      className="prose prose-sm ml-12 pb-7 opacity-75"
                      dangerouslySetInnerHTML={{ __html: item.answer }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Style: SIMPLE — full-width, clean +/- toggle ────────────────────────────
function AccordionSimple({ items, sub_heading, heading, description }) {
  return (
    <div>
      {/* Header inline above */}
      {(sub_heading || heading || description) && (
        <div className="mb-10">
          <SectionHeader
            sub_heading={sub_heading}
            heading={heading}
            description={description}
          />
        </div>
      )}
      <AccordionList items={items} variant="simple" />
    </div>
  );
}

// ─── Shared AccordionList (used by left, right, simple) ──────────────────────
function AccordionList({ items, variant }) {
  const [openIndex, setOpenIndex] = useState(null);
  const toggle = (i) => setOpenIndex(openIndex === i ? null : i);

  // variant-specific item styling
  const itemBorder = variant === 'simple'
    ? 'border-b border-current/15 last:border-b-0'
    : 'border-b border-current/15 last:border-b-0';

  const questionClass = variant === 'simple'
    ? 'text-base font-medium md:text-lg'
    : 'text-base font-semibold md:text-lg';

  return (
    <div className="divide-y divide-current/10 border-t border-current/10">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={i} className={itemBorder}>
            <button
              onClick={() => toggle(i)}
              className="flex w-full items-center justify-between gap-4 py-5 text-left cursor-pointer"
              aria-expanded={isOpen}
            >
              <span className={questionClass}>{item.question}</span>
              {/* Animated +/- */}
              <span className="relative h-5 w-5 shrink-0">
                {/* horizontal bar — always visible */}
                <span
                  className="absolute left-0 top-1/2 h-[1.5px] w-full -translate-y-1/2 rounded-full bg-current transition-all duration-300"
                />
                {/* vertical bar — rotates away when open */}
                <span
                  className="absolute left-1/2 top-0 h-full w-[1.5px] -translate-x-1/2 rounded-full bg-current transition-all duration-300"
                  style={{
                    transform: isOpen
                      ? 'translateX(-50%) scaleY(0)'
                      : 'translateX(-50%) scaleY(1)',
                    opacity: isOpen ? 0 : 1,
                  }}
                />
              </span>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="answer"
                  variants={answerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="overflow-hidden"
                >
                  <div
                    className="prose prose-sm pb-5 opacity-75"
                    dangerouslySetInnerHTML={{ __html: item.answer }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

// ─── Main export — dispatches to the right style ─────────────────────────────
export default function AccordionSection({ data }) {
  if (!data) return null;

  const {
    background_color,
    sub_heading,
    heading,
    description,
    accordion = [],
    accordion_style = 'simple',
    custom_class,
    custom_id,
  } = data;

  if (!accordion.length) return null;

  const sharedProps = { items: accordion, sub_heading, heading, description };

  const renderStyle = () => {
    switch (accordion_style) {
      case 'left':    return <AccordionLeft    {...sharedProps} />;
      case 'right':   return <AccordionRight   {...sharedProps} />;
      case 'elegant': return <AccordionElegant {...sharedProps} />;
      case 'simple':
      default:        return <AccordionSimple  {...sharedProps} />;
    }
  };

  return (
    <section
      id={custom_id || undefined}
      className={`w-full px-6 py-16 md:py-24${custom_class ? ` ${custom_class}` : ''}`}
      style={background_color ? { backgroundColor: background_color } : {}}
    >
      <div className="web-width mx-auto">
        {renderStyle()}
      </div>
    </section>
  );
}
