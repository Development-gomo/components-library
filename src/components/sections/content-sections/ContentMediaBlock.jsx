// Layout: content_media_block
// Fields: title, content, image, button_row, image_position, background_color, custom_class, custom_id

import Image from "next/image";
import Link from "next/link";

export default function ContentMediaBlock({ data }) {
  if (!data) return null;

  const {
    title,
    content,
    image,
    button_row = [],
    image_position = "left",
    background_color,
    custom_class,
    custom_id,
  } = data;

  const imgUrl = image?.url || image?.sizes?.large;

  // On desktop: flex-row for left, flex-row-reverse for right
  // On mobile: image always on top (flex-col)
  const rowDirection =
    image_position === "right" ? "md:flex-row-reverse" : "md:flex-row";

  return (
    <section
      id={custom_id || undefined}
      className={`web-width px-6 py-16 md:py-24${custom_class ? ` ${custom_class}` : ""}`}
      style={background_color ? { backgroundColor: background_color } : {}}
    >
      <div className={`flex flex-col ${rowDirection} items-center gap-10 md:gap-16`}>
        {/* Image */}
        {imgUrl && (
          <div className="w-full md:w-1/2 relative aspect-[4/3] rounded-md overflow-hidden">
            <Image
              src={imgUrl}
              alt={image?.alt || title || ""}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
              className="object-cover"
            />
          </div>
        )}

        {/* Text content */}
        <div className="w-full md:w-1/2 flex flex-col gap-6">
          {title && (
            <h2 className="text-4xl font-bold">{title}</h2>
          )}

          {content && (
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: content }}
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
                      ? "inline-flex items-center gap-2 rounded-sm bg-(--color-accent) px-6 py-4 font-medium hover:opacity-90 transition-opacity"
                      : "inline-flex items-center gap-2 rounded-sm border border-current px-6 py-4 font-medium hover:opacity-70 transition-opacity"
                  }
                >
                  {btn.button_label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
