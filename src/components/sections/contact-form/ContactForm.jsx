import CForm from "./Cform";

export default function ContactForm({ data }) {
  if (!data) return null;

  const {
    sub_heading,
    heading,
    description,
    select_form,
    background_color,
    custom_id,
    custom_class,
  } = data;

  return (
    <section
      id={custom_id || undefined}
      className={`py-20 md:py-32 overflow-hidden ${custom_class || ""}`}
      style={background_color ? { backgroundColor: background_color } : undefined}
    >
      <div className="web-width px-6">

        {/* ── Header ── */}
        <div className="mb-5">
          <div className="w-10 h-0.5 bg-(--color-accent) mb-6 md:mb-8 sticky top-0" />

          {sub_heading && (
            <div className="flex items-center gap-2 mb-4">
              <span className="h-1.5 w-1.5 rounded-full bg-(--color-accent)" />
              <span className="subheading-label uppercase tracking-widest">
                {sub_heading}
              </span>
            </div>
          )}

          {heading && (
            <h2
              className="text-3xl max-w-3xl"
              dangerouslySetInnerHTML={{ __html: heading }}
            />
          )}
        </div>

        {/* ── Body: description + form ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-12 lg:gap-24 items-start">

          {/* Left — description, sticky on large screens */}
          {description && (
            <div className="lg:sticky lg:top-28">
              <div
                className="contact-description"
                dangerouslySetInnerHTML={{ __html: description }}
              />
              {/* Decorative accent bar */}
              <div className="mt-2 flex items-center gap-3">
                <span className="h-px flex-1 bg-black/8" />
                <span className="h-1.5 w-1.5 rounded-full bg-(--color-accent)" />
              </div>
            </div>
          )}

          {/* Right — form */}
          <div>
            <CForm formId={select_form} />
          </div>

        </div>
      </div>
    </section>
  );
}
