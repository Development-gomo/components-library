// Layout: scroll_expansion_hero
// ACF Fields:
//   media_type        (select: video | image)
//   media_src         (text/url — direct video URL or YouTube URL)
//   poster_image      (image — shown while video loads)
//   background_image  (image — full-screen background before expansion)
//   title             (text — split: first word slides left, rest slides right)
//   date_label        (text — subtitle/label shown below the media)
//   scroll_to_expand  (text — CTA hint label, e.g. "Scroll to expand")
//   text_blend        (true_false — mix-blend-difference on title text)
//   content           (wysiwyg — body content revealed after full expansion)

import ScrollExpandMedia from '@/components/ui/scroll-expansion-hero';

export default function ScrollExpansionHero({ data }) {
  if (!data) return null;

  const {
    media_type = 'video',
    media_src,
    poster_image,
    background_image,
    title,
    date_label,
    scroll_to_expand,
    text_blend,
    content,
  } = data;

  // ACF may return an image object or null — always resolve to a plain string
  const mediaSrc = typeof media_src === 'string'
    ? media_src
    : media_src?.url || media_src?.sizes?.large || '';
  const posterSrc = poster_image?.url || poster_image?.sizes?.large || undefined;
  const bgImageSrc = background_image?.url || background_image?.sizes?.large || '';

  if (!mediaSrc || !bgImageSrc) return null;

  return (
    <ScrollExpandMedia
      mediaType={media_type}
      mediaSrc={mediaSrc}
      posterSrc={posterSrc}
      bgImageSrc={bgImageSrc}
      title={title}
      date={date_label}
      scrollToExpand={scroll_to_expand}
      textBlend={!!text_blend}
    >
      {content && (
        <div
          className='max-w-4xl mx-auto prose prose-invert'
          dangerouslySetInnerHTML={{ __html: content }}
        />
      )}
    </ScrollExpandMedia>
  );
}
