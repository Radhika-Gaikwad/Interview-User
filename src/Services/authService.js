import axiosInstance from "../utils/axiosInstance";

export const signupUser = async (payload) => {
  const { data } = await axiosInstance.post("/auth/signup", payload);
  return data;
};

export const loginUser = async (payload) => {
  const { data } = await axiosInstance.post("/auth/login", payload);
  return data;
};

export const socialLogin = async (payload) => {
  const { data } = await axiosInstance.post("/auth/social", payload);
  return data;
};
