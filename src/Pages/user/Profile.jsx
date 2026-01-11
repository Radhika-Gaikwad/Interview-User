import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import LogoutModal from "../../Components/LogoutModal";
import { getProfile, updateProfile, logoutUser } from "../../Services/userService";
import { Mail, Briefcase, LogOut, Settings } from "lucide-react";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

 useEffect(() => {
  const fetchProfile = async () => {
    try {
      const data = await getProfile();

      if (!data) {
        console.warn("No profile data, user might not be logged in");
        return;
      }

      setProfile(data); // set profile safely
      setForm({
        fullName: data.fullName || "",
        role: data.role || "",
        resumeUrl: data.resumeUrl || "",
      });
    } catch (err) {
      console.error("Failed to load profile", err);
    } finally {
      setLoading(false);
    }
  };

  fetchProfile();
}, []);

  const handleUpdate = async () => {
    try {
      const updatedUser = await updateProfile(form);
      setUser(updatedUser);
      setEditMode(false);
    } catch {
      alert("Failed to update profile");
    }
  };

  if (loading) return <div className="theme-bg min-h-screen" />;

  return (
    <div className="theme-bg min-h-screen">

      {/* TOP ACTION BAR */}
      <div className="max-w-5xl mx-auto px-6 pt-8 flex justify-end">
        <button
          onClick={() => setShowLogoutPopup(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg theme-tertiary text-sm font-medium shadow hover:opacity-90"
        >
          <LogOut size={16} /> Logout
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* PROFILE CARD */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-8"
        >
          <div className="flex flex-col md:flex-row gap-6">

            {/* AVATAR */}
            <div className="relative">
              <img
                src="https://i.pravatar.cc/150?img=12"
                alt="Avatar"
                className="w-32 h-36 rounded-xl object-fill border-4 border-white shadow"
              />
              <div className="absolute inset-0 rounded-xl ring-2 ring-indigo-300/40" />
            </div>

            {/* INFO */}
            <div className="flex-1">
              {editMode ? (
                <input
                  value={form.fullName}
                  onChange={(e) =>
                    setForm({ ...form, fullName: e.target.value })
                  }
                  className="w-full text-lg font-semibold theme-text bg-transparent border-b border-gray-300 focus:outline-none"
                />
              ) : (
                <h1 className="text-lg font-semibold theme-text">
                  {user.fullName}
                </h1>
              )}

              {/* ROLE */}
              <div className="mt-2 flex items-center gap-2 text-gray-600 text-sm">
                <Briefcase size={16} />
                {editMode ? (
                  <select
                    value={form.role}
                    onChange={(e) =>
                      setForm({ ...form, role: e.target.value })
                    }
                    className="border rounded-md px-2 py-1 text-sm bg-white"
                  >
                    <option>Student</option>
                    <option>Job Seeker</option>
                    <option>Working Professional</option>
                    <option>HR / Recruiter</option>
                  </select>
                ) : (
                  <span>{user.role}</span>
                )}
              </div>

              {/* EMAIL */}
              <div className="mt-1 flex items-center gap-2 text-gray-500 text-sm">
                <Mail size={16} /> {user.email}
              </div>

              {/* ACTIONS */}
              <div className="mt-6 flex gap-3">
                {editMode ? (
                  <>
                    <button
                      onClick={handleUpdate}
                      className="px-4 py-2 rounded-lg theme-primary text-sm font-medium"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => setEditMode(false)}
                      className="px-4 py-2 rounded-lg bg-white/70 text-sm"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setEditMode(true)}
                    className="px-4 py-2 rounded-lg theme-primary text-sm font-medium"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* ACCOUNT SETTINGS */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-6 mt-8"
        >
          <h2 className="text-sm font-semibold text-gray-800 mb-4">
            Account Settings
          </h2>

          <div className="space-y-4 text-sm text-gray-700">
            <div className="flex items-center gap-3 cursor-pointer hover:text-indigo-600">
              <Settings size={18} /> Change Password
            </div>
            <div className="flex items-center gap-3 cursor-pointer hover:text-indigo-600">
              <Settings size={18} /> Privacy Settings
            </div>
          </div>
        </motion.div>
      </div>

      {/* LOGOUT MODAL */}
      {showLogoutPopup && (
        <LogoutModal
          close={() => setShowLogoutPopup(false)}
          onConfirm={() => {
            logoutUser();
            window.location.href = "/login";
          }}
        />
      )}
    </div>
  );
};

export default Profile;
