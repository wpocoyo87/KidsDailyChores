import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  description: { type: String, required: true },
  image: { type: String, required: true },
  date: { type: String, required: true },
  completed: { type: Boolean, default: false },
});

const kidSchema = new mongoose.Schema({
  name: { type: String, required: true },
  birthDate: { type: Date, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  selectedAvatar: { type: String, required: true },
  points: { type: Number, default: 0 },
  parent: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  tasks: [taskSchema],
});

const Kid = mongoose.model("Kid", kidSchema);

export default Kid;
