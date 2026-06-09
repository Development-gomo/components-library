import Image from "next/image";
import BodyClass from "@/components/BodyClass";
import SourceCodeViewer from "./SourceCodeViewer";
import { getComponentCatalog } from "@/lib/componentCatalog";

export const metadata = {
  title: "Components | Components Library",
  description: "Reference page for the page-builder components available in this project.",
};

const workflow = [
  {
    title: "Choose a component",
    description: "Pick the section from this catalog and copy its layout key, for example centered_hero or feature_grid.",
  },
  {
    title: "Create the CMS block",
    description: "In WordPress ACF flexible content, create or select a layout with the exact same acf_fc_layout key.",
  },
  {
    title: "Add the required fields",
    description: "Match the field names shown on the card. The React component reads data from the block object passed as data.",
  },
  {
    title: "Render through PageBuilder",
    description: "PageBuilder checks block.acf_fc_layout and returns the matching component with data={block}.",
  },
];

const implementationGuides = [
  {
    title: "Minimum block data",
    points: [
      "Every block must include acf_fc_layout.",
      "Field names must match the component exactly.",
      "Image fields should return an object with url, alt, and sizes when possible.",
      "Repeater fields should return arrays, even when only one item is added.",
    ],
  },
  {
    title: "Where things live",
    points: [
      "Component source files live under src/components.",
      "The central render switch is src/components/major/PageBuilder.jsx.",
      "Preview images live under public/component-previews.",
      "This documentation page lives at src/app/components/page.jsx.",
    ],
  },
  {
    title: "When adding a new component",
    points: [
      "Create the React component file first.",
      "Import it dynamically in PageBuilder.",
      "Add a new case for the layout key.",
      "Add top-of-file Layout and Fields comments for better auto-generated documentation.",
      "Add a matching preview image under public/component-previews if you do not want the fallback graphic.",
    ],
  },
  {
    title: "Before handoff",
    points: [
      "Check the component with real CMS data.",
      "Confirm empty fields do not break the UI.",
      "Verify mobile and desktop spacing.",
      "Run targeted lint for changed files.",
      "Open the source-code popup from this page to confirm backend code loading.",
    ],
  },
];

const dataShapeExample = `{
  acf_fc_layout: "centered_hero",
  hero_title: "Build better pages",
  hero_description: "<p>Short supporting copy.</p>",
  button_row: [
    {
      button_label: "Get started",
      button_link: "/contact"
    }
  ],
  background_image: {
    url: "https://example.com/image.jpg",
    alt: "Hero background"
  }
}`;

function Pill({ children }) {
  return (
    <span className="inline-flex rounded-sm border border-black/10 bg-white px-2.5 py-1 text-xs text-[#2b2b2b]">
      {children}
    </span>
  );
}

function getPreviewFileName(layout) {
  return String(layout).replace(/[^a-z0-9_-]+/gi, "-").replace(/^-|-$/g, "");
}

function ComponentPreview({ item }) {
  const previewSrc = item.preview || item.screenshot || `/component-previews/${getPreviewFileName(item.layout)}.svg`;

  return (
    <Image
      src={previewSrc}
      alt={`${item.name} UI preview`}
      fill
      sizes="(min-width: 1024px) 320px, 100vw"
      className="object-cover"
    />
  );
}

function ComponentRow({ item }) {
  return (
    <article className="rounded-md border border-black/10 bg-white p-5 shadow-[0_1px_0_rgba(0,0,0,0.04)]">
      <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
        <div>
          <div className="relative aspect-[16/10] overflow-hidden rounded-md border border-black/10 bg-[#eef1ea]">
            <ComponentPreview item={item} />
          </div>
          <p className="mt-2 text-xs leading-5 text-[#6a6f78]">
            Screenshot slot: <code className="rounded-sm bg-[#f4f5f0] px-1 py-0.5">public/component-previews/{getPreviewFileName(item.layout)}.svg</code>
          </p>
        </div>

        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-xl font-semibold text-[#151515]">{item.name}</h3>
            <Pill>{item.layout}</Pill>
          </div>
          <p className="mt-2 text-sm leading-6 text-[#4f535c]">{item.purpose}</p>
          <SourceCodeViewer sourcePath={item.path} />
        </div>

        <div className="w-full shrink-0 lg:w-[44%]">
          <p className="text-xs font-semibold uppercase text-[#5b5f67]">Fields</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {item.fields.map((field) => (
              <Pill key={field}>{field}</Pill>
            ))}
          </div>

          {item.notes?.length > 0 && (
            <>
              <p className="mt-4 text-xs font-semibold uppercase text-[#5b5f67]">Notes</p>
              <ul className="mt-2 space-y-1.5 text-sm leading-6 text-[#4f535c]">
                {item.notes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </>
          )}
        </div>
        </div>
      </div>
    </article>
  );
}

function UsageGuideSection() {
  return (
    <section className="border-b border-black/10 bg-white">
      <div className="web-width px-6 py-12 md:py-16">
        <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase text-[#1d7c68]">How to use</p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight">
              Use the catalog as a build checklist.
            </h2>
            <p className="mt-4 text-base leading-7 text-[#4f535c]">
              The CMS sends flexible-content blocks into <code className="rounded-sm bg-[#f4f5f0] px-1.5 py-0.5">PageBuilder</code>.
              PageBuilder reads <code className="rounded-sm bg-[#f4f5f0] px-1.5 py-0.5">acf_fc_layout</code>,
              chooses the matching React component, and passes the full block as <code className="rounded-sm bg-[#f4f5f0] px-1.5 py-0.5">data</code>.
            </p>

            <div className="mt-6 rounded-md border border-black/10 bg-[#111316] p-4">
              <p className="text-xs font-semibold uppercase text-[var(--color-accent)]">Example block shape</p>
              <pre className="mt-3 max-h-[360px] overflow-auto text-xs leading-5 text-white/82">
                <code>{dataShapeExample}</code>
              </pre>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {workflow.map((item, index) => (
              <article key={item.title} className="rounded-md border border-black/10 bg-[#f7f7f2] p-4">
                <span className="flex h-8 w-8 items-center justify-center rounded-sm bg-[var(--color-accent)] text-sm font-semibold text-black">
                  {index + 1}
                </span>
                <h3 className="mt-4 text-base font-semibold text-[#151515]">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#3d3f46]">{item.description}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {implementationGuides.map((guide) => (
            <article key={guide.title} className="rounded-md border border-black/10 bg-[#fbfcf7] p-5">
              <h3 className="text-lg font-semibold text-[#151515]">{guide.title}</h3>
              <ul className="mt-4 space-y-2 text-sm leading-6 text-[#4f535c]">
                {guide.points.map((point) => (
                  <li key={point} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#1d7c68]" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default async function ComponentsPage() {
  const groups = await getComponentCatalog();
  const allComponents = groups.flatMap((group) => group.items);
  const layoutKeys = new Set(allComponents.map((item) => item.layout).filter(Boolean));
  const stats = [
    { value: String(allComponents.length), label: "documented components" },
    { value: String(layoutKeys.size), label: "layout/source keys" },
    { value: String(groups.length), label: "component groups" },
    { value: "auto", label: "catalog updates" },
  ];

  return (
    <>
      <BodyClass className="components-library-page" />
      <main className="min-h-screen bg-[#f7f7f2] text-[#151515]">
        <section className="overflow-hidden border-b border-black/10 bg-[#111316] text-white">
          <div className="web-width grid gap-10 px-6 py-16 md:py-20 lg:grid-cols-[1fr_440px] lg:items-center">
            <div className="max-w-4xl">
              <p className="mb-4 text-sm font-semibold uppercase text-[var(--color-accent)]">
                Component Library
              </p>
              <h1 className="text-4xl font-semibold leading-tight md:text-6xl">
                Build pages faster with documented, reusable components.
              </h1>
              <p className="mt-6 max-w-3xl text-base leading-7 text-white/70 md:text-lg">
                A single reference for the project section library: visual previews, layout keys,
                required CMS fields, implementation notes, and backend-loaded source code for each component.
              </p>

              <div className="mt-7 grid gap-3 text-sm leading-6 text-white/72 sm:grid-cols-2">
                {[
                  "Choose a section and copy its acf_fc_layout key.",
                  "Match CMS fields with the component data contract.",
                  "Open full source code in a popup without leaving the page.",
                  "Use preview assets as a visual index for editors and developers.",
                ].map((item) => (
                  <div key={item} className="flex gap-3 rounded-md border border-white/10 bg-white/5 p-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent)]" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#quick-index"
                  className="rounded-sm bg-[var(--color-accent)] px-5 py-3 text-sm font-semibold text-black transition-opacity hover:opacity-85"
                >
                  Browse components
                </a>
                <a
                  href="#quick-index"
                  className="rounded-sm border border-white/18 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                >
                  Jump to index
                </a>
              </div>

              <div className="mt-10 grid grid-cols-2 gap-3 lg:grid-cols-4">
                {stats.map((stat) => (
                  <div key={stat.label} className="rounded-md border border-white/12 bg-white/6 p-4">
                    <p className="text-3xl font-semibold text-[var(--color-accent)]">{stat.value}</p>
                    <p className="mt-1 text-sm text-white/62">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="relative aspect-[4/3] overflow-hidden rounded-md border border-white/10 bg-white/5 shadow-2xl">
                <Image
                  src="/component-previews/library-banner-graphic.svg"
                  alt="Graphic showing PageBuilder connecting CMS layout keys to reusable components"
                  fill
                  priority
                  sizes="(min-width: 1024px) 440px, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div className="rounded-md border border-white/10 bg-white/5 p-3">
                  <p className="text-xs font-semibold uppercase text-[var(--color-accent)]">Backend</p>
                  <p className="mt-1 text-sm text-white/68">Source code loads from a safe API whitelist.</p>
                </div>
                <div className="rounded-md border border-white/10 bg-white/5 p-3">
                  <p className="text-xs font-semibold uppercase text-[var(--color-accent)]">CMS Ready</p>
                  <p className="mt-1 text-sm text-white/68">Each card lists fields needed for setup.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <UsageGuideSection />

        <section className="border-b border-black/10 bg-[#eff7f3]">
          <div className="web-width px-6 py-10">
            <div className="grid gap-4 md:grid-cols-[220px_1fr] md:items-start">
              <h2 className="text-2xl font-semibold">Quick Index</h2>
              <div className="flex flex-wrap gap-2">
                {allComponents.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="rounded-sm border border-black/10 bg-white px-3 py-2 text-sm text-[#2b2b2b] transition-colors hover:border-[#1d7c68] hover:text-[#1d7c68]"
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        {groups.map((group) => (
          <section key={group.title} className="border-b border-black/10">
            <div className="web-width px-6 py-14 md:py-16">
              <div className="mb-8 max-w-3xl">
                <p className="text-sm font-semibold uppercase text-[#1d7c68]">{group.title}</p>
                <h2 className="mt-3 text-3xl font-semibold leading-tight">{group.description}</h2>
              </div>

              <div className="grid gap-4">
                {group.items.map((item) => (
                  <div key={item.id} id={item.id} className="scroll-mt-8">
                    <ComponentRow item={item} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        ))}
      </main>
    </>
  );
}
