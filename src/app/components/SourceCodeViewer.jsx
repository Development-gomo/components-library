"use client";

import { useEffect, useState } from "react";

export default function SourceCodeViewer({ sourcePath }) {
  const [isOpen, setIsOpen] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function openCode() {
    setIsOpen(true);

    if (code || isLoading) return;

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/component-source?path=${encodeURIComponent(sourcePath)}`);
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.error || "Could not load source code.");
      }

      setCode(payload.code || "");
    } catch (err) {
      setError(err.message || "Could not load source code.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event) {
      if (event.key === "Escape") setIsOpen(false);
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className="mt-3">
      <button
        type="button"
        onClick={openCode}
        className="block w-full break-words rounded-sm bg-[#f4f5f0] px-3 py-2 text-left font-mono text-xs leading-5 text-[#3d3f46] transition-colors hover:bg-[#e9efe4]"
      >
        <span>{sourcePath}</span>
        <span className="ml-2 font-sans text-[11px] font-semibold uppercase text-[#1d7c68]">
          View code
        </span>
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/72 px-4 py-6 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={`${sourcePath} source code`}
          onClick={() => setIsOpen(false)}
        >
          <div
            className="flex max-h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-md border border-white/10 bg-[#111316] shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex flex-col gap-3 border-b border-white/10 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase text-[var(--color-accent)]">
                  Source code
                </p>
                <p className="mt-1 break-words font-mono text-xs text-white/52">{sourcePath}</p>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="shrink-0 rounded-sm border border-white/14 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                Close
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-auto">
              {isLoading && <p className="px-5 py-8 text-sm text-white/60">Loading source code...</p>}
              {error && <p className="px-5 py-8 text-sm text-red-200">{error}</p>}
              {!isLoading && !error && code && (
                <pre className="min-h-full overflow-auto p-5 text-xs leading-5 text-white/82">
                  <code>{code}</code>
                </pre>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
