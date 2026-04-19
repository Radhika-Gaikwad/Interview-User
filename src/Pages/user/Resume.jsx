import React, { useMemo, useState, useEffect } from "react";
import { Eye, Trash2, Download } from "lucide-react";
import ConfirmModal from "../../Components/ConfirmModal";
import ViewModal from "../../Components/ViewModal";
import {
  getResumesService,
  deleteResumeService,
} from "../../Services/resume.service";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import AILoader from "../../Components/AILoader";

const PAGE_SIZE = 5;

// Safely Handle Firebase Timestamp objects or standard strings
function formatDate(dateObj) {
  if (!dateObj) return "N/A";
  try {
    let d;
    if (typeof dateObj === 'object' && dateObj._seconds) {
      d = new Date(dateObj._seconds * 1000);
    } else {
      d = new Date(dateObj);
    }
    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "Invalid Date";
  }
}

// Helper for sorting logic
function getTimestampMs(dateObj) {
  if (!dateObj) return 0;
  if (typeof dateObj === 'object' && dateObj._seconds) {
    return dateObj._seconds * 1000;
  }
  return new Date(dateObj).getTime() || 0;
}

export default function Resume() {
  const queryClient = useQueryClient();

  // 🔥 OPTIMIZATION 1: Separate visual input from processing query
  const [searchInput, setSearchInput] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const [sortOrder, setSortOrder] = useState("newest");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState({});
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);

  const [viewItem, setViewItem] = useState(null);

  const [confirmConfig, setConfirmConfig] = useState({
    open: false,
    title: "",
    message: "",
    onConfirm: null,
  });

  // 🔥 OPTIMIZATION 2: Throttle the window resize listener to prevent render thrashing
  useEffect(() => {
    let timeoutId;
    const onResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => setWindowWidth(window.innerWidth), 150);
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      clearTimeout(timeoutId);
    };
  }, []);

  // 🔥 OPTIMIZATION 3: Debounce the search input to prevent heavy array filtering on every keystroke
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchInput);
    }, 300); // Waits 300ms after user stops typing

    return () => clearTimeout(handler);
  }, [searchInput]);

  // 🔥 OPTIMIZATION 4: Add staleTime and keepPreviousData to React Query
  const resumesQuery = useQuery({
    queryKey: ["resumes", page],
    queryFn: () => getResumesService(page, PAGE_SIZE),
    keepPreviousData: true, // Prevents loading spinner flickering during pagination
    staleTime: 5 * 60 * 1000, // Caches data for 5 minutes to prevent rapid re-fetching
    select: (res) => {
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
      return {
        data: formatted,
        totalPages: res.data.totalPages || 1,
        total: res.data.total || formatted.length,
      };
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteResumeService,
    onSuccess: () => {
      queryClient.invalidateQueries(["resumes", page]);
      setConfirmConfig((c) => ({ ...c, open: false }));
    },
    onError: (err) => {
      console.error("Delete error:", err);
      setConfirmConfig((c) => ({ ...c, open: false }));
    },
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: (ids) => Promise.all(ids.map((id) => deleteResumeService(id))),
    onSuccess: () => {
      queryClient.invalidateQueries(["resumes", page]);
      setSelected({});
      setConfirmConfig((c) => ({ ...c, open: false }));
    },
    onError: (err) => {
      console.error("Bulk delete error:", err);
      setConfirmConfig((c) => ({ ...c, open: false }));
    },
  });

  const isMobile = windowWidth < 768;

  useEffect(() => {
    const handleResumeUpdate = () => {
      queryClient.invalidateQueries(["resumes", page]);
    };

    window.addEventListener("resume-updated", handleResumeUpdate);

    return () => {
      window.removeEventListener("resume-updated", handleResumeUpdate);
    };
  }, [page, queryClient]);

  // Filters using the debounced query instead of the raw input
  const filtered = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();

    let list = (resumesQuery.data?.data || []).filter((r) =>
      q ? r.title.toLowerCase().includes(q) : true
    );

    list.sort((a, b) => {
      const ta = getTimestampMs(a.createdAt);
      const tb = getTimestampMs(b.createdAt);

      return sortOrder === "newest" ? tb - ta : ta - tb;
    });

    return list;
  }, [resumesQuery.data, debouncedQuery, sortOrder]);

  const pageItems = filtered;

  const toggleSelect = (id) =>
    setSelected((p) => {
      const n = { ...p };

      if (n[id]) delete n[id];
      else n[id] = true;

      return n;
    });

  const isAllSelected =
    pageItems.length > 0 && pageItems.every((it) => selected[it.id]);

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
    const item = resumesQuery.data?.data.find((d) => d.id === id);
    setViewItem(item);
  };

  const closeView = () => setViewItem(null);

  const requestDelete = (id) => {
    const item = resumesQuery.data?.data.find((d) => d.id === id);

    setConfirmConfig({
      open: true,
      title: "Delete Resume",
      message: `Are you sure you want to delete "${item?.title || "this resume"
        }"?`,
      onConfirm: () => deleteMutation.mutate(id),
    });
  };

  const requestDeleteSelected = () => {
    const ids = Object.keys(selected);
    if (!ids.length) return;

    setConfirmConfig({
      open: true,
      title: "Delete Selected Resumes",
      message: `Delete ${ids.length} selected resume(s)?`,
      onConfirm: () => bulkDeleteMutation.mutate(ids),
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
        window.open(data.url, "_blank");
      } else {
        console.error("No download URL received");
      }
    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  // Only show the hard loader on the very first mount. 
  // Subsequent page changes will use keepPreviousData.
  if (resumesQuery.isLoading && !resumesQuery.isPreviousData) {
    return (
      <div className="relative w-full h-full min-h-[60vh]">
        <AILoader text="Loading Resumes..." />
      </div>
    );
  }

  return (
    <div className="relative">
      <div
        className={`p-2 md:p-4 lg:px-6 lg:h-[500px] transition-opacity duration-300 ${resumesQuery.isFetching && !resumesQuery.isPreviousData ? "opacity-50 pointer-events-none" : "opacity-100"
          }`}
      >
        <div className="mb-4 space-y-1">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-2">
            <div className="flex items-center gap-2 md:w-auto w-full">
              <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search resumes..."
                className="px-4 py-3 rounded-xl glass-card border focus:ring-2 focus:ring-indigo-300 w-full md:w-72 lg:w-96"
              />

              <button
                onClick={() => setSearchInput("")}
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
                  const serial = (page - 1) * PAGE_SIZE + idx + 1;
                  const isChecked = selected[row.id];

                  return (
                    <div
                      key={row.id}
                      className={`grid grid-cols-[50px_80px_1fr_180px_120px] px-4 py-3 border-b last:border-b-0 text-sm items-center transition ${isChecked ? "hover-faint-gradient" : ""
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
                      <div className="font-medium">{row.title}</div>
                      <div>{formatDate(row.createdAt)}</div>

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
                      className={`p-4 rounded-xl border shadow-sm flex justify-between items-center ${isChecked ? "hover-faint-gradient" : "bg-white/70"
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
                          <div className="font-semibold">{row.title}</div>
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
              {Math.min(
                page * PAGE_SIZE,
                resumesQuery.data?.total || 0
              )}{" "}
              of {resumesQuery.data?.total || 0} Resumes
            </span>

            <div className="flex items-center gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className={`px-3 py-1 rounded-md glass ${page === 1 ? "opacity-50" : "hover:scale-105"
                  }`}
              >
                Prev
              </button>

              {[...Array(resumesQuery.data?.totalPages || 1)].map((_, i) => {
                const num = i + 1;

                return (
                  <button
                    key={num}
                    onClick={() => setPage(num)}
                    className={`px-3 py-1 rounded-md ${num === page ? "theme-primary" : "glass"
                      }`}
                  >
                    {num}
                  </button>
                );
              })}

              <button
                disabled={page === (resumesQuery.data?.totalPages || 1)}
                onClick={() => setPage(page + 1)}
                className={`px-3 py-1 rounded-md glass ${page === (resumesQuery.data?.totalPages || 1)
                    ? "opacity-50"
                    : "hover:scale-105"
                  }`}
              >
                Next
              </button>
            </div>
          </div>
        </div>

        <ViewModal open={!!viewItem} item={viewItem} onClose={closeView} />

        <ConfirmModal
          key={confirmConfig.open ? Date.now() : "confirm"}
          open={confirmConfig.open}
          title={confirmConfig.title}
          message={confirmConfig.message}
          onCancel={() => setConfirmConfig((c) => ({ ...c, open: false }))}
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