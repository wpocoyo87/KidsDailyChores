import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import connectDB from "./config/dbConfig.js";
import kidRoutes from "./routes/kidRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { errorHandler, notFound } from "./utils/errorHandler.js";

dotenv.config();

const app = express();
connectDB();

app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

// Configure CORS to allow requests from your frontend domain
app.use(
  cors({
    origin: "http://localhost:3000", // Adjust the origin as per your frontend URL
    credentials: true,
  })
);

// Mount routes
app.use("/api/users", userRoutes);
app.use("/api/kids", kidRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
