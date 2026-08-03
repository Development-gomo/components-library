import "server-only";
import { cache } from "react";
import { fetchWP } from "@/lib/api";
import { sampleDataByLayout } from "@/lib/componentSampleData";

// Every layout we have dummy sample data for is a candidate to be replaced by a
// real example pulled from WordPress — same set as componentSampleData.js.
const TARGET_LAYOUTS = new Set(Object.keys(sampleDataByLayout));

// Scans every WP page's ACF page_builder field and keeps the first real block
// found for each target layout. This site's pages are largely one demo page per
// component (e.g. "client-logo", "testimonial", "accordion"), so a single real
// instance per layout is usually easy to find and representative.
export const getRealComponentDataByLayout = cache(async function getRealComponentDataByLayout() {
  const pages = await fetchWP(`/wp/v2/pages?per_page=100`, {
    revalidate: 300,
    tags: ["pages"],
  });

  const found = {};
  if (!Array.isArray(pages)) return found;

  for (const page of pages) {
    const blocks = page?.acf?.page_builder;
    if (!Array.isArray(blocks)) continue;

    for (const block of blocks) {
      const layout = block?.acf_fc_layout;
      if (!layout || found[layout] || !TARGET_LAYOUTS.has(layout)) continue;
      found[layout] = block;
    }
  }

  return found;
});
