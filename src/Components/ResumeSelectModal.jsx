// ResumeSelectModal.jsx
import React, { useState } from "react";
import { X, ArrowLeft, ArrowRight, Upload } from "lucide-react";

export default function ResumeSelectModal({ isOpen, onClose, onBack, onNext }) {
  const [selectedResume, setSelectedResume] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);

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
        <h2 className="text-2xl font-bold mb-2">Select Resume</h2>
        <p className="text-gray-600 text-sm mb-5">
          Choose a resume to help the AI provide more personalized answers
          based on your experience.
        </p>

        {/* Resume Dropdown */}
        <div className="mb-6">
          <label className="text-sm font-medium mb-1 block">Your Resumes</label>
          <select
            value={selectedResume}
            onChange={(e) => setSelectedResume(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-300"
          >
            <option value="">-- Select Resume --</option>
            <option>Resume 1 - Software Developer</option>
            <option>Resume 2 - MERN Developer</option>
            <option>Resume 3 - Frontend Specialist</option>
          </select>
        </div>

        {/* Upload Resume */}
        <div className="mb-8">
          <label className="text-sm font-medium block mb-2">Upload Resume</label>

          <label className="w-full border-2 border-dashed border-gray-300 rounded-lg p-5 
                            flex flex-col items-center cursor-pointer hover:border-theme-primary transition">
            <Upload size={30} className="mb-2 text-gray-500" />
            <span className="text-gray-600 text-sm">Click to upload from your device</span>

            <input
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setUploadedFile(e.target.files[0])}
            />
          </label>

          {uploadedFile && (
            <p className="mt-2 text-sm text-theme-primary font-medium">
              Uploaded: {uploadedFile.name}
            </p>
          )}
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
  onClick={() =>
    onNext({
      selectedResume,
      uploadedFile,
    })
  }
  className="flex items-center gap-2 px-5 py-2.5 rounded-lg theme-primary text-white"
>
  Next <ArrowRight size={15} />
</button>

        </div>
      </div>
    </div>
  );
}
