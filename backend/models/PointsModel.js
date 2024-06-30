//backend/models/PointsModel.js

import mongoose from "mongoose";

const pointsSchema = new mongoose.Schema({
  kidId: { type: mongoose.Schema.Types.ObjectId, ref: "Kid", required: true },
  points: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});

const PointsModel = mongoose.model("Points", pointsSchema);

export default PointsModel;
