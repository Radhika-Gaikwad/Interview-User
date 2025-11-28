import React, { useEffect } from "react";
import { X } from "lucide-react";

export default function ConfirmModal({ open, title, message, onConfirm, onCancel }) {
  // Disable scroll when modal is open
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
        onClick={onCancel}
      />

      {/* Modal */}
      <div
        className="
          relative z-[1000000]
          w-[95%] md:w-[500px]
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
          <h3 className="text-xl font-semibold text-gray-900">
            {title || "Confirmation"}
          </h3>

          <button
            onClick={onCancel}
            className="p-2 rounded-lg hover:bg-gray-100 transition"
          >
            <X size={22} className="text-gray-700" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="text-sm text-gray-700">{message || "Are you sure you want to proceed?"}</p>
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg shadow-sm hover:bg-gray-200 transition"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 theme-primary text-white rounded-lg shadow hover:brightness-110 transition"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}