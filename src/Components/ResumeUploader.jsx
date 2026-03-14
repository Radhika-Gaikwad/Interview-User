import React, { useEffect, useRef, useState } from "react";
import { UploadCloud, CheckCircle } from "lucide-react";
import mammoth from "mammoth/mammoth.browser";
import { uploadToGCS } from "../utils/gcsUpload";

export default function ResumeUploader({
  resumes = [],
  onSelect,
  allowExisting = true,
  height = "h-[420px]",
}) {
  const fileInputRef = useRef(null);

  const [selectedResume, setSelectedResume] = useState(null);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [mode, setMode] = useState(allowExisting ? "existing" : "upload");
const [dragActive, setDragActive] = useState(false);
  /* -------------------------------- */
  /* Preview for newly uploaded file  */
  /* -------------------------------- */
useEffect(() => {
  if (!file) {
    setPreviewUrl("");
    return;
  }

  const fileType = file.type;

  // Only allow PDF preview
  if (fileType === "application/pdf") {
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  } else {
    // DOC/DOCX cannot preview in browser
    setPreviewUrl("doc-file");
  }
}, [file]);

const handleFile = async (f) => {
  setFile(f);
  setSelectedResume(null);
  onSelect?.({ file: f, existing: null });

  if (f.type === "application/pdf") {
    setPreviewUrl(URL.createObjectURL(f));
  } else if (f.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || 
             f.type === "application/msword") {
    // Try to extract text with mammoth
    const arrayBuffer = await f.arrayBuffer();
    const { value: text } = await mammoth.extractRawText({ arrayBuffer });
    setPreviewUrl({ docText: text });
  }
};

  const selectExisting = (resume) => {
    setSelectedResume(resume);
    setFile(null);
    setPreviewUrl("");

    onSelect?.({ file: null, existing: resume });
  };

  return (
    <div className="space-y-4">
      {/* Toggle */}
      {allowExisting && (
        <div className="flex gap-2">
          <button
            onClick={() => setMode("existing")}
            className={`px-4 py-2 rounded-lg border ${
              mode === "existing" ? "bg-gray-100 font-semibold" : ""
            }`}
          >
            Existing
          </button>

          <button
            onClick={() => setMode("upload")}
            className={`px-4 py-2 rounded-lg border ${
              mode === "upload" ? "bg-gray-100 font-semibold" : ""
            }`}
          >
            Upload New
          </button>
        </div>
      )}

      {/* ----------------------------- */}
      {/* EXISTING RESUMES              */}
      {/* ----------------------------- */}
      {mode === "existing" && allowExisting && (
        <div className="grid gap-2 max-h-40 overflow-auto">
          {resumes.length === 0 && (
            <div className="text-sm text-gray-500 border border-dashed p-3 rounded-lg">
              No saved resumes
            </div>
          )}

          {resumes.map((r) => (
            <div
              key={r._id}
              onClick={() => selectExisting(r)}
              className={`p-3 border rounded-lg cursor-pointer flex justify-between items-center hover:bg-gray-50 ${
                selectedResume?._id === r._id
                  ? "border-indigo-500"
                  : ""
              }`}
            >
              <div>
                <div className="font-medium">{r.title}</div>
                <div className="text-xs text-gray-500 break-all">
                  {r.previewUrl}
                </div>
              </div>

              {selectedResume?._id === r._id && (
                <CheckCircle className="text-indigo-600" size={18} />
              )}
            </div>
          ))}
        </div>
      )}

 {mode === "upload" && (
  <div
    onClick={() => fileInputRef.current.click()}
    onDragOver={(e) => {
      e.preventDefault();
      setDragActive(true);
    }}
    onDragLeave={(e) => {
      e.preventDefault();
      setDragActive(false);
    }}
    onDrop={(e) => {
      e.preventDefault();
      setDragActive(false);

      const droppedFile = e.dataTransfer.files?.[0];
      if (droppedFile) {
        handleFile(droppedFile);
      }
    }}
    className={`
      border-2 border-dashed rounded-2xl p-8 text-center
      cursor-pointer transition-all duration-200
      ${dragActive 
        ? "border-indigo-600 bg-indigo-100 scale-[1.02]" 
        : "border-indigo-400 hover:bg-indigo-50"}
    `}
  >
    <UploadCloud size={40} className="mx-auto text-indigo-500" />

    <p className="mt-2 font-medium text-gray-700">
      Click or drag resume here
    </p>

    <p className="text-xs text-gray-500">
      PDF, DOC, DOCX (max 5MB)
    </p>

    <input
      ref={fileInputRef}
      type="file"
      accept=".pdf,.doc,.docx"
      className="hidden"
      onChange={(e) => handleFile(e.target.files[0])}
    />
  </div>
)}
{previewUrl || selectedResume?.previewUrl ? (
  <div className="border rounded-xl overflow-hidden shadow-sm">
    <div className="bg-gray-50 px-3 py-2 text-xs text-gray-600">
      Preview
    </div>

    <div className="w-full overflow-hidden rounded-b-xl p-6 text-center max-h-[65vh] overflow-auto">
      {previewUrl === "doc-file" ? (
        <>
          <p className="font-medium text-gray-700">
            DOC/DOCX cannot be previewed directly in browser.
          </p>
          <p className="text-sm mt-1 text-gray-500">
            Preview will be available after upload as PDF.
          </p>
        </>
      ) : (
        <iframe
          title="resume-preview"
          src={previewUrl || selectedResume?.previewUrl}
          className="w-full h-[65vh] border-0"
        />
      )}
    </div>
  </div>
) : null}
    </div>
  );
}