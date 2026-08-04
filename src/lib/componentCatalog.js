import "server-only";
import { readdir, readFile, stat } from "fs/promises";
import path from "path";

const PROJECT_ROOT = process.cwd();
const PAGE_BUILDER_PATH = "src/components/major/PageBuilder.jsx";

const SCAN_ROOTS = [
  "src/components/sections",
  "src/components/ui",
  "src/components/major",
];

const EXTRA_SOURCE_FILES = [
  "src/components/BodyClass.jsx",
  "src/app/case-study/[slug]/page.jsx",
];

// Internal-only helper files: imported and rendered exclusively by another
// catalog component (different prop shape, not a standalone ACF block), so
// showing them as their own browsable card is just noise/confusion.
const HIDDEN_PATHS = new Set([
  "src/components/sections/interactive-map/MapView.jsx",
  "src/components/sections/tabs/TabsCptClient.jsx",
  "src/components/sections/contact-form/Cform.jsx",
  "src/components/ui/hover-footer.jsx",
  "src/components/ui/scroll-expansion-hero.jsx",
  "src/components/major/HeaderComponent.jsx",
  "src/components/sections/content-sections/insightsUtils.js",
  "src/components/sections/animated-numbers/StatsCounter.jsx",
  "src/components/ui/story-scroll.jsx",
]);

const GROUP_ORDER = [
  "Hero Sections",
  "Content Sections",
  "Structured Sections",
  "Case Study Sections",
  "Interactive And Commerce",
  "Major Layout Components",
  "UI Components",
  "Single Case Study Components",
  "Other Components",
];

// These groups are internal site plumbing (global header/footer/page-builder
// switches, low-level UI helpers) rather than page-builder content blocks — hidden
// from the catalog entirely per request.
const HIDDEN_GROUPS = new Set(["Major Layout Components", "UI Components"]);

const GROUP_DESCRIPTIONS = {
  "Hero Sections": "Top-of-page sections for campaign, service, and editorial entry points.",
  "Content Sections": "Editorial and service content sections for flexible page building.",
  "Structured Sections": "Reusable layouts for lists, tabs, accordions, process flows, metrics, teams, and logos.",
  "Case Study Sections": "Listing components and single-case-study detail components.",
  "Interactive And Commerce": "Sections that bring in maps, pricing, and more operational UI.",
  "Major Layout Components": "Shared site components that frame pages and connect the CMS to the UI.",
  "UI Components": "Shared lower-level UI modules used by sections and global layout.",
  "Single Case Study Components": "Components used by the single case-study template.",
  "Other Components": "Auto-discovered modules that are not mapped to a known group yet.",
};

const COMPONENT_OVERRIDES = {
  "src/components/sections/hero-sections/HeroCenteredBg.jsx": {
    purpose: "Centered headline, rich text, CTA buttons, and image or video background.",
    notes: ["Video takes priority over image.", "Uses overlay when media exists."],
  },
  "src/components/sections/hero-sections/CenteredHero.jsx": {
    purpose: "Alternate centered hero mapped separately in PageBuilder.",
    notes: ["Useful when the CMS needs a second centered hero option."],
  },
  "src/components/sections/hero-sections/HeroWithImage.jsx": {
    purpose: "Two-column hero with text and a foreground image, plus optional media background.",
    notes: ["Best for product, service, or case-study intros with a visual asset."],
  },
  "src/components/sections/pricing/PricingTable.jsx": {
    layout: "pricing_table",
    purpose: "Currency-toggle pricing table. Rendered alongside InteractiveMap under the interactive_map layout.",
    fields: ["No data prop — plans, prices, and features are hardcoded in the component"],
    notes: ["Not driven by ACF.", "Edit the `plans` array in the source file to change pricing content."],
  },
  "src/components/sections/hero-sections/KineticHero.jsx": {
    purpose: "Animated image-column hero with scroll-responsive movement.",
    notes: ["Client component.", "Requires enough images per column for a strong loop."],
  },
  "src/components/sections/hero-sections/ScrollExpansionHero.jsx": {
    purpose: "Immersive media hero that expands on scroll and reveals body content.",
    notes: ["Requires both media source and background image.", "Uses the shared scroll expansion UI component."],
  },
  "src/components/major/PageBuilder.jsx": {
    layout: "page_builder",
    purpose: "Central switch that maps each ACF flexible-content layout to a React component.",
    fields: ["sections[].acf_fc_layout", "sections[] block data"],
    notes: ["Fetches case studies once when any case-study block is present."],
  },
  "src/components/major/PageBuilderCasestudy.jsx": {
    layout: "page_builder_casestudy",
    purpose: "Layout switch for the single case-study template — maps case-study-specific ACF layouts to their section components.",
    fields: ["sections[].acf_fc_layout", "sections[] block data"],
    notes: ["Used by src/app/case-study/[slug]/page.jsx.", "Separate switch from the main PageBuilder because case-study layout keys are unique to this template."],
  },
  "src/components/major/Header.jsx": {
    layout: "global_header",
    purpose: "Builds navigation, logo, mega menu, and CTA from theme options.",
    fields: ["theme_options.header", "theme_options.mega_menu", "theme_options.logo", "theme_options.cta"],
    notes: ["Server component.", "Falls back when theme options are missing."],
  },
  "src/components/major/Footer.jsx": {
    layout: "global_footer",
    purpose: "Builds footer CTA, social links, link columns, contact details, and copyright from theme options.",
    fields: ["global.quick_links_group", "global.services", "global.resources", "global.social_links", "global.contact", "global.footer_cta"],
    notes: ["Server component.", "Uses hover footer UI helpers."],
  },
  "src/components/major/SearchBar.jsx": {
    layout: "site_search",
    purpose: "Search input connected to the local search API route.",
    fields: ["query", "search results"],
    notes: ["Pairs with src/app/api/search/route.js."],
  },
  "src/components/BodyClass.jsx": {
    layout: "body_class",
    purpose: "Applies route or page-specific body classes.",
    fields: ["className"],
    notes: ["Useful for scoped page styling without changing the root layout."],
  },
  "src/app/case-study/[slug]/page.jsx": {
    layout: "case-study/[slug]",
    name: "Single Case Study Template",
    purpose: "Template composed from the single case-study section components.",
    fields: ["hero", "introduction", "challenges", "solution", "results.counters", "testimonial", "cta"],
    notes: ["Used by the case-study route rather than the main PageBuilder switch."],
  },
};

function normalizePath(filePath) {
  return filePath.replace(/\\/g, "/").replace(/^\/+/, "");
}

function titleCase(value) {
  return String(value)
    .replace(/\.[^.]+$/, "")
    .replace(/[-_]+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\w\S*/g, (word) => word.charAt(0).toUpperCase() + word.slice(1));
}

function slugFromName(value) {
  return String(value)
    .replace(/\.[^.]+$/, "")
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .toLowerCase();
}

async function fileExists(relativePath) {
  try {
    await stat(path.join(PROJECT_ROOT, relativePath));
    return true;
  } catch {
    return false;
  }
}

async function readFilesRecursive(relativeDir) {
  const absoluteDir = path.join(PROJECT_ROOT, relativeDir);
  const entries = await readdir(absoluteDir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const childRelativePath = normalizePath(path.join(relativeDir, entry.name));
    if (entry.isDirectory()) {
      files.push(...await readFilesRecursive(childRelativePath));
    } else if (/\.(jsx|js|tsx|ts)$/.test(entry.name) && !entry.name.endsWith(".d.ts")) {
      files.push(childRelativePath);
    }
  }

  return files;
}

function parsePageBuilderMappings(source) {
  const importsByName = new Map();
  const mappingsByPath = new Map();
  const importRegex = /const\s+(\w+)\s*=\s*dynamic\(\(\)\s*=>\s*import\(["']([^"']+)["']\)\)/g;
  let importMatch;

  while ((importMatch = importRegex.exec(source))) {
    importsByName.set(importMatch[1], importMatch[2]);
  }

  const caseRegex = /case\s+["']([^"']+)["']:\s*return\s*(?:\(\s*)?<(\w+)/g;
  let caseMatch;

  while ((caseMatch = caseRegex.exec(source))) {
    const importPath = importsByName.get(caseMatch[2]);
    if (!importPath) continue;

    const resolved = normalizePath(path.join(path.dirname(PAGE_BUILDER_PATH), importPath));
    mappingsByPath.set(resolved, caseMatch[1]);
  }

  return mappingsByPath;
}

async function resolveExistingImportPath(basePath) {
  const candidates = [
    `${basePath}.jsx`,
    `${basePath}.js`,
    `${basePath}.tsx`,
    `${basePath}.ts`,
    `${basePath}/index.jsx`,
    `${basePath}/index.js`,
  ];

  for (const candidate of candidates) {
    if (await fileExists(candidate)) return candidate;
  }

  return `${basePath}.jsx`;
}

async function getPageBuilderLayoutByPath() {
  const source = await readFile(path.join(PROJECT_ROOT, PAGE_BUILDER_PATH), "utf8");
  const rawMappings = parsePageBuilderMappings(source);
  const resolvedMappings = new Map();

  for (const [basePath, layout] of rawMappings.entries()) {
    resolvedMappings.set(await resolveExistingImportPath(basePath), layout);
  }

  return resolvedMappings;
}

const IGNORED_FIELD_NAMES = ["data", "block", "acf_fc_layout"];

function cleanFieldName(value) {
  return String(value)
    .trim()
    .replace(/^[^\w.]+/, "")
    .replace(/\s*\(.+\)\s*$/, "")
    .replace(/\s+.+$/, "")
    .trim();
}

function addField(fields, value) {
  const field = cleanFieldName(value);
  if (field && !IGNORED_FIELD_NAMES.includes(field)) {
    fields.add(field);
  }
}

// Parses one "// name (type)" style comment line into { indent, name, type }.
// `indent` is the number of leading spaces after `//`, used to detect ACF
// repeater sub-fields nested under their parent field (see extractFieldsFromComment).
function parseFieldCommentLine(raw) {
  const match = raw.match(/^(\s*)(?:[-*]\s*)?([a-zA-Z_][\w.]*)\s*(?:\(([^)]*)\))?/);
  if (!match) return null;

  const [, indent, name] = match;
  const typeRaw = match[3];
  if (IGNORED_FIELD_NAMES.includes(name)) return null;

  // "select: a | b | c" -> "select", "image → array" -> "image"
  const type = typeRaw ? typeRaw.split(/[:→]/)[0].trim().split(/\s+/)[0] : undefined;

  return { indent: indent.length, name, type: type || undefined };
}

// Documentation convention (see Testimonial.jsx, FeatureGrid.jsx, ProcessSteps.jsx for
// examples):
//   // Fields: simple, comma, list        <- flat shorthand, no types/repeaters
// or the richer block form, which this also captures ACF repeater sub-fields for:
//   // ACF Fields:
//   //   heading           (text)
//   //   features          (repeater)
//   //     feature_title       (text)
//   //     feature_icon        (image)
function extractFieldsFromComment(source) {
  const lines = source.split(/\r?\n/);
  const fields = [];
  const seenTopLevel = new Map();

  for (let i = 0; i < lines.length; i += 1) {
    const fieldHeader = lines[i].match(/\/\/\s*(?:ACF\s+)?Fields?:\s*(.*)$/i);
    if (!fieldHeader) continue;

    if (fieldHeader[1]?.trim()) {
      fieldHeader[1].split(",").forEach((token) => {
        const name = cleanFieldName(token);
        if (!name || IGNORED_FIELD_NAMES.includes(name) || seenTopLevel.has(name)) return;
        const field = { name };
        seenTopLevel.set(name, field);
        fields.push(field);
      });
    }

    let lastTopLevel = fields[fields.length - 1] ?? null;
    let baseIndent = null;

    for (let j = i + 1; j < lines.length; j += 1) {
      const commentLine = lines[j].match(/^\s*\/\/(.*)$/);
      if (!commentLine) break;

      const parsed = parseFieldCommentLine(commentLine[1]);
      if (!parsed) break;
      if (baseIndent === null) baseIndent = parsed.indent;

      if (parsed.indent > baseIndent && lastTopLevel) {
        lastTopLevel.subFields = lastTopLevel.subFields || [];
        if (!lastTopLevel.subFields.some((f) => f.name === parsed.name)) {
          lastTopLevel.subFields.push({ name: parsed.name, type: parsed.type });
        }
        continue;
      }

      if (seenTopLevel.has(parsed.name)) {
        lastTopLevel = seenTopLevel.get(parsed.name);
        continue;
      }

      const field = { name: parsed.name, type: parsed.type };
      seenTopLevel.set(parsed.name, field);
      fields.push(field);
      lastTopLevel = field;
    }
  }

  return fields;
}

function extractFieldsFromDataUsage(source) {
  const fields = new Set();
  const destructuringRegex = /const\s*{([\s\S]*?)}\s*=\s*data\b/g;
  let destructuringMatch;

  while ((destructuringMatch = destructuringRegex.exec(source))) {
    destructuringMatch[1]
      .split(",")
      .map((item) => item.replace(/=.*$/, "").replace(/:.+$/, "").trim())
      .forEach((field) => addField(fields, field));
  }

  const dotAccessRegex = /data(?:\?\.|\.)\s*([a-zA-Z_]\w*)/g;
  let dotAccessMatch;

  while ((dotAccessMatch = dotAccessRegex.exec(source))) {
    addField(fields, dotAccessMatch[1]);
  }

  return [...fields].map((name) => ({ name }));
}

function extractLayoutFromComment(source) {
  return source.match(/\/\/\s*Layout:\s*([^\r\n(]+)/i)?.[1]?.trim();
}

// tube_light_section is a real PageBuilder block that happens to live under
// src/components/ui/ rather than sections/ — it'd otherwise be grouped into "UI
// Components", which is hidden from the catalog (see HIDDEN_GROUPS below). Route it
// into a real content group instead of losing it.
const GROUP_OVERRIDES_BY_PATH = {
  "src/components/ui/TubeLight.jsx": "Structured Sections",
};

function inferGroup(relativePath) {
  if (GROUP_OVERRIDES_BY_PATH[relativePath]) return GROUP_OVERRIDES_BY_PATH[relativePath];
  if (relativePath.includes("/hero-sections/")) return "Hero Sections";
  if (relativePath.includes("/content-sections/")) return "Content Sections";
  if (relativePath.includes("/case-study/") || relativePath.includes("/case-study/[")) return "Case Study Sections";
  if (relativePath.includes("/single-casestudy/")) return "Single Case Study Components";
  if (relativePath.includes("/interactive-map/") || relativePath.includes("/pricing/")) return "Interactive And Commerce";
  if (relativePath.includes("/major/") || relativePath.endsWith("BodyClass.jsx")) return "Major Layout Components";
  if (relativePath.includes("/ui/")) return "UI Components";
  if (relativePath.includes("/sections/")) return "Structured Sections";
  return "Other Components";
}

function inferPurpose(relativePath, group) {
  const name = titleCase(path.basename(relativePath));
  if (group === "UI Components") return "Shared UI module used by one or more page sections.";
  if (group === "Major Layout Components") return "Shared layout module that supports page rendering or site chrome.";
  return `Auto-discovered ${name} component. Add a top-of-file Layout and Fields comment for richer documentation.`;
}

async function getPreviewPath(layout) {
  const previewName = slugFromName(layout);
  const previewPath = `public/component-previews/${previewName}.svg`;
  if (await fileExists(previewPath)) return `/component-previews/${previewName}.svg`;
  return "/component-previews/component-fallback.svg";
}

async function buildCatalogItem(relativePath, source, layoutByPath) {
  const override = COMPONENT_OVERRIDES[relativePath] || {};
  const group = inferGroup(relativePath);
  const mappedLayout = layoutByPath.get(relativePath);
  const layout = override.layout || mappedLayout || extractLayoutFromComment(source) || slugFromName(path.basename(relativePath));
  const commentFields = extractFieldsFromComment(source);
  const dataFields = extractFieldsFromDataUsage(source);
  const overrideFields = override.fields?.map((name) => ({ name }));
  const fields = overrideFields || (commentFields.length ? commentFields : dataFields);
  const fieldSource = overrideFields
    ? "override"
    : commentFields.length
      ? "comments"
      : dataFields.length
        ? "data usage"
        : "source review";

  return {
    id: `${slugFromName(layout)}-${slugFromName(relativePath)}`,
    name: override.name || titleCase(path.basename(relativePath)),
    layout,
    path: relativePath,
    purpose: override.purpose || inferPurpose(relativePath, group),
    fields: fields.length ? fields : [{ name: "Review source file" }],
    notes: override.notes || [
      mappedLayout ? "Mapped in PageBuilder." : "Auto-discovered from the filesystem.",
      fieldSource === "comments"
        ? "Fields were parsed from source comments."
        : fieldSource === "data usage"
          ? "Fields were inferred from component data usage."
          : "Add a top-of-file Fields comment to improve this card.",
    ],
    preview: await getPreviewPath(layout),
    group,
  };
}

export async function getComponentCatalog() {
  const layoutByPath = await getPageBuilderLayoutByPath();
  const scanFiles = (await Promise.all(SCAN_ROOTS.map(readFilesRecursive))).flat();
  const files = [...new Set([...scanFiles, ...EXTRA_SOURCE_FILES])]
    .filter((relativePath) => !HIDDEN_PATHS.has(relativePath))
    .sort();
  const items = [];

  for (const relativePath of files) {
    if (!await fileExists(relativePath)) continue;
    const source = await readFile(path.join(PROJECT_ROOT, relativePath), "utf8");
    items.push(await buildCatalogItem(relativePath, source, layoutByPath));
  }

  const groups = new Map();
  for (const item of items) {
    if (!groups.has(item.group)) {
      groups.set(item.group, {
        title: item.group,
        description: GROUP_DESCRIPTIONS[item.group] || GROUP_DESCRIPTIONS["Other Components"],
        items: [],
      });
    }
    groups.get(item.group).items.push(item);
  }

  return [...groups.values()]
    .sort((a, b) => GROUP_ORDER.indexOf(a.title) - GROUP_ORDER.indexOf(b.title))
    .filter((group) => group.items.length > 0 && !HIDDEN_GROUPS.has(group.title));
}

export async function getAllowedComponentSourcePaths() {
  const groups = await getComponentCatalog();
  return new Set(groups.flatMap((group) => group.items.map((item) => item.path)));
}
