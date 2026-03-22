import React, { useMemo, useState, useEffect } from "react";
import { Eye, Trash2, Download } from "lucide-react";
import ConfirmModal from "../../Components/ConfirmModal";
import ViewModal from "../../Components/ViewModal";
import {
  getResumesService,
  deleteResumeService,
} from "../../Services/resume.service";

import AILoader from "../../Components/AILoader";

const PAGE_SIZE = 6;

function formatDate(dateStr) {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export default function Resume() {

  const [query, setQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState({});
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [viewItem, setViewItem] = useState(null);

  const [confirmConfig, setConfirmConfig] = useState({
    open: false,
    title: "",
    message: "",
    onConfirm: null
  });

  useEffect(() => {
    const onResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const isMobile = windowWidth < 768;

  useEffect(() => {

    fetchResumes();

    const handleResumeUpdate = () => {
      fetchResumes();
    };

    window.addEventListener("resume-updated", handleResumeUpdate);

    return () => {
      window.removeEventListener("resume-updated", handleResumeUpdate);
    };

  }, [page]);

  const fetchResumes = async () => {

    try {

      setLoading(true);

      const res = await getResumesService(page, PAGE_SIZE);

      const formatted = res.data.data.map((r) => ({
        id: r._id,
        title: r.title,
        createdAt: r.createdAt,
        resumeUrl: r.resumeUrl,
        previewUrl: r.previewUrl,
        downloadUrl: r.downloadUrl,
        textUrl: r.textUrl,
        jsonUrl: r.jsonUrl,
        parsedData: r.parsedData,
      }));

      setData(formatted);

      setTotalPages(res.data.totalPages || 1);
      setTotalItems(res.data.total || formatted.length);

    } catch (err) {

      console.error("Fetch resumes error:", err);

    } finally {

      setLoading(false);

    }

  };

  const filtered = useMemo(() => {

    const q = query.trim().toLowerCase();

    let list = data.filter((r) =>
      q ? r.title.toLowerCase().includes(q) : true
    );

    list.sort((a, b) => {

      const ta = new Date(a.createdAt).getTime();
      const tb = new Date(b.createdAt).getTime();

      return sortOrder === "newest" ? tb - ta : ta - tb;

    });

    return list;

  }, [data, query, sortOrder]);

  const pageItems = filtered;

  const toggleSelect = (id) =>
    setSelected((p) => {

      const n = { ...p };

      if (n[id]) delete n[id];
      else n[id] = true;

      return n;

    });

  const isAllSelected =
    pageItems.length > 0 &&
    pageItems.every((it) => selected[it.id]);

  const toggleSelectAll = () =>
    setSelected((prev) => {

      const next = { ...prev };

      if (isAllSelected) {

        pageItems.forEach((it) => delete next[it.id]);

      } else {

        pageItems.forEach((it) => (next[it.id] = true));

      }

      return next;

    });

  const openView = (id) => {

    const item = data.find((d) => d.id === id);

    setViewItem(item);

  };

  const closeView = () => setViewItem(null);

  const requestDelete = (id) => {

    const item = data.find((d) => d.id === id);

    setConfirmConfig({
      open: true,
      title: "Delete Resume",
      message: `Are you sure you want to delete "${item?.title || "this resume"}"?`,
      onConfirm: async () => {

        try {

          await deleteResumeService(id);

          setData((d) => d.filter((r) => r.id !== id));

          setSelected((s) => {
            const n = { ...s };
            delete n[id];
            return n;
          });

        } catch (err) {

          console.error("Delete error:", err);

        } finally {

          setConfirmConfig((c) => ({ ...c, open: false }));

        }

      },
    });

  };

  const requestDeleteSelected = () => {

    const ids = Object.keys(selected);

    if (!ids.length) return;

    setConfirmConfig({
      open: true,
      title: "Delete Selected Resumes",
      message: `Delete ${ids.length} selected resume(s)?`,
      onConfirm: async () => {

        try {

          await Promise.all(
            ids.map((id) => deleteResumeService(id))
          );

          setData((d) => d.filter((r) => !selected[r.id]));

          setSelected({});

        } catch (err) {

          console.error("Bulk delete error:", err);

        } finally {

          setConfirmConfig((c) => ({ ...c, open: false }));

        }

      },
    });

  };

const handleDownload = async (row) => {
  try {
    const res = await fetch(row.downloadUrl, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const data = await res.json();

    if (data?.url) {
      window.open(data.url, "_blank"); // ✅ actual file download
    } else {
      console.error("No download URL received");
    }

  } catch (err) {
    console.error("Download failed:", err);
  }
};

if (loading) {
  return (
    <div className="relative w-full h-full min-h-[60vh]">
      <AILoader text="Loading Resumes..." />
    </div>
  );
}

  return (
    <div className="relative">

      <div
        className={`p-2 md:p-4 lg:px-6 lg:h-[500px] transition-opacity duration-300 ${
          loading ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >

        <div className="mb-4 space-y-1">

          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-2">

            <div className="flex items-center gap-2 md:w-auto w-full">

              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search resumes..."
                className="px-4 py-3 rounded-xl glass-card border focus:ring-2 focus:ring-indigo-300 w-full md:w-72 lg:w-96"
              />

              <button
                onClick={() => setQuery("")}
                className="px-3 py-2 rounded-xl glass hover:scale-105 transition"
              >
                Clear
              </button>

            </div>

            <div className="flex items-center gap-2 md:w-auto">

              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="px-3 py-2 rounded-xl glass border"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
              </select>

            </div>

          </div>

          {Object.keys(selected).length > 0 && (
            <div className="flex justify-between items-center p-2 rounded-xl bg-red-50 border border-red-200 mt-2">
              <span className="text-red-700 font-medium">
                {Object.keys(selected).length} selected
              </span>

              <button
                onClick={requestDeleteSelected}
                className="px-2 py-1 bg-red-600 text-white rounded-sm shadow hover:scale-105"
              >
                Delete Selected
              </button>
            </div>
          )}

        </div>

        <div className="glass-card rounded-xl overflow-hidden">

          <div className="overflow-y-auto md:hight-[450px]">

            {!isMobile ? (

              <>
                <div className="grid grid-cols-[50px_80px_1fr_180px_120px] bg-white/40 border-b px-4 py-3 text-base font-semibold text-gray-700">
                  <div>
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={toggleSelectAll}
                      className="w-4 h-4"
                    />
                  </div>

                  <div>S.No</div>
                  <div>Title</div>
                  <div>Created At</div>
                  <div className="text-right">Action</div>
                </div>

                {pageItems.map((row, idx) => {

                  const serial =
                    (page - 1) * PAGE_SIZE + idx + 1;

                  const isChecked = selected[row.id];

                  return (
                    <div
                      key={row.id}
                      className={`grid grid-cols-[50px_80px_1fr_180px_120px] px-4 py-3 border-b last:border-b-0 text-sm items-center transition ${
                        isChecked ? "hover-faint-gradient" : ""
                      }`}
                    >
                      <div>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleSelect(row.id)}
                          className="w-4 h-4"
                        />
                      </div>

                      <div>{serial}</div>

                      <div className="font-medium">
                        {row.title}
                      </div>

                      <div>
                        {formatDate(row.createdAt)}
                      </div>

                      <div className="flex justify-end gap-2">

                        <button
                          onClick={() => openView(row.id)}
                          className="p-2 glass rounded-lg hover:scale-110"
                        >
                          <Eye size={18} />
                        </button>

                        <button
                          onClick={() => handleDownload(row)}
                          className="p-2 rounded-lg hover:scale-110 transition"
                        >
                          <Download size={18} />
                        </button>

                        <button
                          onClick={() => requestDelete(row.id)}
                          className="p-2 bg-red-50 text-red-600 rounded-lg hover:scale-110"
                        >
                          <Trash2 size={18} />
                        </button>

                      </div>
                    </div>
                  );
                })}
              </>
            ) : (
              <div className="p-3 space-y-3">
                {pageItems.map((row) => {

                  const isChecked = selected[row.id];

                  return (
                    <div
                      key={row.id}
                      className={`p-4 rounded-xl border shadow-sm flex justify-between items-center ${
                        isChecked
                          ? "hover-faint-gradient"
                          : "bg-white/70"
                      }`}
                    >
                      <div className="flex items-center gap-3">

                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleSelect(row.id)}
                          className="w-5 h-5"
                        />

                        <div>
                          <div className="font-semibold">
                            {row.title}
                          </div>

                          <div className="text-xs text-gray-600">
                            {formatDate(row.createdAt)}
                          </div>
                        </div>

                      </div>

                      <div className="flex gap-2">

                        <button
                          onClick={() => openView(row.id)}
                          className="p-2 glass rounded-lg"
                        >
                          <Eye size={16} />
                        </button>

                        <button
                          onClick={() => handleDownload(row)}
                          className="p-2 rounded-lg hover:scale-110 transition"
                        >
                          <Download size={18} />
                        </button>

                        <button
                          onClick={() => requestDelete(row.id)}
                          className="p-2 bg-red-50 text-red-600 rounded-lg"
                        >
                          <Trash2 size={16} />
                        </button>

                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="border-t px-4 py-3 flex flex-col sm:flex-row justify-between items-center gap-3">

            <span className="text-sm text-gray-600">
              Showing {(page - 1) * PAGE_SIZE + 1}–
              {Math.min(page * PAGE_SIZE, totalItems)} of {totalItems} Resumes
            </span>

            <div className="flex items-center gap-2">

              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className={`px-3 py-1 rounded-md glass ${
                  page === 1 ? "opacity-50" : "hover:scale-105"
                }`}
              >
                Prev
              </button>

              {[...Array(totalPages)].map((_, i) => {

                const num = i + 1;

                return (
                  <button
                    key={num}
                    onClick={() => setPage(num)}
                    className={`px-3 py-1 rounded-md ${
                      num === page ? "theme-primary" : "glass"
                    }`}
                  >
                    {num}
                  </button>
                );
              })}

              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className={`px-3 py-1 rounded-md glass ${
                  page === totalPages
                    ? "opacity-50"
                    : "hover:scale-105"
                }`}
              >
                Next
              </button>

            </div>
          </div>
        </div>

        <ViewModal
          open={!!viewItem}
          item={viewItem}
          onClose={closeView}
        />

        <ConfirmModal
          key={confirmConfig.open ? Date.now() : "confirm"}
          open={confirmConfig.open}
          title={confirmConfig.title}
          message={confirmConfig.message}
          onCancel={() =>
            setConfirmConfig((c) => ({ ...c, open: false }))
          }
          onConfirm={() => {
            confirmConfig.onConfirm?.();
          }}
          confirmLabel="Delete"
          cancelLabel="Cancel"
        />

      </div>
    </div>
  );
}