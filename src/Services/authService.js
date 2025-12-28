import axiosInstance from "../utils/axiosInstance";

/* ================= LOCAL AUTH ================= */

export const signupApi = (payload) => {
  return axiosInstance.post("/auth/signup", payload);
};

export const loginApi = (payload) => {
  return axiosInstance.post("/auth/login", payload);
};

export const getMeApi = () => {
  return axiosInstance.get("/auth/me");
};

/* ================= SOCIAL AUTH ================= */

/**
 * PRODUCTION STYLE:
 * Redirect browser to backend OAuth endpoint
 * Backend -> Provider -> Backend callback -> Frontend callback
 */
export const startSocialLogin = (provider) => {
  const redirectUrl = `${window.location.origin}/auth/callback`;
  window.location.href = `${
    axiosInstance.defaults.baseURL
  }/auth/${provider}?redirect_url=${encodeURIComponent(redirectUrl)}`;
};
