// Layout: latest_insights
// Fields: background_color, section_title, title, description, display_mode, posts_per_page, category_filter, selected_posts, view_all_button (button_text, button_url), custom_class, custom_id

import Image from "next/image";
import Link from "next/link";
import { fetchWP } from "@/lib/api";

export default async function LatestInsights({ data }) {
  if (!data) return null;

  const {
    background_color,
    section_title,
    title,
    description,
    display_mode = "automatic",
    posts_per_page = 3,
    category_filter,
    selected_posts,
    view_all_button,
    custom_class,
    custom_id,
  } = data;

  // Fetch posts based on display mode
  let posts = [];
  
  if (display_mode === "manual" && selected_posts?.length > 0) {
    // Manual mode: use selected posts
    posts = selected_posts.slice(0, posts_per_page);
  } else {
    // Automatic mode: fetch latest posts
    let endpoint = `/wp/v2/posts?per_page=${posts_per_page}&_embed`;
    
    // Add category filter if specified
    if (category_filter?.length > 0) {
      const categoryIds = Array.isArray(category_filter) 
        ? category_filter.join(',') 
        : category_filter;
      endpoint += `&categories=${categoryIds}`;
    }
    
    const fetchedPosts = await fetchWP(endpoint);
    posts = Array.isArray(fetchedPosts) ? fetchedPosts : [];
  }

  if (posts.length === 0) return null;

  // Helper to get featured image
  const getFeaturedImage = (post) => {
    return post?.featured_image_url || 
           post?._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
           post?._embedded?.["wp:featuredmedia"]?.[0]?.media_details?.sizes?.large?.source_url ||
           null;
  };

  // Helper to get category
  const getCategory = (post) => {
    return post?._embedded?.["wp:term"]?.[0]?.[0]?.name || "Article";
  };

  // Helper to format date
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { 
      year: "numeric", 
      month: "long", 
      day: "numeric" 
    });
  };

  return (
    <section
      id={custom_id || undefined}
      className={`w-full px-6 py-16 md:py-24${custom_class ? ` ${custom_class}` : ""}`}
      style={background_color ? { backgroundColor: background_color } : {}}
    >
      <div className="web-width mx-auto">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          {section_title && (
            <p className="text-sm font-medium tracking-wider uppercase text-gray-600 mb-4">
              {section_title}
            </p>
          )}
          
          {title && (
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              {title}
            </h2>
          )}

          {description && (
            <div
              className="text-lg text-gray-600 max-w-3xl mx-auto mb-6"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          )}

          {view_all_button?.button_text && (
            <Link
              href={view_all_button.button_url || '#'}
              className="inline-flex items-center gap-2 text-base font-medium text-gray-800 hover:text-gray-600 transition-colors underline"
            >
              {view_all_button.button_text}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 17L17 7M7 7h10v10" />
              </svg>
            </Link>
          )}
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, idx) => {
            const featuredImg = getFeaturedImage(post);
            const category = getCategory(post);
            const postDate = formatDate(post.date);
            const postLink = post.link || `/post/${post.slug}`;
            const postTitle = post.title?.rendered || post.post_title || post.title;
            
            return (
              <Link
                key={post.id || idx}
                href={postLink}
                className="group block relative rounded-2xl overflow-hidden border border-white/10 shadow-md hover:shadow-xl transition-all duration-300"
              >
                {/* Featured Image */}
                <div className="relative h-[416px] bg-gray-200">
                  {featuredImg ? (
                    <Image
                      src={featuredImg}
                      alt={post.title?.rendered || ""}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400" />
                  )}

                  {/* Category Badge — frosted glass pill */}
                  <div className="absolute top-5 left-5 z-10">
                    <span className="inline-block px-4 py-1.5 text-xs font-normal text-white bg-white/15 backdrop-blur-md rounded-full border border-white/20">
                      {category}
                    </span>
                  </div>

                  {/* Glass content block at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 h-[173px]">
                    {/* Blur + dark tint layer */}
                    <div className="backdrop-blur-md bg-black/30 border-t border-white/15 h-full flex flex-col">
                      {/* Title area — 24px padding all sides */}
                      <div className="px-6 pt-6 pb-6 flex-1 flex items-start">
                        <h3 className="text-[1.1rem] font-light text-white leading-snug line-clamp-2">
                          {postTitle}
                        </h3>
                      </div>

                      {/* Horizontal divider */}
                      <div className="h-px bg-white/20" />

                      {/* Meta row — date | vertical divider | read more */}
                      <div className="flex items-stretch">
                        {/* Date */}
                        <div className="flex items-center px-6 py-4 flex-1">
                          <span className="text-sm font-light text-white/80">{postDate}</span>
                        </div>

                        {/* Vertical divider */}
                        <div className="w-px bg-white/20 self-stretch" />

                        {/* Read more */}
                        <div className="flex items-center px-6 py-4">
                          <span className="inline-flex items-center gap-2 text-sm font-normal text-white group-hover:gap-3 transition-all whitespace-nowrap">
                            Read more
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
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
          })}
        </div>
      </div>
    </section>
  );
}
