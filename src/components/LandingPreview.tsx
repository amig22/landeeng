"use client";

import { useState } from "react";
import { LandingPageData } from "@/types/landing";
import BlockEditor from "./BlockEditor";

interface LandingPreviewProps {
  data: LandingPageData;
  onExport: () => void;
}

export default function LandingPreview({ data, onExport }: LandingPreviewProps) {
  const [blocks, setBlocks] = useState(data.blocks);

  const handleBlockUpdate = (id: string, html: string) => {
    setBlocks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, html } : b))
    );
  };

  return (
    <div className="w-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between bg-gray-900 text-white px-4 py-2 rounded-t-xl">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <span className="text-sm text-gray-300 font-medium">
            {data.companyName} — {data.tagline}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onExport}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1.5 rounded-lg font-medium transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Esporta HTML
          </button>
        </div>
      </div>

      {/* Block list sidebar + preview */}
      <div className="flex border border-gray-200 border-t-0 rounded-b-xl overflow-hidden shadow-lg">
        {/* Sidebar - block navigator */}
        <div className="w-48 bg-gray-50 border-r border-gray-200 p-3 flex flex-col gap-1 shrink-0">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
            Blocchi
          </p>
          {blocks.map((block) => (
            <a
              key={block.id}
              href={`#block-${block.id}`}
              className="text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 px-2 py-1.5 rounded-lg transition-colors"
            >
              {block.name}
            </a>
          ))}
        </div>

        {/* Preview area */}
        <div className="flex-1 overflow-y-auto max-h-[80vh] bg-white">
          {/* Tailwind CDN for the preview */}
          <div id="landing-preview">
            {blocks.map((block) => (
              <div key={block.id} id={`block-${block.id}`}>
                <BlockEditor
                  block={block}
                  onUpdate={handleBlockUpdate}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
