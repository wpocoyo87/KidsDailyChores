// server.js
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connectDB from "./config/dbConfig.js";
import { router as userRoutes } from "./routes/userRoutes.js"; // Menggunakan named import
import kidRoutes from "./routes/kidRoutes.js"; // Menggunakan default import

const app = express();
connectDB(); // Connect to MongoDB

// Allow requests from localhost:3000
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true, // enable set cookie with credentials
  })
);

app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/kids", kidRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
