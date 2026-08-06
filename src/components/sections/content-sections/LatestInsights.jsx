// Layout: latest_insights
// Fields: background_color, section_title, title, description, display_mode, posts_per_page, category_filter, selected_posts, view_all_button (button_text, button_url), layout_style, pagination_type, load_more_button (button_text, load_count), slider_settings (slides_to_show, show_arrows, show_dots), custom_class, custom_id

import Image from "next/image";
import Link from "next/link";
import { fetchWP } from "@/lib/api";
import InsightsGrid from "./InsightsGrid";
import { transformPost } from "./insightsUtils";
import InsightsSlider from "./InsightsSlider";

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
    layout_style = "grid",
    pagination_type = "none",
    load_more_button,
    slider_settings,
    custom_class,
    custom_id,
  } = data;

  // Fetch posts based on display mode
  let posts = [];
  // For slider: fetch all available posts (up to 12) so all slides are ready client-side
  const fetchLimit = layout_style === "slider" ? 12 : posts_per_page;

  if (display_mode === "manual" && selected_posts?.length > 0) {
    posts = selected_posts.slice(0, fetchLimit);
  } else {
    let endpoint = `/wp/v2/posts?per_page=${fetchLimit}&_embed`;
    if (category_filter?.length > 0) {
      const categoryIds = Array.isArray(category_filter)
        ? category_filter.join(",")
        : category_filter;
      endpoint += `&categories=${categoryIds}`;
    }
    const fetchedPosts = await fetchWP(endpoint);
    posts = Array.isArray(fetchedPosts) ? fetchedPosts : [];
  }

  if (posts.length === 0) return null;

  // Transform raw WP posts into simple shape for client components
  const transformedPosts = posts.map(transformPost);

  // Category IDs string for load-more client fetching
  const categoryIds =
    category_filter?.length > 0
      ? Array.isArray(category_filter)
        ? category_filter.join(",")
        : category_filter
      : null;

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

        {/* Posts — Grid or Slider */}
        {layout_style === "slider" ? (
          <InsightsSlider
            posts={transformedPosts}
            slider_settings={slider_settings}
          />
        ) : (
          <InsightsGrid
            initialPosts={transformedPosts}
            pagination_type={pagination_type}
            load_more_button={load_more_button}
            loadMoreParams={{ categories: categoryIds }}
          />
        )}
      </div>
    </section>
  );
}
