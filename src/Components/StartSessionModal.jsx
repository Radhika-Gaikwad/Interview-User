import React, { useState } from "react";
import { X, ArrowLeft, ArrowRight } from "lucide-react";

export default function StartSessionModal({ isOpen, onClose, onNext }) {
  const [company, setCompany] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white max-w-md w-full p-7 rounded-2xl shadow-2xl relative animate-fadeIn scale-95">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition"
        >
          <X size={26} />
        </button>

        {/* Header */}
        <h2 className="text-2xl font-bold text-gray-900 mb-1">
          Interview <span className="theme-text">(0.5 Credit)</span>
        </h2>
        <p className="text-gray-600 mb-6 leading-relaxed text-sm">
          Enter the company name and job role so the AI understands the context
          and provides relevant interview suggestions.
        </p>

        {/* Input Fields */}
        <div className="flex flex-col gap-5">
          <div>
            <label className="text-gray-700 font-medium text-sm flex items-center gap-2 mb-1">
              🏢 Company
            </label>
            <input
              type="text"
              placeholder="Enter Company Name"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2  focus:outline-none"
            />
          </div>

          <div>
            <label className="text-gray-700 font-medium text-sm flex items-center gap-2 mb-1">
              💼 Job Description
            </label>
            <textarea
              rows={3}
              placeholder="Enter Job Position"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus: focus:outline-none resize-none"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-7 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gray-100 text-gray-800 hover:bg-gray-200 transition font-medium shadow-sm text-sm"
          >
            <ArrowLeft size={15} />
            Back
          </button>

          <button
            onClick={() => onNext({ company, jobDescription })}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg theme-primary text-white hover:theme-secondary transition font-medium shadow-sm text-sm"
          >
            Next
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
