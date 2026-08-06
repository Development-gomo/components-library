'use client';

// Layout: insights_grid
// Not an ACF block on its own — the grid-layout sub-component LatestInsights.jsx
// renders internally when layout_style is "grid". Takes already-transformed post
// objects (see insightsUtils.js's transformPost), not the usual ACF `data` object.
// Fields: initialPosts, pagination_type, load_more_button, loadMoreParams

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { transformPost } from './insightsUtils';

// PostCard — shared card UI
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

export default function InsightsGrid({
  initialPosts,
  pagination_type,
  load_more_button,
  loadMoreParams, // { loadCount, categories }
}) {
  const [posts, setPosts] = useState(initialPosts);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadCount = load_more_button?.load_count || 3;
  const buttonText = load_more_button?.button_text || 'Load more';

  const handleLoadMore = async () => {
    setLoading(true);
    try {
      let url = `/api/posts?per_page=${loadCount}&offset=${posts.length}`;
      if (loadMoreParams?.categories) {
        url += `&categories=${loadMoreParams.categories}`;
      }

      const res = await fetch(url);
      if (!res.ok) throw new Error('fetch failed');

      const raw = await res.json();
      if (!Array.isArray(raw) || raw.length === 0) {
        setHasMore(false);
      } else {
        const newPosts = raw.map(transformPost);
        setPosts((prev) => [...prev, ...newPosts]);
        if (raw.length < loadCount) setHasMore(false);
      }
    } catch {
      setHasMore(false);
    }
    setLoading(false);
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post, idx) => (
          <PostCard key={post.id || idx} post={post} />
        ))}
      </div>

      {pagination_type === 'load_more' && hasMore && (
        <div className="flex justify-center mt-12">
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="inline-flex items-center gap-3 px-8 py-3 rounded-md bg-[#00A7E1] text-white font-medium hover:bg-[#0086B3] disabled:opacity-50 transition-colors"
          >
            {loading ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Loading...
              </>
            ) : (
              buttonText
            )}
          </button>
        </div>
      )}
    </div>
  );
}


