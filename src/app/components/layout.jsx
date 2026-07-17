import { Inter } from "next/font/google";
import BodyClass from "@/components/BodyClass";
import CatalogSidebar from "./_shared/CatalogSidebar";
import { getComponentCatalog } from "@/lib/componentCatalog";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export default async function ComponentsLayout({ children }) {
  const groups = await getComponentCatalog();

  return (
    <>
      <BodyClass className="components-library-page" />
      <div className={`${inter.variable} min-h-screen bg-[#f7f7f2] text-[#151515] font-(family-name:--font-inter) lg:flex`}>
        <aside className="border-b border-black/10 bg-[#fbfcf7] lg:sticky lg:top-0 lg:h-screen lg:w-72 lg:shrink-0 lg:border-b-0 lg:border-r">
          <CatalogSidebar groups={groups} />
        </aside>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </>
  );
}
