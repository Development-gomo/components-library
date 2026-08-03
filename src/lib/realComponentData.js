import "server-only";
import { cache } from "react";
import { fetchWP } from "@/lib/api";
import { sampleDataByLayout } from "@/lib/componentSampleData";

// Layouts used by the single-case-study template (PageBuilderCasestudy.jsx),
// pulled from case-study posts' acf.case_study_builder field rather than
// regular pages' page_builder field. No hardcoded sample data exists for these —
// they're real-data-only, falling back to the static preview image otherwise.
const CASE_STUDY_LAYOUTS = new Set([
  "hero_section",
  "introduction_section",
  "challenges_section",
  "solution_section",
  "testimonial_banner",
  "result_section",
  "cta_banner",
]);

// Every layout we have dummy sample data for is also a candidate to be replaced
// by a real example pulled from WordPress.
const PAGE_LAYOUTS = new Set(Object.keys(sampleDataByLayout));

function collectFirstBlockPerLayout(posts, blocksField, targetLayouts, found) {
  if (!Array.isArray(posts)) return;

  for (const post of posts) {
    const blocks = post?.acf?.[blocksField];
    if (!Array.isArray(blocks)) continue;

    for (const block of blocks) {
      const layout = block?.acf_fc_layout;
      if (!layout || found[layout] || !targetLayouts.has(layout)) continue;
      found[layout] = block;
    }
  }
}

// Scans WP pages and case studies for real examples of each live-preview layout,
// keeping the first real block found per layout. This site's pages are largely one
// demo page per component (e.g. "client-logo", "testimonial", "accordion"), so a
// single real instance per layout is usually easy to find and representative.
export const getRealComponentDataByLayout = cache(async function getRealComponentDataByLayout() {
  const [pages, caseStudies] = await Promise.all([
    fetchWP(`/wp/v2/pages?per_page=100`, { revalidate: 300, tags: ["pages"] }),
    fetchWP(`/wp/v2/case-study?per_page=100&acf_format=standard`, { revalidate: 300, tags: ["case-study"] }),
  ]);

  const found = {};
  collectFirstBlockPerLayout(pages, "page_builder", PAGE_LAYOUTS, found);
  collectFirstBlockPerLayout(caseStudies, "case_study_builder", CASE_STUDY_LAYOUTS, found);

  return found;
});
