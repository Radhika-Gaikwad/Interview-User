export const getPreviewSrc = (url) => {
  if (!url) return "";

  const lower = url.toLowerCase();

  // PDF → show directly
  if (lower.includes(".pdf")) return url;

  // Word → use Google Docs Viewer
  if (lower.includes(".doc") || lower.includes(".docx")) {
    return `https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`;
  }

  return url;
};