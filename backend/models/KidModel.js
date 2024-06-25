const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const kidSchema = new Schema({
  name: String,
  avatar: String,
  stars: { type: Number, default: 0 },
  tasks: [{ type: Schema.Types.ObjectId, ref: "Task" }],
});

module.exports = mongoose.model("Kid", kidSchema);
