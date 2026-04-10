import Header from "@/components/major/Header";
import PageBuilder from "@/components/major/PageBuilder";
import Footer from "@/components/major/Footer";
import { getPageBySlug } from "@/lib/api";
import { buildMetadataFromYoast } from "@/lib/seo";
import { notFound } from "next/navigation";

export const revalidate = 60;

async function getPage() {
  return getPageBySlug("frontpage");
} 

export async function generateMetadata() {
  const page = await getPage();
  return buildMetadataFromYoast(page, { fallbackTitle: "Home" });
}

export default async function HomePage() {
  const page = await getPage();
  if (!page) notFound();

  return (
    <>
      <Header />
      <main id="home">
        <PageBuilder sections={page?.acf?.page_builder} />
      </main>
      <Footer />
    </>
  );
}
