// src/components/major/Footer.jsx

import Link from "next/link";
import { FaLinkedin, FaFacebook, FaYoutube } from "react-icons/fa";
import { getThemeOptions } from "@/lib/api";
import { TextHoverEffect, FooterBackgroundGradient } from "@/components/ui/hover-footer";

const SOCIAL_ICON_MAP = {
  Linkedin: <FaLinkedin size={20} />,
  Facebook: <FaFacebook size={20} />,
  Youtube:  <FaYoutube  size={20} />,
};

export default async function Footer() {
  const themeOptions = await getThemeOptions();

  const quickLinks    = themeOptions?.global?.quick_links_group?.quick_links || [];
  const services      = themeOptions?.global?.services?.service_links        || [];
  const resources     = themeOptions?.global?.resources?.resource_links      || [];
  const socialLinks   = themeOptions?.global?.social_links                   || [];
  const contact       = themeOptions?.global?.contact                        || {};
  const footerCta     = themeOptions?.global?.footer_cta                     || {};
  const footer_text_sparkal = themeOptions?.global?.footer_text_sparkal     || '';
  const copyrightLeft  = themeOptions?.global?.copyrights_left;
  const copyrightRight = themeOptions?.global?.copyrights_right;

  // Text shown in the large hover effect — falls back to a brand name
  const hoverText = themeOptions?.global?.brand_name || footer_text_sparkal || '';

  return (
    <footer className="relative overflow-hidden bg-[#0a0a0c] text-white border-t border-white/5">

      <FooterBackgroundGradient />

      <div className="relative z-10 mx-auto w-full web-width px-6 pt-16 pb-0">

        {/* ── Link columns (5 col) ────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-[4fr_2fr_2fr_2fr_2fr] gap-12 py-14 border-b border-white/10">


          {/* Col 1 — Brand */}
          <div className="col-span-2 md:col-span-1">
            {footerCta?.cta_heading && (
              <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-3">
                {footerCta.cta_heading}
              </h2>
            )}
            {footerCta?.short_text && (
              <p className="text-sm text-white/40 leading-relaxed mb-5">
                {footerCta.short_text}
              </p>
            )}
            {socialLinks.length > 0 && (
              <div className="flex items-center gap-2.5 flex-wrap">
                {socialLinks.map((item) => (
                  <Link
                    key={item.social_media_name}
                    href={item.social_media_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.social_media_name}
                    className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-[#3ca2fa] hover:border-[#3ca2fa]/40 transition-colors"
                  >
                    {SOCIAL_ICON_MAP[item.social_media_name] || null}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Col 2 — Services */}
          {services.length > 0 && (
            <div>
              <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.15em] text-[#3ca2fa]">
                Services
              </p>
              <ul className="space-y-3">
                {services.map((s, idx) => (
                  <li key={s.title + idx}>
                    <Link
                      href={s.url || "#"}
                      className="text-sm text-white/50 hover:text-white transition-colors"
                    >
                      {s.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Col 3 — Quick Links */}
          {quickLinks.length > 0 && (
            <div>
              <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.15em] text-[#3ca2fa]">
                Quick Links
              </p>
              <ul className="space-y-3">
                {quickLinks.map((item) => (
                  <li key={item.title}>
                    <Link
                      href={item.url || "#"}
                      className="text-sm text-white/50 hover:text-white transition-colors"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Col 4 — Resources */}
          {resources.length > 0 && (
            <div>
              <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.15em] text-[#3ca2fa]">
                Resources
              </p>
              <ul className="space-y-3">
                {resources.map((item) => (
                  <li key={item.title}>
                    <Link
                      href={item.url || "#"}
                      className="text-sm text-white/50 hover:text-white transition-colors"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Col 5 — Contact */}
          <div>
            <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.15em] text-[#3ca2fa]">
              Contact
            </p>
            <div className="space-y-3 text-sm text-white/50">
              {contact.address && (
                <div
                  className="leading-relaxed [&_p]:m-0"
                  dangerouslySetInnerHTML={{ __html: contact.address }}
                />
              )}
              {contact.email && (
                <a
                  href={`mailto:${contact.email}`}
                  className="block hover:text-white transition-colors"
                >
                  {contact.email}
                </a>
              )}
              {contact.phone && (
                <a
                  href={`tel:${contact.phone}`}
                  className="block hover:text-white transition-colors"
                >
                  {contact.phone}
                </a>
              )}
            </div>
          </div>

        </div>

        {/* ── Copyright bar ───────────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:justify-between items-center gap-2 py-5 text-xs text-white/30">
          {copyrightLeft && (
            <div
              className="w-full md:w-1/2 text-center md:text-left [&_p]:m-0"
              dangerouslySetInnerHTML={{ __html: copyrightLeft }}
            />
          )}
          {copyrightRight && (
            <div
              className="w-full md:w-1/2 text-center md:text-right [&_p]:m-0 [&_a]:underline [&_a]:hover:text-white"
              dangerouslySetInnerHTML={{ __html: copyrightRight }}
            />
          )}
        </div>

      </div>

      {/* ── Large hover-text brand watermark ────────────────────────────── */}
      <div className="relative z-10 hidden lg:flex h-52 -mb-6 overflow-hidden">
        <TextHoverEffect text={hoverText} duration={0} />
      </div>

    </footer>
  );
}
