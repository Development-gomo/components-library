"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

function getPostPath(item) {
  let slug = "";
  try {
    const pathname = new URL(item.url).pathname;
    slug = pathname.replace(/\/$/, "").split("/").pop();
  } catch {
    slug = item.slug || "";
  }
  if (!slug) return item.url || "#";

  switch (item.subtype) {
    case "post":
      return `/post/${slug}`;
    case "case-study":
      return `/case-study/${slug}`;
    default:
      return `/${slug}`;
  }
}

const TYPE_LABELS = {
  post: "Blog",
  page: "Page",
  "case-study": "Case Study",
};

function TypeBadge({ subtype }) {
  const label = TYPE_LABELS[subtype] || subtype;
  return (
    <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-(--color-accent)/15 text-(--color-accent)">
      {label}
    </span>
  );
}

export default function SearchBar() {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false); // drives CSS enter/exit
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const closeTimerRef = useRef(null);
  const debouncedQuery = useDebounce(query, 300);

  function openModal() {
    clearTimeout(closeTimerRef.current);
    setOpen(true);
    requestAnimationFrame(() => setVisible(true));
  }

  function closeModal() {
    setVisible(false);
    closeTimerRef.current = setTimeout(() => {
      setOpen(false);
      setQuery("");
      setResults([]);
    }, 200); // matches transition duration
  }

  // Body scroll lock + focus
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      requestAnimationFrame(() => inputRef.current?.focus());
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Fetch with AbortController so stale in-flight responses are discarded
  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.length < 2) return;
    const controller = new AbortController();
    setLoading(true);
    fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`, {
      signal: controller.signal,
    })
      .then((r) => r.json())
      .then((data) => setResults(Array.isArray(data) ? data : []))
      .catch((err) => { if (err.name !== "AbortError") setResults([]); })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [debouncedQuery]);

  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") closeModal(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={openModal}
        aria-label="Open search"
        className="flex items-center justify-center w-9 h-9 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
      >
        <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
        </svg>
      </button>

      {/* Modal overlay — always mounted while open, visible drives transition */}
      {open && (
        <div
          className={`fixed inset-0 z-300 flex items-start justify-center pt-[10vh] px-4 backdrop-blur-sm transition-all duration-200 ${
            visible ? "bg-black/70 opacity-100 h-screen" : "bg-black/0 opacity-0"
          }`}
          onClick={closeModal}
        >
          <div
            className={`w-full max-w-2xl transition-all duration-200 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Input box */}
            <div className="flex items-center gap-3 bg-white rounded-2xl px-5 py-4 shadow-2xl">
              <svg className="w-5 h-5 text-gray-400 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
              </svg>

              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search pages, posts, case studies…"
                className="flex-1 text-[17px] text-gray-900 placeholder-gray-400 outline-none bg-transparent"
              />

              {loading ? (
                <svg className="w-4 h-4 text-gray-400 animate-spin shrink-0" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="30 70" />
                </svg>
              ) : null}

              <button
                onClick={() => setOpen(false)}
                className="text-xs text-gray-400 hover:text-gray-600 border border-gray-200 rounded px-1.5 py-0.5 shrink-0 transition-colors cursor-pointer"
              >
                Esc
              </button>
            </div>

            {/* Results list */}
            {results.length > 0 && (
              <div className="mt-2 bg-white rounded-2xl shadow-2xl overflow-hidden divide-y divide-gray-100 max-h-[55vh] overflow-y-auto">
                {results.map((item) => (
                  <Link
                    key={`${item.subtype}-${item.id}`}
                    href={getPostPath(item)}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between gap-4 px-5 py-3.5 hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-sm text-gray-800 leading-snug line-clamp-1">
                      {item.title?.rendered || item.title}
                    </span>
                    <TypeBadge subtype={item.subtype} />
                  </Link>
                ))}
              </div>
            )}

            {/* Empty state */}
            {!loading && debouncedQuery.length >= 2 && results.length === 0 && (
              <div className="mt-2 bg-white rounded-2xl shadow-2xl px-5 py-5 text-sm text-gray-500 text-center">
                No results found for &ldquo;{query}&rdquo;
              </div>
            )}

            {/* Hint */}
            {query.length === 0 && (
              <p className="mt-3 text-center text-xs text-white/50">
                Type at least 2 characters to search
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
