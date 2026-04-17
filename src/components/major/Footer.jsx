// src/components/major/Footer.jsx


import Link from "next/link";
import { FaLinkedin, FaFacebook, FaYoutube } from "react-icons/fa";
import { getThemeOptions } from "@/lib/api";


const SOCIAL_ICON_MAP = {
  Linkedin: <FaLinkedin size={31} />,
  Facebook: <FaFacebook size={31} />,
  Youtube: <FaYoutube size={31} />,
};


export default async function Footer() {
  const themeOptions = await getThemeOptions();

  // New data structure
  const quickLinks = themeOptions?.global?.quick_links_group?.quick_links || [];
  const services = themeOptions?.global?.services?.service_links || [];
  const socialLinks = themeOptions?.global?.social_links || [];
  const contact = themeOptions?.global?.contact || {};

  const footerCta = themeOptions?.global?.footer_cta || {};
  // Copyright fields (assuming structure: themeOptions.global.copyright_left, copyright_right)
  const copyrightLeft = themeOptions?.global?.copyright_left || "© 2026 GOMO Group. All rights reserved.";
  const copyrightRight = themeOptions?.global?.copyright_right || "";

  return (
    <footer className="bg-(--color-brand) text-white relative z-10 border-t border-[#9293a066]">
      <div className="mx-auto w-full web-width px-6 pb-12 pt-12">
        {/* MAIN GRID */}
        {(quickLinks.length > 0 || services.length > 0 || contact.address) && (
          <div className="grid md:grid-cols-2 gap-12 pb-12">
            {quickLinks.length > 0 && (
              <ul className="space-y-4">
                {quickLinks.map((item) => (
                  <li key={item.title} className="border-b border-white/10 py-3 text-xl md:text-[32px]">
                    <Link href={item.url || "#"} className="hover:text-white/70">{item.title}</Link>
                  </li>
                ))}
              </ul>
            )}
            {(services.length > 0 || contact.address) && (
              <div className="grid grid-cols-2 gap-10">
                {services.length > 0 && (
                  <div>
                    <p className="mb-6 text-[14px] font-medium uppercase tracking-widest text-[#9192A0]">Services</p>
                    <ul className="space-y-2 text-white/90">
                      {services.map((s) => (
                        <li key={s.title}>
                          <Link href={s.url || "#"} className="hover:text-white/70">{s.title}</Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {contact.address && (
                  <div>
                    <p className="mb-6 text-[14px] font-medium uppercase tracking-widest text-[#9192A0]">Contact</p>
                    <div className="space-y-4">
                      <div>
                        <div className="text-white/80 text-sm" dangerouslySetInnerHTML={{ __html: contact.address }} />
                        {contact.email && (
                          <p className="mt-2"><a href={`mailto:${contact.email}`} className="hover:text-white/70">{contact.email}</a></p>
                        )}
                        {contact.phone && (
                          <p className="mt-1"><a href={`tel:${contact.phone}`} className="hover:text-white/70">{contact.phone}</a></p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* CTA Row */}
        {footerCta?.cta_heading && (
          <div className="flex flex-col items-center justify-center gap-4 py-8">
            <h2 className="text-2xl font-bold">{footerCta.cta_heading}</h2>
            {footerCta.cta_button_link?.url && (
              <Link href={footerCta.cta_button_link.url} className="inline-block rounded-full bg-[#2f56d3] px-6 py-2 text-white font-medium hover:bg-[#2849b5]">
                {footerCta.cta_button_text || footerCta.cta_button_link.title}
              </Link>
            )}
          </div>
        )}

        {/* BOTTOM ROW */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pt-6 border-t border-white/10">
          {socialLinks.length > 0 && (
            <div className="flex gap-3 order-2 md:order-2">
              {socialLinks.map((item) => (
                <Link key={item.social_media_name} href={item.social_media_link} target="_blank" aria-label={item.social_media_name}>
                  {SOCIAL_ICON_MAP[item.social_media_name] || null}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* COPYRIGHT BAR */}
        <div className="flex flex-col md:flex-row md:justify-between items-center gap-2 py-4 border-t border-white/10 text-xs md:text-sm text-white/70">
          <div className="w-full md:w-1/2 text-center md:text-left">{copyrightLeft}</div>
          <div className="w-full md:w-1/2 text-center md:text-right">{copyrightRight}</div>
        </div>
      </div>
    </footer>
  );
}
