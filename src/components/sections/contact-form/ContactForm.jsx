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
      className={`py-15 md:py-30  px-6 ${custom_class || ""}`}
      style={background_color ? { backgroundColor: background_color } : undefined}
    >
      <div className="web-width">
      {sub_heading && (
        <div className="flex items-center gap-2 mb-2 md:mb-4">
          <span className="h-2 w-2 rounded-full bg-(--color-accent)" />
          <span className="subheading-label uppercase">{sub_heading}</span>
        </div>
      )}

      {heading && (
        <h2
          className="section-heading mb-6 md:mb-14"
          dangerouslySetInnerHTML={{ __html: heading }}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-12">
        {description && (
          <div
            className="max-w-123"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        )}

        <div>
          <CForm formId={select_form} />
        </div>
      </div>
      </div>
    </section>
  );
}
