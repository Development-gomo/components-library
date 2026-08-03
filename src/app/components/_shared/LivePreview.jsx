"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { getSampleData, isHeavyPreview } from "@/lib/componentSampleData";
import PreviewErrorBoundary from "./PreviewErrorBoundary";

const CenteredHero = dynamic(() => import("@/components/sections/hero-sections/CenteredHero"));
const HeroWithImage = dynamic(() => import("@/components/sections/hero-sections/HeroWithImage"));
const HeroCenteredBg = dynamic(() => import("@/components/sections/hero-sections/HeroCenteredBg"));
const FloatingGalleryHero = dynamic(() => import("@/components/sections/hero-sections/FloatingGalleryHero"));
const ContentMediaBlock = dynamic(() => import("@/components/sections/content-sections/ContentMediaBlock"));
const ServiceOverview = dynamic(() => import("@/components/sections/content-sections/ServiceOverview"));
const ClientLogo = dynamic(() => import("@/components/sections/client-logo/ClientLogo"));
const FeatureGrid = dynamic(() => import("@/components/sections/feature-grid/FeatureGrid"));
const ProcessSteps = dynamic(() => import("@/components/sections/process/ProcessSteps"));
const AccordionSection = dynamic(() => import("@/components/sections/accordian/AccordianTypes"));
const TestimonialSection = dynamic(() => import("@/components/sections/testimonial/Testimonial"));
const TestimonialSectionLogo = dynamic(() => import("@/components/sections/testimonial/TestimonialSectionLogo"));
const TabsSection = dynamic(() => import("@/components/sections/tabs/TabsSections"));
const ContactForm = dynamic(() => import("@/components/sections/contact-form/ContactForm"));
const CaseHero = dynamic(() => import("@/components/sections/single-casestudy/CaseHero"));
const CaseIntroduction = dynamic(() => import("@/components/sections/single-casestudy/CaseIntroduction"));
const CaseChallenges = dynamic(() => import("@/components/sections/single-casestudy/CaseChallenges"));
const CaseSolution = dynamic(() => import("@/components/sections/single-casestudy/CaseSolution"));
const CaseTestimonial = dynamic(() => import("@/components/sections/single-casestudy/CaseTestimonial"));
const CaseResults = dynamic(() => import("@/components/sections/single-casestudy/CaseResults"));
const CaseCtaBanner = dynamic(() => import("@/components/sections/single-casestudy/CaseCtaBanner"));
const HeroClientslider = dynamic(() => import("@/components/sections/hero-sections/HeroClientslider"));
const KineticHero = dynamic(() => import("@/components/sections/hero-sections/KineticHero"));
const ScrollExpansionHero = dynamic(() => import("@/components/sections/hero-sections/ScrollExpansionHero"));
const AccordionImageScroller = dynamic(() => import("@/components/sections/accordian/AccordionImageScroller"));
const TubeLightSection = dynamic(() => import("@/components/ui/TubeLight"));
const StoryScroll = dynamic(() => import("@/components/ui/story-scroll"));
const PricingTable = dynamic(() => import("@/components/sections/pricing/PricingTable"));
const CaseStudyFilter = dynamic(() => import("@/components/sections/case-study/CaseStudyFilter"));
const CaseStudyDropDownFilter = dynamic(() => import("@/components/sections/case-study/CaseStudyDropDownFilter"));
const CaseStudyLoadMore = dynamic(() => import("@/components/sections/case-study/CaseStudyLoadMore"));

// These have a scroll-linked (useScroll/useTransform) parallax effect rather than a
// one-shot whileInView animation — same reasoning as isHeavyPreview() in
// componentSampleData.js, but these layouts have no dummy sample data entry to hang
// a `heavy` flag off of, so they get their own small set here.
const HEAVY_CASE_STUDY_LAYOUTS = new Set(["hero_section", "testimonial_banner"]);

// Add a case here whenever a new layout gets an entry in componentSampleData.js,
// or a new single-case-study layout in PageBuilderCasestudy.jsx.
// Mirrors the switch pattern in src/components/major/PageBuilder.jsx.
function renderPreviewComponent(layout, data) {
  switch (layout) {
    case "centered_hero":
      return <CenteredHero data={data} />;
    case "hero_with_image":
      return <HeroWithImage data={data} />;
    case "hero_centered_bg":
      return <HeroCenteredBg data={data} />;
    case "floating_gallery_hero":
      return <FloatingGalleryHero data={data} />;
    case "content_media_block":
      return <ContentMediaBlock data={data} />;
    case "service_overview":
      return <ServiceOverview data={data} />;
    case "client_logo":
      return <ClientLogo data={data} />;
    case "feature_grid":
      return <FeatureGrid data={data} />;
    case "process_steps":
      return <ProcessSteps data={data} />;
    case "accordion_section":
      return <AccordionSection data={data} />;
    case "testimonial_section":
      return <TestimonialSection data={data} />;
    case "testimonial_section_with_logo":
      return <TestimonialSectionLogo data={data} />;
    case "tab_section":
      return <TabsSection data={data} />;
    case "contact_form_section":
      return <ContactForm data={data} />;
    case "hero_section":
      return <CaseHero data={data} />;
    case "introduction_section":
      return <CaseIntroduction data={data} />;
    case "challenges_section":
      return <CaseChallenges data={data} />;
    case "solution_section":
      return <CaseSolution data={data} />;
    case "testimonial_banner":
      return <CaseTestimonial data={data} />;
    case "result_section":
      return <CaseResults data={data} />;
    case "cta_banner":
      return <CaseCtaBanner data={data} />;
    case "hero_with_slider":
      return <HeroClientslider data={data} />;
    case "kinetic_hero":
      return <KineticHero data={data} />;
    case "scroll_expansion_hero":
      return <ScrollExpansionHero data={data} />;
    case "accordion_image_scroller":
      return <AccordionImageScroller data={data} />;
    case "tube_light_section":
      return <TubeLightSection data={data} />;
    case "scroller_section":
      return <StoryScroll data={data} />;
    case "pricing_table":
      return <PricingTable />;
    case "case_study_filter":
      return <CaseStudyFilter data={data} />;
    case "case_study_filter_dropdown":
      return <CaseStudyDropDownFilter data={data} />;
    case "case_study_load_more":
      return <CaseStudyLoadMore data={data} />;
    default:
      return null;
  }
}

function StaticFallback({ item }) {
  // Self-contained aspect-ratio box: next/image's `fill` needs a positioned,
  // sized ancestor, and callers (card grid vs. detail page tabs) don't always
  // provide one — this makes the fallback safe to render standalone anywhere.
  return (
    <div className="relative aspect-16/10 w-full overflow-hidden bg-[#eef1ea]">
      <Image
        src={item.preview}
        alt={`${item.name} UI preview`}
        fill
        sizes="(min-width: 1024px) 480px, 100vw"
        className="object-cover"
      />
    </div>
  );
}

/**
 * Renders the real section component with real WP data when available, falling
 * back to hardcoded sample data (see componentSampleData.js) otherwise.
 * mode="card": scaled thumbnail, non-interactive, used in grid/sidebar previews.
 *   Falls back to the static image for "heavy" (continuously animating) components —
 *   mounting a dozen rAF/scroll-linked components at once in a small grid is wasteful.
 * mode="full": real size, interactive, used on the component detail page (one at a time).
 *
 * `preRendered`: some section components are `async` Server Components (they fetch
 * their own real WP data internally — team members, blog posts, case studies) and
 * cannot be dynamically imported into this "use client" component at all — that's a
 * hard React Server/Client boundary rule. For those, the server page pre-renders
 * them (see ServerPreview.jsx) and passes the already-rendered element here instead.
 */
export default function LivePreview({ item, mode = "card", canvasWidth = 1440, realData, preRendered }) {
  const data = realData || getSampleData(item.layout);
  const skipInCardMode =
    mode === "card" && (isHeavyPreview(item.layout) || HEAVY_CASE_STUDY_LAYOUTS.has(item.layout));
  const rendered =
    preRendered || (data && !skipInCardMode ? renderPreviewComponent(item.layout, data) : null);

  if (!rendered) {
    return <StaticFallback item={item} />;
  }

  const fallback = <StaticFallback item={item} />;

  if (mode === "card") {
    const scale = 0.28;
    return (
      <PreviewErrorBoundary fallback={fallback}>
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div
            style={{
              width: canvasWidth,
              transform: `scale(${scale})`,
              transformOrigin: "top left",
            }}
          >
            {rendered}
          </div>
        </div>
      </PreviewErrorBoundary>
    );
  }

  return <PreviewErrorBoundary fallback={fallback}>{rendered}</PreviewErrorBoundary>;
}
