"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};
const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.08 } },
};

export default function CaseIntroduction({ data }) {
  if (!data) return null;

  const { sub_heading, heading, client_name, services_offered, category, date, short_text } = data;
  const imgUrl = data?.section_image?.url || data?.section_image?.sizes?.large || null;

  const meta = [
    { label: "Client",    value: client_name,     html: false },
    { label: "Year",      value: date,             html: false },
    { label: "Industry",  value: category,         html: true  },
    { label: "Solutions", value: services_offered, html: true  },
  ].filter(m => m.value);

  return (
    <section className="web-width mx-auto px-6 py-20 md:py-32">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.25fr] gap-16 lg:gap-20 items-start">

        {/* ── Left column ── */}
        <motion.div
          initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
        >
          {/* Icon + sub heading */}
          {sub_heading && (
            <motion.div variants={fadeUp} className="flex items-center gap-2.5 mb-7">
              {/* Concentric-circle icon */}
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
                <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" className="text-(--color-accent)" />
                <circle cx="10" cy="10" r="4" stroke="currentColor" strokeWidth="1.5" className="text-(--color-accent)" />
                <circle cx="10" cy="10" r="1.5" fill="currentColor" className="text-(--color-accent)" />
              </svg>
              <span className="uppercase text-[11px] font-semibold tracking-[0.22em] text-gray-500">
                {sub_heading}
              </span>
            </motion.div>
          )}

          {/* Main heading */}
          {heading && (
            <motion.h2
              variants={fadeUp}
              className="text-3xl md:text-4xl font-bold text-(--color-dark)  leading-[1.08] mb-7"
              dangerouslySetInnerHTML={{ __html: heading }}
            />

            
          )}

          {/* Divider */}
          <motion.div variants={fadeUp} className="border-t border-gray-200 mb-0" />

          {/* Meta rows */}
          {meta.map((item, i) => (
            <motion.div
              key={i} variants={fadeUp}
              className="flex justify-between items-start gap-8 py-4 border-b border-gray-200"
            >
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-(--color-dark)  shrink-0 mt-0.5">
                {item.label}
              </span>
              {item.html ? (
                <div
                  className="text-sm text-gray-400 text-right leading-6 [&_br]:block [&_p]:m-0"
                  dangerouslySetInnerHTML={{ __html: item.value }}
                />
              ) : (
                <span className="text-sm text-gray-400 text-right">{item.value}</span>
              )}
            </motion.div>
          ))}

          {/* Body text */}
          {short_text && (
            <motion.div
              variants={fadeUp}
              className="mt-8 prose max-w-none text-gray-500 text-base leading-relaxed [&_p]:mb-4 [&_p:last-child]:mb-0"
              dangerouslySetInnerHTML={{ __html: short_text }}
            />
          )}
        </motion.div>

        {/* ── Right column — image ── */}
        {imgUrl ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full aspect-4/3 lg:aspect-[3/3.6] overflow-hidden rounded-sm"
          >
            <Image
              src={imgUrl}
              alt={data?.section_image?.alt || heading || ""}
              fill
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="object-cover"
            />
          </motion.div>
        ) : (
          /* Placeholder keeps the grid intact when no image */
          <div />
        )}
      </div>
    </section>
  );
}
