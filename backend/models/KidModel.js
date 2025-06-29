import mongoose from "mongoose";
import bcrypt from "bcryptjs";

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
  // Kids authentication system
  kidPin: { type: String, default: null }, // 4-digit PIN for kids
  isActive: { type: Boolean, default: true },
  role: { type: String, enum: ['kid'], default: 'kid' },
  lastLogin: { type: Date, default: null },
  loginAttempts: { type: Number, default: 0 },
  lockedUntil: { type: Date, default: null },
});

// Methods for PIN authentication
kidSchema.methods.setKidPin = async function(pin) {
  const salt = await bcrypt.genSalt(10);
  this.kidPin = await bcrypt.hash(pin, salt);
};

kidSchema.methods.matchKidPin = async function(enteredPin) {
  if (!this.kidPin) return false;
  return await bcrypt.compare(enteredPin, this.kidPin);
};

kidSchema.methods.isLocked = function() {
  return !!(this.lockedUntil && this.lockedUntil > Date.now());
};

kidSchema.methods.incLoginAttempts = function() {
  // Reset attempts if lock has expired
  if (this.lockedUntil && this.lockedUntil < Date.now()) {
    return this.updateOne({
      $unset: { lockedUntil: 1 },
      $set: { loginAttempts: 1 }
    });
  }
  
  const updates = { $inc: { loginAttempts: 1 } };
  
  // Lock account after 5 failed attempts for 15 minutes
  if (this.loginAttempts + 1 >= 5 && !this.isLocked()) {
    updates.$set = { lockedUntil: Date.now() + 15 * 60 * 1000 }; // 15 minutes
  }
  
  return this.updateOne(updates);
};

kidSchema.methods.resetLoginAttempts = function() {
  return this.updateOne({
    $unset: { lockedUntil: 1, loginAttempts: 1 }
  });
};

const Kid = mongoose.model("Kid", kidSchema);

export default Kid;
