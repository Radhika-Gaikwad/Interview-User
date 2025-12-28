import React, { useState } from "react";
import { X, Info, Video, ArrowLeft } from "lucide-react";
import ZoomLogo from "../assets/ZoomLogo.png";
import MeetLogo from "../assets/GoogleMeet.png";
import TeamsLogo from "../assets/Teams.png";
import WhatsappLogo from "../assets/Whatsapp.png";

export default function ConnectModal({
  isOpen,
  onClose,
  onBack,
  language,
  aiModel,
  onActivate,
}) {
  const [shareAudio, setShareAudio] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl relative animate-fadeIn p-5 
                      max-h-[90vh] overflow-y-auto">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <X size={26} />
        </button>

        {/* Header */}
        <h2 className="text-xl font-bold mb-3 text-theme-primary text-center sm:text-left">
          Connect
        </h2>

        {/* Subtext */}
        <p className="text-gray-700 text-sm mb-4 leading-relaxed text-center sm:text-left">
          This is an Interview Session for a position <strong>Software Developer</strong> at <strong>Google</strong>.
        </p>
        {/* Language Section */}
        <div className="mb-6">

          {/* Top Row → Label (Left) + Simple + Info Icon (Right) */}
          <div className="flex justify-between items-center w-full">

            {/* Left: Language */}
            <label className="text-sm font-semibold flex items-center gap-2">
              🌐 Language
            </label>

            {/* Right: Simple + Info */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-600">Simple</span>
              <Info size={18} className="text-gray-500" />
            </div>

          </div>

          {/* Bottom Row → Dropdown + Toggle */}
          <div className="mt-2 flex justify-between items-center gap-3">

            {/* Dropdown */}
            <select
              className="border p-2 rounded-lg w-full text-sm bg-gray-50"
              value={language}
              disabled
            >
              <option>{language}</option>
            </select>

            {/* Toggle */}
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={shareAudio}
                onChange={() => setShareAudio(!shareAudio)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-theme-primary"></div>
              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition peer-checked:translate-x-5"></div>
            </label>

          </div>

        </div>



        {/* AI Model Section */}
        <div className="mb-6">
          <label className="text-sm font-semibold">🤖 AI Model (Optional)</label>
          <select className="mt-2 border p-2 rounded-lg w-full text-sm bg-gray-50" disabled>
            <option>🧠 {aiModel}</option>
          </select>
        </div>

        {/* Info Plate */}
        <div className="bg-gray-100 p-3 rounded-lg text-sm text-gray-600 mb-6 text-center sm:text-left">
          🔊 Make sure to enable <strong>“Share Tab Audio”</strong> while sharing your screen.
        </div>

        {/* How to Connect (Responsive) */}
        <div className="mb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 w-full">

          {/* Left Section: Title + Icons */}
          <div className="flex items-center gap-3 flex-wrap">
            <h3 className="font-semibold text-base whitespace-nowrap">
              How to Connect:
            </h3>

            <div className="flex items-center gap-3">
              <img src={ZoomLogo} className="w-9 h-9 cursor-pointer" />
              <img src={MeetLogo} className="w-9 h-9 cursor-pointer" />
              <img src={TeamsLogo} className="w-9 h-9 cursor-pointer" />
              <img src={WhatsappLogo} className="w-9 h-9 cursor-pointer" />
            </div>
          </div>

          {/* Video Tutorial */}
          <div className="flex items-center gap-2 underline text-theme-primary cursor-pointer whitespace-nowrap">
            <Video size={20} />
            <span className="text-sm">Video Tutorial</span>
          </div>

        </div>


        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-6">

          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 w-full sm:w-auto bg-gray-100 rounded-lg"
          >
            <ArrowLeft size={15} /> Back
          </button>

          <button
            onClick={onActivate}
            className="flex items-center justify-center gap-2 px-5 py-2 w-full sm:w-auto rounded-lg theme-primary text-white font-medium"
          >
            ⚡ Activate & Connect
          </button>
        </div>

        {/* Credit Notice */}
        <p className="text-sm text-gray-600 mt-4 text-center leading-relaxed">
          Activating the session will use <strong>0.5</strong> interview credit.
          The session auto-extends for 30 minutes if it ends early.
        </p>
      </div>
    </div>
  );
}
