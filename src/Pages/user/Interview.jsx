// InterviewTable.jsx
import React, { useEffect, useMemo, useState } from "react";
import { MoreVertical, Edit2, Trash2, Play, Eye, Copy, Download } from "lucide-react";

const SAMPLE = [
  {
    id: "i1",
    company: "Zeta Solutions",
    position: "Frontend Engineer",
    endsIn: { expired: false, credits: 3 },
    aiUsage: 12,
    createdAt: "2025-11-18",
  },
  {
    id: "i2",
    company: "BlueSky Tech",
    position: "Backend Engineer",
    endsIn: { expired: true, credits: 0 },
    aiUsage: 5,
    createdAt: "2025-10-09",
  },
  {
    id: "i3",
    company: "Nova Labs",
    position: "Fullstack Developer",
    endsIn: { expired: false, credits: 8 },
    aiUsage: 27,
    createdAt: "2025-09-26",
  },

  // New Data Below
  {
    id: "i4",
    company: "Orbit Systems",
    position: "React Developer",
    endsIn: { expired: false, credits: 5 },
    aiUsage: 19,
    createdAt: "2025-08-14",
  },
  {
    id: "i5",
    company: "PixelCode Pvt Ltd",
    position: "UI/UX Engineer",
    endsIn: { expired: true, credits: 0 },
    aiUsage: 7,
    createdAt: "2025-07-11",
  },
  {
    id: "i6",
    company: "TechHive Solutions",
    position: "Node.js Developer",
    endsIn: { expired: false, credits: 12 },
    aiUsage: 33,
    createdAt: "2025-06-21",
  },
  {
    id: "i7",
    company: "CloudSprint",
    position: "DevOps Engineer",
    endsIn: { expired: true, credits: 0 },
    aiUsage: 4,
    createdAt: "2025-05-03",
  },
  {
    id: "i8",
    company: "QuantumWare",
    position: "AI Engineer",
    endsIn: { expired: false, credits: 9 },
    aiUsage: 41,
    createdAt: "2025-08-29",
  },
  {
    id: "i9",
    company: "BrightPath Digital",
    position: "Frontend Intern",
    endsIn: { expired: false, credits: 2 },
    aiUsage: 10,
    createdAt: "2025-04-17",
  },
  {
    id: "i10",
    company: "NetAxis Global",
    position: "Angular Developer",
    endsIn: { expired: true, credits: 0 },
    aiUsage: 16,
    createdAt: "2025-02-03",
  },
  {
    id: "i11",
    company: "VisionSoft",
    position: "Automation Tester",
    endsIn: { expired: false, credits: 6 },
    aiUsage: 24,
    createdAt: "2025-03-21",
  },
  {
    id: "i12",
    company: "SoftArc Industries",
    position: "Mobile App Developer",
    endsIn: { expired: false, credits: 3 },
    aiUsage: 15,
    createdAt: "2025-01-14",
  },
  {
    id: "i13",
    company: "NextGen Dynamics",
    position: "Backend Intern",
    endsIn: { expired: true, credits: 0 },
    aiUsage: 2,
    createdAt: "2024-12-07",
  },
  {
    id: "i14",
    company: "PrimeLogic",
    position: "Laravel Developer",
    endsIn: { expired: false, credits: 4 },
    aiUsage: 13,
    createdAt: "2025-09-01",
  },
  {
    id: "i15",
    company: "FusionByte",
    position: "Fullstack Engineer",
    endsIn: { expired: false, credits: 11 },
    aiUsage: 38,
    createdAt: "2025-07-19",
  },
  {
    id: "i16",
    company: "SolidCore Tech",
    position: "Python Developer",
    endsIn: { expired: true, credits: 0 },
    aiUsage: 6,
    createdAt: "2025-03-09",
  },
  {
    id: "i17",
    company: "InnoSphere Labs",
    position: "AI Research Intern",
    endsIn: { expired: false, credits: 10 },
    aiUsage: 29,
    createdAt: "2025-02-28",
  },
  {
    id: "i18",
    company: "AeroStack Technologies",
    position: "SDE-1",
    endsIn: { expired: false, credits: 7 },
    aiUsage: 22,
    createdAt: "2025-05-22",
  },
  {
    id: "i19",
    company: "MetaEdge Software",
    position: "Django Developer",
    endsIn: { expired: true, credits: 0 },
    aiUsage: 9,
    createdAt: "2025-01-30",
  },
  {
    id: "i20",
    company: "BrightLabs",
    position: "Cloud Engineer",
    endsIn: { expired: false, credits: 14 },
    aiUsage: 47,
    createdAt: "2025-10-11",
  },
  {
    id: "i21",
    company: "SkyBridge Infotech",
    position: "Technical Writer",
    endsIn: { expired: false, credits: 5 },
    aiUsage: 18,
    createdAt: "2025-08-02",
  },
  {
    id: "i22",
    company: "CorePulse Systems",
    position: "QA Engineer",
    endsIn: { expired: true, credits: 0 },
    aiUsage: 8,
    createdAt: "2025-06-06",
  },
  {
    id: "i23",
    company: "UrbanSoft Pvt Ltd",
    position: "React Native Developer",
    endsIn: { expired: false, credits: 6 },
    aiUsage: 31,
    createdAt: "2025-05-19",
  },
  {
    id: "i24",
    company: "CodeFlow Digital",
    position: "Software Engineer",
    endsIn: { expired: false, credits: 12 },
    aiUsage: 44,
    createdAt: "2025-09-14",
  },
  {
    id: "i25",
    company: "AlphaBridge",
    position: "Product Engineer",
    endsIn: { expired: true, credits: 0 },
    aiUsage: 3,
    createdAt: "2024-11-20",
  },
  {
    id: "i26",
    company: "LogicWave",
    position: "SDE Intern",
    endsIn: { expired: false, credits: 3 },
    aiUsage: 11,
    createdAt: "2025-02-10",
  },
  {
    id: "i27",
    company: "Innoventix",
    position: "ML Engineer",
    endsIn: { expired: false, credits: 9 },
    aiUsage: 36,
    createdAt: "2025-07-08",
  },
  {
    id: "i28",
    company: "DataSpring Tech",
    position: "Data Analyst",
    endsIn: { expired: true, credits: 0 },
    aiUsage: 14,
    createdAt: "2025-01-11",
  },
  {
    id: "i29",
    company: "CyberNova",
    position: "Security Engineer",
    endsIn: { expired: false, credits: 7 },
    aiUsage: 21,
    createdAt: "2025-10-25",
  },
  {
    id: "i30",
    company: "ProximaWorks",
    position: "Junior Developer",
    endsIn: { expired: false, credits: 4 },
    aiUsage: 12,
    createdAt: "2025-08-10",
  },
];


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


// View modal
function View({ open, item, onClose }) {
  return (
    <Modal open={open} onClose={onClose} title={`View — ${item?.company || "Item"}`}>
      {item ? (
        <div className="space-y-2 text-sm">
          <div>
            <strong>Company:</strong> {item.company}
          </div>
          <div>
            <strong>Position:</strong> {item.position}
          </div>
          <div>
            <strong>Ends In:</strong> {item.endsIn?.expired ? "Expired" : `${item.endsIn?.credits} credits`}
          </div>

          <div>
            <strong>AI Usage:</strong> {item.aiUsage}
          </div>
          <div>
            <strong>Created At:</strong> {formatDate(item.createdAt)}
          </div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </Modal>
  );
}

// Edit modal
function Edit({ open, item, onClose, onSave }) {
  const [form, setForm] = useState(
    item || { company: "", position: "", endsIn: { expired: false, credits: 0, date: "" }, aiUsage: 0, createdAt: "" }
  );

  useEffect(() => setForm(item || { company: "", position: "", endsIn: { expired: false, credits: 0, date: "" }, aiUsage: 0, createdAt: "" }), [item]);

  function setField(path, value) {
    setForm((f) => {
      const copy = JSON.parse(JSON.stringify(f));
      const parts = path.split(".");
      let cur = copy;
      for (let i = 0; i < parts.length - 1; i++) cur = cur[parts[i]];
      cur[parts[parts.length - 1]] = value;
      return copy;
    });
  }

  return (
   <Modal
  open={open}
  onClose={onClose}
  title={item ? "Edit Interview" : "Add Interview"}
>
  <div className="bg-white p-5 rounded-2xl shadow-xl border border-gray-100">

    {/* Grid Form */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

      {/* Company */}
      <label className="flex flex-col gap-1">
        <span className="text-xs font-medium text-gray-600">Company</span>
        <input
          value={form.company}
          onChange={(e) => setField("company", e.target.value)}
          className="px-3 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-theme-primary/40 focus:outline-none bg-gray-50"
        />
      </label>

      {/* Position */}
      <label className="flex flex-col gap-1">
        <span className="text-xs font-medium text-gray-600">Position</span>
        <input
          value={form.position}
          onChange={(e) => setField("position", e.target.value)}
          className="px-3 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-theme-primary/40 focus:outline-none bg-gray-50"
        />
      </label>

      {/* Date */}
      <label className="flex flex-col gap-1">
        <span className="text-xs font-medium text-gray-600">Ends In — Date</span>
        <input
          type="date"
          value={form.endsIn?.date || ""}
          onChange={(e) => setField("endsIn.date", e.target.value)}
          className="px-3 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-theme-primary/40 focus:outline-none bg-gray-50"
        />
      </label>

      {/* Credits */}
      <label className="flex flex-col gap-1">
        <span className="text-xs font-medium text-gray-600">Credits</span>
        <input
          type="number"
          min={0}
          value={form.endsIn?.credits || 0}
          onChange={(e) =>
            setField("endsIn.credits", Number(e.target.value) || 0)
          }
          className="px-3 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-theme-primary/40 focus:outline-none bg-gray-50"
        />
      </label>

      {/* AI Usage */}
      <label className="flex flex-col gap-1">
        <span className="text-xs font-medium text-gray-600">AI Usage (count)</span>
        <input
          type="number"
          value={form.aiUsage || 0}
          onChange={(e) => setField("aiUsage", Number(e.target.value) || 0)}
          className="px-3 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-theme-primary/40 focus:outline-none bg-gray-50"
        />
      </label>

      {/* Created At */}
      <label className="flex flex-col gap-1">
        <span className="text-xs font-medium text-gray-600">Created At</span>
        <input
          type="date"
          value={form.createdAt || ""}
          onChange={(e) => setField("createdAt", e.target.value)}
          className="px-3 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-theme-primary/40 focus:outline-none bg-gray-50"
        />
      </label>

    

    </div>

    {/* Buttons */}
    <div className="flex justify-end gap-3 mt-6">
      <button
        onClick={onClose}
        className="px-4 py-2.5 rounded-lg border bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
      >
        Cancel
      </button>

      <button
        onClick={() => onSave(form)}
        className="px-5 py-2.5 rounded-lg theme-primary text-white shadow-md hover:shadow-lg transition"
      >
        Save
      </button>
    </div>

  </div>
</Modal>

  );
}

// Actions menu (hamburger)
function ActionsMenu({ open, anchorRect, onClose, onAction }) {
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
  const [data, setData] = useState(SAMPLE);
  const [query, setQuery] = useState("");
  const [companyFilter, setCompanyFilter] = useState("");
  const [expiredFilter, setExpiredFilter] = useState("all"); // all, active, expired
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("newest");

  // modals
  const [editItem, setEditItem] = useState(null);
  const [viewItem, setViewItem] = useState(null);
  const [confirm, setConfirm] = useState({ open: false, id: null });

  // actions menu
  const [menu, setMenu] = useState({ open: false, id: null, rect: null });

  // responsive width (for card variants on tablet vs mobile)
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => {
    const onResize = () => setW(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const companies = useMemo(() => Array.from(new Set(data.map((d) => d.company))).sort(), [data]);

  const filtered = useMemo(() => {
    let x = data.slice();
    if (query.trim()) {
      const q = query.toLowerCase();
      x = x.filter((it) => it.company.toLowerCase().includes(q) || it.position.toLowerCase().includes(q));
    }
    if (companyFilter) x = x.filter((it) => it.company === companyFilter);
    if (expiredFilter === "expired") x = x.filter((it) => it.endsIn?.expired);
    if (expiredFilter === "active") x = x.filter((it) => !it.endsIn?.expired);

    x.sort((a, b) => {
      const ta = new Date(a.createdAt).getTime();
      const tb = new Date(b.createdAt).getTime();
      return sort === "newest" ? tb - ta : ta - tb;
    });

    return x;
  }, [data, query, companyFilter, expiredFilter, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages]);

  const pageItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  // actions
  function handleDelete(id) {
    setConfirm({ open: true, id });
  }
  function confirmDelete() {
    setData((d) => d.filter((it) => it.id !== confirm.id));
    setConfirm({ open: false, id: null });
  }

  function handleSave(updated) {
    if (!updated.id) {
      // add new
      const item = { ...updated, id: `i${Date.now()}` };
      setData((d) => [item, ...d]);
    } else {
      setData((d) => d.map((it) => (it.id === updated.id ? updated : it)));
    }
    setEditItem(null);
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
      alert(`Starting session for ${item.company} — ${item.position}`);
    } else if (action === "view") {
      setViewItem(item);
    } else if (action === "duplicate") {
      const dup = { ...item, id: `i${Date.now()}`, company: item.company + " (copy)" };
      setData((d) => [dup, ...d]);
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

  return (
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
        <div className="hidden lg:grid grid-cols-[60px_1fr_1fr_220px_160px_120px_160px] bg-white/40 px-4 py-3 font-semibold text-gray-700">
          <div className="flex items-center">S.No</div>
          <div>Company</div>
          <div>Position</div>
          <div>Ends In </div>
          <div>Created At</div>
          <div>AI usage</div>
          <div className="text-right">Action</div>
        </div>

        {/* rows (desktop) */}
        <div className="hidden lg:block divide-y">
          {pageItems.map((row, idx) => {
            const sno = (page - 1) * PAGE_SIZE + idx + 1;
            return (
              <div key={row.id} className="grid grid-cols-[60px_1fr_1fr_220px_160px_120px_160px] px-4 py-3 items-center ">
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

                <div className="text-sm">{row.aiUsage} usages</div>

                <div className="flex justify-end items-center gap-2">
                  {/* Hamburger first */}
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

        {/* Cards for tablet (md) and mobile (sm) */}
        <div className="lg:hidden p-2 space-y-3">
          {pageItems.map((row, idx) => {
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
                      <div>AI: {row.aiUsage}</div>
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
          <div className="text-sm text-gray-600">Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}</div>

          <div className="flex items-center gap-2">
            <button disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className={`px-3 py-1 rounded-md glass ${page === 1 ? "opacity-50" : "hover:scale-105"}`}>
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

            <button disabled={page === totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className={`px-3 py-1 rounded-md glass ${page === totalPages ? "opacity-50" : "hover:scale-105"}`}>
              Next
            </button>
          </div>
        </div>
      </div>

      {/* overlays */}
      <Edit open={!!editItem} item={editItem} onClose={() => setEditItem(null)} onSave={handleSave} />
      <View open={!!viewItem} item={viewItem} onClose={() => setViewItem(null)} />

      <Confirm open={confirm.open} onCancel={() => setConfirm({ open: false, id: null })} onConfirm={confirmDelete} title="Delete interview" message="Are you sure you want to delete this interview? This action cannot be undone." confirmLabel="Delete" />

      <ActionsMenu open={menu.open} anchorRect={menu.rect} onClose={() => setMenu({ open: false, id: null, rect: null })} onAction={onMenuAction} />

      {/* click outside to close menu */}
      {menu.open && <div onClick={() => setMenu({ open: false, id: null, rect: null })} className="fixed inset-0 z-40" />}
    </div>
  );
}
