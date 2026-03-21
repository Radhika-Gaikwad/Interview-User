// InterviewTable.jsx
import React, { useEffect, useMemo, useState } from "react";
import { MoreVertical, Edit2, Trash2, Play, Eye, Copy, Download } from "lucide-react";
import sessionService from "../../Services/sessionService";
import SessionViewModal from "../../Components/SessionViewModal";
import SessionEditModal from "../../Components/SessionEditModal";
import ConnectModal from "../../Components/ConnectModal";
import AILoader from "../../Components/AILoader";
import { getProfile } from "../../Services/userService";


const PAGE_SIZE = 6;

function formatDate(d) {
  try {
    return new Date(d).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  } catch {
    return d;
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

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-black transition"
          >
            ✕
          </button>
        </div>

        {/* Content */}
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
function ActionsMenu({ open, anchorRect,  onAction }) {
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
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [companyFilter, setCompanyFilter] = useState("");
  const [expiredFilter, setExpiredFilter] = useState("all"); // all, active, expired
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("newest");

  // modals
  const [editItem, setEditItem] = useState(null);
  const [viewItem, setViewItem] = useState(null);
  const [connectItem, setConnectItem] = useState(null);
  const [isConnectOpen, setIsConnectOpen] = useState(false);
  const [confirm, setConfirm] = useState({ open: false, id: null });
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  // actions menu
  const [menu, setMenu] = useState({ open: false, id: null, rect: null });

  // responsive width (for card variants on tablet vs mobile)
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => {
    const onResize = () => setW(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    loadSessions(page);
  }, [page]);

  useEffect(() => {
  const handleUpdate = () => loadSessions(1);

  window.addEventListener("session-updated", handleUpdate);
  return () => window.removeEventListener("session-updated", handleUpdate);
}, []);

  const companies = useMemo(() => Array.from(new Set(data.map((d) => d.company))).sort(), [data]);




  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages]);

  const pageItems = useMemo(() => {
    let items = [...data];

    // 1. Filter by search query (company or position)
    if (query) {
      const q = query.toLowerCase();
      items = items.filter(
        (d) =>
          (d.company || "").toLowerCase().includes(q) ||
          (d.position || "").toLowerCase().includes(q)
      );
    }

    // 2. Filter by company
    if (companyFilter) {
      items = items.filter((d) => d.company === companyFilter);
    }

    // 3. Filter by status
    if (expiredFilter !== "all") {
      const isExpired = expiredFilter === "expired";
      items = items.filter((d) => !!d.endsIn?.expired === isExpired);
    }

    // 4. Sort
    if (sort === "newest") {
      items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sort === "oldest") {
      items.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

    return items;
  }, [data, query, companyFilter, expiredFilter, sort]);
  // actions
  function handleDelete(id) {
    setConfirm({ open: true, id });
  }

  function confirmDelete() {
    (async () => {
      try {
        // if this is a local-only item (sample) it starts with 'i' — remove locally
        if (typeof confirm.id === "string" && confirm.id.startsWith("i")) {
          setData((d) => d.filter((it) => it.id !== confirm.id));
          return;
        }

        await sessionService.deleteSession(confirm.id);
        setData((d) => d.filter((it) => it.id !== confirm.id));
      } catch (err) {
        console.error("Delete failed:", err);
      } finally {
        setConfirm({ open: false, id: null });
      }
    })();
  }




  function openMenuFor(e, id) {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setMenu({ open: true, id, rect });
  }

  function onMenuAction(action) {
    const id = menu.id;
    const item = data.find((d) => d.id === id);
    setMenu({ open: false, id: null, rect: null });
    if (!item) return;
    if (action === "start") {
      // open Connect modal pre-filled for this session
      setConnectItem(item);
      setIsConnectOpen(true);
    } else if (action === "view") {
      // fetch full session details and open SessionViewModal
      (async () => {
        try {
          // if we already have raw session data, use it; otherwise fetch
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
      (async () => {
        try {
          await sessionService.duplicateSession(id);

// Always reset to first page
setPage(1);

// Trigger global refresh
window.dispatchEvent(new Event("session-updated"));

       
        } catch (err) {
          console.error("Duplicate failed:", err);
        }
      })();
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

  async function handleConnectActivate({ shareAudio, connectionMethod, meetingLink }) {
    if (!connectItem) return { session: null, user: null }; // safe fallback

    try {
      // 1️⃣ Connect session
      const res = await sessionService.connectSession(connectItem.id, {
        shareAudio,
        connectionMethod,
        meetingLink,
        language: connectItem.raw?.language,
        aiModel: connectItem.raw?.aiModel,
      });

      if (!res || !res.session) {
        console.warn("Connect response missing session, returning safe fallback");
        return { session: null, user: null };
      }

      // 2️⃣ Close modal
      setIsConnectOpen(false);
      setConnectItem(null);

      // 3️⃣ Open meeting provider
      const url = meetingLink || getDefaultUrl(connectionMethod);
      if (url) window.open(url, "_blank");

      // 4️⃣ Fetch updated user profile to get latest credits
      const updatedUser = await getProfile();
      if (!updatedUser) {
        console.warn("Failed to fetch updated user profile");
      }

      console.log("Credits after activation:", updatedUser?.credits);

      // 5️⃣ Refresh sessions list
      const listRes = await sessionService.listSessions();
      const sessions = Array.isArray(listRes) ? listRes : listRes.data || [];
      const mapped = sessions.map((s) => ({
        id: (s._id || s.id || "").toString(),
        company: s.company || "",
        position: s.position || s.jobDescription || "",
        endsIn: { expired: s.status === "completed", credits: s.creditsUsed || 0 },
        aiUsage: s.aiUsage || 0,
        createdAt: s.createdAt,
        raw: s,
      }));

      setData(mapped);
      setTotalPages(listRes.totalPages || 1);
      setTotalRecords(listRes.total || 0);
      setPage(listRes.page || 1);

      return { session: res.session, user: updatedUser }; // return updated user
    } catch (err) {
      console.error("Connect failed:", err);
      const msg = err?.response?.data?.message || err.message || "Failed to activate";
      if (msg.toLowerCase().includes("insufficient")) window.location.href = "/buy-credits";
      return { session: null, user: null }; // fallback
    }
  }

  // Helper
  function getDefaultUrl(method) {
    switch (method) {
      case "zoom": return "https://zoom.us/";
      case "meet": return "https://meet.google.com/";
      case "teams": return "https://teams.microsoft.com/";
      case "whatsapp": return "https://web.whatsapp.com/";
      default: return "/";
    }
  }



 async function loadSessions(pageNumber = page) {
  try {
    setLoading(true);

    const res = await sessionService.listSessions(pageNumber, PAGE_SIZE);

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

    setData(mapped);
    setTotalPages(res.totalPages || 1);
    setTotalRecords(res.total || 0);

    // ❌ REMOVE THIS
    // setPage(res.page || 1);

  } finally {
    setLoading(false);
  }
}
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
                value={query}
                onChange={(e) => setQuery(e.target.value)}
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
            {pageItems.map((row, idx) => {
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
                    {/* Hamburger first */}
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

            {pageItems.length === 0 && <div className="p-6 text-center text-gray-600">No records found.</div>}
          </div>

          {/* Cards for tablet (md) and mobile (sm) */}
          <div className="lg:hidden p-2 space-y-3">
            {pageItems.map((row) => {
              // card variant: tablet (md: show more details horizontally), mobile (sm: stacked)
              const isTablet = w >= 640 && w < 1024; // md-range
              return (
                <div key={row.id} className={`p-3 rounded-xl border ${isTablet ? "bg-white/80 flex items-center justify-between gap-4" : "bg-white/70"} `}>
                  {/* Left content */}
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

                  {/* actions */}
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

            {pageItems.length === 0 && <div className="p-6 text-center text-gray-600">No records found.</div>}
          </div>

          {/* footer / pagination */}
          <div className="border-t px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="text-sm text-gray-600">Showing {(page - 1) * PAGE_SIZE + 1} – {Math.min(page * PAGE_SIZE, totalRecords)} of {totalRecords}</div>

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
          open={!!editItem}
          item={editItem}
          onClose={() => setEditItem(null)}
          onSave={async (payload) => {
            try {
              const res = await sessionService.updateSession(
                editItem._id || editItem.id,
                payload
              );

              const mapped = {
                id: res._id || res.id,
                company: res.company,
                position: res.position || res.jobDescription,
                endsIn: { expired: res.status === 'completed', credits: res.creditsUsed || 0 },
                aiUsage: res.aiUsage || 0,
                createdAt: res.createdAt,
                raw: res,
              };

              setData((d) =>
                d.map((it) => (it.id === mapped.id ? mapped : it))
              );


            } catch (err) {
              console.error('Edit save failed:', err);


              throw err;
            }
          }}
        />
        <SessionViewModal open={!!viewItem} item={viewItem} onClose={() => setViewItem(null)} />


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
