// ReadyToCreateModal.jsx
import React from "react";
import { X, ArrowLeft } from "lucide-react";

export default function ReadyToCreateModal({ isOpen, onClose, onBack, onCreate }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl relative animate-fadeIn p-6">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
        >
          <X size={26} />
        </button>

        {/* Header */}
        <h2 className="text-2xl font-bold mb-4 text-theme-primary">
          Ready to Create
        </h2>

        {/* Content */}
        <div className="space-y-4 text-gray-700 text-sm leading-relaxed">

          <p>
            This will use <strong>half of your interview credit</strong> for a 30 minute session.
          </p>

          <p>
            The session will <strong>auto extend by 30 minutes</strong> 30 seconds before it ends.
          </p>

          <p>
            You will not be charged an interview credit and the timer will not start
            <br />
            until you connect your <strong>screen sharing</strong>.
          </p>

          <p>
            If you wish to test ParakeetAI, you can use the
            <strong> Trial Sessions</strong> button.
            <br />
            The trial session lasts only <strong>10 minutes</strong>.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gray-100"
          >
            <ArrowLeft size={15} /> Back
          </button>

          <button
            onClick={onCreate}
            className="px-6 py-2.5 rounded-lg theme-primary text-white font-medium"
          >
            Create Session
          </button>
        </div>
      </div>
    </div>
  );
}
