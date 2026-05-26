//src/components/major/PageBuilder.jsx

import dynamic from "next/dynamic";
import { getCaseStudies } from "@/lib/api";

const HeroCenteredBg = dynamic(() => import("../sections/hero-sections/HeroCenteredBg"));
const KineticHero = dynamic(() => import("../sections/hero-sections/KineticHero"));
const HeroWithImage  = dynamic(() => import("../sections/hero-sections/HeroWithImage"));
const CenteredHero = dynamic(() => import("../sections/hero-sections/Centeredhero"));
const ContentMediaBlock = dynamic(() => import("../sections/content-sections/ContentMediaBlock"));
const ServiceOverview = dynamic(() => import("../sections/content-sections/ServiceOverview"));
const LatestInsights = dynamic(() => import("../sections/content-sections/LatestInsights"));
const CaseStudyListing = dynamic(() => import("../sections/case-study/CaseStudyListing"));
const CaseStudySlider = dynamic(() => import("../sections/case-study/CaseStudySlider"));
const CaseStudySliderFullWidth = dynamic(() => import("../sections/case-study/CaseStudySliderFullWidth"));
const CaseStudyLoadMore = dynamic(() => import("../sections/case-study/CaseStudyLoadMore"));
const CaseStudyFilter = dynamic(() => import("../sections/case-study/CaseStudyFilter"));
const CaseStudyDropDownFilter = dynamic(() => import("../sections/case-study/CaseStudyDropDownFilter"));
const TeamSection = dynamic(() => import("../sections/team/TeamSection"));
const ClientLogo = dynamic(() => import("../sections/client-logo/ClientLogo"));
const StoryScroll = dynamic(() => import("../ui/story-scroll"));
const AccordionSection = dynamic(() => import("../sections/accordian/AccordianTypes"));
const AccordionImageScroller = dynamic(() => import("../sections/accordian/AccordionImageScroller"));
const TubeLightSection = dynamic(() => import("../ui/TubeLight"));
const ScrollExpansionHero = dynamic(() => import("../sections/hero-sections/ScrollExpansionHero"));
const FloatingGalleryHero = dynamic(() => import("../sections/hero-sections/FloatingGalleryHero"));
const TestimonialSection = dynamic(() => import("../sections/testimonial/Testimonial"));
const ProcessSteps = dynamic(() => import("../sections/process/ProcessSteps"));
const FeatureGrid = dynamic(() => import("../sections/feature-grid/FeatureGrid"));
const InteractiveMap = dynamic(() => import("../sections/interactive-map/InteractiveMap"));
const PricingTable = dynamic(() => import("../sections/pricing/PricingTable"));
const TabsSection = dynamic(() => import("../sections/tabs/TabsSections"));

const CASE_STUDY_LAYOUTS = new Set([
  "case_study_listing",
  "case_study_slider",
  "case_study_slider_full_width",
  "case_study_load_more",
  "case_study_filter",
  "case_study_filter_dropdown",
]);

export default async function PageBuilder({ sections }) {
  if (!sections || !Array.isArray(sections)) return null;

  const needsCaseStudies = sections.some((block) =>
    CASE_STUDY_LAYOUTS.has(block?.acf_fc_layout)
  );
  const caseStudies = needsCaseStudies ? await getCaseStudies() : [];
  
  return (
    <>
      {sections.map((block, i) => {
        switch (block.acf_fc_layout) {
          case "hero_centered_bg":
            return <HeroCenteredBg key={i} data={block} />;
          case "kinetic_hero":
            return <KineticHero key={i} data={block} />;
          case "hero_with_image":
            return <HeroWithImage key={i} data={block} />; 
          case "centered_hero":   
            return <CenteredHero key={i} data={block} />;  
          case "content_media_block":
            return <ContentMediaBlock key={i} data={block} />;
          case "service_overview":
            return <ServiceOverview key={i} data={block} />;
          case "latest_insights":
            return <LatestInsights key={i} data={block} />;
          case "case_study_listing":
            return <CaseStudyListing key={i} data={block} caseStudiesData={caseStudies} />;
          case "case_study_slider":
            return <CaseStudySlider key={i} data={block} initialCaseStudies={caseStudies} />;
          case "case_study_slider_full_width":
            return <CaseStudySliderFullWidth key={i} data={block} initialCaseStudies={caseStudies} />;
          case "case_study_load_more":
            return <CaseStudyLoadMore key={i} data={block} initialCaseStudies={caseStudies} />;
          case "case_study_filter":
            return <CaseStudyFilter key={i} data={block} initialCaseStudies={caseStudies} />;
          case "case_study_filter_dropdown":
            return <CaseStudyDropDownFilter key={i} data={block} initialCaseStudies={caseStudies} />;
          case "team_section":
            return <TeamSection key={i} data={block} />;
          case "client_logo":
            return <ClientLogo key={i} data={block} />;
          case "scroller_section":
            return <StoryScroll key={i} data={block} />;
          case "accordion_section":
            return <AccordionSection key={i} data={block} />;
          case "accordion_image_scroller":
            return <AccordionImageScroller key={i} data={block} />;
          case "tube_light_section":
            return <TubeLightSection key={i} data={block} />;
          case "scroll_expansion_hero":
            return <ScrollExpansionHero key={i} data={block} />;
          case "testimonial_section":
            return <TestimonialSection key={i} data={block} />;
          case "floating_gallery_hero":
            return <FloatingGalleryHero key={i} data={block} />;
          case "process_steps":
            return <ProcessSteps key={i} data={block} />;
          case "feature_grid":
            return <FeatureGrid key={i} data={block} />;
          case "tab_section":
            return <TabsSection key={i} data={block} />;
          case "interactive_map":
            return (
              <>
                <InteractiveMap key={i} data={block} />
                <PricingTable />
              </>
            );
          default:
            return null;
        }
      })}
    </>
  );
}
