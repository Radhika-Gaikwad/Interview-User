import React, { useState, useEffect } from "react";
import { X, ArrowLeft, ArrowRight } from "lucide-react";
import Toast from "../utils/toast";
import ResumeUploader from "./ResumeUploader";
import { getResumesService } from "../Services/resume.service";
import { uploadToGCS } from "../utils/gcsUpload";
import ResumeProcessingLoader from "./ResumeProcessingLoader"; 
import { getPreviewSrc } from "../utils/getPreviewSrc";

export default function SessionEditModal({
  open,
  item,
  onClose,
  onSave,
}) {
  const [step, setStep] = useState(1);

  const [toasts, setToasts] = useState([]);
  const [resumeMode, setResumeMode] = useState("current");
  const [existingResumes, setExistingResumes] = useState([]);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
    const [previewUrl, setPreviewUrl] = useState("");
const [signedPreview, setSignedPreview] = useState("");
  useEffect(() => {
  if (resumeMode === "existing") {
    getResumesService()
      .then(res => {
        // res.data.data is the array of resumes
        setExistingResumes(res.data?.data || []);
      })
      .catch(() => showToast("Failed to load resumes", "error"));
  }
}, [resumeMode]);


useEffect(() => {
  const loadPreview = async () => {
    if (!previewUrl) {
      setSignedPreview("");
      return;
    }

    try {
      const url = await getPreviewSrc(previewUrl);
      setSignedPreview(url);
    } catch (err) {
      console.error("Preview failed:", err);
      setSignedPreview("");
    }
  };

  loadPreview();
}, [previewUrl]);
const resetUploadState = () => {
  setField("resumeTitle", "");
  setField("resumeFile", null);
  setField("resumeUrl", "");
  setPreviewUrl("");
  setUploadComplete(false);
};

useEffect(() => {
  if (resumeMode !== "upload") {
    setUploadComplete(false);
  }
}, [resumeMode]);

  const showToast = (message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
  };
  const [form, setForm] = useState({
    company: "",
    position: "",
    jobDescription: "",
    skills: "",
    language: "English",
    resumeUrl: "",
    durationMinutes: 30,
    autoExtend: true,
  });



useEffect(() => {
  if (!item || !open) return;

  const load = async () => {
    const raw = item.raw || item;

    const previewLink =
      raw.resumePreviewUrl ||
      (raw.resumeId?._id ? `/api/resume/view/${raw.resumeId._id}` : "");

    const downloadLink = raw.resumeDownloadUrl || raw.resumeUrl || "";

    const finalPreview = previewLink || downloadLink;

    const signed = await getPreviewSrc(finalPreview);

    setForm({
      company: raw.company || "",
      position: raw.position || "",
      jobDescription: raw.jobDescription || "",
      skills: (raw.skills || []).join(", "),
      language: raw.language || "English",
      resumeUrl: finalPreview,
      download: downloadLink,
      resumeTitle: raw.selectedResumeName || raw.resumeName || "",
      durationMinutes: raw.durationMinutes || 30,
      autoExtend: raw.autoExtend ?? true,
    });

    setPreviewUrl(signed);
    setResumeMode("current");
    setStep(1);
  };

  load();
}, [item, open]);

 useEffect(() => {
  if (!item || !open) return;

  const raw = item.raw || item;

  const previewLink =
    raw.resumePreviewUrl ||
    (raw.resumeId?._id ? `/api/resume/view/${raw.resumeId._id}` : "");

  const downloadLink = raw.resumeDownloadUrl || raw.resumeUrl || "";

  const loaded = {
    company: raw.company || "",
    position: raw.position || "",
    jobDescription: raw.jobDescription || "",
    skills: (raw.skills || []).join(", "),
    language: raw.language || "English",
    resumeUrl: previewLink || downloadLink,
    download: downloadLink,
    resumeTitle: raw.selectedResumeName || raw.resumeName || "",
    durationMinutes: raw.durationMinutes || 30,
    autoExtend: raw.autoExtend ?? true,
  };

  setForm(loaded);
  setPreviewUrl(previewLink);
  setResumeMode("current");
  setStep(1);

}, [item, open]);

useEffect(() => {
  if (resumeMode === "current" && item) {
    const raw = item.raw || item;
    const previewLink =
      raw.resumePreviewUrl ||
      (raw.resumeId?._id ? `/api/resume/view/${raw.resumeId._id}` : "") ||
      raw.resumeUrl || 
      raw.downloadUrl || 
      "";

    setPreviewUrl(previewLink);
    setField("resumeUrl", previewLink);
    setField("resumeTitle", raw.selectedResumeName || raw.resumeName || "");
  }
}, [resumeMode, item]);

  const setField = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

const next = () => {
  if (step === 1 && !validateStep1()) return;
  setStep((s) => Math.min(4, s + 1));
};
  const prev = () => setStep((s) => Math.max(1, s - 1));

  async function save() {
    try {
      if (!form.company || !form.position) {
        showToast("Company & Position are required", "error");
        return;
      }

      if (!form.resumeUrl) {
        showToast("Please select or upload a resume", "error");
        return;
      }

      const payload = {
        company: form.company,
        position: form.position,
        jobDescription: form.jobDescription,

        skills: form.skills
          ? form.skills.split(",").map(s => s.trim()).filter(Boolean)
          : [],

        language: form.language,
        simpleEnglish: form.simpleEnglish || false,
        extraContext: form.extraContext || "",
        aiModel: form.aiModel || "GPT-4.1",

        resumeUrl: form.resumeUrl,

        // ⭐ ADD THIS
        resumePreviewUrl: previewUrl,

        // ⭐ ADD THIS (optional but recommended)
        selectedResumeName: form.resumeTitle || "",

        durationMinutes: Number(form.durationMinutes) || 30,
        autoExtend: form.autoExtend,
      };
      setSaving(true);

      await onSave(payload);
      showToast("Session updated successfully!", "success");

      setTimeout(() => {
        onClose();
      }, 1000);

    } catch (err) {
      console.error(err);
      setSaving(false);
      showToast("Failed to update session", "error");
    }
    finally {
      setSaving(false);
    }
  }

  if (!open) return null;

const validateStep1 = () => {
  const newErrors = {};

  if (!form.company.trim()) {
    newErrors.company = "Company name is required";
  }

  if (!form.position.trim()) {
    newErrors.position = "Position is required";
  }

  setErrors(newErrors);

  return Object.keys(newErrors).length === 0;
};

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">

      {/* Modal Container */}
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl relative animate-fadeIn
                      max-h-[90vh] flex flex-col">

        {/* HEADER */}
        <div className="p-6 border-b">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-700"
          >
            <X size={26} />
          </button>

          <h2 className="text-2xl font-bold">Edit Session</h2>
          <p className="text-sm text-gray-500 mt-1">
            Update interview details and preferences.
          </p>

          <div className="mt-2 text-xs text-gray-400">
            Step {step} of 4
          </div>
        </div>

        {/* BODY (SCROLLABLE) */}
        <div className="p-6 overflow-y-auto flex-1">

          {step === 1 && (
            <div className="space-y-5">

         <div>
  <label className="text-gray-700 font-medium text-sm flex items-center gap-2 mb-1">
    🏢 Company <span className="text-red-500">*</span>
  </label>

  <input
    type="text"
    placeholder="Enter Company Name"
    value={form.company}
    onChange={(e) => {
      setField("company", e.target.value);
      setErrors((prev) => ({ ...prev, company: "" }));
    }}
    className={`w-full p-3 rounded-lg border ${
      errors.company ? "border-red-500" : "border-gray-300"
    } focus:ring-2 focus:ring-theme-primary focus:outline-none`}
  />

  {errors.company && (
    <p className="text-red-500 text-xs mt-1">{errors.company}</p>
  )}
</div>

            <div>
  <label className="text-gray-700 font-medium text-sm flex items-center gap-2 mb-1">
    💼 Position <span className="text-red-500">*</span>
  </label>

  <input
    type="text"
    placeholder="Enter Position / Role"
    value={form.position}
    onChange={(e) => {
      setField("position", e.target.value);
      setErrors((prev) => ({ ...prev, position: "" }));
    }}
    className={`w-full p-3 rounded-lg border ${
      errors.position ? "border-red-500" : "border-gray-300"
    } focus:ring-2 focus:ring-theme-primary focus:outline-none`}
  />

  {errors.position && (
    <p className="text-red-500 text-xs mt-1">{errors.position}</p>
  )}
</div>

              {/* Job Description */}
              <div>
                <label className="text-gray-700 font-medium text-sm flex items-center gap-2 mb-1">
                  📝 Job Description
                </label>

                <textarea
                  rows={3}
                  placeholder="Enter job responsibilities or description"
                  value={form.jobDescription}
                  onChange={(e) => setField("jobDescription", e.target.value)}
                  className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-theme-primary focus:outline-none resize-none"
                />
              </div>

              {/* Skills */}
              <div>
                <label className="text-gray-700 font-medium text-sm flex items-center gap-2 mb-1">
                  🧭 Skills
                </label>

                <input
                  type="text"
                  placeholder="e.g. React, Node.js, SQL"
                  value={form.skills}
                  onChange={(e) => setField("skills", e.target.value)}
                  className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-theme-primary focus:outline-none"
                />

                <p className="text-xs text-gray-500 mt-1">
                  Separate skills with commas.
                </p>
              </div>

            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">

              {/* Language */}
              <div>
                <label className="text-sm font-medium mb-1 block">
                  🌐 Language
                </label>
                <select
                  value={form.language}
                  onChange={(e) => setField("language", e.target.value)}
                  className="w-full p-3 rounded-lg border border-gray-300"
                >
                  <option>English</option>
                 
                </select>
              </div>

              {/* Simple English Toggle */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Simple English</span>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.simpleEnglish || false}
                    onChange={() =>
                      setField("simpleEnglish", !form.simpleEnglish)
                    }
                    className="sr-only peer"
                  />

                  <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-theme-primary"></div>

                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition peer-checked:translate-x-5"></div>
                </label>
              </div>

              <p className="text-gray-500 text-xs">
                If English is not your first language, enable this so AI avoids complex vocabulary.
              </p>

              {/* Extra Context */}
              <div>
                <label className="text-sm font-medium block mb-1">
                  Extra Context / Instructions (Optional)
                </label>

                <textarea
                  rows={4}
                  placeholder="Write any extra instructions..."
                  value={form.extraContext || ""}
                  onChange={(e) => setField("extraContext", e.target.value)}
                  className="w-full p-3 rounded-lg border border-gray-300"
                />
              </div>

              {/* AI Model */}
              <div>
                <label className="text-sm font-medium block mb-1">
                  🤖 AI Model (Optional)
                </label>

                <select
                  value={form.aiModel || "GPT-4.1"}
                  onChange={(e) => setField("aiModel", e.target.value)}
                  className="w-full p-3 rounded-lg border border-gray-300"
                >
                  <option value="GPT-4.1">GPT-4.1 (Smarter)</option>
                  <option value="GPT-4 Turbo">GPT-4 Turbo</option>
                  <option value="GPT-3.5">GPT-3.5</option>
                  <option value="GPT-4 Mini">GPT-4 Mini (Fast & Cheap)</option>
                </select>
              </div>

            </div>
          )}

          {step === 3 && (
  <div className="space-y-6">

    {/* OPTIONS */}
    <div className="flex gap-6 border-b pb-4 text-sm font-medium">

      {/* CURRENT */}
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="radio"
          checked={resumeMode === "current"}
          onChange={async () => {
            resetUploadState();
            setResumeMode("current");

            const raw = item?.raw || item;

            const previewLink =
              raw.resumePreviewUrl ||
              (raw.resumeId?._id
                ? `/api/resume/view/${raw.resumeId._id}`
                : "") ||
              raw.resumeUrl ||
              raw.downloadUrl ||
              "";

            setField("resumeUrl", previewLink);
            setField("resumeTitle", raw.resumeName || "");

            // ✅ FIX: ALWAYS GET SIGNED URL
            const signed = await getPreviewSrc(previewLink);
            setPreviewUrl(signed);
          }}
        />
        Use Current
      </label>

      {/* EXISTING */}
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="radio"
          checked={resumeMode === "existing"}
          onChange={() => {
            resetUploadState();
            setResumeMode("existing");
          }}
        />
        Existing
      </label>

      {/* UPLOAD */}
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="radio"
          checked={resumeMode === "upload"}
          onChange={() => {
            resetUploadState();
            setResumeMode("upload");
          }}
        />
        Upload New
      </label>
    </div>

    {/* EXISTING RESUME */}
    {resumeMode === "existing" && (
      <div>
        <select
          className="w-full p-3 border rounded-lg"
          onChange={async (e) => {
            const selected = existingResumes.find(
              r => String(r._id) === e.target.value
            );

            if (!selected) return;

            const previewLink =
              selected.previewUrl ||
              selected.resumeUrl ||
              selected.downloadUrl;

            setField("resumeUrl", previewLink);
            setField("resumeTitle", selected.title);

            // ✅ FIX: SIGNED URL
            const signed = await getPreviewSrc(previewLink);
            setPreviewUrl(signed);
          }}
        >
          <option value="">Select Resume</option>
          {existingResumes.map(r => (
            <option key={r._id} value={r._id}>
              {r.title}
            </option>
          ))}
        </select>

        {!previewUrl && (
          <p className="text-xs text-gray-500 mt-2">
            Select a resume to preview
          </p>
        )}
      </div>
    )}

    {/* UPLOAD */}
    {resumeMode === "upload" && (
      <div className="space-y-3">

        <label className="block text-sm font-medium">
          Resume Title <span className="text-red-500">*</span>
        </label>

        <input
          type="text"
          placeholder="Resume Title"
          value={form.resumeTitle || ""}
          onChange={(e) => setField("resumeTitle", e.target.value)}
          className="w-full p-3 border rounded-lg"
        />

        <ResumeUploader
          allowExisting={false}
          onSelect={({ file }) => {
            setField("resumeFile", file);
          }}
        />

        {!uploadComplete && (
          <button
            disabled={
              !form.resumeTitle?.trim() ||
              !form.resumeFile ||
              isUploading
            }
            onClick={async () => {
              try {
                setIsUploading(true);
                showToast("Uploading resume...", "info");

                const res = await uploadToGCS(
                  form.resumeFile,
                  form.resumeTitle
                );

                const uploaded = res.resume;

                setField("resumeUrl", uploaded.downloadUrl);
                setField("resumeTitle", uploaded.title);

                // ✅ FIX: SIGNED URL
                const signed = await getPreviewSrc(uploaded.previewUrl);
                setPreviewUrl(signed);

                setUploadComplete(true);

              } catch {
                showToast("Upload failed", "error");
              } finally {
                setIsUploading(false);
              }
            }}
            className={`px-4 py-2 rounded-lg text-white ${
              !form.resumeTitle?.trim() ||
              !form.resumeFile ||
              isUploading
                ? "bg-gray-400"
                : "bg-indigo-600"
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
        <p className="text-sm font-medium">Preview</p>

        <iframe
          key={previewUrl}
          src={previewUrl}
          className="w-full h-[420px] border rounded-lg bg-gray-50"
          title="resume-preview"
        />

        {resumeMode === "upload" && uploadComplete && (
          <button
            onClick={() => {
              setUploadComplete(false);
              setField("resumeFile", null);
              setField("resumeTitle", "");
              setPreviewUrl("");
            }}
            className="text-sm text-indigo-600 underline"
          >
            Upload another resume
          </button>
        )}
      </div>
    )}

  </div>
)}
          {step === 4 && (
            <div className="space-y-4">

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
                />
              </label>

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
                  className="w-full p-3 border rounded-lg"
                />
              </div>
            </div>
          )}

        </div>

        <div className="p-4 border-t flex justify-between bg-white">

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

          {step < 4 ? (
            <button
              onClick={next}
              disabled={step === 3 && resumeMode === "upload" && !uploadComplete}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg text-white
        ${step === 3 && resumeMode === "upload" && !uploadComplete
                  ? "bg-gray-400 cursor-not-allowed"
                  : "theme-primary"
                }`}
            >
              Next <ArrowRight size={16} />
            </button>
          ) : (
            <button
              onClick={save}
              disabled={saving}
              className="px-6 py-2 rounded-lg text-white theme-primary"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          )}

        </div>

      </div>
 <ResumeProcessingLoader
  open={isUploading}
  processing={isUploading}
  successMessage="Resume Uploaded Successfully!"
/>
      {/* Toast Container */}
      <div className="fixed top-6 right-6 z-50 flex flex-col gap-3">
        {toasts.map((t) => (
          <Toast
            key={t.id}
            id={t.id}
            type={t.type}
            message={t.message}
            onClose={(id) => setToasts((prev) => prev.filter((x) => x.id !== id))}
          />
        ))}
      </div>
    </div>
  );
}