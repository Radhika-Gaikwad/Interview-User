import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import UploadModal from "../Components/UploadModal";
import { Outlet } from "react-router-dom";

export default function Layout() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // ✅ Global modal state
  const [uploadOpen, setUploadOpen] = useState(false);

  // Prevent body scroll when mobile sidebar is open (only for mobile sizes)
  useEffect(() => {
    if (isMobileOpen && window.innerWidth < 768) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  return (
    <div className="flex h-screen w-full overflow-hidden theme-bg">
      <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />

      {/* Right Side - No shift on mobile, only desktop */}
      <div className="flex-1 flex flex-col">
        <Navbar
          setIsMobileOpen={setIsMobileOpen}
          isMobileOpen={isMobileOpen}   // ⬅ pass current mobile open state
          openUpload={() => setUploadOpen(true)}  // ⬅ Pass callback
        />

        <div className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </div>
      </div>

      {/* Modal */}
      <UploadModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onUpload={(file) => {
          console.log("Uploaded:", file);
          setUploadOpen(false);
        }}
      />
    </div>
  );
}