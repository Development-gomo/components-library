import Image from "next/image";
import Link from "next/link";
import Header from "@/components/major/Header";
import Footer from "@/components/major/Footer";
import { resolveParams } from "@/lib/params";
import { getPostBySlug, getAllPosts } from "@/lib/api";
import { buildMetadataFromYoast } from "@/lib/seo";
import { transformPost } from "@/components/sections/content-sections/insightsUtils";
import { notFound } from "next/navigation";

export const revalidate = 60;

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return (Array.isArray(posts) ? posts : []).map((p) => ({ slug: p.slug }));
}

export default async function PostSinglePage({ params }) {
  const { slug } = resolveParams(await params);
  if (!slug) notFound();

  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const title       = post?.title?.rendered || "";
  const content     = post?.content?.rendered || "";
  const featuredImg = post?._embedded?.["wp:featuredmedia"]?.[0]?.source_url || null;
  const featuredAlt = post?._embedded?.["wp:featuredmedia"]?.[0]?.alt_text || title;
  const date        = post?.date
    ? new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : "";
  const category    = post?._embedded?.["wp:term"]?.[0]?.[0]?.name || null;
  const author      = post?._embedded?.author?.[0]?.name || null;
  const readTime    = content ? `${Math.max(1, Math.ceil(content.replace(/<[^>]+>/g, "").split(/\s+/).length / 200))} min read` : null;

  // Related posts — same category, exclude current
  const allPosts = await getAllPosts();
  const related = (Array.isArray(allPosts) ? allPosts : [])
    .filter((p) => p.id !== post.id)
    .slice(0, 3)
    .map(transformPost);

  return (
    <>
      <Header />

      <main>
        {/* ── Hero ─────────────────────────────────────────── */}
        <div className="w-full bg-[var(--color-dark)] pt-20 pb-0">
          <div className="web-width mx-auto px-6 pt-12 pb-0">

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              {category && (
                <span className="inline-block px-4 py-1 text-xs font-semibold tracking-widest uppercase bg-[var(--color-accent)] text-[var(--color-dark)] rounded-full">
                  {category}
                </span>
              )}
              {date && (
                <span className="text-sm text-white/50">{date}</span>
              )}
              {readTime && (
                <>
                  <span className="text-white/20">·</span>
                  <span className="text-sm text-white/50">{readTime}</span>
                </>
              )}
            </div>

            {/* Title */}
            <h1
              className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight max-w-4xl mb-8"
              dangerouslySetInnerHTML={{ __html: title }}
            />

            {/* Author */}
            {author && (
              <div className="flex items-center gap-3 mb-10">
                <div className="w-9 h-9 rounded-full bg-[var(--color-accent)] flex items-center justify-center text-[var(--color-dark)] font-bold text-sm flex-shrink-0">
                  {author.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm text-white/60">by <span className="text-white/90 font-medium">{author}</span></span>
              </div>
            )}
          </div>

          {/* Featured image — bleeds to edges, overlaps into content */}
          {featuredImg && (
            <div className="web-width mx-auto px-6">
              <div className="relative w-full h-[320px] md:h-[480px] rounded-t-2xl overflow-hidden">
                <Image
                  src={featuredImg}
                  alt={featuredAlt}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 1250px"
                  className="object-cover"
                />
              </div>
            </div>
          )}
        </div>

        {/* ── Content ──────────────────────────────────────── */}
        <div className="web-width mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 pt-12 pb-20">

            {/* Main article */}
            <article className="flex-1 min-w-0">
              <div
                className="prose prose-lg max-w-none
                  prose-headings:font-bold prose-headings:text-[var(--color-dark)]
                  prose-p:text-gray-600 prose-p:leading-relaxed
                  prose-a:text-[var(--color-dark)] prose-a:underline prose-a:decoration-[var(--color-accent)] prose-a:underline-offset-4
                  prose-img:rounded-xl prose-img:shadow-md
                  prose-blockquote:border-l-4 prose-blockquote:border-[var(--color-accent)] prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-gray-500
                  prose-strong:text-[var(--color-dark)]"
                dangerouslySetInnerHTML={{ __html: content }}
              />

              {/* Back link */}
              <div className="mt-14 pt-8 border-t border-gray-100">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-dark)] hover:text-[var(--color-accent)] transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to home
                </Link>
              </div>
            </article>

            {/* Sidebar */}
            <aside className="w-full lg:w-72 lg:flex-shrink-0 flex flex-col gap-8">

              {/* Share */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-4">Share</p>
                <div className="flex gap-3">
                  {[
                    { label: "LinkedIn", href: `https://linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`/post/${slug}`)}`, icon: <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z" /> },
                    { label: "Twitter", href: `https://x.com/intent/tweet?url=${encodeURIComponent(`/post/${slug}`)}&text=${encodeURIComponent(title.replace(/<[^>]+>/g, ""))}`, icon: <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" /> },
                    { label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`/post/${slug}`)}`, icon: <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" /> },
                  ].map(({ label, href, icon }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Share on ${label}`}
                      className="flex items-center justify-center w-10 h-10 rounded-full bg-white border border-gray-200 text-gray-500 hover:bg-[var(--color-accent)] hover:border-[var(--color-accent)] hover:text-black transition-colors duration-200"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                        {icon}
                      </svg>
                    </a>
                  ))}
                </div>
              </div>

              {/* Article info */}
              <div className="bg-gray-50 rounded-2xl p-6 flex flex-col gap-4">
                <p className="text-xs font-semibold tracking-widest uppercase text-gray-400">Article info</p>
                {date && (
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs text-gray-400">Published</span>
                    <span className="text-sm font-medium text-[var(--color-dark)]">{date}</span>
                  </div>
                )}
                {author && (
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs text-gray-400">Author</span>
                    <span className="text-sm font-medium text-[var(--color-dark)]">{author}</span>
                  </div>
                )}
                {readTime && (
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs text-gray-400">Read time</span>
                    <span className="text-sm font-medium text-[var(--color-dark)]">{readTime}</span>
                  </div>
                )}
                {category && (
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs text-gray-400">Category</span>
                    <span className="inline-block mt-1 px-3 py-1 text-xs font-semibold bg-[var(--color-accent)] text-[var(--color-dark)] rounded-full w-fit">
                      {category}
                    </span>
                  </div>
                )}
              </div>

            </aside>
          </div>
        </div>

        {/* ── Related posts ─────────────────────────────────── */}
        {related.length > 0 && (
          <div className="bg-gray-50 py-16 md:py-24">
            <div className="web-width mx-auto px-6">
              <p className="text-xs font-semibold tracking-widest uppercase text-[var(--color-accent)] mb-3">Keep reading</p>
              <h2 className="text-2xl md:text-4xl font-bold text-[var(--color-dark)] mb-10">Related articles</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {related.map((rp) => (
                  <Link
                    key={rp.id}
                    href={rp.link}
                    className="group block relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                  >
                    <div className="relative h-52 bg-gray-200">
                      {rp.image ? (
                        <Image
                          src={rp.image}
                          alt={rp.imageAlt}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400" />
                      )}
                      {rp.category && (
                        <span className="absolute top-4 left-4 px-3 py-1 text-xs font-medium text-white bg-white/20 backdrop-blur-md rounded-full border border-white/30">
                          {rp.category}
                        </span>
                      )}
                    </div>
                    {/* Glass footer */}
                    <div className="backdrop-blur-md bg-black/30 border-t border-white/15 px-5 py-4">
                      <h3 className="text-sm font-medium text-white leading-snug line-clamp-2 mb-2"
                        dangerouslySetInnerHTML={{ __html: rp.title }} />
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-white/60">{rp.date}</span>
                        <span className="text-xs text-[var(--color-accent)] group-hover:gap-2 flex items-center gap-1 transition-all">
                          Read more
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M7 7h10v10" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}

export async function generateMetadata({ params }) {
  const { slug } = resolveParams(await params);
  const post = await getPostBySlug(slug);
  return buildMetadataFromYoast(post, { fallbackTitle: slug });
}

