// Layout: service_overview
// Fields: background_color, section_title, title, description, services_list (service_title, service_icon), button (button_text, button_url, button_style), image, image_position, custom_class, custom_id

import Image from "next/image";
import Link from "next/link";

export default function ServiceOverview({ data }) {
  if (!data) return null;

  const {
    background_color,
    section_title,
    title,
    description,
    services_list = [],
    button,
    image,
    image_position = "right",
    custom_class,
    custom_id,
  } = data;

  const imgUrl = image?.url || image?.sizes?.large;

  // On desktop: flex-row for left, flex-row-reverse for right
  // On mobile: image always on top (flex-col)
  const rowDirection =
    image_position === "left" ? "md:flex-row" : "md:flex-row-reverse";

  return (
    <section
      id={custom_id || undefined}
      className={`w-full px-6 py-16 md:py-24${custom_class ? ` ${custom_class}` : ""}`}
      style={background_color ? { backgroundColor: background_color } : {}}
    >
      <div className={`web-width mx-auto flex flex-col ${rowDirection} items-center gap-10 md:gap-16`}>
        {/* Image */}
        {imgUrl && (
          <div className="w-full md:w-1/2 relative rounded-md overflow-hidden" style={{ height: '550px' }}>
            <Image
              src={imgUrl}
              alt={image?.alt || title || ""}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div className="w-full md:w-1/2 flex flex-col gap-8">
          {/* Eyebrow */}
          {section_title && (
            <p className="text-sm font-semibold tracking-wider uppercase text-[#5a7be6]">
              {section_title}
            </p>
          )}

          {/* Title */}
          {title && (
            <h2 className="text-3xl md:text-5xl font-bold text-[#1E1E1E]">
              {title}
            </h2>
          )}

          {/* Description */}
          {description && (
            <div
              className="text-base md:text-lg text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          )}

          {/* Services List */}
          {services_list?.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {services_list.map((service, idx) => {
                const iconUrl = service.service_icon?.url || service.service_icon?.sizes?.thumbnail;
                
                return (
                  <div key={idx} className="flex items-start gap-4">
                    {/* Icon */}
                    {iconUrl && (
                      <div className="flex-shrink-0 w-10 h-10 bg-[#00fec3] rounded-md flex items-center justify-center">
                        <Image
                          src={iconUrl}
                          alt={service.service_icon?.alt || service.service_title || ""}
                          width={25}
                          height={25}
                          className="object-contain"
                        />
                      </div>
                    )}

                    {/* Service Title */}
                    {service.service_title && (
                      <p className="text-base font-medium text-[#1E1E1E] pt-2">
                        {service.service_title}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Button */}
          {button?.button_text && button?.button_url && (
            <div className="flex">
              <Link
                href={button.button_url}
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-md font-medium transition-colors ${
                  button.button_style === "secondary"
                    ? "bg-white text-[#00A7E1] border-2 border-[#2f56d3] hover:bg-[#2f56d3] hover:text-white"
                    : "bg-[#2f56d3] text-white hover:bg-[#2f56d3]"
                }`}
              >
                {button.button_text}
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
