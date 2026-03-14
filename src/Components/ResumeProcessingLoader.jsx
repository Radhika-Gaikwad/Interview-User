import React, { useEffect, useState } from "react"; 
import { CheckCircle, Loader2 } from "lucide-react";

const steps = [
  "Uploading resume...",
  "Extracting content...",
  "Analyzing skills with AI...",
  "Generating structured data...",
  "Saving resume securely..."
];

export default function ResumeProcessingLoader({ open, processing, onComplete, successMessage }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [finished, setFinished] = useState(false);


  useEffect(() => {
  if (open) {
    setFinished(false);
  }
}, [open]);
  useEffect(() => {
    if (!open || finished) return;
    setCurrentStep(0);

    const interval = setInterval(() => {
      setCurrentStep(prev => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 1200);

    return () => clearInterval(interval);
  }, [open, finished]);

  useEffect(() => {
    if (!processing && open) {
      setFinished(true);
      const timer = setTimeout(() => onComplete?.(), 1500); // auto-close after success
      return () => clearTimeout(timer);
    }
  }, [processing, open, onComplete]);

  if (!open) return null;

return (
  <div className="fixed inset-0 z-[999] flex items-center justify-center">

    {/* Backdrop */}
    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fadeIn" />

    {/* Popup Card */}
    <div className="relative bg-white  rounded-3xl p-10 w-[90%] max-w-md text-center animate-popup">

      {!finished ? (
        <>
          {/* Top Loader */}
          <Loader2
            className="animate-spin mx-auto text-gray-500"
            size={42}
          />

          <h2 className="mt-6 text-xl font-semibold theme-text">
            Processing Your Resume
          </h2>

          <p className="text-sm text-gray-600 mt-2">
            Our AI is analyzing your resume...
          </p>

          {/* Steps */}
          <div className="mt-6 space-y-3 text-left">
            {steps.map((step, index) => {
              const isCompleted = index < currentStep;
              const isActive = index === currentStep;

              return (
                <div
                  key={index}
                  className={`flex items-center gap-3 text-sm transition-all duration-300 ${
                    isCompleted || isActive
                      ? "theme-text font-medium"
                      : "text-gray-500"
                  }`}
                >
                  {/* ICON LOGIC */}
                  {isCompleted ? (
                    <CheckCircle
                      size={18}
                      className="text-gray-500 animate-scaleIn"
                    />
                  ) : isActive ? (
                    <Loader2
                      size={16}
                      className="animate-spin text-gray-500"
                    />
                  ) : (
                    <div className="w-4 h-4 border border-gray-500 rounded-full" />
                  )}

                  {step}
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <>
          {/* Big Success Check */}
          <CheckCircle
            className="mx-auto text-indigo-400 animate-scaleIn"
            size={56}
          />

          <h2 className="mt-4 text-xl font-semibold theme-text">
            {successMessage || "Resume Ready!"}
          </h2>

          <p className="text-sm text-gray-600 mt-2">
            Your resume has been saved successfully.
          </p>

          {/* All Steps Marked Complete */}
          <div className="mt-6 space-y-3 text-left">
            {steps.map((step, index) => (
              <div
                key={index}
                className="flex items-center gap-3 text-sm theme-text font-medium"
              >
                <CheckCircle size={18} className="theme-text" />
                {step}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  </div>
);
}