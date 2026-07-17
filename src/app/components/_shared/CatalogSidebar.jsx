"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { groupSlug } from "@/lib/catalogSlug";

export default function CatalogSidebar({ groups }) {
  const pathname = usePathname();
  const [query, setQuery] = useState("");

  const normalizedQuery = query.trim().toLowerCase();

  const filteredGroups = useMemo(() => {
    if (!normalizedQuery) return groups;

    return groups
      .map((group) => ({
        ...group,
        items: group.items.filter((item) =>
          [item.name, item.layout, group.title].some((value) =>
            String(value).toLowerCase().includes(normalizedQuery)
          )
        ),
      }))
      .filter((group) => group.items.length > 0);
  }, [groups, normalizedQuery]);

  return (
    <nav className="flex h-full flex-col gap-4 overflow-y-auto px-4 py-6">
      <Link href="/components" className="px-1 text-sm font-semibold uppercase tracking-wide text-[#151515]">
        Component Library
      </Link>

      <div className="px-1">
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search components..."
          className="w-full rounded-sm border border-black/10 bg-white px-3 py-2 text-sm text-[#151515] outline-none focus:border-[#1d7c68]"
        />
      </div>

      <div className="flex flex-col gap-1 px-1">
        <Link
          href="/components"
          className={`rounded-sm px-2 py-1.5 text-sm transition-colors ${
            pathname === "/components" ? "bg-[#1d7c68]/10 text-[#1d7c68]" : "text-[#4f535c] hover:text-[#151515]"
          }`}
        >
          Overview
        </Link>
        <Link
          href="/components/guide"
          className={`rounded-sm px-2 py-1.5 text-sm transition-colors ${
            pathname === "/components/guide" ? "bg-[#1d7c68]/10 text-[#1d7c68]" : "text-[#4f535c] hover:text-[#151515]"
          }`}
        >
          Usage guide
        </Link>
      </div>

      <div className="flex flex-col gap-5">
        {filteredGroups.map((group) => {
          const gSlug = groupSlug(group.title);
          return (
            <div key={group.title}>
              <p className="px-2 text-xs font-semibold uppercase tracking-wide text-[#8a8f99]">
                {group.title} <span className="text-[#c2c6cc]">({group.items.length})</span>
              </p>
              <ul className="mt-1.5 flex flex-col gap-0.5">
                {group.items.map((item) => {
                  const href = `/components/${gSlug}/${item.id}`;
                  const isActive = pathname === href;
                  return (
                    <li key={item.id}>
                      <Link
                        href={href}
                        className={`block truncate rounded-sm px-2 py-1.5 text-sm transition-colors ${
                          isActive
                            ? "bg-[#1d7c68]/10 text-[#1d7c68] font-medium"
                            : "text-[#4f535c] hover:bg-black/[0.03] hover:text-[#151515]"
                        }`}
                      >
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}

        {filteredGroups.length === 0 && (
          <p className="px-2 text-sm text-[#8a8f99]">No components match &ldquo;{query}&rdquo;.</p>
        )}
      </div>
    </nav>
  );
}
