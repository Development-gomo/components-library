//src/components/major/PageBuilder.jsx

import dynamic from "next/dynamic";
import { getCaseStudies } from "@/lib/api";

const HeroCenteredBg = dynamic(() => import("../sections/hero-sections/HeroCenteredBg"));
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
          default:
            return null;
        }
      })}
    </>
  );
}
