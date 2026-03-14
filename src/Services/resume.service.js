import axiosInstance from "../utils/axiosInstance"; // your existing axios instance

// Create resume
export const createResumeService = (payload) => {
  return axiosInstance.post("/resume", payload);
};

// Get all resumes
export const getResumesService = (page = 1, limit = 6) => {
  return axiosInstance.get("/resume", {
    params: { page, limit },
  });
};
// Delete resume
export const deleteResumeService = (id) => {
  return axiosInstance.delete(`/resume/${id}`);
};