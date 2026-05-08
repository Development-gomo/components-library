'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

function PostCard({ post }) {
  return (
    <Link
      href={post.link}
      className="group block relative rounded-2xl overflow-hidden border border-white/10 shadow-md hover:shadow-xl transition-all duration-300"
    >
      <div className="relative h-[416px] bg-gray-200">
        {post.image ? (
          <Image
            src={post.image}
            alt={post.imageAlt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400" />
        )}

        {/* Category Badge */}
        <div className="absolute top-5 left-5 z-10">
          <span className="inline-block px-4 py-1.5 text-xs font-normal text-white bg-white/15 backdrop-blur-md rounded-full border border-white/20">
            {post.category}
          </span>
        </div>

        {/* Glass panel */}
        <div className="absolute bottom-0 left-0 right-0 h-[173px]">
          <div className="backdrop-blur-md bg-black/30 border-t border-white/15 h-full flex flex-col">
            <div className="px-6 pt-6 pb-6 flex-1 flex items-start">
              <h3 className="text-[1.1rem] font-light text-white leading-snug line-clamp-2">
                {post.title}
              </h3>
            </div>
            <div className="h-px bg-white/20" />
            <div className="flex items-stretch">
              <div className="flex items-center px-6 py-4 flex-1">
                <span className="text-sm font-light text-white/80">{post.date}</span>
              </div>
              <div className="w-px bg-white/20 self-stretch" />
              <div className="flex items-center px-6 py-4">
                <span className="inline-flex items-center gap-2 text-sm font-normal text-white group-hover:gap-3 transition-all whitespace-nowrap">
                  Read more
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 17L17 7M7 7h10v10" />
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function InsightsSlider({ posts, slider_settings }) {
  const slidesToShow = Math.min(3, Math.max(2, Number(slider_settings?.slides_to_show) || 3));
  const showArrows = slider_settings?.show_arrows !== false && slider_settings?.show_arrows !== '0';
  const showDots   = slider_settings?.show_dots   !== false && slider_settings?.show_dots   !== '0';

  const [activeIndex, setActiveIndex] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (!wrapperRef.current) return;
    const observer = new ResizeObserver(([entry]) => {
      setContainerWidth(entry.contentRect.width);
    });
    observer.observe(wrapperRef.current);
    setContainerWidth(wrapperRef.current.offsetWidth);
    return () => observer.disconnect();
  }, []);

  const total    = posts.length;
  const maxIndex = Math.max(0, total - slidesToShow);
  const GAP = 32;

  // Exact pixel width per card — no fractions, no peeking
  const cardWidth = containerWidth
    ? Math.floor((containerWidth - GAP * (slidesToShow - 1)) / slidesToShow)
    : 0;
  const stepWidth = cardWidth + GAP;

  const goTo = (index) => {
    setActiveIndex(Math.max(0, Math.min(index, maxIndex)));
  };

  return (
    <div className="relative px-2" ref={wrapperRef}>
      {/* Outer clip — exact width, no overflow */}
      <div className="overflow-hidden">
        {/* Sliding track */}
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            gap: `${GAP}px`,
            transform: `translateX(-${activeIndex * stepWidth}px)`,
          }}
        >
          {posts.map((post, idx) => (
            <div
              key={post.id || idx}
              style={{ minWidth: `${cardWidth}px`, maxWidth: `${cardWidth}px` }}
            >
              <PostCard post={post} />
            </div>
          ))}
        </div>
      </div>

      {/* Arrows */}
      {showArrows && (
        <>
          <button
            onClick={() => goTo(activeIndex - 1)}
            disabled={activeIndex === 0}
            className="absolute -left-6 top-[calc(50%-40px)] -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white shadow-md flex items-center justify-center disabled:opacity-20 hover:bg-gray-100 transition-colors"
            aria-label="Previous"
          >
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={() => goTo(activeIndex + 1)}
            disabled={activeIndex >= maxIndex}
            className="absolute -right-6 top-[calc(50%-40px)] -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white shadow-md flex items-center justify-center disabled:opacity-20 hover:bg-gray-100 transition-colors"
            aria-label="Next"
          >
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Dots */}
      {showDots && total > slidesToShow && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => goTo(idx)}
              className={`rounded-full transition-all duration-300 ${
                idx === activeIndex
                  ? 'w-6 h-2.5 bg-[#00A7E1]'
                  : 'w-2.5 h-2.5 bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}



