// Layout: hero_with_image
// Fields: hero_title, hero_description, button_row, hero_image, background_image, background_color, background_video_url, custom_class, custom_id

import Image from "next/image";
import Link from "next/link";

export default function HeroWithImage({ data }) {
  if (!data) return null;

  const {
    hero_title,
    hero_description,
    button_row = [],
    hero_image,
    background_image,
    background_color,
    background_video_url,
    custom_class,
    custom_id,
  } = data;

  const bgImg = background_image?.url || background_image?.sizes?.large;
  const heroImg = hero_image?.url || hero_image?.sizes?.large;

  return (
    <section
      id={custom_id || undefined}
      className={`relative min-h-screen flex items-center overflow-hidden${custom_class ? ` ${custom_class}` : ""}`}
      style={background_color && !bgImg && !background_video_url ? { backgroundColor: background_color } : {}}
    >
      {/* Background Video */}
      {background_video_url && (
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover -z-10"
        >
          <source src={background_video_url} />
        </video>
      )}

      {/* Background Image */}
      {bgImg && !background_video_url && (
        <Image
          src={bgImg}
          alt=""
          fill
          sizes="100vw"
          priority
          className="object-cover -z-10"
        />
      )}

      {/* Overlay */}
      {(bgImg || background_video_url) && (
        <div className="absolute inset-0 bg-black/40 -z-10" />
      )}

      {/* Content */}
      <div className="relative web-width px-6 py-24 w-full grid lg:grid-cols-2 gap-12 items-center">
        {/* LEFT — Text */}
        <div className="flex flex-col gap-8">
          {hero_title && (
            <h1 className="text-6xl font-bold text-white max-w-4xl">{hero_title}</h1>
          )}

          {hero_description && (
            <div
              className="text-white text-lg max-w-xl"
              dangerouslySetInnerHTML={{ __html: hero_description }}
            />
          )}

          {button_row?.length > 0 && (
            <div className="flex flex-wrap gap-4">
              {button_row.map((btn, i) => (
                <Link
                  key={i}
                  href={btn.button_link || "#"}
                  className={
                    i === 0
                      ? "inline-flex items-center gap-2 rounded-sm bg-(--color-accent) px-6 py-4 text-black font-medium hover:opacity-90 transition-opacity"
                      : "inline-flex items-center gap-2 rounded-sm border border-white px-6 py-4 text-white font-medium hover:bg-white/10 transition-colors"
                  }
                >
                  {btn.button_label}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT — Hero Image */}
        {heroImg && (
          <div className="relative h-[400px] lg:h-[600px] rounded-lg overflow-hidden">
            <Image
              src={heroImg}
              alt={hero_title || "Hero image"}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              priority
              className="object-cover"
            />
          </div>
        )}
      </div>
    </section>
  );
}
