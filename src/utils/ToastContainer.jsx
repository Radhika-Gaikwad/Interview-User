import React, { useState, useEffect } from "react";
import Toast from "./showToast";
import { setToastHandler } from "../utils/showToastService"; // ✅ FIX

const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    // ✅ Register handler (NOT showToast)
    setToastHandler((type, message) => {
      const id = Date.now();
      setToasts((prev) => [...prev, { id, type, message }]);
    });
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="fixed top-5 right-5 space-y-3 z-50">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={removeToast} />
      ))}
    </div>
  );
};

export default ToastContainer;