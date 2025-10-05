import express from "express";
import {
  enrollCourse,
  updateProgress,
  getProgress,
} from "../controllers/enrollmentControlelr.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/* --------------------------------
   Enroll in a course
   POST /api/enroll
   Access: Learner (authenticated)
-------------------------------- */
router.post("/enroll", protect, enrollCourse);

/* --------------------------------
   Update progress / mark lesson complete
   POST /api/progress
   Access: Learner (authenticated)
-------------------------------- */
router.post("/progress", protect, updateProgress);

/* --------------------------------
   Get learner progress for a course
   GET /api/progress/:courseId
   Access: Learner (authenticated)
-------------------------------- */
router.get("/progress/:courseId", protect, getProgress);

export default router;
