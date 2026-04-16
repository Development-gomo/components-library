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

function normalizeLink(link, fallbackLabel = "Link") {
  if (!link) return { href: "#", label: fallbackLabel, target: "_self" };

  if (typeof link === "string") {
    return { href: link || "#", label: fallbackLabel, target: "_self" };
  }

  return {
    href: link.url || "#",
    label: link.title || fallbackLabel,
    target: link.target || "_self",
  };
}

function pickFirstObject(candidates = []) {
  return candidates.find((item) => item && typeof item === "object" && !Array.isArray(item)) || {};
}

function resolveThemeOptions(data) {
  const candidates = [
    data?.options?.acf,
    data?.options,
    data?.data?.acf,
    data?.data,
    data?.acf,
    data,
  ];

  return pickFirstObject(candidates);
}

function normalizeMegaMenuRows(rawRows = []) {
  if (!Array.isArray(rawRows)) return [];

  return rawRows
    .map((row, rowIndex) => {
      const menuTitle = row?.menu_title?.trim() || `Menu ${rowIndex + 1}`;
      const titleLink = normalizeLink(row?.menu_title_link, menuTitle);
      const layoutType = row?.layout_type || "no_column";
      const sideImage = row?.side_image && typeof row.side_image === "string" ? row.side_image : null;

      const columns = Array.isArray(row?.columns)
        ? row.columns.map((column, colIndex) => {
            const links = Array.isArray(column?.links)
              ? column.links
                  .map((item, linkIndex) => {
                    const normalized = normalizeLink(item?.url, item?.label || `Submenu ${linkIndex + 1}`);
                    return {
                      key: `${rowIndex}-${colIndex}-${linkIndex}`,
                      label: item?.label?.trim() || normalized.label,
                      href: normalized.href,
                      target: normalized.target,
                    };
                  })
                  .filter((item) => item.label)
              : [];

            const hasCard = Boolean(column?.card?.title || column?.card?.description || column?.card?.button_link);
            const cardButton = normalizeLink(column?.card?.button_link, "Read more");

            return {
              key: `${rowIndex}-${colIndex}`,
              links,
              card: hasCard
                ? {
                    title: column?.card?.title || "",
                    description: column?.card?.description || "",
                    button: cardButton,
                  }
                : null,
            };
          })
        : [];

      return {
        key: `${menuTitle}-${rowIndex}`,
        title: menuTitle,
        titleLink,
        layoutType,
        sideImage,
        columns,
      };
    })
    .filter((row) => row.title);
}

function getColumnClass(layoutType) {
  if (layoutType === "three_column") return "md:grid-cols-3";
  if (layoutType === "two_column") return "md:grid-cols-2";
  return "md:grid-cols-1";
}

export default async function Header() {
  const themeOptions = await getThemeOptions();
  const optionsRoot = resolveThemeOptions(themeOptions);

  const headerOptions = pickFirstObject([
    optionsRoot?.header,
    optionsRoot?.header_options,
    optionsRoot?.global,
    optionsRoot,
  ]);

  const logoUrl =
    headerOptions?.logo?.url ||
    headerOptions?.header_logo?.url ||
    optionsRoot?.logo?.url ||
    null;
  const navHtml =
    headerOptions?.nav ||
    headerOptions?.navigation ||
    optionsRoot?.nav ||
    null;
  const megaMenuRows = normalizeMegaMenuRows(
    headerOptions?.mega_menu || optionsRoot?.mega_menu || optionsRoot?.global?.mega_menu || []
  );

  const navLinks = extractLinksFromHtml(navHtml);

  const ctaLink = normalizeLink(
    headerOptions?.cta_link || headerOptions?.cta_url || optionsRoot?.cta_link || optionsRoot?.cta_url,
    headerOptions?.cta_text || optionsRoot?.cta_text || "Get in touch"
  );
  const ctaText = headerOptions?.cta_text || optionsRoot?.cta_text || ctaLink.label || null;
  const ctaUrl = ctaLink.href || "/contact";
  const ctaTarget = ctaLink.target || "_self";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[rgb(23,29,45)]/95 text-white backdrop-blur-sm">
      <div className="web-width px-6 mx-auto flex items-center justify-between h-20 gap-4">
        {/* LOGO */}
        <Link href="/" className="shrink-0">
          {logoUrl ? (
            <Image src={logoUrl} alt="Logo" width={160} height={40} className="object-contain" />
          ) : (
            <span className="text-xl font-semibold">GO MO</span>
          )}
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden lg:flex items-center gap-7 grow justify-center">
          {megaMenuRows.length > 0
            ? megaMenuRows.map((menuRow) => {
                if (menuRow.layoutType === "no_column") {
                  return (
                    <Link
                      key={menuRow.key}
                      href={menuRow.titleLink.href}
                      target={menuRow.titleLink.target}
                      className="text-[15px] leading-none tracking-wide text-white/90 transition-colors hover:text-white"
                    >
                      {menuRow.title}
                    </Link>
                  );
                }

                return (
                  <div key={menuRow.key} className="relative group py-8 -my-8">
                    <Link
                      href={menuRow.titleLink.href}
                      target={menuRow.titleLink.target}
                      className="inline-flex items-center gap-1.5 text-[15px] leading-none tracking-wide text-white/90 transition-colors hover:text-white"
                    >
                      <span>{menuRow.title}</span>
                        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" className="transition-transform group-hover:rotate-180">
                        <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.4" />
                      </svg>
                    </Link>

                    <div className="pointer-events-none absolute left-1/2 top-full w-[min(1180px,calc(100vw-3rem))] -translate-x-1/2 pt-3 opacity-0 transition-all duration-200 group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100">
                      <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white text-slate-900 shadow-[0_30px_70px_-25px_rgba(8,15,40,0.55)]">
                        <div className={`grid ${menuRow.sideImage ? "md:grid-cols-[1fr_380px]" : "grid-cols-1"}`}>
                          <div className="bg-[#f5f6f9] p-6">
                            <div className={`grid gap-5 ${getColumnClass(menuRow.layoutType)}`}>
                              {menuRow.columns.map((column) =>
                                column.card ? (
                                  <article key={`${column.key}-card`} className="rounded-md border border-slate-200 bg-white p-5">
                                    {column.card.title && (
                                      <h3 className="text-xl font-semibold leading-snug text-slate-900">{column.card.title}</h3>
                                    )}
                                    {column.card.description && (
                                      <div
                                        className="mt-2 text-sm leading-relaxed text-slate-600"
                                        dangerouslySetInnerHTML={{ __html: column.card.description }}
                                      />
                                    )}
                                    {column.card.button?.href && (
                                      <Link
                                        href={column.card.button.href}
                                        target={column.card.button.target}
                                        className="mt-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#2f56d3] text-white transition-colors hover:bg-[#2849b5]"
                                        aria-label={column.card.button.label}
                                      >
                                        <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
                                          <path d="M3 9H15" stroke="currentColor" strokeWidth="1.6" />
                                          <path d="M10 4L15 9L10 14" stroke="currentColor" strokeWidth="1.6" />
                                        </svg>
                                      </Link>
                                    )}
                                  </article>
                                ) : (
                                  <div key={`${column.key}-spacer`} className="hidden md:block" />
                                )
                              )}
                            </div>

                            <div className={`mt-6 grid gap-7 ${getColumnClass(menuRow.layoutType)}`}>
                              {menuRow.columns.map((column) => (
                                <ul key={`${column.key}-links`} className="space-y-1">
                                  {column.links.map((subLink) => (
                                    <li key={subLink.key} className="border-b border-slate-200">
                                      <Link
                                        href={subLink.href}
                                        target={subLink.target}
                                        className="group/link flex items-center justify-between gap-3 py-3 text-sm text-slate-600 transition-colors hover:text-slate-900"
                                      >
                                        <span className="leading-tight">{subLink.label}</span>
                                        <span className="translate-x-0 transition-transform group-hover/link:translate-x-1">-&gt;</span>
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              ))}
                            </div>
                          </div>

                          {menuRow.sideImage && (
                            <div className="relative min-h-70 bg-slate-300">
                              <Image
                                src={menuRow.sideImage}
                                alt={`${menuRow.title} image`}
                                fill
                                className="object-cover"
                                sizes="(max-width: 1024px) 100vw, 380px"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            : navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-white/80 hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
        </nav>

        {/* MOBILE NAV */}
        <details className="lg:hidden relative ml-auto">
          <summary className="list-none cursor-pointer rounded border border-white/25 px-4 py-2 text-sm font-medium text-white/90 hover:bg-white/10">
            Menu
          </summary>
          <div className="absolute right-0 top-full mt-3 w-[min(92vw,360px)] rounded-xl border border-slate-200/70 bg-white p-4 text-slate-900 shadow-xl">
            <ul className="space-y-2">
              {megaMenuRows.length > 0
                ? megaMenuRows.map((menuRow) => (
                    <li key={`mobile-${menuRow.key}`} className="border-b border-slate-200 pb-2">
                      <Link
                        href={menuRow.titleLink.href}
                        target={menuRow.titleLink.target}
                        className="block py-2 text-[16px] font-semibold"
                      >
                        {menuRow.title}
                      </Link>

                      {menuRow.layoutType !== "no_column" && (
                        <ul className="pb-2">
                          {menuRow.columns.flatMap((column) => column.links).map((link) => (
                            <li key={`mobile-${link.key}`}>
                              <Link
                                href={link.href}
                                target={link.target}
                                className="block py-1 text-sm text-slate-700 hover:text-slate-900"
                              >
                                {link.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))
                : navLinks.map((link) => (
                    <li key={`mobile-${link.href}`} className="border-b border-slate-200 pb-2">
                      <Link href={link.href} className="block py-2 text-[16px] font-semibold">
                        {link.label}
                      </Link>
                    </li>
                  ))}
            </ul>
          </div>
        </details>

        {/* CTA */}
        {ctaText && (
          <Link
            href={ctaUrl}
            target={ctaTarget}
            className="hidden lg:inline-flex items-center gap-2 rounded-full bg-[#2f56d3] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#2849b5]"
          >
            {ctaText}
          </Link>
        )}
      </div>
    </header>
  );
}
