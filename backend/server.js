import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import creatorRoutes from "./routes/creatorRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import enrollmentRoutes from "./routes/enrollmentRoutes.js";
import rateLimit from "express-rate-limit";

dotenv.config();
connectDB();

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: [
      "https://micro-courses-lms-delta.vercel.app",
    ],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

const courseLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60,
  message: {
    error: { code: "RATE_LIMIT", message: "Too many requests, please slow down." },
  },
});

app.get("/", (req, res) => {
  res.json({ message: "MicroCourses API is running 🚀" });
});

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

// Apply limiter only to specific routes
app.use("/api/creator", courseLimiter, creatorRoutes);
app.use("/api/courses", courseLimiter, courseRoutes);
app.use("/api/course", courseLimiter, enrollmentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
