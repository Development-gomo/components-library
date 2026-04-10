import Header from "@/components/major/Header";
import Footer from "@/components/major/Footer";
import { resolveParams } from "@/lib/params";
import { getPostBySlug, getAllPosts } from "@/lib/api";
import { buildMetadataFromYoast } from "@/lib/seo";
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

  const title = post?.title?.rendered || "";
  const content = post?.content?.rendered || "";
  const featuredImg = post?._embedded?.["wp:featuredmedia"]?.[0]?.source_url;
  const date = post?.date ? new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "";

  return (
    <>
      <Header />
      <main className="web-width px-6 py-24 mx-auto">
        {featuredImg && (
          <img src={featuredImg} alt={title} className="w-full max-h-[500px] object-cover rounded-lg mb-10" />
        )}
        {date && <p className="text-sm text-gray-400 mb-4">{date}</p>}
        <h1 className="section-heading mb-8" dangerouslySetInnerHTML={{ __html: title }} />
        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: content }} />
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
