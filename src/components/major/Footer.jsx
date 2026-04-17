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
  const megaMenu = themeOptions?.global?.mega_menu || [];

  const footerCta = themeOptions?.global?.footer_cta || {};
  // Copyright fields (assuming structure: themeOptions.global.copyright_left, copyright_right)
  const copyrightLeft = themeOptions?.global?.copyrights_left;
  const copyrightRight = themeOptions?.global?.copyrights_right;


  return (
    <footer className="bg-(--color-brand) text-white relative z-10 border-t border-[#9293a066]">
      <div className="mx-auto w-full web-width px-6 pb-12 pt-12">
        {/* MAIN GRID - 5 columns */}
        <div className="flex justify-between  gap-12 md:gap-20 pb-12">
          {/* CTA + Social */}
          <div className="col-span-1 flex flex-col justify-start">
            {footerCta?.cta_heading && (
              <h2 className="text-3xl font-bold mb-4">{footerCta.cta_heading}</h2>
            )}
             {footerCta?.short_text && (
              <p className="mb-4 text-white/80 max-w-80">{footerCta.short_text}</p>
            )}
          
            {footerCta?.cta_button_link?.url && (
              <Link href={footerCta.cta_button_link.url} className="w-40 text-center inline-block rounded bg-[#2f56d3] px-6 py-3 text-white font-medium hover:bg-[#2849b5] mb-4">
                {footerCta.cta_button_text || footerCta.cta_button_link.title}
              </Link>
            )}
            {socialLinks.length > 0 && (
              <div className="flex gap-3 mt-2">
                {socialLinks.map((item) => (
                  <Link key={item.social_media_name} href={item.social_media_link} target="_blank" aria-label={item.social_media_name}>
                    {SOCIAL_ICON_MAP[item.social_media_name] || null}
                  </Link>
                ))}
              </div>
            )}
          </div>


          {/* SERVICES (dynamic) */}
          {services.length > 0 && (
            <div>
              <p className="mb-4 text-[14px] font-medium uppercase tracking-widest text-[#5a7be6]">Services</p>
              <ul className="space-y-2 text-white/90">
                {services.map((s, idx) => (
                  <li key={s.title + idx}>
                    <Link href={s.url || "#"} className="hover:text-white/70">{s.title}</Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* QUICK LINKS (dynamic) */}
          {quickLinks.length > 0 && (
            <div>
              <p className="mb-4 text-[14px] font-medium uppercase tracking-widest text-[#5a7be6]">Quick Links</p>
              <ul className="space-y-2 text-white/90">
                {quickLinks.map((item) => (
                  <li key={item.title}>
                    <Link href={item.url || "#"} className="hover:text-white/70">{item.title}</Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* EXPLORE (dynamic from mega_menu) */}
          {megaMenu.length > 0 && (
            <div>
              <p className="mb-4 text-[14px] font-medium uppercase tracking-widest text-[#5a7be6]">Explore</p>
              <ul className="space-y-2 text-white/90">
                {megaMenu.map((item, idx) => (
                  <li key={item.menu_title + idx}>
                    <Link href={item.menu_title_link?.url || "#"} className="hover:text-white/70">{item.menu_title}</Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* CONTACT */}
          <div>
            <p className="mb-4 text-[14px] font-medium uppercase tracking-widest text-[#5a7be6]">Contact</p>
            <div className="space-y-2 text-white/90 text-sm">
              {contact.address && (
                <div dangerouslySetInnerHTML={{ __html: contact.address }} />
              )}
              {contact.email && (
                <div><a href={`mailto:${contact.email}`} className="hover:text-white/70">{contact.email}</a></div>
              )}
              {contact.phone && (
                <div><a href={`tel:${contact.phone}`} className="hover:text-white/70">{contact.phone}</a></div>
              )}
            </div>
          </div>
        </div>

        {/* COPYRIGHT BAR */}
        <div className="flex flex-col md:flex-row md:justify-between items-center gap-2 py-4 border-t border-white/10 text-xs md:text-sm text-white/70">
          {copyrightLeft && <div className="w-full md:w-1/2 text-center md:text-left [&_p]:m-0" dangerouslySetInnerHTML={{ __html: copyrightLeft }} />}
          {copyrightRight && <div className="w-full md:w-1/2 text-center md:text-right [&_p]:m-0 [&_a]:underline [&_a]:hover:text-white" dangerouslySetInnerHTML={{ __html: copyrightRight }} />}
        </div>
      </div>

    </footer>
  );
}
