// routes/lessonRoutes.js
import express from "express";
import {
  getLessonById,
  markLessonCompleted,
} from "../controllers/lessonController.js";

const router = express.Router();

router.get("/:id", getLessonById);
router.post("/:id/complete", markLessonCompleted);

export default router;
