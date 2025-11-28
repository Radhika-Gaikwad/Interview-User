import React, { useState } from "react";
import { motion } from "framer-motion";
import LogoutModal from "../../Components/LogoutModal";

import {
  User,
  Mail,
  Smartphone,
  Calendar,
  MapPin,
  Settings,
  Activity,
  Briefcase,
  Star,
  LogOut,
} from "lucide-react";

const Profile = () => {
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  return (
  <div className="theme-bg min-h-screen px-5 lg:px-10 relative pt-10">

<button
  onClick={() => setShowLogoutPopup(true)}
  className="
    absolute top-0 right-0 
    z-50
    flex items-center gap-2 px-4 py-2 rounded-xl 
    bg-red-100 text-red-700 font-semibold shadow-md 
    hover:bg-red-200 transition
  "
>
  <LogOut size={18} /> Logout
</button>

      {/* --- MAIN WRAPPER --- */}
      <div className="max-w-5xl mx-auto mt-3">

        {/* --- HEADER PROFILE CARD --- */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-card rounded-3xl shadow-lg p-8 flex flex-col md:flex-row gap-6"
        >
          {/* PROFILE IMAGE */}
          <div className="w-36 h-36 rounded-2xl bg-gray-200 overflow-hidden shadow">
            <img
              src="https://via.placeholder.com/150"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>

          {/* PROFILE MAIN INFO */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold theme-text">John Doe</h1>
            <p className="text-gray-600 text-lg flex items-center gap-2 mt-1">
              <Briefcase size={18} /> Senior Software Engineer
            </p>
            <p className="text-gray-500 flex items-center gap-2">
              <Mail size={18} /> johndoe@example.com
            </p>

            {/* STATS */}
            <div className="grid grid-cols-3 mt-5 text-center">
              <div>
                <p className="text-2xl font-bold text-gray-900">120</p>
                <p className="text-gray-500 text-sm">Projects</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">85</p>
                <p className="text-gray-500 text-sm">Clients</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-1">
                  <Star size={18} /> 4.9
                </p>
                <p className="text-gray-500 text-sm">Rating</p>
              </div>
            </div>

            {/* EDIT BUTTON */}
            <button className="mt-6 px-5 py-2 rounded-xl theme-primary text-white font-semibold shadow hover:shadow-xl transition">
              Edit Profile
            </button>
          </div>
        </motion.div>

        {/* --- 2 COLUMN GRID BELOW --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">

          {/* ABOUT ME */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="glass-card p-6 rounded-2xl shadow"
          >
            <h2 className="text-xl font-semibold theme-text mb-2">
              About Me
            </h2>
            <p className="text-gray-600 text-sm leading-6">
              Passionate software engineer with 6+ years of experience in
              building scalable apps. Specialized in React, Node.js, cloud
              architecture, and performance optimization.
            </p>

            <h3 className="mt-4 text-lg font-semibold theme-text">
              Skills
            </h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {["React", "Node.js", "MongoDB", "Tailwind CSS", "AWS", "Docker"].map(
                (skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 rounded-lg bg-gray-200 text-gray-700 text-sm"
                  >
                    {skill}
                  </span>
                )
              )}
            </div>
          </motion.div>

          {/* PERSONAL INFO */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="glass-card p-6 rounded-2xl shadow"
          >
            <h2 className="text-xl font-semibold theme-text mb-4">
              Personal Information
            </h2>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-700">
                <User size={20} /> <span>John Doe</span>
              </div>

              <div className="flex items-center gap-3 text-gray-700">
                <Mail size={20} /> <span>johndoe@example.com</span>
              </div>

              <div className="flex items-center gap-3 text-gray-700">
                <Smartphone size={20} /> <span>+91 9876543210</span>
              </div>

              <div className="flex items-center gap-3 text-gray-700">
                <Calendar size={20} /> <span>Joined: Jan 2020</span>
              </div>

              <div className="flex items-center gap-3 text-gray-700">
                <MapPin size={20} /> <span>Pune, India</span>
              </div>
            </div>
          </motion.div>

          {/* ACTIVITY TIMELINE */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="glass-card p-6 rounded-2xl shadow"
          >
            <h2 className="text-xl font-semibold theme-text mb-3">
              Recent Activity
            </h2>

            <div className="space-y-4 text-sm text-gray-600">
              <div className="flex gap-3">
                <Activity size={18} className="mt-1" />
                Completed project “CRM Dashboard UI”.
              </div>
              <div className="flex gap-3">
                <Activity size={18} className="mt-1" />
                Updated profile details.
              </div>
              <div className="flex gap-3">
                <Activity size={18} className="mt-1" />
                Added 2 new clients to portfolio.
              </div>
            </div>
          </motion.div>

          {/* ACCOUNT SETTINGS */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="glass-card p-6 rounded-2xl shadow"
          >
            <h2 className="text-xl font-semibold theme-text mb-3">
              Account Settings
            </h2>
            <div className="space-y-3 text-gray-700">
              <div className="flex items-center gap-3 cursor-pointer hover:text-themePrimary">
                <Settings size={20} /> Change Password
              </div>
              <div className="flex items-center gap-3 cursor-pointer hover:text-themePrimary">
                <Settings size={20} /> Privacy Settings
              </div>
              <div className="flex items-center gap-3 cursor-pointer hover:text-themePrimary">
                <Settings size={20} /> Notification Preferences
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* LOGOUT POPUP */}
      {showLogoutPopup && (
        <LogoutModal close={() => setShowLogoutPopup(false)} />
      )}
    </div>
  );
};

export default Profile;
