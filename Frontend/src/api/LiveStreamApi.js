import api from "./axios";

// ==========================================
// Get All Live Streams
// ==========================================

export const getAllLiveStreams = async () => {
  const response = await api.get("/live-streams");
  return response.data;
};

// ==========================================
// Get Live Stream By ID
// ==========================================

export const getLiveStreamById = async (streamId) => {
  const response = await api.get(`/live-streams/${streamId}`);
  return response.data;
};

// ==========================================
// Create Live Stream
// ==========================================

export const createLiveStream = async (data) => {
  const response = await api.post("/live-streams", data);
  return response.data;
};

// ==========================================
// Update Live Stream
// ==========================================

export const updateLiveStream = async (streamId, data) => {
  const response = await api.put(`/live-streams/${streamId}`, data);
  return response.data;
};

// ==========================================
// Delete Live Stream
// ==========================================

export const deleteLiveStream = async (streamId) => {
  const response = await api.delete(`/live-streams/${streamId}`);
  return response.data;
};
