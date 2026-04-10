// src/components/major/Footer.jsx

import Link from "next/link";
import Image from "next/image";
import { getThemeOptions } from "@/lib/api";

import LinkedInPng from "../../../public/linkedin.png";
import XPng from "../../../public/x.png";

const SOCIAL_ICON_MAP = {
  linkedin: LinkedInPng,
  x: XPng,
};

export default async function Footer() {
  const themeOptions = await getThemeOptions();

  const footerLogo = themeOptions?.footer?.footer_logo;
  const copyrightText = themeOptions?.footer?.copyrights_text;

  const quickLinks = themeOptions?.footer?.quick_links || [];
  const services = themeOptions?.footer?.services || [];
  const offices = themeOptions?.footer?.offices || [];

  const socialLinks = [];
  if (themeOptions?.social?.linkedin) socialLinks.push(["linkedin", themeOptions.social.linkedin]);
  if (themeOptions?.social?.x) socialLinks.push(["x", themeOptions.social.x]);

  return (
    <footer className="bg-(--color-brand) text-white relative z-10 border-t border-[#9293a066]">
      <div className="mx-auto w-full web-width px-6 pb-12 pt-12">

        {/* MAIN GRID */}
        {(quickLinks.length > 0 || services.length > 0 || offices.length > 0) && (
          <div className="grid md:grid-cols-2 gap-12 pb-12">
            {quickLinks.length > 0 && (
              <ul className="space-y-4">
                {quickLinks.map((item) => (
                  <li key={item.label} className="border-b border-white/10 py-3 text-xl md:text-[32px]">
                    <Link href={item.url || "#"} className="hover:text-white/70">{item.label}</Link>
                  </li>
                ))}
              </ul>
            )}

            {(services.length > 0 || offices.length > 0) && (
              <div className="grid grid-cols-2 gap-10">
                {services.length > 0 && (
                  <div>
                    <p className="mb-6 text-[14px] font-medium uppercase tracking-widest text-[#9192A0]">Services</p>
                    <ul className="space-y-2 text-white/90">
                      {services.map((s) => (
                        <li key={s.label}>
                          <Link href={s.url || "#"} className="hover:text-white/70">{s.label}</Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {offices.length > 0 && (
                  <div>
                    <p className="mb-6 text-[14px] font-medium uppercase tracking-widest text-[#9192A0]">Offices</p>
                    <div className="space-y-4">
                      {offices.map((o) => (
                        <div key={o.title}>
                          <p className="font-medium uppercase mb-1">{o.title}</p>
                          <p className="text-white/80 text-sm">{o.address}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* BOTTOM ROW */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pt-6 border-t border-white/10">
          {footerLogo?.url && (
            <Image src={footerLogo.url} alt="Logo" width={160} height={40} className="object-contain opacity-80" />
          )}

          {copyrightText && (
            <p className="text-[#9192A0] text-sm" dangerouslySetInnerHTML={{ __html: copyrightText }} />
          )}

          {socialLinks.length > 0 && (
            <div className="flex gap-3">
              {socialLinks.map(([network, url]) => (
                <Link key={network} href={url} target="_blank">
                  <Image src={SOCIAL_ICON_MAP[network]} width={31} height={31} alt={network} />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
