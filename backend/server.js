import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import connectDB from "./config/dbConfig.js";
import { config } from "./config/config.js";
import kidRoutes from "./routes/kidRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { errorHandler, notFound } from "./utils/errorHandler.js";
import dotenv from "dotenv";

// Load env vars
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

const app = express();
connectDB();

app.use(bodyParser.json());
app.use(express.json());

// Configure CORS
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (origin === 'https://kids-daily-chores.vercel.app' || origin === 'http://localhost:3000') {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

// Handle preflight requests for all routes
app.options('*', cors());

// Mount routes
app.use("/api/users", userRoutes);
app.use("/api/kids", kidRoutes);

app.use(notFound);
app.use(errorHandler);

console.log('NODE_ENV:', process.env.NODE_ENV);

app.get('/test-root', (req, res) => res.json({ msg: "Root OK" }));
app.get('/cors-test', (req, res) => res.json({ msg: "CORS OK" }));

app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`);
});
