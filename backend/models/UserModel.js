import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const kidSchema = new mongoose.Schema({
  name: { type: String, required: true },
  birthDate: { type: Date, required: true },
  gender: { type: String, required: true },
  selectedAvatar: { type: String, required: true },
  age: { type: Number, required: true },
  points: { type: Number, default: 0 },
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
  parent: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  kids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Kid' }],
  role: { type: String, enum: ['parent'], default: 'parent' },
  isActive: { type: Boolean, default: true },
});

// Encrypt password before saving user
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    console.log("Hashed password during save:", this.password);

    return next();
  } catch (error) {
    return next(error);
  }
});

// Method to compare entered password with stored encrypted password
userSchema.methods.matchPassword = async function (enteredPassword) {
  console.log(
    `Comparing entered password: ${enteredPassword} with stored password: ${this.password}`
  );
  const isMatch = await bcrypt.compare(enteredPassword, this.password);
  console.log(`Password match result: ${isMatch}`);
  return isMatch;
};

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
