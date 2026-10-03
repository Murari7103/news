const mongoose = require("mongoose");

const liveStreamSchema = new mongoose.Schema(
  {
    streamId: {
      type: Number,
      unique: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    streamUrl: {
      type: String,
      required: true,
      trim: true,
    },

    platform: {
      type: String,
      enum: ["YouTube", "Facebook", "Other"],
      default: "YouTube",
      required: true,
    },

    thumbnail: {
      type: String,
      default: "",
    },

    startTime: {
      type: Date,
      required: true,
    },

    endTime: {
      type: Date,
      default: null,
    },

    status: {
      type: String,
      enum: ["Scheduled", "Live", "Ended"],
      default: "Scheduled",
      required: true,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    isBreaking: {
      type: Boolean,
      default: false,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("LiveStream", liveStreamSchema);
