"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function CaseHero({ data }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY      = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const textY    = useTransform(scrollYProgress, [0, 0.6], ["0%", "15%"]);

  const bgImage    = data?.bg_image?.url || "";
  const heading    = data?.heading || "";
  const sub_heading = data?.sub_heading || "";
  const logo       = data?.logo?.url || "";

  return (
    <section ref={ref} className="relative w-full overflow-hidden min-h-screen flex flex-col justify-end">
      {/* Parallax background */}
      <motion.div className="absolute inset-0 -z-10 scale-[1.15]" style={{ y: bgY }}>
        {bgImage && (
          <Image src={bgImage} alt="Hero Background" fill sizes="100vw" className="object-cover" priority />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-dark)] via-[var(--color-dark)]/60 to-[var(--color-dark)]/10" />
      </motion.div>

      {/* Animated content */}
      <motion.div
        className="relative z-10 web-width mx-auto px-6 pb-20 pt-40"
        style={{ opacity: textOpacity, y: textY }}
      >
        <div className="flex flex-col md:flex-row items-end justify-between gap-12">
          <div className="max-w-[900px]">
            {sub_heading && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
                className="uppercase subheading-label text-[var(--color-accent)] mb-6 tracking-widest"
                dangerouslySetInnerHTML={{ __html: sub_heading }}
              />
            )}

            <motion.h1
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-2xl  text-white "
              dangerouslySetInnerHTML={{ __html: heading }}
            />
          </div>

          {logo && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="shrink-0 bg-white/10 backdrop-blur-2xl border border-white/15 px-6 py-5 rounded-sm"
            >
              <Image src={logo} alt="Client Logo" width={160} height={80} className="object-contain" />
            </motion.div>
          )}
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="flex items-center gap-4 mt-16"
        >
          <div className="relative h-14 w-px overflow-hidden bg-white/15">
            <motion.div
              className="absolute top-0 left-0 w-full bg-[var(--color-accent)]"
              animate={{ y: ["-100%", "200%"] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
              style={{ height: "50%" }}
            />
          </div>
          <span className="text-white/40 text-[11px] uppercase tracking-[0.25em]">Scroll to explore</span>
        </motion.div>
      </motion.div>
    </section>
  );
}
