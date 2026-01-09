import api from "../utils/axiosInstance";

// Get logged-in user profile
export const getProfile = async () => {
  const res = await api.get("/users/me");
  return res.data.user;
};

// Update logged-in user profile
export const updateProfile = async (payload) => {
  const res = await api.put("/users/me", payload);
  return res.data.user;
};

// Logout
export const logoutUser = async () => {
  localStorage.removeItem("token");
};
