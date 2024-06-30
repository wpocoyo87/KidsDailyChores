import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connectDB from "./config/dbConfig.js"; // Assuming this handles MongoDB connection
import { protect } from "./middlewares/authMiddleware.js";

import { router as kidRoutes } from "./routes/kidRoutes.js"; // Import kidRoutes
import { getPointsByKidId } from "./controllers/pointsController.js";
import userRoutes from "./routes/userRoutes.js"; // Corrected import path
import taskRoutes from "./routes/taskRoutes.js";

const app = express();
connectDB(); // Connect to MongoDB

// Allow requests from localhost:3000
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true, // enable set cookie with credentials
  })
);

app.use(express.json()); // Middleware to parse JSON requests
app.use("/api/users", userRoutes); // Mount userRoutes at /api/users
app.use("/api/kids", kidRoutes); // Mount kidRoutes at /api/kids with protect middleware
app.use("/api/tasks", taskRoutes); // Mount taskRoutes at /api/tasks with protect middleware
app.get("/api/kids/:kidId/points", protect, getPointsByKidId); // Endpoint for getting points by kidId

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
