// models/kidModel.js

import mongoose from "mongoose";

const kidSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  selectedAvatar: {
    type: String,
    default: "/images/default-avatar.png",
  },
  birthDate: {
    type: Date,
    required: true,
  },
  tasks: [
    {
      description: String,
      image: String,
      date: Date,
    },
  ],
});

const Kid = mongoose.model("Kid", kidSchema);

export default Kid;
