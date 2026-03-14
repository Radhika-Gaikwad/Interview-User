import React, { useState, useRef } from "react";
import { Coins } from "lucide-react";
import { Menu, LogOut, User } from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import Tooltip from "../Components/Tooltips.jsx";
import LogoutModal from "../Components/LogoutModal.jsx"




export default function Navbar({ setIsMobileOpen, openUpload, isMobileOpen, openSession }) {
  const location = useLocation();
  const [isSessionOpen, setIsSessionOpen] = useState(false);
  const getPageName = () => {
    const path = location.pathname;
    if (path === "/home") return "Home";
    if (path.includes("interview")) return "Interview Sessions";
    if (path.includes("resume")) return "CV / Resume";
    if (path.includes("download")) return "Download App";
    if (path.includes("support")) return "Email Support";
    return "Dashboard";
  };
const [showProfileMenu, setShowProfileMenu] = useState(false);
const [showLogout, setShowLogout] = useState(false);
const profileRef = useRef(null);
const navigate = useNavigate();

  // ✅ Check if user is on resume page
  const isResumePage = location.pathname.includes("resume");

  // ✅ New: check if on Buy Credit page
  const isBuyCreditPage =
    location.pathname === "/buy-credits" || location.pathname.includes("/buy-credits");

  return (
    <nav
      className="
        h-16 glass border-b shadow
        flex items-center justify-between
        px-4 md:px-6
        top-0 z-20
      "
    >
      {/* Mobile Menu Button - hide when mobile sidebar is open */}
      {!isMobileOpen && (
        <button
          className="md:hidden p-2 rounded-lg glass shadow"
          onClick={() => setIsMobileOpen(true)}
        >
          <Menu size={24} />
        </button>
      )}

      {/* Desktop Page Title */}
      {/* If it's the buy credit page we hide the regular title and show a custom centered label instead */}
      {!isBuyCreditPage ? (
        <h2
          className="
            hidden md:block
            text-lg sm:text-xl md:text-2xl 
            font-bold theme-text
          "
        >
          {getPageName()}
        </h2>
      ) : (
        <div className="hidden md:flex flex-col items-start md:items-center">
          <h2 className="text-lg sm:text-xl md:text-xl font-bold theme-text flex items-center gap-2">
            <Coins className="w-6 h-6 text-blue-700" />
            <span>Buy Interview Credits</span>
          </h2>
        </div>

      )}

      {/* Right Side Buttons */}
      {/* If on buycredit page we DO NOT show the right side buttons (or page name). */}
      <div className="flex items-center gap-2 sm:gap-3 md:gap-4 ml-auto">
        {isResumePage && !isBuyCreditPage && (
          <button
            onClick={openUpload} // ⬅ call parent
            className="px-4 py-1.5 rounded-xl theme-primary text-[15px]shadow-md hover:scale-105 transition"
          >
            Upload Resume
          </button>
        )}

        {!isResumePage && !isBuyCreditPage && (
          <>
            <button className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl glass text-gray-800 shadow hover:bg-white/80 hover:scale-105 transition font-medium text-sm sm:text-[15px]">
              Start Trial
            </button>

            <button
              onClick={openSession} // ⬅ trigger modal from Layout
              className="px-4 py-1.5 sm:px-5 sm:py-2 rounded-xl theme-primary shadow-md hover:scale-105 active:scale-95 transition font-semibold text-sm sm:text-[15px]"
            >
              Start Session
            </button>
          </>
        )}

<div ref={profileRef} className="relative">
  <button
    onClick={() => setShowProfileMenu((prev) => !prev)}
    className={`
      w-10 h-10 rounded-full
      flex items-center justify-center
      shadow-lg transition-all
      ${showProfileMenu
        ? "theme-primary scale-105 ring-2 ring-indigo-300"
        : "theme-secondary hover:scale-105"}
    `}
  >
    <User size={20} className="text-white" />
  </button>

  <Tooltip targetRef={profileRef} isVisible={showProfileMenu}>
    <div className="p-2 space-y-1">

      {/* Profile */}
      <button
        onClick={() => {
          navigate("/profile");
          setShowProfileMenu(false);
        }}
        className="
          w-full flex items-center gap-3
          px-3 py-2 rounded-xl
          hover:hover-faint-gradient transition
          text-sm font-medium
        "
      >
        <span className="
          w-8 h-8 rounded-lg flex items-center justify-center
          theme-secondary shadow-inner
        ">
          <User size={16} className="text-white" />
        </span>
        <span className="theme-text">Profile</span>
      </button>

      <div className="h-px bg-gray-200/60 my-1" />

      {/* Logout */}
      <button
        onClick={() => {
          setShowLogout(true);
          setShowProfileMenu(false);
        }}
        className="
          w-full flex items-center gap-3
          px-3 py-2 rounded-xl
          hover:bg-red-50 transition
          text-sm font-medium text-red-600
        "
      >
        <span className="
          w-8 h-8 rounded-lg flex items-center justify-center
          bg-red-100
        ">
          <LogOut size={16} className="text-red-600" />
        </span>
        Logout
      </button>

    </div>
  </Tooltip>
</div>


      </div>
{showLogout && (
  <LogoutModal close={() => setShowLogout(false)} />
)}

    </nav>
  );
}
