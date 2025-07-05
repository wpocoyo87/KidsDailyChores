import mongoose from "mongoose";

const rewardImageSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true,
    trim: true,
  },
  kidId: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    required: true,
    enum: ["daily", "weekly", "monthly"],
    default: "daily",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field before saving
rewardImageSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Create compound index for kidId and type to ensure uniqueness
rewardImageSchema.index({ kidId: 1, type: 1 }, { unique: true });

export default mongoose.model("RewardImage", rewardImageSchema);
