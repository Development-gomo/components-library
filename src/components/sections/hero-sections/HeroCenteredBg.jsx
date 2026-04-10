// Layout: hero_centered_bg
// Fields: hero_title, hero_description, button_row, background_image, background_color, background_video_url

import Image from "next/image";
import Link from "next/link";

export default function HeroCenteredBg({ data }) {
  if (!data) return null;

  const {
    hero_title,
    hero_description,
    button_row = [],
    background_image,
    background_color,
    background_video_url,
  } = data;

  const bgImg = background_image?.url || background_image?.sizes?.large;

  return (
    <section
      className="relative min-h-screen flex items-center justify-center text-center overflow-hidden"
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
          <source src={background_video_url.url} />
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
      <div className="relative web-width px-6 py-32 flex flex-col items-center gap-8">
        {hero_title && (
          <h1 className="text-8xl font-bold text-white max-w-4xl">{hero_title}</h1>
        )}

        {hero_description && (
          <div
            className="max-w-2xl text-white text-lg"
            dangerouslySetInnerHTML={{ __html: hero_description }}
          />
        )}

        {button_row?.length > 0 && (
          <div className="flex flex-wrap gap-4 justify-center">
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
    </section>
  );
}
