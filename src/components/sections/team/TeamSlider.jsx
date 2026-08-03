"use client";

// Layout: team_slider
// Not an ACF block on its own — this is the swiper sub-component TeamSection.jsx
// renders internally when display_type is "slider". It takes a plain `members`
// array (already parsed from the WP Team CPT), not the usual ACF `data` object.
// Fields: members[].id, members[].name, members[].position, members[].imgUrl, members[].imgAlt

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";

export default function TeamSlider({ members = [] }) {
  const swiperRef = useRef(null);
  const [prevEl, setPrevEl] = useState(null);
  const [nextEl, setNextEl] = useState(null);

  useEffect(() => {
    const swiper = swiperRef.current;
    if (!swiper || !prevEl || !nextEl) return;

    swiper.params.navigation.prevEl = prevEl;
    swiper.params.navigation.nextEl = nextEl;
    swiper.navigation.destroy();
    swiper.navigation.init();
    swiper.navigation.update();
  }, [prevEl, nextEl]);

  if (!members.length) return null;

  return (
    <div>
      {/* Top-right navigation arrows */}
      <div className="flex justify-end gap-3 mb-6">
        <button
          ref={setPrevEl}
          aria-label="Previous"
          className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 text-gray-600 hover:bg-(--color-accent) hover:border-[var(--color-accent)] hover:text-black transition-colors duration-200"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          ref={setNextEl}
          aria-label="Next"
          className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 text-gray-600 hover:bg-(--color-accent) hover:border-[var(--color-accent)] hover:text-black transition-colors duration-200"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <Swiper
        modules={[Navigation]}
        loop={true}
        navigation={{ disabledClass: "!opacity-100 !cursor-pointer" }}
        onSwiper={(instance) => {
          swiperRef.current = instance;
        }}
        spaceBetween={20}
        breakpoints={{
          0:    { slidesPerView: 1 },
          640:  { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
          1280: { slidesPerView: 4 },
        }}
      >
        {members.map((member) => (
          <SwiperSlide key={member.id} className="h-auto">
            <div className="group flex flex-col bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full">

              {/* Accent top bar */}
              <div className="h-1 w-full bg-(--color-accent)" />

              {/* Photo */}
              <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                {member.imgUrl ? (
                  <Image
                    src={member.imgUrl}
                    alt={member.imgAlt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                    <svg className="w-14 h-14 text-gray-400" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex flex-col px-5 py-4 gap-1 flex-1">
                {member.name && (
                  <p className="text-base font-semibold text-(--color-dark) leading-snug">
                    {member.name}
                  </p>
                )}
                <div className="w-8 h-0.5 bg-(--color-accent) my-1.5" />
                {member.position && (
                  <div
                    className="text-sm text-gray-500 leading-relaxed [&_p]:m-0"
                    dangerouslySetInnerHTML={{ __html: member.position }}
                  />
                )}
              </div>

            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
