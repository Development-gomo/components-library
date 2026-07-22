"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { groupSlug } from "@/lib/catalogSlug";
import { Input } from "@/components/shadcn-ui/input";
import { Badge } from "@/components/shadcn-ui/badge";
import { cn } from "@/lib/utils";

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

      <div className="relative px-1">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#a3a8b0]" />
        <Input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search components..."
          className="pl-9"
        />
      </div>

      <div className="flex flex-col gap-1 px-1">
        <Link
          href="/components"
          className={cn(
            "rounded-sm px-2 py-1.5 text-sm transition-colors",
            pathname === "/components" ? "bg-[#1d7c68]/10 text-[#1d7c68]" : "text-[#4f535c] hover:text-[#151515]"
          )}
        >
          Overview
        </Link>
        <Link
          href="/components/guide"
          className={cn(
            "rounded-sm px-2 py-1.5 text-sm transition-colors",
            pathname === "/components/guide" ? "bg-[#1d7c68]/10 text-[#1d7c68]" : "text-[#4f535c] hover:text-[#151515]"
          )}
        >
          Usage guide
        </Link>
      </div>

      <div className="flex flex-col gap-5">
        {filteredGroups.map((group) => {
          const gSlug = groupSlug(group.title);
          return (
            <div key={group.title}>
              <Link
                href={`/components#${gSlug}`}
                className="flex items-center gap-1.5 px-2 text-[15px] font-semibold uppercase tracking-wide text-[#8a8f99] transition-colors hover:text-[#1d7c68]"
              >
                {group.title}
                <Badge variant="outline" className="px-1.5 py-0 text-[10px] font-semibold normal-case">
                  {group.items.length}
                </Badge>
              </Link>
              <ul className="mt-1.5 flex flex-col gap-0.5">
                {group.items.map((item) => {
                  const href = `/components/${gSlug}/${item.id}`;
                  const isActive = pathname === href;
                  return (
                    <li key={item.id}>
                      <Link
                        href={href}
                        className={cn(
                          "block truncate rounded-sm px-2 py-1.5 text-sm transition-colors",
                          isActive
                            ? "bg-[#1d7c68]/10 text-[#1d7c68] font-medium"
                            : "text-[#4f535c] hover:bg-black/[0.03] hover:text-[#151515]"
                        )}
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
