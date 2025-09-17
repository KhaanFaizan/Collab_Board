const mongoose = require("mongoose");

const chatMessageSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Index for better query performance
chatMessageSchema.index({ projectId: 1, timestamp: -1 });
chatMessageSchema.index({ senderId: 1 });

module.exports = mongoose.model("ChatMessage", chatMessageSchema);
