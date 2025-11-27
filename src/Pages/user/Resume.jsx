import React, { useMemo, useState, useEffect } from "react";
import { Eye, Trash2 } from "lucide-react";
import ConfirmModal from "../../Components/ConfirmModal";
import ViewModal from "../../Components/ViewModal";

/* ... SAMPLE_DATA and helpers (same as before) ... */

const SAMPLE_DATA = [
  { id: "r1", title: "Frontend Engineer CV", createdAt: "2025-11-18" },
  { id: "r2", title: "Backend Engineer Resume", createdAt: "2025-10-09" },
  { id: "r3", title: "Fullstack Resume - Priya", createdAt: "2025-09-26" },
  { id: "r4", title: "Data Scientist CV", createdAt: "2025-08-03" },
  { id: "r5", title: "DevOps Resume", createdAt: "2025-07-12" },
  { id: "r6", title: "Product Manager CV", createdAt: "2025-06-21" },
  { id: "r7", title: "Intern Resume - Rahul", createdAt: "2025-05-30" },
  { id: "r8", title: "UX Designer CV", createdAt: "2025-04-15" },
  { id: "r9", title: "QA Engineer Resume", createdAt: "2025-03-10" },
  { id: "r10", title: "Technical Writer CV", createdAt: "2025-02-01" },
];

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
  const [data, setData] = useState(SAMPLE_DATA);
  const [query, setQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState({});
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // modal state
  const [viewItem, setViewItem] = useState(null);
  const [confirmConfig, setConfirmConfig] = useState({ open: false, title: "", message: "", onConfirm: null });

  useEffect(() => {
    const onResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const isMobile = windowWidth < 768;

  // Filter + Sort
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = data.filter((r) => (q ? r.title.toLowerCase().includes(q) : true));
    list.sort((a, b) => {
      const ta = new Date(a.createdAt).getTime();
      const tb = new Date(b.createdAt).getTime();
      return sortOrder === "newest" ? tb - ta : ta - tb;
    });
    return list;
  }, [data, query, sortOrder]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [filtered, totalPages, page]);

  const pageItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  // Selection
  const toggleSelect = (id) =>
    setSelected((p) => {
      const n = { ...p };
      if (n[id]) delete n[id];
      else n[id] = true;
      return n;
    });

  const isAllSelected = pageItems.length > 0 && pageItems.every((it) => selected[it.id]);

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

  // Actions (now using modals)
  const openView = (id) => {
    const item = data.find((d) => d.id === id);
    setViewItem(item || { id });
  };

  const closeView = () => setViewItem(null);

  const requestDelete = (id) => {
    const item = data.find((d) => d.id === id);
    setConfirmConfig({
      open: true,
      title: "Delete Resume",
      message: `Are you sure you want to delete "${item?.title || id}"? This action cannot be undone.`,
      onConfirm: () => {
        // perform delete
        setData((d) => d.filter((r) => r.id !== id));
        setSelected((s) => {
          const n = { ...s };
          delete n[id];
          return n;
        });
        // close modal
        setConfirmConfig((c) => ({ ...c, open: false }));
      },
    });
  };

  const requestDeleteSelected = () => {
    const count = Object.keys(selected).length;
    if (!count) return;
    setConfirmConfig({
      open: true,
      title: "Delete Selected Resumes",
      message: `Delete ${count} selected resume(s)? This action cannot be undone.`,
      onConfirm: () => {
        setData((d) => d.filter((r) => !selected[r.id]));
        setSelected({});
        setConfirmConfig((c) => ({ ...c, open: false }));
      },
    });
  };

  return (
    <div className="p-2 md:p-4 lg:px-6 lg:h-[500px]">
      <div className="mb-4 space-y-1">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-2">
          <div className="flex items-center gap-2 md:w-auto w-full">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search resumes..."
              className="px-4 py-3 rounded-xl glass-card border focus:ring-2 focus:ring-indigo-300 w-full md:w-72 lg:w-96"
            />
            <button onClick={() => setQuery("")} className="px-3 py-2 rounded-xl glass hover:scale-105 transition">
              Clear
            </button>
          </div>

          <div className="flex items-center gap-2 md:w-auto">
            <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="px-3 py-2 rounded-xl glass border">
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>
        </div>

        {Object.keys(selected).length > 0 && (
          <div className="flex justify-between items-center p-2 rounded-xl bg-red-50 border border-red-200 mt-2">
            <span className="text-red-700 font-medium">{Object.keys(selected).length} selected</span>
            <button onClick={requestDeleteSelected} className="px-2 py-1 bg-red-600 text-white rounded-sm shadow hover:scale-105">
              Delete Selected
            </button>
          </div>
        )}
      </div>

      {/* table container (same markup as you already had) */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="overflow-y-auto md:hight-[450px]">
          {!isMobile ? (
            <>
              <div className="grid grid-cols-[50px_80px_1fr_180px_120px] bg-white/40 border-b px-4 py-3 text-base font-semibold text-gray-700">
                <div>
                  <input type="checkbox" checked={isAllSelected} onChange={toggleSelectAll} className="w-4 h-4" />
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
                    className={`grid grid-cols-[50px_80px_1fr_180px_120px] px-4 py-3 border-b last:border-b-0 text-sm items-center transition ${
                      isChecked ? "hover-faint-gradient" : ""
                    }`}
                  >
                    <div>
                      <input type="checkbox" checked={isChecked} onChange={() => toggleSelect(row.id)} className="w-4 h-4" />
                    </div>
                    <div>{serial}</div>
                    <div className="font-medium">{row.title}</div>
                    <div>{formatDate(row.createdAt)}</div>
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openView(row.id)} className="p-2 glass rounded-lg hover:scale-110">
                        <Eye size={18} />
                      </button>

                      <button onClick={() => requestDelete(row.id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:scale-110">
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
                  <div key={row.id} className={`p-4 rounded-xl border shadow-sm flex justify-between items-center ${isChecked ? "hover-faint-gradient" : "bg-white/70"}`}>
                    <div className="flex items-center gap-3">
                      <input type="checkbox" checked={isChecked} onChange={() => toggleSelect(row.id)} className="w-5 h-5" />
                      <div>
                        <div className="font-semibold">{row.title}</div>
                        <div className="text-xs text-gray-600">{formatDate(row.createdAt)}</div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button onClick={() => openView(row.id)} className="p-2 glass rounded-lg">
                        <Eye size={16} />
                      </button>

                      <button onClick={() => requestDelete(row.id)} className="p-2 bg-red-50 text-red-600 rounded-lg">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* pagination (keep your existing pagination that you had) */}
        <div className="border-t px-4 py-3 flex flex-col sm:flex-row justify-between items-center gap-3">
          <span className="text-sm text-gray-600">
            Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
          </span>

          <div className="flex items-center gap-2">
            <button disabled={page === 1} onClick={() => setPage(page - 1)} className={`px-3 py-1 rounded-md glass ${page === 1 ? "opacity-50" : "hover:scale-105"}`}>
              Prev
            </button>

            {[...Array(totalPages)].map((_, i) => {
              const num = i + 1;
              return (
                <button key={num} onClick={() => setPage(num)} className={`px-3 py-1 rounded-md ${num === page ? "theme-primary" : "glass"}`}>
                  {num}
                </button>
              );
            })}

            <button disabled={page === totalPages} onClick={() => setPage(page + 1)} className={`px-3 py-1 rounded-md glass ${page === totalPages ? "opacity-50" : "hover:scale-105"}`}>
              Next
            </button>
          </div>
        </div>
      </div>

      {/* View modal */}
      <ViewModal open={!!viewItem} item={viewItem} onClose={closeView} />

      {/* Confirm modal */}
      <ConfirmModal
        open={confirmConfig.open}
        title={confirmConfig.title}
        message={confirmConfig.message}
        onCancel={() => setConfirmConfig((c) => ({ ...c, open: false }))}
        onConfirm={() => {
          if (typeof confirmConfig.onConfirm === "function") confirmConfig.onConfirm();
          else setConfirmConfig((c) => ({ ...c, open: false }));
        }}
        confirmLabel="Delete"
        cancelLabel="Cancel"
      />
    </div>
  );
}
