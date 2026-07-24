"use client";

// Layout: solution_section (case-study template — mapped via PageBuilderCasestudy)
// ACF Fields:
//   sub_heading       (text)
//   heading           (text)
//   solution_heading  (text)
//   short_text        (wysiwyg)
//   solution_image    (image)

import Image from "next/image";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
};
const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.12 } },
};

const SubIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
    <circle cx="10" cy="10" r="9" stroke="#00fec3" strokeWidth="1.5" />
    <circle cx="10" cy="10" r="4" stroke="#00fec3" strokeWidth="1.5" />
    <circle cx="10" cy="10" r="1.5" fill="#00fec3" />
  </svg>
);

export default function CaseSolution({ data }) {
  if (!data) return null;

  const { sub_heading, heading, solution_heading, short_text, solution_image } = data;
  const imgUrl = solution_image?.url || solution_image?.sizes?.large;

  return (
    <section className="overflow-hidden bg-white">
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
            <motion.h2
              variants={fadeUp}
              className="text-3xl md:text-4xl font-bold text-(--color-dark)  leading-[1.08] max-w-3xl"
              dangerouslySetInnerHTML={{ __html: heading }}
            />
          )}
        </motion.div>

        {/* Image left — text right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">

          {/* Image — horizontal wipe reveal */}
          {imgUrl && (
            <motion.div
              initial={{ clipPath: "inset(0 100% 0 0)" }}
              whileInView={{ clipPath: "inset(0 0% 0 0)" }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
              className="relative aspect-4/3 overflow-hidden rounded-sm order-2 lg:order-1"
            >
              <Image
                src={imgUrl}
                alt={solution_image?.alt || solution_heading || "Solution"}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-y-0 right-0 w-1 bg-(--color-accent)" />
            </motion.div>
          )}

          {/* Text block */}
          <motion.div
            initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="order-1 lg:order-2"
          >
            {solution_heading && (
              <motion.h3 variants={fadeUp} className="text-xl font-semibold text-(--color-dark)  mb-5">
                {solution_heading}
              </motion.h3>
            )}
            {short_text && (
              <motion.div
                variants={fadeUp}
                className="
                  prose max-w-none text-gray-500 text-base leading-relaxed
                  [&_p]:mb-5
                  [&_ul]:list-none [&_ul]:p-0
                  [&_li]:relative [&_li]:pl-5 [&_li]:mb-4
                  [&_li:before]:absolute [&_li:before]:left-0 [&_li:before]:top-2.5
                  [&_li:before]:content-[''] [&_li:before]:w-1.5 [&_li:before]:h-1.5
                  [&_li:before]:rounded-full [&_li:before]:bg-(--color-accent)
                  [&_strong]:text-(--color-dark)  [&_strong]:font-semibold
                "
                dangerouslySetInnerHTML={{ __html: short_text }}
              />
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
