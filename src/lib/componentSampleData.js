// Sample ACF-shaped `data` objects used to live-render components in the
// /components catalog without a WordPress backend. Keyed by the same `layout`
// string produced by componentCatalog.js.
//
// Only components with a simple, self-contained data contract get an entry here.
// Components that depend on live external data (case-study listings, sliders that
// fetch case studies, team members, blog posts, the interactive map, CPT tabs)
// are intentionally left out — the catalog falls back to their static preview
// image instead of faking a render.
//
// `heavy: true` marks components with a continuous animation loop (requestAnimationFrame,
// scroll-linked physics, autoplaying carousels) that are fine to live-render one at a
// time on a detail page, but would be wasteful/janky mounted a dozen times at once in
// the small scaled-down overview grid. LivePreview falls back to the static image for
// these in card mode and only live-renders them in full mode.

const placeholderImage = (seed, w = 1200, h = 800) => ({
  url: `https://picsum.photos/seed/${seed}/${w}/${h}`,
  alt: seed,
});

export const sampleDataByLayout = {
  centered_hero: {
    data: {
      hero_title: "Build better pages, faster.",
      hero_description: "<p>A short line of supporting copy that explains the value of this section.</p>",
      button_row: [
        { button_label: "Get started", button_link: "#" },
        { button_label: "Learn more", button_link: "#" },
      ],
      background_image: placeholderImage("centered-hero"),
    },
  },

  hero_with_image: {
    data: {
      hero_title: "Design systems that scale with you.",
      hero_description: "<p>Ship consistent, reusable UI across every product surface.</p>",
      button_row: [
        { button_label: "View components", button_link: "#" },
        { button_label: "Talk to us", button_link: "#" },
      ],
      hero_image: placeholderImage("hero-with-image", 900, 900),
      background_color: "#111316",
    },
  },

  hero_centered_bg: {
    data: {
      hero_title: "One library. Every layout.",
      hero_description: "<p>Documented, previewable, ready-to-wire section components.</p>",
      button_row: [
        { button_label: "Browse components", button_link: "#" },
        { button_label: "Read the guide", button_link: "#" },
      ],
      background_image: placeholderImage("hero-centered-bg"),
    },
  },

  floating_gallery_hero: {
    heavy: true,
    data: {
      hero_title: "Crafted, not templated.",
      hero_description: "<p>A floating gallery hero with mouse-parallax depth.</p>",
      cta_text: "Explore the library",
      cta_url: "#",
      background_color: "#f0ece6",
      text_color: "#1a1a1a",
      items: [
        { image: placeholderImage("gallery-1", 400, 520) },
        { image: placeholderImage("gallery-2", 400, 520) },
        { image: placeholderImage("gallery-3", 400, 520) },
        { image: placeholderImage("gallery-4", 400, 520) },
        { image: placeholderImage("gallery-5", 400, 520) },
      ],
    },
  },

  content_media_block: {
    data: {
      title: "Built for real content teams.",
      content: "<p>Drop images and copy into a two-column layout that adapts to either side.</p>",
      image: placeholderImage("content-media-block", 900, 700),
      image_position: "left",
      button_row: [{ button_label: "Learn more", button_link: "#" }],
    },
  },

  service_overview: {
    data: {
      section_title: "What we do",
      title: "Services built around your product.",
      description: "<p>A flexible layout for listing services alongside supporting imagery.</p>",
      services_list: [
        { service_title: "Design systems", service_icon: placeholderImage("service-1", 80, 80) },
        { service_title: "Frontend engineering", service_icon: placeholderImage("service-2", 80, 80) },
        { service_title: "CMS integration", service_icon: placeholderImage("service-3", 80, 80) },
        { service_title: "Ongoing support", service_icon: placeholderImage("service-4", 80, 80) },
      ],
      button: { button_text: "Get started", button_url: "#", button_style: "primary" },
      image: placeholderImage("service-overview", 900, 700),
      image_position: "right",
    },
  },

  client_logo: {
    data: {
      sub_heading: "Trusted by",
      heading: "Teams shipping with this library",
      display_type: "autoslider",
      logos: [
        placeholderImage("logo-1", 160, 60),
        placeholderImage("logo-2", 160, 60),
        placeholderImage("logo-3", 160, 60),
        placeholderImage("logo-4", 160, 60),
        placeholderImage("logo-5", 160, 60),
      ],
    },
  },

  feature_grid: {
    data: {
      section_title: "Features",
      heading: "Everything you need to ship a page",
      description: "<p>Reusable, documented sections that cover most marketing layouts.</p>",
      grid_style: "grid",
      accent_color: "#00fec3",
      text_color: "#1a1a1a",
      features: [
        { feature_title: "Live previews", feature_description: "<p>See the real component, not a mockup.</p>", feature_tag: "New" },
        { feature_title: "Copyable source", feature_description: "<p>Grab the exact JSX for each section.</p>" },
        { feature_title: "CMS field docs", feature_description: "<p>Know exactly what ACF fields to fill in.</p>" },
      ],
    },
  },

  process_steps: {
    data: {
      section_title: "How it works",
      heading: "From block to page in four steps",
      process_style: "cards",
      accent_color: "#00fec3",
      text_color: "#1a1a1a",
      steps: [
        { step_title: "Pick a component", step_description: "<p>Browse the catalog and copy its layout key.</p>" },
        { step_title: "Fill in fields", step_description: "<p>Match the CMS fields shown on the card.</p>" },
        { step_title: "Render", step_description: "<p>PageBuilder wires it up automatically.</p>" },
        { step_title: "Ship it", step_description: "<p>Check mobile, then publish.</p>" },
      ],
    },
  },

  accordion_section: {
    data: {
      sub_heading: "FAQ",
      heading: "Common questions",
      accordion_style: "simple",
      accordion: [
        { question: "How do I add a new component?", answer: "<p>Create the file, register it in PageBuilder, and add a Layout comment.</p>" },
        { question: "Can I preview a component without CMS data?", answer: "<p>Yes — add a sample data entry and it renders live in the catalog.</p>" },
        { question: "Where does the source code come from?", answer: "<p>It's read directly from the file on disk through a whitelisted API route.</p>" },
      ],
    },
  },

  testimonial_section: {
    data: {
      sub_heading: "Testimonials",
      heading: "Loved by teams everywhere",
      description: "<p>See what our customers have to say about working with us.</p>",
      testimonial_style: "gridview",
      testimonial: [
        {
          testimonial_content: "This library cut our build time in half. Everything just works out of the box.",
          testimonial_name: "Ava Thompson",
          testimonial_designation: "Product Designer, Northwind",
          testimonial_image: placeholderImage("testimonial-1", 200, 200),
        },
        {
          testimonial_content: "The component docs made onboarding new developers painless.",
          testimonial_name: "Marcus Lee",
          testimonial_designation: "Frontend Lead, Vellum",
          testimonial_image: placeholderImage("testimonial-2", 200, 200),
        },
        {
          testimonial_content: "Clean, consistent, and easy to extend. Exactly what we needed.",
          testimonial_name: "Priya Nair",
          testimonial_designation: "CTO, Fieldwork",
          testimonial_image: placeholderImage("testimonial-3", 200, 200),
        },
      ],
    },
  },

  testimonial_section_with_logo: {
    data: {
      heading: "What teams say",
      description: "<p>Feedback from teams using the library day to day.</p>",
      testimonial: [
        {
          testimonial_content: "We shipped our new marketing site twice as fast.",
          testimonial_name: "Jordan Blake",
          testimonial_designation: "Head of Design, Vellum",
          testimonial_image: placeholderImage("logo-testimonial-1", 100, 100),
          client_logo: placeholderImage("logo-testimonial-logo-1", 140, 40),
        },
        {
          testimonial_content: "The live previews made handoff painless.",
          testimonial_name: "Sam Ortiz",
          testimonial_designation: "Engineering Lead, Northwind",
          testimonial_image: placeholderImage("logo-testimonial-2", 100, 100),
          client_logo: placeholderImage("logo-testimonial-logo-2", 140, 40),
        },
      ],
    },
  },

  tab_section: {
    data: {
      sub_heading: "Explore",
      heading: "One component, many looks",
      tab_style: "top",
      tab: [
        {
          tab_label: "Overview",
          testimonial_name: "<p>Every section supports multiple style variants through a single ACF select field.</p>",
          tab_media: "image",
          tab_content_image: placeholderImage("tab-1", 900, 560),
        },
        {
          tab_label: "Fields",
          testimonial_name: "<p>Field names are documented directly on each component's card.</p>",
          tab_media: "image",
          tab_content_image: placeholderImage("tab-2", 900, 560),
        },
        {
          tab_label: "Code",
          testimonial_name: "<p>Copy the exact source straight from the detail page.</p>",
          tab_media: "image",
          tab_content_image: placeholderImage("tab-3", 900, 560),
        },
      ],
    },
  },

  contact_form_section: {
    data: {
      sub_heading: "Get in touch",
      heading: "Let's start a conversation",
      description: "<p>Fill out the form and our team will get back to you within one business day.</p>",
      select_form: "",
    },
  },
};

export function getSampleData(layout) {
  return sampleDataByLayout[layout]?.data || null;
}

export function isHeavyPreview(layout) {
  return Boolean(sampleDataByLayout[layout]?.heavy);
}
