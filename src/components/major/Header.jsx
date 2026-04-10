// src/components/major/Header.jsx

import Link from "next/link";
import Image from "next/image";
import { getThemeOptions } from "@/lib/api";

function extractLinksFromHtml(html) {
  if (!html) return [];
  const matches = Array.from(
    html.matchAll(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gim)
  );
  return matches
    .map((m) => ({
      href: m[1] || "#",
      label: m[2]?.replace(/<[^>]*>/g, "").trim() || "Link",
    }))
    .filter((item) => item.label);
}

export default async function Header() {
  const themeOptions = await getThemeOptions();

  const logoUrl =
    themeOptions?.header?.logo?.url ||
    themeOptions?.header?.header_logo?.url ||
    null;
  const navHtml =
    themeOptions?.header?.nav ||
    themeOptions?.header?.navigation ||
    null;
  const navLinks = extractLinksFromHtml(navHtml);
  const ctaText = themeOptions?.header?.cta_text || null;
  const ctaUrl = themeOptions?.header?.cta_url || "/contact";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-(--color-brand) text-white">
      <div className="web-width px-6 mx-auto flex items-center justify-between h-20">
        {/* LOGO */}
        <Link href="/">
          {logoUrl ? (
            <Image src={logoUrl} alt="Logo" width={160} height={40} className="object-contain" />
          ) : (
            <span className="text-xl font-semibold">GO MO</span>
          )}
        </Link>

        {/* NAV */}
        {navLinks.length > 0 && (
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-white/80 hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}

        {/* CTA */}
        {ctaText && (
          <Link
            href={ctaUrl}
            className="hidden md:inline-flex items-center gap-2 rounded-sm bg-(--color-accent) px-5 py-3 text-sm font-medium text-black transition-opacity hover:opacity-90"
          >
            {ctaText}
          </Link>
        )}
      </div>
    </header>
  );
}
