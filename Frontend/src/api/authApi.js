import api from "./axios";

// Authentication
export const login = (data) => api.post("/auth/login", data);

export const register = (data) => api.post("/auth/register", data);

export const forgotPassword = (email) =>
  api.post("/auth/forgot-password", { email });

export const resetPassword = (data) => api.post("/auth/reset-password", data);

export const logout = () => api.post("/auth/logout");

// Profile
export const getProfile = () => api.get("/auth/profile");

export const updateProfile = (data) => api.put("/auth/profile", data);

export const changePassword = (data) => api.put("/auth/change-password", data);
