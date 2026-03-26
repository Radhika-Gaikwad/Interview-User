import React, { useState, useEffect } from "react";
import {
  FaCalendarAlt,
  FaClock,
  FaCreditCard,
  FaLink,
  FaUserTie,
  FaBuilding,
  FaFileAlt,
  FaBolt,
  FaLanguage,
  FaDownload,
  FaEye,
  FaMicrophone,
} from "react-icons/fa";
import { X } from "lucide-react";
import { getPreviewSrc } from "../utils/getPreviewSrc";

export default function SessionViewModal({ open, item, onClose }) {
  const [previewOpen, setPreviewOpen] = useState(false);

  const [previewSrc, setPreviewSrc] = useState("");
const [step, setStep] = useState(1); // ✅ NEW step state

useEffect(() => {
  const loadPreview = async () => {
    if (!item?.resumePreviewUrl) return;

    const url = await getPreviewSrc(item.resumePreviewUrl);
    setPreviewSrc(url);
  };

  loadPreview();
}, [item]);

  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => (document.body.style.overflow = prev || "");
    }
  }, [open]);

  if (!open || !item) return null;


  const handleDownload = async () => {
  try {
    const res = await fetch(item.resumeDownloadUrl, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const data = await res.json();

    if (data?.url) {
      window.open(data.url, "_blank");
    }
  } catch (err) {
    console.error("Download failed:", err);
  }
};
  const statusColors = {
    active: "bg-green-100 text-green-700",
    completed: "bg-red-100 text-red-700",
    draft: "bg-gray-100 text-gray-700",
  };


  

  return (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center animate-fadeIn">
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* MODAL */}
      <div className="relative z-[1000000] w-[96%] lg:w-[1100px] max-h-[92vh] bg-white rounded-2xl shadow-2xl flex flex-col">
        
        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-white/40">
          <div>
            <h3 className="text-2xl font-bold theme-text">
              {item.company}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {item.position}
            </p>
          </div>

          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[item.status]}`}>
            {item.status}
          </span>

          <button
            onClick={onClose}
            className="p-2 rounded-lg glass hover:scale-110 transition"
          >
            <X size={22} />
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 overflow-y-auto space-y-8">

          {/* Top Info */}
          <div className="grid sm:grid-cols-3 gap-4">
            <InfoCard icon={<FaBuilding />} label="Company" value={item.company} />
            <InfoCard icon={<FaUserTie />} label="Position" value={item.position} />
            <InfoCard icon={<FaBolt />} label="AI Model" value={item.aiModel || "—"} />
          </div>

          {/* Language & Session Settings */}
          <div className="grid sm:grid-cols-3 gap-4">
            <InfoCard icon={<FaLanguage />} label="Language" value={item.language} />
            <InfoCard icon={<FaMicrophone />} label="Share Audio" value={item.shareAudio ? "Enabled" : "Disabled"} />
            <InfoCard icon={<FaClock />} label="Auto Extend" value={item.autoExtend ? "Enabled" : "Disabled"} />
          </div>

          {/* Job Description */}
          <GlassSection title="Job Description" icon={<FaFileAlt />}>
            <p className="text-gray-700 leading-relaxed">
              {item.jobDescription || "—"}
            </p>
          </GlassSection>

          {/* Skills */}
          {item.skills?.length > 0 && (
            <GlassSection title="Skills">
              <div className="flex flex-wrap gap-2">
                {item.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 text-sm rounded-full theme-tertiary shadow-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </GlassSection>
          )}

       {(item.resumePreviewUrl || item.resumeDownloadUrl) && (
            <GlassSection title="Resume">
              <div className="flex flex-wrap gap-3 mb-4">
                <button
                  onClick={() => setPreviewOpen(!previewOpen)}
                  className="flex items-center gap-2 theme-primary px-4 py-2 rounded-xl shadow"
                >
                  <FaEye />
                  {previewOpen ? "Hide Preview" : "Preview Resume"}
                </button>

               <button
  onClick={handleDownload}
  className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-xl shadow"
>
  <FaDownload />
  Download Resume
</button>
              </div>

             {previewOpen && previewSrc && (
  <iframe
    src={previewSrc}
    className="w-full h-[520px] rounded-xl border"
  />
)}
            </GlassSection>
          )}

          {/* Timing Info */}
          <div className="grid sm:grid-cols-3 gap-4">
            <InfoCard icon={<FaClock />} label="Duration" value={`${item.durationMinutes} min`} />
            <InfoCard icon={<FaCreditCard />} label="Credits Used" value={item.creditsUsed || 0} />
            <InfoCard
              icon={<FaCalendarAlt />}
              label="Start Time"
              value={item.startAt ? new Date(item.startAt).toLocaleString() : "—"}
            />
          </div>

          {/* Meeting Info */}
          <div className="grid sm:grid-cols-2 gap-4">
            <InfoCard icon={<FaLink />} label="Connection Method" value={item.connectionMethod || "—"} />
            <InfoCard
              icon={<FaCalendarAlt />}
              label="Created At"
              value={new Date(item.createdAt).toLocaleString()}
            />
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-4 border-t border-white/40 flex justify-end bg-gray-50 backdrop-blur-md">
          <button
           onClick={() => {
  setStep(1);        // ✅ reset BEFORE closing
  onClose();
}}
            className="px-5 py-2 rounded-xl theme-secondary shadow-md hover:brightness-110 hover:scale-105 transition-all duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Reusable Components ---------- */

function InfoCard({ icon, label, value }) {
  return (
    <div className="glass-card rounded-xl p-4 flex items-center gap-3">
      <div className="text-indigo-500 text-lg">{icon}</div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="font-semibold text-gray-800 break-all">{value}</p>
      </div>
    </div>
  );
}

function GlassSection({ title, icon, children }) {
  return (
    <div className="glass rounded-xl p-5">
      <div className="flex items-center gap-2 mb-3">
        {icon && <span className="text-indigo-500">{icon}</span>}
        <h4 className="text-lg font-semibold theme-text">{title}</h4>
      </div>
      {children}
    </div>
  );
}