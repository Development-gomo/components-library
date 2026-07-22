"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/shadcn-ui/tabs";
import { Button } from "@/components/shadcn-ui/button";

export default function ComponentDetailTabs({ preview, codeHtml, rawCode, sourcePath }) {
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
    <Tabs defaultValue="preview" className="rounded-md border border-black/10 bg-white">
      <div className="border-b border-black/10 px-4 py-2">
        <TabsList>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="preview" className="max-h-[80vh] overflow-auto">
        {preview}
      </TabsContent>

      <TabsContent value="code" className="max-h-[80vh] overflow-auto">
        <div className="flex items-center justify-between border-b border-white/10 bg-[#111316] px-4 py-2">
          <p className="font-mono text-xs text-white/52">{sourcePath}</p>
          <Button type="button" variant="ghost" size="sm" onClick={handleCopy} className="text-white/70 hover:bg-white/10 hover:text-white">
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5" /> Copied!
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" /> Copy
              </>
            )}
          </Button>
        </div>
        <div
          className="[&_pre]:m-0! [&_pre]:overflow-auto [&_pre]:p-4 [&_pre]:text-xs [&_pre]:leading-6"
          dangerouslySetInnerHTML={{ __html: codeHtml }}
        />
      </TabsContent>
    </Tabs>
  );
}
