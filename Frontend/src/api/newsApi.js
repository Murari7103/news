import api from "./axios";

// =============================
// GET ALL NEWS
// =============================
export const getAllNews = async () => {
  const response = await api.get("/news");

  return response.data;
};

// =============================
// GET SINGLE NEWS
// =============================
export const getNewsById = async (newsId) => {
  const response = await api.get(`/news/${newsId}`);

  return response.data;
};

// =============================
// CREATE NEWS
// =============================
export const createNews = async (data) => {
  const response = await api.post("/news", data);

  return response.data;
};

// =============================
// UPDATE NEWS
// =============================
export const updateNews = async (newsId, data) => {
  const response = await api.put(`/news/${newsId}`, data);

  return response.data;
};

// =============================
// DELETE NEWS
// =============================
export const deleteNews = async (newsId) => {
  const response = await api.delete(`/news/${newsId}`);

  return response.data;
};

// =============================
// GET BREAKING NEWS
// =============================
export const getBreakingNews = async (
  status = "active"
) => {
  const response = await api.get(
    `/news/breaking?status=${status}`
  );

  return response.data;
};