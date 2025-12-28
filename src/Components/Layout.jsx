// Layout.jsx
import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import UploadModal from "../Components/UploadModal";
import StartSessionModal from "../Components/StartSessionModal";
import LanguageInstructionsModal from "../Components/LanguageInstructionsModal";
import ResumeSelectModal from "../Components/ResumeSelectModal";
import TranscriptSettingsModal from "../Components/TranscriptSettingsModal";
import ReadyToCreateModal from "../Components/ReadyToCreateModal";
import ConnectModal from "../Components/ConnectModal";

import { Outlet } from "react-router-dom";

export default function Layout() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
const [isTranscriptOpen, setIsTranscriptOpen] = useState(false);
const [isConnectOpen, setIsConnectOpen] = useState(false);

  // Session (step 1) modal state
  const [isSessionOpen, setIsSessionOpen] = useState(false);

  // Language/instructions (step 2) modal state
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);

  // Store data from Step 1 so you can show/use it in Step 2
  const [sessionData, setSessionData] = useState(null);

  const [isResumeOpen, setIsResumeOpen] = useState(false);
const [isReadyOpen, setIsReadyOpen] = useState(false);


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

      {/* Right Side */}
      <div className="flex-1 flex flex-col">
        <Navbar
          setIsMobileOpen={setIsMobileOpen}
          isMobileOpen={isMobileOpen}
          openUpload={() => setUploadOpen(true)}
          openSession={() => setIsSessionOpen(true)} // open start session
        />

        <div className="flex-1 overflow-y-auto px-0.5 py-0.5">
          <Outlet />
        </div>
      </div>

      {/* Upload Modal */}
      <UploadModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onUpload={(file) => {
          console.log("Uploaded:", file);
          setUploadOpen(false);
        }}
      />

      {/* Start Session Modal (Step 1) */}
      <StartSessionModal
        isOpen={isSessionOpen}
        onClose={() => setIsSessionOpen(false)}
        onNext={(data) => {
          // data = { company, jobDescription }
          setSessionData(data);         // keep step-1 data
          setIsSessionOpen(false);      // close step-1
          setIsLanguageOpen(true);      // OPEN step-2
        }}
      />

      <LanguageInstructionsModal
  isOpen={isLanguageOpen}
  onClose={() => setIsLanguageOpen(false)}
  onBack={() => {
    setIsLanguageOpen(false);
    setIsSessionOpen(true);
  }}
  onNext={() => {
    setIsLanguageOpen(false);
    setIsResumeOpen(true);
  }}
/>

<ResumeSelectModal
  isOpen={isResumeOpen}
  onClose={() => setIsResumeOpen(false)}
  onBack={() => {
    setIsResumeOpen(false);
    setIsLanguageOpen(true);
  }}
onNext={(resumeData) => {
  console.log("Selected Resume Data:", resumeData);
  setIsResumeOpen(false);
  setIsTranscriptOpen(true);   // <-- OPEN Transcript popup
}}

/>

<TranscriptSettingsModal
  isOpen={isTranscriptOpen}
  onClose={() => setIsTranscriptOpen(false)}
  onBack={() => {
    setIsTranscriptOpen(false);
    setIsResumeOpen(true);
  }}
  onNext={(data) => {
   
    setIsTranscriptOpen(false);
    setIsReadyOpen(true);   
  }}
/>


<ReadyToCreateModal
  isOpen={isReadyOpen}
  onClose={() => setIsReadyOpen(false)}
  onBack={() => {
    setIsReadyOpen(false);
    setIsTranscriptOpen(true);
  }}
  onCreate={() => {
    setIsReadyOpen(false);
    setIsConnectOpen(true);   // ← NEW POPUP OPENS
  }}
/>


<ConnectModal
  isOpen={isConnectOpen}
  onClose={() => setIsConnectOpen(false)}
  onBack={() => {
    setIsConnectOpen(false);
    setIsReadyOpen(true);
  }}
  language="English"
  aiModel="GPT-4.1 (Smarter)"
  onActivate={() => {
    console.log("Session Activated!");
    setIsConnectOpen(false);
  }}
/>



    </div>
  );
}
