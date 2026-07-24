import { getComponentCatalog } from "@/lib/componentCatalog";
import { groupSlug } from "@/lib/catalogSlug";
import { sampleDataByLayout } from "@/lib/componentSampleData";
import { Badge } from "@/components/shadcn-ui/badge";
import LivePreview from "./_shared/LivePreview";
import CardLink from "./_shared/CardLink";

export const metadata = {
  title: "Components | Components Library",
  description: "Browse and preview every reusable page-builder component in this project.",
};

function ComponentCard({ item, gSlug }) {
  return (
    <CardLink
      href={`/components/${gSlug}/${item.id}`}
      className="group block cursor-pointer overflow-hidden rounded-md border border-black/10 bg-white shadow-[0_1px_0_rgba(0,0,0,0.04)] transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-[#eef1ea]">
        <LivePreview item={item} mode="card" />
      </div>
      <div className="flex items-center justify-between gap-2 border-t border-black/10 p-4">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-[#151515]">{item.name}</h3>
        </div>
        <span className="shrink-0 text-xs font-semibold text-[#1d7c68] opacity-0 transition-opacity group-hover:opacity-100">
          View →
        </span>
      </div>
    </CardLink>
  );
}

export default async function ComponentsPage() {
  const groups = await getComponentCatalog();
  const allComponents = groups.flatMap((group) => group.items);
  const liveCount = allComponents.filter((item) => item.layout in sampleDataByLayout).length;

  const stats = [
    { value: String(allComponents.length), label: "documented components" },
    { value: String(groups.length), label: "component groups" },
    { value: String(liveCount), label: "with live preview" },
    { value: "auto", label: "catalog updates" },
  ];

  return (
    <main className="min-h-screen bg-[#f7f7f2] text-[#151515]">
      <section className="border-b border-black/10 bg-[#111316] text-white">
        <div className="px-6 py-14 md:px-10 md:py-16">
          <p className="mb-3 text-sm font-semibold uppercase text-[var(--color-accent)]">Component Library</p>
          <h1 className="max-w-3xl text-3xl font-semibold leading-tight md:text-5xl">
            Browse, preview, and copy every component in the library.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-white/70">
            Pick a component from the sidebar or the grid below to see a live preview,
            copy its source code, and check the CMS fields it expects.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:max-w-xl sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-md border border-white/12 bg-white/6 p-4">
                <p className="text-2xl font-semibold text-[var(--color-accent)]">{stat.value}</p>
                <p className="mt-1 text-xs text-white/62">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {groups.map((group) => {
        const gSlug = groupSlug(group.title);
        return (
          <section key={group.title} id={gSlug} className="scroll-mt-6 border-b border-black/10">
            <div className="px-6 py-10 md:px-10 md:py-12">
              <div className="mb-6 max-w-3xl">
                <p className="text-sm font-semibold uppercase text-[#1d7c68]">{group.title}</p>
                <h2 className="mt-2 text-2xl font-semibold leading-tight">{group.description}</h2>
              </div>

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {group.items.map((item) => (
                  <ComponentCard key={item.id} item={item} gSlug={gSlug} />
                ))}
              </div>
            </div>
          </section>
        );
      })}
    </main>
  );
}
