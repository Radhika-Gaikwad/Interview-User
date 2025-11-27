import React, { useEffect } from "react";
import { X } from "lucide-react";

export default function ViewModal({ open, item, onClose }) {
  // Disable scroll when modal open
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => (document.body.style.overflow = prev || "");
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm z-[999998]"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="
          relative z-[1000000]
          w-[95%] md:w-[900px] lg:w-[1000px]
          max-h-[92vh]
          bg-white 
          rounded-2xl 
          shadow-2xl border border-gray-200
          flex flex-col
          animate-[fadeIn_0.25s_ease-out]
        "
      >
        {/* Header */}
        <div
          className="
            flex items-center justify-between
            px-6 py-4 
            border-b border-gray-200
          "
        >
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              {item?.title || "Resume Preview"}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {item?.createdAt || ""}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition"
          >
            <X size={22} className="text-gray-700" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-auto" style={{ maxHeight: "78vh" }}>
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <h4 className="font-semibold mb-2 text-gray-900">
              Preview (placeholder)
            </h4>
            <p className="text-sm text-gray-700">
              This is a placeholder preview for{" "}
              <span className="font-medium">{item?.title}</span>.  
              Replace this with a PDF viewer or document preview component.
            </p>

            {/* Info Grid */}
            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-white border shadow-sm">
                <p className="text-xs text-gray-500">Summary</p>
                <p className="text-sm text-gray-800 mt-2">
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                  Pariatur, atque.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-white border shadow-sm">
                <p className="text-xs text-gray-500">Meta</p>
                <p className="text-sm text-gray-800 mt-2">
                  Created: {item?.createdAt}
                </p>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="mt-6 flex gap-3">
              <button className="px-4 py-2 theme-primary text-white rounded-lg shadow hover:brightness-110 transition">
                Download
              </button>

              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg shadow-sm hover:bg-gray-200 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
