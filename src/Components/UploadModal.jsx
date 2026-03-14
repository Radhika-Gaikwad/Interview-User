import React, { useState, useEffect } from "react"; 
import { X } from "lucide-react";
import ResumeUploader from "./ResumeUploader";
import ResumeProcessingLoader from "./ResumeProcessingLoader";

export default function UploadModal({ open, onClose, onUpload }) {
  const [title, setTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [processing, setProcessing] = useState(false);
const [loaderOpen, setLoaderOpen] = useState(false);

  // Reset fields when modal closes
  useEffect(() => {
    if (!open) {
      setTitle("");
      setSelectedFile(null);
      setProcessing(false);
    }
  }, [open]);

  if (!open) return null;

const handleUpload = async () => {
  if (!title.trim() || !selectedFile) return;

  try {
    setLoaderOpen(true);      // 👈 open loader
    setProcessing(true);

    const response = await onUpload({ file: selectedFile, title });

    if (response?.success) {
      setProcessing(false);   // 👈 tell loader backend finished
    } else {
      setLoaderOpen(false);
      setProcessing(false);
    }

  } catch (err) {
    setLoaderOpen(false);
    setProcessing(false);
  }
};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Modal backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* Modal content */}
      <div className="relative w-[95%] max-w-2xl bg-white rounded-3xl shadow-2xl max-h-[90vh] flex flex-col z-10">
        <button
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-700"
          onClick={onClose}
        >
          <X size={22} />
        </button>

        {/* Header */}
        <div className="p-8 pb-4">
          <h2 className="text-2xl font-bold mb-2">Upload Resume</h2>
          <p className="text-sm text-gray-500">
            Upload a new resume to use in sessions and AI interviews.
          </p>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-8">
          <input
            type="text"
            placeholder="Enter Resume Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mb-4 w-full border border-gray-300 rounded-xl p-3 bg-white
                       focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200
                       focus:outline-none transition"
          />

          <ResumeUploader
            allowExisting={false}
            onSelect={({ file }) => setSelectedFile(file)}
            height="h-[45vh]"
          />
        </div>

        {/* Footer Buttons */}
        <div className="p-6 border-t flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
          >
            Cancel
          </button>

          <button
            onClick={handleUpload}
            className="px-6 py-2 rounded-lg text-white font-medium shadow-md
                       bg-gradient-to-r from-indigo-600 via-sky-500 to-teal-500
                       hover:from-indigo-700 hover:via-sky-600 hover:to-teal-600 transition"
          >
            Upload Resume
          </button>
        </div>
      </div>

<ResumeProcessingLoader
  open={loaderOpen}          // 👈 separate control
  processing={processing}
  onComplete={() => {
    setLoaderOpen(false);    // close loader
    setProcessing(false);
    onClose();               // close upload modal
  }}
  successMessage="Resume saved successfully!"
/>
    </div>
  );
}