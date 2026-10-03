const express = require("express");

const {
  createLiveStream,
  getAllLiveStreams,
  getLiveStreamById,
  updateLiveStream,
  deleteLiveStream,
} = require("../controllers/LiveStreamController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ======================================================
// Live Stream Routes
// ======================================================

// Create Live Stream
router.post("/", authMiddleware, createLiveStream);

// Get All Live Streams
router.get("/", getAllLiveStreams);

// Get Single Live Stream
router.get("/:id", getLiveStreamById);

// Update Live Stream
router.put("/:id", authMiddleware, updateLiveStream);

// Delete Live Stream
router.delete("/:id", authMiddleware, deleteLiveStream);

module.exports = router;
