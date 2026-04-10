//src/components/major/PageBuilder.jsx

import dynamic from "next/dynamic";

const HeroCenteredBg = dynamic(() => import("../sections/hero-sections/HeroCenteredBg"));
const HeroWithImage  = dynamic(() => import("../sections/hero-sections/HeroWithImage"));

export default function PageBuilder({ sections }) {
  if (!sections || !Array.isArray(sections)) return null;

  return (
    <>
      {sections.map((block, i) => {
        switch (block.acf_fc_layout) {
          case "hero_centered_bg":
            return <HeroCenteredBg key={i} data={block} />;
          case "hero_with_image":
            return <HeroWithImage key={i} data={block} />; 

          default:
            return null;
        }
      })}
    </>
  );
}
