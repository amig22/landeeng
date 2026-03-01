"use client";

import { useState } from "react";
import { HtmlBlock } from "@/types/landing";

interface BlockEditorProps {
  block: HtmlBlock;
  onUpdate: (id: string, html: string) => void;
}

export default function BlockEditor({ block, onUpdate }: BlockEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedHtml, setEditedHtml] = useState(block.html);

  const handleSave = () => {
    onUpdate(block.id, editedHtml);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedHtml(block.html);
    setIsEditing(false);
  };

  return (
    <div className="relative group border border-transparent hover:border-blue-400 rounded-lg transition-all">
      {/* Block label */}
      <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
        <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded font-medium">
          {block.name}
        </span>
        <button
          onClick={() => setIsEditing(true)}
          className="bg-white text-gray-700 hover:bg-blue-50 text-xs px-2 py-1 rounded border border-gray-300 font-medium shadow-sm"
        >
          ✏️ Modifica HTML
        </button>
      </div>

      {/* Rendered HTML preview */}
      <div
        className="block-preview"
        dangerouslySetInnerHTML={{ __html: block.html }}
      />

      {/* Edit modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-800">
                Modifica: {block.name}
              </h3>
              <button
                onClick={handleCancel}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
              >
                ×
              </button>
            </div>
            <div className="flex-1 overflow-hidden p-4 flex flex-col gap-3">
              <p className="text-sm text-gray-500">
                Modifica l&apos;HTML del blocco. Le modifiche saranno riflesse
                nell&apos;anteprima.
              </p>
              <textarea
                value={editedHtml}
                onChange={(e) => setEditedHtml(e.target.value)}
                className="flex-1 font-mono text-sm border border-gray-300 rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-64"
                spellCheck={false}
              />
            </div>
            <div className="flex gap-3 p-4 border-t justify-end">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
              >
                Annulla
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                Salva modifiche
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
