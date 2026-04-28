"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

function getColumnClass(layoutType) {
  if (layoutType === "three_column") return "md:grid-cols-3";
  if (layoutType === "two_column") return "md:grid-cols-2";
  return "md:grid-cols-1";
}

export default function HeaderComponent(props) {
  const { logoUrl, megaMenuRows, navLinks, ctaText, ctaUrl, ctaTarget } = props;

  const [mobileOpen, setMobileOpen] = useState(false);
  const [openSubmenus, setOpenSubmenus] = useState({});

  const toggleSubmenu = (key) => {
    setOpenSubmenus((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[rgb(23,29,45)]/95 text-white backdrop-blur-sm">
      <div className="web-width px-6 mx-auto flex flex-row items-center justify-between h-20 gap-4">
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

        {/* MOBILE NAV - FLYOUT */}
        <button
          className="lg:hidden ml-auto flex items-center justify-center w-10 h-10 rounded border border-white/25 text-white hover:bg-white/10"
          aria-label="Open menu"
          onClick={() => setMobileOpen(true)}
        >
          <svg width="28" height="28" fill="none" viewBox="0 0 28 28">
            <rect y="6" width="28" height="2.5" rx="1.25" fill="currentColor" />
            <rect y="13" width="28" height="2.5" rx="1.25" fill="currentColor" />
            <rect y="20" width="28" height="2.5" rx="1.25" fill="currentColor" />
          </svg>
        </button>

        {mobileOpen && (
          <div className="fixed inset-0 z-999 bg-black/40 flex">
            <div className="relative w-full h-screen bg-white text-slate-900 shadow-xl flex flex-col">
              <button
                className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-100"
                aria-label="Close menu"
                onClick={() => setMobileOpen(false)}
              >
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <path d="M6 6L16 16" stroke="currentColor" strokeWidth="2" />
                  <path d="M16 6L6 16" stroke="currentColor" strokeWidth="2" />
                </svg>
              </button>
              <div className="p-6 pt-12 flex-1 h-full w-full">
                <ul className="space-y-2">
                  {megaMenuRows.length > 0
                    ? megaMenuRows.map((menuRow) => (
                        <li key={`mobile-${menuRow.key}`} className="border-b border-slate-200 pb-2">
                          {menuRow.layoutType !== "no_column" ? (
                            <>
                              <button
                                className="flex w-full items-center justify-between py-2 text-[16px] font-semibold"
                                onClick={() => toggleSubmenu(menuRow.key)}
                                aria-expanded={!!openSubmenus[menuRow.key]}
                              >
                                <span>{menuRow.title}</span>
                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className={`transition-transform ${openSubmenus[menuRow.key] ? "rotate-90" : "rotate-0"}`}>
                                  <path d="M6 4L12 9L6 14" stroke="currentColor" strokeWidth="2" />
                                </svg>
                              </button>
                              {openSubmenus[menuRow.key] && (
                                <ul className="pl-3 pb-2">
                                  {menuRow.columns.flatMap((column) => column.links).map((link) => (
                                    <li key={`mobile-${link.key}`}>
                                      <Link
                                        href={link.href}
                                        target={link.target}
                                        className="block py-1 text-[15px] text-slate-700 hover:text-slate-900"
                                        onClick={() => setMobileOpen(false)}
                                      >
                                        {link.label}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </>
                          ) : (
                            <Link
                              href={menuRow.titleLink.href}
                              target={menuRow.titleLink.target}
                              className="block py-2 text-[16px] font-semibold"
                              onClick={() => setMobileOpen(false)}
                            >
                              {menuRow.title}
                            </Link>
                          )}
                        </li>
                      ))
                    : navLinks.map((link) => (
                        <li key={`mobile-${link.href}`} className="border-b border-slate-200 pb-2">
                          <Link
                            href={link.href}
                            className="block py-2 text-[16px] font-semibold"
                            onClick={() => setMobileOpen(false)}
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                </ul>
              </div>
            </div>
            <div className="flex-1" onClick={() => setMobileOpen(false)} />
          </div>
        )}

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
