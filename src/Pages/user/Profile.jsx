import React, { useEffect, useState } from "react";
import LogoutModal from "../../Components/LogoutModal";
import { getProfile, updateProfile, logoutUser } from "../../Services/userService";
import { Mail, Briefcase, LogOut, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ChangePasswordModal from "../../Components/ChangePasswordModal";
import AILoader from "../../Components/AILoader";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";

const Profile = () => {
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const navigate = useNavigate();
  const [showChangePassword, setShowChangePassword] = useState(false);
  const queryClient = useQueryClient();

  // 🔥 OPTIMIZATION 1: Cache the profile for 10 minutes to prevent layout thrashing
  const { data: profile, isLoading: loading } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
    staleTime: 10 * 60 * 1000,
  });

  useEffect(() => {
    if (profile) {
      setForm({
        fullName: profile.fullName || "",
        role: profile.role || "",
        resumeUrl: profile.resumeUrl || "",
      });
    } else if (!loading) {
      // Only navigate away if it's explicitly not loading and no profile exists
      navigate("/login", { replace: true });
    }
  }, [profile, loading, navigate]);

  // 🔥 OPTIMIZATION 2: Optimistic updates
  const { mutate: updateProfileMutation } = useMutation({
    mutationFn: updateProfile,
    onMutate: async (newProfileData) => {
      // Cancel any outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: ['profile'] });

      const previousProfile = queryClient.getQueryData(['profile']);

      // Optimistically update the cache with the new form data
      queryClient.setQueryData(['profile'], (old) => ({
        ...old,
        ...newProfileData
      }));

      setEditMode(false);
      return { previousProfile };
    },
    onError: (err, newProfileData, context) => {
      // If the mutation fails, roll back to the previous profile state
      queryClient.setQueryData(['profile'], context.previousProfile);
      alert("Failed to update profile");
      setEditMode(true);
    },
    onSettled: () => {
      // Sync with server quietly in the background
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });

  const handleUpdate = () => {
    updateProfileMutation(form);
  };

  // Only show the hard loader on the initial fetch, not background refetches
  if (loading && !profile) return <AILoader text="Loading Profile..." />;

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
                  {profile?.fullName}
                </h1>
              )}

              {/* ROLE - FIXED DOM NESTING */}
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
                    <option value="Student">Student</option>
                    <option value="Job Seeker">Job Seeker</option>
                    <option value="Working Professional">Working Professional</option>
                    <option value="HR / Recruiter">HR / Recruiter</option>
                  </select>
                ) : (
                  <span>{profile?.role}</span>
                )}
              </div>

              {/* EMAIL */}
              <div className="mt-1 flex items-center gap-2 text-gray-500 text-sm">
                <Mail size={16} /> {profile?.email}
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
                      onClick={() => {
                        setEditMode(false);
                        setForm({
                          fullName: profile?.fullName || "",
                          role: profile?.role || "",
                          resumeUrl: profile?.resumeUrl || "",
                        });
                      }}
                      className="px-4 py-2 rounded-lg bg-white/70 text-sm hover:bg-white"
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
              <div className="mt-3 text-sm text-gray-700">
                <strong>Interview Credits:</strong> <span className="text-indigo-600">{profile?.credits ?? 0}</span>
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
            <div
              onClick={() => setShowChangePassword(true)}
              className="flex items-center gap-3 cursor-pointer hover:text-indigo-600 w-fit"
            >
              <Settings size={18} /> Change Password
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

      {/* CHANGE PASSWORD MODAL */}
      {showChangePassword && (
        <ChangePasswordModal
          onClose={() => setShowChangePassword(false)}
        />
      )}
    </div>
  );
};

export default Profile;