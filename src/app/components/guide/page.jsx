export const metadata = {
  title: "Usage Guide | Components Library",
  description: "How to wire catalog components into WordPress ACF flexible content via PageBuilder.",
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
      "This documentation page lives at src/app/components/guide/page.jsx.",
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
      "Optionally add a sample data entry in src/lib/componentSampleData.js and register it in src/app/components/_shared/previewRegistry.js for a live preview instead of a static image.",
    ],
  },
  {
    title: "Before handoff",
    points: [
      "Check the component with real CMS data.",
      "Confirm empty fields do not break the UI.",
      "Verify mobile and desktop spacing.",
      "Run targeted lint for changed files.",
      "Open the component's detail page to confirm live preview and source code load correctly.",
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

export default function ComponentsGuidePage() {
  return (
    <main className="min-h-screen bg-[#f7f7f2] text-[#151515]">
      <section className="border-b border-black/10 bg-white">
        <div className="px-6 py-12 md:px-10 md:py-16">
          <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
            <div>
              <p className="text-sm font-semibold uppercase text-[#1d7c68]">How to use</p>
              <h1 className="mt-3 text-3xl font-semibold leading-tight">
                Use the catalog as a build checklist.
              </h1>
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
    </main>
  );
}
