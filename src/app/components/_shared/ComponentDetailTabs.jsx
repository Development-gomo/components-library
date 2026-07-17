"use client";

import { useState } from "react";

export default function ComponentDetailTabs({ preview, codeHtml, rawCode, sourcePath }) {
  const [tab, setTab] = useState("preview");
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(rawCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="rounded-md border border-black/10 bg-white">
      <div className="flex items-center justify-between border-b border-black/10 px-4 py-2">
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => setTab("preview")}
            className={`rounded-sm px-3 py-1.5 text-sm font-medium transition-colors ${
              tab === "preview" ? "bg-[#1d7c68]/10 text-[#1d7c68]" : "text-[#4f535c] hover:text-[#151515]"
            }`}
          >
            Preview
          </button>
          <button
            type="button"
            onClick={() => setTab("code")}
            className={`rounded-sm px-3 py-1.5 text-sm font-medium transition-colors ${
              tab === "code" ? "bg-[#1d7c68]/10 text-[#1d7c68]" : "text-[#4f535c] hover:text-[#151515]"
            }`}
          >
            Code
          </button>
        </div>

        {tab === "code" && (
          <button
            type="button"
            onClick={handleCopy}
            className="rounded-sm border border-black/10 px-3 py-1.5 text-xs font-semibold uppercase text-[#4f535c] transition-colors hover:border-[#1d7c68] hover:text-[#1d7c68]"
          >
            {copied ? "Copied!" : "Copy code"}
          </button>
        )}
      </div>

      {tab === "preview" ? (
        <div className="max-h-[80vh] overflow-auto">{preview}</div>
      ) : (
        <div className="max-h-[80vh] overflow-auto">
          <p className="border-b border-white/10 bg-[#111316] px-4 py-2 font-mono text-xs text-white/52">
            {sourcePath}
          </p>
          <div
            className="[&_pre]:!m-0 [&_pre]:overflow-auto [&_pre]:p-4 [&_pre]:text-xs [&_pre]:leading-6"
            dangerouslySetInnerHTML={{ __html: codeHtml }}
          />
        </div>
      )}
    </div>
  );
}
