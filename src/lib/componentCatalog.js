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
  "src/components/sections/hero-sections/Centeredhero.jsx": {
    purpose: "Alternate centered hero mapped separately in PageBuilder.",
    notes: ["Useful when the CMS needs a second centered hero option."],
  },
  "src/components/sections/hero-sections/HeroWithImage.jsx": {
    purpose: "Two-column hero with text and a foreground image, plus optional media background.",
    notes: ["Best for product, service, or case-study intros with a visual asset."],
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
  if (field && !["data", "block", "acf_fc_layout"].includes(field)) {
    fields.add(field);
  }
}

function extractFieldNamesFromComment(source) {
  const lines = source.split(/\r?\n/);
  const fields = new Set();

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    const fieldHeader = line.match(/\/\/\s*(?:ACF\s+)?Fields?:\s*(.*)$/i);

    if (fieldHeader) {
      if (fieldHeader[1]) {
        fieldHeader[1]
        .split(",")
        .forEach((field) => addField(fields, field));
      }

      for (let j = i + 1; j < lines.length; j += 1) {
        const fieldLine = lines[j].match(/\/\/\s*(?:[-*]\s*)?([a-zA-Z_][\w.]*)/);
        if (!fieldLine) break;
        addField(fields, fieldLine[1]);
      }
    }
  }

  return [...fields];
}

function extractFieldNamesFromDataUsage(source) {
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

  return [...fields];
}

function extractLayoutFromComment(source) {
  return source.match(/\/\/\s*Layout:\s*([^\r\n(]+)/i)?.[1]?.trim();
}

function inferGroup(relativePath) {
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
  const commentFields = extractFieldNamesFromComment(source);
  const dataFields = extractFieldNamesFromDataUsage(source);
  const fields = override.fields || (commentFields.length ? commentFields : dataFields);
  const fieldSource = override.fields
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
    fields: fields.length ? fields : ["Review source file"],
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
  const files = [...new Set([...scanFiles, ...EXTRA_SOURCE_FILES])].sort();
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
    .filter((group) => group.items.length > 0);
}

export async function getAllowedComponentSourcePaths() {
  const groups = await getComponentCatalog();
  return new Set(groups.flatMap((group) => group.items.map((item) => item.path)));
}
