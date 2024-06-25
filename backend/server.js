const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cors = require("cors");
require("dotenv").config(); // Load environment variables from .env file

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

const dbURI = process.env.MONGODB_URI; // Use the connection string from the .env file

mongoose
  .connect(dbURI, {})
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message);
  });

const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  kids: [
    {
      name: String,
      age: Number,
      selectedAvatar: String,
    },
  ],
});

const User = mongoose.model("User", UserSchema);

app.post("/api/users/register", async (req, res) => {
  try {
    const { username, email, password, kids } = req.body;
    const user = new User({ username, email, password, kids });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(400).json({ error: "Error registering user" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
