import React, { useState } from "react";
import { X, ArrowLeft, ArrowRight } from "lucide-react";

export default function LanguageInstructionsModal({
  isOpen,
  onClose,
  onBack,
  onNext,
}) {

  const [language, setLanguage] = useState("English");
  const [simpleEnglish, setSimpleEnglish] = useState(false);
  const [extraContext, setExtraContext] = useState("");
  const [model, setModel] = useState("GPT-4.1");
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      {/* Modal box: limit height to 90vh and allow internal scrolling */}
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl relative animate-fadeIn
                      max-h-[90vh] overflow-auto p-6">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
        >
          <X size={26} />
        </button>

        {/* Header */}
        <h2 className="text-2xl font-bold mb-2">Language & Instructions</h2>
        <p className="text-gray-600 text-sm mb-5">
          Choose your language and provide special instructions for the AI.
        </p>

        {/* Body content (will scroll if it grows past 90vh) */}
        <div className="space-y-5">
          {/* Language Selector */}
          <div>
            <label className="text-sm font-medium mb-1 block">🌐 Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300"
            >
              <option>English</option>
              <option>Hindi</option>
              <option>Marathi</option>
              <option>French</option>
              <option>Spanish</option>
            </select>
          </div>

          {/* Simple English Toggle */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Simple English</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={simpleEnglish}
                onChange={() => setSimpleEnglish(!simpleEnglish)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-theme-primary"></div>
              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition peer-checked:translate-x-5"></div>
            </label>
          </div>

          <p className="text-gray-500 text-xs">
            If English is not your first language, use this so AI avoids complex vocabulary.
          </p>

          {/* Extra Context */}
          <div>
            <label className="text-sm font-medium block mb-1">
              Extra Context / Instructions (Optional)
            </label>
            <textarea
              rows={4}
              placeholder="Write any extra instructions..."
              value={extraContext}
              onChange={(e) => setExtraContext(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 mb-2"
            />
          </div>

          {/* AI Model */}
          <div>
            <label className="text-sm font-medium block mb-1">🤖 AI Model (Optional)</label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300"
            >
              <option>GPT-4.1 (Smarter)</option>
              <option>GPT-4 Turbo</option>
              <option>GPT-3.5</option>
              <option>GPT-4 Mini (Fast & Cheap)</option>
            </select>
          </div>

          {/* Add extra long content here for testing scroll */}
          {/* <div className="h-72">Long content test...</div> */}
        </div>

        {/* Footer buttons pinned below content (still inside scroll area) */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gray-100"
          >
            <ArrowLeft size={15} /> Back
          </button>

        <button
  onClick={onNext}
  className="flex items-center gap-2 px-5 py-2.5 rounded-lg theme-primary text-white"
>
  Next <ArrowRight size={15} />
</button>


        </div>
      </div>
    </div>
  );
}
