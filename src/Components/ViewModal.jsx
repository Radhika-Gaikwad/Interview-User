import React, { useEffect, useState } from "react";
import { getPreviewSrc } from "../utils/getPreviewSrc";
import { X, Download } from "lucide-react";

const renderSimpleList = (title, items) => {
  if (!Array.isArray(items) || items.length === 0) return null;

  return (
    <div className="glass rounded-xl p-5">
      <h4 className="text-lg font-semibold theme-text mb-3">
        {title}
      </h4>

      <ul className="list-disc ml-5 text-gray-700 text-sm space-y-1">
        {items.map((item, i) => (
          <li key={i}>
            {typeof item === "string" ? item : item.title || item.name}
          </li>
        ))}
      </ul>
    </div>
  );
};
export default function ViewModal({ open, item, onClose }) {
   const [previewSrc, setPreviewSrc] = useState("");

  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => (document.body.style.overflow = prev || "");
    }
  }, [open]);

  // ✅ LOAD PREVIEW (SIGNED URL)
  useEffect(() => {
    const loadPreview = async () => {
      if (!item?.previewUrl) return;

      try {
        const url = await getPreviewSrc(item.previewUrl);
        setPreviewSrc(url);
      } catch (err) {
        console.error("Preview load failed:", err);
      }
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

  // ✅ DOWNLOAD FIX (SIGNED URL)
  const handleDownload = async () => {
    try {
      const res = await fetch(item.downloadUrl, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();

      // ✅ direct download
      window.open(data.url, "_blank");

    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  if (!open || !item) return null;

  

  if (!open || !item) return null;

  const data = item.parsedData || {};
  const contact = data.contact || {};



  return (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center animate-fadeIn">

      {/* overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative z-[1000000] w-[96%] lg:w-[1100px] max-h-[92vh] bg-white rounded-2xl shadow-2xl flex flex-col">

        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-white/40">
          <div>
            <h3 className="text-2xl font-bold theme-text">
              {contact.name || item.title}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {contact.email} {contact.phone && `• ${contact.phone}`}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg glass hover:scale-110 transition"
          >
            <X size={22} />
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 overflow-y-auto space-y-8">

          {/* SUMMARY */}
          {data.profile_summary && (
            <div className="glass rounded-xl p-5">
              <h4 className="text-lg font-semibold theme-text mb-3">
                Profile Summary
              </h4>
              <p className="text-gray-700 leading-relaxed">
                {data.profile_summary}
              </p>
            </div>
          )}
{/* CONTACT LINKS */}
{(contact.linkedin || contact.github || contact.website) && (
  <div className="glass rounded-xl p-5">
    <h4 className="text-lg font-semibold theme-text mb-3">Links</h4>

    <div className="flex flex-wrap gap-3 text-sm">
      {contact.linkedin && (
        <a
          href={contact.linkedin}
          target="_blank"
          rel="noreferrer"
          className="px-3 py-1 rounded-lg bg-blue-50 text-blue-600 hover:underline"
        >
          LinkedIn
        </a>
      )}

      {contact.github && (
        <a
          href={contact.github}
          target="_blank"
          rel="noreferrer"
          className="px-3 py-1 rounded-lg bg-gray-100 hover:underline"
        >
          GitHub
        </a>
      )}

      {contact.website && (
        <a
          href={contact.website}
          target="_blank"
          rel="noreferrer"
          className="px-3 py-1 rounded-lg bg-green-50 text-green-600 hover:underline"
        >
          Portfolio
        </a>
      )}
    </div>
  </div>
)}
{/* CAPABILITIES */}
{Array.isArray(data.capabilities) && data.capabilities.length > 0 && (
  <div className="glass rounded-xl p-5">
    <h4 className="text-lg font-semibold theme-text mb-4">
      Core Capabilities
    </h4>

    <div className="flex flex-wrap gap-2">
      {data.capabilities.map((cap, i) => (
        <span
          key={i}
          className="px-3 py-1 text-sm rounded-full bg-indigo-50 text-indigo-700"
        >
          {cap}
        </span>
      ))}
    </div>
  </div>
)}
          {/* SKILLS */}
          {Array.isArray(data.skills) && data.skills.length > 0 && (
            <div className="glass rounded-xl p-5">
              <h4 className="text-lg font-semibold theme-text mb-4">
                Skills
              </h4>
              <div className="flex flex-wrap gap-2">
                {data.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 text-sm rounded-full theme-tertiary shadow-sm hover:scale-105 transition"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
{/* EXPERIENCE */}
{Array.isArray(data.experience) && data.experience.length > 0 && (
  <div>
    <h4 className="text-lg font-semibold theme-text mb-4">
      Experience
    </h4>

    <div className="space-y-4">
      {data.experience.map((exp, i) => (
        <div
          key={i}
          className="glass-card rounded-xl p-5 hover-faint-gradient transition"
        >
          {/* Title + Company */}
          <p className="font-semibold text-gray-800">
            {exp.title} — {exp.company || exp.organization || ""}
          </p>

          {/* Dates */}
          {(exp.start_date || exp.end_date) && (
            <p className="text-sm text-gray-500 mb-2">
              {exp.start_date || ""} {exp.start_date && exp.end_date && " - "} {exp.end_date || ""}
            </p>
          )}

          {/* Description */}
          {Array.isArray(exp.description) && exp.description.length > 0 && (
            <ul className="list-disc ml-5 text-sm text-gray-700 space-y-1">
              {exp.description.map((d, idx) => (
                <li key={idx}>{d}</li>
              ))}
            </ul>
          )}

          {typeof exp.description === "string" && (
            <p className="text-sm text-gray-700">{exp.description}</p>
          )}

          {/* Technologies */}
          {Array.isArray(exp.technologies) && exp.technologies.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {exp.technologies.map((tech, t) => (
                <span
                  key={t}
                  className="px-2 py-1 text-xs bg-gray-100 rounded-md"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
)}
{/* PROJECTS */}
{Array.isArray(data.projects) && data.projects.length > 0 && (
  <div>
    <h4 className="text-lg font-semibold theme-text mb-4">
      Projects
    </h4>

    <div className="space-y-4">
      {data.projects.map((proj, i) => (
        <div
          key={i}
          className="glass-card rounded-xl p-5 hover-faint-gradient"
        >
          <p className="font-semibold text-gray-800">
            {proj.title}
          </p>

          <ul className="list-disc ml-5 text-sm text-gray-700 mt-2 space-y-1">
            {proj.description?.map((d, idx) => (
              <li key={idx}>{d}</li>
            ))}
          </ul>

          {/* Technologies */}
          {proj.technologies?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {proj.technologies.map((tech, t) => (
                <span
                  key={t}
                  className="px-2 py-1 text-xs bg-gray-100 rounded"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}

          {/* Project Links */}
          {proj.links?.length > 0 && (
            <div className="mt-3">
              {proj.links.map((link, l) => (
                <a
                  key={l}
                  href={link}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-blue-600 hover:underline"
                >
                  {link}
                </a>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
)}
          {/* EDUCATION */}
          {Array.isArray(data.education) && data.education.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold theme-text mb-4">
                Education
              </h4>

              {data.education.map((edu, i) => (
                <div
                  key={i}
                  className="glass-card rounded-xl p-5 hover-faint-gradient transition"
                >
                  <p className="font-semibold">{edu.degree}</p>
                  <p className="text-gray-700">{edu.institution}</p>
                  <p className="text-sm text-gray-500">
                    {edu.start_date} - {edu.end_date}
                  </p>
                </div>
              ))}
            </div>
          )}

{renderSimpleList("Certifications", data.certifications)}
{renderSimpleList("Achievements", data.achievements)}
{renderSimpleList("Languages", data.languages)}
{renderSimpleList("Interests", data.interests)}



 <div className="p-4">
   <div className="glass-card rounded-xl overflow-hidden">
    <h4 className="text-lg font-semibold theme-text px-5 pt-5">
      Resume Preview
    </h4>
          {previewSrc ? (
            <iframe
              src={previewSrc}
              className="w-full h-[500px]"
              title="Resume Preview"
            />
          ) : (
            <p className="text-center text-gray-500">
              Loading preview...
            </p>
          )}
          </div>
        </div>
        </div>

        {/* FOOTER */}
        <div className="p-4 border-t border-gray-200 flex justify-end gap-3 bg-gray-50">
          <button
            onClick={handleDownload}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2 rounded-xl theme-primary shadow-lg hover:brightness-110 transition"
          >
            <Download size={18} /> Download
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}