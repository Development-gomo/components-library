import { readFile } from "fs/promises";
import path from "path";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { codeToHtml } from "shiki";
import { getComponentCatalog, getAllowedComponentSourcePaths } from "@/lib/componentCatalog";
import { groupSlug } from "@/lib/catalogSlug";
import { Badge } from "@/components/shadcn-ui/badge";
import { Button } from "@/components/shadcn-ui/button";
import LivePreview from "../../_shared/LivePreview";
import ComponentDetailTabs from "../../_shared/ComponentDetailTabs";

function langForPath(sourcePath) {
  if (sourcePath.endsWith(".tsx")) return "tsx";
  if (sourcePath.endsWith(".ts")) return "ts";
  return "jsx";
}

async function findItem(groupParam, idParam) {
  const groups = await getComponentCatalog();
  const group = groups.find((g) => groupSlug(g.title) === groupParam);
  const item = group?.items.find((i) => i.id === idParam);
  return { group, item };
}

export async function generateStaticParams() {
  const groups = await getComponentCatalog();
  return groups.flatMap((group) =>
    group.items.map((item) => ({ group: groupSlug(group.title), id: item.id }))
  );
}

export async function generateMetadata({ params }) {
  const { group: groupParam, id } = await params;
  const { item } = await findItem(groupParam, id);
  if (!item) return { title: "Component not found" };
  return {
    title: `${item.name} | Component Library`,
    description: item.purpose,
  };
}

export default async function ComponentDetailPage({ params }) {
  const { group: groupParam, id } = await params;
  const { group, item } = await findItem(groupParam, id);

  if (!group || !item) notFound();

  const allowedSourcePaths = await getAllowedComponentSourcePaths();
  if (!allowedSourcePaths.has(item.path)) notFound();

  const rawCode = await readFile(path.join(process.cwd(), item.path), "utf8");
  const codeHtml = await codeToHtml(rawCode, {
    lang: langForPath(item.path),
    theme: "github-dark",
  });

  return (
    <main className="px-6 py-10 md:px-10 md:py-14">
      <div className="mx-auto max-w-6xl">
        <Button variant="ghost" size="sm" asChild className="-ml-3 text-[#4f535c] hover:text-[#1d7c68]">
          <Link href="/components">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to components
          </Link>
        </Button>

        <p className="mt-6 text-sm font-semibold uppercase text-[#1d7c68]">{group.title}</p>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-semibold text-[#151515] md:text-4xl">{item.name}</h1>
          <Badge>{item.layout}</Badge>
        </div>
        <p className="mt-3 max-w-3xl text-base leading-7 text-[#4f535c]">{item.purpose}</p>

        <div className="mt-8">
          <ComponentDetailTabs
            preview={<LivePreview item={item} mode="full" />}
            codeHtml={codeHtml}
            rawCode={rawCode}
            sourcePath={item.path}
          />
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase text-[#5b5f67]">Fields</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {item.fields.map((field) => (
                <Badge key={field}>{field}</Badge>
              ))}
            </div>
          </div>

          {item.notes?.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase text-[#5b5f67]">Notes</p>
              <ul className="mt-2 space-y-1.5 text-sm leading-6 text-[#4f535c]">
                {item.notes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
