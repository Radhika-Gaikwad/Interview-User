// InterviewTable.jsx
import React, { useEffect, useMemo, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MoreVertical, Edit2, Trash2, Play, Eye, Copy, Download } from "lucide-react";
import sessionService from "../../Services/sessionService";
import SessionViewModal from "../../Components/SessionViewModal";
import SessionEditModal from "../../Components/SessionEditModal";
import ConnectModal from "../../Components/ConnectModal";
import AILoader from "../../Components/AILoader";

const PAGE_SIZE = 5;

// Safely handles Firebase _seconds or standard JS Dates
function formatDate(d) {
  if (!d) return "N/A";
  try {
    let dateObj;
    if (d && typeof d === 'object' && d._seconds) {
      dateObj = new Date(d._seconds * 1000);
    } else {
      dateObj = new Date(d);
    }
    return dateObj.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  } catch {
    return "Invalid Date";
  }
}

function Badge({ children, className = "" }) {
  return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${className}`}>{children}</span>;
}

// Simple Modal (center)
function Modal({ open, onClose, title, children }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Modal Box */}
      <div className="relative w-full max-w-xl bg-white rounded-2xl p-6 shadow-2xl z-10 transition-all scale-100">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-black transition"
          >
            ✕
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}

function Confirm({ open, onCancel, onConfirm, title, message, confirmLabel = "Confirm" }) {
  return (
    <Modal open={open} onClose={onCancel} title={title}>
      <div className="bg-white p-4 rounded-xl shadow-md">
        <p className="text-sm text-gray-700 mb-4">{message}</p>
        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-3 py-2 rounded-md border border-gray-300 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-3 py-2 rounded-md theme-primary"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}

// Actions menu (hamburger)
function ActionsMenu({ open, anchorRect, onAction }) {
  if (!open) return null;

  const style = anchorRect
    ? {
      position: "absolute",
      top: anchorRect.bottom + window.scrollY + 6,
      left: anchorRect.left + window.scrollX,
      zIndex: 60,
    }
    : { position: "absolute", zIndex: 60 };

  return (
    <div style={style} className="w-36 bg-white rounded-xl shadow-lg border overflow-hidden">
      <button onClick={() => onAction("start")} className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center gap-2">
        <Play size={16} /> Start session again
      </button>
      <button onClick={() => onAction("view")} className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center gap-2">
        <Eye size={16} /> View
      </button>
      <button onClick={() => onAction("duplicate")} className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center gap-2">
        <Copy size={16} /> Duplicate
      </button>
      <button onClick={() => onAction("export")} className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center gap-2">
        <Download size={16} /> Export
      </button>
    </div>
  );
}

export default function InterviewTable() {
  // 🔥 OPTIMIZATION: Separate search input from API query to prevent API spam
  const [searchInput, setSearchInput] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const [companyFilter, setCompanyFilter] = useState("");
  const [expiredFilter, setExpiredFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("newest");

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // modals
  const [editItem, setEditItem] = useState(null);
  const [viewItem, setViewItem] = useState(null);
  const [connectItem, setConnectItem] = useState(null);
  const [isConnectOpen, setIsConnectOpen] = useState(false);
  const [confirm, setConfirm] = useState({ open: false, id: null });
  const [menu, setMenu] = useState({ open: false, id: null, rect: null });

  // responsive width with Throttle to prevent render thrashing
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);

  useEffect(() => {
    let timeoutId;
    const onResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => setW(window.innerWidth), 150); // ⚡ Throttled
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      clearTimeout(timeoutId);
    };
  }, []);

  // 🔥 OPTIMIZATION: Debounce the search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchInput);
    }, 500); // ⚡ Waits 500ms after user stops typing to trigger search

    return () => clearTimeout(handler);
  }, [searchInput]);

  const isInitialMount = useRef(true);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      if (page !== 1) setPage(1);
    }
  }, [debouncedQuery, companyFilter, expiredFilter, sort]);

  const { data: sessionData, isLoading: loading } = useQuery({
    queryKey: ['sessions', page, debouncedQuery, companyFilter, expiredFilter, sort],
    queryFn: async () => {
      const res = await sessionService.listSessions(page, PAGE_SIZE, debouncedQuery, companyFilter, expiredFilter, sort);
      const sessions = Array.isArray(res) ? res : res.data || [];
      const mapped = sessions.map((s) => ({
        id: (s._id || s.id || "").toString(),
        company: s.company || "",
        position: s.position || s.jobDescription || "",
        endsIn: {
          expired: s.status === "completed",
          credits: s.creditsUsed || 0
        },
        aiUsage: s.aiUsage || 0,
        createdAt: s.createdAt,
        raw: s,
      }));
      return {
        data: mapped,
        totalPages: res.totalPages || 1,
        totalRecords: res.total || 0,
      };
    },
    keepPreviousData: true,
  });

  const data = sessionData?.data || [];
  const totalPages = sessionData?.totalPages || 1;
  const totalRecords = sessionData?.totalRecords || 0;

  useEffect(() => {
    const handleUpdate = () => {
      setPage(1);
      queryClient.invalidateQueries(['sessions']);
    };
    window.addEventListener("session-updated", handleUpdate);
    return () => window.removeEventListener("session-updated", handleUpdate);
  }, [queryClient]);

  const companies = useMemo(() => Array.from(new Set(data.map((d) => d.company))).sort(), [data]);

  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages, page]);

  // actions
  function handleDelete(id) {
    setConfirm({ open: true, id });
  }

  const deleteMutation = useMutation({
    mutationFn: (id) => sessionService.deleteSession(id),
    onSuccess: () => queryClient.invalidateQueries(['sessions'])
  });

  function confirmDelete() {
    if (typeof confirm.id === "string" && confirm.id.startsWith("i")) {
      queryClient.setQueryData(['sessions', page], (old) => {
        if (!old) return old;
        return { ...old, data: old.data.filter((it) => it.id !== confirm.id) };
      });
      setConfirm({ open: false, id: null });
      return;
    }

    deleteMutation.mutate(confirm.id, {
      onSettled: () => setConfirm({ open: false, id: null })
    });
  }

  function openMenuFor(e, id) {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setMenu({ open: true, id, rect });
  }

  const duplicateMutation = useMutation({
    mutationFn: (id) => sessionService.duplicateSession(id),
    onSuccess: () => {
      setPage(1);
      queryClient.invalidateQueries(['sessions']);
      window.dispatchEvent(new Event("session-updated"));
    }
  });

  function onMenuAction(action) {
    const id = menu.id;
    const item = data.find((d) => d.id === id);
    setMenu({ open: false, id: null, rect: null });
    if (!item) return;
    if (action === "start") {
      setConnectItem(item);
      setIsConnectOpen(true);
    } else if (action === "view") {
      (async () => {
        try {
          let full = item.raw || null;
          if (!full || !full._id) {
            full = await sessionService.getSession(item.id);
          }
          setViewItem(full);
        } catch (err) {
          console.error('Failed to load session for view:', err);
        }
      })();
    } else if (action === "duplicate") {
      duplicateMutation.mutate(id);
    } else if (action === "export") {
      const blob = new Blob([JSON.stringify(item, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${item.company}-${item.position}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  }

  const connectMutation = useMutation({
    mutationFn: ({ id, payload }) => sessionService.connectSession(id, payload),
  });

  async function handleConnectActivate({ shareAudio, connectionMethod, meetingLink }) {
    if (!connectItem) return { session: null, user: null };

    try {
      const res = await connectMutation.mutateAsync({
        id: connectItem.id,
        payload: {
          shareAudio,
          connectionMethod,
          meetingLink,
          language: connectItem.raw?.language,
          aiModel: connectItem.raw?.aiModel,
        }
      });

      if (!res || !res.session) {
        console.warn("Connect response missing session, returning safe fallback");
        return { session: null, user: null };
      }

      setIsConnectOpen(false);
      setConnectItem(null);

      const url = meetingLink || getDefaultUrl(connectionMethod);
      if (url) window.open(url, "_blank");

      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['sessions'] });

      return { session: res.session, user: null };
    } catch (err) {
      console.error("Connect failed:", err);
      const msg = err?.response?.data?.message || err.message || "Failed to activate";
      if (String(msg).toLowerCase().includes("insufficient")) navigate("/buy-credits");
      return { session: null, user: null };
    }
  }

  function getDefaultUrl(method) {
    switch (method) {
      case "zoom": return "https://zoom.us/";
      case "meet": return "https://meet.google.com/";
      case "teams": return "https://teams.microsoft.com/";
      case "whatsapp": return "https://web.whatsapp.com/";
      default: return "/";
    }
  }

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => sessionService.updateSession(id, payload),
    onSuccess: () => queryClient.invalidateQueries(['sessions'])
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <AILoader text="Loading Interviews..." />
      </div>
    );
  }

  return (
    <>
      <div className="p-2 md:p-4 lg:p-4">
        <div className="mb-6 w-full">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

            {/* Search */}
            <div className="flex flex-col">
              <label className="text-xs font-medium text-gray-600 mb-1">
                Search
              </label>
              <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search company or position..."
                className="px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-theme-primary focus:border-theme-primary transition w-full text-sm"
              />
            </div>

            {/* Company Filter */}
            <div className="flex flex-col">
              <label className="text-xs font-medium text-gray-600 mb-1">
                Company
              </label>
              <select
                value={companyFilter}
                onChange={(e) => setCompanyFilter(e.target.value)}
                className="px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-theme-primary focus:border-theme-primary transition text-sm"
              >
                <option value="">All Companies</option>
                {companies.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex flex-col">
              <label className="text-xs font-medium text-gray-600 mb-1">
                Status
              </label>
              <select
                value={expiredFilter}
                onChange={(e) => setExpiredFilter(e.target.value)}
                className="px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-theme-primary focus:border-theme-primary transition text-sm"
              >
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="expired">Expired</option>
              </select>
            </div>

            {/* Sorting */}
            <div className="flex flex-col">
              <label className="text-xs font-medium text-gray-600 mb-1">
                Sort By
              </label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-theme-primary focus:border-theme-primary transition text-sm"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
              </select>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl overflow-hidden border">
          {/* Desktop table (lg and above) */}
          <div className="hidden lg:grid grid-cols-[60px_1fr_1fr_220px_160px_160px] bg-white/40 px-4 py-3 font-semibold text-gray-700">
            <div className="flex items-center">S.No</div>
            <div>Company</div>
            <div>Position</div>
            <div>Ends In </div>
            <div>Created At</div>
            <div className="text-right">Action</div>
          </div>

          {/* rows (desktop) */}
          <div className="hidden lg:block divide-y">
            {data.map((row, idx) => {
              const sno = (page - 1) * PAGE_SIZE + idx + 1;
              return (
                <div key={row.id} className="grid grid-cols-[60px_1fr_1fr_220px_160px_160px] px-4 py-3 items-center ">
                  <div className="text-sm text-gray-700">{sno}</div>
                  <div className="font-medium">{row.company}</div>
                  <div className="text-sm text-gray-600">{row.position}</div>
                  <div>
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge className={`${row.endsIn?.expired ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                          {row.endsIn?.expired ? "Expired" : "Active"}
                        </Badge>
                        <span className="text-sm">{row.endsIn?.credits} credits</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-sm">{formatDate(row.createdAt)}</div>
                  <div className="flex justify-end items-center gap-2">
                    <button onClick={(e) => openMenuFor(e, row.id)} className="p-2 glass rounded-lg" title="More">
                      <MoreVertical size={16} />
                    </button>
                    <button onClick={() => (async () => {
                      try {
                        let full = row.raw || null;
                        if (!full || !full._id) full = await sessionService.getSession(row.id);
                        setEditItem(full);
                      } catch (err) {
                        console.error('Failed to load session for edit:', err);
                      }
                    })()} className="p-2 glass rounded-lg" title="Edit">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(row.id)} className="p-2 bg-red-50 text-red-600 rounded-lg" title="Delete">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
            {data.length === 0 && <div className="p-6 text-center text-gray-600">No records found.</div>}
          </div>

          {/* Cards for tablet (md) and mobile (sm) */}
          <div className="lg:hidden p-2 space-y-3">
            {data.map((row) => {
              const isTablet = w >= 640 && w < 1024;
              return (
                <div key={row.id} className={`p-3 rounded-xl border ${isTablet ? "bg-white/80 flex items-center justify-between gap-4" : "bg-white/70"} `}>
                  <div className={`${isTablet ? "flex items-center gap-4 flex-1" : ""}`}>
                    <div className={`${isTablet ? "w-14 text-sm text-gray-700" : ""}`}>
                      <div className="font-medium">{row.company}</div>
                      <div className="text-sm text-gray-600">{row.position}</div>
                    </div>
                    <div className={`${isTablet ? "flex items-center gap-3" : "mt-2"}`}>
                      <div>
                        <Badge className={`${row.endsIn?.expired ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                          {row.endsIn?.expired ? "Expired" : "Active"}
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-600">
                        <div className="mt-1">Created: {formatDate(row.createdAt)}</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 mt-3 md:mt-0">
                    <button onClick={(e) => openMenuFor(e, row.id)} className="p-2 glass rounded-lg" title="More">
                      <MoreVertical size={16} />
                    </button>
                    <button onClick={() => setEditItem(row)} className="p-2 glass rounded-lg" title="Edit">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(row.id)} className="p-2 bg-red-50 text-red-600 rounded-lg" title="Delete">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
            {data.length === 0 && <div className="p-6 text-center text-gray-600">No records found.</div>}
          </div>

          {/* footer / pagination */}
          <div className="border-t px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="text-sm text-gray-600">Showing {(page - 1) * PAGE_SIZE + 1} – {Math.min(page * PAGE_SIZE, totalRecords)} of {totalRecords} Sessions</div>
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

        <SessionEditModal
          key={editItem?._id || editItem?.id}
          open={!!editItem}
          item={editItem}
          onClose={() => {
            setEditItem(null);
          }}
          onSave={async (payload) => {
            try {
              const id = editItem._id || editItem.id;
              await updateMutation.mutateAsync({ id, payload });
              setEditItem(null);
            } catch (err) {
              console.error('Edit save failed:', err);
              throw err;
            }
          }}
        />
        <SessionViewModal
          key={viewItem?._id || viewItem?.id}
          open={!!viewItem} item={viewItem} onClose={() => setViewItem(null)} />

        <ConnectModal
          isOpen={isConnectOpen}
          onClose={() => {
            setIsConnectOpen(false);
            setConnectItem(null);
          }}
          onBack={() => { setIsConnectOpen(false); }}
          language={connectItem?.raw?.language || 'English'}
          aiModel={connectItem?.raw?.aiModel || 'GPT-4.1 (Smarter)'}
          company={connectItem?.raw?.company}
          position={connectItem?.raw?.position}
          onActivate={handleConnectActivate}
        />

        <Confirm open={confirm.open} onCancel={() => setConfirm({ open: false, id: null })} onConfirm={confirmDelete} title="Delete interview" message="Are you sure you want to delete this interview? This action cannot be undone." confirmLabel="Delete" />

        <ActionsMenu open={menu.open} anchorRect={menu.rect} onClose={() => setMenu({ open: false, id: null, rect: null })} onAction={onMenuAction} />

        {/* click outside to close menu */}
        {menu.open && <div onClick={() => setMenu({ open: false, id: null, rect: null })} className="fixed inset-0 z-40" />}
      </div>
    </>
  );
}