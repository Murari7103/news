import api from "./axios";

// =============================
// GET ALL TAGS
// =============================
export const getAllTags = async () => {
  const response = await api.get("/tag");

  return response.data;
};

// =============================
// GET SINGLE TAG
// =============================
export const getTagById = async (tagId) => {
  const response = await api.get(`/tag/${tagId}`);

  return response.data;
};

// =============================
// CREATE TAG
// =============================
export const createTag = async (data) => {
  const response = await api.post("/tag/create", data);

  return response.data;
};

// =============================
// UPDATE TAG
// =============================
export const updateTag = async (tagId, data) => {
  const response = await api.put(`/tag/${tagId}`, data);

  return response.data;
};

// =============================
// DELETE TAG
// =============================
export const deleteTag = async (tagId) => {
  const response = await api.delete(`/tag/${tagId}`);

  return response.data;
};
