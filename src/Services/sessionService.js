// sessionService.js
import api from "../utils/axiosInstance";

export const createSession = async (payload) => {
  const { data } = await api.post("/sessions", payload);
  return data;
};

export const listSessions = async (page = 1, limit = 6, query = "", company = "", status = "all", sort = "newest") => {
  const { data } = await api.get("/sessions", {
    params: { page, limit, q: query, company, status, sort },
  });

  return data; // {data, page, total, totalPages}
};

export const getSession = async (id) => {
  const { data } = await api.get(`/sessions/${id}`);
  return data;
};

export const updateSession = async (id, payload) => {
  const { data } = await api.put(`/sessions/${id}`, payload);
  return data;
};

export const deleteSession = async (id) => {
  const { data } = await api.delete(`/sessions/${id}`);
  return data;
};

export const connectSession = async (id, payload = {}) => {
  const { data } = await api.post(`/sessions/${id}/connect`, payload);
  return data;
};

export const endSession = async (id, endAt) => {
  const { data } = await api.post(`/sessions/${id}/end`, { endAt });
  return data;
};
export const duplicateSession = async (id) => {
  const res = await api.post(`/sessions/${id}/duplicate`);
  return res.data;
};

export default {
  createSession,
  listSessions,
  getSession,
  updateSession,
  deleteSession,
  connectSession,
  endSession,
  duplicateSession,
};