import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import connectDB from "./config/dbConfig.js";
import { config } from "./config/config.js";
import kidRoutes from "./routes/kidRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { errorHandler, notFound } from "./utils/errorHandler.js";

const app = express();
connectDB();

app.use(bodyParser.json());
app.use(express.json());

// Configure CORS
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://kids-daily-chores.vercel.app'] // Ganti dengan domain Vercel anda
    : ['http://localhost:3000'],
  credentials: true,
}));

// Mount routes
app.use("/api/users", userRoutes);
app.use("/api/kids", kidRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`);
});
