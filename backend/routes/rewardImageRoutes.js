import express from "express";
const router = express.Router();
import RewardImage from "../models/RewardImageModel.js";

// GET reward image for a kid
router.get("/", async (req, res) => {
  try {
    const { kidId, type } = req.query;

    if (!kidId || !type) {
      return res.status(400).json({
        success: false,
        message: "kidId and type are required",
      });
    }

    const rewardImage = await RewardImage.findOne({ kidId, type });

    if (!rewardImage) {
      return res.status(404).json({
        success: false,
        message: "No reward image found",
      });
    }

    res.json({
      success: true,
      imageUrl: rewardImage.imageUrl,
    });
  } catch (error) {
    console.error("Error fetching reward image:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// POST new reward image
router.post("/", async (req, res) => {
  try {
    const { imageUrl, kidId, type } = req.body;

    if (!imageUrl || !kidId || !type) {
      return res.status(400).json({
        success: false,
        message: "imageUrl, kidId, and type are required",
      });
    }

    // Check if reward image already exists for this kid and type
    let rewardImage = await RewardImage.findOne({ kidId, type });

    if (rewardImage) {
      // Update existing reward image
      rewardImage.imageUrl = imageUrl;
      await rewardImage.save();
    } else {
      // Create new reward image
      rewardImage = new RewardImage({
        imageUrl,
        kidId,
        type,
      });
      await rewardImage.save();
    }

    res.json({
      success: true,
      message: "Reward image saved successfully",
      imageUrl: rewardImage.imageUrl,
    });
  } catch (error) {
    console.error("Error saving reward image:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// DELETE reward image
router.delete("/", async (req, res) => {
  try {
    const { kidId, type } = req.body;

    if (!kidId || !type) {
      return res.status(400).json({
        success: false,
        message: "kidId and type are required",
      });
    }

    const rewardImage = await RewardImage.findOneAndDelete({ kidId, type });

    if (!rewardImage) {
      return res.status(404).json({
        success: false,
        message: "No reward image found to delete",
      });
    }

    res.json({
      success: true,
      message: "Reward image deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting reward image:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

export default router;
