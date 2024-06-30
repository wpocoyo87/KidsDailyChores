// backend/models/TaskModel.js

import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  kidId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Kid",
    required: true,
  },
  description: { type: String, required: true },
  image: { type: String },
  date: { type: Date, default: Date.now },
  completed: { type: Boolean, default: false },
});

const Task = mongoose.model("Task", taskSchema);

export default Task;
