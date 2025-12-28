import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function Tooltip({ children, targetRef, isVisible }) {
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (targetRef.current) {
      const rect = targetRef.current.getBoundingClientRect();
      setCoords({
        top: rect.top + window.scrollY + rect.height / 2,
        left: rect.right + 8, // 8px gap from sidebar
      });
    }
  }, [targetRef, isVisible]);

  if (!isVisible) return null;

  return createPortal(
    <div
      className="bg-white text-gray-800 px-3 py-1.5 rounded-lg shadow-lg text-sm font-medium
                 opacity-100 scale-100 transition-all duration-150 whitespace-nowrap z-50 fixed"
      style={{ top: coords.top, left: coords.left, transform: "translateY(-50%)" }}
    >
      {children}
    </div>,
    document.body
  );
}
