import api from "./api";

export const createCategory = async (data) => {
  const response = await api.post("/category/create", data);

  return response.data;
};
export const getCategories = async () => {
  const response = await api.get("/category");
  return response.data;
};
export const deleteCategory = async (id) => {
  const response = await api.delete(
    `/category/${id}`
  );
  return response.data;
};

export const getCategoryById = async (id) => {
  const response = await api.get(`/category/${id}`);
  return response.data;
};

export const updatedCategory = async (id, data) => {
  const response = await api.put(
    `/category/${id}`,
    data
  );
  return response.data;
};