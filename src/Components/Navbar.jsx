import React, { useState } from "react";
import { Menu } from "lucide-react";
import { useLocation } from "react-router-dom";
import UploadModal from "../Components/UploadModal.jsx";

export default function Navbar({ setIsMobileOpen, openUpload, isMobileOpen }) {
  const location = useLocation();


  const getPageName = () => {
    const path = location.pathname;
    if (path === "/") return "Home";
    if (path.includes("interview")) return "Interview Sessions";
    if (path.includes("resume")) return "CV / Resume";
    if (path.includes("download")) return "Download App";
    if (path.includes("support")) return "Email Support";
    return "Dashboard";
  };

  // ✅ Check if user is on resume page
  const isResumePage = location.pathname.includes("resume");

  return (
    <nav
      className="
        h-16 glass border-b shadow
        flex items-center justify-between
        px-4 md:px-6
        top-0 z-20
      "
    >
      {/* Mobile Menu Button - hide when mobile sidebar is open */}
      {!isMobileOpen && (
        <button
          className="md:hidden p-2 rounded-lg glass shadow"
          onClick={() => setIsMobileOpen(true)}
        >
          <Menu size={24} />
        </button>
      )}

      {/* Desktop Page Title */}
      <h2
        className="
          hidden md:block
          text-lg sm:text-xl md:text-2xl 
          font-bold theme-text
        "
      >
        {getPageName()}
      </h2>

      {/* Right Side Buttons */}
      <div className="flex items-center gap-2 sm:gap-3 md:gap-4 ml-auto">

        {isResumePage && (
          <button
            onClick={openUpload}  // ⬅ call parent
            className="px-4 py-1.5 rounded-xl theme-primary text-[15px]shadow-md hover:scale-105 transition"
          >
            Upload Resume
          </button>
        )}

        {/* ❌ Hide these buttons on Resume Page */}
        {!isResumePage && (
          <>
            <button className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl glass text-gray-800 shadow hover:bg-white/80 hover:scale-105 transition font-medium text-sm sm:text-[15px]">
              Start Trial
            </button>

            <button className="px-4 py-1.5 sm:px-5 sm:py-2 rounded-xl theme-primary shadow-md hover:scale-105 active:scale-95 transition font-semibold text-sm sm:text-[15px]">
              Start Session
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
