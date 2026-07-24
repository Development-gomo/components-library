"use client";

// Layout: result_section (case-study template — mapped via PageBuilderCasestudy)
// ACF Fields:
//   sub_heading  (text)
//   heading      (wysiwyg)
//   counters     (repeater)
//     number           (text — animated count-up)
//     suffix           (text)
//     short_text       (wysiwyg)

import { useEffect, useRef } from "react";
import { motion, useInView, animate } from "framer-motion";

function CountUp({ value }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const raw = parseFloat(String(value).replace(/[^0-9.]/g, "")) || 0;

  useEffect(() => {
    if (!isInView || !ref.current) return;
    const controls = animate(0, raw, {
      duration: 2,
      ease: [0.16, 1, 0.3, 1],
      onUpdate(v) {
        if (ref.current) ref.current.textContent = Math.round(v).toLocaleString();
      },
    });
    return () => controls.stop();
  }, [isInView, raw]);

  return <span ref={ref}>0</span>;
}

const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
};
const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.1 } },
};

const SubIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
    <circle cx="10" cy="10" r="9" stroke="#00fec3" strokeWidth="1.5" />
    <circle cx="10" cy="10" r="4" stroke="#00fec3" strokeWidth="1.5" />
    <circle cx="10" cy="10" r="1.5" fill="#00fec3" />
  </svg>
);

export default function CaseResults({ data }) {
  if (!data) return null;

  const { sub_heading, heading, counters = [] } = data;

  return (
    <section className="bg-gray-50 overflow-hidden">
      <div className="web-width mx-auto px-6 py-20 md:py-32">

        {/* Section header */}
        <motion.div
          initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
          className="mb-16"
        >
          {sub_heading && (
            <motion.div variants={fadeUp} className="flex items-center gap-2.5 mb-6">
              <SubIcon />
              <span className="uppercase text-[11px] font-semibold tracking-[0.22em] text-gray-500">
                {sub_heading}
              </span>
            </motion.div>
          )}
          {heading && (
            <motion.div
              variants={fadeUp}
              className="text-3xl md:text-4xl font-bold text-(--color-dark)  leading-[1.08] max-w-3xl [&_strong]:text-(--color-accent) [&_em]:font-serif [&_em]:italic"
              dangerouslySetInnerHTML={{ __html: heading }}
            />
          )}
        </motion.div>

        {/* Counters */}
        {counters.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4">
            {counters.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="relative group py-10 px-8 border-t border-l border-gray-200 first:border-l-0 nth-2:border-l-0 lg:nth-2:border-l"
              >
                <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-(--color-accent) group-hover:w-full transition-all duration-500 ease-out" />

                <div className="flex items-baseline gap-1 mb-3">
                  <span className="text-5xl md:text-6xl font-bold text-(--color-dark)  leading-none tabular-nums">
                    <CountUp value={item.number || "0"} />
                  </span>
                  {item.suffix && (
                    <span className="text-3xl md:text-4xl font-bold text-(--color-accent) leading-none">
                      {item.suffix}
                    </span>
                  )}
                </div>

                {item.short_text && (
                  <div
                    className="text-sm text-gray-400 leading-snug [&_p]:m-0"
                    dangerouslySetInnerHTML={{ __html: item.short_text }}
                  />
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
