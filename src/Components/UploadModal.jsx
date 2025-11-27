import React, { useRef } from "react";
import { X, UploadCloud } from "lucide-react";

export default function UploadModal({ open, onClose, onUpload }) {
  const fileRef = useRef(null);

  if (!open) return null;

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) onUpload(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      {/* BACKGROUND OVERLAY */}
      <div
        className="
        absolute inset-0 
        bg-black/60 
        backdrop-blur-sm 
        animate-fadeIn
      "
        onClick={onClose}
      />

      {/* MODAL */}
      <div
        className="
        relative w-[90%] sm:w-[450px]
        bg-white backdrop-blur-2xl
        border border-white/40
        p-8 rounded-3xl shadow-xl
        animate-popup
      "
      >
        {/* CLOSE BUTTON */}
        <button
          className="
          absolute top-4 right-4 p-2 
          bg-white/70 hover:bg-white
          rounded-full shadow 
          transition
        "
          onClick={onClose}
        >
          <X size={20} />
        </button>

        {/* HEADING */}
        <h2 className="text-2xl font-bold text-gray-800 tracking-wide">
          Upload Resume
        </h2>
        <p className="text-gray-600 mt-1 mb-6 text-sm">
          Supported: PDF, DOCX, TXT — max 5 MB
        </p>

        {/* UPLOAD BOX */}
        <div
          onClick={() => fileRef.current.click()}
          className="
          border-2 border-dashed border-indigo-400
          bg-white/50 hover:bg-indigo-50/80
          rounded-2xl py-10 px-6 text-center
          cursor-pointer group transition relative
          shadow-inner
        "
        >
          <UploadCloud
            size={50}
            className="
            mx-auto text-indigo-500 
            opacity-80 group-hover:scale-110
            transition
          "
          />
          <p className="mt-3 font-medium text-gray-700">
            Click to upload your file
          </p>

          {/* Hover Glow */}
          <div
            className="
            absolute inset-0 rounded-2xl 
            opacity-0 group-hover:opacity-20
            bg-indigo-300 transition
          "
          ></div>
        </div>

        {/* HIDDEN INPUT */}
        <input
          ref={fileRef}
          type="file"
          accept=".pdf,.doc,.docx,.txt"
          className="hidden"
          onChange={handleFile}
        />

        {/* FOOTER BUTTON */}
        <button
          onClick={onClose}
          className="
          mt-7 w-full py-3 rounded-xl 
          theme-primary font-semibold
          shadow-md hover:scale-[1.02] transition
        "
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
