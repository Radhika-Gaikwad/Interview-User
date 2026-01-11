import api from "../utils/axiosInstance";

export const getProfile = async () => {
  try {
    const res = await api.get("/users/me");
    console.log("Profile:", res.data);
    return res.data.user; // or res.data depending on your API
  } catch (err) {
    console.log("Error fetching profile:", err.response?.status, err.response?.data);
    return null; // return null if fetch fails
  }
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
