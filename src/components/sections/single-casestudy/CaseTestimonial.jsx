"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const SubIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
    <circle cx="10" cy="10" r="9" stroke="#00fec3" strokeWidth="1.5" />
    <circle cx="10" cy="10" r="4" stroke="#00fec3" strokeWidth="1.5" />
    <circle cx="10" cy="10" r="1.5" fill="#00fec3" />
  </svg>
);

export default function CaseTestimonial({ data }) {
  if (!data) return null;

  const { bg_image, heading, testimonial, name, person_organization } = data;
  const imgUrl = bg_image?.url || bg_image?.sizes?.large;

  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["8%", "-8%"]);

  return (
    <section ref={ref} className="relative overflow-hidden bg-(--color-dark)">
      {/* Parallax background */}
      {imgUrl && (
        <motion.div className="absolute inset-0 scale-110" style={{ y: bgY }}>
          <Image src={imgUrl} alt="" fill sizes="100vw" className="object-cover opacity-10" />
        </motion.div>
      )}

      {/* Grid texture */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(#00fec3 1px, transparent 1px), linear-gradient(90deg, #00fec3 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* Decorative quote mark */}
      <div
        className="absolute -top-10 left-1/2 -translate-x-1/2 text-[22rem] leading-none text-white/[0.03] font-serif select-none pointer-events-none"
        aria-hidden
      >
        &ldquo;
      </div>

      <div className="relative z-10 web-width mx-auto px-6 py-24 md:py-40">
        {/* Sub heading */}
        {heading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-2.5 mb-10"
          >
            <SubIcon />
            <span className="uppercase text-[11px] font-semibold tracking-[0.22em] text-white/50">
              {heading}
            </span>
          </motion.div>
        )}

        {testimonial && (
          <motion.blockquote
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-2xl md:text-[2.2rem] font-bold text-white leading-[1.45] max-w-4xl mb-16"
            dangerouslySetInnerHTML={{ __html: testimonial }}
          />
        )}

        {(name || person_organization) && (
          <motion.footer
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-5"
          >
            <div className="w-12 h-px bg-(--color-accent)" />
            <div>
              {name && (
                <span className="text-white font-semibold block tracking-wide">{name}</span>
              )}
              {person_organization && (
                <span className="text-white/40 text-sm">{person_organization}</span>
              )}
            </div>
          </motion.footer>
        )}
      </div>
    </section>
  );
}
