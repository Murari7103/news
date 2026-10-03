const LiveStream = require("../models/LiveStream");

// ======================================================
// Helper: Generate Slug
// ======================================================

const generateSlug = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

// ======================================================
// Create Live Stream
// ======================================================

const createLiveStream = async (req, res) => {
  try {
    const {
      title,
      description,
      streamUrl,
      platform,
      thumbnail,
      startTime,
      endTime,
      status,
      isFeatured,
      isBreaking,
    } = req.body;

    // ------------------------------------------
    // Required field validation
    // ------------------------------------------

    if (!title || !streamUrl || !startTime) {
      return res.status(400).json({
        success: false,
        message: "Title, stream URL and start time are required",
      });
    }

    // ------------------------------------------
    // Generate slug
    // ------------------------------------------

    const slug = generateSlug(title);

    // ------------------------------------------
    // Check duplicate slug
    // ------------------------------------------

    const existingStream = await LiveStream.findOne({ slug });

    if (existingStream) {
      return res.status(409).json({
        success: false,
        message: "A live stream with this title already exists",
      });
    }

    // ------------------------------------------
    // Generate streamId
    // ------------------------------------------

    const lastStream = await LiveStream.findOne()
      .sort({ streamId: -1 })
      .select("streamId");

    const streamId = lastStream ? lastStream.streamId + 1 : 1;

    // ------------------------------------------
    // Create stream
    // ------------------------------------------

    const liveStream = await LiveStream.create({
      streamId,
      title,
      slug,
      description: description || "",
      streamUrl,
      platform: platform || "YouTube",
      thumbnail: thumbnail || "",
      startTime,
      endTime: endTime || null,
      status: status || "Scheduled",
      isFeatured: isFeatured || false,
      isBreaking: isBreaking || false,
      createdBy: req.user?._id,
    });

    // ------------------------------------------
    // Response
    // ------------------------------------------

    return res.status(201).json({
      success: true,
      message: "Live stream created successfully",
      data: liveStream,
    });
  } catch (error) {
    console.error("Create Live Stream Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create live stream",
      error: error.message,
    });
  }
};

// ======================================================
// Get All Live Streams
// ======================================================

const getAllLiveStreams = async (req, res) => {
  try {
    const liveStreams = await LiveStream.find()
      .populate("createdBy", "name email")
      .sort({ streamId: -1 });

    return res.status(200).json({
      success: true,
      count: liveStreams.length,
      data: liveStreams,
    });
  } catch (error) {
    console.error("Get Live Streams Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch live streams",
      error: error.message,
    });
  }
};

// ======================================================
// Get Live Stream By ID
// ======================================================

const getLiveStreamById = async (req, res) => {
  try {
    const { id } = req.params;

    const liveStream = await LiveStream.findOne({
      streamId: Number(id),
    }).populate("createdBy", "name email");

    if (!liveStream) {
      return res.status(404).json({
        success: false,
        message: "Live stream not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: liveStream,
    });
  } catch (error) {
    console.error("Get Live Stream Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch live stream",
      error: error.message,
    });
  }
};

// ======================================================
// Update Live Stream
// ======================================================

const updateLiveStream = async (req, res) => {
  try {
    const { id } = req.params;

    const liveStream = await LiveStream.findOne({
      streamId: Number(id),
    });

    if (!liveStream) {
      return res.status(404).json({
        success: false,
        message: "Live stream not found",
      });
    }

    const {
      title,
      description,
      streamUrl,
      platform,
      thumbnail,
      startTime,
      endTime,
      status,
      isFeatured,
      isBreaking,
    } = req.body;

    // ------------------------------------------
    // Update title + slug
    // ------------------------------------------

    if (title !== undefined && title !== liveStream.title) {
      const newSlug = generateSlug(title);

      const duplicateSlug = await LiveStream.findOne({
        slug: newSlug,
        _id: { $ne: liveStream._id },
      });

      if (duplicateSlug) {
        return res.status(409).json({
          success: false,
          message: "A live stream with this title already exists",
        });
      }

      liveStream.title = title;
      liveStream.slug = newSlug;
    }

    // ------------------------------------------
    // Update fields
    // ------------------------------------------

    if (description !== undefined) {
      liveStream.description = description;
    }

    if (streamUrl !== undefined) {
      liveStream.streamUrl = streamUrl;
    }

    if (platform !== undefined) {
      liveStream.platform = platform;
    }

    if (thumbnail !== undefined) {
      liveStream.thumbnail = thumbnail;
    }

    if (startTime !== undefined) {
      liveStream.startTime = startTime;
    }

    if (endTime !== undefined) {
      liveStream.endTime = endTime;
    }

    if (status !== undefined) {
      liveStream.status = status;
    }

    if (isFeatured !== undefined) {
      liveStream.isFeatured = isFeatured;
    }

    if (isBreaking !== undefined) {
      liveStream.isBreaking = isBreaking;
    }

    // ------------------------------------------
    // Save
    // ------------------------------------------

    await liveStream.save();

    return res.status(200).json({
      success: true,
      message: "Live stream updated successfully",
      data: liveStream,
    });
  } catch (error) {
    console.error("Update Live Stream Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update live stream",
      error: error.message,
    });
  }
};

// ======================================================
// Delete Live Stream
// ======================================================

const deleteLiveStream = async (req, res) => {
  try {
    const { id } = req.params;

    const liveStream = await LiveStream.findOne({
      streamId: Number(id),
    });

    if (!liveStream) {
      return res.status(404).json({
        success: false,
        message: "Live stream not found",
      });
    }

    await LiveStream.deleteOne({
      _id: liveStream._id,
    });

    return res.status(200).json({
      success: true,
      message: "Live stream deleted successfully",
    });
  } catch (error) {
    console.error("Delete Live Stream Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete live stream",
      error: error.message,
    });
  }
};

// ======================================================
// Export Controllers
// ======================================================

module.exports = {
  createLiveStream,
  getAllLiveStreams,
  getLiveStreamById,
  updateLiveStream,
  deleteLiveStream,
};
