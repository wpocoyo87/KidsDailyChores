import PointsModel from "../models/PointsModel.js";

export const getPointsByKidId = async (req, res) => {
  try {
    const { kidId } = req.params;
    const pointsData = await PointsModel.find({ kidId });

    if (!pointsData || pointsData.length === 0) {
      res
        .status(200)
        .json({ message: "No points found for this kid", points: [] });
    } else {
      res.status(200).json(pointsData);
    }
  } catch (err) {
    console.error("Error fetching points data:", err);
    res.status(500).json({ message: "Server error" });
  }
};
