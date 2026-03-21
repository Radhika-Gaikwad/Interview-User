export const getPreviewSrc = async (apiUrl) => {
  if (!apiUrl) return "";

  try {
    const res = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const data = await res.json();

    if (!data?.url) return "";

    const fileUrl = data.url.toLowerCase();

    // ✅ PDF → direct preview
    if (fileUrl.includes(".pdf")) {
      return data.url;
    }

    // ✅ DOC/DOCX → Google viewer
    if (fileUrl.includes(".doc") || fileUrl.includes(".docx")) {
      return `https://docs.google.com/gview?url=${encodeURIComponent(data.url)}&embedded=true`;
    }

    return data.url;

  } catch (err) {
    console.error("Preview fetch failed:", err);
    return "";
  }
};