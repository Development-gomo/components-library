// Server component (no "use client") — renders section components that are
// themselves `async` Server Components (they fetch real WP data internally: team
// members, blog posts, case studies). These can't be dynamically imported inside
// LivePreview.jsx (a "use client" component) — React's Server/Client boundary
// doesn't allow an async Server Component to be lazily mounted from client code.
// Instead, the server page renders this and passes the result into LivePreview as
// the `preRendered` prop.
import dynamic from "next/dynamic";
import { getCaseStudies } from "@/lib/api";

const LatestInsights = dynamic(() => import("@/components/sections/content-sections/LatestInsights"));
const TeamSection = dynamic(() => import("@/components/sections/team/TeamSection"));
const TabsCptSection = dynamic(() => import("@/components/sections/tabs/TabsCptSection"));
const CaseStudyListing = dynamic(() => import("@/components/sections/case-study/CaseStudyListing"));
const CaseStudyBentoGrid = dynamic(() => import("@/components/sections/case-study/CaseStudyBentoGrid"));
const CaseStudyGridLayout = dynamic(() => import("@/components/sections/case-study/CaseStudyGridLayout"));
const Footer = dynamic(() => import("@/components/major/Footer"));
const PageBuilderCasestudy = dynamic(() => import("@/components/major/PageBuilderCasestudy"));

// Minimal config used only when no real example of the block was found on any
// page — the components themselves still fetch and render real posts/case
// studies/team members regardless of this config.
const FALLBACK_DATA = {
  latest_insights: {
    section_title: "Insights",
    title: "Latest from the blog",
    display_mode: "automatic",
    posts_per_page: 3,
    layout_style: "grid",
    pagination_type: "none",
  },
  team_section: {
    section_title: "Our team",
    title: "Meet the people behind the work",
    display_type: "grid",
  },
  tab_cpt_section: {
    sub_heading: "Explore",
    heading: "Browse by type",
    tab_style: "top",
    tab: [{ tab_label: "Case studies", post_type: "casestudy" }],
  },
  case_study_listing: { section_title: "Case studies", title: "Our work" },
  case_study_bento_grid: { section_title: "Case studies", title: "Our work" },
  case_study_grid_layout: { section_title: "Case studies", title: "Our work" },
};

export default async function ServerPreview({ item, data }) {
  const layout = item.layout;

  // Global footer isn't a page_builder block at all — it's site-wide theme
  // options, so it always renders regardless of any per-page data.
  if (layout === "global_footer") return <Footer />;

  // Not a page_builder block either — it's the whole single-case-study route,
  // composed from every case-study section. Pull one real case study and render
  // its full section list the same way the live template does.
  if (layout === "case-study/[slug]") {
    const caseStudies = await getCaseStudies();
    const withSections = caseStudies.find(
      (cs) => Array.isArray(cs?.acf?.case_study_builder) && cs.acf.case_study_builder.length > 0
    );
    if (!withSections) return null;
    return <PageBuilderCasestudy sections={withSections.acf.case_study_builder} />;
  }

  const finalData = data || FALLBACK_DATA[layout];
  if (!finalData) return null;

  switch (layout) {
    case "latest_insights":
      return <LatestInsights data={finalData} />;
    case "team_section":
      return <TeamSection data={finalData} />;
    case "tab_cpt_section":
      return <TabsCptSection data={finalData} />;
    case "case_study_listing":
      return <CaseStudyListing data={finalData} />;
    case "case_study_bento_grid":
      return <CaseStudyBentoGrid data={finalData} />;
    case "case_study_grid_layout":
      return <CaseStudyGridLayout data={finalData} />;
    default:
      return null;
  }
}
