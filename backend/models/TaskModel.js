// models/Task.js

import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
  name: { type: String, required: true },
  completed: { type: Boolean, default: false },
  // tambahkan butiran lain seperti tarikh, id pengguna, dsb.
});

const Task = mongoose.model("Task", TaskSchema);

export default Task;
