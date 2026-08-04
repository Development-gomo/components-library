"use client";

// Layout: hero_with_slider
// ACF Fields:
//   bg_image          (image)
//   bg_video          (file)
//   heading           (text — supports inline <em> tags)
//   short_heading     (wysiwyg)
//   client_slider     (repeater)
//     logo                  (image)
//     statistics            (text)
//     testimonial           (textarea)
//     client_name           (text)

import Image from "next/image";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import DownArrow from "../../../../public/hero-down-arrow.png";
import { motion } from "framer-motion";

export default function HeroClientslider({ data }) {
  const bgImage = data?.bg_image?.url || "";
  const bgVideo = data?.bg_video?.url || "";

  const heading = data?.heading || "";
  const shortHeading = data?.short_heading || "";
  const clientSlider = data?.client_slider || [];

  const statsSlides = clientSlider.filter(
    (item) => item.logo || item.statistics
  );
  const testimonialSlides = clientSlider.filter((item) => item.testimonial);

  const [activeIndex, setActiveIndex] = React.useState(0);

  const logoSwiperRef = React.useRef(null);
  const testiSwiperRef = React.useRef(null);

  // ✔ SYNC TESTIMONIAL + LOGO HIGHLIGHT EVERY 3s
  React.useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1 >= statsSlides.length ? 0 : prev + 1));
      testiSwiperRef.current?.slideToLoop(activeIndex);
    }, 3000);

    return () => clearInterval(interval);
  }, [activeIndex, statsSlides.length]);

  return (
    <section className="relative w-full mb-20 overflow-hidden hero">
      {/* BG IMAGE/VIDEO */}
      <div className="absolute inset-0 -z-10">
        {bgVideo ? (
          <video
            src={bgVideo}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        ) : bgImage ? (
          <Image
            src={bgImage}
            alt=""
            fill
            priority
            className="object-cover object-top"
          />
        ) : null}
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/0 to-black/0 -z-10"></div>

      {/* HERO TEXT */}
      <div className="relative min-h-screen web-width px-6 lg:px-50 py-24 lg:py-36 h-full flex flex-col items-start justify-center lg:justify-start mobile-height">
        <div className=""> 
          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-8xl font-light text-white"
            dangerouslySetInnerHTML={{
              __html: heading.replace(/<em>(.*?)<\/em>/g, `<em>$1</em>`),
            }}
          />
        </div>
        <div className="lg:m-auto lg:absolute right-[22%] top-[360px]">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="body-text max-w-[360px] mt-4 text-white"
            dangerouslySetInnerHTML={{ __html: shortHeading }}
          />
          {/* Scroll Button */}
          <motion.a
            onClick={(e) => {
              e.preventDefault();
              document
                .querySelector("#next")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-5 w-12 h-12 rounded-full bg-(--color-accent) translate-y-0 transition-all duration-300
                flex items-center justify-center shadow-md hover:translate-y-1.5 cursor-pointer"
          >
            <Image src={DownArrow} alt="arrow" width={13} height={13} />
          </motion.a>
        </div>
      </div>

      {/* CLIENT LOGOS + TESTIMONIAL */}
      <div className="absolute bottom-0 w-full bg-(--color-brand) py-5 md:py-9 px-6">
        <div className="web-width mx-auto md:flex items-center gap-6 hidden">
          {/* LEFT — LOGO TICKER */}
          <div className="md:max-w-[70%] ticker-wrapper">
            <Swiper
              modules={[Autoplay]}
              onSwiper={(swiper) => { logoSwiperRef.current = swiper; }}
              autoplay={{
                delay: 2500, // REQUIRED
                reverseDirection: true, // Slide LEFT → RIGHT
                disableOnInteraction: false,
              }}
              loop={true}
              allowTouchMove={false}
              speed={800}
              slidesPerView={4}
              spaceBetween={30}
              initialSlide={2}
              breakpoints={{
                320: { slidesPerView: 1 },
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
                1280: { slidesPerView: 4 },
              }}
            >
              {statsSlides.map((item, index) => {
                const isActive = index === activeIndex;

                return (
                  <SwiperSlide key={index}>
                    <div
                      className={`flex flex-col items-center transition-all`}
                    >
                      {/* Logo */}
                      {item.logo?.url && (
                        <Image
                          src={item.logo.url}
                          alt="client logo"
                          width={90}
                          height={38}
                          className="object-contain"
                        />
                      )}

                      {/* Show statistics ONLY for active logo */}
                      {item.statistics && (
                        <p className="caption-text mt-3 text-white">
                          {item.statistics}
                        </p>
                      )}
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>

          {/* RIGHT — VERTICAL TESTIMONIAL SLIDER */}
          <div className="md:max-w-[30%] h-20 overflow-hidden">
            <Swiper
              modules={[Autoplay]}
              direction={"vertical"}
              onSwiper={(swiper) => { testiSwiperRef.current = swiper; }}
              autoplay={{
                delay: 2500, // REQUIRED
                reverseDirection: true,
                disableOnInteraction: false,
              }}
              loop={true}
              allowTouchMove={false}
              speed={800}
              className="h-full"
            >
              {testimonialSlides.map((item, index) => (
                <SwiperSlide key={index}>
                  <div className="text-white caption-text max-w-[320px] mx-auto">
                    <p className="">{item.testimonial}</p>
                    <p className="mt-2 font-semibold">{item.client_name}</p>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
        <div className="px-6 md:hidden">
          <Swiper
            modules={[Autoplay]}
            autoplay={{
              delay: 2500, // REQUIRED
              reverseDirection: true, // Slide LEFT → RIGHT
              disableOnInteraction: false,
            }}
            loop={true}
            allowTouchMove={true}
            speed={800}
            slidesPerView={1}
            spaceBetween={30}
            onSlideChange={(swiper) => {
              setActiveIndex(swiper.realIndex);
              testiSwiperRef.current?.slideToLoop(swiper.realIndex);
            }}
          >
            {statsSlides.map((item, index) => {
              const isActive = index === activeIndex;

              return (
                <SwiperSlide key={index}>
                  <div className={`flex flex-col items-center transition-all`}>
                    {/* Logo */}
                    {item.logo?.url && (
                      <Image
                        src={item.logo.url}
                        alt="client logo"
                        width={90}
                        height={38}
                        className="object-contain"
                      />
                    )}

                    {/* Show statistics ONLY for active logo */}
                    {item.statistics && (
                      <p className="caption-text mt-3 text-white">
                        {item.statistics}
                      </p>
                    )}
                    <div className="text-white text-center">
                      <p className="mt-2 opacity-90">{item.testimonial}</p>
                      <p className="mt-2 font-semibold">{item.client_name}</p>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
