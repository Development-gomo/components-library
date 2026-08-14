// Shared utility — no 'use client', safe to import from server and client components

export function transformPost(post) {
  return {
    id: post.id,
    title: post.title?.rendered || post.post_title || '',
    date: formatDate(post.date),
    link: `/insights/${post.slug}`,
    category: post?._embedded?.['wp:term']?.[0]?.[0]?.name || 'Article',
    image:
      post?.featured_image_url ||
      post?._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
      post?._embedded?.['wp:featuredmedia']?.[0]?.media_details?.sizes?.large?.source_url ||
      null,
    imageAlt:
      post?._embedded?.['wp:featuredmedia']?.[0]?.alt_text ||
      post.title?.rendered ||
      '',
  };
}

function formatDate(dateString) {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
