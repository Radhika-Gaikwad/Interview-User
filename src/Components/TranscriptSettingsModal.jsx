// TranscriptSettingsModal.jsx
import React, { useState } from "react";
import { X, ArrowLeft, ArrowRight } from "lucide-react";

export default function TranscriptSettingsModal({
  isOpen,
  onClose,
  onBack,
  onNext,
}) {
  const [saveTranscript, setSaveTranscript] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl relative 
                      animate-fadeIn max-h-[90vh] overflow-auto p-6">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
        >
          <X size={26} />
        </button>

        {/* Header */}
        <h2 className="text-2xl font-bold mb-2">
          AI Interview Transcript/Summary
        </h2>

        <p className="text-gray-600 text-sm mb-6">
          Choose whether to save the transcript/summary of your interview.
        </p>

        {/* Toggle */}
        <div>
          <label className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">
              Save Transcript/Summary (Optional)
            </span>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={saveTranscript}
                onChange={() => setSaveTranscript(!saveTranscript)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-theme-primary"></div>
              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition peer-checked:translate-x-5"></div>
            </label>
          </label>

          <p className="text-gray-500 text-xs mb-4">
            If you enable this option, a transcript/summary of the interview
            will be saved with an AI analysis. You can view and analyze it
            later in your dashboard.
          </p>
        </div>

        {/* Legal Disclaimer */}
        <div className="bg-red-50 border border-red-200 p-3 rounded-lg text-xs text-red-700 mb-6">
          <strong>Legal Disclaimer:</strong> You must comply with all
          applicable transcribing laws. Many jurisdictions require consent
          from all parties before recording. Recording without consent may
          be illegal.
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gray-100"
          >
            <ArrowLeft size={15} /> Back
          </button>

          <button
            onClick={() => onNext({ saveTranscript })}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg theme-primary text-white"
          >
            Next <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
