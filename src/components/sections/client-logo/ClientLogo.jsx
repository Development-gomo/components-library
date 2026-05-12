// Layout: client_logo
// Fields: background_color, sub_heading, heading, description, logos (gallery),
//         display_type (slider | autoslider | grid), custom_class, custom_id

import Image from "next/image";
import ClientLogoSlider from "./ClientLogoSlider";

function LogoCard({ logo }) {
  return (
    <div className="border border-gray-200 rounded-xl h-24 w-45 flex items-center justify-center px-6 shrink-0 bg-white">
      <Image
        src={logo.url}
        alt={logo.alt}
        width={140}
        height={40}
        className="object-contain opacity-60 hover:opacity-100 transition-opacity duration-300"
      />
    </div>
  );
}

function SectionHeader({ sub_heading, heading, description }) {
  if (!sub_heading && !heading && !description) return null;
  return (
    <div className="text-center mb-12 md:mb-16">
      {sub_heading && (
        <p className="text-sm font-semibold tracking-widest uppercase text-[var(--color-accent)] mb-3">
          {sub_heading}
        </p>
      )}
      {heading && (
        <h2 className="text-3xl md:text-4xl font-semibold text-[var(--color-dark)] mb-4">
          {heading}
        </h2>
      )}
      {description && (
        <div
          className="text-base text-gray-500 max-w-2xl mx-auto [&_p]:m-0"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      )}
    </div>
  );
}

export default function ClientLogo({ data }) {
  if (!data) return null;

  const {
    background_color,
    sub_heading,
    heading,
    description,
    logos = [],
    display_type = "autoslider",
    custom_class,
    custom_id,
  } = data;

  if (!logos.length) return null;

  const items = logos.map((img) => ({
    url: img.url,
    alt: img.alt || "",
  }));

  return (
    <section
      id={custom_id || undefined}
      className={`w-full px-6 py-16 md:py-24${custom_class ? ` ${custom_class}` : ""}`}
      style={background_color ? { backgroundColor: background_color } : {}}
    >
      <div className="web-width mx-auto">
        <SectionHeader
          sub_heading={sub_heading}
          heading={heading}
          description={description}
        />

        {/* ── Slider: manual Swiper with arrows ───────────────────────────── */}
        {display_type === "slider" && <ClientLogoSlider logos={items} />}

        {/* ── Auto Slider: infinite CSS marquee ───────────────────────────── */}
        {display_type === "autoslider" && (
          <div className="relative flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
            <div className="flex gap-6 animate-marquee">
              {[...items, ...items].map((logo, i) => (
                <LogoCard key={i} logo={logo} />
              ))}
            </div>
            <div
              className="flex gap-6 animate-marquee absolute top-0 left-0"
              aria-hidden
            >
              {[...items, ...items].map((logo, i) => (
                <LogoCard key={`d-${i}`} logo={logo} />
              ))}
            </div>
          </div>
        )}

        {/* ── Grid: responsive logo grid ──────────────────────────────────── */}
        {display_type === "grid" && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {items.map((logo, i) => (
              <div
                key={i}
                className="border border-gray-200 rounded-xl h-24 flex items-center justify-center px-6 bg-white"
              >
                <Image
                  src={logo.url}
                  alt={logo.alt}
                  width={140}
                  height={40}
                  className="object-contain opacity-60 hover:opacity-100 transition-opacity duration-300"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
