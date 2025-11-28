import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  User,
  FileText,
  Download,
  Mail,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { motion } from "framer-motion";

export default function Sidebar({ isMobileOpen, setIsMobileOpen }) {
  const [isOpen, setIsOpen] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth); // ✅ track width

  /* Listen for screen size change */
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);

      if (window.innerWidth < 768) {
        setIsOpen(false); // auto close for mobile
      } else {
        setIsOpen(true); // auto open for desktop
        setIsMobileOpen(false); // close mobile drawer
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setIsMobileOpen]);

  const isMobile = windowWidth < 768;

  const menuItems = [
    { name: "Home", icon: <Home size={22} />, path: "/" },
    { name: "Interview Sessions", icon: <User size={22} />, path: "/interview" },
    { name: "CV / Resume", icon: <FileText size={22} />, path: "/resume" },
    { name: "Download Desktop App", icon: <Download size={22} />, path: "/download" },
    { name: "Email Support", icon: <Mail size={22} />, path: "/support" },
  ];

  return (
    <>
      {/* Mobile Backdrop - Only visible on mobile when sidebar is open */}
      {isMobile && (
        <div
          className={`
      fixed inset-0 bg-black/60 z-40 
      transition-opacity duration-300
      ${isMobileOpen ? "opacity-100 visible" : "opacity-0 invisible"}
    `}
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <motion.div
        initial={{ x: -300 }}
        animate={{
          width: isMobile ? 260 : isOpen ? 268 : 80,
          x: isMobile ? (isMobileOpen ? 0 : -260) : 0,
        }}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className={`
    h-screen theme-bg backdrop-blur-xl 
    border-r border-white/40 shadow-xl flex flex-col 
    ${isMobile ? "fixed z-50" : "md:static z-10"} 
  `}
      >

        {/* Collapse Button */}
        <button
          onClick={() => (isMobile ? setIsMobileOpen(false) : setIsOpen(!isOpen))}
          className="
     hidden  absolute top-0 -right-3 w-8 h-8 md:flex items-center justify-center 
      rounded-full glass shadow hover:scale-110 transition z-50
    "
        >
          {isMobile ? (
            <ChevronLeft size={20} />
          ) : isOpen ? (
            <ChevronLeft size={20} />
          ) : (
            <ChevronRight size={20} />
          )}
        </button>

        {/* ===== Header (Logo) - fixed at top ===== */}
        <div className="flex items-center gap-3 px-5 py-4  mt-2 flex-shrink-0">
          <div className="w-10 h-10 rounded-xl theme-primary shadow-lg" />
          {(isOpen || isMobileOpen) && (
            <h1 className="text-2xl font-extrabold theme-text">Intervue</h1>
          )}
        </div>

        {/* ===== Scrollable middle area (menu items + card) =====
      Use flex-1 + overflow-auto so this part scrolls independently.
      Add padding so top & bottom content don't hide behind header/footer. */}
        <div
          className="flex-1 px-3 pb-2 overflow-auto space-y-3 sidebar-scroll"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          <nav className="md:space-y-2 space-y-1 mb-2">
            {menuItems.map((item, index) => (
              <NavLink
                key={index}
                to={item.path}
                onClick={() => isMobile && setIsMobileOpen(false)}
                className={({ isActive }) =>
                  `
              relative group flex items-center gap-4 p-1 rounded-xl cursor-pointer
              backdrop-blur-md border border-gray-100 transition-all shadow-sm
              ${isActive ? "theme-primary text-white" : "text-gray-800 bg-white/60"}
            `
                }
              >
                <div className="w-10 h-10 flex items-center justify-center rounded-lg">
                  {item.icon}
                </div>

                {(isOpen || isMobile) && (
                  <span className="text-[15px] font-medium">{item.name}</span>
                )}

                {/* Tooltip */}
                {!isOpen && !isMobile && (
                  <span
                    className="
                absolute left-full ml-3 top-1/2 -translate-y-1/2
                whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium
                glass shadow-lg opacity-0 scale-95 transition-all duration-150
                group-hover:opacity-100 group-hover:scale-100
              "
                  >
                    {item.name}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>

          {/* INTERVIEW CREDIT CARD (still inside scroll area so it scrolls along with nav) */}
          {(isOpen || isMobile) && (
            <div className="px-0 mt-4">
              <div
                className="
            rounded-xl p-4 backdrop-blur-md 
            bg-white/60 border border-gray-100 shadow-sm
            hover:shadow-md transition-all group
          "
              >
                {/* Icon + Heading */}
                <div className="flex items-center gap-3">
                  <div className="
              w-10 h-10 flex items-center justify-center rounded-lg
              bg-indigo-100 text-theme-text  
              shadow-inner group-hover:scale-110 transition
            ">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h6m-6 4h8M5 20l2-2h10a2 2 0 002-2V6a2 2 0 00-2-2H7a2 2 0 00-2 2v14z" />
                    </svg>
                  </div>

                  <h3 className="text-[15px] font-semibold text-gray-800">Interview Credit</h3>
                </div>

                <p className="text-sm text-gray-600 mt-2">
                  You have <span className="font-semibold text-indigo-600">1.5</span> interview credits
                </p>

                <button
                  className="
              mt-3 w-full py-2 rounded-lg 
              theme-primary text-white font-semibold
              shadow-sm hover:shadow-md hover:scale-[1.01] transition
            "
                >
                  Get Credit
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ===== Footer / Profile - fixed at bottom ===== */}
        <div className="p-2 border-t border-white/40 flex-shrink-0">
          <NavLink
            to="/profile"
            onClick={() => isMobile && setIsMobileOpen(false)}
            className={({ isActive }) =>
              `
          flex items-center gap-3 p-2 rounded-xl backdrop-blur-md border shadow
          ${isActive ? "theme-primary text-white" : "bg-white/60 text-gray-800"}
        `
            }
          >
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center shadow-inner">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="7" r="4" />
                <path d="M4 21v-2a4 4 0 0 1 3-3.87" />
                <path d="M20 21v-2a4 4 0 0 0-3-3.87" />
              </svg>
            </div>

            {(isOpen || isMobileOpen) && (
              <div>
                <p className="font-semibold text-[15px]">Your Profile</p>
                <p className="text-xs opacity-80">Manage Account</p>
              </div>
            )}
          </NavLink>
        </div>
      </motion.div>


      <style>
        {`
 .sidebar-scroll {
  overflow-y: scroll !important;   /* keeps scrollbar always available */
  scrollbar-width: thin;
  scrollbar-gutter: stable;        /* prevents layout shifting */
  scrollbar-color: rgba(255,255,255,0.4) rgba(255,255,255,0.1);
}

/* Chrome / Edge / Safari */
.sidebar-scroll::-webkit-scrollbar {
  width: 10px; 
}

.sidebar-scroll::-webkit-scrollbar-track {
  background: rgba(255,255,255,0.08);
  backdrop-filter: blur(12px);
  border-radius: 12px;
}

.sidebar-scroll::-webkit-scrollbar-thumb {
  background: linear-gradient(
    180deg,
    rgba(99,102,241, 0.9),
    rgba(139,92,246, 0.9)
  );
  border-radius: 12px;
  box-shadow: 0 0 12px rgba(99,102,241, 0.6);
}

.sidebar-scroll::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(
    180deg,
    rgba(79,70,229, 1),
    rgba(124,58,237, 1)
  );
}

`}
      </style>


    </>


  );

}
