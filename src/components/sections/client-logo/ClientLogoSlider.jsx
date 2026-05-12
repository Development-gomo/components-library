"use client";

import { useRef } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

export default function ClientLogoSlider({ logos = [] }) {
  const swiperRef = useRef(null);

  if (!logos.length) return null;

  return (
    <div>
      <div className="flex justify-end gap-3 mb-6">
        <button
          aria-label="Previous"
          onClick={() => swiperRef.current?.slidePrev()}
          className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 text-gray-600 hover:bg-[var(--color-accent)] hover:border-[var(--color-accent)] hover:text-black transition-colors duration-200 cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          aria-label="Next"
          onClick={() => swiperRef.current?.slideNext()}
          className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 text-gray-600 hover:bg-[var(--color-accent)] hover:border-[var(--color-accent)] hover:text-black transition-colors duration-200 cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <Swiper
        loop={true}
        onSwiper={(instance) => { swiperRef.current = instance; }}
        spaceBetween={16}
        breakpoints={{
          0:    { slidesPerView: 2 },
          640:  { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
          1280: { slidesPerView: 5 },
        }}
      >
        {logos.map((logo, i) => (
          <SwiperSlide key={i}>
            <div className="border border-gray-200 rounded-xl h-24 flex items-center justify-center px-6 bg-white">
              <Image
                src={logo.url}
                alt={logo.alt}
                width={140}
                height={40}
                className="object-contain opacity-60 hover:opacity-100 transition-opacity duration-300"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
