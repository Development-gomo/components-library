// src/components/major/PageBuilderCasestudy.jsx
import dynamic from "next/dynamic";

const CaseHero         = dynamic(() => import("../sections/single-casestudy/CaseHero"));
const CaseIntroduction = dynamic(() => import("../sections/single-casestudy/CaseIntroduction"));
const CaseChallenges   = dynamic(() => import("../sections/single-casestudy/CaseChallenges"));
const CaseSolution     = dynamic(() => import("../sections/single-casestudy/CaseSolution"));
const CaseTestimonial  = dynamic(() => import("../sections/single-casestudy/CaseTestimonial"));
const CaseResults      = dynamic(() => import("../sections/single-casestudy/CaseResults"));
const CaseCtaBanner    = dynamic(() => import("../sections/single-casestudy/CaseCtaBanner"));

export default function PageBuilderCasestudy({ sections }) {
  if (!sections || !Array.isArray(sections)) return null;

  return (
    <>
      {sections.map((block, i) => {
        switch (block.acf_fc_layout) {
          case "hero_section":
            return <CaseHero key={i} data={block} />;
          case "introduction_section":
            return <CaseIntroduction key={i} data={block} />;
          case "challenges_section":
            return <CaseChallenges key={i} data={block} />;
          case "solution_section":
            return <CaseSolution key={i} data={block} />;
          case "testimonial_banner":
            return <CaseTestimonial key={i} data={block} />;
          case "result_section":
            return <CaseResults key={i} data={block} />;
          case "cta_banner":
            return <CaseCtaBanner key={i} data={block} />;
          default:
            return null;
        }
      })}
    </>
  );
}
