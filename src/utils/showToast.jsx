import React, { useEffect } from "react";

const toastStyles = {
  success: {
    bg: "theme-primary",
    icon: "🎉",
  },
  error: {
    bg: "bg-gradient-to-r from-rose-500 via-red-500 to-orange-500",
    icon: "❌",
  },
  info: {
    bg: "bg-gradient-to-r from-sky-500 to-indigo-500",
    icon: "ℹ️",
  },
};

const Toast = ({ id, message, type = "info", onClose }) => {
  const config = toastStyles[type];

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, 2500);

    return () => clearTimeout(timer);
  }, [id, onClose]);

  return (
    <div
      className={`relative flex items-center gap-4 px-6 py-4 rounded-2xl shadow-2xl
      ${config.bg} text-white overflow-hidden animate-popup`}
    >
      {/* Glow */}
      <div className="absolute inset-0 opacity-30 blur-2xl bg-gradient-to-r from-indigo-500 via-sky-400 to-teal-400"></div>

      {/* Icon */}
      <div className="relative z-10 w-10 h-10 flex items-center justify-center bg-white/20 rounded-full">
        {config.icon}
      </div>

      {/* Text */}
      <div className="relative z-10 font-semibold">
        {message}
      </div>
    </div>
  );
};

export default Toast;