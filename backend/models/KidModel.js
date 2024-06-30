// backend/models/kidModel.js

import mongoose from "mongoose";

const kidSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  selectedAvatar: { type: String, required: true },
  tasks: [
    {
      description: { type: String, required: true },
      image: { type: String },
      date: { type: Date, default: Date.now },
      completed: { type: Boolean, default: false },
    },
  ],
});

const Kid = mongoose.model("Kid", kidSchema);

export default Kid;
