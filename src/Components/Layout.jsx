import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import UploadModal from "../Components/UploadModal";
import CreateSession from "../Components/CreateSession";
import { useToast } from "../context/ToastContext";
import { Outlet } from "react-router-dom";
import sessionService from "../Services/sessionService";
import { uploadToGCS } from "../utils/gcsUpload";

export default function Layout() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);

  // ⭐ NEW single modal state
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [isSessionActive, setIsSessionActive] = useState(false);

  const { showToast } = useToast();

  /* Prevent body scroll on mobile sidebar */
  useEffect(() => {
    if (isMobileOpen && window.innerWidth < 768) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => (document.body.style.overflow = "");
  }, [isMobileOpen]);

  /* Auto end session when modal closes */
  useEffect(() => {
    if (!isCreateOpen && isSessionActive && currentSessionId) {
      const endSession = async () => {
        try {
          await sessionService.endSession(
            currentSessionId,
            new Date().toISOString()
          );
        } catch (err) {
          console.error("Failed to end session:", err);
        } finally {
          setIsSessionActive(false);
          setCurrentSessionId(null);
         window.dispatchEvent(new Event("session-updated"));
        }
      };
      endSession();
    }
  }, [isCreateOpen, isSessionActive, currentSessionId]);

  return (
    <div className="flex h-screen w-full overflow-hidden theme-bg">
      <Sidebar
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* RIGHT SIDE */}
      <div className="flex-1 flex flex-col">
        <Navbar
          setIsMobileOpen={setIsMobileOpen}
          isMobileOpen={isMobileOpen}
          openUpload={() => setUploadOpen(true)}
          openSession={() => setIsCreateOpen(true)}   // ⭐ OPEN NEW MODAL
        />

        <div className="flex-1 overflow-y-auto px-0.5 py-0.5">
          <Outlet />
        </div>
      </div>

      {/* Upload Resume Modal */}
      <UploadModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onUpload={async ({ file, title }) => {
          try {

            const response = await uploadToGCS(file, title);

              window.dispatchEvent(new Event("resume-updated"));
            return response;
          } catch (error) {
            showToast("Upload failed", "error");
            throw error;
          }
        }}
      />

      {/* ⭐ NEW CREATE SESSION WIZARD */}
      <CreateSession
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
       onCreated={(session) => {
         window.dispatchEvent(new Event("session-updated"));
  if (!session) {
    console.error("Session is undefined!");
    return;
  }

  setCurrentSessionId(session._id || session.id);
  setIsSessionActive(true);
}}
      />
    </div>
  );
}