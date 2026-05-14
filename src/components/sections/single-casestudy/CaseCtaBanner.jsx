"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
};
const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.15 } },
};

const SubIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
    <circle cx="10" cy="10" r="9" stroke="#00fec3" strokeWidth="1.5" />
    <circle cx="10" cy="10" r="4" stroke="#00fec3" strokeWidth="1.5" />
    <circle cx="10" cy="10" r="1.5" fill="#00fec3" />
  </svg>
);

export default function CaseCtaBanner({ data }) {
  if (!data) return null;

  const { heading, short_text, cta_text, cta_url } = data;

  return (
    <section className="bg-(--color-dark) relative overflow-hidden">
      {/* Grid texture */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(#00fec3 1px, transparent 1px), linear-gradient(90deg, #00fec3 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Accent glow blob */}
      <div className="absolute -bottom-40 -right-40 w-125 h-125 rounded-full bg-(--color-accent) opacity-[0.06] blur-3xl pointer-events-none" />

      <motion.div
        initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }}
        variants={stagger}
        className="relative z-10 web-width mx-auto px-6 py-24 md:py-36 flex flex-col md:flex-row items-start md:items-end justify-between gap-14"
      >
        <div className="max-w-2xl">
          {heading && (
            <>
              <motion.div variants={fadeUp} className="flex items-center gap-2.5 mb-6">
                <SubIcon />
                <span className="uppercase text-[11px] font-semibold tracking-[0.22em] text-white/50">
                  Let&apos;s work together
                </span>
              </motion.div>
              <motion.h2
                variants={fadeUp}
                className="text-3xl md:text-4xl font-bold text-white leading-[1.08] mb-5"
                dangerouslySetInnerHTML={{ __html: heading }}
              />
            </>
          )}
          {short_text && (
            <motion.p variants={fadeUp} className="text-white/50 text-base leading-relaxed">
              {short_text}
            </motion.p>
          )}
        </div>

        {cta_text && cta_url && (
          <motion.div variants={fadeUp} className="shrink-0">
            <Link
              href={cta_url}
              className="group relative inline-flex items-center gap-3 bg-(--color-accent) text-(--color-dark)  px-8 py-5 font-semibold rounded-sm overflow-hidden hover:gap-5 transition-all duration-300"
            >
              <span className="relative z-10">{cta_text}</span>
              <span className="relative z-10 group-hover:translate-x-1 transition-transform duration-300">→</span>
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
            </Link>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
