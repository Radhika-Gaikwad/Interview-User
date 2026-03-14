import React, { useState, useEffect } from "react";
import { X, ArrowLeft, ArrowRight } from "lucide-react";
import ResumeUploader from "./ResumeUploader";
import Toast from "../utils/toast";
import { getResumesService } from "../Services/resume.service";
import sessionService from "../Services/sessionService";
import { uploadToGCS } from "../utils/gcsUpload";
import { Info, Video } from "lucide-react";
import ZoomLogo from "../assets/ZoomLogo.png";
import MeetLogo from "../assets/GoogleMeet.png";
import TeamsLogo from "../assets/Teams.png";
import WhatsappLogo from "../assets/Whatsapp.png";
import ResumeProcessingLoader from "./ResumeProcessingLoader";
import {getProfile} from "../Services/userService";

export default function CreateSession({ open, onClose, onCreated }) {
  const [step, setStep] = useState(1);
  const [toasts, setToasts] = useState([]);

  const [existingResumes, setExistingResumes] = useState([]);
  const [resumeMode, setResumeMode] = useState("existing");

  const [previewUrl, setPreviewUrl] = useState("");
  const [uploadComplete, setUploadComplete] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [shareAudio, setShareAudio] = useState(true);
  const [selectedMethod, setSelectedMethod] = useState("");

const [meetingLink, setMeetingLink] = useState("");

const resetUploadState = () => {
  setPreviewUrl("");
  setUploadComplete(false);
  setIsUploading(false);

  setForm(prev => ({
    ...prev,
    resumeFile: null,
    resumeId: "",
    resumeUrl: "",
    resumeTitle: ""
  }));
};
  const showToast = (message, type = "success") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  };

const [form, setForm] = useState({
  company: "",
  position: "",
  jobDescription: "",
  skills: "",
  language: "English",
  simpleEnglish: false,
  extraContext: "",
  aiModel: "GPT-4.1",
  resumeUrl: "",
  resumeId: "",
  resumeTitle: "",
  resumeFile: null,   // ADD THIS
  saveTranscript: false,
  durationMinutes: 30,
  autoExtend: true,
});;

  const setField = (key, value) =>
    setForm(prev => ({ ...prev, [key]: value }));

  /* ================= LOAD RESUMES ================= */
useEffect(() => {
  if (open) {
    getResumesService()
      .then(res => {
        setExistingResumes(res.data?.data || []);
      })
      .catch(() => showToast("Failed to load resumes", "error"));
  }
}, [open]);

useEffect(() => { 
  if (!open) {
    // Reset step and form
    setStep(1);
    setForm({
      company: "",
      position: "",
      jobDescription: "",
      skills: "",
      language: "English",
      simpleEnglish: false,
      extraContext: "",
      aiModel: "GPT-4.1",
      resumeUrl: "",
      resumeTitle: "",
      resumeFile: null,
      resumeId: "",
      saveTranscript: false,
      durationMinutes: 30,
      autoExtend: true,
    });

    // Reset resume preview/upload state
    setPreviewUrl("");
    setUploadComplete(false);
    setResumeMode("existing");

    // Reset connect & meeting settings
    setSelectedMethod("");
    setMeetingLink("");
    setShareAudio(true);
  }
}, [open]);

  const next = () => setStep(s => Math.min(6, s + 1));
const prev = () => {
  setStep(s => {
    const newStep = Math.max(1, s - 1);

    // Clear selected connect method if leaving step 6
    if (s === 6) {
      setSelectedMethod("");
      setMeetingLink("");
      setShareAudio(true);
    }

    return newStep;
  });
};

  /* ================= CREATE SESSION ================= */
  async function createSession() {
    if (!form.company || !form.position)
      return showToast("Company & Position required", "error");

    if (!form.resumeId && !form.resumeUrl)
      return showToast("Please select a resume", "error");

    const payload = {
      company: form.company,
      position: form.position,
      jobDescription: form.jobDescription,
      skills: form.skills
        ? form.skills.split(",").map(s => s.trim()).filter(Boolean)
        : [],
      language: form.language,
      simpleEnglish: form.simpleEnglish,
      extraContext: form.extraContext,
      aiModel: form.aiModel,
      resumeId: form.resumeId || undefined,
      resumeUrl: form.resumeUrl || undefined,
      resumePreviewUrl: previewUrl,
      selectedResumeName: form.resumeTitle,
      durationMinutes: Number(form.durationMinutes),
      autoExtend: form.autoExtend,
    };

    try {
      setCreating(true);
      const session = await sessionService.createSession(payload);

      showToast("Session created successfully 🎉");

      setTimeout(() => {
setForm(prev => ({ ...prev, _id: session._id }));
onCreated?.(session);
        next(); // go to connect step
      }, 700);
    } catch (err) {
      console.error(err);
      showToast("Failed to create session", "error");
    } finally {
      setCreating(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl flex flex-col max-h-[90vh]">

        {/* HEADER */}
        <div className="p-6 border-b relative">
          <button onClick={onClose} className="absolute right-4 top-4">
            <X size={24} />
          </button>
          <h2 className="text-xl font-bold">
            {step === 6 ? "Connect & Start" : "Create Session"}
          </h2>
          <p className="text-xs text-gray-500 mt-1">Step {step} of 6</p>
        </div>

        {/* BODY */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">

          {step === 1 && (
            <div className="w-full animate-fadeIn">

              {/* Header */}
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                Interview <span className="theme-text">(0.5 Credit)</span>
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed text-sm">
                Enter the company name and job role so the AI understands the context
                and provides relevant interview suggestions.
              </p>

              {/* Input Fields */}
              <div className="flex flex-col gap-5">

                {/* Company */}
                <div>
                  <label className="text-gray-700 font-medium text-sm flex items-center gap-1 mb-1">
                    🏢 Company <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Company Name"
                    value={form.company}
                    onChange={(e) => setField("company", e.target.value)}
                    className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:outline-none"
                  />
                  {!form.company && (
                    <div className="text-xs text-red-600 mt-1">
                      Company is required
                    </div>
                  )}
                </div>

                {/* Position */}
                <div>
                  <label className="text-gray-700 font-medium text-sm flex items-center gap-1 mb-1">
                    💼 Position <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Position / Role"
                    value={form.position}
                    onChange={(e) => setField("position", e.target.value)}
                    className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:outline-none"
                  />
                  {!form.position && (
                    <div className="text-xs text-red-600 mt-1">
                      Position is required
                    </div>
                  )}
                </div>

                {/* Job Description */}
                <div>
                  <label className="text-gray-700 font-medium text-sm flex items-center gap-2 mb-1">
                    📝 Job Description (detailed)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Enter job description / responsibilities"
                    value={form.jobDescription}
                    onChange={(e) => setField("jobDescription", e.target.value)}
                    className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:outline-none resize-none"
                  />
                </div>

                {/* Skills */}
                <div>
                  <label className="text-gray-700 font-medium text-sm flex items-center gap-2 mb-1">
                    🧭 Skills (comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. React, Node.js, SQL"
                    value={form.skills}
                    onChange={(e) => setField("skills", e.target.value)}
                    className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}
          
          {step === 2 && (
            <div className="w-full animate-fadeIn">

              {/* Header */}
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                Language & Instructions
              </h2>
              <p className="text-gray-600 mb-6 text-sm">
                Choose your preferred language and customize how the AI responds.
              </p>

              <div className="flex flex-col gap-5">

                {/* Language */}
                <div>
                  <label className="text-gray-700 font-medium text-sm flex items-center gap-2 mb-1">
                    🌐 Language
                  </label>
                  <select
                    value={form.language}
                    onChange={e => setField("language", e.target.value)}
                    className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:outline-none"
                  >
                    <option>English</option>
               
                  </select>
                </div>

                {/* Simple English Toggle */}
                <div className="flex items-center justify-between bg-gray-50 border rounded-lg p-3">
                  <div>
                    <p className="text-sm font-medium">Simple English</p>
                    <p className="text-xs text-gray-500">
                      AI avoids complex vocabulary.
                    </p>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.simpleEnglish}
                      onChange={() =>
                        setField("simpleEnglish", !form.simpleEnglish)
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-theme-primary"></div>
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition peer-checked:translate-x-5"></div>
                  </label>
                </div>

                {/* Extra Context */}
                <div>
                  <label className="text-gray-700 font-medium text-sm flex items-center gap-2 mb-1">
                    📝 Extra Instructions
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Add any special instructions for AI..."
                    value={form.extraContext}
                    onChange={e => setField("extraContext", e.target.value)}
                    className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:outline-none resize-none"
                  />
                </div>

                {/* AI Model */}
                <div>
                  <label className="text-gray-700 font-medium text-sm flex items-center gap-2 mb-1">
                    🤖 AI Model (Optional)
                  </label>
                  <select
                    value={form.aiModel}
                    onChange={e => setField("aiModel", e.target.value)}
                    className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:outline-none"
                  >
                    <option>GPT-4.1 (Smarter)</option>
                    <option>GPT-4 Turbo</option>
                    <option>GPT-4 Mini (Fast & Cheap)</option>
                    <option>GPT-3.5</option>
                  </select>
                </div>

              </div>
            </div>
          )}
{/* STEP 3 RESUME */}
{step === 3 && (
  <div className="space-y-6 animate-fadeIn">

    {/* HEADER */}
    <div>
      <h2 className="text-2xl font-bold text-gray-900">
        Resume Selection
      </h2>
      <p className="text-gray-500 text-sm">
        Select an existing resume or upload a new one
      </p>
    </div>

    {/* OPTIONS */}
    <div className="flex gap-8 border-b pb-4 text-sm font-medium">

      {/* EXISTING */}
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="radio"
          checked={resumeMode === "existing"}
          onChange={() => {
            resetUploadState()
            setResumeMode("existing")

            // clear upload
            setField("resumeFile", null)
          }}
        />
        Select Existing
      </label>

      {/* UPLOAD */}
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="radio"
          checked={resumeMode === "upload"}
          onChange={() => {
            resetUploadState()
            setResumeMode("upload")

            // clear existing
            setField("resumeId", "")
            setField("resumeUrl", "")
          }}
        />
        Upload Resume
      </label>
    </div>

    {/* EXISTING RESUME DROPDOWN */}
    {resumeMode === "existing" && (
      <div className="space-y-3">

        <label className="text-sm font-medium">
          Select Resume
        </label>

        <div className="relative">
          <select
            value={form.resumeId || ""}
            onChange={(e) => {

              const selected = existingResumes.find(
                r => r._id === e.target.value
              )

              if (!selected) return

              setField("resumeId", selected._id)
              setField("resumeUrl", selected.downloadUrl)
              setField("resumeTitle", selected.title)

              setPreviewUrl(
                selected.previewUrl || selected.downloadUrl
              )
            }}
            className="w-full appearance-none p-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          >

            <option value="">
              Select Resume
            </option>

            {existingResumes.map(r => (
              <option key={r._id} value={r._id}>
                {r.title}
              </option>
            ))}

          </select>

          {/* custom arrow */}
          <div className="absolute right-3 top-3 text-gray-400 pointer-events-none">
            ▼
          </div>
        </div>

        {!previewUrl && (
          <p className="text-xs text-gray-500">
            Select a resume to preview
          </p>
        )}

      </div>
    )}

    {/* UPLOAD SECTION */}
    {resumeMode === "upload" && (
      <div className="space-y-4">

        {/* TITLE */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Resume Title
            <span className="text-red-500">*</span>
          </label>

          <input
            type="text"
            placeholder="Enter resume title"
            value={form.resumeTitle || ""}
            onChange={(e) =>
              setField("resumeTitle", e.target.value)
            }
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        {/* UPLOADER */}
        <ResumeUploader
          allowExisting={false}
          onSelect={({ file }) =>
            setField("resumeFile", file)
          }
        />

        {/* UPLOAD BUTTON */}
        {!uploadComplete && (
          <button
            disabled={
              !form.resumeFile ||
              !form.resumeTitle ||
              isUploading
            }
            onClick={async () => {

              try {

                setIsUploading(true)

                const res = await uploadToGCS(
                  form.resumeFile,
                  form.resumeTitle
                )

                const uploaded = res.resume

                setField("resumeUrl", uploaded.downloadUrl)
                setField("resumeId", uploaded._id)

                setPreviewUrl(uploaded.previewUrl)

                setUploadComplete(true)

              } catch {

                showToast("Upload failed", "error")

              } finally {

                setIsUploading(false)

              }

            }}
            className={`px-5 py-2.5 rounded-lg text-white ${
              !form.resumeFile ||
              !form.resumeTitle ||
              isUploading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {isUploading ? "Uploading..." : "Upload Resume"}
          </button>
        )}

      </div>
    )}

    {/* PREVIEW */}
    {previewUrl && (
      <div className="space-y-3">

        <p className="text-sm font-medium">
          Resume Preview
        </p>

        <iframe
          key={previewUrl}
          src={`${previewUrl}#toolbar=0`}
          className="w-full h-[420px] border rounded-lg bg-gray-50"
          title="resume-preview"
        />

        {resumeMode === "upload" && uploadComplete && (
          <button
            onClick={() => {

              setUploadComplete(false)

              setField("resumeFile", null)
              setField("resumeTitle", "")

              setPreviewUrl("")

            }}
            className="text-sm text-indigo-600 underline hover:text-indigo-800"
          >
            Upload another resume
          </button>
        )}

      </div>
    )}

  </div>
)}

          {/* STEP 4 — TRANSCRIPT SETTINGS */}
          {step === 4 && (
            <div className="space-y-6 animate-fadeIn">

              {/* Header */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  AI Interview Transcript / Summary
                </h2>
                <p className="text-gray-600 text-sm">
                  Choose whether to save the transcript and AI summary of your interview.
                </p>
              </div>

              {/* Toggle */}
              <div>
                <label className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    Save Transcript & Summary (Optional)
                  </span>

                  <input
                    type="checkbox"
                    checked={form.saveTranscript}
                    onChange={() =>
                      setField("saveTranscript", !form.saveTranscript)
                    }
                    className="w-5 h-5"
                  />
                </label>

                <p className="text-gray-500 text-xs mt-2">
                  When enabled, your interview transcript and AI analysis
                  will be saved for later review in your dashboard.
                </p>
              </div>

              {/* Legal Notice */}
              <div className="bg-red-50 border border-red-200 p-3 rounded-lg text-xs text-red-700">
                <strong>Legal Notice:</strong> Some regions require consent before
                recording or transcribing conversations. Ensure you comply with
                applicable laws before enabling this feature.
              </div>

            </div>
          )}

          {/* STEP 5 — SESSION DURATION */}
          {step === 5 && (
            <div className="space-y-5 animate-fadeIn">

              {/* Header */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  Session Duration
                </h2>
                <p className="text-gray-600 text-sm">
                  Set the interview duration and choose whether it can extend automatically.
                </p>
              </div>

              {/* Auto Extend */}
              <label className="flex justify-between items-center">
                <span className="text-sm font-medium">
                  Auto Extend Session
                </span>

                <input
                  type="checkbox"
                  checked={form.autoExtend}
                  onChange={() =>
                    setField("autoExtend", !form.autoExtend)
                  }
                  className="w-5 h-5"
                />
              </label>

              {/* Duration */}
              <div>
                <label className="text-sm block mb-1">
                  Duration (minutes)
                </label>

                <input
                  type="number"
                  value={form.durationMinutes}
                  onChange={(e) =>
                    setField("durationMinutes", e.target.value)
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="e.g. 30"
                />
              </div>

            </div>
          )}

          {/* STEP 6 — CONNECT & ACTIVATE */}
          {step === 6 && (
            <div className="space-y-6 animate-fadeIn">

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  Connect & Start
                </h2>
                <p className="text-gray-600 text-sm">
                  Choose how you want to connect your interview session.
                </p>
              </div>

              {/* Language */}
              <div>
                <label className="text-sm font-semibold">🌐 Language</label>
                <select
                  className="mt-2 border p-2 rounded-lg w-full text-sm bg-gray-50"
                  value={form.language}
                  disabled
                >
                  <option>{form.language}</option>
                </select>
              </div>

              {/* AI Model */}
              <div>
                <label className="text-sm font-semibold">🤖 AI Model</label>
                <select
                  className="mt-2 border p-2 rounded-lg w-full text-sm bg-gray-50"
                  disabled
                >
                  <option>{form.aiModel}</option>
                </select>
              </div>

              {/* Share Audio Toggle */}
              <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                <span className="text-sm font-medium">
                  Share Tab Audio
                </span>

                <label className="relative inline-flex items-center cursor-pointer">
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

              {/* Connect Methods */}
              <div>
                <h3 className="font-semibold mb-3">How to Connect:</h3>

                <div className="flex gap-4 flex-wrap">
                  {[
                    { id: "zoom", logo: ZoomLogo },
                    { id: "meet", logo: MeetLogo },
                    { id: "teams", logo: TeamsLogo },
                    { id: "whatsapp", logo: WhatsappLogo }
                  ].map(item => (
                    <img
                      key={item.id}
                      src={item.logo}
                      alt={item.id}
                      onClick={() => setSelectedMethod(item.id)}
                      className={`w-10 h-10 cursor-pointer rounded-full p-1 
            ${selectedMethod === item.id ? "ring-2 ring-theme-primary" : ""}`}
                    />
                  ))}
                </div>
              </div>

              {/* Meeting Link */}
              <div>
                <label className="text-sm font-semibold">
                  Meeting Link (optional)
                </label>
                <input
                  value={meetingLink}
                  onChange={e => setMeetingLink(e.target.value)}
                  placeholder="Paste meeting URL"
                  className="mt-2 w-full border p-2 rounded-lg text-sm bg-gray-50"
                />
              </div>

              <div className="bg-gray-100 p-3 rounded-lg text-sm text-gray-600">
                🔊 Make sure to enable <strong>Share Tab Audio</strong> while sharing your screen.
              </div>

            </div>
          )}

        </div>

        <div className="p-4 border-t flex justify-between bg-white">

          {/* PREV BUTTON */}
          {step > 1 ? (
            <button
              onClick={prev}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
            >
              <ArrowLeft size={16} /> Prev
            </button>
          ) : (
            <div />
          )}

          {/* STEP 1 */}
          {step === 1 && (
            <button
              onClick={() => {
                if (!form.company || !form.position) return;
                next();
              }}
              disabled={!form.company || !form.position}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg text-white transition
        ${!form.company || !form.position
                  ? "bg-gray-400 cursor-not-allowed"
                  : "theme-primary"
                }`}
            >
              Next <ArrowRight size={16} />
            </button>
          )}

          {/* STEP 2–4 */}
          {step > 1 && step < 5 && (
            <button
              onClick={next}
              className="flex items-center gap-2 px-5 py-2 rounded-lg text-white theme-primary transition"
            >
              Next <ArrowRight size={16} />
            </button>
          )}

          {/* STEP 5 → CREATE SESSION */}
          {step === 5 && (
            <button
              onClick={createSession}
              disabled={creating}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg text-white transition
        ${creating
                  ? "bg-gray-400 cursor-not-allowed"
                  : "theme-primary"
                }`}
            >
              {creating ? "Creating..." : "Create Session"}
            </button>
          )}

          {/* STEP 6 → ACTIVATE */}
          {step === 6 && (
<button
  onClick={async () => {
    if (!selectedMethod) return showToast("Select connection method", "error");

    try {
      const sessionId = form._id || form.id;
      if (!sessionId) return showToast("Session ID missing", "error");

      // Call backend to connect session
      const response = await sessionService.connectSession(sessionId, {
        shareAudio,
        connectionMethod: selectedMethod,
        meetingLink,
        language: form.language,
        aiModel: form.aiModel,
      });

      // Refresh user profile / credits
      const updatedUser = await getProfile();
      onClose(); // close modal

      // Determine URL to open
      let urlToOpen = meetingLink?.trim();
      if (!urlToOpen) {
        switch (selectedMethod) {
          case "zoom": urlToOpen = "https://zoom.us/"; break;
          case "meet": urlToOpen = "https://meet.google.com/"; break;
          case "teams": urlToOpen = "https://teams.microsoft.com/"; break;
          case "whatsapp": urlToOpen = "https://web.whatsapp.com/"; break;
          default: urlToOpen = "/"; break;
        }
      }

      // Fallback to backend meeting URL if exists
      if (response?.data?.meetingUrl) {
        urlToOpen = response.data.meetingUrl;
      }

      // Open in new tab
      window.open(urlToOpen, "_blank");

      showToast("Session activated! 🎉");

    } catch (err) {
      showToast(err.response?.data?.message || "Failed to start session", "error");
    }
  }}
  disabled={!selectedMethod}
  className={`flex items-center gap-2 px-6 py-2 rounded-lg text-white transition
      ${!selectedMethod ? "bg-gray-400 cursor-not-allowed" : "theme-primary"}`}
>
  ⚡ Activate & Connect
</button>
          )}

        </div>
      </div>

<ResumeProcessingLoader
  open={isUploading}
  processing={isUploading}
  successMessage="Resume Uploaded Successfully!"
/>
      {/* TOASTS */}
      <div className="fixed top-6 right-6 space-y-2">
        {toasts.map(t => (
          <Toast
            key={t.id}
            {...t}
            onClose={() =>
              setToasts(prev => prev.filter(x => x.id !== t.id))
            }
          />
        ))}
      </div>
    </div>
  );
}