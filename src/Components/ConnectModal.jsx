import React, { useState, useEffect } from "react";  
import { X, Info, Video, ArrowLeft } from "lucide-react";
import ZoomLogo from "../assets/ZoomLogo.png";
import MeetLogo from "../assets/GoogleMeet.png";
import TeamsLogo from "../assets/Teams.png";
import WhatsappLogo from "../assets/Whatsapp.png";
import { getUserCredits } from "../Services/userService";

export default function ConnectModal({
  isOpen,
  onClose,
  onBack,
  language,
  aiModel,
  company,
  position,
  onActivate, // function passed from parent to handle session activation
}) {
  const [shareAudio, setShareAudio] = useState(true);
  const [selectedMethod, setSelectedMethod] = useState("");
  const [meetingLink, setMeetingLink] = useState("");

  // Reset state whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setShareAudio(true);
      setSelectedMethod("");
      setMeetingLink("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl relative animate-fadeIn p-5 max-h-[90vh] overflow-y-auto">

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

        <p className="text-gray-700 text-sm mb-4 leading-relaxed text-center sm:text-left">
          This is an Interview Session for a position{" "}
          <strong>{position || "N/A"}</strong> at{" "}
          <strong>{company || "N/A"}</strong>.
        </p>

        {/* Language Section */}
        <div className="mb-6">
          <div className="flex justify-between items-center w-full">
            <label className="text-sm font-semibold flex items-center gap-2">🌐 Language</label>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-600">Simple</span>
              <Info size={18} className="text-gray-500" />
            </div>
          </div>

          <div className="mt-2 flex justify-between items-center gap-3">
            <select
              className="border p-2 rounded-lg w-full text-sm bg-gray-50"
              value={language}
              disabled
            >
              <option>{language}</option>
            </select>

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

        {/* How to Connect */}
        <div className="mb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 w-full">
          <div className="flex items-center gap-3 flex-wrap">
            <h3 className="font-semibold text-base whitespace-nowrap">How to Connect:</h3>
            <div className="flex items-center gap-3">
              <img
                src={ZoomLogo}
                className={`w-9 h-9 cursor-pointer rounded-full p-1 ${selectedMethod === 'zoom' ? 'ring-2 ring-theme-primary' : ''}`}
                onClick={() => setSelectedMethod('zoom')}
                alt="Zoom"
              />
              <img
                src={MeetLogo}
                className={`w-9 h-9 cursor-pointer rounded-full p-1 ${selectedMethod === 'meet' ? 'ring-2 ring-theme-primary' : ''}`}
                onClick={() => setSelectedMethod('meet')}
                alt="Google Meet"
              />
              <img
                src={TeamsLogo}
                className={`w-9 h-9 cursor-pointer rounded-full p-1 ${selectedMethod === 'teams' ? 'ring-2 ring-theme-primary' : ''}`}
                onClick={() => setSelectedMethod('teams')}
                alt="Teams"
              />
              <img
                src={WhatsappLogo}
                className={`w-9 h-9 cursor-pointer rounded-full p-1 ${selectedMethod === 'whatsapp' ? 'ring-2 ring-theme-primary' : ''}`}
                onClick={() => setSelectedMethod('whatsapp')}
                alt="Whatsapp"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 underline text-theme-primary cursor-pointer whitespace-nowrap">
            <Video size={20} />
            <span className="text-sm">Video Tutorial</span>
          </div>
        </div>

        {/* Meeting Link */}
        <div className="mb-4">
          <label className="text-sm font-semibold">Meeting Link (optional)</label>
          <input
            value={meetingLink}
            onChange={(e) => setMeetingLink(e.target.value)}
            placeholder="Paste meeting URL or leave blank to open provider site"
            className="mt-2 w-full border p-2 rounded-lg text-sm bg-gray-50"
          />
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 w-full sm:w-auto bg-gray-100 rounded-lg"
          >Close
      
          </button>

          <button
            onClick={async () => {
              if (!selectedMethod) return;

              let url = meetingLink?.trim();
              if (!url) {
                switch (selectedMethod) {
                  case "zoom": url = "https://zoom.us/"; break;
                  case "meet": url = "https://meet.google.com/"; break;
                  case "teams": url = "https://teams.microsoft.com/"; break;
                  case "whatsapp": url = "https://web.whatsapp.com/"; break;
                  default: url = "/"; break;
                }
              }

           
  try {
    // ✅ Start session (deduct credits)
    await onActivate({
      shareAudio,
      connectionMethod: selectedMethod,
      meetingLink: meetingLink || "",
    });

    // ✅ ALWAYS fetch latest credits from server
    const latestCredits = await getUserCredits();

    // ✅ Update globally (Sidebar will auto-update)
    localStorage.setItem("credits", latestCredits);

    window.dispatchEvent(
      new CustomEvent("creditsUpdated", {
        detail: { credits: latestCredits },
      })
    );

    onClose();
    window.open(url, "_blank");

  } catch (err) {
                alert(err.message || "Failed to start session");
              }
            }}
            disabled={!selectedMethod}
            className={`flex items-center justify-center gap-2 px-5 py-2 w-full sm:w-auto rounded-lg text-white font-medium ${selectedMethod ? 'theme-primary' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
          >
            ⚡ Activate & Connect
          </button>
        </div>

        <p className="text-sm text-gray-600 mt-4 text-center leading-relaxed">
          Activating the session will use <strong>0.5</strong> interview credit.
          The session auto-extends for 30 minutes if it ends early.
        </p>
      </div>
    </div>
  );
}