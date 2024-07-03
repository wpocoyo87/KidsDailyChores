import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const kidSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  selectedAvatar: { type: String, required: true },
  points: { type: Number, default: 0 },
});

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  kids: [kidSchema],
});

// Encrypt password before saving user
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (error) {
    return next(error);
  }
});

// Method to compare entered password with stored encrypted password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Check if the model is already defined before creating it
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
