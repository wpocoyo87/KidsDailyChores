import mongoose from "mongoose";

const taskSchema = mongoose.Schema(
  {
    kid: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Kid",
    },
    date: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    image: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model("Task", taskSchema);

export default Task;
