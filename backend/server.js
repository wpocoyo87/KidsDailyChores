import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import connectDB from "./config/dbConfig.js";
import { config } from "./config/config.js";
import kidRoutes from "./routes/kidRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import rewardImageRoutes from "./routes/rewardImageRoutes.js";
import { errorHandler, notFound } from "./utils/errorHandler.js";
import dotenv from "dotenv";

// Load env vars
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

const app = express();
connectDB();

const allowedOrigins = [
  "https://kids-daily-chores.vercel.app",
  "https://kids-daily-chores-git-safwan-khatys-projects.vercel.app",
  "https://kids-daily-chores-git-kty-win-repair-khatys-projects.vercel.app",
  "http://localhost:3000",
];

app.use(bodyParser.json());
app.use(express.json());

// Configure CORS
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    console.error("Blocked by CORS:", origin);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
};

app.use(cors(corsOptions));
// Handle preflight requests for all routes with same options
app.options("*", cors(corsOptions));
// For debugging only: allow all origins (uncomment if needed)
// app.use(cors());
// app.options("*", cors());

// Mount routes
app.use("/api/users", userRoutes);
app.use("/api/kids", kidRoutes);
app.use("/api/reward-image", rewardImageRoutes);

app.use(notFound);
app.use(errorHandler);

console.log("NODE_ENV:", process.env.NODE_ENV);

app.get("/test-root", (req, res) => res.json({ msg: "Root OK" }));
app.get("/cors-test", (req, res) => res.json({ msg: "CORS OK" }));

app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`);
});
