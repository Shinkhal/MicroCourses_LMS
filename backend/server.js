import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import creatorRoutes from "./routes/creatorRoutes.js";
import rateLimit from "express-rate-limit";

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

app.use(
  rateLimit({
    windowMs: 60 * 1000,
    max: 60,
    handler: (req, res) => res.status(429).json({ error: { code: "RATE_LIMIT" } }),
  })
);

// Test Route
app.get("/", (req, res) => {
  res.json({ message: "MicroCourses API is running 🚀" });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/creator", creatorRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
